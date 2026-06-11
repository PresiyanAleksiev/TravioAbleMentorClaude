export type Favorite =
  | { type: "landmark"; slug: string; name: string; city: string }
  | { type: "route"; from: string; to: string }

const KEY = "travio_favorites"

const DEFAULTS: Favorite[] = [
  { type: "landmark", slug: "rila-monastery", name: "Rila Monastery", city: "Rila" },
  { type: "landmark", slug: "tsarevets-fortress", name: "Tsarevets Fortress", city: "Veliko Tarnovo" },
  { type: "landmark", slug: "plovdiv-old-town", name: "Plovdiv Old Town", city: "Plovdiv" },
  { type: "route", from: "Sofia", to: "Plovdiv" },
  { type: "route", from: "Varna", to: "Burgas" },
]

export function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(KEY)
    if (!stored) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULTS))
      return DEFAULTS
    }
    return JSON.parse(stored)
  } catch { return DEFAULTS }
}

export function addFavorite(fav: Favorite): void {
  const favs = getFavorites()
  const exists = favs.some(f => JSON.stringify(f) === JSON.stringify(fav))
  if (!exists) {
    favs.push(fav)
    localStorage.setItem(KEY, JSON.stringify(favs))
  }
}

export function removeFavorite(fav: Favorite): void {
  const favs = getFavorites().filter(f => JSON.stringify(f) !== JSON.stringify(fav))
  localStorage.setItem(KEY, JSON.stringify(favs))
}

export function isFavorite(fav: Favorite): boolean {
  return getFavorites().some(f => JSON.stringify(f) === JSON.stringify(fav))
}
