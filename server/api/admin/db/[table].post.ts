import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const table = getRouterParam(event, "table");
  const body = await readBody(event);

  if (!table) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nama tabel wajib diisi",
    });
  }

  const supabase = useSupabaseAdmin();

  const { data, error } = await supabase
    .from(table)
    .insert(body)
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
