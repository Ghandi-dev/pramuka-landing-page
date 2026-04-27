import { sendMail } from "~~/server/utils/mailer";
import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { generateRandomToken } from "~~/server/utils/token";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;
  const config = useRuntimeConfig();

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email wajib diisi.",
    });
  }

  const supabase = useSupabaseAdmin();

  // 1. Find user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (userError || !user) {
    // Silently return success to avoid email enumeration
    return {
      message: "Jika email terdaftar, instruksi verifikasi telah dikirim.",
    };
  }

  // 2. Check if already verified
  if (user.email_verified) {
    return { message: "Email sudah diverifikasi." };
  }

  // 3. Delete old tokens
  await supabase.from("email_verifications").delete().eq("user_id", user.id);

  // 4. Generate new token
  const token = generateRandomToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await supabase.from("email_verifications").insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  // 5. Send email
  const verificationLink = `${config.public.siteUrl}/verify-email?token=${token}`;
  const html = `
        <h1>Verifikasi Email Anda</h1>
        <p>Silakan klik tautan di bawah ini untuk memverifikasi email Anda:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>Tautan ini akan kedaluwarsa dalam 24 jam.</p>
    `;

  await sendMail(email, "Verifikasi Email - Pramuka SMAN 1 Pasawahan", html);

  return {
    message: "Instruksi verifikasi telah dikirim ke email Anda.",
  };
});
