import { hashPassword } from "~~/server/utils/hash";
import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token, password } = body;

  if (!token || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token dan password baru wajib diisi.",
    });
  }

  const supabase = useSupabaseAdmin();

  // 1. Find token
  const { data: reset, error: resetError } = await supabase
    .from("password_resets")
    .select("*")
    .eq("token", token)
    .single();

  if (resetError || !reset) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token tidak valid atau sudah kedaluwarsa.",
    });
  }

  // 2. Validate expiration
  if (new Date(reset.expires_at) < new Date()) {
    await supabase.from("password_resets").delete().eq("id", reset.id);
    throw createError({
      statusCode: 400,
      statusMessage: "Token sudah kedaluwarsa.",
    });
  }

  // 3. Hash new password
  const passwordHash = await hashPassword(password);

  // 4. Update user
  const { error: userError } = await supabase
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("id", reset.user_id);

  if (userError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengatur ulang password.",
    });
  }

  // 5. Delete token
  await supabase.from("password_resets").delete().eq("id", reset.id);

  return {
    message: "Password berhasil diatur ulang. Silakan login.",
  };
});
