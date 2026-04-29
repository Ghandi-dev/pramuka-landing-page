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
  const { name, email, avatar_url } = body;

  const supabase = useSupabaseAdmin();

  // Check if email is being updated and if it already exists for another user
  if (email) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", decoded.id)
      .single();

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email sudah digunakan oleh akun lain.",
      });
    }

    // Update email in users table
    const { error: userError } = await supabase
      .from("users")
      .update({ email })
      .eq("id", decoded.id);

    if (userError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Gagal memperbarui email pengguna.",
      });
    }
  }

  // Update profile
  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

  if (Object.keys(updateData).length > 0) {
    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", decoded.id)
      .select()
      .single();

    if (profileError) {
      throw createError({
        statusCode: 500,
        statusMessage: profileError.message || "Gagal memperbarui profil.",
      });
    }
    
    return updatedProfile;
  }

  return { message: "Tidak ada data yang diperbarui." };
});
