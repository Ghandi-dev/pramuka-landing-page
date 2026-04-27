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

    const removeCampaign = async (id: string, frameUrl?: string | null) => {
        if (frameUrl) {
            await deleteImage(frameUrl)
        }
        return await crud.remove(id)
    }

    return {
        ...crud,
        remove: removeCampaign,
        uploadImage,
        deleteImage,
    };
}
