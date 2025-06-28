import axios from "axios"

export async function AxiosGet({ path }: { path: string }) {

    const res = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, {
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        }
    }
    )
    return res.data
}
export function AxiosPost({ path, payload }: { path: string, payload: any }) {

    axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/res/v1/${path}`, payload, {
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        }
    }
    )
}

export function AxiosPatch({ path, payload }: { path: string, payload: any }) {

    axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/res/v1/${path}`, payload, {
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        }
    }
    )
}

export function AxiosDelete({ path, payload }: { path: string, payload: any }) {

    axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/res/v1/${path}`, payload, {
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        }
    }
    )
}