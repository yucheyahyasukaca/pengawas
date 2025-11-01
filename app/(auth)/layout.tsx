import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#0d0203] via-[#1c0607] to-[#300809] text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#b53740]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#f1a0a8]/20 blur-3xl" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}


