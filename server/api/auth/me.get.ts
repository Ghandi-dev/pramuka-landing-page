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
  try {
    const decoded = verifyToken(token) as any;
    const supabase = useSupabaseAdmin();

    // Fetch user & profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, avatar_url, created_at")
      .eq("id", decoded.id)
      .single();

    if (error || !profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "User tidak ditemukan",
      });
    }

    return profile;
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sesi kedaluwarsa",
    });
  }
});
