export type MenuType = "Pembuka" | "Utama" | "Penutup";

export interface Menu {
  id: number;
  type: MenuType;
  name: string;
  ingredients: string[];
  rareIngredients: string[];
  jasa: number;
  tip?: string;
}

export interface MarketCard {
  id: number;
  category: string;
  name: string;
  price: number;
  tier: string;
  isRare?: boolean;
}

export interface Player {
  name: string;
  cash: number;
  menus: Menu[];
  bought: Record<number, string[]>;
  completed: number[];
  totalJasa: number;
}

export interface GameState {
  players: Player[];
  deck: string[];
  turn: number;
  revealed: string | null;
  flipping: boolean;
  isMultiplayer?: boolean;
  roomCode?: string;
}

export const MARKET_CARDS: MarketCard[] = [
  // ================= SERI LAUK-PAUK (20 CARDS) =================
  { "id": 1, "category": "Lauk", "name": "Daging Sapi", "price": 50000, "tier": "Premium" },
  { "id": 2, "category": "Lauk", "name": "Daging Kambing", "price": 50000, "tier": "Premium" },
  { "id": 3, "category": "Lauk", "name": "Lobster", "price": 50000, "tier": "Premium" },
  { "id": 4, "category": "Lauk", "name": "Ikan Salmon", "price": 50000, "tier": "Premium" },
  { "id": 5, "category": "Lauk", "name": "Daging Ayam", "price": 20000, "tier": "Medium" },
  { "id": 6, "category": "Lauk", "name": "Cumi-Cumi", "price": 20000, "tier": "Medium" },
  { "id": 7, "category": "Lauk", "name": "Udang", "price": 20000, "tier": "Medium" },
  { "id": 8, "category": "Lauk", "name": "Ikan Gurami", "price": 20000, "tier": "Medium" },
  { "id": 9, "category": "Lauk", "name": "Ikan Kakap", "price": 20000, "tier": "Medium" },
  { "id": 10, "category": "Lauk", "name": "Ikan Tuna", "price": 20000, "tier": "Medium" },
  { "id": 11, "category": "Lauk", "name": "Ikan Kembung", "price": 20000, "tier": "Medium" },
  { "id": 12, "category": "Lauk", "name": "Belut", "price": 20000, "tier": "Medium" },
  { "id": 13, "category": "Lauk", "name": "Tempe", "price": 5000, "tier": "Ekonomis" },
  { "id": 14, "category": "Lauk", "name": "Tahu", "price": 5000, "tier": "Ekonomis" },
  { "id": 15, "category": "Lauk", "name": "Telur", "price": 5000, "tier": "Ekonomis" },
  { "id": 16, "category": "Lauk", "name": "Kepiting", "price": 20000, "tier": "Medium" },
  { "id": 17, "category": "Lauk", "name": "Kerang", "price": 5000, "tier": "Ekonomis" },
  { "id": 18, "category": "Lauk", "name": "Ikan Mujair", "price": 5000, "tier": "Ekonomis" },
  { "id": 19, "category": "Lauk", "name": "Ikan Lele", "price": 5000, "tier": "Ekonomis" },
  { "id": 20, "category": "Lauk", "name": "Ikan Bandeng", "price": 5000, "tier": "Ekonomis" },

  // ================= SERI SAYUR-MAYUR (20 CARDS) =================
  { "id": 21, "category": "Sayur", "name": "Wortel", "price": 5000, "tier": "Ekonomis" },
  { "id": 22, "category": "Sayur", "name": "Kentang", "price": 5000, "tier": "Ekonomis" },
  { "id": 23, "category": "Sayur", "name": "Tomat", "price": 5000, "tier": "Ekonomis" },
  { "id": 24, "category": "Sayur", "name": "Kecambah", "price": 5000, "tier": "Ekonomis" },
  { "id": 25, "category": "Sayur", "name": "Terong", "price": 5000, "tier": "Ekonomis" },
  { "id": 26, "category": "Sayur", "name": "Labu Siam", "price": 5000, "tier": "Ekonomis" },
  { "id": 27, "category": "Sayur", "name": "Kol", "price": 5000, "tier": "Ekonomis" },
  { "id": 28, "category": "Sayur", "name": "Selada", "price": 5000, "tier": "Ekonomis" },
  { "id": 29, "category": "Sayur", "name": "Kacang Panjang", "price": 5000, "tier": "Ekonomis" },
  { "id": 30, "category": "Sayur", "name": "Brokoli", "price": 5000, "tier": "Ekonomis" },
  { "id": 31, "category": "Sayur", "name": "Pare", "price": 5000, "tier": "Ekonomis" },
  { "id": 32, "category": "Sayur", "name": "Mentimun", "price": 5000, "tier": "Ekonomis" },
  { "id": 33, "category": "Sayur", "name": "Serai", "price": 5000, "tier": "Ekonomis" },
  { "id": 34, "category": "Sayur", "name": "Sawi", "price": 5000, "tier": "Ekonomis" },
  { "id": 35, "category": "Sayur", "name": "Lobak", "price": 5000, "tier": "Ekonomis" },
  { "id": 36, "category": "Sayur", "name": "Jagung", "price": 5000, "tier": "Ekonomis" },
  { "id": 37, "category": "Sayur", "name": "Buncis", "price": 5000, "tier": "Ekonomis" },
  { "id": 38, "category": "Sayur", "name": "Bayam", "price": 5000, "tier": "Ekonomis" },
  { "id": 39, "category": "Sayur", "name": "Kangkung", "price": 5000, "tier": "Ekonomis" },
  { "id": 40, "category": "Sayur", "name": "Seledri", "price": 5000, "tier": "Ekonomis" },

  // ================= SERI BUAH-BUAHAN (20 CARDS) =================
  { "id": 41, "category": "Buah", "name": "Semangka", "price": 5000, "tier": "Ekonomis" },
  { "id": 42, "category": "Buah", "name": "Melon", "price": 5000, "tier": "Ekonomis" },
  { "id": 43, "category": "Buah", "name": "Buah Naga", "price": 5000, "tier": "Ekonomis" },
  { "id": 44, "category": "Buah", "name": "Alpukat", "price": 5000, "tier": "Ekonomis" },
  { "id": 45, "category": "Buah", "name": "Kurma", "price": 5000, "tier": "Ekonomis" },
  { "id": 46, "category": "Buah", "name": "Mangga", "price": 5000, "tier": "Ekonomis" },
  { "id": 47, "category": "Buah", "name": "Nanas", "price": 5000, "tier": "Ekonomis" },
  { "id": 48, "category": "Buah", "name": "Belimbing", "price": 5000, "tier": "Ekonomis" },
  { "id": 49, "category": "Buah", "name": "Pisang", "price": 5000, "tier": "Ekonomis" },
  { "id": 50, "category": "Buah", "name": "Nangka", "price": 5000, "tier": "Ekonomis" },
  { "id": 51, "category": "Buah", "name": "Durian", "price": 20000, "tier": "Medium" },
  { "id": 52, "category": "Buah", "name": "Kelengkeng", "price": 5000, "tier": "Ekonomis" },
  { "id": 53, "category": "Buah", "name": "Apel", "price": 5000, "tier": "Ekonomis" },
  { "id": 54, "category": "Buah", "name": "Jeruk", "price": 5000, "tier": "Ekonomis" },
  { "id": 55, "category": "Buah", "name": "Rambutan", "price": 5000, "tier": "Ekonomis" },
  { "id": 56, "category": "Buah", "name": "Delima", "price": 5000, "tier": "Ekonomis" },
  { "id": 57, "category": "Buah", "name": "Stroberi", "price": 5000, "tier": "Ekonomis" },
  { "id": 58, "category": "Buah", "name": "Jambu", "price": 5000, "tier": "Ekonomis" },
  { "id": 59, "category": "Buah", "name": "Anggur", "price": 20000, "tier": "Medium" },
  { "id": 60, "category": "Buah", "name": "Pepaya", "price": 5000, "tier": "Ekonomis" },

  // ================= SERI BUMBU DAPUR & RARE ITEMS (20 CARDS) =================
  { "id": 61, "category": "Bumbu", "name": "Bawang Putih", "price": 5000, "tier": "Ekonomis", "isRare": true },
  { "id": 62, "category": "Bumbu", "name": "Cabai", "price": 5000, "tier": "Ekonomis", "isRare": true },
  { "id": 63, "category": "Bumbu", "name": "Bawang Merah", "price": 5000, "tier": "Ekonomis", "isRare": true },
  { "id": 64, "category": "Bumbu", "name": "Gula", "price": 5000, "tier": "Ekonomis", "isRare": true },
  { "id": 65, "category": "Bumbu", "name": "Garam", "price": 5000, "tier": "Ekonomis", "isRare": true },
  { "id": 66, "category": "Bumbu", "name": "Lada", "price": 5000, "tier": "Ekonomis", "isRare": true },
  { "id": 67, "category": "Bumbu", "name": "Paprika", "price": 5000, "tier": "Ekonomis" },
  { "id": 68, "category": "Bumbu", "name": "Kunyit", "price": 5000, "tier": "Ekonomis" },
  { "id": 69, "category": "Bumbu", "name": "Kemiri", "price": 5000, "tier": "Ekonomis" },
  { "id": 70, "category": "Bumbu", "name": "Bawang Bombay", "price": 5000, "tier": "Ekonomis" },
  { "id": 71, "category": "Bumbu", "name": "Petai", "price": 5000, "tier": "Ekonomis" },
  { "id": 72, "category": "Bumbu", "name": "Keluak", "price": 5000, "tier": "Ekonomis" },
  { "id": 73, "category": "Bumbu", "name": "Cengkeh", "price": 5000, "tier": "Ekonomis" },
  { "id": 74, "category": "Bumbu", "name": "Kencur", "price": 5000, "tier": "Ekonomis" },
  { "id": 75, "category": "Bumbu", "name": "Lengkuas", "price": 5000, "tier": "Ekonomis" },
  { "id": 76, "category": "Bumbu", "name": "Asam Jawa", "price": 5000, "tier": "Ekonomis" },
  { "id": 77, "category": "Bumbu", "name": "Jahe", "price": 5000, "tier": "Ekonomis" },
  { "id": 78, "category": "Bumbu", "name": "Daun Bawang", "price": 5000, "tier": "Ekonomis" },
  { "id": 79, "category": "Bumbu", "name": "Ketumbar", "price": 5000, "tier": "Ekonomis" },
  { "id": 80, "category": "Bumbu", "name": "Kayu Manis", "price": 5000, "tier": "Ekonomis" }
];

export function priceOf(ingredient: string): number {
  const card = MARKET_CARDS.find((c) => c.name === ingredient);
  return card ? card.price : 5000;
}

export function tierOf(ingredient: string): "Premium" | "Medium" | "Ekonomis" {
  const card = MARKET_CARDS.find((c) => c.name === ingredient);
  return (card ? card.tier : "Ekonomis") as "Premium" | "Medium" | "Ekonomis";
}

export const MARKET_DECK: string[] = MARKET_CARDS.map((c) => c.name);

export const MENUS: Menu[] = [
  // ================= HIDANGAN UTAMA (10 ITEMS) =================
  {
    "id": 1,
    "type": "Utama",
    "name": "Rawon Daging Spesial",
    "ingredients": ["Daging Sapi", "Kentang", "Keluak"],
    "rareIngredients": ["Kentang"],
    "jasa": 95000
  },
  {
    "id": 2,
    "type": "Utama",
    "name": "Sate Kambing Rempah",
    "ingredients": ["Daging Kambing", "Bawang Bombay", "Cabai"],
    "rareIngredients": ["Cabai"],
    "jasa": 90000
  },
  {
    "id": 3,
    "type": "Utama",
    "name": "Lobster Saus Padang",
    "ingredients": ["Lobster", "Paprika", "Lada"],
    "rareIngredients": ["Lada"],
    "jasa": 120000
  },
  {
    "id": 4,
    "type": "Utama",
    "name": "Salmon Panggang",
    "ingredients": ["Ikan Salmon", "Mentimun", "Garam"],
    "rareIngredients": ["Garam"],
    "jasa": 110000
  },
  {
    "id": 5,
    "type": "Utama",
    "name": "Opor Ayam Kampung",
    "ingredients": ["Daging Ayam", "Kunyit", "Kemiri"],
    "rareIngredients": [],
    "jasa": 45000
  },
  {
    "id": 6,
    "type": "Utama",
    "name": "Cumi Tumis Pedas",
    "ingredients": ["Cumi-Cumi", "Petai", "Bawang Merah"],
    "rareIngredients": ["Bawang Merah"],
    "jasa": 55000
  },
  {
    "id": 7,
    "type": "Utama",
    "name": "Udang Sambal Balado",
    "ingredients": ["Udang", "Terong", "Bawang Putih"],
    "rareIngredients": ["Bawang Putih"],
    "jasa": 50000
  },
  {
    "id": 8,
    "type": "Utama",
    "name": "Gurami Bakar Madu",
    "ingredients": ["Ikan Gurami", "Labu Siam", "Serai"],
    "rareIngredients": ["Serai"],
    "jasa": 65000
  },
  {
    "id": 9,
    "type": "Utama",
    "name": "Gulai Kepala Kakap",
    "ingredients": ["Ikan Kakap", "Lengkuas", "Bawang Putih"],
    "rareIngredients": ["Bawang Putih"],
    "jasa": 75000
  },
  {
    "id": 10,
    "type": "Utama",
    "name": "Tuna Bakar Rica",
    "ingredients": ["Ikan Tuna", "Ketumbar", "Lada"],
    "rareIngredients": ["Lada"],
    "jasa": 75000
  },

  // ================= HIDANGAN PEMBUKA (10 ITEMS) =================
  {
    "id": 11,
    "type": "Pembuka",
    "name": "Cah Kembung Gurih",
    "ingredients": ["Ikan Kembung", "Sawi", "Bawang Merah"],
    "rareIngredients": ["Bawang Merah"],
    "jasa": 30000
  },
  {
    "id": 12,
    "type": "Pembuka",
    "name": "Belut Bakar",
    "ingredients": ["Belut", "Wortel", "Garam"],
    "rareIngredients": ["Garam"],
    "jasa": 35000
  },
  {
    "id": 13,
    "type": "Pembuka",
    "name": "Tumis Tahu Pedas",
    "ingredients": ["Tahu", "Kecambah", "Cabai"],
    "rareIngredients": ["Cabai"],
    "jasa": 25000
  },
  {
    "id": 14,
    "type": "Pembuka",
    "name": "Kepiting Rebus",
    "ingredients": ["Kepiting", "Kol", "Kentang"],
    "rareIngredients": ["Kentang"],
    "jasa": 40000
  },
  {
    "id": 15,
    "type": "Pembuka",
    "name": "Tumis Kangkung",
    "ingredients": ["Tempe", "Kangkung", "Kencur"],
    "rareIngredients": ["Tempe"],
    "jasa": 20000
  },
  {
    "id": 16,
    "type": "Pembuka",
    "name": "Orek Tempe",
    "ingredients": ["Tempe", "Kacang Panjang", "Daun Bawang"],
    "rareIngredients": ["Tempe"],
    "jasa": 20000
  },
  {
    "id": 17,
    "type": "Pembuka",
    "name": "Sup Kerang",
    "ingredients": ["Kerang", "Brokoli", "Tomat"],
    "rareIngredients": [],
    "jasa": 30000
  },
  {
    "id": 18,
    "type": "Pembuka",
    "name": "Ikan Mujair Goreng",
    "ingredients": ["Ikan Mujair", "Pare", "Selada"],
    "rareIngredients": [],
    "jasa": 25000
  },
  {
    "id": 19,
    "type": "Pembuka",
    "name": "Pecel Lele",
    "ingredients": ["Ikan Lele", "Lobak", "Buncis"],
    "rareIngredients": [],
    "jasa": 25000
  },
  {
    "id": 20,
    "type": "Pembuka",
    "name": "Bandeng Presto",
    "ingredients": ["Ikan Bandeng", "Bayam", "Seledri"],
    "rareIngredients": [],
    "jasa": 30000
  },

  // ================= HIDANGAN PENUTUP (10 ITEMS) =================
  {
    "id": 21,
    "type": "Penutup",
    "name": "Es Sop Buah",
    "ingredients": ["Semangka", "Melon", "Gula"],
    "rareIngredients": ["Gula"],
    "jasa": 20000
  },
  {
    "id": 22,
    "type": "Penutup",
    "name": "Alpukat Kocok",
    "ingredients": ["Alpukat", "Kurma", "Buah Naga"],
    "rareIngredients": [],
    "jasa": 35000
  },
  {
    "id": 23,
    "type": "Penutup",
    "name": "Rujak Manis",
    "ingredients": ["Mangga", "Nanas", "Belimbing"],
    "rareIngredients": [],
    "jasa": 20000
  },
  {
    "id": 24,
    "type": "Penutup",
    "name": "Kolak Pisang",
    "ingredients": ["Pisang", "Nangka", "Gula"],
    "rareIngredients": ["Gula"],
    "jasa": 20000
  },
  {
    "id": 25,
    "type": "Penutup",
    "name": "Pancake Durian",
    "ingredients": ["Durian", "Kelengkeng", "Telur"],
    "rareIngredients": ["Telur"],
    "jasa": 30000
  },
  {
    "id": 26,
    "type": "Penutup",
    "name": "Jus Kombinasi",
    "ingredients": ["Apel", "Jeruk", "Anggur"],
    "rareIngredients": [],
    "jasa": 20000
  },
  {
    "id": 27,
    "type": "Penutup",
    "name": "Es Rambutan",
    "ingredients": ["Rambutan", "Delima", "Stroberi"],
    "rareIngredients": [],
    "jasa": 25000
  },
  {
    "id": 28,
    "type": "Penutup",
    "name": "Puding Jambu",
    "ingredients": ["Jambu", "Pepaya", "Telur"],
    "rareIngredients": ["Telur"],
    "jasa": 20000
  },
  {
    "id": 29,
    "type": "Penutup",
    "name": "Wedang Jahe",
    "ingredients": ["Serai", "Jahe", "Kayu Manis"],
    "rareIngredients": ["Serai"],
    "jasa": 15000
  },
  {
    "id": 30,
    "type": "Penutup",
    "name": "Jasuke Tradisional",
    "ingredients": ["Jagung", "Asam Jawa", "Cengkeh"],
    "rareIngredients": [],
    "jasa": 15000
  }
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
  const pembuka = shuffle(MENUS.filter((m) => m.type === "Pembuka")).slice(0, 2);
  const utama = shuffle(MENUS.filter((m) => m.type === "Utama")).slice(0, 2);
  const penutup = shuffle(MENUS.filter((m) => m.type === "Penutup")).slice(0, 2);
  return [...pembuka, ...utama, ...penutup];
}