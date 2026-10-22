// Fotos reais do Unsplash, interiores e retratos.
export const PH = {
  forroMadeira: "photo-1786462543680-38fa07943fab",
  varandaJantar: "photo-1749433157410-357a3311e921",
  salaJardim: "photo-1760067537064-b3a93d6e4bc2",
  cozinhaJardim: "photo-1760067537540-cc36c1700d7e",
  corredorVidro: "photo-1688469625388-e6f8d43df357",
  salaCidade: "photo-1624411720833-3e47e6d42e09",
  salaMata: "photo-1758565811178-6341e9999f48",
  jantarMontanha: "photo-1782795799287-a3ca32de0d72",
  jantarMadeira: "photo-1636138390540-de85ed519d40",
  vaoLivre: "photo-1711049757381-09bc6369804e",
  concreto: "photo-1625308216182-218ff63d47bb",
  bege: "photo-1781910291414-87df47b3165b",
  salaLaranja: "photo-1618220179428-22790b461013",
  salaClara: "photo-1617228133035-2347f159e755",
  estante: "photo-1772797583328-f83bc3f94f80",
  salaQuadros: "photo-1600210492486-724fe5c67fb0",
  lareira: "photo-1616593871468-2a9452218369",
  janelaVale: "photo-1606202598125-e2077bb5ebcc",
  salaVista: "photo-1758565811176-ccd94357a844",
  sacada: "photo-1663659515592-bd9f8a87fdb5",
  loft: "photo-1783667440357-bf89d00c2077",
  maquete: "photo-1772442198907-765685249ea4",
} as const;

export const FACE = {
  helena: "photo-1573497019940-1c28c88b4f3e",
  rafael: "photo-1705645930353-0e335311ef20",
  marina: "photo-1581322929625-f4aab333778a",
  otavio: "photo-1527980965255-d3b416303d12",
  luiza: "photo-1645107914072-6f16b732f224",
  caio: "photo-1522529599102-193c0d76b5b6",
  bia: "photo-1607990283143-e81e7a2c9349",
  tiago: "photo-1592234789031-94bf65f630ed",
  c1: "photo-1494790108377-be9c29b29330",
  c2: "photo-1609371497456-3a55a205d5eb",
  c3: "photo-1581322929597-aa39ca1ccff7",
  c4: "photo-1633367583895-08545d733dfe",
  c5: "photo-1507003211169-0a1dd7228f2d",
  c6: "photo-1500648767791-00dcc994a43e",
  c7: "photo-1602896441343-ed0dc62ed65e",
  c8: "photo-1761980958548-7babac83ef3d",
  c9: "photo-1595211877493-41a4e5f236b3",
  c10: "photo-1573496358961-3c82861ab8f4",
  c11: "photo-1651684215020-f7a5b6610f23",
} as const;

export function img(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=75&auto=format`;
}

export function face(id: string, size = 96): string {
  return `https://images.unsplash.com/${id}?w=${size}&h=${size}&fit=crop&crop=faces&q=75&auto=format`;
}
