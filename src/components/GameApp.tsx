import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { ChefHat, Sparkles, ShoppingBasket, Coins, Trophy, HandHeart, RotateCcw, Users, ArrowRight, CheckCircle2, Circle, Utensils, Soup, IceCream, Layers, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MARKET_DECK, MARKET_CARDS, dealMenus, formatRp, priceOf, shuffle, tierOf,
  type Menu, type Player, type GameState
} from "@/lib/game-data";
import { serializeState, deserializeState } from "@/lib/sync";

type Phase = "lobby" | "play" | "over";

function menuComplete(menu: Menu, bought: string[]): boolean {
  return menu.ingredients.every((ing) => bought.includes(ing));
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

  // Read URL parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get("state");
      if (stateParam) {
        const decoded = deserializeState(stateParam);
        if (decoded) {
          setState(decoded);
          setPhase("play");
          
          // Clear query param so refreshes don't reset state
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
          
          // Automatically check or guide character role
          const storedRole = localStorage.getItem("mchef_player_role");
          if (!storedRole) {
            toast.info("Game disinkronkan! Silakan pilih peran perangkat ini.");
          } else {
            const roleIdx = parseInt(storedRole, 10);
            const roleName = decoded.players[roleIdx]?.name || "Chef";
            toast.success(`Sinkronisasi Berhasil! Anda bermain sebagai ${roleName}`);
          }
        } else {
          toast.error("Kode sinkronisasi tidak valid.");
        }
      }
    }
  }, []);

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





function Lobby({ onStart }: { onStart: (s: GameState) => void }) {
  const [count, setCount] = useState<"1" | "2" | "3" | "4">("2");
  const [p1, setP1] = useState("Chef Aisyah");
  const [p2, setP2] = useState("Chef Yusuf");
  const [p3, setP3] = useState("Chef Fatimah");
  const [p4, setP4] = useState("Chef Ibrahim");
  const [budget, setBudget] = useState(150000);
  const [mode, setMode] = useState<"local" | "multiplayer">("local");
  const [localRole, setLocalRole] = useState<"0" | "1" | "2" | "3">("0");
  const [joinCode, setJoinCode] = useState("");

  const start = () => {
    const names = [];
    names.push(p1.trim() || "Chef 1");
    if (count !== "1") {
      names.push(p2.trim() || "Chef 2");
    }
    if (count === "3" || count === "4") {
      names.push(p3.trim() || "Chef 3");
    }
    if (count === "4") {
      names.push(p4.trim() || "Chef 4");
    }

    const players: Player[] = names.map((name) => {
      const menus = dealMenus();
      const bought: Record<number, string[]> = {};
      menus.forEach((m) => (bought[m.id] = []));
      return { name, cash: budget, menus, bought, completed: [], totalJasa: 0 };
    });
    
    if (count !== "1" && mode === "multiplayer") {
      localStorage.setItem("mchef_player_role", localRole);
    }
    
    onStart({
      players,
      deck: shuffle(MARKET_DECK),
      turn: 0,
      revealed: null,
      flipping: false,
      isMultiplayer: count !== "1" && mode === "multiplayer",
    });
  };

  const joinGame = () => {
    if (!joinCode.trim()) return;
    const decoded = deserializeState(joinCode.trim());
    if (decoded) {
      onStart(decoded);
      toast.success("Berhasil bergabung ke game multiplayer!");
    } else {
      toast.error("Kode sinkronisasi salah atau tidak dapat dibaca.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-14 flex items-center justify-center animate-in fade-in duration-300">
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
            Belanja bahan, masak menu lezat, dan selesaikan tantangan untuk menjadi chef terhebat.
          </p>
        </div>

        <Card className="p-6 space-y-5 border-border/60 shadow-sm">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Jumlah Pemain</Label>
            <RadioGroup
              value={count}
              onValueChange={(v) => {
                setCount(v as "1" | "2" | "3" | "4");
                if (v === "1") setMode("local");
                const val = parseInt(v, 10);
                const roleVal = parseInt(localRole, 10);
                if (roleVal >= val) {
                  setLocalRole("0");
                }
              }}
              className="grid grid-cols-4 gap-1.5"
            >
              {(["1", "2", "3", "4"] as const).map((n) => (
                <label
                  key={n}
                  className={`flex items-center justify-center gap-1 rounded-lg border-2 py-2 cursor-pointer transition-all ${
                    count === n ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <RadioGroupItem value={n} className="sr-only" />
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-xs">{n}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p1" className="text-sm font-semibold">Nama Pemain 1</Label>
            <Input id="p1" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Chef 1" />
          </div>

          {count !== "1" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label htmlFor="p2" className="text-sm font-semibold">Nama Pemain 2</Label>
              <Input id="p2" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Chef 2" />
            </div>
          )}

          {(count === "3" || count === "4") && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label htmlFor="p3" className="text-sm font-semibold">Nama Pemain 3</Label>
              <Input id="p3" value={p3} onChange={(e) => setP3(e.target.value)} placeholder="Chef 3" />
            </div>
          )}

          {count === "4" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <Label htmlFor="p4" className="text-sm font-semibold">Nama Pemain 4</Label>
              <Input id="p4" value={p4} onChange={(e) => setP4(e.target.value)} placeholder="Chef 4" />
            </div>
          )}

          {count !== "1" && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Mode Sambungan</Label>
              <RadioGroup
                value={mode}
                onValueChange={(v) => setMode(v as "local" | "multiplayer")}
                className="grid grid-cols-2 gap-2"
              >
                <label
                  className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 cursor-pointer text-xs transition-all ${
                    mode === "local" ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <RadioGroupItem value="local" className="sr-only" />
                  <span className="font-semibold">Lokal (1 Layar)</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 cursor-pointer text-xs transition-all ${
                    mode === "multiplayer" ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <RadioGroupItem value="multiplayer" className="sr-only" />
                  <span className="font-semibold">Lintas Device</span>
                </label>
              </RadioGroup>
            </div>
          )}

          {count !== "1" && mode === "multiplayer" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Label className="text-sm font-semibold">Perangkat Ini Sebagai</Label>
              <RadioGroup
                value={localRole}
                onValueChange={(v) => setLocalRole(v as "0" | "1" | "2" | "3")}
                className="grid grid-cols-2 gap-2"
              >
                {Array.from({ length: parseInt(count, 10) }).map((_, idx) => {
                  const name = idx === 0 ? p1 : idx === 1 ? p2 : idx === 2 ? p3 : p4;
                  return (
                    <label
                      key={idx}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2 cursor-pointer text-xs transition-all ${
                        localRole === String(idx) ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value={String(idx)} className="sr-only" />
                      <span className="font-semibold truncate">Pemain {idx + 1} ({name || `Chef ${idx + 1}`})</span>
                    </label>
                  );
                })}
              </RadioGroup>
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
            Mulai Belanja
          </Button>
        </Card>

        <Card className="mt-4 p-5 border-border/60 shadow-sm space-y-3 bg-muted/20">
          <div className="space-y-1.5">
            <Label htmlFor="joinCode" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Gabung Game Aktif (Lintas Device)
            </Label>
            <div className="flex gap-2">
              <Input
                id="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Tempel Kode Sinkronisasi..."
                className="text-xs flex-1 bg-background"
              />
              <Button onClick={joinGame} variant="secondary" size="sm" className="font-bold shrink-0">
                Gabung
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          Dapatkan dan kumpulkan seluruh bahan yang dibutuhkan langsung dari kartu Pasar!
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
  const [localRole, setLocalRole] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const r = localStorage.getItem("mchef_player_role");
      return r !== null ? parseInt(r, 10) : null;
    }
    return null;
  });

  const [copied, setCopied] = useState(false);

  const syncLink = useMemo(() => {
    if (typeof window === "undefined" || !state) return "";
    const code = serializeState(state);
    return `${window.location.origin}${window.location.pathname}?state=${code}`;
  }, [state]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(syncLink);
    setCopied(true);
    toast.success("Link sinkronisasi disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Role selector overlay if not set
  if (state.isMultiplayer && localRole === null) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="p-6 text-center space-y-6 border-border/60 shadow-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-md">
              <ChefHat className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-foreground">Siapa Anda di Perangkat Ini?</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pilih peran Anda untuk menyinkronkan giliran permainan lintas HP.
              </p>
            </div>
            <div className="grid gap-3">
              {state.players.map((p, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    localStorage.setItem("mchef_player_role", String(idx));
                    setLocalRole(idx);
                    toast.success(`Peran diatur ke: ${p.name}`);
                  }}
                  size="lg"
                  className="w-full py-4 font-bold flex items-center justify-center gap-2"
                >
                  <Users className="w-4.5 h-4.5" />
                  Saya {p.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Waiting for other player overlay if turn is not ours
  if (state.isMultiplayer && localRole !== null && state.turn !== localRole) {
    const activeChefName = state.players[state.turn].name;
    const myChefName = state.players[localRole].name;
    
    return (
      <div className="min-h-screen flex flex-col bg-background animate-in fade-in duration-300">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border shrink-0">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="font-black text-sm sm:text-base tracking-tight text-foreground">
                Master Chef Quest
              </span>
            </div>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[9px] font-bold">
              Menunggu Giliran Lawan
            </Badge>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-center items-center gap-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-600 animate-pulse mb-2">
              <RotateCcw className="w-6 h-6 animate-spin duration-[3s]" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Giliran {activeChefName}</h2>
            <p className="text-xs text-muted-foreground">
              Anda masuk sebagai <span className="font-bold text-foreground">{myChefName}</span>. 
              {state.revealed ? " Giliran lawan sedang memilih kartu." : " Tunggu lawan membuka kartu pasar selanjutnya."}
            </p>
          </div>

          {/* QR Code Card */}
          <Card className="w-full p-6 border-border/60 shadow-lg flex flex-col items-center gap-4 bg-gradient-to-br from-card to-muted/20">
            <p className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">
              Bagikan giliran ke {activeChefName}
            </p>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#F0F2EE] shadow-inner relative group">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(syncLink)}`}
                alt="QR Code Sinkronisasi"
                className="w-[200px] h-[200px]"
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center max-w-[280px]">
              Tunjukkan QR code ini agar {activeChefName} bisa memindainya langsung dari layarnya, atau kirimkan link sinkronisasi di bawah.
            </p>
            
            <div className="w-full flex gap-2">
              <Button onClick={handleCopyLink} className="flex-1 gap-2 font-bold text-xs" size="sm">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Link Disalin" : "Salin Link Sinkronisasi"}
              </Button>
            </div>
          </Card>

          {/* Standings/Stats Preview */}
          <Card className="w-full p-4 border-border/60 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
              Papan Klasemen Sementara
            </h3>
            <div className="space-y-2">
              {state.players.map((p, idx) => {
                const isActive = idx === state.turn;
                return (
                  <div
                    key={idx}
                    className={`rounded-lg border px-3 py-2 flex items-center justify-between text-xs transition-all ${
                      isActive
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-card opacity-80"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {isActive && <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse shrink-0" />}
                      <span className="font-bold truncate">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <Coins className="w-3 h-3 text-yellow-500" />
                        {formatRp(p.cash)}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {p.completed.length}/6 Selesai
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Reset Role Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("mchef_player_role");
              setLocalRole(null);
            }}
            className="text-[10px] text-muted-foreground font-bold uppercase hover:bg-transparent hover:text-foreground"
          >
            Salah Peran? Ganti Peran Perangkat Anda
          </Button>
        </main>
      </div>
    );
  }

  const player = state.players[state.turn];
  const otherIdx = state.players.length === 1 ? 0 : (state.turn + 1) % state.players.length;
  // check end conditions
  const checkEnd = (s: GameState): boolean => {
    const deckEmpty = s.deck.length === 0 && s.revealed === null;
    const someoneFinished = s.players.some((p) => p.completed.length === 6);
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
        turn: s.players.length === 1 ? 0 : (s.turn + 1) % s.players.length,
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
        turn: s.players.length === 1 ? 0 : (s.turn + 1) % s.players.length,
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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-background">
      {/* Header Navbar */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="font-black text-sm sm:text-base tracking-tight text-foreground">
              Master Chef Quest
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {state.isMultiplayer && localRole !== null && (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-semibold">Perangkat:</span>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {state.players[localRole].name}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-bold text-foreground">{state.deck.length}</span>
              <span>kartu tersisa</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-7xl w-full mx-auto px-4 py-4 sm:py-6 flex-1 min-h-0 lg:overflow-hidden flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch flex-1 min-h-0 lg:overflow-hidden">
          
          {/* Left Column: Sidebar (Stats & Market Deck) */}
          <aside className="lg:col-span-4 flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto pr-1 pb-4 scrollbar-thin">
            {/* active player turn & balances */}
            <Card className="p-3 border-border/60 bg-gradient-to-br from-card to-muted/20 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Giliran Aktif</p>
                  <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 mt-0.5">
                    <ChefHat className="w-3.5 h-3.5 text-primary animate-pulse" />
                    {player.name}
                  </h2>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-bold py-0">
                  Fase Bermain
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Saldo & Progres Chef</p>
                {state.players.map((p, idx) => {
                  const isActive = idx === state.turn;
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg border px-2.5 py-2 transition-all ${
                        isActive
                           ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                           : "border-border bg-card opacity-80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                          {isActive && <Sparkles className="w-3 h-3 text-primary shrink-0 animate-pulse" />}
                          {p.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-semibold">
                          {p.completed.length}/6 menu selesai
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-border/40 text-[11px]">
                        <div className="flex items-center gap-1 font-extrabold text-foreground">
                          <Coins className="w-3 h-3 text-yellow-500" />
                          {formatRp(p.cash)}
                        </div>
                        <div className="text-muted-foreground text-[9px]">
                          Jasa: <span className="font-bold text-primary">{formatRp(p.totalJasa)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {state.isMultiplayer && localRole !== null && (
                <div className="pt-2.5 mt-1 border-t border-border/60 flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    Perangkat Anda: <strong className="text-foreground">{state.players[localRole].name}</strong>
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("mchef_player_role");
                      setLocalRole(null);
                    }}
                    className="text-primary hover:underline font-bold cursor-pointer"
                  >
                    Ganti Peran
                  </button>
                </div>
              )}
            </Card>

            {/* Market Desk */}
            <section className="w-full flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <ShoppingBasket className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Pasar
                </h2>
              </div>
              <div className="flex-1 min-h-0 flex flex-col">
                <MarketDesk
                  state={state}
                  onDraw={drawCard}
                  onSkip={skipCard}
                  onBuy={buyFor}
                  canBuyFor={canBuyFor}
                  otherIdx={otherIdx}
                />
              </div>
            </section>
          </aside>

          {/* Right Column: Quest Board (6 Cards) */}
          <section className="lg:col-span-8 flex flex-col gap-3 lg:h-full lg:min-h-0 lg:overflow-hidden pb-4">
            <div className="flex items-center gap-2 shrink-0">
              <ChefHat className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Quest Menu — {player.name}
              </h2>
            </div>
            <div className="flex-1 min-h-0 lg:overflow-hidden">
              <QuestBoard player={player} />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

/* ===================== MARKET DESK HELPERS ===================== */

function getIngredientIcon(ing: string) {
  if (["Daging Sapi", "Daging Kambing", "Daging Ayam"].includes(ing)) {
    return <Utensils className="w-8 h-8 md:w-10 md:h-10" />;
  }
  if (["Lobster", "Ikan Salmon", "Cumi-Cumi", "Udang", "Ikan Gurami"].includes(ing)) {
    return <Soup className="w-8 h-8 md:w-10 md:h-10" />;
  }
  return <ShoppingBasket className="w-8 h-8 md:w-10 md:h-10" />;
}

function getIngredientSeries(ing: string) {
  if (["Daging Sapi", "Daging Kambing", "Daging Ayam", "Lobster", "Ikan Salmon", "Cumi-Cumi", "Udang", "Ikan Gurami", "Telur"].includes(ing)) {
    return "SERI LAUK-PAUK • KODE L-" + ((ing.charCodeAt(0) % 10) + 10);
  }
  if (["Semangka", "Melon", "Buah Naga", "Alpukat", "Kurma", "Mangga", "Nanas", "Belimbing", "Pisang", "Nangka", "Durian", "Kelengkeng"].includes(ing)) {
    return "SERI BUAH-BUAHAN • KODE B-" + ((ing.charCodeAt(0) % 10) + 10);
  }
  return "SERI SAYUR & PANGAN • KODE S-" + ((ing.charCodeAt(0) % 10) + 10);
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

  // check if rare
  const card = MARKET_CARDS.find((c) => c.name === ing);
  const isRare = card?.isRare || false;

  return (
    <Card className="p-3.5 border-border/60 bg-gradient-to-br from-card to-muted/40 lg:flex-1 lg:h-full lg:min-h-0 flex flex-col justify-between">
      {!ing && !state.flipping && (
        <button
          onClick={onDraw}
          disabled={state.deck.length === 0}
          className="w-full max-w-sm mx-auto flex-1 lg:h-full group relative rounded-[24px] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex flex-col items-center justify-center min-h-[300px] md:min-h-[320px]"
        >
          <div className="absolute inset-3 border-2 border-dashed border-primary-foreground/30 rounded-[18px]" />
          <div className="relative flex flex-col items-center justify-center gap-3 px-4">
            <ShoppingBasket className="w-12 h-12 group-hover:scale-110 transition-transform text-primary-foreground/90" />
            <p className="text-lg font-black tracking-tight">Buka Kartu Pasar</p>
            <p className="text-xs font-bold opacity-80 bg-black/10 px-3 py-1 rounded-full">{state.deck.length} bahan tersisa</p>
          </div>
        </button>
      )}

      {state.flipping && (
        <div className="w-full max-w-sm mx-auto flex-1 lg:h-full rounded-[24px] bg-gradient-to-br from-primary to-primary/70 flex flex-col items-center justify-center animate-pulse min-h-[300px] md:min-h-[320px]">
          <ShoppingBasket className="w-12 h-12 text-primary-foreground/80 animate-bounce" />
          <p className="text-sm font-bold text-primary-foreground/80 mt-2">Membuka kartu...</p>
        </div>
      )}

      {ing && !state.flipping && (
        <div className="animate-in fade-in zoom-in-95 duration-300 space-y-3 flex-1 lg:h-full lg:min-h-0 flex flex-col justify-between">
          <div className={`relative overflow-hidden rounded-[24px] border-2 p-4 shadow-lg bg-gradient-to-br from-white to-[#FFFBFB] flex flex-col justify-between flex-1 lg:h-full lg:min-h-0 min-h-[300px] md:min-h-[320px] w-full max-w-sm mx-auto transition-all ${
            isRare 
              ? "border-purple-300 shadow-purple-100 ring-2 ring-purple-400/20 shadow-lg" 
              : "border-[#FFE8E5]"
          }`}>
            {/* SVG Background Elements */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 450 500" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pattern-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isRare ? "#a855f7" : "#FF5A5F"} stopOpacity="0.03" />
                  <stop offset="100%" stopColor={isRare ? "#6366f1" : "#00F5D4"} stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path d="M -20,180 C 100,120 180,220 220,340 C 260,460 380,520 470,500 L 450,500 L -20,500 Z" fill="url(#pattern-grad)" />
              <circle cx="390" cy="90" r="45" fill={isRare ? "#F5EFFF" : "#FFEFEF"} />
              <circle cx="410" cy="70" r="20" fill={isRare ? "#ECE5FF" : "#E6FFF9"} />
              <circle cx="60" cy="420" r="6" fill={isRare ? "#a855f7" : "#00F5D4"} opacity="0.4" />
              <circle cx="380" cy="440" r="12" fill={isRare ? "#6366f1" : "#FF5A5F"} opacity="0.15" />
            </svg>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col justify-between h-full flex-1">
              {/* Header Section */}
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#727A73]">
                  🛒 PASAR BERKAH
                </span>
                <div className={`w-10 h-0.5 rounded-full ${isRare ? "bg-purple-500" : "bg-[#FF5A5F]"}`} />
              </div>

              {/* Centerpiece Visual */}
              <div className="flex flex-col items-center mt-2.5 md:mt-4">
                <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-2 flex items-center justify-center relative shadow-inner ${
                  isRare ? "border-purple-100 bg-purple-50" : "border-[#FFEFEF] bg-[#FFEFEF]"
                }`}>
                  <div className={`w-18 h-18 md:w-22 md:h-22 rounded-full flex items-center justify-center relative ${
                    isRare ? "bg-purple-200 text-purple-600" : "bg-[#FFD4D6] text-[#FF5A5F]"
                  }`}>
                    {getIngredientIcon(ing)}
                    
                    {/* Marbling lines on meat if applicable */}
                    {!isRare && ["Daging Sapi", "Daging Kambing", "Daging Ayam"].includes(ing) && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 112 112" fill="none">
                        <path d="M 40,40 Q 55,25 70,45" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 30,65 Q 50,55 60,70" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Nama Bahan */}
              <div className="text-center mt-3 mb-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#1A1D1A] tracking-tight leading-none">
                  {ing}
                </h3>
              </div>

              {/* Category & Price Capsule */}
              <div className="flex justify-center mb-3">
                <div className={`w-full max-w-[200px] py-1.5 px-3 rounded-[12px] text-center shadow-md bg-gradient-to-br ${
                  isRare
                    ? "from-[#a855f7] to-[#6366f1] text-white"
                    : tier === "Premium"
                    ? "from-[#FF5A5F] to-[#FF7A00] text-white"
                    : tier === "Medium"
                    ? "from-[#00F5D4] to-[#00BB9B] text-[#033E35]"
                    : "from-[#9b5de5] to-[#f15bb5] text-white"
                }`}>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-90">
                    {isRare ? "RARE" : tier} PACK
                  </p>
                  <p className="text-sm font-black tracking-tight mt-0.5">
                    {formatRp(price)}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex flex-col items-center gap-1 mt-auto">
                <div className={`w-12 h-0.5 rounded-full ${isRare ? "bg-purple-400" : "bg-[#00F5D4]"}`} />
                <span className="text-[8px] font-extrabold text-[#A4ABA5] tracking-wider">
                  {getIngredientSeries(ing)}
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-3 grid gap-1.5 ${
            state.players.length === 1
              ? "grid-cols-2"
              : state.players.length === 2
              ? "grid-cols-3"
              : state.players.length === 3
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-5"
          }`}>
            {state.players.map((p, idx) => (
              <Button
                key={idx}
                onClick={() => onBuy(idx)}
                disabled={!canBuyFor(idx)}
                size="sm"
                variant={idx === state.turn ? "default" : "secondary"}
                className="flex flex-col items-center justify-center font-bold shadow-sm h-11 text-[11px] leading-tight px-1 py-1"
              >
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                  Beli {p.name.replace("Chef ", "")}
                </span>
                {!canBuyFor(idx) && (
                  <span className="text-[8px] opacity-75 font-normal">
                    {p.cash < price ? "Kas kurang" : "Tidak butuh"}
                  </span>
                )}
              </Button>
            ))}
            <Button 
              onClick={onSkip} 
              variant="outline" 
              size="sm" 
              className="flex flex-col items-center justify-center h-11 text-[11px] font-bold px-1"
            >
              <ArrowRight className="w-3.5 h-3.5 mb-0.5 shrink-0" />
              Skip
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ===================== QUEST BOARD ===================== */

function QuestBoard({ player }: { player: Player }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-rows-2 gap-3 md:gap-4 lg:h-full lg:min-h-0">
      {player.menus.map((m) => {
        const bought = player.bought[m.id] || [];
        const done = player.completed.includes(m.id);

        // Differentiate style classes by menu type
        let cardBg = "from-white to-[#FFF8F6] border-[#FFE8E5]";
        let badgeBg = "from-[#FF5A5F] to-[#FF7A00] text-white";
        let badgeText = "MAIN COURSE";
        let feeColor = "text-[#FF5A5F]";
        let accentBg = "bg-gradient-to-r from-[#FF5A5F] to-[#FF7A00]";
        let iconBgOuter = "bg-[#FFEAEB]";
        let iconBgInner = "bg-[#FFD4D6]";
        let iconColor = "text-[#FF5A5F]";
        let footerBg = "bg-gradient-to-r from-[#FF5A5F] to-[#FF7A00] text-white";
        let icon = <Utensils className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />;
        let waveFill = "url(#coral-grad)";
        let blobFill = "url(#mint-grad)";

        if (m.type === "Pembuka") {
          cardBg = "from-white to-[#F0FFF9] border-[#D5FAF4]";
          badgeBg = "from-[#00F5D4] to-[#00BB9B] text-[#033E35]";
          badgeText = "PEMBUKA";
          feeColor = "text-[#00BB9B]";
          accentBg = "bg-gradient-to-r from-[#00F5D4] to-[#00BB9B]";
          iconBgOuter = "bg-[#E6FFF9]";
          iconBgInner = "bg-[#B5FFE6]";
          iconColor = "text-[#00BB9B]";
          footerBg = "bg-gradient-to-r from-[#00F5D4] to-[#00BB9B] text-[#033E35]";
          icon = <Soup className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />;
          waveFill = "url(#mint-grad)";
          blobFill = "url(#coral-grad)";
        } else if (m.type === "Penutup") {
          cardBg = "from-white to-[#FAF0FF] border-[#F4E5FF]";
          badgeBg = "from-[#9b5de5] to-[#f15bb5] text-white";
          badgeText = "PENUTUP";
          feeColor = "text-[#9b5de5]";
          accentBg = "bg-gradient-to-r from-[#9b5de5] to-[#f15bb5]";
          iconBgOuter = "bg-[#FAF0FF]";
          iconBgInner = "bg-[#EBD0FF]";
          iconColor = "text-[#9b5de5]";
          footerBg = "bg-gradient-to-r from-[#9b5de5] to-[#f15bb5] text-white";
          icon = <IceCream className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />;
          waveFill = "url(#purple-grad)";
          blobFill = "url(#pink-grad)";
        }

        return (
          <div
            key={m.id}
            className={`relative overflow-hidden rounded-[16px] md:rounded-[20px] p-3 md:p-4 border-2 shadow-lg bg-gradient-to-br ${cardBg} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between lg:h-full lg:min-h-0 min-h-[290px] md:min-h-[315px] gap-1.5 md:gap-2.5`}
          >
            {/* SVG Background Elements */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 450 500" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="coral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5A5F" />
                  <stop offset="100%" stopColor="#FF7A00" />
                </linearGradient>
                <linearGradient id="mint-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F5D4" />
                  <stop offset="100%" stopColor="#00BB9B" />
                </linearGradient>
                <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9b5de5" />
                  <stop offset="100%" stopColor="#7B2CBF" />
                </linearGradient>
                <linearGradient id="pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f15bb5" />
                  <stop offset="100%" stopColor="#C77DFF" />
                </linearGradient>
              </defs>
              {/* Lengkungan atas (Wave) */}
              <path d="M 0,0 L 450,0 L 450,90 C 350,120 280,40 0,95 Z" fill={waveFill} opacity="0.12" />
              {/* Blob organik di kanan bawah */}
              <path d="M 450,280 C 400,280 340,320 350,380 C 360,440 410,470 450,480 Z" fill={blobFill} opacity="0.08" />
              {/* Lingkaran ornamen kecil modern */}
              <circle cx="40" cy="130" r="8" fill="#00F5D4" opacity="0.2" />
              <circle cx="410" cy="220" r="4" fill="#FF5A5F" opacity="0.3" />
              <circle cx="25" cy="400" r="12" fill="#FF7A00" opacity="0.1" />
            </svg>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col justify-between h-full flex-1">
              
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center justify-center px-1.5 py-0.5 md:px-2 py-0.5 rounded-[4px] md:rounded-[6px] text-[8px] md:text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-br ${badgeBg}`}>
                  {badgeText}
                </span>
                <span className={`text-xs sm:text-sm md:text-lg font-black ${feeColor}`}>
                  {formatRp(m.jasa)}
                </span>
              </div>

              {/* Centerpiece Visual */}
              <div className="flex flex-col items-center mt-0.5 md:mt-1.5 mb-0.5">
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full ${iconBgOuter} flex items-center justify-center shadow-inner relative`}>
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${iconBgInner} flex items-center justify-center ${iconColor}`}>
                    {icon}
                  </div>
                </div>
                <h3 className="text-[10px] sm:text-xs md:text-sm font-black text-foreground mt-1 md:mt-1.5 text-center leading-tight tracking-tight">
                  {m.name}
                </h3>
                <div className={`w-6 md:w-10 h-0.5 rounded-full ${accentBg} mt-0.5 md:mt-1`} />
              </div>

              {/* Ingredients Section */}
              <div className="space-y-1 md:space-y-1.5 flex-1 flex flex-col justify-end my-1 md:my-1.5">
                {/* Additional Ingredients checklist */}
                <div className="space-y-0.5 md:space-y-1">
                  {m.ingredients.map((ing) => {
                    const has = bought.includes(ing);
                    const tier = tierOf(ing);
                    const isRare = m.rareIngredients?.includes(ing);

                    // dot color styling
                    let dotBgClass = "bg-[#00BB9B]"; // Ekonomis
                    if (tier === "Premium") dotBgClass = "bg-[#FF5A5F]";
                    if (tier === "Medium") dotBgClass = "bg-[#FF7A00]";
                    if (isRare) dotBgClass = "bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.6)] animate-pulse";

                    return (
                      <div key={ing} className="flex items-center justify-between text-[11px] md:text-[13px] py-1 border-b border-[#F0F2EE]/60 last:border-0">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          {has ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                          ) : (
                            <Circle className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                          )}
                          <span className={`font-bold text-foreground truncate max-w-[100px] sm:max-w-none ${has ? "line-through opacity-50" : ""}`}>
                            {ing}
                          </span>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 border border-white/20 ${dotBgClass}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Cooking Tip */}
              <div className={`w-full py-0.5 px-2 rounded-full ${footerBg} text-[7px] md:text-[8px] font-bold text-center leading-tight flex items-center justify-center mt-auto min-h-[18px] md:min-h-[22px]`}>
                "{m.tip}"
              </div>

            </div>

            {/* Glassmorphism Completed Overlay */}
            {done && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1 z-20 animate-in fade-in duration-300">
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full ${accentBg} text-white flex items-center justify-center shadow-lg animate-bounce`}>
                  <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <span className="font-extrabold text-xs md:text-lg text-foreground tracking-wide uppercase">Menu Tersaji</span>
                <span className={`text-[8px] md:text-xs font-bold ${feeColor}`}>Jasa {formatRp(m.jasa)} Diterima</span>
              </div>
            )}

          </div>
        );
      })}
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
                      {p.completed.length}/6 menu tersaji
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