import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID tidak ditemukan",
    });
  }

  const supabase = useSupabaseAdmin();

  // Update profile
  const { data, error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal memperbarui user",
    });
  }

  return data;
});
