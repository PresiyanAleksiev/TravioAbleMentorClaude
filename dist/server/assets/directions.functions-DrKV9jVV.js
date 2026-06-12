import { c as createServerRpc } from "./createServerRpc-B4ahQwrZ.js";
import { i as createServerFn } from "./server-Dg-eis91.js";
import { o as objectType, n as numberType } from "./types-BoWyrJuk.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const Input = objectType({
  from: objectType({
    lat: numberType(),
    lng: numberType()
  }),
  to: objectType({
    lat: numberType(),
    lng: numberType()
  })
});
const getDirections_createServerFn_handler = createServerRpc({
  id: "3591a48adbedeb2e372e722c18c01a688c5d5e6ff055973c69e511d347b04fd3",
  name: "getDirections",
  filename: "src/lib/directions.functions.ts"
}, (opts) => getDirections.__executeServer(opts));
const getDirections = createServerFn({
  method: "POST"
}).inputValidator((input) => Input.parse(input)).handler(getDirections_createServerFn_handler, async ({
  data
}) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }
  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${data.from.lat},${data.from.lng}`);
  url.searchParams.set("destination", `${data.to.lat},${data.to.lng}`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("region", "bg");
  url.searchParams.set("key", key);
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Directions error ${res.status}`);
  }
  const json = await res.json();
  if (json.status !== "OK" || !json.routes[0]) {
    throw new Error(`Directions failed: ${json.status}${json.error_message ? ` — ${json.error_message}` : ""}`);
  }
  const route = json.routes[0];
  const meters = route.legs.reduce((s, l) => s + l.distance.value, 0);
  const seconds = route.legs.reduce((s, l) => s + l.duration.value, 0);
  return {
    distanceKm: Math.round(meters / 100) / 10,
    durationMin: Math.round(seconds / 60),
    polyline: route.overview_polyline.points,
    status: json.status
  };
});
export {
  getDirections_createServerFn_handler
};
