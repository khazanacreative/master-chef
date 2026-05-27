import { MARKET_CARDS, MENUS, type Menu, type Player } from "./game-data";

export interface GameState {
  players: Player[];
  deck: string[];
  turn: number;
  revealed: string | null;
  flipping: boolean;
  isMultiplayer?: boolean;
}

/**
 * Encodes the game state into a compact Base64 string.
 */
export function serializeState(state: GameState): string {
  const compact = {
    p: state.players.map((p) => ({
      n: p.name,
      c: p.cash,
      m: p.menus.map((m) => m.id),
      b: Object.entries(p.bought).reduce((acc, [mid, ingNames]) => {
        acc[Number(mid)] = ingNames.map((name) => {
          const card = MARKET_CARDS.find((c) => c.name === name);
          return card ? card.id : 0;
        }).filter(id => id !== 0);
        return acc;
      }, {} as Record<number, number[]>),
      x: p.completed,
      j: p.totalJasa,
    })),
    d: state.deck.map((name) => {
      const card = MARKET_CARDS.find((c) => c.name === name);
      return card ? card.id : 0;
    }).filter(id => id !== 0),
    t: state.turn,
    r: state.revealed ? MARKET_CARDS.find((c) => c.name === state.revealed)?.id || null : null,
    m: state.isMultiplayer || false,
  };

  const jsonStr = JSON.stringify(compact);
  // Using btoa(encodeURIComponent(str)) is robust and handles non-ASCII characters
  return btoa(encodeURIComponent(jsonStr));
}

/**
 * Decodes the game state from a Base64 string.
 */
export function deserializeState(base64: string): GameState | null {
  try {
    const jsonStr = decodeURIComponent(atob(base64));
    const compact = JSON.parse(jsonStr);
    
    const players: Player[] = compact.p.map((p: any) => {
      const menus = p.m.map((id: number) => MENUS.find((m) => m.id === id)).filter(Boolean) as Menu[];
      const bought: Record<number, string[]> = {};
      Object.entries(p.b || {}).forEach(([mid, ingIds]) => {
        bought[Number(mid)] = (ingIds as number[]).map((id) => {
          const card = MARKET_CARDS.find((c) => c.id === id);
          return card ? card.name : "";
        }).filter(Boolean);
      });
      
      return {
        name: p.n,
        cash: p.c,
        menus,
        bought,
        completed: p.x || [],
        totalJasa: p.j || 0,
      };
    });

    const deck = compact.d.map((id: number) => {
      const card = MARKET_CARDS.find((c) => c.id === id);
      return card ? card.name : "";
    }).filter(Boolean);

    const revealedCard = compact.r ? MARKET_CARDS.find((c) => c.id === compact.r) : null;

    return {
      players,
      deck,
      turn: compact.t,
      revealed: revealedCard ? revealedCard.name : null,
      flipping: false,
      isMultiplayer: compact.m || false,
    };
  } catch (err) {
    console.error("Failed to deserialize state:", err);
    return null;
  }
}
