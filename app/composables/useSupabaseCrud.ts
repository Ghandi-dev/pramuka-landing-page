import type { SupabaseClient } from "@supabase/supabase-js";
import { useImageService } from "~/services/imageService";

export default function useSupabaseCrud<T extends Record<string, any>>(
  tableName: string,
) {
  const nuxtApp = useNuxtApp();
  const supabase = nuxtApp.$supabase as SupabaseClient;
  const { token } = useAdminAuth();
  const { deleteImage } = useImageService();

  const data = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Helper to check if we should use the admin proxy
  const useProxy = () => !!token.value;

  const fetchAll = async (
    orderBy: string = "created_at",
    ascending: boolean = false,
    limit?: number,
  ) => {
    loading.value = true;
    error.value = null;

    try {
      if (useProxy()) {
        const result = await $fetch(`/api/admin/db/${tableName}`, {
          headers: { Authorization: `Bearer ${token.value}` },
          query: { orderBy, ascending, limit },
        });
        data.value = (result as T[]) ?? [];
      } else {
        let query = supabase
          .from(tableName)
          .select("*")
          .order(orderBy, { ascending });

        if (limit) {
          query = query.limit(limit);
        }

        const { data: result, error: err } = await query;
        if (err) throw err;
        data.value = (result as T[]) ?? [];
      }
    } catch (e: any) {
      error.value = e.message || "Failed to fetch data";
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id: string): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    try {
      if (useProxy()) {
        const result = await $fetch(`/api/admin/db/${tableName}/${id}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        return result as T;
      } else {
        const { data: result, error: err } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", id)
          .single();

        if (err) throw err;
        return result as T;
      }
    } catch (e: any) {
      error.value = e.message || "Failed to fetch data";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchByField = async (field: string, value: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    try {
      if (useProxy()) {
        const result = await $fetch(`/api/admin/db/${tableName}`, {
          headers: { Authorization: `Bearer ${token.value}` },
          query: { field, value, single: "true" },
        });
        return result as T;
      } else {
        const { data: result, error: err } = await supabase
          .from(tableName)
          .select("*")
          .eq(field, value)
          .single();

        if (err) throw err;
        return result as T;
      }
    } catch (e: any) {
      error.value = e.message || "Failed to fetch data";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchCount = async (): Promise<number> => {
    try {
      if (useProxy()) {
        const result = await $fetch<{ count: number }>(
          `/api/admin/db/${tableName}`,
          {
            headers: { Authorization: `Bearer ${token.value}` },
            query: { count: "true" },
          },
        );
        return result.count;
      } else {
        const { count, error: err } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true });

        if (err) throw err;
        return count ?? 0;
      }
    } catch (e: any) {
      console.error("Failed to fetch count:", e);
      return 0;
    }
  };

  const insert = async (item: Partial<T>) => {
    if (!useProxy()) {
      throw new Error("Unauthorized: Only admins can perform this action");
    }
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch(`/api/admin/db/${tableName}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: item,
      });
      return result as T;
    } catch (e: any) {
      error.value = e.message || "Failed to insert";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const update = async (
    id: string,
    payload: Partial<T>,
    oldImageUrl?: string | null,
  ) => {
    if (!useProxy()) {
      throw new Error("Unauthorized: Only admins can perform this action");
    }
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/admin/db/${tableName}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token.value}` },
        body: payload,
      });

      // Cleanup old image if replaced
      const imgFields = [
        "image_url",
        "cover_image",
        "photo",
        "frame_url",
        "avatar_url",
      ];
      for (const field of imgFields) {
        const newValue = (payload as any)[field];
        if (oldImageUrl && newValue && oldImageUrl !== newValue) {
          await deleteImage(oldImageUrl);
          break;
        }
      }
    } catch (e: any) {
      error.value = e.message || "Failed to update record";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id: string, imageUrl?: string | null) => {
    if (!useProxy()) {
      throw new Error("Unauthorized: Only admins can perform this action");
    }
    loading.value = true;
    error.value = null;
    try {
      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      await $fetch(`/api/admin/db/${tableName}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch (e: any) {
      error.value = e.message || "Failed to delete";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchByField,
    fetchCount,
    insert,
    update,
    remove,
  };
}
