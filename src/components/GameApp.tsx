import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChefHat, Sparkles, ShoppingBasket, Coins, Trophy, HandHeart, RotateCcw, Users, ArrowRight, CheckCircle2, Circle, Utensils, Soup, IceCream, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MARKET_DECK, STARTER_PACK, dealMenus, formatRp, priceOf, shuffle, tierOf,
  type Menu,
} from "@/lib/game-data";

type Phase = "lobby" | "play" | "over";

interface Player {
  name: string;
  cash: number;
  menus: Menu[];
  // map of menu.id -> set of bought ingredient names
  bought: Record<number, string[]>;
  completed: number[]; // menu ids completed
  totalJasa: number;
}

interface GameState {
  players: Player[];
  deck: string[];
  turn: number; // index into players
  revealed: string | null;
  flipping: boolean;
}

function menuComplete(menu: Menu, bought: string[]): boolean {
  return menu.ingredients.every((ing) => STARTER_PACK.includes(ing) || bought.includes(ing));
}

function menuTypeIcon(t: Menu["type"]) {
  if (t === "Pembuka") return <Soup className="w-3.5 h-3.5" />;
  if (t === "Utama") return <Utensils className="w-3.5 h-3.5" />;
  return <IceCream className="w-3.5 h-3.5" />;
}

function menuTypeClass(t: Menu["type"]) {
  if (t === "Pembuka") return "bg-accent text-accent-foreground border-accent";
  if (t === "Utama") return "bg-primary text-primary-foreground border-primary";
  return "bg-secondary text-secondary-foreground border-secondary";
}

function tierClass(t: ReturnType<typeof tierOf>) {
  if (t === "Premium") return "bg-primary/10 text-primary border-primary/30";
  if (t === "Medium") return "bg-accent/20 text-accent-foreground border-accent/40";
  return "bg-secondary/10 text-secondary border-secondary/30";
}

export function GameApp() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [state, setState] = useState<GameState | null>(null);

  if (phase === "lobby") {
    return <Lobby onStart={(s) => { setState(s); setPhase("play"); }} />;
  }
  if (phase === "over" && state) {
    return <Summary state={state} onRestart={() => { setState(null); setPhase("lobby"); }} />;
  }
  if (state) {
    return (
      <Gameplay
        state={state}
        setState={(updater) =>
          setState((prev) => {
            if (!prev) return prev;
            return typeof updater === "function" ? (updater as (p: GameState) => GameState)(prev) : updater;
          })
        }
        onGameOver={() => setPhase("over")}
      />
    );
  }
  return null;
}

/* ===================== LOBBY ===================== */

function Lobby({ onStart }: { onStart: (s: GameState) => void }) {
  const [count, setCount] = useState<"1" | "2">("2");
  const [p1, setP1] = useState("Chef Aisyah");
  const [p2, setP2] = useState("Chef Yusuf");
  const [budget, setBudget] = useState(150000);

  const start = () => {
    const names = count === "1" ? [p1.trim() || "Chef 1"] : [p1.trim() || "Chef 1", p2.trim() || "Chef 2"];
    const players: Player[] = names.map((name) => {
      const menus = dealMenus();
      const bought: Record<number, string[]> = {};
      menus.forEach((m) => (bought[m.id] = []));
      return { name, cash: budget, menus, bought, completed: [], totalJasa: 0 };
    });
    onStart({
      players,
      deck: shuffle(MARKET_DECK),
      turn: 0,
      revealed: null,
      flipping: false,
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-14 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Master Chef Quest
          </h1>
          <p className="text-primary font-semibold mt-1">Pasar Berkah</p>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Belanja bahan, masak menu lezat, dan raih berkah bersama di pasar tradisional.
          </p>
        </div>

        <Card className="p-6 space-y-5 border-border/60 shadow-sm">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Jumlah Pemain</Label>
            <RadioGroup
              value={count}
              onValueChange={(v) => setCount(v as "1" | "2")}
              className="grid grid-cols-2 gap-2"
            >
              {(["1", "2"] as const).map((n) => (
                <label
                  key={n}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 cursor-pointer transition-all ${
                    count === n ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <RadioGroupItem value={n} className="sr-only" />
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{n} Pemain</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p1" className="text-sm font-semibold">Nama Pemain 1</Label>
            <Input id="p1" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Chef 1" />
          </div>

          {count === "2" && (
            <div className="space-y-2">
              <Label htmlFor="p2" className="text-sm font-semibold">Nama Pemain 2</Label>
              <Input id="p2" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Chef 2" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-semibold">
              Modal Awal per Pemain
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
              <Input
                id="budget"
                type="number"
                min={10000}
                step={10000}
                value={budget}
                onChange={(e) => setBudget(Math.max(10000, Number(e.target.value) || 0))}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">Disarankan: Rp 150.000</p>
          </div>

          <Button onClick={start} size="lg" className="w-full text-base font-semibold gap-2">
            <Sparkles className="w-4 h-4" />
            Mulai Berburu
          </Button>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          Bahan pokok (bawang, garam, dll) sudah tersedia gratis untuk semua chef.
        </p>
      </div>
    </div>
  );
}

/* ===================== GAMEPLAY ===================== */

function Gameplay({
  state, setState, onGameOver,
}: {
  state: GameState;
  setState: (s: GameState | ((p: GameState) => GameState)) => void;
  onGameOver: () => void;
}) {
  const player = state.players[state.turn];
  const otherIdx = state.players.length === 1 ? 0 : (state.turn + 1) % 2;

  // check end conditions
  const checkEnd = (s: GameState): boolean => {
    const deckEmpty = s.deck.length === 0 && s.revealed === null;
    const someoneFinished = s.players.some((p) => p.completed.length === 5);
    const everyoneBroke = s.players.every((p) => p.cash < 5000);
    return deckEmpty || someoneFinished || everyoneBroke;
  };

  const drawCard = () => {
    if (state.revealed || state.deck.length === 0) return;
    setState((s) => ({ ...s, flipping: true }));
    setTimeout(() => {
      setState((s) => {
        const [card, ...rest] = s.deck;
        return { ...s, deck: rest, revealed: card, flipping: false };
      });
    }, 450);
  };

  const skipCard = () => {
    setState((s) => {
      const next: GameState = {
        ...s,
        revealed: null,
        turn: s.players.length === 1 ? 0 : (s.turn + 1) % 2,
      };
      if (checkEnd(next)) {
        setTimeout(onGameOver, 0);
      }
      return next;
    });
  };

  const buyFor = (playerIdx: number) => {
    const ing = state.revealed;
    if (!ing) return;
    const price = priceOf(ing);
    const p = state.players[playerIdx];
    if (p.cash < price) return;

    // find menus that need this ingredient and aren't completed
    const needyMenuIds = p.menus
      .filter((m) => !p.completed.includes(m.id))
      .filter((m) => m.ingredients.includes(ing))
      .filter((m) => !(p.bought[m.id] || []).includes(ing))
      .map((m) => m.id);
    if (needyMenuIds.length === 0) return;

    setState((s) => {
      const players = s.players.map((pl, idx) => {
        if (idx !== playerIdx) return pl;
        const newBought = { ...pl.bought };
        needyMenuIds.forEach((mid) => {
          newBought[mid] = [...(newBought[mid] || []), ing];
        });
        const newlyCompleted: Menu[] = [];
        pl.menus.forEach((m) => {
          if (pl.completed.includes(m.id)) return;
          if (menuComplete(m, newBought[m.id] || [])) newlyCompleted.push(m);
        });
        const jasaGain = newlyCompleted.reduce((sum, m) => sum + m.jasa, 0);
        if (newlyCompleted.length > 0) {
          setTimeout(() => {
            newlyCompleted.forEach((m) => {
              toast.success(`🎉 Menu Selesai: ${m.name}`, {
                description: `${pl.name} mendapat Jasa ${formatRp(m.jasa)}!`,
              });
            });
          }, 0);
        }
        return {
          ...pl,
          cash: pl.cash - price + jasaGain,
          bought: newBought,
          completed: [...pl.completed, ...newlyCompleted.map((m) => m.id)],
          totalJasa: pl.totalJasa + jasaGain,
        };
      });
      const next: GameState = {
        ...s,
        players,
        revealed: null,
        turn: s.players.length === 1 ? 0 : (s.turn + 1) % 2,
      };
      if (checkEnd(next)) {
        setTimeout(onGameOver, 600);
      }
      return next;
    });
  };

  const canBuyFor = (idx: number) => {
    const ing = state.revealed;
    if (!ing) return false;
    const p = state.players[idx];
    if (p.cash < priceOf(ing)) return false;
    return p.menus
      .filter((m) => !p.completed.includes(m.id))
      .some((m) => m.ingredients.includes(ing) && !(p.bought[m.id] || []).includes(ing));
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Giliran</p>
                <p className="text-sm font-bold text-foreground">{player.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{state.deck.length}</span>
                <span className="text-muted-foreground">kartu</span>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {state.players.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-lg border px-3 py-2 ${
                  idx === state.turn ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate">{p.name}</span>
                  {idx === state.turn && <Sparkles className="w-3 h-3 text-primary shrink-0" />}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Coins className="w-3.5 h-3.5 text-accent-foreground" />
                  <span className="text-sm font-bold text-foreground">{formatRp(p.cash)}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {p.completed.length}/5 menu selesai • Jasa {formatRp(p.totalJasa)}
                </div>
              </div>
            ))}
            {state.players.length === 1 && <div />}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-6">
        {/* Market Desk */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBasket className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
              Pasar Tengkurap
            </h2>
          </div>
          <MarketDesk
            state={state}
            onDraw={drawCard}
            onSkip={skipCard}
            onBuy={buyFor}
            canBuyFor={canBuyFor}
            otherIdx={otherIdx}
          />
        </section>

        {/* Quest Board */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
              Quest Menu — {player.name}
            </h2>
          </div>
          <QuestBoard player={player} />
        </section>
      </main>
    </div>
  );
}

/* ===================== MARKET DESK ===================== */

function MarketDesk({
  state, onDraw, onSkip, onBuy, canBuyFor, otherIdx,
}: {
  state: GameState;
  onDraw: () => void;
  onSkip: () => void;
  onBuy: (idx: number) => void;
  canBuyFor: (idx: number) => boolean;
  otherIdx: number;
}) {
  const ing = state.revealed;
  const price = ing ? priceOf(ing) : 0;
  const tier = ing ? tierOf(ing) : null;

  return (
    <Card className="p-5 border-border/60 bg-gradient-to-br from-card to-muted/40">
      {!ing && !state.flipping && (
        <button
          onClick={onDraw}
          disabled={state.deck.length === 0}
          className="w-full group relative aspect-[4/3] sm:aspect-[5/3] rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="absolute inset-3 border-2 border-dashed border-primary-foreground/30 rounded-xl" />
          <div className="relative flex flex-col items-center justify-center h-full gap-2 px-4">
            <ShoppingBasket className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
            <p className="text-base sm:text-lg font-bold">Buka Kartu Pasar</p>
            <p className="text-xs opacity-80">{state.deck.length} bahan tersisa</p>
          </div>
        </button>
      )}

      {state.flipping && (
        <div className="w-full aspect-[4/3] sm:aspect-[5/3] rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center animate-pulse">
          <ShoppingBasket className="w-12 h-12 text-primary-foreground/80" />
        </div>
      )}

      {ing && !state.flipping && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-2xl bg-card border-2 border-primary/30 p-5 sm:p-6 text-center shadow-md">
            <Badge variant="outline" className={`${tier && tierClass(tier)} text-[10px] font-bold uppercase tracking-wider`}>
              {tier}
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">{ing}</h3>
            <div className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Coins className="w-4 h-4" />
              <span className="font-bold text-lg">{formatRp(price)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {state.players.map((p, idx) => (
              <Button
                key={idx}
                onClick={() => onBuy(idx)}
                disabled={!canBuyFor(idx)}
                size="lg"
                variant={idx === state.turn ? "default" : "secondary"}
                className="w-full justify-between gap-2 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Beli oleh {p.name}
                </span>
                {!canBuyFor(idx) && (
                  <span className="text-[10px] opacity-70 font-normal">
                    {p.cash < price ? "Modal kurang" : "Tidak butuh"}
                  </span>
                )}
              </Button>
            ))}
            <Button onClick={onSkip} variant="outline" size="lg" className="w-full gap-2">
              Skip / Lanjut <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ===================== QUEST BOARD ===================== */

function QuestBoard({ player }: { player: Player }) {
  const groups = useMemo(() => {
    const g: Record<Menu["type"], Menu[]> = { Pembuka: [], Utama: [], Penutup: [] };
    player.menus.forEach((m) => g[m.type].push(m));
    return g;
  }, [player.menus]);

  return (
    <div className="space-y-5">
      {(["Pembuka", "Utama", "Penutup"] as const).map((type) => (
        <div key={type}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${menuTypeClass(type)}`}>
              {menuTypeIcon(type)} {type}
            </span>
          </div>
          <div className="grid gap-3">
            {groups[type].map((m) => {
              const bought = player.bought[m.id] || [];
              const done = player.completed.includes(m.id);
              return (
                <Card
                  key={m.id}
                  className={`p-4 transition-all ${
                    done ? "bg-secondary/10 border-secondary/40" : "border-border/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-bold text-foreground leading-snug ${done ? "line-through opacity-70" : ""}`}>
                      {m.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Jasa</p>
                      <p className="text-sm font-bold text-primary">{formatRp(m.jasa)}</p>
                    </div>
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-1.5">
                    {m.ingredients.map((ing) => {
                      const isStarter = STARTER_PACK.includes(ing);
                      const has = isStarter || bought.includes(ing);
                      return (
                        <li
                          key={ing}
                          className={`flex items-center gap-1.5 text-xs ${
                            has ? "text-secondary font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {has ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{ing}</span>
                          {isStarter && (
                            <span className="text-[9px] opacity-60">(pokok)</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {done && (
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                      <Sparkles className="w-3 h-3" /> Menu Tersaji — Jasa diterima
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== SUMMARY ===================== */

function Summary({ state, onRestart }: { state: GameState; onRestart: () => void }) {
  const ranked = [...state.players]
    .map((p) => ({ ...p, score: p.cash + p.totalJasa }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0];
  const loser = ranked[1];
  const gap = loser ? winner.score - loser.score : 0;
  const tie = loser && winner.score === loser.score;
  const suggestZakat = loser && gap > 50000;

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-accent-foreground mb-4 shadow-lg shadow-accent/20">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Pasar Telah Tutup</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {tie ? "Hasil seri — semua berkah!" : `Selamat, Chef ${winner.name}!`}
          </p>
        </div>

        <div className="space-y-3 mb-5">
          {ranked.map((p, idx) => (
            <Card
              key={p.name}
              className={`p-4 ${
                idx === 0 && !tie
                  ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-md"
                  : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      idx === 0 && !tie
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.completed.length}/5 menu tersaji
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Skor</p>
                  <p className="text-xl font-bold text-foreground">{formatRp(p.score)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Sisa Kas</p>
                  <p className="font-semibold text-foreground">{formatRp(p.cash)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Jasa</p>
                  <p className="font-semibold text-foreground">{formatRp(p.totalJasa)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {suggestZakat && (
          <Card className="p-4 mb-5 bg-secondary/10 border-secondary/40">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                <HandHeart className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Berbagi Berkah</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Selisih skor lebih dari Rp 50.000. Berikan Infaq Rp 5.000 kepada{" "}
                  <span className="font-semibold text-foreground">{loser!.name}</span> agar
                  berkah bersama dan persahabatan tetap hangat di pasar berikutnya.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Button onClick={onRestart} size="lg" className="w-full gap-2 font-semibold">
          <RotateCcw className="w-4 h-4" /> Main Lagi
        </Button>
      </div>
    </div>
  );
}