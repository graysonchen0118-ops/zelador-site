export type PageKind = "estatica" | "cms" | "campanha" | "legal";

export interface SitePage {
  id: string;
  name: string;
  path: string;
  kind: PageKind;
  baseKb: number; // html, css e fontes da própria página
  visits: number; // visitas no último mês
  leads: number; // contatos gerados no último mês
  lastEdit: string; // ISO
}

export type ScriptMode = "normal" | "adiado" | "removido";

export interface PastedScript {
  id: string;
  name: string;
  purpose: string;
  weightKb: number;
  pages: string[] | "todas";
  mode: ScriptMode;
  addedBy: string;
  addedAt: string;
  where: string; // onde foi colado
  note?: string;
}

export type ImageStatus = "pendente" | "otimizada" | "falhou";

export interface HeavyImage {
  id: string;
  page: string;
  file: string;
  photo: string;
  originalPx: number;
  shownPx: number;
  weightKb: number;
  optimizedKb: number;
  status: ImageStatus;
  failReason?: string;
}

export type ClassGroup = "estrutura" | "tipografia" | "botoes" | "cards" | "secoes" | "formulario" | "utilitarios";
export type ClassStatus = "ok" | "sem-uso" | "duplicada" | "script";

export interface StyleClass {
  id: string;
  name: string;
  group: ClassGroup;
  uses: number;
  pages: string[];
  props: string;
  status: ClassStatus;
  duplicateOf?: string;
  scriptRef?: string;
  label?: string;
  createdAt: string;
}

export type RequestType = "texto" | "imagem" | "layout" | "bug" | "pagina-nova" | "desempenho";
export type RequestStatus = "recebido" | "em-obra" | "revisao" | "publicado";
export type Priority = "baixa" | "normal" | "alta";

export interface Pin {
  section: string;
  x: number; // % dentro da seção
  y: number;
}

export interface ChangeRequest {
  id: string;
  title: string;
  page: string;
  section: string;
  type: RequestType;
  priority: Priority;
  status: RequestStatus;
  inDraft: boolean; // trabalho guardado numa cópia de rascunho da página
  requester: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  pin?: Pin;
  history: { at: string; text: string }[];
}

export type ItemStatus = "publicado" | "rascunho";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  status: ItemStatus;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  context: string;
  photo: string;
  quote: string;
  status: ItemStatus;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  city: string;
  year: number;
  area: number;
  category: "Casa" | "Apartamento" | "Interiores" | "Comercial";
  cover: string;
  featured: boolean;
  status: ItemStatus;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  until: string;
  status: ItemStatus;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  cover: string;
  readMin: number;
  status: ItemStatus;
  updatedAt: string;
}

export interface Publication {
  id: string;
  at: string;
  author: string;
  summary: string;
  changes: number;
  backup: string;
  state: "no-ar" | "substituida" | "restaurada";
}

export type AccessLevel = "proprietario" | "editor" | "designer" | "agencia";

export interface Access {
  id: string;
  name: string;
  role: string;
  photo: string;
  level: AccessLevel;
  lastSeen: string;
  status: "ativo" | "revogado";
}
