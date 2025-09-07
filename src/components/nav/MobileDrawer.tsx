"use client";

import { X, Home, Heart, MessageCircle, Clock, User } from "lucide-react";

type Props = { open: boolean; onClose: () => void; side?: "left" | "right" };

export default function MobileDrawer({ open, onClose, side = "right" }: Props) {
  const fromLeft = side === "left";
  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`absolute ${fromLeft ? 'left-0' : 'right-0'} top-0 h-full w-72 max-w-[85%] transform bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : fromLeft ? '-translate-x-full' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="text-sm font-semibold">Menu</div>
          <button aria-label="Close menu" onClick={onClose} className="rounded-md p-1 hover:bg-neutral-100 focus:outline-none focus-visible:ring">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-2">
          {[
            { href: '/', label: 'Home', Icon: Home },
            { href: '/wishlists', label: 'Wishlists', Icon: Heart },
            { href: '/chats', label: 'Chats', Icon: MessageCircle },
            { href: '/history', label: 'History', Icon: Clock },
            { href: '/profile', label: 'Profile', Icon: User },
          ].map(({ href, label, Icon }) => (
            <a key={label} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring">
              <Icon className="h-5 w-5" /> {label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
