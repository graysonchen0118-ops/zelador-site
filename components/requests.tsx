"use client";

import { useState } from "react";
import { AlertTriangle, Bug, Copy, FileText, Gauge, Image as ImageIcon, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { ChangeRequest, Pin, Priority, RequestStatus, RequestType } from "@/lib/types";
import { PAGES, PAGE_NAME } from "@/lib/mock/site";
import { PEOPLE, PRIORITY_LABEL, SECTIONS, STATUS_LABEL, TYPE_LABEL } from "@/lib/mock/requests";
import { dataHora, haQuanto } from "@/lib/format";
import { Drawer, Modal, Spinner } from "./ui";

export const STATUS_COLOR: Record<RequestStatus, string> = {
  recebido: "#8a97a1",
  "em-obra": "#c48419",
  revisao: "#2c5a5e",
  publicado: "#2f8a5b",
};

export function TypeIcon({ t, size = 14 }: { t: RequestType; size?: number }) {
  const I = { texto: FileText, imagem: ImageIcon, layout: LayoutGrid, bug: Bug, "pagina-nova": Copy, desempenho: Gauge }[t];
  return <I size={size} />;
}

export function StatusChip({ s }: { s: RequestStatus }) {
  const cls = s === "publicado" ? "ok" : s === "em-obra" ? "warn" : s === "revisao" ? "petrol" : "";
  return <span className={`chip ${cls}`}>{STATUS_LABEL[s]}</span>;
}

const ORDER: RequestStatus[] = ["recebido", "em-obra", "revisao", "publicado"];

export function RequestDrawer({ r, onClose }: { r: ChangeRequest; onClose: () => void }) {
  const { moveRequest, updateRequest, deleteRequest, toast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [title, setTitle] = useState(r.title);
  const [notes, setNotes] = useState(r.notes);
  const [confirmDel, setConfirmDel] = useState(false);
  const dirty = title !== r.title || notes !== r.notes;
  const idx = ORDER.indexOf(r.status);
  const next = ORDER[idx + 1];

  const go = async (s: RequestStatus) => {
    setBusy(s);
    await moveRequest(r.id, s);
    setBusy(null);
    toast(`${r.id} agora está em ${STATUS_LABEL[s]}`);
  };

  const save = async () => {
    if (title.trim().length < 6) {
      toast("Escreva um título com pelo menos 6 letras, para achar o pedido depois.", "erro");
      return;
    }
    setBusy("save");
    await updateRequest(r.id, { title: title.trim(), notes }, "Pedido editado");
    setBusy(null);
    toast("Pedido atualizado");
  };

  return (
    <Drawer
      onClose={onClose}
      sub={
        <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className="chip dark">{r.id}</span>
          <StatusChip s={r.status} />
          <span className="chip">
            <TypeIcon t={r.type} /> {TYPE_LABEL[r.type]}
          </span>
          {r.priority === "alta" && <span className="chip err">Prioridade alta</span>}
        </span>
      }
      title={r.title}
      foot={
        confirmDel ? (
          <>
            <span style={{ marginRight: "auto", fontSize: 13.5, color: "var(--err)" }}>Apagar este pedido de vez?</span>
            <button className="btn sm" onClick={() => setConfirmDel(false)}>
              Manter
            </button>
            <button
              className="btn sm danger"
              disabled={busy === "del"}
              onClick={async () => {
                setBusy("del");
                await deleteRequest(r.id);
                toast(`${r.id} apagado`, "info");
                onClose();
              }}
            >
              {busy === "del" ? <Spinner size={14} /> : <Trash2 size={14} />} Apagar
            </button>
          </>
        ) : (
          <>
            <button className="btn sm ghost" style={{ marginRight: "auto" }} onClick={() => setConfirmDel(true)}>
              <Trash2 size={14} /> Apagar
            </button>
            {dirty && (
              <button className="btn sm" disabled={busy === "save"} onClick={save}>
                {busy === "save" && <Spinner size={14} />} Salvar
              </button>
            )}
            {next && next !== "publicado" && (
              <button className="btn sm primary" disabled={!!busy} onClick={() => go(next)}>
                {busy === next && <Spinner size={14} />} Mover para {STATUS_LABEL[next]}
              </button>
            )}
          </>
        )
      }
    >
      {r.status === "em-obra" && !r.inDraft && (
        <div className="callout warn" style={{ marginBottom: 16 }}>
          <AlertTriangle size={18} color="#9a6510" style={{ flex: "none", marginTop: 2 }} />
          <div>
            <b>Mexendo direto na página que está no ar</b>
            <p>
              No plano do site, publicar no Webflow sobe todas as páginas de uma vez. Se outra correção for publicada hoje, esta vai junto pela metade. O
              certo é levar para uma cópia de rascunho da página.
            </p>
            <button
              className="btn sm"
              style={{ marginTop: 10 }}
              disabled={busy === "draft"}
              onClick={async () => {
                setBusy("draft");
                await updateRequest(r.id, { inDraft: true }, "Trabalho levado para uma cópia de rascunho da página");
                setBusy(null);
                toast("Agora está numa cópia de rascunho. Pode publicar o resto sem medo.");
              }}
            >
              {busy === "draft" && <Spinner size={14} />} Levar para cópia de rascunho
            </button>
          </div>
        </div>
      )}

      <div className="field-row" style={{ marginBottom: 14 }}>
        <div>
          <div className="sub" style={{ fontSize: 12.5, color: "var(--muted)" }}>Página</div>
          <b>{PAGE_NAME[r.page]}</b>
        </div>
        <div>
          <div className="sub" style={{ fontSize: 12.5, color: "var(--muted)" }}>Onde</div>
          <b>{SECTIONS[r.section] ?? r.section}</b>
        </div>
        <div>
          <div className="sub" style={{ fontSize: 12.5, color: "var(--muted)" }}>Pedido por</div>
          <b>{r.requester}</b>
        </div>
      </div>

      <div className="field">
        <label htmlFor="r-title">Título</label>
        <input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="r-notes">Detalhes</label>
        <textarea id="r-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="O que muda, onde, e como saber que ficou certo" />
      </div>

      <div className="field">
        <label>Situação</label>
        <div className="seg">
          {ORDER.map((s) => (
            <button key={s} className={r.status === s ? "on" : ""} disabled={!!busy} onClick={() => r.status !== s && go(s)}>
              {busy === s ? <Spinner size={13} /> : <span className="col-dot" style={{ background: STATUS_COLOR[s] }} />}
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)", marginBottom: 8 }}>Histórico</div>
        <div className="steps">
          {[...r.history].reverse().map((h, i) => (
            <div key={i} className="step on">
              <span className="s-ico" style={{ width: 10, height: 10, background: i === 0 ? "var(--copper)" : "var(--line-2)" }} />
              <div>
                <div style={{ color: "var(--ink)" }}>{h.text}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {dataHora(h.at)}, {haQuanto(h.at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

export function NewRequestModal({
  onClose,
  preset,
}: {
  onClose: () => void;
  preset?: { page?: string; section?: string; pin?: Pin };
}) {
  const { createRequest, toast } = useStore();
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(preset?.page ?? "home");
  const [section, setSection] = useState(preset?.section ?? "conteudo");
  const [type, setType] = useState<RequestType>("texto");
  const [priority, setPriority] = useState<Priority>("normal");
  const [notes, setNotes] = useState("");
  const [requester, setRequester] = useState<string>(PEOPLE.helena);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (title.trim().length < 6) {
      setErr(true);
      return;
    }
    setBusy(true);
    const r = await createRequest({ title: title.trim(), page, section, type, priority, notes, requester, pin: preset?.pin });
    setBusy(false);
    toast(`${r.id} recebido. Aparece na coluna Recebido.`);
    onClose();
  };

  return (
    <Modal
      title={preset?.pin ? "Pedido neste ponto da página" : "Novo pedido"}
      onClose={onClose}
      foot={
        <>
          <button className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" onClick={submit} disabled={busy}>
            {busy ? <Spinner size={15} /> : <Plus size={16} />} Enviar pedido
          </button>
        </>
      }
    >
      <div className={`field ${err ? "error" : ""}`}>
        <label htmlFor="n-title">O que precisa mudar</label>
        <input
          id="n-title"
          autoFocus
          value={title}
          placeholder="Ex.: trocar o telefone do rodapé"
          onChange={(e) => {
            setTitle(e.target.value);
            if (err) setErr(false);
          }}
        />
        {err && <span className="err-msg">Escreva pelo menos 6 letras, para o pedido ser encontrado depois.</span>}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="n-page">Página</label>
          <select id="n-page" value={page} onChange={(e) => setPage(e.target.value)} disabled={!!preset?.pin}>
            {PAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="n-sec">Onde</label>
          <select id="n-sec" value={section} onChange={(e) => setSection(e.target.value)} disabled={!!preset?.pin}>
            {Object.entries(SECTIONS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="n-type">Tipo</label>
          <select id="n-type" value={type} onChange={(e) => setType(e.target.value as RequestType)}>
            {Object.entries(TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="n-prio">Prioridade</label>
          <select id="n-prio" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {Object.entries(PRIORITY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="n-who">Quem pede</label>
          <select id="n-who" value={requester} onChange={(e) => setRequester(e.target.value)}>
            {Object.values(PEOPLE).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="n-notes">Detalhes</label>
        <textarea id="n-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Texto novo, link da foto, o que o cliente reclamou" />
      </div>
    </Modal>
  );
}
