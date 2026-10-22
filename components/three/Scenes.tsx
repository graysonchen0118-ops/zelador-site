"use client";

import dynamic from "next/dynamic";

export const Background = dynamic(() => import("./DepthField"), {
  ssr: false,
  loading: () => <div className="bg-fallback" aria-hidden="true" />,
});

export const Wiring = dynamic(() => import("./WiringScene"), {
  ssr: false,
  loading: () => (
    <div
      className="hero-scene"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(520px 300px at 72% 30%, rgba(201,111,69,0.22), transparent 65%), radial-gradient(420px 260px at 85% 90%, rgba(44,90,94,0.25), transparent 60%)",
      }}
    />
  ),
});
