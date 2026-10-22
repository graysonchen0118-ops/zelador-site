import type { Banner, Post, Project, TeamMember, Testimonial } from "../types";
import { FACE, PH } from "../photos";

export const TEAM: TeamMember[] = [
  { id: "t1", name: "Helena Prado", role: "Sócia fundadora, arquiteta", photo: FACE.helena, bio: "Desenha casas pensando no sol da tarde e na conta de luz de quem vai morar.", status: "publicado", updatedAt: "2026-06-10T10:00" },
  { id: "t2", name: "Rafael Antunes", role: "Arquiteto, projetos residenciais", photo: FACE.rafael, bio: "Cuida de cada obra do primeiro croqui até a vistoria da chave.", status: "publicado", updatedAt: "2026-06-10T10:00" },
  { id: "t3", name: "Marina Costa", role: "Designer de interiores", photo: FACE.marina, bio: "Escolhe madeira, tecido e luz como quem monta uma casa para os próprios pais.", status: "publicado", updatedAt: "2026-10-10T16:10" },
  { id: "t4", name: "Otávio Lins", role: "Coordenador de obras", photo: FACE.otavio, bio: "Faz a ponte entre o desenho e o canteiro, com cronograma na parede.", status: "publicado", updatedAt: "2026-06-10T10:00" },
  { id: "t5", name: "Luiza Ferraz", role: "Arquiteta, interiores comerciais", photo: FACE.luiza, bio: "Lojas e escritórios que precisam funcionar no primeiro dia de portas abertas.", status: "publicado", updatedAt: "2026-06-10T10:00" },
  { id: "t6", name: "Caio Mendes", role: "Marketing e conteúdo", photo: FACE.caio, bio: "Transforma cada obra entregue em post, foto e história para o site.", status: "publicado", updatedAt: "2026-06-10T10:00" },
  { id: "t7", name: "Bia Torres", role: "Atendimento", photo: FACE.bia, bio: "A primeira voz no WhatsApp e quem marca a visita técnica.", status: "publicado", updatedAt: "2026-06-10T10:00" },
  { id: "t8", name: "Tiago Rocha", role: "Estagiário de projeto", photo: FACE.tiago, bio: "Maquetes, levantamentos e muitas medições de parede.", status: "rascunho", updatedAt: "2026-10-19T10:00" },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: "d1", author: "Juliana e Pedro", context: "Apartamento em Pinheiros, 82 m²", photo: FACE.c1, quote: "A obra terminou na data, e a cozinha virou o lugar onde a família inteira fica.", status: "publicado", updatedAt: "2026-05-02T10:00" },
  { id: "d2", author: "Renata S.", context: "Casa na Granja Viana", photo: FACE.c2, quote: "Entenderam o que eu queria antes de eu saber explicar. A sala com o forro de madeira é exatamente isso.", status: "publicado", updatedAt: "2026-05-02T10:00" },
  { id: "d3", author: "Marcos e Ana", context: "Reforma em Moema, 70 m²", photo: FACE.c4, quote: "Moramos durante a reforma e mesmo assim deu certo. O cronograma na parede salvou nosso casamento.", status: "publicado", updatedAt: "2026-06-21T10:00" },
  { id: "d4", author: "Clínica Respira", context: "Interiores comerciais, Vila Mariana", photo: FACE.c5, quote: "Os pacientes elogiam a recepção toda semana. Ficou calma sem parecer hospital.", status: "publicado", updatedAt: "2026-07-14T10:00" },
  { id: "d5", author: "Fernanda L.", context: "Casa na Serra da Cantareira", photo: FACE.c3, quote: "A casa conversa com a mata. Abro a janela e parece que a varanda continua lá fora.", status: "rascunho", updatedAt: "2026-10-12T10:00" },
  { id: "d6", author: "Gustavo R.", context: "Loft na Barra Funda", photo: FACE.c6, quote: "Cada centímetro foi pensado. Cabe tudo e ainda sobra espaço para receber os amigos.", status: "publicado", updatedAt: "2026-08-03T10:00" },
  { id: "d7", author: "Patrícia M.", context: "Apartamento em Perdizes", photo: FACE.c9, quote: "Fiquei com medo de reformar com dois filhos pequenos. Foi a obra mais tranquila que já vi.", status: "publicado", updatedAt: "2026-08-19T10:00" },
  { id: "d8", author: "Café Varanda", context: "Cafeteria na Vila Madalena", photo: FACE.c7, quote: "A fila da porta virou parte da decoração. O balcão foi desenhado para isso.", status: "rascunho", updatedAt: "2026-09-30T10:00" },
  { id: "d9", author: "Lúcia e Roberto", context: "Casa em Cotia", photo: FACE.c10, quote: "Depois de trinta anos na mesma casa, ela parece nova e continua sendo nossa.", status: "publicado", updatedAt: "2026-09-02T10:00" },
  { id: "d10", author: "André K.", context: "Escritório no Itaim", photo: FACE.c8, quote: "A equipe voltou para o escritório porque gosta de estar lá. Isso não tem preço.", status: "publicado", updatedAt: "2026-09-15T10:00" },
];

export const PROJECTS: Project[] = [
  { id: "p1", title: "Casa da Serra", city: "Mairiporã", year: 2026, area: 310, category: "Casa", cover: PH.salaMata, featured: true, status: "publicado", updatedAt: "2026-08-29T11:00" },
  { id: "p2", title: "Casa Jabuticabeiras", city: "Cotia", year: 2026, area: 280, category: "Casa", cover: PH.varandaJantar, featured: true, status: "publicado", updatedAt: "2026-10-07T15:30" },
  { id: "p3", title: "Apto Pinheiros", city: "São Paulo", year: 2025, area: 82, category: "Apartamento", cover: PH.salaLaranja, featured: true, status: "publicado", updatedAt: "2026-09-27T10:00" },
  { id: "p4", title: "Sala do Forro", city: "Granja Viana", year: 2025, area: 190, category: "Interiores", cover: PH.forroMadeira, featured: false, status: "publicado", updatedAt: "2026-05-02T10:00" },
  { id: "p5", title: "Cozinha do Quintal", city: "Alto de Pinheiros", year: 2025, area: 36, category: "Interiores", cover: PH.cozinhaJardim, featured: true, status: "publicado", updatedAt: "2026-05-02T10:00" },
  { id: "p6", title: "Clínica Respira", city: "Vila Mariana", year: 2025, area: 140, category: "Comercial", cover: PH.bege, featured: false, status: "publicado", updatedAt: "2026-07-14T10:00" },
  { id: "p7", title: "Loft Barra Funda", city: "São Paulo", year: 2024, area: 64, category: "Apartamento", cover: PH.loft, featured: false, status: "publicado", updatedAt: "2026-08-03T10:00" },
  { id: "p8", title: "Casa do Vale", city: "Itatiba", year: 2024, area: 260, category: "Casa", cover: PH.janelaVale, featured: true, status: "publicado", updatedAt: "2026-04-11T10:00" },
  { id: "p9", title: "Apto Perdizes", city: "São Paulo", year: 2024, area: 96, category: "Apartamento", cover: PH.salaClara, featured: false, status: "publicado", updatedAt: "2026-08-19T10:00" },
  { id: "p10", title: "Varanda Moema", city: "São Paulo", year: 2026, area: 70, category: "Apartamento", cover: PH.sacada, featured: false, status: "rascunho", updatedAt: "2026-10-21T10:00" },
  { id: "p11", title: "Café Varanda", city: "Vila Madalena", year: 2025, area: 88, category: "Comercial", cover: PH.jantarMadeira, featured: false, status: "publicado", updatedAt: "2026-09-30T10:00" },
  { id: "p12", title: "Casa Concreto e Mata", city: "Embu das Artes", year: 2023, area: 340, category: "Casa", cover: PH.concreto, featured: false, status: "publicado", updatedAt: "2026-03-08T10:00" },
];

export const BANNERS: Banner[] = [
  { id: "b1", title: "Reforma de apartamento", subtitle: "Agenda de visitas técnicas aberta até 30 de novembro", cta: "Agendar visita", until: "2026-11-30", status: "publicado", updatedAt: "2026-10-22T12:30" },
  { id: "b2", title: "Interiores comerciais", subtitle: "Lojas e consultórios prontos para abrir em janeiro", cta: "Conversar", until: "2026-12-15", status: "rascunho", updatedAt: "2026-10-19T10:00" },
  { id: "b3", title: "Casa nova em 2027", subtitle: "Projetos residenciais com início de obra no primeiro semestre", cta: "Ver projetos", until: "2027-01-31", status: "rascunho", updatedAt: "2026-10-05T10:00" },
  { id: "b4", title: "Black Friday 2025", subtitle: "Faixa antiga, guardada para referência", cta: "Saiba mais", until: "2025-11-30", status: "rascunho", updatedAt: "2025-12-02T10:00" },
];

export const POSTS: Post[] = [
  { id: "n1", title: "Quanto custa reformar um apartamento de 70 m²", category: "Reforma", cover: PH.sacada, readMin: 7, status: "rascunho", updatedAt: "2026-10-22T09:40" },
  { id: "n2", title: "Luz da tarde: como posicionar a sala em São Paulo", category: "Projeto", cover: PH.salaVista, readMin: 5, status: "publicado", updatedAt: "2026-10-18T08:30" },
  { id: "n3", title: "Forro de madeira: o que muda no conforto térmico", category: "Materiais", cover: PH.forroMadeira, readMin: 6, status: "publicado", updatedAt: "2026-09-30T08:30" },
  { id: "n4", title: "Morar durante a obra sem perder a paciência", category: "Reforma", cover: PH.salaClara, readMin: 8, status: "publicado", updatedAt: "2026-09-12T08:30" },
  { id: "n5", title: "Cozinha integrada com quintal: cinco cuidados", category: "Projeto", cover: PH.cozinhaJardim, readMin: 5, status: "publicado", updatedAt: "2026-08-28T08:30" },
  { id: "n6", title: "Iluminação em camadas para salas pequenas", category: "Interiores", cover: PH.lareira, readMin: 4, status: "publicado", updatedAt: "2026-08-10T08:30" },
  { id: "n7", title: "Concreto aparente sem cara de garagem", category: "Materiais", cover: PH.concreto, readMin: 6, status: "publicado", updatedAt: "2026-07-22T08:30" },
  { id: "n8", title: "Plantas que aguentam apartamento com pouca luz", category: "Interiores", cover: PH.salaQuadros, readMin: 4, status: "publicado", updatedAt: "2026-07-03T08:30" },
  { id: "n9", title: "O que levar para a primeira reunião com a arquiteta", category: "Projeto", cover: PH.maquete, readMin: 3, status: "publicado", updatedAt: "2026-06-15T08:30" },
  { id: "n10", title: "Varanda gourmet: quando vale fechar com vidro", category: "Reforma", cover: PH.varandaJantar, readMin: 5, status: "publicado", updatedAt: "2026-05-30T08:30" },
  { id: "n11", title: "Marcenaria sob medida ou móvel pronto?", category: "Interiores", cover: PH.estante, readMin: 6, status: "publicado", updatedAt: "2026-05-11T08:30" },
  { id: "n12", title: "Janelas grandes e a conta do ar-condicionado", category: "Materiais", cover: PH.salaMata, readMin: 5, status: "rascunho", updatedAt: "2026-10-02T08:30" },
];
