"use client";

import { useMemo, useState } from "react";
import { Cable, CheckCircle2, Code2, Combine, Search, SearchX, ShieldCheck, Tag, Trash2 } from "lucide-react";
import { useLoaded, useStore } from "@/lib/store";
import { CLASSES, GROUP_LABEL } from "@/lib/mock/classes";
import { PAGE_NAME } from "@/lib/mock/site";
import type { ClassGroup, ClassStatus, StyleClass } from "@/lib/types";
import { Wiring } from "@/components/three/Scenes";
import { Empty, Modal, SkRows, Spinner } from "@/components/ui";

type Filter = "todas" | ClassStatus;
const FILTERS: { k: Filter; label: string }[] = [
  { k: "todas", label: "Todas" },
  { k: "sem-uso", label: "Sem uso" },
  { k: "duplicada", label: "Repetidas" },
  { k: "script", label: "Usadas pelo código" },
  { k: "ok", label: "Em ordem" },
];

const RANK: Record<ClassStatus, number> = { "sem-uso": 0, duplicada: 1, script: 2, ok: 3 };

function StatusTag({ c }: { c: StyleClass }) {
  if (c.status === "sem-uso") return <span className="chip warn">Sem uso</span>;
  if (c.status === "duplicada") return <span className="chip warn">Igual a {c.duplicateOf}</span>;
  if (c.status === "script") return <span className="chip petrol">Usada pelo código</span>;
  return <span className="chip ok">Em ordem</span>;
}

function pagesText(p: string[]) {
  if (p.length === 0) return "nenhuma página";
  if (p[0] === "todas") return "todas as páginas";
  const names = p.map((x) => PAGE_NAME[x] ?? x);
  return names.length > 3 ? `${names.slice(0, 3).join(", ")} e mais ${names.length - 3}` : names.join(", ");
}

export default function Estilos() {
  const ready = useLoaded(750);
  const { classes, health, removeClass, removeAllUnused, mergeClass, labelClass, toast } = useStore();
  const [filter, setFilter] = useState<Filter>("todas");
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<ClassGroup | "todos">("todos");
  const [sort, setSort] = useState<"problemas" | "usos" | "nome" | "antigas">("problemas");
  const [busy, setBusy] = useState<string | null>(null);
  const [labeling, setLabeling] = useState<StyleClass | null>(null);
  const [labelText, setLabelText] = useState("");
  const [confirmAll, setConfirmAll] = useState(false);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { todas: classes.length, "sem-uso": 0, duplicada: 0, script: 0, ok: 0 };
    classes.forEach((x) => (c[x.status] += 1));
    return c;
  }, [classes]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return classes
      .filter((c) => filter === "todas" || c.status === filter)
      .filter((c) => group === "todos" || c.group === group)
      .filter((c) => !term || `${c.name} ${c.props} ${c.label ?? ""}`.toLowerCase().includes(term))
      .sort((a, b) =>
        sort === "nome"
          ? a.name.localeCompare(b.name)
          : sort === "antigas"
            ? a.createdAt.localeCompare(b.createdAt)
            : sort === "problemas"
              ? RANK[a.status] - RANK[b.status] || b.uses - a.uses
              : b.uses - a.uses,
      );
  }, [classes, filter, group, q, sort]);

  const cleaned = CLASSES.length - classes.length;
  const target = CLASSES.filter((c) => c.status === "sem-uso" || c.status === "duplicada").length;
  const loose = health.unused + health.dups;

  const act = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    await fn();
    setBusy(null);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">O ponto que decide o resto</div>
          <h1>Quadro de classes</h1>
          <p>
            Cada classe é um disjuntor: dá o visual a um pedaço do site. Quando ninguém sabe o que uma classe faz, ninguém apaga, e cada ajuste cria mais
            uma. É assim que a décima página sai cara por causa da primeira.
          </p>
        </div>
      </div>

      <section className="hero" style={{ minHeight: 320 }}>
        <Wiring loose={loose} focus="panel" />
        <div className="hero-copy" style={{ minHeight: 320, maxWidth: 420 }}>
          <span className="eyebrow">Limpeza do quadro</span>
          <h2 style={{ fontSize: 26 }}>
            {loose === 0 ? "Todos os fios com etiqueta" : `${loose} fios soltos para resolver`}
          </h2>
          <p>
            {cleaned} de {target} resolvidas. As classes usadas pelo código ficam protegidas: o Webflow mostra zero usos, mas apagar uma delas desliga uma
            parte do site.
          </p>
          <div className="bar" style={{ marginTop: "auto", height: 8, background: "rgba(255,255,255,0.12)" }}>
            <span style={{ width: `${(cleaned / target) * 100}%`, background: "var(--grad-copper)" }} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn primary" disabled={counts["sem-uso"] === 0 || busy === "all"} onClick={() => setConfirmAll(true)}>
              {busy === "all" ? <Spinner size={15} /> : <Trash2 size={16} />} {counts["sem-uso"] > 0 ? `Remover as ${counts["sem-uso"]} sem uso` : "Nenhuma sem uso"}
            </button>
          </div>
        </div>
      </section>

      {counts.script > 0 && (
        <div className="callout info" style={{ marginBottom: 18 }}>
          <Code2 size={20} color="var(--petrol)" style={{ flex: "none", marginTop: 2 }} />
          <div>
            <b>{counts.script} classes parecem sem uso, e não estão</b>
            <p>
              O código personalizado colado no site liga e desliga essas classes: abre o menu no celular, mostra o obrigado depois do formulário. O painel
              de estilos do Webflow não enxerga esse código, então apagar pelo painel é desligar o disjuntor achando que era de um cômodo vazio. Antes de
              qualquer remoção, cada nome é procurado no código.
            </p>
          </div>
        </div>
      )}

      <div className="toolbar">
        <div className="seg">
          {FILTERS.map((f) => (
            <button key={f.k} className={filter === f.k ? "on" : ""} onClick={() => setFilter(f.k)}>
              {f.label} <span className="n">{counts[f.k]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar">
        <label className="search">
          <Search size={16} color="var(--muted)" />
          <input placeholder="Buscar classe, estilo ou etiqueta" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="select" value={group} onChange={(e) => setGroup(e.target.value as ClassGroup | "todos")} aria-label="Grupo">
          <option value="todos">Todos os grupos</option>
          {Object.entries(GROUP_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as "problemas" | "usos" | "nome" | "antigas")} aria-label="Ordem">
          <option value="problemas">Para resolver primeiro</option>
          <option value="usos">Mais usadas</option>
          <option value="nome">Nome</option>
          <option value="antigas">Mais antigas</option>
        </select>
      </div>

      <section className="card" style={{ padding: "8px 16px" }}>
        {!ready ? (
          <div style={{ padding: "10px 0" }}>
            <SkRows n={8} h={52} />
          </div>
        ) : list.length === 0 ? (
          <Empty
            icon={filter === "sem-uso" || filter === "duplicada" ? <CheckCircle2 size={22} /> : <SearchX size={22} />}
            title={filter === "sem-uso" || filter === "duplicada" ? "Nada para limpar aqui" : "Nenhuma classe encontrada"}
            text={filter === "sem-uso" || filter === "duplicada" ? "Esse grupo do quadro já está com todos os fios no lugar." : "Tente outro nome ou outro grupo."}
          />
        ) : (
          <div className="list">
            {list.map((c) => (
              <div key={c.id} className="row" style={{ flexWrap: "wrap", rowGap: 8 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    flex: "none",
                    background: c.status === "ok" ? "var(--ok-soft)" : c.status === "script" ? "var(--petrol-soft)" : "var(--warn-soft)",
                    color: c.status === "ok" ? "var(--ok)" : c.status === "script" ? "var(--petrol)" : "var(--warn)",
                  }}
                >
                  {c.status === "script" ? <ShieldCheck size={16} /> : <Cable size={16} />}
                </span>
                <span className="grow" style={{ flexBasis: 220 }}>
                  <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontWeight: 600 }}>
                      .{c.name}
                    </span>
                    {c.label && (
                      <span className="chip copper">
                        <Tag size={11} /> {c.label}
                      </span>
                    )}
                  </span>
                  <span className="sub" style={{ display: "block" }}>
                    {GROUP_LABEL[c.group]} · {c.uses} {c.uses === 1 ? "uso" : "usos"} · {pagesText(c.pages)} · {c.props}
                  </span>
                  {c.status === "script" && (
                    <span className="sub" style={{ display: "block", color: "var(--petrol)" }}>
                      {c.scriptRef}
                    </span>
                  )}
                </span>
                <StatusTag c={c} />
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {c.status === "duplicada" && (
                    <button
                      className="btn sm"
                      disabled={busy === c.id}
                      onClick={() =>
                        act(c.id, async () => {
                          await mergeClass(c.id);
                          toast(`.${c.name} juntada com .${c.duplicateOf}. ${c.uses} lugares agora usam uma classe só.`);
                        })
                      }
                    >
                      {busy === c.id ? <Spinner size={13} /> : <Combine size={14} />} Juntar
                    </button>
                  )}
                  {(c.status === "sem-uso" || c.status === "script") && (
                    <button
                      className={`btn sm ${c.status === "script" ? "" : "danger"}`}
                      disabled={busy === c.id}
                      onClick={() =>
                        act(c.id, async () => {
                          const ok = await removeClass(c.id);
                          if (ok) toast(`.${c.name} removida do quadro`);
                        })
                      }
                    >
                      {busy === c.id ? <Spinner size={13} /> : <Trash2 size={14} />} Remover
                    </button>
                  )}
                  <button
                    className="btn sm ghost"
                    onClick={() => {
                      setLabeling(c);
                      setLabelText(c.label ?? "");
                    }}
                  >
                    <Tag size={14} /> Etiquetar
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {confirmAll && (
        <Modal
          title={`Remover ${counts["sem-uso"]} classes sem uso?`}
          onClose={() => setConfirmAll(false)}
          foot={
            <>
              <button className="btn" onClick={() => setConfirmAll(false)}>
                Cancelar
              </button>
              <button
                className="btn primary"
                onClick={() => {
                  setConfirmAll(false);
                  act("all", async () => {
                    const n = await removeAllUnused();
                    toast(`${n} classes removidas. As ${counts.script} usadas pelo código continuam no lugar.`);
                  });
                }}
              >
                <Trash2 size={15} /> Remover
              </button>
            </>
          }
        >
          <p style={{ margin: 0, color: "var(--ink-2)" }}>
            Saem só as classes com zero usos que o código personalizado também não usa. Antes de remover, fica um backup do site, e as {counts.script}{" "}
            protegidas não são tocadas.
          </p>
        </Modal>
      )}

      {labeling && (
        <Modal
          title={`Etiqueta para .${labeling.name}`}
          onClose={() => setLabeling(null)}
          foot={
            <>
              <button className="btn" onClick={() => setLabeling(null)}>
                Cancelar
              </button>
              <button
                className="btn primary"
                disabled={busy === "label"}
                onClick={() =>
                  act("label", async () => {
                    await labelClass(labeling.id, labelText);
                    toast(labelText.trim() ? `Etiqueta salva em .${labeling.name}` : "Etiqueta removida", "ok");
                    setLabeling(null);
                  })
                }
              >
                {busy === "label" ? <Spinner size={15} /> : <Tag size={15} />} Salvar etiqueta
              </button>
            </>
          }
        >
          <div className="field" style={{ marginBottom: 6 }}>
            <label htmlFor="lbl">Para que serve, em palavras de gente</label>
            <input id="lbl" autoFocus value={labelText} onChange={(e) => setLabelText(e.target.value)} placeholder="Ex.: botão laranja das campanhas" maxLength={48} />
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Quem abrir o quadro daqui a um ano sabe o que essa classe desliga antes de mexer.</div>
        </Modal>
      )}
    </>
  );
}
