/**
 * Demo simulation model (MASTER PROMPT §28).
 *
 * This is a **simulation**, and the code is arranged so it cannot pretend
 * otherwise:
 *
 *  - Every number on screen is **derived from the simulation state**, never
 *    typed in as a marketing figure. If an operator does not move, the
 *    coverage does not rise, because coverage is a count of the points the
 *    simulation actually produced.
 *  - The input parameters are declared once, in `ASSUMPTIONS`, and the UI is
 *    required to display them. Target reach, zone letterbox counts, operator
 *    count and the price per verified reach are all assumptions, not measured
 *    results, and §18 of the brief requires that distinction to be visible.
 *  - The path of each operator is generated from a seeded pseudo-random walk
 *    inside its zone, so the demo is deterministic: the same run produces the
 *    same story every time, which is what makes a demo trustworthy to the
 *    person watching it.
 *
 * Zones are the same four Milan districts the brief names, using rectangles
 * around real district centres rather than invented geometry.
 */

export interface Zone {
  id: string;
  name: string;
  centre: [number, number];
  /** Half-width/half-height in degrees, roughly a walkable district block. */
  half: [number, number];
  /** Assumed letterboxes in the zone. */
  letterboxes: number;
  color: string;
}

/** Declared once, shown in the UI. Nothing here is a measured result. */
export const ASSUMPTIONS = {
  campaignName: 'Milano Local Launch',
  targetReach: 25_000,
  pricePerVerifiedReachEur: 0.21,
  durationSeconds: 52,
  operatorCount: 6,
  /** Fraction of captured proof that passes verification once the run settles. */
  settledVerificationRate: 0.94,
  note: 'Simulation. Target reach, zone sizes, operator count and price per verified reach are assumptions for demonstration, not measured results.',
} as const;

export const ZONES: Zone[] = [
  {
    id: 'duomo',
    name: 'Duomo',
    centre: [45.4642, 9.19],
    half: [0.0042, 0.0055],
    letterboxes: 8_400,
    color: '#006de4',
  },
  {
    id: 'navigli',
    name: 'Navigli',
    centre: [45.452, 9.1745],
    half: [0.0038, 0.0048],
    letterboxes: 6_100,
    color: '#10b981',
  },
  {
    id: 'porta-romana',
    name: 'Porta Romana',
    centre: [45.4495, 9.1965],
    half: [0.004, 0.005],
    letterboxes: 5_800,
    color: '#f59e0b',
  },
  {
    id: 'centrale',
    name: 'Centrale',
    centre: [45.4862, 9.2043],
    half: [0.0044, 0.0052],
    letterboxes: 4_700,
    color: '#8b5cf6',
  },
];

export interface Operator {
  id: string;
  zoneId: string;
  label: string;
  /** Seed for this operator's walk, so every run is identical. */
  seed: number;
}

export const OPERATORS: Operator[] = [
  { id: 'op-1', zoneId: 'duomo', label: 'Runner 1', seed: 11 },
  { id: 'op-2', zoneId: 'duomo', label: 'Runner 2', seed: 29 },
  { id: 'op-3', zoneId: 'navigli', label: 'Runner 3', seed: 47 },
  { id: 'op-4', zoneId: 'navigli', label: 'Runner 4', seed: 61 },
  { id: 'op-5', zoneId: 'porta-romana', label: 'Runner 5', seed: 73 },
  { id: 'op-6', zoneId: 'centrale', label: 'Runner 6', seed: 97 },
];

/** Mulberry32: small, seeded, and identical on every engine. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ProofEvent {
  operatorId: string;
  zoneId: string;
  at: [number, number];
  verified: boolean;
  /** Seconds into the demo when this drop happened. */
  at_second: number;
}

/** The walk an operator takes through its zone, sampled as waypoints. */
export function buildRoute(zone: Zone, operator: Operator, points = 14): [number, number][] {
  const rand = rng(operator.seed);
  const [lat0, lng0] = zone.centre;
  const [dLat, dLng] = zone.half;
  const route: [number, number][] = [[lat0 - dLat * 0.7, lng0 - dLng * 0.7]];

  for (let i = 1; i < points; i += 1) {
    // A boustrophedon sweep with jitter: it reads as street work rather than
    // a random cloud, and it always stays inside the zone.
    const row = Math.floor((i - 1) / 3);
    const goingRight = row % 2 === 0;
    const alongX = goingRight
      ? -0.7 + (1.4 * (((i - 1) % 3) + 1)) / 3
      : 0.7 - (1.4 * (((i - 1) % 3) + 1)) / 3;
    const alongY = -0.7 + (1.4 * (row + 1)) / Math.ceil(points / 3);
    const jitter = (rand() - 0.5) * 0.18;
    route.push([
      Math.max(zone.centre[0] - dLat, Math.min(zone.centre[0] + dLat, lat0 + dLat * (alongY + jitter * 0.2))),
      Math.max(zone.centre[1] - dLng, Math.min(zone.centre[1] + dLng, lng0 + dLng * (alongX + jitter * 0.2))),
    ]);
  }
  return route;
}

const ROUTE_CACHE = new Map<string, [number, number][]>();
export function routeFor(operator: Operator): [number, number][] {
  const cached = ROUTE_CACHE.get(operator.id);
  if (cached) return cached;
  const zone = ZONES.find((z) => z.id === operator.zoneId)!;
  const route = buildRoute(zone, operator);
  ROUTE_CACHE.set(operator.id, route);
  return route;
}

/** Position along a polyline at 0..1, with the segment it sits on. */
function positionAlong(route: [number, number][], t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  const segments = route.length - 1;
  const exact = clamped * segments;
  const index = Math.min(segments - 1, Math.floor(exact));
  const within = exact - index;
  const [aLat, aLng] = route[index];
  const [bLat, bLng] = route[index + 1] ?? route[index];
  return {
    lat: aLat + (bLat - aLat) * within,
    lng: aLng + (bLng - aLng) * within,
    index,
  };
}

export interface SimulationState {
  /** 0..1 through the whole story. */
  progress: number;
  /** Current stage index, derived from progress. */
  stage: number;
  stageLabel: string;
  operators: {
    id: string;
    zoneId: string;
    label: string;
    lat: number;
    lng: number;
    /** Fraction of this operator's own route completed. */
    progress: number;
    completedDrops: number;
    verifiedDrops: number;
    totalDrops: number;
    verified: boolean;
  }[];
  metrics: {
    targetReach: number;
    executed: number;
    verified: number;
    coveragePct: number;
    verificationRate: number;
    activeOperators: number;
    completedActivities: number;
    costPerVerifiedReach: number;
    totalSpend: number;
  };
  /** The most recent proof, for the on-screen verification ticks. */
  latestProof: ProofEvent | null;
}

export const STAGES = [
  { at: 0, label: 'Campaign created' },
  { at: 0.08, label: 'Area split into four districts' },
  { at: 0.2, label: 'Field operators deployed' },
  { at: 0.34, label: 'Executing routes' },
  { at: 0.55, label: 'GPS, time and photo verification' },
  { at: 0.78, label: 'Coverage consolidating' },
  { at: 0.9, label: 'Analytics and report' },
];

/** Operators start slightly staggered, so a deploy reads as a deploy. */
const STAGGER = [0, 0.04, 0.02, 0.06, 0.03, 0.05];

/**
 * The whole simulation as a pure function of time.
 *
 * Pure on purpose: the same `progress` always yields the same state, so the
 * demo cannot drift, and it can be unit-tested without a browser.
 */
export function simulate(progress: number): SimulationState {
  const p = Math.min(1, Math.max(0, progress));
  const ops = OPERATORS.map((op, i) => {
    const route = routeFor(op);
    const local = Math.min(1, Math.max(0, (p - STAGGER[i]) / (1 - STAGGER[i])));
    const { lat, lng, index } = positionAlong(route, local);
    // A drop is "captured" on reaching each waypoint.
    const completedDrops = Math.floor(local * (route.length - 1));
    // Verification lands a beat after capture, which is what the ticks show.
    const verifiedAt = Math.max(0, completedDrops - 0.6);
    const verifiedDrops = Math.min(completedDrops, Math.floor(verifiedAt));
    const rand = rng(op.seed + completedDrops);
    const verified = completedDrops > 0 && rand() < ASSUMPTIONS.settledVerificationRate;
    return {
      id: op.id,
      zoneId: op.zoneId,
      label: op.label,
      lat,
      lng,
      progress: local,
      completedDrops,
      verifiedDrops,
      totalDrops: route.length - 1,
      verified,
      routeIndex: index,
    };
  });

  // Zone coverage: each zone's letterboxes are covered in proportion to the
  // best progress among its operators, so two runners finish a zone sooner.
  let executed = 0;
  for (const zone of ZONES) {
    const inZone = ops.filter((o) => o.zoneId === zone.id);
    if (inZone.length === 0) continue;
    const best = Math.max(...inZone.map((o) => o.progress));
    executed += Math.round(zone.letterboxes * best);
  }

  const completedActivities = ops.reduce((sum, o) => sum + o.completedDrops, 0);
  const verifiedActivities = ops.reduce((sum, o) => sum + o.verifiedDrops, 0);
  // Reach scales with activity: one verified drop is a bundle of letterboxes.
  const verified = Math.round((verifiedActivities / Math.max(1, completedActivities)) * executed);

  const coveragePct = executed / ASSUMPTIONS.targetReach;
  const verificationRate = executed === 0 ? 0 : verified / executed;
  const totalSpend = +(verified * ASSUMPTIONS.pricePerVerifiedReachEur).toFixed(2);
  const costPerVerifiedReach = verified === 0 ? 0 : totalSpend / verified;

  let stage = 0;
  for (let i = 0; i < STAGES.length; i += 1) {
    if (p >= STAGES[i].at) stage = i;
  }

  const active = ops.filter((o) => o.progress > 0 && o.progress < 1).length;

  // Most recent verified proof, for the tick marks on screen.
  let latestProof: ProofEvent | null = null;
  for (const o of ops) {
    if (o.verifiedDrops === 0) continue;
    const route = routeFor(OPERATORS.find((op) => op.id === o.id)!);
    const idx = Math.max(0, o.verifiedDrops - 1);
    const at = route[idx] ?? route[0];
    const candidate: ProofEvent = {
      operatorId: o.id,
      zoneId: o.zoneId,
      at,
      verified: true,
      at_second: Math.round(p * ASSUMPTIONS.durationSeconds),
    };
    if (!latestProof || candidate.at_second >= latestProof.at_second) latestProof = candidate;
  }

  return {
    progress: p,
    stage,
    stageLabel: STAGES[stage].label,
    operators: ops.map(({ routeIndex: _routeIndex, ...rest }) => rest),
    metrics: {
      targetReach: ASSUMPTIONS.targetReach,
      executed,
      verified,
      coveragePct,
      verificationRate,
      activeOperators: active,
      completedActivities,
      costPerVerifiedReach,
      totalSpend,
    },
    latestProof,
  };
}
