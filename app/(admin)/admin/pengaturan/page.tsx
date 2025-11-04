"use client";

export const runtime = 'edge';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Save,
  Palette,
  Bell,
  Globe,
  Database,
  Mail,
  Shield,
  Monitor,
  Moon,
  Sun,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "umum" | "tampilan" | "notifikasi" | "integrasi" | "keamanan";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("umum");
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "umum", label: "Umum", icon: Settings },
    { id: "tampilan", label: "Tampilan", icon: Palette },
    { id: "notifikasi", label: "Notifikasi", icon: Bell },
    { id: "integrasi", label: "Integrasi", icon: Globe },
    { id: "keamanan", label: "Keamanan", icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Pengaturan Sistem
            </CardTitle>
            <CardDescription className="text-slate-600">
              Kelola preferensi tampilan, notifikasi, dan integrasi sistem
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="default"
            className="gap-2 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
          >
            <Save className="size-4" />
            Simpan Semua Perubahan
          </Button>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardContent className="p-0">
          {/* Mobile Dropdown Tabs */}
          <div className="border-b border-slate-200 bg-white p-4 md:hidden">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
              >
                <span className="flex-1 text-left">{tabs.find(t => t.id === activeTab)?.label}</span>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-rose-600 transition-all duration-200",
                      isTabDropdownOpen && "rotate-180 text-rose-700"
                    )}
                  />
                </div>
              </button>
              {isTabDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsTabDropdownOpen(false)}
                  />
                  <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsTabDropdownOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50",
                            activeTab === tab.id
                              ? "bg-rose-50 text-rose-700"
                              : "text-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" />
                            <span>{tab.label}</span>
                          </div>
                          {activeTab === tab.id && (
                            <Check className="size-4 text-rose-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden border-b border-rose-100 p-4 md:flex md:flex-wrap md:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === "umum" && <UmumSection />}
      {activeTab === "tampilan" && <TampilanSection />}
      {activeTab === "notifikasi" && <NotifikasiSection />}
      {activeTab === "integrasi" && <IntegrasiSection />}
      {activeTab === "keamanan" && <KeamananSection />}
    </div>
  );
}

function UmumSection() {
  const [settings, setSettings] = useState({
    namaSistem: "SIP Kepengawasan Jateng",
    deskripsi: "Sistem Informasi Kepengawasan untuk MKPS SMA & SLB Provinsi Jawa Tengah",
    emailKontak: "mkps@garuda-21.com",
    nomorTelepon: "+62 24 12345678",
    alamat: "Jl. Pemuda No. 123, Semarang, Jawa Tengah",
    timezone: "Asia/Jakarta",
    bahasa: "id",
  });

  return (
    <div className="space-y-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Informasi Sistem
          </CardTitle>
          <CardDescription className="text-slate-600">
            Konfigurasi dasar sistem dan informasi kontak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Nama Sistem
            </label>
            <input
              type="text"
              value={settings.namaSistem}
              onChange={(e) => setSettings({ ...settings, namaSistem: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Nama sistem..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Deskripsi
            </label>
            <textarea
              value={settings.deskripsi}
              onChange={(e) => setSettings({ ...settings, deskripsi: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Deskripsi sistem..."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Email Kontak
              </label>
              <input
                type="email"
                value={settings.emailKontak}
                onChange={(e) => setSettings({ ...settings, emailKontak: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={settings.nomorTelepon}
                onChange={(e) => setSettings({ ...settings, nomorTelepon: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="+62 24 12345678"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Alamat
            </label>
            <textarea
              value={settings.alamat}
              onChange={(e) => setSettings({ ...settings, alamat: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Alamat lengkap..."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Zona Waktu
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Bahasa
              </label>
              <select
                value={settings.bahasa}
                onChange={(e) => setSettings({ ...settings, bahasa: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
          >
            <Save className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TampilanSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const [primaryColor, setPrimaryColor] = useState("rose");
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);

  const themes = [
    { id: "light", label: "Terang", icon: Sun },
    { id: "dark", label: "Gelap", icon: Moon },
    { id: "auto", label: "Otomatis", icon: Monitor },
  ];

  const colors = [
    { id: "rose", name: "Rose", class: "bg-rose-500" },
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "emerald", name: "Emerald", class: "bg-emerald-500" },
    { id: "amber", name: "Amber", class: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Tema & Tampilan
          </CardTitle>
          <CardDescription className="text-slate-600">
            Sesuaikan tema dan preferensi tampilan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Tema
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.id;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id as "light" | "dark" | "auto")}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition",
                      isActive
                        ? "border-rose-500 bg-rose-50"
                        : "border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50/50"
                    )}
                  >
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      isActive ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      <Icon className="size-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {themeOption.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Warna Utama
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setPrimaryColor(color.id)}
                  className={cn(
                    "size-12 rounded-xl border-2 transition",
                    primaryColor === color.id
                      ? "border-rose-500 ring-2 ring-rose-200"
                      : "border-slate-200 hover:border-rose-300"
                  )}
                >
                  <div className={cn("size-full rounded-lg", color.class)} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Mode Kompak
                </label>
                <p className="text-xs text-slate-600">
                  Tampilkan lebih banyak konten dalam satu layar
                </p>
              </div>
              <button
                onClick={() => setCompactMode(!compactMode)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition",
                  compactMode ? "bg-rose-500" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition",
                    compactMode ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Animasi
                </label>
                <p className="text-xs text-slate-600">
                  Tampilkan animasi dan transisi
                </p>
              </div>
              <button
                onClick={() => setShowAnimations(!showAnimations)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition",
                  showAnimations ? "bg-rose-500" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition",
                    showAnimations ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
          >
            <Save className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function NotifikasiSection() {
  const [notifications, setNotifications] = useState({
    email: {
      agendaBaru: true,
      beritaTerbit: true,
      laporanMasuk: false,
      komentar: true,
    },
    push: {
      agendaBaru: true,
      beritaTerbit: false,
      laporanMasuk: true,
      komentar: false,
    },
    inApp: {
      agendaBaru: true,
      beritaTerbit: true,
      laporanMasuk: true,
      komentar: true,
    },
  });

  const toggleNotification = (type: "email" | "push" | "inApp", key: string) => {
    setNotifications({
      ...notifications,
      [type]: {
        ...notifications[type],
        [key]: !notifications[type][key as keyof typeof notifications.email],
      },
    });
  };

  const notificationTypes = [
    { key: "agendaBaru", label: "Agenda Baru", description: "Notifikasi ketika ada agenda baru dibuat" },
    { key: "beritaTerbit", label: "Berita Terbit", description: "Notifikasi ketika berita diterbitkan" },
    { key: "laporanMasuk", label: "Laporan Masuk", description: "Notifikasi ketika ada laporan baru masuk" },
    { key: "komentar", label: "Komentar", description: "Notifikasi ketika ada komentar baru" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Pengaturan Notifikasi
          </CardTitle>
          <CardDescription className="text-slate-600">
            Kelola preferensi notifikasi untuk berbagai jenis aktivitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((notifType) => (
            <div key={notifType.key} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900">{notifType.label}</h4>
                <p className="text-xs text-slate-600">{notifType.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Email</span>
                  </div>
                  <button
                    onClick={() => toggleNotification("email", notifType.key)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      notifications.email[notifType.key as keyof typeof notifications.email]
                        ? "bg-rose-500"
                        : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition",
                        notifications.email[notifType.key as keyof typeof notifications.email]
                          ? "translate-x-6"
                          : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Push</span>
                  </div>
                  <button
                    onClick={() => toggleNotification("push", notifType.key)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      notifications.push[notifType.key as keyof typeof notifications.push]
                        ? "bg-rose-500"
                        : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition",
                        notifications.push[notifType.key as keyof typeof notifications.push]
                          ? "translate-x-6"
                          : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4 text-slate-600" />
                    <span className="text-sm text-slate-700">In-App</span>
                  </div>
                  <button
                    onClick={() => toggleNotification("inApp", notifType.key)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      notifications.inApp[notifType.key as keyof typeof notifications.inApp]
                        ? "bg-rose-500"
                        : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition",
                        notifications.inApp[notifType.key as keyof typeof notifications.inApp]
                          ? "translate-x-6"
                          : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
          >
            <Save className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrasiSection() {
  const [integrations, setIntegrations] = useState({
    email: {
      enabled: true,
      smtpServer: "smtp.gmail.com",
      smtpPort: "587",
      smtpUser: "noreply@mkps-jateng.com",
      smtpPassword: "••••••••",
    },
    storage: {
      enabled: true,
      provider: "supabase",
      bucket: "mkps-jateng",
    },
  });

  return (
    <div className="space-y-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Integrasi Email
          </CardTitle>
          <CardDescription className="text-slate-600">
            Konfigurasi pengaturan SMTP untuk pengiriman email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-900">
                Aktifkan Email
              </label>
              <p className="text-xs text-slate-600">
                Gunakan SMTP untuk pengiriman email notifikasi
              </p>
            </div>
            <button
              onClick={() => setIntegrations({
                ...integrations,
                email: { ...integrations.email, enabled: !integrations.email.enabled }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                integrations.email.enabled ? "bg-rose-500" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  integrations.email.enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
          {integrations.email.enabled && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    value={integrations.email.smtpServer}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, smtpServer: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    value={integrations.email.smtpPort}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, smtpPort: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    SMTP User
                  </label>
                  <input
                    type="text"
                    value={integrations.email.smtpUser}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, smtpUser: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={integrations.email.smtpPassword}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      email: { ...integrations.email, smtpPassword: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>
            </div>
          )}
          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
          >
            <Save className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Penyimpanan File
          </CardTitle>
          <CardDescription className="text-slate-600">
            Konfigurasi penyimpanan file dan media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-900">
                Aktifkan Penyimpanan
              </label>
              <p className="text-xs text-slate-600">
                Gunakan penyimpanan cloud untuk file dan media
              </p>
            </div>
            <button
              onClick={() => setIntegrations({
                ...integrations,
                storage: { ...integrations.storage, enabled: !integrations.storage.enabled }
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                integrations.storage.enabled ? "bg-rose-500" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  integrations.storage.enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
          {integrations.storage.enabled && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Provider
                </label>
                <select
                  value={integrations.storage.provider}
                  onChange={(e) => setIntegrations({
                    ...integrations,
                    storage: { ...integrations.storage, provider: e.target.value }
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                >
                  <option value="supabase">Supabase Storage</option>
                  <option value="aws">AWS S3</option>
                  <option value="google">Google Cloud Storage</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={integrations.storage.bucket}
                  onChange={(e) => setIntegrations({
                    ...integrations,
                    storage: { ...integrations.storage, bucket: e.target.value }
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>
          )}
          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
          >
            <Save className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function KeamananSection() {
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    passwordMinLength: "8",
    requireStrongPassword: true,
    logRetention: "90",
  });

  return (
    <div className="space-y-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Autentikasi & Keamanan
          </CardTitle>
          <CardDescription className="text-slate-600">
            Kelola pengaturan keamanan dan autentikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-900">
                Two-Factor Authentication
              </label>
              <p className="text-xs text-slate-600">
                Aktifkan autentikasi dua faktor untuk keamanan tambahan
              </p>
            </div>
            <button
              onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                security.twoFactor ? "bg-rose-500" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  security.twoFactor ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Session Timeout (menit)
            </label>
            <input
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Minimum Panjang Password
            </label>
            <input
              type="number"
              value={security.passwordMinLength}
              onChange={(e) => setSecurity({ ...security, passwordMinLength: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-900">
                Password Kuat
              </label>
              <p className="text-xs text-slate-600">
                Wajibkan penggunaan password yang kompleks
              </p>
            </div>
            <button
              onClick={() => setSecurity({ ...security, requireStrongPassword: !security.requireStrongPassword })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                security.requireStrongPassword ? "bg-rose-500" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  security.requireStrongPassword ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Retensi Log (hari)
            </label>
            <input
              type="number"
              value={security.logRetention}
              onChange={(e) => setSecurity({ ...security, logRetention: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
          >
            <Save className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

