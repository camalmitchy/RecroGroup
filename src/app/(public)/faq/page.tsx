"use client";

import { useEffect } from "react";

export default function FaqRedirectPage() {
  useEffect(() => {
    window.location.replace("/contact#faq");
  }, []);

  return null;
}
