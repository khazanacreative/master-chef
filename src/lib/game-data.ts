export type MenuType = "Pembuka" | "Utama" | "Penutup";

export interface Menu {
  id: number;
  type: MenuType;
  name: string;
  ingredients: string[];
  rareIngredients: string[];
  jasa: number;
  tip: string;
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
  // ================= HIDANGAN UTAMA (15 ITEMS) =================
  {
    "id": 1,
    "type": "Utama",
    "name": "Sop Daging Sapi Sehat",
    "ingredients": ["Daging Sapi", "Wortel", "Kentang", "Bawang Putih"],
    "rareIngredients": ["Bawang Putih"],
    "jasa": 90000,
    "tip": "Rebus daging dengan api kecil agar kaldunya bening dan gurih!"
  },
  {
    "id": 2,
    "type": "Utama",
    "name": "Lobster Saus Padang",
    "ingredients": ["Lobster", "Paprika", "Cabai", "Bawang Merah"],
    "rareIngredients": ["Cabai", "Bawang Merah"],
    "jasa": 85000,
    "tip": "Tumis bumbu halus sampai harum sebelum lobster dimasukkan."
  },
  {
    "id": 3,
    "type": "Utama",
    "name": "Sate Kambing Rempah",
    "ingredients": ["Daging Kambing", "Tomat", "Bawang Merah"],
    "rareIngredients": ["Bawang Merah"],
    "jasa": 80000,
    "tip": "Bungkus daging dengan daun pepaya agar lebih empuk alami."
  },
  {
    "id": 4,
    "type": "Utama",
    "name": "Salmon Panggang Lada",
    "ingredients": ["Ikan Salmon", "Mentimun", "Lada"],
    "rareIngredients": ["Lada"],
    "jasa": 80000,
    "tip": "Panggang bagian kulit terlebih dahulu untuk sensasi krispi."
  },
  {
    "id": 5,
    "type": "Utama",
    "name": "Opor Ayam Kampung",
    "ingredients": ["Daging Ayam", "Kunyit", "Kemiri"],
    "rareIngredients": [],
    "jasa": 45000,
    "tip": "Gunakan santan segar dan masak perlahan agar bumbu meresap."
  },
  {
    "id": 6,
    "type": "Utama",
    "name": "Cumi Tumis Cabai Hijau",
    "ingredients": ["Cumi-Cumi", "Tomat", "Cabai"],
    "rareIngredients": ["Cabai"],
    "jasa": 45000,
    "tip": "Jangan masak cumi terlalu lama agar teksturnya tidak alot."
  },
  {
    "id": 7,
    "type": "Utama",
    "name": "Udang Balado Petai",
    "ingredients": ["Udang", "Petai", "Bawang Bombay"],
    "rareIngredients": [],
    "jasa": 45000,
    "tip": "Belah punggung udang agar bumbu balado meresap sempurna."
  },
  {
    "id": 8,
    "type": "Utama",
    "name": "Gurami Bakar Madu",
    "ingredients": ["Ikan Gurami", "Labu Siam", "Gula"],
    "rareIngredients": ["Gula"],
    "jasa": 40000,
    "tip": "Oleskan madu di menit-menit terakhir agar tidak gosong."
  },
  {
    "id": 9,
    "type": "Utama",
    "name": "Rawon Sapi Kecambah",
    "ingredients": ["Daging Sapi", "Kecambah", "Keluak"],
    "rareIngredients": [],
    "jasa": 85000,
    "tip": "Kluwek harus diseduh air panas dan dihaluskan dengan baik."
  },
  {
    "id": 10,
    "type": "Utama",
    "name": "Lodeh Tahu Tempe",
    "ingredients": ["Tahu", "Tempe", "Terong", "Garam"],
    "rareIngredients": ["Garam"],
    "jasa": 30000,
    "tip": "Masak sayur labu siam terlebih dahulu sebelum tahu tempe."
  },
  {
    "id": 11,
    "type": "Utama",
    "name": "Kepiting Masak Cengkeh",
    "ingredients": ["Kepiting", "Cengkeh", "Bawang Putih"],
    "rareIngredients": ["Bawang Putih"],
    "jasa": 75000,
    "tip": "Gunakan kepiting segar yang capitnya masih kuat untuk rasa manis alami."
  },
  {
    "id": 12,
    "type": "Utama",
    "name": "Steak Kambing Lada Hitam",
    "ingredients": ["Daging Kambing", "Kentang", "Lada"],
    "rareIngredients": ["Lada"],
    "jasa": 80000,
    "tip": "Diamkan daging sejenak setelah dipanggang agar jus daging meresap."
  },
  {
    "id": 13,
    "type": "Utama",
    "name": "Sate Belut Kencur",
    "ingredients": ["Belut", "Kencur", "Garam"],
    "rareIngredients": ["Garam"],
    "jasa": 40000,
    "tip": "Bersihkan belut dengan jeruk nipis untuk menghilangkan aroma amis."
  },
  {
    "id": 14,
    "type": "Utama",
    "name": "Kakap Asam Pedas",
    "ingredients": ["Ikan Kakap", "Asam Jawa", "Serai"],
    "rareIngredients": [],
    "jasa": 50000,
    "tip": "Gunakan air asam jawa murni untuk keasaman yang segar dan seimbang."
  },
  {
    "id": 15,
    "type": "Utama",
    "name": "Kari Tuna Kayu Manis",
    "ingredients": ["Ikan Tuna", "Kayu Manis", "Jahe"],
    "rareIngredients": [],
    "jasa": 45000,
    "tip": "Tambahkan kayu manis secukupnya agar kuah kari beraroma harum."
  },

  // ================= HIDANGAN PEMBUKA (7 ITEMS) =================
  {
    "id": 16,
    "type": "Pembuka",
    "name": "Bakwan Jagung Kriuk",
    "ingredients": ["Jagung", "Kol", "Telur"],
    "rareIngredients": [],
    "jasa": 35000,
    "tip": "Campurkan sedikit tepung beras agar bakwan tetap garing."
  },
  {
    "id": 17,
    "type": "Pembuka",
    "name": "Gado-Gado Siram",
    "ingredients": ["Tahu", "Selada", "Kacang Panjang"],
    "rareIngredients": [],
    "jasa": 35000,
    "tip": "Ulek kacang tanah goreng selagi hangat untuk saus yang lembut."
  },
  {
    "id": 18,
    "type": "Pembuka",
    "name": "Cah Brokoli Wortel",
    "ingredients": ["Brokoli", "Wortel", "Bawang Bombay"],
    "rareIngredients": [],
    "jasa": 25000,
    "tip": "Rendam brokoli di air garam sebentar sebelum dimasak."
  },
  {
    "id": 19,
    "type": "Pembuka",
    "name": "Tumis Pare Gurih",
    "ingredients": ["Pare", "Tempe", "Daun Bawang"],
    "rareIngredients": [],
    "jasa": 25000,
    "tip": "Remas pare dengan garam kasar dan cuci bersih untuk kurangi pahit."
  },
  {
    "id": 20,
    "type": "Pembuka",
    "name": "Salad Selada Mentimun",
    "ingredients": ["Selada", "Mentimun", "Tomat"],
    "rareIngredients": [],
    "jasa": 30000,
    "tip": "Sajikan dingin dengan siraman saus segar sesaat sebelum dimakan."
  },
  {
    "id": 21,
    "type": "Pembuka",
    "name": "Kerang Rebus Serai",
    "ingredients": ["Kerang", "Serai", "Lengkuas"],
    "rareIngredients": [],
    "jasa": 30000,
    "tip": "Sikat cangkang kerang hingga bersih sebelum direbus dengan serai harum."
  },
  {
    "id": 22,
    "type": "Pembuka",
    "name": "Bandeng Presto Ketumbar",
    "ingredients": ["Ikan Bandeng", "Ketumbar", "Kunyit"],
    "rareIngredients": [],
    "jasa": 35000,
    "tip": "Gunakan daun pisang sebagai alas presto agar kulit ikan tidak hancur."
  },

  // ================= HIDANGAN PENUTUP (8 ITEMS) =================
  {
    "id": 23,
    "type": "Penutup",
    "name": "Sop Buah Tropis",
    "ingredients": ["Semangka", "Melon", "Buah Naga", "Gula"],
    "rareIngredients": ["Gula"],
    "jasa": 35000,
    "tip": "Gunakan sirup coco pandan dan susu kental manis secukupnya."
  },
  {
    "id": 24,
    "type": "Penutup",
    "name": "Alpukat Kocok Kurma",
    "ingredients": ["Alpukat", "Kurma", "Gula"],
    "rareIngredients": ["Gula"],
    "jasa": 25000,
    "tip": "Pilih alpukat mentega yang sudah matang sempurna agar tidak pahit."
  },
  {
    "id": 25,
    "type": "Penutup",
    "name": "Rujak Manis Pasar",
    "ingredients": ["Mangga", "Nanas", "Belimbing"],
    "rareIngredients": [],
    "jasa": 35000,
    "tip": "Ulek cabai rawit dan terasi bakar untuk bumbu rujak nendang."
  },
  {
    "id": 26,
    "type": "Penutup",
    "name": "Kolak Pisang Nangka",
    "ingredients": ["Pisang", "Nangka", "Kayu Manis"],
    "rareIngredients": [],
    "jasa": 25000,
    "tip": "Masukkan nangka di akhir masakan agar aromanya tetap segar."
  },
  {
    "id": 27,
    "type": "Penutup",
    "name": "Es Durian Kelengkeng",
    "ingredients": ["Durian", "Kelengkeng", "Jambu"],
    "rareIngredients": [],
    "jasa": 30000,
    "tip": "Gunakan durian medan asli untuk rasa manis legit yang khas."
  },
  {
    "id": 28,
    "type": "Penutup",
    "name": "Juice Apel Jeruk",
    "ingredients": ["Apel", "Jeruk", "Gula"],
    "rareIngredients": ["Gula"],
    "jasa": 25000,
    "tip": "Saring jus setelah diblender untuk mendapatkan tekstur yang halus."
  },
  {
    "id": 29,
    "type": "Penutup",
    "name": "Es Rambutan Delima",
    "ingredients": ["Rambutan", "Delima", "Stroberi"],
    "rareIngredients": [],
    "jasa": 35000,
    "tip": "Sajikan dingin dengan pecahan es batu agar lebih segar dinikmati."
  },
  {
    "id": 30,
    "type": "Penutup",
    "name": "Tumis Mujair Kembung Sawi",
    "ingredients": ["Ikan Mujair", "Ikan Kembung", "Sawi", "Lobak"],
    "rareIngredients": [],
    "jasa": 40000,
    "tip": "Goreng ikan setengah matang terlebih dahulu agar tidak mudah hancur."
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