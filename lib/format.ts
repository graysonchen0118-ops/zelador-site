// Datas formatadas à mão para o servidor e o navegador escreverem igual.
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const HOJE = "2026-10-23T10:00:00";

function parts(iso: string) {
  const [d, t = "00:00"] = iso.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [hh, mm] = t.split(":");
  return { y, m, day, hh, mm };
}

export function dataCurta(iso: string): string {
  const p = parts(iso);
  return `${p.day} ${MESES[p.m - 1]}`;
}

export function dataHora(iso: string): string {
  const p = parts(iso);
  return `${p.day} ${MESES[p.m - 1]}, ${Number(p.hh)}h${p.mm}`;
}

function dayIndex(iso: string): number {
  const p = parts(iso);
  return Date.UTC(p.y, p.m - 1, p.day) / 86400000;
}

export function haQuanto(iso: string): string {
  const diff = dayIndex(HOJE) - dayIndex(iso);
  if (diff <= 0) return "hoje";
  if (diff === 1) return "ontem";
  if (diff < 7) return `há ${diff} dias`;
  if (diff < 14) return "há 1 semana";
  if (diff < 31) return `há ${Math.floor(diff / 7)} semanas`;
  const meses = Math.floor(diff / 30);
  return meses <= 1 ? "há 1 mês" : `há ${meses} meses`;
}

export function kb(v: number): string {
  if (v >= 1000) return `${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} MB`;
  return `${Math.round(v)} KB`;
}

export function num(v: number): string {
  return v.toLocaleString("pt-BR");
}

let seq = 0;
export function nowIso(): string {
  // hora "agora" dentro do dia de hoje, avançando um minuto por ação
  seq += 1;
  const mins = 10 * 60 + seq;
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `2026-10-23T${hh}:${mm}`;
}

export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// tempo estimado até a foto principal aparecer num 4G comum
export function tempo4g(kbTotal: number): number {
  return 0.9 + kbTotal / 1450;
}

export function seg(v: number): string {
  return `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} s`;
}
