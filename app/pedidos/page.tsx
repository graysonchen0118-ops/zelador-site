"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Inbox, Plus, Search, SearchX } from "lucide-react";
import { useLoaded, useStore } from "@/lib/store";
import { PAGES, PAGE_NAME } from "@/lib/mock/site";
import { STATUS_LABEL, TYPE_LABEL } from "@/lib/mock/requests";
import { haQuanto } from "@/lib/format";
import type { RequestStatus, RequestType } from "@/lib/types";
import { Empty, Sk, useTilt } from "@/components/ui";
import { NewRequestModal, RequestDrawer, STATUS_COLOR, TypeIcon } from "@/components/requests";
import type { ChangeRequest } from "@/lib/types";

const COLS: RequestStatus[] = ["recebido", "em-obra", "revisao", "publicado"];
const HINT: Record<RequestStatus, string> = {
  recebido: "Chegou, ainda não foi aberto",
  "em-obra": "Sendo feito, de preferência numa cópia",
  revisao: "Pronto, esperando o seu olho",
  publicado: "Já está no ar",
};

function Card({ r, onOpen, i }: { r: ChangeRequest; onOpen: () => void; i: number }) {
  const t = useTilt<HTMLButtonElement>(5);
  const risky = r.status === "em-obra" && !r.inDraft;
  return (
    <button
      ref={t.ref}
      onPointerMove={t.onPointerMove}
      onPointerLeave={t.onPointerLeave}
      className={`req tilt ${risky ? "risk" : ""}`}
      style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
      onClick={onOpen}
    >
      <span className="r-top">
        <b style={{ color: "var(--ink)" }}>{r.id}</b>· {PAGE_NAME[r.page]}
        <span style={{ marginLeft: "auto" }}>{haQuanto(r.updatedAt)}</span>
      </span>
      <span className="r-title">{r.title}</span>
      <span className="r-foot">
        <span className="chip">
          <TypeIcon t={r.type} size={12} /> {TYPE_LABEL[r.type]}
        </span>
        {r.priority === "alta" && <span className="chip err">Alta</span>}
        {r.status === "em-obra" && (risky ? <span className="chip warn"><AlertTriangle size={12} /> Direto no ar</span> : <span className="chip petrol">Em cópia</span>)}
        {r.pin && <span className="chip copper">Marcado na página</span>}
      </span>
    </button>
  );
}

export default function Pedidos() {
  const ready = useLoaded(700);
  const { requests } = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState<RequestType | "todos">("todos");
  const [page, setPage] = useState("todas");
  const [only, setOnly] = useState<RequestStatus | "todos">("todos");
  const [sort, setSort] = useState<"recentes" | "prioridade">("recentes");
  const [sel, setSel] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const pr = { alta: 0, normal: 1, baixa: 2 };
    return requests
      .filter((r) => (type === "todos" ? true : r.type === type))
      .filter((r) => (page === "todas" ? true : r.page === page))
      .filter((r) => !term || `${r.id} ${r.title} ${r.notes} ${r.requester}`.toLowerCase().includes(term))
      .sort((a, b) => (sort === "prioridade" ? pr[a.priority] - pr[b.priority] : 0) || b.updatedAt.localeCompare(a.updatedAt));
  }, [requests, q, type, page, sort]);

  const cols = only === "todos" ? COLS : [only];
  const selected = requests.find((r) => r.id === sel);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">{requests.filter((r) => r.status !== "publicado").length} abertos</div>
          <h1>Pedidos</h1>
          <p>Tudo que alguém da Cumaru pediu para o site, do telefone trocado à página nova. Nada fica perdido num áudio de WhatsApp.</p>
        </div>
        <div className="head-actions">
          <button className="btn primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Novo pedido
          </button>
        </div>
      </div>

      <div className="toolbar">
        <label className="search">
          <Search size={16} color="var(--muted)" />
          <input placeholder="Buscar por título, número ou pessoa" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="select" value={type} onChange={(e) => setType(e.target.value as RequestType | "todos")} aria-label="Tipo">
          <option value="todos">Todos os tipos</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select className="select" value={page} onChange={(e) => setPage(e.target.value)} aria-label="Página">
          <option value="todas">Todas as páginas</option>
          {PAGES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as "recentes" | "prioridade")} aria-label="Ordem">
          <option value="recentes">Mais recentes</option>
          <option value="prioridade">Prioridade</option>
        </select>
      </div>

      <div className="seg" style={{ marginBottom: 16 }}>
        <button className={only === "todos" ? "on" : ""} onClick={() => setOnly("todos")}>
          Quadro inteiro
        </button>
        {COLS.map((c) => (
          <button key={c} className={only === c ? "on" : ""} onClick={() => setOnly(c)}>
            <span className="col-dot" style={{ background: STATUS_COLOR[c] }} />
            {STATUS_LABEL[c]} <span className="n">{filtered.filter((r) => r.status === c).length}</span>
          </button>
        ))}
      </div>

      {!ready ? (
        <div className="board">
          {COLS.map((c) => (
            <div key={c} className="col">
              <Sk h={20} w="50%" style={{ marginBottom: 12 }} />
              <div className="col-list">
                <Sk h={96} />
                <Sk h={96} />
                <Sk h={96} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <Empty
            icon={<SearchX size={22} />}
            title="Nenhum pedido com esse filtro"
            text="Tente outra palavra ou volte para todas as páginas."
            action={
              <button
                className="btn sm"
                onClick={() => {
                  setQ("");
                  setType("todos");
                  setPage("todas");
                }}
              >
                Limpar filtros
              </button>
            }
          />
        </div>
      ) : (
        <div className="board">
          {cols.map((c) => {
            const items = filtered.filter((r) => r.status === c);
            return (
              <div key={c} className="col">
                <div className="col-head">
                  <span className="col-dot" style={{ background: STATUS_COLOR[c] }} />
                  {STATUS_LABEL[c]}
                  <span className="n">{items.length}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "-6px 4px 10px" }}>{HINT[c]}</div>
                <div className="col-list">
                  {items.length === 0 ? (
                    <Empty icon={<Inbox size={20} />} title="Vazio" text="Nada aqui agora." />
                  ) : (
                    items.map((r, i) => <Card key={r.id} r={r} i={i} onOpen={() => setSel(r.id)} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && <NewRequestModal onClose={() => setCreating(false)} />}
      {selected && <RequestDrawer key={selected.id} r={selected} onClose={() => setSel(null)} />}
    </>
  );
}
