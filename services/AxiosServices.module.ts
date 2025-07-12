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
export async function AxiosPost({ path, payload }: { path: string, payload: any }) {

    const res = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, payload, {
        headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        }
    }
    )
    return res.data
}

export async function AxiosPatch({ path, payload }: { path: string, payload?: any }) {
    try {

        const res = await axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, payload, {
            headers: {
                "Content-Type": "application/json",
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
                Prefer: "return=representation",
            }
        }
        )
        return res.data
    } catch (error) {
        console.log(error.message)
    }
}

export async function AxiosDelete({ path, payload }: { path: string, payload?: any }) {

    const res = await axios.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, {
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            Prefer: "return=representation",
        }
    }
    )
    return res.data
}