import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const table = getRouterParam(event, "table");
  const query = getQuery(event);

  if (!table) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nama tabel wajib diisi",
    });
  }

  const supabase = useSupabaseAdmin();

  // If only count is requested
  if (query.count === "true") {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return { count: count || 0 };
  }

  let dbQuery = supabase.from(table).select("*");

  // Filtering
  if (query.field && query.value) {
    dbQuery = dbQuery.eq(query.field as string, query.value);
  }

  // Ordering
  if (query.orderBy) {
    dbQuery = dbQuery.order(query.orderBy as string, {
      ascending: query.ascending === "true",
    });
  } else {
    dbQuery = dbQuery.order("created_at", { ascending: false });
  }

  // Pagination/Limit
  if (query.limit) {
    dbQuery = dbQuery.limit(parseInt(query.limit as string));
  }

  const { data, error } = await dbQuery;

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  // Handle single result if field/value provided (optional optimization)
  if (query.single === "true") {
    return data?.[0] || null;
  }

  return data;
});
