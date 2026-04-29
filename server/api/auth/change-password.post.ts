import { comparePassword, hashPassword } from "~~/server/utils/hash";
import { verifyToken } from "~~/server/utils/jwt";
import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak ditemukan",
    });
  }

  let decoded;
  try {
    decoded = verifyToken(token) as any;
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sesi kedaluwarsa",
    });
  }

  const body = await readBody(event);
  const { old_password, new_password } = body;

  if (!old_password || !new_password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password lama dan password baru wajib diisi.",
    });
  }

  const supabase = useSupabaseAdmin();

  // Get user's current password hash
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("password_hash")
    .eq("id", decoded.id)
    .single();

  if (userError || !user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User tidak ditemukan",
    });
  }

  // Verify old password
  const isMatch = await comparePassword(old_password, user.password_hash);
  if (!isMatch) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password lama salah.",
    });
  }

  // Hash new password
  const passwordHash = await hashPassword(new_password);

  // Update password
  const { error: updateError } = await supabase
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("id", decoded.id);

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengubah password.",
    });
  }

  return {
    message: "Password berhasil diubah.",
  };
});
