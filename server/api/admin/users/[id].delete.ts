import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID tidak ditemukan",
    });
  }

  const supabase = useSupabaseAdmin();

  // Delete user (cascade will handle profile and verifications)
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal menghapus user",
    });
  }

  return { message: "User berhasil dihapus" };
});
