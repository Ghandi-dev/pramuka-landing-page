import { hashPassword } from "~~/server/utils/hash";
import { sendMail } from "~~/server/utils/mailer";
import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { generateRandomToken } from "~~/server/utils/token";
import { verifyToken } from "~~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password, role, avatar_url } = body;
  const config = useRuntimeConfig();

  // 1. Validate
  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nama, email, dan password wajib diisi.",
    });
  }

  const supabase = useSupabaseAdmin();

  // --- Authorization Check ---
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const authToken = authHeader.split(" ")[1];
  if (!authToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak ditemukan",
    });
  }

  try {
    const decoded = verifyToken(authToken) as any;
    if (decoded.role !== "admin") {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Hanya admin yang dapat menambahkan user",
      });
    }
  } catch (err: any) {
    if (err.statusCode === 403) throw err;
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak valid",
    });
  }
  // ---------------------------

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email sudah terdaftar.",
    });
  }

  let createdUserId: string | null = null;

  try {
    // 2. Hash password
    const passwordHash = await hashPassword(password);

    // 3. Insert into users
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (userError || !user) {
      console.error("User creation error:", userError);
      throw createError({
        statusCode: 500,
        statusMessage: "Gagal membuat akun.",
      });
    }

    createdUserId = user.id;

    // 4. Insert into profiles (using same ID)
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      name,
      email,
      role: role || "admin",
      avatar_url: avatar_url || null,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw createError({
        statusCode: 500,
        statusMessage: "Gagal membuat profil.",
      });
    }

    // 5. Generate verification token
    const verificationToken = generateRandomToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // 6. Store token
    const { error: tokenError } = await supabase
      .from("email_verifications")
      .insert({
        user_id: user.id,
        token: verificationToken,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Token creation error:", tokenError);
      throw createError({
        statusCode: 500,
        statusMessage: "Gagal membuat token verifikasi.",
      });
    }

    // 7. Send verification email
    const verificationLink = `${config.public.siteUrl}/auth/verify-email?token=${verificationToken}`;
    const html = `
          <h1>Verifikasi Email Anda</h1>
          <p>Halo ${name},</p>
          <p>Terima kasih telah mendaftar. Silakan klik tautan di bawah ini untuk memverifikasi email Anda:</p>
          <a href="${verificationLink}">${verificationLink}</a>
          <p>Tautan ini akan kedaluwarsa dalam 24 jam.</p>
      `;

    await sendMail(email, "Verifikasi Email - Pramuka SMAN 1 Pasawahan", html);

    return {
      message: "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
    };
  } catch (error: any) {
    // ROLLBACK: If anything fails after user creation, delete the user
    if (createdUserId) {
      await supabase.from("users").delete().eq("id", createdUserId);
    }

    // Re-throw the error
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Terjadi kesalahan saat pendaftaran.",
    });
  }
});
