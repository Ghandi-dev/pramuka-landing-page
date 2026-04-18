import { createClient } from "@supabase/supabase-js"

export default defineNuxtPlugin(() => {

    const config = useRuntimeConfig()

    console.log(config.public);


    const supabase = createClient(
        config.public.supabaseUrl as string,
        config.public.supabasePublishableKey as string
    )

    return {
        provide: {
            supabase
        }
    }
})