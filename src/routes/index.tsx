import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Moon, Sun, User, Heart, MapPin, X, ArrowUpRight, Compass } from "lucide-react";
import { CITY_COORDS } from "@/lib/bulgaria-data";
import { getFavorites, removeFavorite, type Favorite } from "@/lib/mock-favorites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Travio — Plan trips across Bulgaria" },
      { name: "description", content: "Compare routes across Bulgaria by bus, train or car." },
    ],
  }),
  component: Index,
});

const CITIES = Object.keys(CITY_COORDS).map((k) => k.replace(/\b\w/g, (c) => c.toUpperCase()));

function Index() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("Sofia");
  const [to, setTo] = useState("Plovdiv");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    navigate({ to: "/results", search: { from: from.trim(), to: to.trim() } });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col justify-center">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--primary) 0, transparent 40%), radial-gradient(circle at 80% 30%, var(--secondary) 0, transparent 45%)" }} />
          <div className="mx-auto max-w-4xl px-6 pt-12 pb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Plan smarter trips across Bulgaria
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] text-foreground sm:text-7xl">
              From the Black Sea<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-warm)" }}>to the Rila peaks.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Compare the fastest, cheapest, and most convenient ways to get anywhere in the country — bus, train, or car.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-6">
          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-3 sm:p-4" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <CityInput label="From" value={from} onChange={setFrom} accentDot="bg-primary" />
              <CityInput label="To" value={to} onChange={setTo} accentDot="bg-secondary" />
              <button type="submit" className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]" style={{ background: "var(--gradient-hero)" }}>
                Find Routes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export function Header() {
  const [dark, setDark] = useState(() => typeof window !== "undefined" && localStorage.getItem("theme") === "dark");
  const [panelOpen, setPanelOpen] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const openPanel = () => {
    setFavorites(getFavorites());
    setPanelOpen(true);
  };

  const handleRemove = (fav: Favorite) => {
    removeFavorite(fav);
    setFavorites(getFavorites());
  };

  const landmarkFavs = favorites.filter(f => f.type === "landmark");
  const routeFavs = favorites.filter(f => f.type === "route");

  return (
    <>
      <div className="w-full px-6 pt-10">
        <div className="flex items-center justify-between">
          <a href="/"><img src={dark ? "/logo-dark.svg" : "/logo.svg"} alt="Travio" className="h-10 w-auto" /></a>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">Bulgaria, end to end</span>
            <button onClick={() => setDark(d => !d)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted" aria-label="Toggle dark mode">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={openPanel} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted" aria-label="Profile">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
      )}

      {/* Slide-in panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col bg-card border-l border-border transition-transform duration-300"
        style={{
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-primary-foreground font-bold text-lg" style={{ background: "var(--gradient-hero)" }}>P</div>
            <div>
              <p className="font-semibold text-foreground">Presiyan</p>
              <p className="text-xs text-muted-foreground">presiyan@travio.bg</p>
            </div>
          </div>
          <button onClick={() => setPanelOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Favorite landmarks */}
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              <Heart className="h-3.5 w-3.5 text-primary" /> Favourite landmarks
            </p>
            <div className="space-y-2">
              {landmarkFavs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic px-1">No favourites added yet.</p>
              ) : landmarkFavs.map((fav, i) => fav.type === "landmark" && (
                <div key={i} className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-3 transition-all hover:border-primary/40 hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
                  <img src={`/landmarks/${fav.slug}.jpg`} className="h-12 w-12 rounded-xl object-cover shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{fav.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />{fav.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/landmark/$slug" params={{ slug: fav.slug }} onClick={() => setPanelOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => handleRemove(fav)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite routes */}
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              <Compass className="h-3.5 w-3.5 text-primary" /> Favourite routes
            </p>
            <div className="space-y-2">
              {routeFavs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic px-1">No favourites added yet.</p>
              ) : routeFavs.map((fav, i) => fav.type === "route" && (
                <div key={i} className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{fav.from} → {fav.to}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Saved route</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/results" search={{ from: fav.from, to: fav.to }} onClick={() => setPanelOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => handleRemove(fav)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel footer */}
        <div className="px-6 py-4 border-t border-border">
          <button className="w-full rounded-2xl py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center">
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
      Travio · Estimates only · Built for travelers in Bulgaria
    </footer>
  );
}

function CityInput({ label, value, onChange, accentDot }: { label: string; value: string; onChange: (v: string) => void; accentDot: string }) {
  const listId = `cities-${label}`;
  return (
    <label className="group relative flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 transition-colors focus-within:bg-muted">
      <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${accentDot}`} />
      <span className="flex flex-1 flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <input list={listId} value={value} onChange={(e) => onChange(e.target.value)} placeholder="City in Bulgaria" className="bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
        <datalist id={listId}>{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
      </span>
    </label>
  );
}
