import useSupabaseCrud from "~/composables/useSupabaseCrud";
import { useImageService } from "./imageService";

export interface TwibbonCampaign {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  frame_url: string;
  is_active: boolean;
  created_at: string;
}

export function useTwibbonCampaignService() {
  const crud = useSupabaseCrud<TwibbonCampaign>("twibbon_campaigns");
  const { uploadImage, deleteImage } = useImageService();

  return {
    ...crud,
    uploadImage,
    deleteImage,
  };
}
