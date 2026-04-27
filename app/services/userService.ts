import useSupabaseCrud from "~/composables/useSupabaseCrud";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useImageService } from "./imageService";

const config = useRuntimeConfig();

export interface Profiles {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

export function useUserService() {
  const nuxtApp = useNuxtApp();
  const supabase = nuxtApp.$supabase as SupabaseClient;

  const crud = useSupabaseCrud<Profiles>("profiles");
  const { uploadImage, deleteImage } = useImageService();

  const createUser = async (user: {
    name: string;
    email: string;
    password: string;
    avatar_url: string;
    role?: string;
  }) => {
    // check user email using rest api
    const { data: checkUser } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email);
    if (checkUser && checkUser.length > 0) {
      deleteImage(user.avatar_url);
      throw new Error("Email sudah terdaftar");
    }

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        emailRedirectTo: `${config.public.siteUrl}/admin/login`,
        data: {
          name: user.name,
          role: user.role ?? "member",
          avatar_url: user.avatar_url,
        },
      },
    });

    if (error) {
      deleteImage(user.avatar_url);
      throw error;
    }

    return data.user;
  };

  return {
    ...crud,
    createUser,
    uploadImage,
  };
}
