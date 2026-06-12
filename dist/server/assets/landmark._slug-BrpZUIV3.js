import { K as jsxRuntimeExports } from "./server-Dg-eis91.js";
import { h as createLucideIcon, e as Route, H as Header, c as Link, M as MapPin, F as Footer } from "./router-BFR-v_9l.js";
import { A as ArrowLeft } from "./arrow-left-C8nokORl.js";
import { C as Clock, T as Ticket } from "./ticket-CqujGuI3.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  [
    "path",
    { d: "M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125", key: "vxdnp4" }
  ],
  [
    "path",
    {
      d: "M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
      key: "15cy7q"
    }
  ],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }]
];
const CalendarHeart = createLucideIcon("calendar-heart", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
function LandmarkPage() {
  const {
    landmark: l
  } = Route.useLoaderData();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lng}`;
  const photoUrl = `/landmarks/${l.slug}.jpg`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative h-[55vh] min-h-[380px] w-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photoUrl, alt: l.name, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-6 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/60 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to search"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mr-1 inline h-3 w-3" }),
          l.city
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-bold text-white md:text-6xl drop-shadow-lg", children: l.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-base text-white/80", children: l.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-6 py-10 md:px-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border bg-card p-6", style: {
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "About" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base leading-relaxed text-muted-foreground", children: l.longDescription })
        ] }),
        l.tips && l.tips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border bg-card p-6", style: {
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-display text-2xl font-bold text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5 text-primary" }),
            " Travel tips"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: l.tips.map((tip) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tip })
          ] }, tip)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: Clock, label: "Opening hours", value: l.hours }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: Ticket, label: "Tickets & fees", value: l.ticketPrice }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: CalendarHeart, label: "Best time to visit", value: l.bestTime }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: mapsUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted", style: {
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            " Open in Google Maps"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        l.website && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: l.website, target: "_blank", rel: "noopener noreferrer", className: "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90", style: {
          background: "var(--gradient-hero)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Official website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function InfoCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", style: {
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-medium text-foreground", children: value })
  ] });
}
export {
  LandmarkPage as component
};
