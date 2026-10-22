"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, FileCode2, Gauge, ImageDown, Images, Wand2 } from "lucide-react";
import { useLoaded, useStore } from "@/lib/store";
import { IMAGES, PAGES, PAGE_NAME, SCRIPTS } from "@/lib/mock/site";
import { kb, num, seg, tempo4g } from "@/lib/format";
import { img } from "@/lib/photos";
import type { ScriptMode } from "@/lib/types";
import { Sk, SkRows, Spinner, Tilt } from "@/components/ui";

const MODE_LABEL: Record<ScriptMode, string> = { normal: "Na abertura", adiado: "Depois", removido: "Fora" };

export default function Velocidade() {
  const ready = useLoaded(700);
  const { pageWeight, scripts, images, setScriptMode, optimizeImage, optimizeAll, toast } = useStore();
  const [pageId, setPageId] = useState("home");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("pagina");
    if (p && PAGES.some((x) => x.id === p)) setPageId(p);
  }, []);

  const original = (id: string) => {
    const p = PAGES.find((x) => x.id === id)!;
    const im = IMAGES.filter((i) => i.page === id).reduce((s, i) => s + i.weightKb, 0);
    const sc = SCRIPTS.filter((s) => s.pages === "todas" || s.pages.includes(id)).reduce((s, x) => s + x.weightKb, 0);
    return p.baseKb + im + sc;
  };

  const w = pageWeight(pageId);
  const before = original(pageId);
  const page = PAGES.find((p) => p.id === pageId)!;
  const heroImg = images.find((i) => i.page === pageId);
  const pending = images.filter((i) => i.status !== "otimizada").length;
  const activeScripts = scripts.filter((s) => s.mode === "normal").length;
  const siteNow = useMemo(() => PAGES.reduce((s, p) => s + pageWeight(p.id).total, 0), [pageWeight]);
  const maxW = Math.max(...PAGES.map((p) => original(p.id)));

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    await fn();
    setBusy(null);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Estrada boa, porta-malas cheio de tijolo</div>
          <h1>Velocidade</h1>
          <p>
            A hospedagem do Webflow já é rápida. O que pesa é o que foi colado por cima: chat, pixel, foto no tamanho da câmera. Aqui cada quilo tem nome,
            e sai pelo número, não pelo palpite.
          </p>
        </div>
        <select className="select" value={pageId} onChange={(e) => setPageId(e.target.value)} aria-label="Página">
          {PAGES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-kpi">
        {ready ? (
          <>
            <Tilt className="card kpi">
              <div className="k-top">
                {page.name}
                <span className="k-ico">
                  <Gauge size={16} />
                </span>
              </div>
              <div className="k-val">{kb(w.total)}</div>
              <div className="k-foot">{w.total < before ? `era ${kb(before)}` : "peso na abertura da página"}</div>
            </Tilt>
            <Tilt className="card kpi">
              <div className="k-top">
                No 4G
                <span className="k-ico">
                  <Clock3 size={16} />
                </span>
              </div>
              <div className="k-val">{seg(tempo4g(w.total))}</div>
              <div className="k-foot">{w.total < before ? `era ${seg(tempo4g(before))}` : "até a foto principal aparecer"}</div>
            </Tilt>
            <Tilt className="card kpi">
              <div className="k-top">
                Fotos para otimizar
                <span className="k-ico">
                  <Images size={16} />
                </span>
              </div>
              <div className="k-val">{pending}</div>
              <div className="k-foot">de {images.length} pesadas no site</div>
            </Tilt>
            <Tilt className="card kpi">
              <div className="k-top">
                Códigos na abertura
                <span className="k-ico">
                  <FileCode2 size={16} />
                </span>
              </div>
              <div className="k-val">{activeScripts}</div>
              <div className="k-foot">site inteiro: {kb(siteNow)}</div>
            </Tilt>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Sk key={i} h={118} r={18} />)
        )}
      </div>

      <section className="card" style={{ marginBottom: 18 }}>
        <div className="card-head">
          <div>
            <h2>Do que é feito o peso de {page.name}</h2>
            <p>
              {num(page.visits)} visitas e {page.leads} contatos no último mês
            </p>
          </div>
        </div>
        {ready ? (
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            {heroImg && (
              <div className="photo-strip" style={{ flex: "1 1 220px", maxWidth: 320, minHeight: 140 }}>
                <img src={img(heroImg.photo, 640, 360)} alt={heroImg.file} />
              </div>
            )}
            <div style={{ flex: "3 1 300px", minWidth: 0 }}>
              <div className="bar" style={{ height: 18 }}>
                <span className="b-base" style={{ width: `${(w.base / maxW) * 100}%` }} />
                <span className="b-img" style={{ width: `${(w.imgs / maxW) * 100}%` }} />
                <span className="b-scr" style={{ width: `${(w.scr / maxW) * 100}%` }} />
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10, fontSize: 13.5 }}>
                <span>
                  <i className="legend-dot" style={{ display: "inline-block", background: "var(--petrol)", marginRight: 6 }} />
                  Código e fontes da página {kb(w.base)}
                </span>
                <span>
                  <i className="legend-dot" style={{ display: "inline-block", background: "var(--copper)", marginRight: 6 }} />
                  Fotos {kb(w.imgs)}
                </span>
                <span>
                  <i className="legend-dot" style={{ display: "inline-block", background: "var(--warn)", marginRight: 6 }} />
                  Códigos colados por cima {kb(w.scr)}
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 0 }}>
                A primeira faixa é o Webflow. O resto entrou depois, um pedaço por vez, e ninguém tirou.
              </p>
            </div>
          </div>
        ) : (
          <Sk h={140} />
        )}
      </section>

      <div className="grid-2" style={{ marginBottom: 18 }}>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Códigos colados por cima</h2>
              <p>Carregar depois tira o peso da abertura sem perder a medição</p>
            </div>
          </div>
          {!ready ? (
            <SkRows n={6} h={64} />
          ) : (
            <div className="list">
              {scripts.map((s) => (
                <div key={s.id} className="row" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
                  <span className="grow" style={{ flexBasis: 200 }}>
                    <span className="title" style={{ display: "block", textDecoration: s.mode === "removido" ? "line-through" : "none" }}>
                      {s.name} <span className="sub">· {kb(s.weightKb)}</span>
                    </span>
                    <span className="sub" style={{ display: "block" }}>
                      {s.purpose}. {s.pages === "todas" ? "Todas as páginas" : s.pages.map((p) => PAGE_NAME[p]).join(", ")}. Colado por {s.addedBy.toLowerCase()}.
                    </span>
                    {s.note && (
                      <span className="sub" style={{ display: "block", color: "#9a6510" }}>
                        {s.note}
                      </span>
                    )}
                  </span>
                  <div className="seg" aria-label={`Quando carregar ${s.name}`}>
                    {(["normal", "adiado", "removido"] as ScriptMode[]).map((m) => (
                      <button
                        key={m}
                        className={s.mode === m ? "on" : ""}
                        disabled={busy === s.id}
                        onClick={() =>
                          s.mode !== m &&
                          run(s.id, async () => {
                            await setScriptMode(s.id, m);
                            toast(m === "removido" ? `${s.name} saiu do site` : m === "adiado" ? `${s.name} agora carrega depois da página` : `${s.name} voltou para a abertura`);
                          })
                        }
                      >
                        {MODE_LABEL[m]}
                      </button>
                    ))}
                    {busy === s.id && <Spinner size={14} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h2>Fotos no tamanho da câmera</h2>
              <p>Foto de 6.000 pixels mostrada num espaço de 1.600</p>
            </div>
            <button
              className="btn sm primary"
              disabled={pending === 0 || busy === "all"}
              onClick={() =>
                run("all", async () => {
                  const r = await optimizeAll();
                  toast(
                    r.fail > 0 ? `${r.ok} fotos otimizadas. ${r.fail} precisa ser exportada de novo, veja o aviso.` : `${r.ok} fotos otimizadas`,
                    r.fail > 0 ? "info" : "ok",
                  );
                })
              }
            >
              {busy === "all" ? <Spinner size={14} /> : <Wand2 size={14} />} Otimizar todas
            </button>
          </div>
          {!ready ? (
            <SkRows n={6} h={64} />
          ) : (
            <div className="list">
              {images.map((i) => (
                <div key={i.id} className="row" style={{ flexWrap: "wrap" }}>
                  <img src={img(i.photo, 120, 90)} width={60} height={45} alt={i.file} style={{ borderRadius: 8, objectFit: "cover", flex: "none" }} loading="lazy" />
                  <span className="grow" style={{ flexBasis: 160 }}>
                    <span className="title truncate" style={{ display: "block", fontSize: 14 }}>
                      {i.file}
                    </span>
                    <span className="sub" style={{ display: "block" }}>
                      {PAGE_NAME[i.page]} · {num(i.originalPx)} px mostrada em {num(i.shownPx)} ·{" "}
                      {i.status === "otimizada" ? (
                        <>
                          <s>{kb(i.weightKb)}</s> <b style={{ color: "var(--ok)" }}>{kb(i.optimizedKb)}</b>
                        </>
                      ) : (
                        kb(i.weightKb)
                      )}
                    </span>
                    {i.status === "falhou" && (
                      <span className="sub" style={{ display: "flex", gap: 6, color: "var(--err)", marginTop: 2 }}>
                        <AlertTriangle size={13} style={{ flex: "none", marginTop: 2 }} /> {i.failReason}
                      </span>
                    )}
                  </span>
                  {i.status === "otimizada" ? (
                    <span className="chip ok">
                      <CheckCircle2 size={12} /> Otimizada
                    </span>
                  ) : (
                    <button
                      className="btn sm"
                      disabled={busy === i.id || busy === "all"}
                      onClick={() =>
                        run(i.id, async () => {
                          const ok = await optimizeImage(i.id);
                          toast(ok ? `${i.file} caiu de ${kb(i.weightKb)} para ${kb(i.optimizedKb)}` : `${i.file} não dá para otimizar automaticamente`, ok ? "ok" : "erro");
                        })
                      }
                    >
                      {busy === i.id ? <Spinner size={13} /> : <ImageDown size={14} />} {i.status === "falhou" ? "Tentar de novo" : "Otimizar"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Todas as páginas</h2>
            <p>Clique numa página para ver do que é feito o peso dela</p>
          </div>
        </div>
        {!ready ? (
          <SkRows n={8} h={44} />
        ) : (
          <div className="list">
            {PAGES.map((p) => {
              const pw = pageWeight(p.id);
              const ob = original(p.id);
              return (
                <button
                  key={p.id}
                  className="row"
                  style={{ border: 0, borderBottom: "1px solid var(--line)", background: p.id === pageId ? "var(--copper-soft)" : "transparent", width: "100%", textAlign: "left", flexWrap: "wrap" }}
                  onClick={() => {
                    setPageId(p.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span style={{ flex: "1 1 170px", minWidth: 0 }}>
                    <span className="title" style={{ display: "block" }}>
                      {p.name}
                    </span>
                    <span className="sub">{p.path}</span>
                  </span>
                  <span style={{ flex: "2 1 200px", minWidth: 0 }}>
                    <span className="bar" style={{ height: 8 }}>
                      <span className="b-base" style={{ width: `${(pw.base / maxW) * 100}%` }} />
                      <span className="b-img" style={{ width: `${(pw.imgs / maxW) * 100}%` }} />
                      <span className="b-scr" style={{ width: `${(pw.scr / maxW) * 100}%` }} />
                    </span>
                  </span>
                  <span style={{ width: 150, textAlign: "right", fontSize: 13.5 }}>
                    <b>{kb(pw.total)}</b>
                    <span className="sub"> · {seg(tempo4g(pw.total))}</span>
                    {pw.total < ob && (
                      <span className="sub" style={{ display: "block", color: "var(--ok)" }}>
                        menos {kb(ob - pw.total)}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
