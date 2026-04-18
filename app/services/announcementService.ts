import useSupabaseCrud from "~/composables/useSupabaseCrud"

export interface Announcement {
    id: string
    title: string
    content: string | null
    date: string
    status: string
    created_at: string
}

export function useAnnouncementService() {
    const crud = useSupabaseCrud<Announcement>('announcements')

    return {
        ...crud,
    }
}
