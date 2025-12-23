
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Fetching pengembangan_diri for user:", user.id);
        const { data, error } = await supabase
            .from("pengembangan_diri")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching pengembangan diri (Supabase):", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { nama_kegiatan, tanggal_kegiatan, materi_kegiatan, sertifikat_url } = body;

        // Validate required fields
        if (!nama_kegiatan || !tanggal_kegiatan) {
            return NextResponse.json({ error: "Nama dan Tanggal Kegiatan wajib diisi" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("pengembangan_diri")
            .insert({
                user_id: user.id,
                nama_kegiatan,
                tanggal_kegiatan,
                materi_kegiatan,
                sertifikat_url,
                status: "diajukan",
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating pengembangan diri:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
