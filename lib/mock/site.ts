import type { HeavyImage, PastedScript, SitePage } from "../types";
import { PH } from "../photos";

export const SITE = {
  name: "Cumaru Arquitetura",
  tagline: "Arquitetura e interiores, São Paulo",
  plan: "Plano CMS",
};

export const PAGES: SitePage[] = [
  { id: "home", name: "Home", path: "/", kind: "estatica", baseKb: 410, visits: 4210, leads: 38, lastEdit: "2026-10-20T16:12" },
  { id: "projetos", name: "Projetos", path: "/projetos", kind: "cms", baseKb: 330, visits: 2380, leads: 9, lastEdit: "2026-10-14T11:40" },
  { id: "projeto", name: "Projeto (modelo)", path: "/projetos/[nome]", kind: "cms", baseKb: 290, visits: 3120, leads: 17, lastEdit: "2026-09-30T09:05" },
  { id: "reforma", name: "Reforma de apartamento", path: "/reforma-apartamento", kind: "campanha", baseKb: 360, visits: 2140, leads: 51, lastEdit: "2026-10-21T18:30" },
  { id: "servicos", name: "Serviços", path: "/servicos", kind: "estatica", baseKb: 300, visits: 1310, leads: 6, lastEdit: "2026-08-22T14:00" },
  { id: "interiores", name: "Interiores", path: "/servicos/interiores", kind: "estatica", baseKb: 280, visits: 760, leads: 4, lastEdit: "2026-07-11T10:20" },
  { id: "sobre", name: "Sobre", path: "/sobre", kind: "estatica", baseKb: 340, visits: 980, leads: 2, lastEdit: "2026-10-02T15:45" },
  { id: "blog", name: "Blog", path: "/blog", kind: "cms", baseKb: 260, visits: 1640, leads: 3, lastEdit: "2026-10-18T08:30" },
  { id: "post", name: "Post (modelo)", path: "/blog/[titulo]", kind: "cms", baseKb: 240, visits: 5260, leads: 12, lastEdit: "2026-10-18T08:30" },
  { id: "contato", name: "Contato", path: "/contato", kind: "estatica", baseKb: 220, visits: 910, leads: 44, lastEdit: "2026-10-09T13:10" },
  { id: "trabalhe", name: "Trabalhe conosco", path: "/trabalhe-conosco", kind: "estatica", baseKb: 200, visits: 310, leads: 0, lastEdit: "2026-05-19T09:00" },
  { id: "obrigado", name: "Obrigado", path: "/obrigado", kind: "estatica", baseKb: 150, visits: 140, leads: 0, lastEdit: "2026-06-03T12:00" },
  { id: "privacidade", name: "Política de privacidade", path: "/privacidade", kind: "legal", baseKb: 130, visits: 95, leads: 0, lastEdit: "2025-11-28T10:00" },
  { id: "404", name: "Página não encontrada", path: "/404", kind: "legal", baseKb: 120, visits: 420, leads: 0, lastEdit: "2025-11-28T10:00" },
];

export const SCRIPTS: PastedScript[] = [
  { id: "s1", name: "Chat de atendimento", purpose: "Janela de conversa no canto da tela", weightKb: 412, pages: "todas", mode: "normal", addedBy: "Agência anterior", addedAt: "2025-03-12T10:00", where: "Código do cabeçalho, site inteiro" },
  { id: "s2", name: "Pixel de anúncios", purpose: "Mede quem veio dos anúncios", weightKb: 96, pages: "todas", mode: "normal", addedBy: "Marketing", addedAt: "2025-06-02T10:00", where: "Código do cabeçalho, site inteiro" },
  { id: "s3", name: "Gerenciador de tags", purpose: "Carrega outros códigos de medição", weightKb: 118, pages: "todas", mode: "normal", addedBy: "Marketing", addedAt: "2025-06-02T10:00", where: "Código do cabeçalho, site inteiro" },
  { id: "s4", name: "Mapa de calor", purpose: "Grava cliques e rolagem dos visitantes", weightKb: 156, pages: "todas", mode: "normal", addedBy: "Agência anterior", addedAt: "2025-09-20T10:00", where: "Código do rodapé, site inteiro", note: "Instalado para um teste de duas semanas em 2025 e nunca removido" },
  { id: "s5", name: "Feed do Instagram", purpose: "Grade com as últimas fotos do perfil", weightKb: 640, pages: ["home"], mode: "normal", addedBy: "Agência anterior", addedAt: "2025-04-08T10:00", where: "Bloco de código na Home", note: "Às vezes aparece vazio quando o Instagram muda a regra" },
  { id: "s6", name: "Formulário de marketing", purpose: "Captura de e-mail para a newsletter", weightKb: 210, pages: ["home", "blog", "post"], mode: "normal", addedBy: "Marketing", addedAt: "2026-01-15T10:00", where: "Bloco de código em três páginas" },
  { id: "s7", name: "Três famílias de fonte extra", purpose: "Fontes que só aparecem em dois títulos", weightKb: 184, pages: "todas", mode: "normal", addedBy: "Agência anterior", addedAt: "2025-03-12T10:00", where: "Código do cabeçalho, site inteiro" },
  { id: "s8", name: "Vídeo institucional embutido", purpose: "Player de vídeo carregado logo na abertura", weightKb: 820, pages: ["sobre"], mode: "normal", addedBy: "Agência anterior", addedAt: "2025-05-30T10:00", where: "Bloco de código na página Sobre" },
];

export const IMAGES: HeavyImage[] = [
  { id: "i1", page: "home", file: "hero-sala-forro-madeira.jpg", photo: PH.forroMadeira, originalPx: 6000, shownPx: 1600, weightKb: 3140, optimizedKb: 260, status: "pendente" },
  { id: "i2", page: "home", file: "projeto-casa-jardim.jpg", photo: PH.salaJardim, originalPx: 4032, shownPx: 800, weightKb: 1480, optimizedKb: 110, status: "pendente" },
  { id: "i3", page: "home", file: "projeto-cozinha.jpg", photo: PH.cozinhaJardim, originalPx: 4032, shownPx: 800, weightKb: 1320, optimizedKb: 96, status: "pendente" },
  { id: "i4", page: "home", file: "logos-parceiros.png", photo: PH.estante, originalPx: 2400, shownPx: 900, weightKb: 880, optimizedKb: 880, status: "pendente", failReason: "PNG com fundo transparente montado num arquivo só. Precisa ser exportado de novo, logo por logo." },
  { id: "i5", page: "projetos", file: "capa-jabuticabeiras.jpg", photo: PH.varandaJantar, originalPx: 5472, shownPx: 700, weightKb: 2210, optimizedKb: 88, status: "pendente" },
  { id: "i6", page: "projetos", file: "capa-apto-pinheiros.jpg", photo: PH.salaLaranja, originalPx: 4032, shownPx: 700, weightKb: 1640, optimizedKb: 82, status: "pendente" },
  { id: "i7", page: "projetos", file: "capa-casa-serra.jpg", photo: PH.salaMata, originalPx: 4032, shownPx: 700, weightKb: 1580, optimizedKb: 84, status: "pendente" },
  { id: "i8", page: "reforma", file: "antes-depois-sala.jpg", photo: PH.salaClara, originalPx: 4608, shownPx: 1200, weightKb: 2460, optimizedKb: 170, status: "pendente" },
  { id: "i9", page: "reforma", file: "reforma-cozinha.jpg", photo: PH.jantarMadeira, originalPx: 4032, shownPx: 900, weightKb: 1210, optimizedKb: 104, status: "pendente" },
  { id: "i10", page: "sobre", file: "equipe-no-atelie.jpg", photo: PH.maquete, originalPx: 5184, shownPx: 1400, weightKb: 2780, optimizedKb: 210, status: "pendente" },
  { id: "i11", page: "projeto", file: "galeria-varanda-01.jpg", photo: PH.jantarMontanha, originalPx: 6000, shownPx: 1400, weightKb: 3360, optimizedKb: 230, status: "pendente" },
  { id: "i12", page: "blog", file: "post-reforma-70m2.jpg", photo: PH.sacada, originalPx: 4032, shownPx: 760, weightKb: 1390, optimizedKb: 92, status: "pendente" },
  { id: "i13", page: "servicos", file: "servicos-obra.jpg", photo: PH.concreto, originalPx: 4032, shownPx: 1200, weightKb: 1720, optimizedKb: 150, status: "pendente" },
  { id: "i14", page: "post", file: "post-iluminacao.jpg", photo: PH.lareira, originalPx: 4032, shownPx: 760, weightKb: 1260, optimizedKb: 90, status: "pendente" },
];

export const PAGE_NAME: Record<string, string> = Object.fromEntries(PAGES.map((p) => [p.id, p.name]));
