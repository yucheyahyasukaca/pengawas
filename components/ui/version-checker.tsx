"use client";

import { useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const CHECK_INTERVAL_MS = 30 * 60 * 1000; // Check every 30 minutes
const VERSION_STORAGE_KEY = "app_version";

interface VersionResponse {
    version: string;
}

export function VersionChecker() {
    const { toast } = useToast();

    const handleUpdate = useCallback(async () => {
        console.log("[VersionChecker] Updating system...");

        // Unregister potentially stale service workers
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
                console.log('[VersionChecker] Service workers unregistered.');
            } catch (err) {
                console.error('[VersionChecker] Failed to unregister SW:', err);
            }
        }

        // Clear caches
        if ('caches' in window) {
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
                console.log('[VersionChecker] Caches cleared.');
            } catch (err) {
                console.error('[VersionChecker] Failed to clear caches:', err);
            }
        }

        // Force reload from server
        console.log("[VersionChecker] Reloading page...");
        window.location.reload();
    }, []);

    const checkVersion = useCallback(async () => {
        try {
            // Add timestamp to prevent caching of the version file itself
            const res = await fetch(`/version.json?t=${new Date().getTime()}`, {
                cache: 'no-store',
            });

            if (!res.ok) return;

            const data: VersionResponse = await res.json();
            const serverVersion = data.version;
            const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);

            // Initial load: logic to set version if missing
            if (!storedVersion) {
                localStorage.setItem(VERSION_STORAGE_KEY, serverVersion);
                return;
            }

            // If server version is different from stored version
            if (serverVersion && storedVersion && serverVersion !== storedVersion) {
                console.log(`[VersionChecker] New version detected: ${serverVersion} (current: ${storedVersion})`);

                // Update version in storage so we don't keep showing the toast if they dismiss it
                // Actually, we want them to update, so maybe don't update storage until they click update?
                // But to avoid spamming the toast on every page load/check interval, we'll use a session flag or similar.

                toast({
                    title: "Pembaruan Sistem Tersedia",
                    description: `Versi baru (${serverVersion}) telah tersedia. Klik update untuk mendapatkan fitur terbaru.`,
                    variant: "info",
                    duration: 100000, // Persistent until action or manual dismiss
                    action: (
                        <ToastAction altText="Update Now" onClick={handleUpdate}>
                            Update
                        </ToastAction>
                    ),
                });

                // Set stored version to server version to avoid repeated notifications in the same session
                localStorage.setItem(VERSION_STORAGE_KEY, serverVersion);
            }
        } catch (error) {
            console.error("[VersionChecker] Failed to check version", error);
        }
    }, [toast, handleUpdate]);

    useEffect(() => {
        // Check immediately on mount
        checkVersion();

        // Check periodically
        const interval = setInterval(checkVersion, CHECK_INTERVAL_MS);

        // Check on visibility change (when tab becomes active)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkVersion();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkVersion]);

    return null; // Component renders nothing
}
