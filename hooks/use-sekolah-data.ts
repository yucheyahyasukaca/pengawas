import useSWR from 'swr';
import { useToast } from "@/hooks/use-toast";

const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        (error as any).info = await res.json();
        (error as any).status = res.status;
        throw error;
    }

    return res.json();
};

export function useSekolahData() {
    const { toast } = useToast();

    const { data, error, isLoading, mutate } = useSWR('/api/sekolah/profile', fetcher, {
        revalidateOnFocus: false, // Don't revalidate on window focus to reduce requests
        revalidateIfStale: false, // Don't revalidate if we have data (unless manual trigger)
        onError: (err) => {
            if (err.status !== 404) {
                console.error("Error loading sekolah profile:", err);
                toast({
                    title: "Error",
                    description: "Gagal memuat data profil sekolah",
                    variant: "error",
                });
            }
        }
    });

    return {
        sekolah: data,
        isLoading,
        isError: error,
        notFound: error?.status === 404,
        mutate,
    };
}
