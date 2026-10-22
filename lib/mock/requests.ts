import type { ChangeRequest, Pin, Priority, RequestStatus, RequestType } from "../types";

export const PEOPLE = {
  helena: "Helena Prado",
  caio: "Caio Mendes",
  bia: "Bia Torres",
} as const;

export const SECTIONS: Record<string, string> = {
  navbar: "Menu",
  hero: "Abertura",
  banner: "Faixa da campanha",
  projetos: "Projetos recentes",
  equipe: "Equipe",
  depoimentos: "Depoimentos",
  rodape: "Rodapé",
  formulario: "Formulário",
  conteudo: "Conteúdo da página",
  pagina: "Página inteira",
};

type Row = [
  string, // título
  string, // página
  string, // seção
  RequestType,
  Priority,
  RequestStatus,
  boolean, // em cópia de rascunho
  keyof typeof PEOPLE,
  string, // criado
  string, // atualizado
  string, // observação
  Pin?,
];

const ROWS: Row[] = [
  ["Trocar o telefone do rodapé para o número novo", "home", "rodape", "texto", "alta", "recebido", false, "bia", "2026-10-22T17:40", "2026-10-22T17:40", "O número antigo ainda aparece no rodapé de todas as páginas. O novo é (11) 3456-7890.", { section: "rodape", x: 22, y: 58 }],
  ["Botão Pedir orçamento não abre no iPhone", "home", "hero", "bug", "alta", "em-obra", true, "caio", "2026-10-21T09:15", "2026-10-22T15:20", "Dois clientes avisaram pelo WhatsApp. No Android abre normal.", { section: "hero", x: 18, y: 74 }],
  ["Incluir o depoimento da família Okada", "home", "depoimentos", "texto", "normal", "recebido", false, "helena", "2026-10-22T11:05", "2026-10-22T11:05", "Texto aprovado por eles, foto vem até sexta.", { section: "depoimentos", x: 64, y: 40 }],
  ["Remover o feed do Instagram que aparece vazio", "home", "projetos", "desempenho", "normal", "revisao", true, "caio", "2026-10-17T10:30", "2026-10-22T14:00", "Às vezes carrega em branco e deixa um buraco antes dos projetos.", { section: "projetos", x: 80, y: 12 }],
  ["Atualizar a faixa da campanha de reforma até 30 de novembro", "home", "banner", "imagem", "alta", "revisao", true, "caio", "2026-10-20T08:50", "2026-10-22T12:30", "Nova data e foto da cozinha da obra de Moema.", { section: "banner", x: 46, y: 50 }],
  ["Foto da Marina na equipe", "sobre", "equipe", "imagem", "normal", "publicado", false, "helena", "2026-10-08T14:00", "2026-10-10T16:10", "Marina entrou em setembro."],
  ["Nova página: Arquitetura comercial", "servicos", "pagina", "pagina-nova", "normal", "recebido", false, "helena", "2026-10-19T15:30", "2026-10-19T15:30", "Mesma estrutura de Interiores, com três projetos de loja e escritório."],
  ["Formulário de contato chega sem o campo cidade", "contato", "formulario", "bug", "alta", "em-obra", false, "bia", "2026-10-20T10:10", "2026-10-22T16:45", "Desde a semana passada o e-mail vem sem a cidade. Ajuste sendo feito direto na página."],
  ["Espaçamento dos cards de projeto no celular", "projetos", "projetos", "layout", "normal", "em-obra", true, "caio", "2026-10-16T09:00", "2026-10-22T10:00", "No celular os cards ficam colados um no outro."],
  ["Home lenta no 4G", "home", "pagina", "desempenho", "alta", "em-obra", true, "helena", "2026-10-14T18:20", "2026-10-21T11:00", "Demora para a foto de abertura aparecer quando está fora do Wi-Fi."],
  ["Projeto Casa Jabuticabeiras no portfólio", "projetos", "conteudo", "texto", "normal", "publicado", false, "helena", "2026-10-06T10:00", "2026-10-07T15:30", "Fotos e ficha técnica no Drive."],
  ["Texto novo do Sobre", "sobre", "conteudo", "texto", "baixa", "publicado", false, "helena", "2026-09-29T09:30", "2026-10-02T15:45", "Versão revisada pela Helena."],
  ["Link do WhatsApp abre o número antigo", "home", "rodape", "bug", "alta", "publicado", false, "bia", "2026-10-01T08:40", "2026-10-01T13:20", "Botão flutuante em todas as páginas."],
  ["Post: quanto custa reformar um apartamento de 70 m²", "post", "conteudo", "texto", "normal", "revisao", true, "caio", "2026-10-15T16:00", "2026-10-22T09:40", "Texto pronto, falta a foto de capa."],
  ["Menu sobrepõe o logo no tablet", "home", "navbar", "layout", "normal", "recebido", false, "caio", "2026-10-21T13:25", "2026-10-21T13:25", "Acontece só com o tablet na vertical.", { section: "navbar", x: 70, y: 50 }],
  ["Página de obrigado com link para o portfólio", "obrigado", "conteudo", "layout", "baixa", "recebido", false, "bia", "2026-10-18T10:00", "2026-10-18T10:00", "Hoje a pessoa envia o formulário e fica sem para onde ir."],
  ["Título da página Interiores com fonte diferente", "interiores", "hero", "bug", "baixa", "revisao", true, "helena", "2026-10-13T11:00", "2026-10-21T17:10", "Parece outra fonte, mais fina que nas outras páginas."],
  ["Política de privacidade revisada", "privacidade", "conteudo", "texto", "normal", "publicado", false, "helena", "2026-09-22T10:00", "2026-09-24T09:00", "Texto enviado pelo jurídico."],
  ["Favicon novo com o símbolo da marca", "home", "pagina", "imagem", "baixa", "publicado", false, "caio", "2026-09-18T15:00", "2026-09-19T10:30", ""],
  ["Seção de perguntas frequentes na Reforma", "reforma", "conteudo", "layout", "normal", "recebido", false, "caio", "2026-10-22T09:00", "2026-10-22T09:00", "As cinco perguntas que mais chegam no WhatsApp."],
  ["Vídeo do Sobre trava no celular", "sobre", "conteudo", "desempenho", "normal", "recebido", false, "bia", "2026-10-21T19:10", "2026-10-21T19:10", "Fica girando e a página pula quando termina de carregar."],
  ["Trocar foto de capa do projeto Apto Pinheiros", "projetos", "conteudo", "imagem", "baixa", "publicado", false, "helena", "2026-09-26T14:10", "2026-09-27T10:00", ""],
  ["Formulário da Reforma sem mensagem de enviado", "reforma", "formulario", "bug", "alta", "publicado", false, "bia", "2026-09-15T09:00", "2026-09-16T18:00", "O botão girava e não mostrava nada depois."],
  ["Tirar a faixa de Natal do ano passado", "home", "banner", "texto", "baixa", "publicado", false, "caio", "2026-09-10T10:00", "2026-09-10T15:00", ""],
  ["Logo da revista Casa e Jardim na faixa de parceiros", "home", "projetos", "imagem", "baixa", "publicado", false, "helena", "2026-09-04T11:00", "2026-09-05T09:20", ""],
  ["Ordem dos projetos na Home", "home", "projetos", "layout", "normal", "publicado", false, "helena", "2026-08-28T16:00", "2026-08-29T11:00", "Casa da Serra primeiro."],
  ["Endereço novo no Google Maps do Contato", "contato", "conteudo", "texto", "normal", "publicado", false, "bia", "2026-08-20T10:00", "2026-08-20T17:00", ""],
  ["Bio do Rafael na equipe", "sobre", "equipe", "texto", "baixa", "recebido", false, "helena", "2026-10-20T08:30", "2026-10-20T08:30", "Incluir a especialização em iluminação."],
  ["Corrigir acentos no rodapé do blog", "blog", "rodape", "texto", "baixa", "publicado", false, "caio", "2026-08-14T09:00", "2026-08-14T12:00", ""],
  ["Página Trabalhe conosco com vaga de estágio", "trabalhe", "conteudo", "texto", "normal", "revisao", true, "helena", "2026-10-19T10:00", "2026-10-22T08:15", "Vaga de estágio em interiores, inscrições até dezembro."],
  ["Galeria do projeto abre a foto cortada", "projeto", "conteudo", "bug", "normal", "em-obra", false, "caio", "2026-10-21T16:00", "2026-10-22T17:05", "As fotos em pé aparecem cortadas na galeria. Ajuste sendo feito direto no modelo."],
  ["Selo da campanha some nos cards da Reforma", "reforma", "projetos", "bug", "normal", "publicado", false, "bia", "2026-10-03T10:00", "2026-10-04T11:00", "Voltou depois de uma limpeza de estilos feita por outra pessoa."],
];

export const REQUESTS: ChangeRequest[] = ROWS.map(
  ([title, page, section, type, priority, status, inDraft, who, created, updated, notes, pin], i) => ({
    id: `P-${101 + i}`,
    title,
    page,
    section,
    type,
    priority,
    status,
    inDraft,
    requester: PEOPLE[who],
    createdAt: created,
    updatedAt: updated,
    notes,
    pin,
    history:
      status === "recebido"
        ? [{ at: created, text: "Pedido recebido" }]
        : status === "publicado"
          ? [
              { at: created, text: "Pedido recebido" },
              { at: updated, text: "Publicado, com backup antes" },
            ]
          : [
              { at: created, text: "Pedido recebido" },
              { at: updated, text: inDraft ? "Em andamento numa cópia de rascunho da página" : "Em andamento direto na página" },
            ],
  }),
);

export const TYPE_LABEL: Record<RequestType, string> = {
  texto: "Texto",
  imagem: "Imagem",
  layout: "Layout",
  bug: "Algo quebrado",
  "pagina-nova": "Página nova",
  desempenho: "Velocidade",
};

export const STATUS_LABEL: Record<RequestStatus, string> = {
  recebido: "Recebido",
  "em-obra": "Em andamento",
  revisao: "Pronto para revisar",
  publicado: "No ar",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
};
