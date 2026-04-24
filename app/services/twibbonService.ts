import useSupabaseCrud from "~/composables/useSupabaseCrud";

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

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.statusMessage || data.message || "Failed to upload image",
      );
    }

    return data.url;
  };

  const deleteImage = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;

    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });
    } catch (error) {
      console.error("Failed to delete old image", error);
    }
  };

  return {
    ...crud,
    uploadImage,
    deleteImage,
  };
}
