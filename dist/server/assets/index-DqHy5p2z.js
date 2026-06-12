import { K as jsxRuntimeExports, V as reactExports } from "./server-Dg-eis91.js";
import { h as createLucideIcon, f as Sun, d as Moon, U as User, X, b as Heart, M as MapPin, c as Link, A as ArrowUpRight, a as Compass, D as useNavigate, l as getFavorites, s as removeFavorite, C as CITY_COORDS } from "./router-BFR-v_9l.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
const CITIES = Object.keys(CITY_COORDS).map((k) => k.replace(/\b\w/g, (c) => c.toUpperCase()));
function Index() {
  const navigate = useNavigate();
  const [from, setFrom] = reactExports.useState("Sofia");
  const [to, setTo] = reactExports.useState("Plovdiv");
  const onSubmit = (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    navigate({
      to: "/results",
      search: {
        from: from.trim(),
        to: to.trim()
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-[0.08]", style: {
          backgroundImage: "radial-gradient(circle at 20% 20%, var(--primary) 0, transparent 40%), radial-gradient(circle at 80% 30%, var(--secondary) 0, transparent 45%)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-6 pt-12 pb-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
            "Plan smarter trips across Bulgaria"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-display text-5xl font-extrabold leading-[1.05] text-foreground sm:text-7xl", children: [
            "From the Black Sea",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-clip-text text-transparent", style: {
              backgroundImage: "var(--gradient-warm)"
            }, children: "to the Rila peaks." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg", children: "Compare the fastest, cheapest, and most convenient ways to get anywhere in the country — bus, train, or car." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-4xl px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit, className: "rounded-3xl border border-border bg-card p-3 sm:p-4", style: {
        boxShadow: "var(--shadow-elegant)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-[1fr_1fr_auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CityInput, { label: "From", value: from, onChange: setFrom, accentDot: "bg-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CityInput, { label: "To", value: to, onChange: setTo, accentDot: "bg-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]", style: {
          background: "var(--gradient-hero)"
        }, children: [
          "Find Routes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Header() {
  const [dark, setDark] = reactExports.useState(() => typeof window !== "undefined" && localStorage.getItem("theme") === "dark");
  const [panelOpen, setPanelOpen] = reactExports.useState(false);
  const [favorites, setFavorites] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  const openPanel = () => {
    setFavorites(getFavorites());
    setPanelOpen(true);
  };
  const handleRemove = (fav) => {
    removeFavorite(fav);
    setFavorites(getFavorites());
  };
  const landmarkFavs = favorites.filter((f) => f.type === "landmark");
  const routeFavs = favorites.filter((f) => f.type === "route");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full px-6 pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: dark ? "/logo-dark.svg" : "/logo.svg", alt: "Travio", className: "h-10 w-auto" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm text-muted-foreground sm:block", children: "Bulgaria, end to end" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDark((d) => !d), className: "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted", "aria-label": "Toggle dark mode", children: dark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: openPanel, className: "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted", "aria-label": "Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }) })
      ] })
    ] }) }),
    panelOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm", onClick: () => setPanelOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col bg-card border-l border-border transition-transform duration-300", style: {
      transform: panelOpen ? "translateX(0)" : "translateX(100%)",
      boxShadow: "-8px 0 40px rgba(0,0,0,0.15)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl text-primary-foreground font-bold text-lg", style: {
            background: "var(--gradient-hero)"
          }, children: "P" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Presiyan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "presiyan@travio.bg" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPanelOpen(false), className: "flex h-8 w-8 items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-6 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3.5 w-3.5 text-primary" }),
            " Favourite landmarks"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: landmarkFavs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic px-1", children: "No favourites added yet." }) : landmarkFavs.map((fav, i) => fav.type === "landmark" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex items-center gap-3 rounded-2xl border border-border bg-background p-3 transition-all hover:border-primary/40 hover:-translate-y-0.5", style: {
            boxShadow: "var(--shadow-card)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `/landmarks/${fav.slug}.jpg`, className: "h-12 w-12 rounded-xl object-cover shrink-0", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: fav.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                fav.city
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/landmark/$slug", params: {
                slug: fav.slug
              }, onClick: () => setPanelOpen(false), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(fav), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "h-3.5 w-3.5 text-primary" }),
            " Favourite routes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: routeFavs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic px-1", children: "No favourites added yet." }) : routeFavs.map((fav, i) => fav.type === "route" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5", style: {
            boxShadow: "var(--shadow-card)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                fav.from,
                " → ",
                fav.to
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Saved route" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/results", search: {
                from: fav.from,
                to: fav.to
              }, onClick: () => setPanelOpen(false), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(fav), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }, i)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full rounded-2xl py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center", children: "Sign out" }) })
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border py-8 text-center text-xs text-muted-foreground", children: "Travio · Estimates only · Built for travelers in Bulgaria" });
}
function CityInput({
  label,
  value,
  onChange,
  accentDot
}) {
  const listId = `cities-${label}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "group relative flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 transition-colors focus-within:bg-muted", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${accentDot}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { list: listId, value, onChange: (e) => onChange(e.target.value), placeholder: "City in Bulgaria", className: "bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: listId, children: CITIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c }, c)) })
    ] })
  ] });
}
export {
  Footer,
  Header,
  Index as component
};
