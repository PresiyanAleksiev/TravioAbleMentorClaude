import { K as jsxRuntimeExports } from "./server-Dg-eis91.js";
import { H as Header, c as Link, F as Footer } from "./router-BFR-v_9l.js";
import { A as ArrowLeft } from "./arrow-left-C8nokORl.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 py-24 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-bold text-foreground", children: "Landmark not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "We couldn't find that landmark in our catalogue." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back home"
    ] })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
] });
export {
  SplitNotFoundComponent as notFoundComponent
};
