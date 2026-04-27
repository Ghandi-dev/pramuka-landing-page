import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin";

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin();

  // Fetch profiles and join with users to get emails
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      `
            id,
            name,
            email,
            role,
            avatar_url,
            created_at
        `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data user",
    });
  }

  return profiles;
});
