"use client";

import { useEffect, useState } from "react";

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // Check every hour
const VERSION_STORAGE_KEY = "app_version";

interface VersionResponse {
    version: string;
}

export function VersionChecker() {
    const [currentVersion, setCurrentVersion] = useState<string | null>(null);

    const checkVersion = async () => {
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
                setCurrentVersion(serverVersion);
                return;
            }

            // If server version is different from stored version
            if (serverVersion && storedVersion && serverVersion !== storedVersion) {
                console.log(`[VersionChecker] New version detected: ${serverVersion} (current: ${storedVersion})`);

                // Update version in storage
                localStorage.setItem(VERSION_STORAGE_KEY, serverVersion);

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
                window.location.reload();
            }
        } catch (error) {
            console.error("[VersionChecker] Failed to check version", error);
        }
    };

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
    }, []);

    return null; // Component renders nothing
}
