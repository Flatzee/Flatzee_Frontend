"use client"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-xl font-bold">Flatzee</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="px-3 py-2 text-sm">Browse</NavigationMenuItem>
            <NavigationMenuItem className="px-3 py-2 text-sm">Cities</NavigationMenuItem>
            <NavigationMenuItem className="px-3 py-2 text-sm">About</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Login</Button>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
