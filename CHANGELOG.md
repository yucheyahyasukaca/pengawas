# Changelog

All notable changes to this project will be documented in this file.

## [1.1.2] - 2026-02-10

### Added
- **Pelaksanaan Pendampingan**: New feature for supervisors to record and manage their mentoring execution plans (`JadwalPelaksanaanTable`).
- **Laporan Triwulan**: Added a dedicated page and filter for generating quarterly reports.
- **Export to Excel**: Implemented a professional Excel export feature for "Pelaksanaan Pendampingan". The export includes a custom header with supervisor identity and a formatted data table, matching the web view.
- **Edit Feature**: Added the ability to edit mentoring plans, including a new "Jumlah Jam" (JP) field.

## [1.1.1] - 2026-02-08

### Added
- **PWA Support**: Implemented Progressive Web App capabilities using `@ducanh2912/next-pwa`.
- **Service Worker**: Added service worker for offline support and asset caching.
- **Enhanced Update Logic**: Updated `VersionChecker` to unregister old service workers and clear caches upon version update.

## [1.1.0] - 2026-02-06

### Added
- **Auto Cache Clearing**: Implemented a mechanism to automatically clear browser cache and reload the page when a new version is detected (`VersionChecker`).
- **Sidebar Scroll**: Added scroll functionality to the admin sidebar for better visibility on smaller screens.

### Fixed
- **School Import**: Updated Excel import logic to "upsert" data (update existing records based on NPSN) instead of failing on duplicates.
- **Admin Authorization**: Fixed an issue where authorized admins were receiving unauthorized errors during import due to hydration mismatches in the `AdminUnauthorized` component.
- **Hydration Mismatch**: Resolved hydration errors in `admin-unauthorized.tsx` caused by random particle generation during SSR.

### Changed
- **Version Bump**: Updated application version to 1.1.0.
