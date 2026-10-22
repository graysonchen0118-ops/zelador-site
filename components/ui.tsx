"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { face } from "@/lib/photos";

export function Sk({ h = 16, w = "100%", r, style }: { h?: number; w?: number | string; r?: number; style?: CSSProperties }) {
  return <div className="sk" style={{ height: h, width: w, borderRadius: r, ...style }} />;
}

export function SkRows({ n = 5, h = 44 }: { n?: number; h?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Sk key={i} h={h} />
      ))}
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="e-ico">{icon}</div>
      <b>{title}</b>
      <div>{text}</div>
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}

export function Avatar({ id, size = 32, alt }: { id: string; size?: number; alt: string }) {
  return <img className="avatar" src={face(id, size * 2)} width={size} height={size} alt={alt} loading="lazy" />;
}

function useEsc(onClose: () => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
}

export function Drawer({
  title,
  sub,
  onClose,
  children,
  foot,
}: {
  title: ReactNode;
  sub?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  foot?: ReactNode;
}) {
  useEsc(onClose);
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            {sub && <div style={{ marginBottom: 6 }}>{sub}</div>}
            <h3>{title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {foot && <div className="drawer-foot">{foot}</div>}
      </aside>
    </>
  );
}

export function Modal({
  title,
  onClose,
  children,
  foot,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  foot?: ReactNode;
}) {
  useEsc(onClose);
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <Loader2 size={size} className="spin" />;
}

export function Toasts() {
  const { toasts, dismiss } = useStore();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <span className="t-ico">
            {t.kind === "ok" ? <CheckCircle2 size={18} /> : t.kind === "erro" ? <AlertTriangle size={18} /> : <Info size={18} />}
          </span>
          <span>{t.text}</span>
          <button onClick={() => dismiss(t.id)} aria-label="Fechar aviso">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

// inclinação em perspectiva sob o ponteiro, com a luz seguindo
export function useTilt<T extends HTMLElement>(max = 6) {
  const ref = useRef<T | null>(null);
  const onMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-3px)`;
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    },
    [max],
  );
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
  }, []);
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

export function Tilt({ className = "", children, style, max }: { className?: string; children: ReactNode; style?: CSSProperties; max?: number }) {
  const t = useTilt<HTMLDivElement>(max);
  return (
    <div className={`tilt ${className}`} style={style} ref={t.ref} onPointerMove={t.onPointerMove} onPointerLeave={t.onPointerLeave}>
      {children}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" className={`toggle ${on ? "on" : ""}`} aria-pressed={on} aria-label={label} onClick={() => onChange(!on)} />;
}
