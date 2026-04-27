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
    .select("id")
    .eq("email", email)
    .single();

  if (userError || !user) {
    // Silently return success to avoid email enumeration
    return {
      message: "Jika email terdaftar, instruksi reset password telah dikirim.",
    };
  }

  // 2. Delete old tokens
  await supabase.from("password_resets").delete().eq("user_id", user.id);

  // 3. Generate reset token
  const token = generateRandomToken();
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  await supabase.from("password_resets").insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  // 4. Send email
  const resetLink = `${config.public.siteUrl}/auth/reset-password?token=${token}`;
  const html = `
        <h1>Reset Password</h1>
        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
        <p>Silakan klik tautan di bawah ini untuk mengatur ulang password Anda:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Tautan ini akan kedaluwarsa dalam 1 jam. Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
    `;

  await sendMail(email, "Reset Password - Pramuka SMAN 1 Pasawahan", html);

  return {
    message: "Instruksi reset password telah dikirim ke email Anda.",
  };
});
