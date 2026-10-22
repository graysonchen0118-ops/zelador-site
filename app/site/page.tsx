"use client";

import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { Crosshair, Lock, Monitor, MousePointer2, Smartphone, Tablet, MapPin, Phone, MessageCircle } from "lucide-react";
import { useLoaded, useStore } from "@/lib/store";
import { SECTIONS } from "@/lib/mock/requests";
import { face, img, PH } from "@/lib/photos";
import { haQuanto } from "@/lib/format";
import type { Pin } from "@/lib/types";
import { Empty, Sk, Toggle } from "@/components/ui";
import { NewRequestModal, RequestDrawer, StatusChip } from "@/components/requests";

type Device = "desktop" | "tablet" | "celular";
const WIDTH: Record<Device, string> = { desktop: "100%", tablet: "820px", celular: "390px" };

const CLASS_OF: Record<string, string> = {
  navbar: ".navbar",
  hero: ".hero-section",
  banner: ".banner-campanha",
  projetos: ".section-projetos",
  equipe: ".section-equipe",
  depoimentos: ".section-depoimentos",
  rodape: ".footer",
};

export default function SitePreview() {
  const ready = useLoaded(800);
  const { requests, collections } = useStore();
  const [marking, setMarking] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [showPins, setShowPins] = useState(true);
  const [preset, setPreset] = useState<{ section: string; pin: Pin } | null>(null);
  const [sel, setSel] = useState<string | null>(null);

  const pins = useMemo(() => requests.filter((r) => r.page === "home" && r.pin), [requests]);
  const openPins = pins.filter((r) => r.status !== "publicado");
  const banner = collections.banners.find((b) => b.status === "publicado");
  const projects = collections.projetos.filter((p) => p.status === "publicado" && p.featured).slice(0, 6);
  const team = collections.equipe.filter((t) => t.status === "publicado").slice(0, 4);
  const quotes = collections.depoimentos.filter((d) => d.status === "publicado").slice(0, 3);
  const selected = requests.find((r) => r.id === sel);

  const sec = (id: string, children: ReactNode) => {
    const here = showPins ? pins.filter((p) => p.pin!.section === id) : [];
    const onClick = (e: MouseEvent<HTMLElement>) => {
      if (!marking) return;
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - r.left) / r.width) * 100);
      const y = Math.round(((e.clientY - r.top) / r.height) * 100);
      setPreset({ section: id, pin: { section: id, x, y } });
    };
    return (
      <section key={id} className="cs-sec" data-section={id} onClick={onClick}>
        <span className="cs-tag">{CLASS_OF[id]}</span>
        {children}
        {here.map((p) => (
          <button
            key={p.id}
            className={`pin ${p.status === "publicado" ? "done" : ""}`}
            style={{ left: `${p.pin!.x}%`, top: `${p.pin!.y}%` }}
            title={p.title}
            onClick={(e) => {
              e.stopPropagation();
              setSel(p.id);
            }}
          >
            {p.id.slice(2)}
          </button>
        ))}
      </section>
    );
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Home da Cumaru, como está no ar</div>
          <h1>O site</h1>
          <p>Em vez de descrever no WhatsApp onde fica o telefone errado, clique em Marcar mudança e depois no ponto exato da página. O pedido já sai com o lugar certo.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg" role="tablist" aria-label="Modo">
          <button className={!marking ? "on" : ""} onClick={() => setMarking(false)}>
            <MousePointer2 size={15} /> Navegar
          </button>
          <button className={marking ? "on" : ""} onClick={() => setMarking(true)}>
            <Crosshair size={15} /> Marcar mudança
          </button>
        </div>
        <div className="seg" aria-label="Tela">
          <button className={device === "desktop" ? "on" : ""} onClick={() => setDevice("desktop")} aria-label="Computador">
            <Monitor size={15} /> <span className="hide-sm">Computador</span>
          </button>
          <button className={device === "tablet" ? "on" : ""} onClick={() => setDevice("tablet")} aria-label="Tablet">
            <Tablet size={15} /> <span className="hide-sm">Tablet</span>
          </button>
          <button className={device === "celular" ? "on" : ""} onClick={() => setDevice("celular")} aria-label="Celular">
            <Smartphone size={15} /> <span className="hide-sm">Celular</span>
          </button>
        </div>
        <label className="check">
          <Toggle on={showPins} onChange={setShowPins} label="Mostrar marcações" /> Marcações
        </label>
      </div>

      {marking && (
        <div className="callout info" style={{ marginBottom: 14 }}>
          <Crosshair size={18} color="var(--petrol)" style={{ flex: "none", marginTop: 2 }} />
          <div>
            <b>Modo de marcação ligado</b>
            <p>Passe o mouse para ver o nome de cada seção no quadro de classes, e clique onde precisa mudar.</p>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-start" }}>
        <div style={{ flex: "3 1 540px", minWidth: 0 }}>
          <div className="preview-wrap">
            <div className="browser" style={{ maxWidth: WIDTH[device] }}>
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span className="browser-url truncate">
                  <Lock size={11} style={{ display: "inline", verticalAlign: "-1px", marginRight: 6 }} />
                  Cumaru Arquitetura, página inicial
                </span>
              </div>
              {ready ? (
                <div className={`cs ${marking ? "marking" : ""}`}>
                  {sec("navbar", <>
                    <div className="cs-nav">
                      <span className="cs-logo">CUMARU</span>
                      <span className="cs-links">
                        <span>Projetos</span>
                        <span>Serviços</span>
                        <span>Sobre</span>
                        <span>Blog</span>
                        <span>Contato</span>
                      </span>
                      <span className="cs-cta">Pedir orçamento</span>
                    </div>
                  </>)}
                  {sec("hero", <>
                    <div className="cs-hero">
                      <img src={img(PH.forroMadeira, 1400, 760)} alt="Sala com forro de madeira e grandes janelas" />
                      <div className="cs-hero-copy">
                        <h2>Casas que respiram com o clima de São Paulo</h2>
                        <p>Arquitetura e interiores para casas e apartamentos, do primeiro croqui à chave na mão.</p>
                        <span className="cs-btn">Pedir orçamento</span>
                      </div>
                    </div>
                  </>)}
                  {banner &&
                    sec("banner", <>
                      <div className="cs-banner">
                        <div>
                          <b>{banner.title}</b>
                          <br />
                          <span>{banner.subtitle}</span>
                        </div>
                        <span className="cs-btn" style={{ background: "#fff", color: "#a5502c" }}>
                          {banner.cta}
                        </span>
                      </div>
                    </>)}
                  {sec("projetos", <>
                    <div className="cs-section">
                      <span className="cs-eyebrow">Projetos recentes</span>
                      <h3>Obras entregues em 2025 e 2026</h3>
                      <div className="cs-grid">
                        {projects.map((p) => (
                          <div key={p.id} className="cs-proj">
                            <img src={img(p.cover, 520, 390)} alt={p.title} loading="lazy" />
                            <b>{p.title}</b>
                            <span>
                              {p.category}, {p.city}, {p.area} m²
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>)}
                  {sec("equipe", <>
                    <div className="cs-section" style={{ background: "#f7f2ea" }}>
                      <span className="cs-eyebrow">Quem desenha</span>
                      <h3>A equipe</h3>
                      <div className="cs-team">
                        {team.map((t) => (
                          <div key={t.id} className="cs-member">
                            <img src={face(t.photo, 300)} alt={t.name} loading="lazy" />
                            <b>{t.name}</b>
                            <span>{t.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>)}
                  {sec("depoimentos", <>
                    <div className="cs-section cs-dep">
                      <span className="cs-eyebrow" style={{ color: "#e3a27a" }}>
                        Depoimentos
                      </span>
                      <h3>Quem já mora num projeto nosso</h3>
                      <div className="cs-quotes">
                        {quotes.map((q) => (
                          <div key={q.id} className="cs-quote">
                            <p>&ldquo;{q.quote}&rdquo;</p>
                            <div className="who">
                              <img src={face(q.photo, 80)} alt={q.author} loading="lazy" />
                              <div>
                                <b>{q.author}</b>
                                <div style={{ opacity: 0.7 }}>{q.context}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>)}
                  {sec("rodape", <>
                    <div className="cs-foot">
                      <div>
                        <b>Cumaru Arquitetura</b>
                        Rua Harmonia, Vila Madalena, São Paulo
                      </div>
                      <div>
                        <b>Telefone</b>
                        <Phone size={12} style={{ display: "inline", marginRight: 6 }} />
                        (11) 3021-4455
                      </div>
                      <div>
                        <b>WhatsApp</b>
                        <MessageCircle size={12} style={{ display: "inline", marginRight: 6 }} />
                        (11) 98877-1020
                      </div>
                      <div>
                        <b>Visitas</b>
                        <MapPin size={12} style={{ display: "inline", marginRight: 6 }} />
                        Segunda a sexta, 9h às 18h
                      </div>
                    </div>
                  </>)}
                </div>
              ) : (
                <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                  <Sk h={40} />
                  <Sk h={300} />
                  <Sk h={40} />
                  <div style={{ display: "flex", gap: 12 }}>
                    <Sk h={140} />
                    <Sk h={140} />
                    <Sk h={140} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="card" style={{ flex: "1 1 260px", minWidth: 0 }}>
          <div className="card-head">
            <div>
              <h2>Marcações na Home</h2>
              <p>{openPins.length} abertas, cada uma no ponto exato</p>
            </div>
          </div>
          {pins.length === 0 ? (
            <Empty icon={<Crosshair size={22} />} title="Nenhuma marcação" text="Ligue Marcar mudança e clique na página." />
          ) : (
            <div className="list">
              {[...pins]
                .sort((a, b) => Number(a.status === "publicado") - Number(b.status === "publicado"))
                .map((p) => (
                  <button
                    key={p.id}
                    className="row"
                    style={{ border: 0, borderBottom: "1px solid var(--line)", background: "transparent", textAlign: "left", width: "100%" }}
                    onClick={() => setSel(p.id)}
                  >
                    <span className={`pin ${p.status === "publicado" ? "done" : ""}`} style={{ position: "static", margin: 0, animation: "none" }}>
                      {p.id.slice(2)}
                    </span>
                    <span className="grow">
                      <span className="title" style={{ display: "block", fontSize: 14 }}>
                        {p.title}
                      </span>
                      <span className="sub" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                        <StatusChip s={p.status} />
                        {SECTIONS[p.pin!.section]} · {haQuanto(p.createdAt)}
                      </span>
                    </span>
                  </button>
                ))}
            </div>
          )}
        </aside>
      </div>

      {preset && <NewRequestModal preset={{ page: "home", section: preset.section, pin: preset.pin }} onClose={() => setPreset(null)} />}
      {selected && <RequestDrawer key={selected.id} r={selected} onClose={() => setSel(null)} />}
    </>
  );
}
