export type ServiceType =
  | "roofing"
  | "kitchen"
  | "bathroom"
  | "general"
  | "painting"
  | "flooring"
  | "electrical"
  | "plumbing";

export interface ServiceMeta {
  key: ServiceType;
  label: string;
  icon: string;
  baseFee: number;
  ratePerSqFt: number;
  blurb: string;
}

export const SERVICES: ServiceMeta[] = [
  {
    key: "roofing",
    label: "Roofing",
    icon: "🏠",
    baseFee: 1200,
    ratePerSqFt: 6.5,
    blurb: "Shingle, metal & flat roof installation and repair.",
  },
  {
    key: "kitchen",
    label: "Kitchen Remodel",
    icon: "🍳",
    baseFee: 4500,
    ratePerSqFt: 95,
    blurb: "Cabinets, countertops, plumbing and full renovations.",
  },
  {
    key: "bathroom",
    label: "Bathroom Remodel",
    icon: "🛁",
    baseFee: 3200,
    ratePerSqFt: 110,
    blurb: "Tile, fixtures, vanities and complete makeovers.",
  },
  {
    key: "general",
    label: "General Construction",
    icon: "🏗️",
    baseFee: 2500,
    ratePerSqFt: 140,
    blurb: "Additions, framing, and ground-up builds.",
  },
  {
    key: "painting",
    label: "Painting",
    icon: "🎨",
    baseFee: 600,
    ratePerSqFt: 3.2,
    blurb: "Interior & exterior painting with premium finishes.",
  },
  {
    key: "flooring",
    label: "Flooring",
    icon: "🪵",
    baseFee: 900,
    ratePerSqFt: 8.5,
    blurb: "Hardwood, tile, laminate and vinyl installation.",
  },
  {
    key: "electrical",
    label: "Electrical",
    icon: "💡",
    baseFee: 450,
    ratePerSqFt: 12,
    blurb: "Wiring, panels, lighting and code upgrades.",
  },
  {
    key: "plumbing",
    label: "Plumbing",
    icon: "🔧",
    baseFee: 500,
    ratePerSqFt: 14,
    blurb: "Repipes, fixtures, water heaters and repairs.",
  },
];

export function getService(key: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.key === key);
}

export interface EstimateInput {
  serviceType: string;
  squareFootage: number;
}

export interface EstimateResult {
  baseFee: number;
  areaCost: number;
  subtotal: number;
  contingency: number;
  total: number;
}

/**
 * Transparent, deterministic estimate used both client-side (instant preview)
 * and server-side (authoritative record). A 12% contingency is added so the
 * on-site final number stays predictable.
 */
export function estimate(input: EstimateInput): EstimateResult {
  const service = getService(input.serviceType);
  const baseFee = service?.baseFee ?? 1500;
  const rate = service?.ratePerSqFt ?? 20;
  const sqft = Math.max(0, Math.round(input.squareFootage || 0));

  const areaCost = Math.round(sqft * rate);
  const subtotal = baseFee + areaCost;
  const contingency = Math.round(subtotal * 0.12);
  const total = subtotal + contingency;

  return { baseFee, areaCost, subtotal, contingency, total };
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function generateReference(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}
