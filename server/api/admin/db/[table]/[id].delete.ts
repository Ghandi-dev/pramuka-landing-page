import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const table = getRouterParam(event, "table");
  const id = getRouterParam(event, "id");

  if (!table || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tabel dan ID wajib diisi",
    });
  }

  const supabase = useSupabaseAdmin();

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return { message: "Data berhasil dihapus" };
});
