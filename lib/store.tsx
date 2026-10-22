"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  Access,
  Banner,
  ChangeRequest,
  HeavyImage,
  PastedScript,
  Post,
  Project,
  Publication,
  RequestStatus,
  ScriptMode,
  StyleClass,
  TeamMember,
  Testimonial,
} from "./types";
import { CLASSES } from "./mock/classes";
import { IMAGES, PAGES, SCRIPTS } from "./mock/site";
import { REQUESTS, STATUS_LABEL } from "./mock/requests";
import { BANNERS, POSTS, PROJECTS, TEAM, TESTIMONIALS } from "./mock/cms";
import { ACCESS, PUBLICATIONS } from "./mock/ops";
import { nowIso, wait } from "./format";

export type ToastKind = "ok" | "erro" | "info";
export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

export type Collections = {
  equipe: TeamMember[];
  depoimentos: Testimonial[];
  projetos: Project[];
  banners: Banner[];
  blog: Post[];
};
export type CollectionKey = keyof Collections;

// avisa a cena 3D que algo mudou no site
export function pulse(kind: "ok" | "aviso" | "publicar" = "ok") {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("zelador:pulso", { detail: kind }));
}

function useStoreValue() {
  const [requests, setRequests] = useState<ChangeRequest[]>(REQUESTS);
  const [classes, setClasses] = useState<StyleClass[]>(CLASSES);
  const [scripts, setScripts] = useState<PastedScript[]>(SCRIPTS);
  const [images, setImages] = useState<HeavyImage[]>(IMAGES);
  const [collections, setCollections] = useState<Collections>({
    equipe: TEAM,
    depoimentos: TESTIMONIALS,
    projetos: PROJECTS,
    banners: BANNERS,
    blog: POSTS,
  });
  const [publications, setPublications] = useState<Publication[]>(PUBLICATIONS);
  const [access, setAccess] = useState<Access[]>(ACCESS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const toast = useCallback((text: string, kind: ToastKind = "ok") => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // ---------- pedidos ----------
  const nextId = useRef(101 + REQUESTS.length);
  const createRequest = useCallback(
    async (r: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt" | "history" | "status" | "inDraft">) => {
      await wait(650);
      const at = nowIso();
      const created: ChangeRequest = {
        ...r,
        id: `P-${nextId.current}`,
        status: "recebido",
        inDraft: false,
        createdAt: at,
        updatedAt: at,
        history: [{ at, text: "Pedido recebido" }],
      };
      nextId.current += 1;
      setRequests((list) => [created, ...list]);
      pulse("ok");
      return created;
    },
    [],
  );

  const updateRequest = useCallback(async (id: string, patch: Partial<ChangeRequest>, note?: string) => {
    await wait(450);
    const at = nowIso();
    setRequests((list) =>
      list.map((x) =>
        x.id === id ? { ...x, ...patch, updatedAt: at, history: note ? [...x.history, { at, text: note }] : x.history } : x,
      ),
    );
  }, []);

  const moveRequest = useCallback(
    async (id: string, status: RequestStatus) => {
      await wait(500);
      const at = nowIso();
      setRequests((list) =>
        list.map((x) => {
          if (x.id !== id) return x;
          const inDraft = status === "em-obra" ? true : status === "recebido" ? false : x.inDraft;
          const text =
            status === "em-obra"
              ? "Em andamento numa cópia de rascunho da página"
              : status === "publicado"
                ? "Publicado, com backup antes"
                : `Movido para ${STATUS_LABEL[status]}`;
          return { ...x, status, inDraft, updatedAt: at, history: [...x.history, { at, text }] };
        }),
      );
      pulse(status === "publicado" ? "publicar" : "ok");
    },
    [],
  );

  const deleteRequest = useCallback(async (id: string) => {
    await wait(400);
    setRequests((list) => list.filter((x) => x.id !== id));
  }, []);

  // ---------- classes ----------
  const removeClass = useCallback(
    async (id: string): Promise<boolean> => {
      const c = classes.find((x) => x.id === id);
      await wait(500);
      if (!c) return false;
      if (c.status === "script") {
        toast(`A classe ${c.name} é usada pelo código personalizado (${c.scriptRef}). Apagar quebraria essa parte do site.`, "erro");
        pulse("aviso");
        return false;
      }
      if (c.uses > 0) {
        toast(`A classe ${c.name} ainda está em ${c.uses} lugares. Junte com outra antes de remover.`, "erro");
        return false;
      }
      setClasses((list) => list.filter((x) => x.id !== id));
      pulse("ok");
      return true;
    },
    [classes, toast],
  );

  const removeAllUnused = useCallback(async () => {
    await wait(1100);
    const n = classes.filter((x) => x.status === "sem-uso" && x.uses === 0).length;
    setClasses((list) => list.filter((x) => !(x.status === "sem-uso" && x.uses === 0)));
    pulse("ok");
    return n;
  }, [classes]);

  const mergeClass = useCallback(async (id: string) => {
    await wait(700);
    setClasses((list) => {
      const c = list.find((x) => x.id === id);
      if (!c || !c.duplicateOf) return list;
      return list
        .filter((x) => x.id !== id)
        .map((x) =>
          x.name === c.duplicateOf ? { ...x, uses: x.uses + c.uses, pages: Array.from(new Set([...x.pages, ...c.pages])) } : x,
        );
    });
    pulse("ok");
  }, []);

  const labelClass = useCallback(async (id: string, label: string) => {
    await wait(350);
    setClasses((list) => list.map((x) => (x.id === id ? { ...x, label: label.trim() || undefined } : x)));
  }, []);

  // ---------- velocidade ----------
  const setScriptMode = useCallback(async (id: string, mode: ScriptMode) => {
    await wait(550);
    setScripts((list) => list.map((s) => (s.id === id ? { ...s, mode } : s)));
    pulse("ok");
  }, []);

  const optimizeImage = useCallback(async (id: string): Promise<boolean> => {
    await wait(900);
    const img = IMAGES.find((x) => x.id === id);
    if (img?.failReason) {
      setImages((list) => list.map((x) => (x.id === id ? { ...x, status: "falhou" } : x)));
      return false;
    }
    setImages((list) => list.map((x) => (x.id === id ? { ...x, status: "otimizada" } : x)));
    pulse("ok");
    return true;
  }, []);

  const optimizeAll = useCallback(async () => {
    await wait(1500);
    const todo = images.filter((x) => x.status !== "otimizada");
    const fail = todo.filter((x) => x.failReason).length;
    const ok = todo.length - fail;
    setImages((list) =>
      list.map((x) => (x.status === "otimizada" ? x : { ...x, status: x.failReason ? "falhou" : "otimizada" })),
    );
    pulse("ok");
    return { ok, fail };
  }, [images]);

  // ---------- conteúdo ----------
  const saveItem = useCallback(async <K extends CollectionKey>(key: K, item: Collections[K][number]) => {
    await wait(600);
    const at = nowIso();
    setCollections((c) => {
      const list = c[key] as Collections[K][number][];
      const exists = list.some((x) => x.id === item.id);
      const next = exists ? list.map((x) => (x.id === item.id ? { ...item, updatedAt: at } : x)) : [{ ...item, updatedAt: at }, ...list];
      return { ...c, [key]: next };
    });
    pulse("ok");
  }, []);

  const deleteItem = useCallback(async (key: CollectionKey, id: string) => {
    await wait(450);
    setCollections((c) => ({ ...c, [key]: (c[key] as { id: string }[]).filter((x) => x.id !== id) }));
  }, []);

  // ---------- publicação ----------
  const publish = useCallback(async (ids: string[], summary: string) => {
    await wait(2000);
    const at = nowIso();
    const hh = at.slice(11, 13);
    const mm = at.slice(14, 16);
    setRequests((list) =>
      list.map((x) =>
        ids.includes(x.id)
          ? { ...x, status: "publicado", updatedAt: at, history: [...x.history, { at, text: "Publicado, com backup antes" }] }
          : x,
      ),
    );
    setPublications((list) => [
      { id: `pub-${25 + list.length - 12}`, at, author: "Zelador", summary, changes: ids.length, backup: `Backup 23 out, ${Number(hh)}h${mm}`, state: "no-ar" },
      ...list.map((p) => (p.state === "no-ar" ? { ...p, state: "substituida" as const } : p)),
    ]);
    pulse("publicar");
  }, []);

  const restore = useCallback(async (id: string) => {
    await wait(1600);
    setPublications((list) =>
      list.map((p) => (p.id === id ? { ...p, state: "restaurada" } : p.state === "no-ar" ? { ...p, state: "substituida" } : p)),
    );
    pulse("aviso");
  }, []);

  const revoke = useCallback(async (id: string) => {
    await wait(600);
    setAccess((list) => list.map((a) => (a.id === id ? { ...a, status: "revogado" } : a)));
  }, []);

  // ---------- números derivados ----------
  const pageWeight = useCallback(
    (pageId: string) => {
      const page = PAGES.find((p) => p.id === pageId);
      const base = page?.baseKb ?? 0;
      const imgs = images.filter((i) => i.page === pageId).reduce((s, i) => s + (i.status === "otimizada" ? i.optimizedKb : i.weightKb), 0);
      const scr = scripts
        .filter((s) => s.mode === "normal" && (s.pages === "todas" || s.pages.includes(pageId)))
        .reduce((s, x) => s + x.weightKb, 0);
      return { base, imgs, scr, total: base + imgs + scr };
    },
    [images, scripts],
  );

  const health = useMemo(() => {
    const unused = classes.filter((c) => c.status === "sem-uso").length;
    const dups = classes.filter((c) => c.status === "duplicada").length;
    const homeKb = pageWeight("home").total;
    const open = requests.filter((r) => r.status !== "publicado").length;
    const risky = requests.filter((r) => r.status === "em-obra" && !r.inDraft).length;
    let score = 100;
    score -= unused * 1.2 + dups * 1.6;
    score -= Math.max(0, (homeKb - 1500) / 260);
    score -= risky * 4;
    return { score: Math.max(12, Math.round(score)), unused, dups, homeKb, open, risky };
  }, [classes, requests, pageWeight]);

  return {
    requests,
    classes,
    scripts,
    images,
    collections,
    publications,
    access,
    toasts,
    toast,
    dismiss,
    createRequest,
    updateRequest,
    moveRequest,
    deleteRequest,
    removeClass,
    removeAllUnused,
    mergeClass,
    labelClass,
    setScriptMode,
    optimizeImage,
    optimizeAll,
    saveItem,
    deleteItem,
    publish,
    restore,
    revoke,
    pageWeight,
    health,
  };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore fora do StoreProvider");
  return v;
}

// carregamento simulado de cada tela, para o esqueleto aparecer
export function useLoaded(ms = 650) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}
