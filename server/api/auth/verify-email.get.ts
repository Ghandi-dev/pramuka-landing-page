import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token tidak valid.",
    });
  }

  const supabase = useSupabaseAdmin();

  // 1. Find token
  const { data: verification, error: verificationError } = await supabase
    .from("email_verifications")
    .select("*")
    .eq("token", token)
    .single();

  if (verificationError || !verification) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token tidak valid atau sudah digunakan.",
    });
  }

  // 2. Validate expiration
  if (new Date(verification.expires_at) < new Date()) {
    await supabase
      .from("email_verifications")
      .delete()
      .eq("id", verification.id);
    throw createError({
      statusCode: 400,
      statusMessage: "Token sudah kedaluwarsa.",
    });
  }

  // 3. Update user
  const { error: userError } = await supabase
    .from("users")
    .update({ email_verified: true })
    .eq("id", verification.user_id);

  if (userError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal memverifikasi email.",
    });
  }

  // 4. Delete token
  await supabase.from("email_verifications").delete().eq("id", verification.id);

  return {
    message: "Email berhasil diverifikasi. Silakan login.",
  };
});
