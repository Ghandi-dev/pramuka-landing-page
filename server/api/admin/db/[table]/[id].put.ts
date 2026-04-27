import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const table = getRouterParam(event, "table");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!table || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tabel dan ID wajib diisi",
    });
  }

  const supabase = useSupabaseAdmin();

  const { data, error } = await supabase
    .from(table)
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return data;
});
