"use client";

import { Home, Heart, MessageCircle, Clock, User } from "lucide-react";

export default function BottomBar() {
  const Item = ({ icon: Icon, label }: any) => (
    <button className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-100">
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t bg-white/90 backdrop-blur">
      <Item icon={Home} label="Home" />
      <Item icon={Heart} label="Wishlists" />
      <Item icon={MessageCircle} label="Chats" />
      <Item icon={Clock} label="History" />
      <Item icon={User} label="Profile" />
    </nav>
  );
}
