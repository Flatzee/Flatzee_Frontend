"use client";

import * as React from "react";
import { Home, Heart, MessageCircle, Clock, User, type LucideIcon } from "lucide-react";

export const BOTTOM_BAR_H = 56;

type ItemProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
};

function Item({ icon: Icon, label, onClick }: ItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
    >
      <Icon className="h-5 w-5" aria-hidden />
      <span>{label}</span>
    </button>
  );
}

export default function BottomBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t bg-white/90 backdrop-blur md:hidden"
      style={{ paddingBottom: "var(--safe-bot)" }}
      aria-label="Bottom navigation"
    >
      <Item icon={Home} label="Home" />
      <Item icon={Heart} label="Wishlists" />
      <Item icon={MessageCircle} label="Chats" />
      <Item icon={Clock} label="History" />
      <Item icon={User} label="Profile" />
    </nav>
  );
}
