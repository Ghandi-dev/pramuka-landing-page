import useSupabaseCrud from '~/composables/useSupabaseCrud'

export interface Activity {
    id: string
    title: string
    description: string | null
    activity_date: string
    location: string | null
    cover_image: string
    created_at: string
}

export function useActivityService() {
    const crud = useSupabaseCrud<Activity>('activities')

    return {
        ...crud,
    }
}
