"use client";
import { useEffect } from "react";

export default function ViewportProvider() {
  useEffect(() => {
    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${h}px`);
    };
    set();
    window.addEventListener("resize", set);
    window.visualViewport?.addEventListener("resize", set);
    window.visualViewport?.addEventListener("scroll", set);
    return () => {
      window.removeEventListener("resize", set);
      window.visualViewport?.removeEventListener("resize", set);
      window.visualViewport?.removeEventListener("scroll", set);
    };
  }, []);
  return null;
}
