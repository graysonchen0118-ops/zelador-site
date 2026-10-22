"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Cable, Gauge, Home, Inbox, LayoutTemplate, Menu, Rocket, Library, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { FACE, PH, face, img } from "@/lib/photos";
import { SITE } from "@/lib/mock/site";
import { Background } from "./three/Scenes";
import { Toasts } from "./ui";

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { requests, health } = useStore();

  useEffect(() => setOpen(false), [path]);

  const open_ = requests.filter((r) => r.status !== "publicado").length;
  const ready = requests.filter((r) => r.status === "revisao").length;

  const nav = [
    { href: "/", label: "Visão geral", icon: Home },
    { href: "/site", label: "O site", icon: LayoutTemplate },
    { href: "/pedidos", label: "Pedidos", icon: Inbox, count: open_ },
    { href: "/estilos", label: "Quadro de classes", icon: Cable, count: health.unused + health.dups, hot: true },
    { href: "/velocidade", label: "Velocidade", icon: Gauge },
    { href: "/conteudo", label: "Conteúdo", icon: Library },
    { href: "/publicacao", label: "Publicação", icon: Rocket, count: ready },
  ];

  return (
    <>
      <Background />
      <div className="app">
        <div className={`scrim ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <div className="brand">
            <div className="brand-mark">
              <Zap size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div className="brand-name">Zelador</div>
              <div className="brand-sub">Manutenção do site</div>
            </div>
          </div>
          <div className="site-chip">
            <img src={img(PH.forroMadeira, 80, 80)} width={34} height={34} alt="Site da Cumaru Arquitetura" />
            <div style={{ minWidth: 0 }}>
              <b className="truncate">{SITE.name}</b>
              <span>{SITE.plan}, no ar</span>
            </div>
            <span className="dot-live" title="Site no ar" />
          </div>
          <nav className="nav">
            <div className="nav-label">Painel</div>
            {nav.map((n) => {
              const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href} className={active ? "active" : ""}>
                  <Icon size={18} />
                  {n.label}
                  {typeof n.count === "number" && n.count > 0 && <span className={`count ${n.hot ? "hot" : ""}`}>{n.count}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="side-foot">
            <img src={face(FACE.helena, 72)} width={36} height={36} alt="Helena Prado" />
            <div>
              <b>Helena Prado</b>
              <span>Cumaru Arquitetura</span>
            </div>
          </div>
        </aside>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
          <header className="topbar">
            <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu size={20} />
            </button>
            <div className="brand-mark">
              <Zap size={17} strokeWidth={2.4} />
            </div>
            <b>Zelador</b>
            <span className="chip ok" style={{ marginLeft: "auto" }}>
              <span className="dot-live" style={{ margin: 0, width: 7, height: 7, boxShadow: "none" }} />
              No ar
            </span>
          </header>
          <main className="main">
            {children}
            <footer className="footer">
              <span>Zelador, manutenção do site da {SITE.name}. © 2026</span>
              <span>Fotos: Unsplash</span>
            </footer>
          </main>
        </div>
      </div>
      <Toasts />
    </>
  );
}
