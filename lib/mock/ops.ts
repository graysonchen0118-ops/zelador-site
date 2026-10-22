import type { Access, Publication } from "../types";
import { FACE } from "../photos";

export const PUBLICATIONS: Publication[] = [
  { id: "pub-24", at: "2026-10-10T16:10", author: "Zelador", summary: "Foto da Marina na equipe", changes: 1, backup: "Backup 10 out, 16h08", state: "no-ar" },
  { id: "pub-23", at: "2026-10-07T15:30", author: "Zelador", summary: "Projeto Casa Jabuticabeiras no portfólio", changes: 1, backup: "Backup 7 out, 15h27", state: "substituida" },
  { id: "pub-22", at: "2026-10-04T11:00", author: "Zelador", summary: "Selo da campanha de volta nos cards da Reforma", changes: 1, backup: "Backup 4 out, 10h58", state: "substituida" },
  { id: "pub-21", at: "2026-10-02T15:45", author: "Zelador", summary: "Texto novo do Sobre", changes: 1, backup: "Backup 2 out, 15h41", state: "substituida" },
  { id: "pub-20", at: "2026-10-01T13:20", author: "Zelador", summary: "Link do WhatsApp com o número novo", changes: 1, backup: "Backup 1 out, 13h17", state: "substituida" },
  { id: "pub-19", at: "2026-09-27T10:00", author: "Zelador", summary: "Capa nova do Apto Pinheiros", changes: 1, backup: "Backup 27 set, 9h55", state: "substituida" },
  { id: "pub-18", at: "2026-09-24T09:00", author: "Zelador", summary: "Política de privacidade revisada", changes: 1, backup: "Backup 24 set, 8h57", state: "substituida" },
  { id: "pub-17", at: "2026-09-19T10:30", author: "Zelador", summary: "Favicon novo", changes: 1, backup: "Backup 19 set, 10h26", state: "substituida" },
  { id: "pub-16", at: "2026-09-16T18:00", author: "Zelador", summary: "Mensagem de enviado no formulário da Reforma", changes: 1, backup: "Backup 16 set, 17h56", state: "substituida" },
  { id: "pub-15", at: "2026-09-10T15:00", author: "Zelador", summary: "Faixa de Natal retirada", changes: 1, backup: "Backup 10 set, 14h58", state: "substituida" },
  { id: "pub-14", at: "2026-09-05T09:20", author: "Zelador", summary: "Logo novo na faixa de parceiros", changes: 1, backup: "Backup 5 set, 9h18", state: "substituida" },
  { id: "pub-13", at: "2026-08-29T11:00", author: "Zelador", summary: "Ordem dos projetos na Home", changes: 1, backup: "Backup 29 ago, 10h57", state: "substituida" },
];

export const ACCESS: Access[] = [
  { id: "a1", name: "Helena Prado", role: "Sócia fundadora", photo: FACE.helena, level: "proprietario", lastSeen: "2026-10-23T09:12", status: "ativo" },
  { id: "a2", name: "Caio Mendes", role: "Marketing", photo: FACE.caio, level: "editor", lastSeen: "2026-10-22T18:02", status: "ativo" },
  { id: "a3", name: "Bia Torres", role: "Atendimento", photo: FACE.bia, level: "editor", lastSeen: "2026-10-22T17:40", status: "ativo" },
  { id: "a4", name: "Zelador", role: "Manutenção do site", photo: FACE.c11, level: "designer", lastSeen: "2026-10-23T09:40", status: "ativo" },
  { id: "a5", name: "Agência anterior", role: "Montou o site em 2025", photo: FACE.c4, level: "agencia", lastSeen: "2026-03-02T11:00", status: "ativo" },
  { id: "a6", name: "Freelancer de 2025", role: "Fez a página da campanha", photo: FACE.c8, level: "designer", lastSeen: "2025-12-04T15:00", status: "ativo" },
];

export const LEVEL_LABEL: Record<Access["level"], string> = {
  proprietario: "Dono do site",
  editor: "Edita conteúdo",
  designer: "Mexe no layout",
  agencia: "Dona do workspace",
};
