"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Cable, Clock3, Gauge, Inbox, LayoutTemplate, Plus, Rocket, ShieldAlert, TriangleAlert } from "lucide-react";
import { useLoaded, useStore } from "@/lib/store";
import { PAGES, PAGE_NAME } from "@/lib/mock/site";
import { SECTIONS, TYPE_LABEL } from "@/lib/mock/requests";
import { dataCurta, haQuanto, kb, num, seg, tempo4g } from "@/lib/format";
import { Wiring } from "@/components/three/Scenes";
import { Sk, SkRows, Tilt } from "@/components/ui";
import { NewRequestModal, RequestDrawer, StatusChip, TypeIcon } from "@/components/requests";

const PRIO = { alta: 0, normal: 1, baixa: 2 } as const;

export default function Overview() {
  const ready = useLoaded(700);
  const { requests, health, publications, pageWeight, images, scripts } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const queue = useMemo(
    () =>
      requests
        .filter((r) => r.status !== "publicado")
        .sort((a, b) => PRIO[a.priority] - PRIO[b.priority] || b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 6),
    [requests],
  );
  const leadPages = useMemo(() => [...PAGES].sort((a, b) => b.leads - a.leads).slice(0, 5), []);
  const maxLeads = leadPages[0].leads;
  const lastPub = publications.find((p) => p.state === "no-ar") ?? publications[0];
  const homeOriginal = useMemo(() => {
    const p = PAGES.find((x) => x.id === "home")!;
    const im = images.filter((i) => i.page === "home").reduce((s, i) => s + i.weightKb, 0);
    const sc = scripts.filter((s) => s.pages === "todas" || s.pages.includes("home")).reduce((s, x) => s + x.weightKb, 0);
    return p.baseKb + im + sc;
  }, [images, scripts]);
  const loose = health.unused + health.dups;
  const selected = requests.find((r) => r.id === sel);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Sexta, 23 de outubro</div>
          <h1>Bom dia, Helena</h1>
          <p>O site da Cumaru está no ar. Aqui está o que está acontecendo com ele esta semana, e o que vem antes de qualquer página nova.</p>
        </div>
        <div className="head-actions">
          <Link href="/site" className="btn">
            <LayoutTemplate size={16} /> Ver o site
          </Link>
          <button className="btn primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Novo pedido
          </button>
        </div>
      </div>

      <section className="hero">
        <Wiring loose={loose} />
        <div className="hero-copy">
          <span className="eyebrow">A Home, seção por seção</span>
          <h2>Cada parte da página ligada ao seu disjuntor</h2>
          <p>
            Os fios de cobre levam cada seção à classe que dá o visual a ela. Os fios soltos, em âmbar, são classes sem uso ou repetidas: ninguém sabe o
            que desligam, então ninguém desliga, e cada ajuste puxa mais um.
          </p>
          <div className="score">
            <b>{ready ? health.score : "--"}</b>
            <span style={{ color: "#b9c4cb" }}>de 100, saúde do site</span>
          </div>
          <div>
            <Link href="/estilos" className="btn primary">
              <Cable size={16} /> Abrir o quadro de classes
            </Link>
          </div>
        </div>
        <div className="hero-legend">
          <span>
            <i className="legend-dot" style={{ background: "#c8764a" }} /> Fio ligado
          </span>
          <span>
            <i className="legend-dot" style={{ background: "#e0962a" }} /> Fio solto: {loose}
          </span>
        </div>
      </section>

      {loose > 0 ? (
        <div className="insight">
          <div className="ins-ico">
            <TriangleAlert size={20} />
          </div>
          <div>
            <h3>Antes da próxima página nova</h3>
            <p>
              O quadro tem {health.unused} classes sem uso e {health.dups} repetidas. Uma página nova montada em cima disso herda a bagunça: a décima
              página sai cara por causa de como a primeira foi feita. Limpar agora é etiquetar os disjuntores antes de mexer na fiação.
            </p>
            <Link href="/estilos" className="btn sm dark">
              Limpar o quadro <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="insight" style={{ background: "linear-gradient(120deg, var(--ok-soft), var(--surface))", borderColor: "#c4e4d1" }}>
          <div className="ins-ico" style={{ background: "var(--ok)" }}>
            <Cable size={20} />
          </div>
          <div>
            <h3>Quadro em ordem</h3>
            <p>Nenhum fio solto. Agora uma página nova nasce dos componentes que já existem, e um ajuste na Home não mexe em página esquecida.</p>
          </div>
        </div>
      )}

      <div className="grid-kpi">
        {ready ? (
          <>
            <Tilt className="card kpi">
              <div className="k-top">
                Pedidos abertos
                <span className="k-ico">
                  <Inbox size={16} />
                </span>
              </div>
              <div className="k-val">{health.open}</div>
              <div className="k-foot">{requests.filter((r) => r.status === "revisao").length} prontos para revisar</div>
            </Tilt>
            <Tilt className="card kpi" style={{ animationDelay: "60ms" }}>
              <div className="k-top">
                Peso da Home
                <span className="k-ico">
                  <Gauge size={16} />
                </span>
              </div>
              <div className="k-val">{kb(health.homeKb)}</div>
              <div className="k-foot">{health.homeKb < homeOriginal ? `era ${kb(homeOriginal)}` : "foto da abertura no tamanho da câmera"}</div>
            </Tilt>
            <Tilt className="card kpi" style={{ animationDelay: "120ms" }}>
              <div className="k-top">
                Home no 4G
                <span className="k-ico">
                  <Clock3 size={16} />
                </span>
              </div>
              <div className="k-val">{seg(tempo4g(health.homeKb))}</div>
              <div className="k-foot">até a foto principal aparecer</div>
            </Tilt>
            <Tilt className="card kpi" style={{ animationDelay: "180ms" }}>
              <div className="k-top">
                Fios soltos
                <span className="k-ico">
                  <Cable size={16} />
                </span>
              </div>
              <div className="k-val">{loose}</div>
              <div className="k-foot">
                {health.unused} sem uso, {health.dups} repetidas
              </div>
            </Tilt>
            <Tilt className="card kpi" style={{ animationDelay: "240ms" }}>
              <div className="k-top">
                Última publicação
                <span className="k-ico">
                  <Rocket size={16} />
                </span>
              </div>
              <div className="k-val" style={{ fontSize: 22, marginTop: 12 }}>
                {dataCurta(lastPub.at)}
              </div>
              <div className="k-foot">com backup antes, {haQuanto(lastPub.at)}</div>
            </Tilt>
          </>
        ) : (
          Array.from({ length: 5 }).map((_, i) => <Sk key={i} h={118} r={18} />)
        )}
      </div>

      {health.risky > 0 && (
        <div className="callout warn" style={{ marginBottom: 18 }}>
          <ShieldAlert size={20} color="#9a6510" style={{ flex: "none", marginTop: 2 }} />
          <div>
            <b>
              {health.risky} {health.risky === 1 ? "ajuste está" : "ajustes estão"} sendo feitos direto na página que está no ar
            </b>
            <p>
              Publicar qualquer outra coisa hoje levaria esses ajustes pela metade, como abrir a loja com a vitrine ainda sendo montada.{" "}
              <Link href="/publicacao" style={{ color: "var(--copper)", fontWeight: 500 }}>
                Ver na publicação
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Fila da semana</h2>
              <p>O que está aberto, pela prioridade</p>
            </div>
            <Link href="/pedidos" className="btn sm">
              Todos os pedidos <ArrowRight size={14} />
            </Link>
          </div>
          {ready ? (
            <div className="list">
              {queue.map((r) => (
                <button key={r.id} className="row" style={{ border: 0, borderBottom: "1px solid var(--line)", background: "transparent", textAlign: "left", width: "100%" }} onClick={() => setSel(r.id)}>
                  <span className="k-ico" style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--bg-2)", flex: "none" }}>
                    <TypeIcon t={r.type} size={16} />
                  </span>
                  <span className="grow">
                    <span className="title truncate" style={{ display: "block" }}>
                      {r.title}
                    </span>
                    <span className="sub">
                      {PAGE_NAME[r.page]}, {SECTIONS[r.section]?.toLowerCase()} · {TYPE_LABEL[r.type]} · {haQuanto(r.createdAt)}
                    </span>
                  </span>
                  <span className="hide-sm">
                    <StatusChip s={r.status} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <SkRows n={6} h={48} />
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h2>Páginas que mais trazem contato</h2>
              <p>Último mês. É nelas que cada ajuste pede mais cuidado</p>
            </div>
          </div>
          {ready ? (
            <div className="list">
              {leadPages.map((p) => {
                const w = pageWeight(p.id).total;
                return (
                  <Link key={p.id} href={`/velocidade?pagina=${p.id}`} className="row">
                    <span className="grow">
                      <span className="title" style={{ display: "block" }}>
                        {p.name}
                      </span>
                      <span className="bar" style={{ marginTop: 6, height: 7 }}>
                        <span className="b-img" style={{ width: `${(p.leads / maxLeads) * 100}%`, background: "var(--grad-copper)" }} />
                      </span>
                      <span className="sub">
                        {num(p.visits)} visitas · {kb(w)} · {seg(tempo4g(w))} no 4G
                      </span>
                    </span>
                    <b style={{ fontSize: 20 }}>{p.leads}</b>
                    <span className="sub" style={{ marginLeft: -6 }}>
                      contatos
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <SkRows n={5} h={56} />
          )}
        </section>
      </div>

      {creating && <NewRequestModal onClose={() => setCreating(false)} />}
      {selected && <RequestDrawer key={selected.id} r={selected} onClose={() => setSel(null)} />}
    </>
  );
}
