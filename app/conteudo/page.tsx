"use client";

import { useMemo, useState } from "react";
import { Eye, Lightbulb, Plus, Search, SearchX, Star, Trash2 } from "lucide-react";
import { useLoaded, useStore, type CollectionKey, type Collections } from "@/lib/store";
import { FACE, PH, face, img } from "@/lib/photos";
import { dataCurta, haQuanto } from "@/lib/format";
import { Drawer, Empty, Sk, Spinner, Toggle, useTilt } from "@/components/ui";

type Item = Collections[CollectionKey][number];
type Draft = Record<string, string | number | boolean>;

type Field = { k: string; label: string; kind: "text" | "area" | "number" | "select" | "face" | "photo" | "toggle"; options?: string[] };

const CONF: Record<CollectionKey, { label: string; one: string; novo: string; fields: Field[]; blank: () => Draft }> = {
  equipe: {
    label: "Equipe",
    one: "pessoa",
    novo: "Nova pessoa",
    fields: [
      { k: "name", label: "Nome", kind: "text" },
      { k: "role", label: "Cargo", kind: "text" },
      { k: "bio", label: "Uma frase sobre a pessoa", kind: "area" },
      { k: "photo", label: "Foto", kind: "face" },
    ],
    blank: () => ({ name: "", role: "", bio: "", photo: FACE.c11, status: "rascunho" }),
  },
  depoimentos: {
    label: "Depoimentos",
    one: "depoimento",
    novo: "Novo depoimento",
    fields: [
      { k: "author", label: "Quem fala", kind: "text" },
      { k: "context", label: "Projeto", kind: "text" },
      { k: "quote", label: "Depoimento", kind: "area" },
      { k: "photo", label: "Foto", kind: "face" },
    ],
    blank: () => ({ author: "", context: "", quote: "", photo: FACE.c1, status: "rascunho" }),
  },
  projetos: {
    label: "Projetos",
    one: "projeto",
    novo: "Novo projeto",
    fields: [
      { k: "title", label: "Nome do projeto", kind: "text" },
      { k: "city", label: "Cidade ou bairro", kind: "text" },
      { k: "category", label: "Tipo", kind: "select", options: ["Casa", "Apartamento", "Interiores", "Comercial"] },
      { k: "year", label: "Ano", kind: "number" },
      { k: "area", label: "Área em m²", kind: "number" },
      { k: "cover", label: "Foto de capa", kind: "photo" },
      { k: "featured", label: "Aparece na Home", kind: "toggle" },
    ],
    blank: () => ({ title: "", city: "", category: "Casa", year: 2026, area: 120, cover: PH.salaVista, featured: false, status: "rascunho" }),
  },
  banners: {
    label: "Faixas",
    one: "faixa",
    novo: "Nova faixa",
    fields: [
      { k: "title", label: "Título", kind: "text" },
      { k: "subtitle", label: "Texto", kind: "text" },
      { k: "cta", label: "Botão", kind: "text" },
      { k: "until", label: "No ar até", kind: "text" },
    ],
    blank: () => ({ title: "", subtitle: "", cta: "Saiba mais", until: "2026-12-31", status: "rascunho" }),
  },
  blog: {
    label: "Blog",
    one: "post",
    novo: "Novo post",
    fields: [
      { k: "title", label: "Título", kind: "text" },
      { k: "category", label: "Categoria", kind: "select", options: ["Reforma", "Projeto", "Materiais", "Interiores"] },
      { k: "readMin", label: "Minutos de leitura", kind: "number" },
      { k: "cover", label: "Foto de capa", kind: "photo" },
    ],
    blank: () => ({ title: "", category: "Reforma", readMin: 5, cover: PH.estante, status: "rascunho" }),
  },
};

const FACES = [FACE.c11, FACE.c1, FACE.c2, FACE.c3, FACE.c4, FACE.c5, FACE.c6, FACE.c7, FACE.c8, FACE.c9, FACE.c10, FACE.tiago];
const PHOTOS = [PH.salaVista, PH.sacada, PH.estante, PH.salaQuadros, PH.lareira, PH.janelaVale, PH.loft, PH.vaoLivre, PH.corredorVidro, PH.jantarMontanha, PH.salaCidade, PH.bege];

function titleOf(key: CollectionKey, d: Draft | Item): string {
  const x = d as Record<string, unknown>;
  return String(key === "equipe" ? x.name : key === "depoimentos" ? x.author : x.title);
}

function subOf(key: CollectionKey, d: Draft | Item): string {
  const x = d as Record<string, unknown>;
  if (key === "equipe") return String(x.role);
  if (key === "depoimentos") return String(x.context);
  if (key === "projetos") return `${x.category}, ${x.city}, ${x.area} m²`;
  if (key === "banners") return String(x.subtitle);
  return `${x.category}, ${x.readMin} min de leitura`;
}

function picOf(key: CollectionKey, d: Draft | Item, w = 480, h = 300): string | null {
  const x = d as Record<string, unknown>;
  if (key === "equipe" || key === "depoimentos") return face(String(x.photo), 400);
  if (key === "projetos" || key === "blog") return img(String(x.cover), w, h);
  return null;
}

function ItemCard({ k, it, onOpen, i }: { k: CollectionKey; it: Item; onOpen: () => void; i: number }) {
  const t = useTilt<HTMLButtonElement>(5);
  const pic = picOf(k, it);
  return (
    <button ref={t.ref} onPointerMove={t.onPointerMove} onPointerLeave={t.onPointerLeave} className="item-card tilt" style={{ animationDelay: `${Math.min(i, 10) * 40}ms`, cursor: "pointer" }} onClick={onOpen}>
      {pic ? (
        <img className="ic-img" src={pic} alt={titleOf(k, it)} loading="lazy" style={k === "equipe" || k === "depoimentos" ? { aspectRatio: "16 / 11", objectPosition: "center 25%" } : undefined} />
      ) : (
        <div className="ic-img" style={{ background: "var(--grad-copper)", display: "grid", placeItems: "center", color: "#fff", padding: 16, aspectRatio: "16 / 7" }}>
          <b style={{ fontSize: 17, textAlign: "center" }}>{titleOf(k, it)}</b>
        </div>
      )}
      <div className="ic-body">
        <b>{titleOf(k, it)}</b>
        <span>{subOf(k, it)}</span>
        <div className="ic-foot">
          <span className={`chip ${it.status === "publicado" ? "ok" : "warn"}`}>{it.status === "publicado" ? "Publicado" : "Rascunho"}</span>
          <span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "var(--muted)" }}>
            {"featured" in it && it.featured && <Star size={13} color="var(--copper)" fill="var(--copper)" />}
            {haQuanto(it.updatedAt)}
          </span>
        </div>
      </div>
    </button>
  );
}

function Editor({ k, item, onClose }: { k: CollectionKey; item: Item | null; onClose: () => void }) {
  const { saveItem, deleteItem, toast } = useStore();
  const conf = CONF[k];
  const [d, setD] = useState<Draft>(() => (item ? ({ ...(item as unknown as Draft) } as Draft) : conf.blank()));
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const set = (key: string, v: string | number | boolean) => setD((x) => ({ ...x, [key]: v }));
  const pic = picOf(k, d, 720, 420);

  const save = async () => {
    if (titleOf(k, d).trim().length < 3) {
      setErr(true);
      return;
    }
    setBusy("save");
    const id = item?.id ?? `${k.slice(0, 2)}-${Math.random().toString(36).slice(2, 7)}`;
    await saveItem(k, { ...d, id } as unknown as Item);
    setBusy(null);
    toast(item ? `${titleOf(k, d)} atualizado` : `${titleOf(k, d)} criado como ${d.status === "publicado" ? "publicado" : "rascunho"}`);
    onClose();
  };

  return (
    <Drawer
      onClose={onClose}
      sub={<span className="chip copper">{conf.label}</span>}
      title={item ? `Editar ${conf.one}` : conf.novo}
      foot={
        confirmDel && item ? (
          <>
            <span style={{ marginRight: "auto", fontSize: 13.5, color: "var(--err)" }}>Apagar da coleção?</span>
            <button className="btn sm" onClick={() => setConfirmDel(false)}>
              Manter
            </button>
            <button
              className="btn sm danger"
              disabled={busy === "del"}
              onClick={async () => {
                setBusy("del");
                await deleteItem(k, item.id);
                toast(`${titleOf(k, item)} apagado`, "info");
                onClose();
              }}
            >
              {busy === "del" ? <Spinner size={14} /> : <Trash2 size={14} />} Apagar
            </button>
          </>
        ) : (
          <>
            {item && (
              <button className="btn sm ghost" style={{ marginRight: "auto" }} onClick={() => setConfirmDel(true)}>
                <Trash2 size={14} /> Apagar
              </button>
            )}
            <button className="btn sm" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn sm primary" disabled={busy === "save"} onClick={save}>
              {busy === "save" && <Spinner size={14} />} Salvar
            </button>
          </>
        )
      }
    >
      <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Eye size={14} /> Como aparece no site
      </div>
      <div className="item-card" style={{ marginBottom: 18, animation: "none" }}>
        {pic ? (
          <img className="ic-img" src={pic} alt="" style={k === "equipe" || k === "depoimentos" ? { aspectRatio: "16 / 10", objectPosition: "center 30%" } : undefined} />
        ) : (
          <div style={{ background: "#a5502c", color: "#fff", padding: "16px 18px" }}>
            <b>{String(d.title) || "Título da faixa"}</b>
            <div style={{ opacity: 0.85, fontSize: 13.5 }}>{String(d.subtitle) || "Texto da faixa"}</div>
          </div>
        )}
        <div className="ic-body">
          <b>{titleOf(k, d) || "Sem título ainda"}</b>
          {k === "depoimentos" ? <span style={{ fontStyle: "italic" }}>&ldquo;{String(d.quote) || "O depoimento aparece aqui"}&rdquo;</span> : <span>{subOf(k, d)}</span>}
          {k === "equipe" && <span>{String(d.bio)}</span>}
        </div>
      </div>

      {conf.fields.map((f, i) => (
        <div key={f.k} className={`field ${err && i === 0 ? "error" : ""}`}>
          <label htmlFor={`f-${f.k}`}>{f.label}</label>
          {f.kind === "text" && (
            <input
              id={`f-${f.k}`}
              value={String(d[f.k] ?? "")}
              onChange={(e) => {
                set(f.k, e.target.value);
                if (err) setErr(false);
              }}
            />
          )}
          {f.kind === "area" && <textarea id={`f-${f.k}`} value={String(d[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)} />}
          {f.kind === "number" && <input id={`f-${f.k}`} type="number" value={Number(d[f.k] ?? 0)} onChange={(e) => set(f.k, Number(e.target.value))} />}
          {f.kind === "select" && (
            <select id={`f-${f.k}`} value={String(d[f.k])} onChange={(e) => set(f.k, e.target.value)}>
              {f.options!.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          )}
          {f.kind === "toggle" && (
            <label className="check">
              <Toggle on={Boolean(d[f.k])} onChange={(v) => set(f.k, v)} label={f.label} /> {d[f.k] ? "Sim" : "Não"}
            </label>
          )}
          {(f.kind === "face" || f.kind === "photo") && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))", gap: 8 }}>
              {(f.kind === "face" ? FACES : PHOTOS).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set(f.k, p)}
                  aria-label="Escolher foto"
                  style={{
                    padding: 0,
                    border: d[f.k] === p ? "2px solid var(--copper)" : "2px solid transparent",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "none",
                    transition: "transform 0.15s",
                  }}
                >
                  <img src={f.kind === "face" ? face(p, 112) : img(p, 120, 120)} alt="" width={56} height={56} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} loading="lazy" />
                </button>
              ))}
            </div>
          )}
          {err && i === 0 && <span className="err-msg">Preencha este campo antes de salvar.</span>}
        </div>
      ))}

      <div className="field">
        <label>Situação</label>
        <div className="seg">
          <button className={d.status === "rascunho" ? "on" : ""} onClick={() => set("status", "rascunho")}>
            Rascunho
          </button>
          <button className={d.status === "publicado" ? "on" : ""} onClick={() => set("status", "publicado")}>
            Publicado
          </button>
        </div>
      </div>
      {item && <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Última alteração em {dataCurta(item.updatedAt)}</div>}
    </Drawer>
  );
}

export default function Conteudo() {
  const ready = useLoaded(700);
  const { collections } = useStore();
  const [tab, setTab] = useState<CollectionKey>("equipe");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"todos" | "publicado" | "rascunho">("todos");
  const [editing, setEditing] = useState<{ item: Item | null } | null>(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (collections[tab] as Item[])
      .filter((it) => status === "todos" || it.status === status)
      .filter((it) => !term || `${titleOf(tab, it)} ${subOf(tab, it)}`.toLowerCase().includes(term))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [collections, tab, q, status]);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Coleções do CMS</div>
          <h1>Conteúdo</h1>
          <p>O que muda toda semana mora aqui, separado do layout. Trocar uma foto da equipe vira preencher um formulário, sem chamar ninguém.</p>
        </div>
        <div className="head-actions">
          <button className="btn primary" onClick={() => setEditing({ item: null })}>
            <Plus size={16} /> {CONF[tab].novo}
          </button>
        </div>
      </div>

      <div className="callout info" style={{ marginBottom: 18 }}>
        <Lightbulb size={20} color="var(--petrol)" style={{ flex: "none", marginTop: 2 }} />
        <div>
          <b>Isto a equipe da Cumaru muda sozinha</b>
          <p>
            Cada coleção já tem um lugar pronto no layout. Mudar um depoimento pelo Editor não encosta em espaçamento nem em cor, como trocar a lâmpada
            sem abrir o quadro de luz.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          {(Object.keys(CONF) as CollectionKey[]).map((k) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
              {CONF[k].label} <span className="n">{collections[k].length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar">
        <label className="search">
          <Search size={16} color="var(--muted)" />
          <input placeholder={`Buscar em ${CONF[tab].label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as "todos" | "publicado" | "rascunho")} aria-label="Situação">
          <option value="todos">Publicados e rascunhos</option>
          <option value="publicado">Só publicados</option>
          <option value="rascunho">Só rascunhos</option>
        </select>
      </div>

      {!ready ? (
        <div className="grid-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Sk key={i} h={260} r={18} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card">
          <Empty
            icon={<SearchX size={22} />}
            title="Nada por aqui"
            text={q ? "Nenhum item com essa palavra." : "Esta coleção está vazia."}
            action={
              <button className="btn sm primary" onClick={() => setEditing({ item: null })}>
                <Plus size={14} /> {CONF[tab].novo}
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid-3">
          {list.map((it, i) => (
            <ItemCard key={it.id} k={tab} it={it} i={i} onOpen={() => setEditing({ item: it })} />
          ))}
        </div>
      )}

      {editing && <Editor key={editing.item?.id ?? "novo"} k={tab} item={editing.item} onClose={() => setEditing(null)} />}
    </>
  );
}
