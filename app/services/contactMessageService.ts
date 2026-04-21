import useSupabaseCrud from '~/composables/useSupabaseCrud'

export interface ContactMessage {
    id: string
    full_name: string
    email: string
    subject: string
    message: string
    status: 'new' | 'read' | 'replied'
    created_at: string
}

export function useContactMessageService() {
    const crud = useSupabaseCrud<ContactMessage>('contact_messages')

    // Anda bisa menambahkan custom function di sini jika butuh 
    // seperti markAsRead, dsb yang spesifik untuk contact_messages

    const markAsRead = async (id: string) => {
        return await crud.update(id, { status: 'read' })
    }

    return {
        ...crud,
        markAsRead
    }
}
