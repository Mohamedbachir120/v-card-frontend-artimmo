export const STATUSES = [
  { key: "prospect", label: "Prospect", color: "#6b7280" },
  { key: "interesse", label: "Intéressé", color: "#f59e0b" },
  { key: "reserve", label: "Réservé", color: "#457b9d" },
  { key: "vendu", label: "Vendu", color: "#12a150" },
];

export const PROPERTY_TYPES = [
  { key: "appartement", label: "Appartement" },
  { key: "villa", label: "Villa" },
  { key: "terrain", label: "Terrain" },
  { key: "local", label: "Local commercial" },
  { key: "bureau", label: "Bureau" },
  { key: "autre", label: "Autre" },
];

export const INTERACTION_TYPES = [
  { key: "note", label: "Note", icon: "edit" },
  { key: "appel", label: "Appel", icon: "phone" },
  { key: "visite", label: "Visite", icon: "mapPin" },
  { key: "email", label: "E-mail", icon: "mail" },
];

export function statusMeta(key) {
  return STATUSES.find(s => s.key === key) || STATUSES[0];
}

export function formatBudget(min, max) {
  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n) + " DA";
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `À partir de ${fmt(min)}`;
  if (max) return `Jusqu'à ${fmt(max)}`;
  return null;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso.replace(" ", "T"));
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
