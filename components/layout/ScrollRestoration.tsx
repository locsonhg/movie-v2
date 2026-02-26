"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Auto-scroll to top on route change.
 * Fixes the issue where navigating from a scrolled page
 * keeps the scroll position on the new page.
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip the initial mount — only scroll on actual navigation
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
