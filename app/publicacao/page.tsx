"use client";

import { useState } from "react";
import { AlertTriangle, ArchiveRestore, Building2, CheckCircle2, Circle, FileStack, KeyRound, Rocket, ShieldOff, Undo2 } from "lucide-react";
import { useLoaded, useStore } from "@/lib/store";
import { PAGE_NAME } from "@/lib/mock/site";
import { LEVEL_LABEL } from "@/lib/mock/ops";
import { dataHora, haQuanto } from "@/lib/format";
import type { ChangeRequest } from "@/lib/types";
import { Avatar, Empty, Modal, SkRows, Spinner } from "@/components/ui";
import { RequestDrawer, TypeIcon } from "@/components/requests";

const STEPS = ["Backup do site como está agora", "Publicando as páginas", "Conferindo formulário, menu e links"];

function Line({ r, onOpen, right }: { r: ChangeRequest; onOpen: () => void; right?: React.ReactNode }) {
  return (
    <div className="row" style={{ flexWrap: "wrap" }}>
      <span style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--bg-2)", flex: "none" }}>
        <TypeIcon t={r.type} size={15} />
      </span>
      <button className="grow" style={{ border: 0, background: "none", textAlign: "left", padding: 0, flexBasis: 180 }} onClick={onOpen}>
        <span className="title" style={{ display: "block", fontSize: 14 }}>
          {r.title}
        </span>
        <span className="sub">
          {r.id} · {PAGE_NAME[r.page]} · {haQuanto(r.updatedAt)}
        </span>
      </button>
      {right}
    </div>
  );
}

export default function Publicacao() {
  const ready = useLoaded(700);
  const { requests, publications, access, publish, restore, revoke, updateRequest, toast } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState(-1);
  const [busy, setBusy] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);

  const goLive = requests.filter((r) => r.status === "revisao");
  const safe = requests.filter((r) => r.status === "em-obra" && r.inDraft);
  const risky = requests.filter((r) => r.status === "em-obra" && !r.inDraft);
  const selected = requests.find((r) => r.id === sel);
  const owner = access.find((a) => a.level === "agencia");

  const doPublish = async () => {
    setConfirm(false);
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 650);
    const t2 = setTimeout(() => setStep(2), 1300);
    await publish(
      goLive.map((r) => r.id),
      goLive.length === 1 ? goLive[0].title : `${goLive.length} ajustes revisados`,
    );
    clearTimeout(t1);
    clearTimeout(t2);
    setStep(3);
    toast(`${goLive.length} ${goLive.length === 1 ? "ajuste publicado" : "ajustes publicados"}. O backup de antes ficou guardado.`);
    setTimeout(() => setStep(-1), 1800);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Nada vai para o ar pela metade</div>
          <h1>Publicação</h1>
          <p>
            No Webflow, publicar sobe todas as páginas de uma vez. Por isso o que ainda está sendo feito fica numa cópia de rascunho, e antes de cada
            publicação fica um backup para voltar com um clique.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 18 }}>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Próxima publicação</h2>
              <p>O que sobe, o que fica guardado e o que ainda segura</p>
            </div>
            <button className="btn primary" disabled={!ready || goLive.length === 0 || risky.length > 0 || step >= 0} onClick={() => setConfirm(true)}>
              {step >= 0 && step < 3 ? <Spinner size={15} /> : <Rocket size={16} />} Publicar {goLive.length > 0 ? goLive.length : ""}
            </button>
          </div>

          {step >= 0 && (
            <div className="callout info" style={{ marginBottom: 14 }}>
              <div className="steps" style={{ width: "100%" }}>
                {STEPS.map((s, i) => (
                  <div key={s} className={`step ${step > i ? "on" : ""}`}>
                    <span className="s-ico">{step > i ? <CheckCircle2 size={16} /> : step === i ? <Spinner size={14} /> : <Circle size={12} />}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!ready ? (
            <SkRows n={5} h={50} />
          ) : (
            <>
              {risky.length > 0 && (
                <div className="callout warn" style={{ marginBottom: 14 }}>
                  <AlertTriangle size={20} color="#9a6510" style={{ flex: "none", marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>
                      {risky.length} {risky.length === 1 ? "ajuste está" : "ajustes estão"} sendo feitos direto na página
                    </b>
                    <p>Se publicar agora, eles sobem pela metade junto com o resto, como abrir a loja com a vitrine ainda sendo montada. Leve para uma cópia de rascunho primeiro.</p>
                    <div className="list" style={{ marginTop: 6 }}>
                      {risky.map((r) => (
                        <Line
                          key={r.id}
                          r={r}
                          onOpen={() => setSel(r.id)}
                          right={
                            <button
                              className="btn sm"
                              disabled={busy === r.id}
                              onClick={async () => {
                                setBusy(r.id);
                                await updateRequest(r.id, { inDraft: true }, "Trabalho levado para uma cópia de rascunho da página");
                                setBusy(null);
                                toast(`${r.id} agora está numa cópia de rascunho`);
                              }}
                            >
                              {busy === r.id ? <Spinner size={13} /> : <FileStack size={14} />} Levar para cópia
                            </button>
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, margin: "4px 0 2px", color: "var(--ok)" }}>Sobe para o ar ({goLive.length})</div>
              {goLive.length === 0 ? (
                <div className="sub" style={{ padding: "10px 4px", color: "var(--muted)" }}>
                  Nada revisado esperando. Quando um pedido ficar pronto, ele aparece aqui.
                </div>
              ) : (
                <div className="list">
                  {goLive.map((r) => (
                    <Line key={r.id} r={r} onOpen={() => setSel(r.id)} right={<span className="chip ok">Revisado</span>} />
                  ))}
                </div>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, margin: "14px 0 2px", color: "var(--petrol)" }}>Fica guardado na cópia de rascunho ({safe.length})</div>
              <div className="list">
                {safe.map((r) => (
                  <Line key={r.id} r={r} onOpen={() => setSel(r.id)} right={<span className="chip petrol">Não sobe</span>} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h2>Publicações e backups</h2>
              <p>Cada publicação deixa o site de antes guardado</p>
            </div>
          </div>
          {!ready ? (
            <SkRows n={6} h={50} />
          ) : (
            <div className="list">
              {publications.slice(0, 9).map((p) => (
                <div key={p.id} className="row" style={{ flexWrap: "wrap" }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      display: "grid",
                      placeItems: "center",
                      flex: "none",
                      background: p.state === "no-ar" ? "var(--ok-soft)" : p.state === "restaurada" ? "var(--warn-soft)" : "var(--bg-2)",
                      color: p.state === "no-ar" ? "var(--ok)" : p.state === "restaurada" ? "var(--warn)" : "var(--muted)",
                    }}
                  >
                    {p.state === "restaurada" ? <Undo2 size={15} /> : <Rocket size={15} />}
                  </span>
                  <span className="grow" style={{ flexBasis: 170 }}>
                    <span className="title" style={{ display: "block", fontSize: 14 }}>
                      {p.summary}
                    </span>
                    <span className="sub">
                      {dataHora(p.at)} · {p.backup}
                    </span>
                  </span>
                  {p.state === "no-ar" ? (
                    <span className="chip ok">No ar</span>
                  ) : p.state === "restaurada" ? (
                    <span className="chip warn">Restaurada</span>
                  ) : (
                    <button className="btn sm ghost" disabled={restoring === p.id} onClick={() => setRestoring(`ask:${p.id}`)}>
                      {restoring === p.id ? <Spinner size={13} /> : <ArchiveRestore size={14} />} Voltar para esta
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
            <h2>Quem tem a chave do site</h2>
            <p>Cada acesso sai com um clique quando não faz mais sentido</p>
          </div>
        </div>
        {owner && owner.status === "ativo" && (
          <div className="callout warn" style={{ marginBottom: 14 }}>
            <Building2 size={20} color="#9a6510" style={{ flex: "none", marginTop: 2 }} />
            <div>
              <b>O site está no workspace da agência que montou</b>
              <p>
                A Cumaru vê o site no ar, mas trocar de plano, publicar ou cancelar depende de outra empresa. É morar numa casa com a escritura no nome do
                pedreiro. O Webflow permite transferir o site para um workspace da Cumaru.
              </p>
              <button className="btn sm" style={{ marginTop: 10 }} onClick={() => setShowTransfer(true)}>
                <KeyRound size={14} /> Como transferir
              </button>
            </div>
          </div>
        )}
        {!ready ? (
          <SkRows n={5} h={50} />
        ) : access.length === 0 ? (
          <Empty icon={<KeyRound size={22} />} title="Ninguém com acesso" text="Algo está errado, o site precisa de um dono." />
        ) : (
          <div className="list">
            {access.map((a) => (
              <div key={a.id} className="row" style={{ flexWrap: "wrap", opacity: a.status === "revogado" ? 0.55 : 1 }}>
                <Avatar id={a.photo} size={38} alt={a.name} />
                <span className="grow" style={{ flexBasis: 160 }}>
                  <span className="title" style={{ display: "block" }}>
                    {a.name} <span className="sub">· {a.role}</span>
                  </span>
                  <span className="sub">
                    {LEVEL_LABEL[a.level]} · último acesso {haQuanto(a.lastSeen)}
                  </span>
                </span>
                {a.status === "revogado" ? (
                  <span className="chip">Acesso removido</span>
                ) : a.level === "proprietario" ? (
                  <span className="chip ok">Dona</span>
                ) : (
                  <button className="btn sm danger" disabled={revoking === a.id} onClick={() => setRevoking(`ask:${a.id}`)}>
                    {revoking === a.id ? <Spinner size={13} /> : <ShieldOff size={14} />} Tirar acesso
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {confirm && (
        <Modal
          title={`Publicar ${goLive.length} ${goLive.length === 1 ? "ajuste" : "ajustes"}?`}
          onClose={() => setConfirm(false)}
          foot={
            <>
              <button className="btn" onClick={() => setConfirm(false)}>
                Cancelar
              </button>
              <button className="btn primary" onClick={doPublish}>
                <Rocket size={15} /> Publicar
              </button>
            </>
          }
        >
          <p style={{ marginTop: 0, color: "var(--ink-2)" }}>
            Antes de subir, o site de agora fica guardado como backup. {safe.length > 0 && `${safe.length} trabalhos em cópia de rascunho continuam fora do ar.`}
          </p>
          <div className="list">
            {goLive.map((r) => (
              <div key={r.id} className="row">
                <CheckCircle2 size={16} color="var(--ok)" />
                <span className="grow truncate">{r.title}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {restoring?.startsWith("ask:") && (
        <Modal
          title="Voltar o site para esta versão?"
          onClose={() => setRestoring(null)}
          foot={
            <>
              <button className="btn" onClick={() => setRestoring(null)}>
                Cancelar
              </button>
              <button
                className="btn primary"
                onClick={async () => {
                  const id = restoring.slice(4);
                  setRestoring(id);
                  await restore(id);
                  setRestoring(null);
                  toast("Site restaurado. A versão que estava no ar também ficou guardada.", "info");
                }}
              >
                <ArchiveRestore size={15} /> Restaurar
              </button>
            </>
          }
        >
          <p style={{ margin: 0, color: "var(--ink-2)" }}>
            O site volta a ficar exatamente como estava naquela publicação. A versão de agora não se perde, vira mais um backup na lista.
          </p>
        </Modal>
      )}

      {revoking?.startsWith("ask:") && (
        <Modal
          title={`Tirar o acesso de ${access.find((a) => a.id === revoking.slice(4))?.name}?`}
          onClose={() => setRevoking(null)}
          foot={
            <>
              <button className="btn" onClick={() => setRevoking(null)}>
                Cancelar
              </button>
              <button
                className="btn danger"
                onClick={async () => {
                  const id = revoking.slice(4);
                  const who = access.find((a) => a.id === id)?.name;
                  setRevoking(id);
                  await revoke(id);
                  setRevoking(null);
                  toast(`${who} não entra mais no site`);
                }}
              >
                <ShieldOff size={15} /> Tirar acesso
              </button>
            </>
          }
        >
          <p style={{ margin: 0, color: "var(--ink-2)" }}>A pessoa deixa de abrir o Designer e o Editor na hora. Dá para convidar de novo depois, se precisar.</p>
        </Modal>
      )}

      {showTransfer && (
        <Modal title="Trazer o site para a Cumaru" onClose={() => setShowTransfer(false)} foot={<button className="btn primary" onClick={() => setShowTransfer(false)}>Entendi</button>}>
          <div className="steps">
            {[
              "A Cumaru cria um workspace próprio no Webflow, no nome da empresa.",
              "A agência transfere o site para esse workspace. O site não sai do ar.",
              "O plano do site passa para o cartão da Cumaru.",
              "Os acessos antigos saem, e cada pessoa entra com o próprio login.",
            ].map((s, i) => (
              <div key={i} className="step on" style={{ alignItems: "flex-start" }}>
                <span className="s-ico" style={{ background: "var(--copper-soft)", color: "var(--copper)", fontWeight: 600, fontSize: 13 }}>
                  {i + 1}
                </span>
                <span style={{ color: "var(--ink)" }}>{s}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 0 }}>Fazer isso enquanto todo mundo se fala bem é bem mais simples do que depois.</p>
        </Modal>
      )}

      {selected && <RequestDrawer key={selected.id} r={selected} onClose={() => setSel(null)} />}
    </>
  );
}
