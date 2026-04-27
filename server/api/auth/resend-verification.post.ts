import { sendMail } from "~~/server/utils/mailer";
import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";
import { generateRandomToken } from "~~/server/utils/token";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, token: oldToken } = body;
  const config = useRuntimeConfig();

  if (!email && !oldToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email atau token wajib diisi.",
    });
  }

  const supabase = useSupabaseAdmin();
  let userEmail = email;
  let userId = null;

  // 1. Find user
  if (oldToken) {
    const { data: verification } = await supabase
      .from("email_verifications")
      .select("user_id, users(email)")
      .eq("token", oldToken)
      .single();

    if (verification) {
      userId = verification.user_id;
      userEmail = (verification.users as any).email;
    }
  }

  if (!userEmail) {
    const { data: user } = await supabase
      .from("users")
      .select("id, email, email_verified")
      .eq("email", email)
      .single();

    if (user) {
      userId = user.id;
      userEmail = user.email;
    }
  }

  if (!userId || !userEmail) {
    // Silently return success to avoid email enumeration
    return {
      message: "Jika akun terdaftar, instruksi verifikasi telah dikirim.",
    };
  }

  // 2. Check if already verified
  const { data: userData } = await supabase.from('users').select('email_verified').eq('id', userId).single();
  if (userData?.email_verified) {
    return { message: "Email sudah diverifikasi." };
  }

  // 3. Delete old tokens
  await supabase.from("email_verifications").delete().eq("user_id", userId);

  // 4. Generate new token
  const newToken = generateRandomToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await supabase.from("email_verifications").insert({
    user_id: userId,
    token: newToken,
    expires_at: expiresAt.toISOString(),
  });

  // 5. Send email
  const verificationLink = `${config.public.siteUrl}/auth/verify-email?token=${newToken}`;
  const html = `
        <h1>Verifikasi Email Anda</h1>
        <p>Silakan klik tautan di bawah ini untuk memverifikasi email Anda:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>Tautan ini akan kedaluwarsa dalam 24 jam.</p>
    `;

  await sendMail(userEmail, "Verifikasi Email - Pramuka SMAN 1 Pasawahan", html);

  return {
    message: "Instruksi verifikasi telah dikirim ke email Anda.",
  };
});
