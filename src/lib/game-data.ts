export type MenuType = "Pembuka" | "Utama" | "Penutup";

export interface Menu {
  id: number;
  type: MenuType;
  name: string;
  ingredients: string[];
  jasa: number;
}

export const STARTER_PACK = [
  "Bawang Merah", "Bawang Putih", "Gula", "Garam", "Cabai",
  "Lada", "Kemiri", "Jahe", "Kunyit", "Daun Bawang",
];

export const PREMIUM = ["Daging Sapi", "Daging Kambing", "Lobster", "Ikan Salmon"];
export const MEDIUM = ["Daging Ayam", "Cumi-Cumi", "Udang", "Ikan Gurami"];
export const EKONOMIS = [
  "Wortel", "Kentang", "Paprika", "Tomat", "Kecambah", "Petai", "Labu Siam",
  "Tahu", "Tempe", "Terong", "Jagung", "Kol", "Selada", "Kacang Panjang",
  "Brokoli", "Pare", "Mentimun", "Semangka", "Melon", "Buah Naga", "Alpukat",
  "Kurma", "Mangga", "Nanas", "Belimbing", "Pisang", "Nangka", "Durian",
  "Kelengkeng", "Telur",
];

export function priceOf(ingredient: string): number {
  if (PREMIUM.includes(ingredient)) return 50000;
  if (MEDIUM.includes(ingredient)) return 20000;
  return 5000;
}

export function tierOf(ingredient: string): "Premium" | "Medium" | "Ekonomis" {
  if (PREMIUM.includes(ingredient)) return "Premium";
  if (MEDIUM.includes(ingredient)) return "Medium";
  return "Ekonomis";
}

export const MARKET_DECK: string[] = [...PREMIUM, ...MEDIUM, ...EKONOMIS];

export const MENUS: Menu[] = [
  { id: 1, type: "Utama", name: "Sop Daging Sapi Sehat", ingredients: ["Daging Sapi", "Wortel", "Kentang"], jasa: 90000 },
  { id: 2, type: "Utama", name: "Lobster Saus Padang", ingredients: ["Lobster", "Paprika"], jasa: 85000 },
  { id: 3, type: "Utama", name: "Sate Kambing Rempah", ingredients: ["Daging Kambing", "Tomat"], jasa: 80000 },
  { id: 4, type: "Utama", name: "Salmon Panggang Lada Putih", ingredients: ["Ikan Salmon", "Mentimun"], jasa: 80000 },
  { id: 5, type: "Utama", name: "Opor Ayam Kampung", ingredients: ["Daging Ayam", "Telur"], jasa: 45000 },
  { id: 6, type: "Utama", name: "Cumi Tumis Cabai Hijau", ingredients: ["Cumi-Cumi", "Tomat"], jasa: 45000 },
  { id: 7, type: "Utama", name: "Udang Balado Petai", ingredients: ["Udang", "Petai"], jasa: 45000 },
  { id: 8, type: "Utama", name: "Gurami Bakar Madu", ingredients: ["Ikan Gurami", "Labu Siam"], jasa: 40000 },
  { id: 9, type: "Utama", name: "Rawon Sapi Kecambah", ingredients: ["Daging Sapi", "Kecambah"], jasa: 85000 },
  { id: 10, type: "Utama", name: "Lodeh Tahu Tempe Kikil", ingredients: ["Tahu", "Tempe", "Terong"], jasa: 30000 },
  { id: 11, type: "Pembuka", name: "Bakwan Jagung Kriuk", ingredients: ["Jagung", "Kol", "Telur"], jasa: 35000 },
  { id: 12, type: "Pembuka", name: "Gado-Gado Siram", ingredients: ["Tahu", "Selada", "Kacang Panjang"], jasa: 35000 },
  { id: 13, type: "Pembuka", name: "Cah Brokoli Wortel", ingredients: ["Brokoli", "Wortel"], jasa: 25000 },
  { id: 14, type: "Pembuka", name: "Tumis Pare Anti Pahit", ingredients: ["Pare", "Tempe"], jasa: 25000 },
  { id: 15, type: "Pembuka", name: "Salad Selada Mentimun", ingredients: ["Selada", "Mentimun", "Tomat"], jasa: 30000 },
  { id: 16, type: "Penutup", name: "Sop Buah Tropis", ingredients: ["Semangka", "Melon", "Buah Naga"], jasa: 35000 },
  { id: 17, type: "Penutup", name: "Alpukat Kocok Kurma", ingredients: ["Alpukat", "Kurma"], jasa: 25000 },
  { id: 18, type: "Penutup", name: "Rujak Manis Pasar", ingredients: ["Mangga", "Nanas", "Belimbing"], jasa: 35000 },
  { id: 19, type: "Penutup", name: "Kolak Pisang Nangka", ingredients: ["Pisang", "Nangka"], jasa: 25000 },
  { id: 20, type: "Penutup", name: "Es Durian Kelengkeng", ingredients: ["Durian", "Kelengkeng"], jasa: 30000 },
];

export function formatRp(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function dealMenus(): Menu[] {
  const pembuka = shuffle(MENUS.filter((m) => m.type === "Pembuka")).slice(0, 1);
  const utama = shuffle(MENUS.filter((m) => m.type === "Utama")).slice(0, 2);
  const penutup = shuffle(MENUS.filter((m) => m.type === "Penutup")).slice(0, 2);
  return [...pembuka, ...utama, ...penutup];
}