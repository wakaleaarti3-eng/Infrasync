// lib/mockData.ts
// Mock dataset for the InfraSync Government Dashboard.
// Replace with a live feed (e.g. /api/hotspots backed by H3-indexed request
// aggregation) once the ingestion pipeline is wired up.

export type Severity = "critical" | "high" | "medium" | "low";
export type Trend = "up" | "down" | "stable";
export type Sentiment = "negative" | "neutral" | "positive";

export interface EvidenceMetric {
  label: string;
  value: string;
}

export interface CitizenQuote {
  original: string;
  translated: string;
  language: string;
  sentiment: Sentiment;
}

export interface Hotspot {
  id: string;
  name: string;
  ward: string;
  category: string;
  lat: number;
  lng: number;
  requestCount: number;
  severity: Severity;
  trend: Trend;
  trendPct: number;
  confidenceScore: number; // AI model confidence, 0-100
  aiRecommendation: string;
  evidence: EvidenceMetric[];
  citizenQuotes: CitizenQuote[];
}

// Centered on Johannesburg metro (BRICS host geography) — swap for any
// municipality by re-centering the map and regenerating coordinates.
export const MAP_CENTER: [number, number] = [28.0473, -26.2041];

export const mockHotspots: Hotspot[] = [
  {
    id: "hex-4a2f1",
    name: "Alexandra North",
    ward: "Ward 105",
    category: "Water Supply",
    lat: -26.1015,
    lng: 28.0987,
    requestCount: 312,
    severity: "critical",
    trend: "up",
    trendPct: 34,
    confidenceScore: 91,
    aiRecommendation:
      "Deploy an emergency tanker route within 48 hours and prioritize the Marlboro pressure valve for repair. Cross-referenced maintenance logs show 3 unresolved leak reports in this cell dating back 11 days — the underlying cause is very likely a burst secondary main, not seasonal demand.",
    evidence: [
      { label: "Requests (7d)", value: "312" },
      { label: "Avg. resolution SLA", value: "9.2 days (target: 3)" },
      { label: "Repeat reporters", value: "68%" },
      { label: "Infra age", value: "38 yrs" },
    ],
    citizenQuotes: [
      {
        original: "Asikho manzi ekhaya izinsuku ezi-4 ngoku.",
        translated: "We have had no water at home for 4 days now.",
        language: "isiZulu",
        sentiment: "negative",
      },
      {
        original: "Die kraan is droog sedert Maandag, dis nou al 'n week.",
        translated: "The tap has been dry since Monday, it's been a week now.",
        language: "Afrikaans",
        sentiment: "negative",
      },
      {
        original: "Municipality trucks came once but it wasn't enough for the block.",
        translated: "Municipality trucks came once but it wasn't enough for the block.",
        language: "English",
        sentiment: "negative",
      },
    ],
  },
  {
    id: "hex-7c9d3",
    name: "Diepsloot West",
    ward: "Ward 95",
    category: "Road Infrastructure",
    lat: -25.9322,
    lng: 27.9553,
    requestCount: 187,
    severity: "high",
    trend: "up",
    trendPct: 12,
    confidenceScore: 84,
    aiRecommendation:
      "Schedule a pothole-patching crew for the Ingonyama Rd corridor before the next rainfall event; three requests cite the same location as a scooter/taxi accident risk. Bundle with the adjacent drainage ticket to avoid re-digging within the month.",
    evidence: [
      { label: "Requests (7d)", value: "187" },
      { label: "Avg. resolution SLA", value: "21 days (target: 14)" },
      { label: "Repeat reporters", value: "41%" },
      { label: "Nearby incident reports", value: "5" },
    ],
    citizenQuotes: [
      {
        original: "Ke kile ka senya foromo ya moto ka lebaka la lesoba lena.",
        translated: "I damaged my car's front axle because of this pothole.",
        language: "Sesotho",
        sentiment: "negative",
      },
      {
        original: "Every taxi swerves into oncoming traffic to dodge the hole near the clinic.",
        translated: "Every taxi swerves into oncoming traffic to dodge the hole near the clinic.",
        language: "English",
        sentiment: "negative",
      },
    ],
  },
  {
    id: "hex-1e88a",
    name: "Soweto — Orlando East",
    ward: "Ward 12",
    category: "Electricity",
    lat: -26.2678,
    lng: 27.9317,
    requestCount: 245,
    severity: "high",
    trend: "stable",
    trendPct: 2,
    confidenceScore: 88,
    aiRecommendation:
      "Field data points to an overloaded transformer rather than isolated faults — outage timestamps cluster at 18:00–21:00 daily. Recommend a capacity audit before winter peak load rather than continued reactive fuse replacement.",
    evidence: [
      { label: "Requests (7d)", value: "245" },
      { label: "Avg. resolution SLA", value: "2.1 days (target: 2)" },
      { label: "Repeat outage sites", value: "6" },
      { label: "Peak outage window", value: "18:00–21:00" },
    ],
    citizenQuotes: [
      {
        original: "Amalambu acisha njalo ntambama, izingane azikwazi ukwenza umsebenzi wesikole.",
        translated: "The lights go off every evening, the children can't do their schoolwork.",
        language: "isiZulu",
        sentiment: "negative",
      },
      {
        original: "It's the same transformer every time, someone must actually look at it.",
        translated: "It's the same transformer every time, someone must actually look at it.",
        language: "English",
        sentiment: "neutral",
      },
    ],
  },
  {
    id: "hex-9b31f",
    name: "Sandton CBD Fringe",
    ward: "Ward 103",
    category: "Sanitation",
    lat: -26.1076,
    lng: 28.0567,
    requestCount: 96,
    severity: "medium",
    trend: "down",
    trendPct: 8,
    confidenceScore: 76,
    aiRecommendation:
      "Volume is trending down after the added collection shift introduced two weeks ago. Recommend monitoring for one more cycle before reallocating the extra crew elsewhere — closing this out early risks a rebound.",
    evidence: [
      { label: "Requests (7d)", value: "96" },
      { label: "Avg. resolution SLA", value: "4 days (target: 5)" },
      { label: "Repeat reporters", value: "19%" },
      { label: "Change vs. last cycle", value: "-8%" },
    ],
    citizenQuotes: [
      {
        original: "Melhorou um pouco depois da nova equipa, mas ainda cheira mal ao fim de semana.",
        translated: "It improved a little after the new crew, but it still smells bad by the weekend.",
        language: "Portuguese",
        sentiment: "neutral",
      },
      {
        original: "Bins near the taxi rank overflow by Friday every single week.",
        translated: "Bins near the taxi rank overflow by Friday every single week.",
        language: "English",
        sentiment: "negative",
      },
    ],
  },
  {
    id: "hex-2f47c",
    name: "Tembisa South",
    ward: "Ward 24",
    category: "Waste Management",
    lat: -25.9967,
    lng: 28.2293,
    requestCount: 154,
    severity: "medium",
    trend: "up",
    trendPct: 15,
    confidenceScore: 79,
    aiRecommendation:
      "Illegal dumping reports are concentrated on the vacant lot along Zamokuhle St. A single fenced skip with a fixed collection day historically cuts repeat dumping by more than half in comparable wards — cheaper than continued cleanup callouts.",
    evidence: [
      { label: "Requests (7d)", value: "154" },
      { label: "Avg. resolution SLA", value: "6 days (target: 5)" },
      { label: "Illegal dumping reports", value: "22" },
      { label: "Cleanup callouts (30d)", value: "9" },
    ],
    citizenQuotes: [
      {
        original: "Bantu ba lahlela dithoto tsa bona lebaleng le le sa lefelweng.",
        translated: "People are dumping their waste on the empty lot.",
        language: "Sesotho",
        sentiment: "negative",
      },
      {
        original: "It attracts rats close to the crèche, someone needs to fence it off.",
        translated: "It attracts rats close to the crèche, someone needs to fence it off.",
        language: "English",
        sentiment: "negative",
      },
    ],
  },
  {
    id: "hex-6d5a9",
    name: "Randburg — Ferndale",
    ward: "Ward 88",
    category: "Street Lighting",
    lat: -26.0947,
    lng: 27.9856,
    requestCount: 61,
    severity: "low",
    trend: "stable",
    trendPct: 1,
    confidenceScore: 71,
    aiRecommendation:
      "Low volume but flagged by Safety & Security as a night-crime corridor. Recommend folding into the next scheduled maintenance sweep rather than an emergency callout — no evidence of a systemic fault, mostly isolated bulb failures.",
    evidence: [
      { label: "Requests (7d)", value: "61" },
      { label: "Avg. resolution SLA", value: "12 days (target: 10)" },
      { label: "Cross-flagged safety reports", value: "4" },
      { label: "Faulty poles identified", value: "7" },
    ],
    citizenQuotes: [
      {
        original: "I don't feel safe walking from the bus stop after 7pm, it's pitch dark.",
        translated: "I don't feel safe walking from the bus stop after 7pm, it's pitch dark.",
        language: "English",
        sentiment: "negative",
      },
    ],
  },
  {
    id: "hex-3a71e",
    name: "Roodepoort — Florida Lake",
    ward: "Ward 76",
    category: "Storm Drainage",
    lat: -26.1738,
    lng: 27.9089,
    requestCount: 43,
    severity: "low",
    trend: "down",
    trendPct: 6,
    confidenceScore: 68,
    aiRecommendation:
      "Reports spike only during heavy-rain events and have declined since the culvert clearance in the prior cycle. Recommend closing this cell and rechecking after the next storm rather than dispatching a crew now.",
    evidence: [
      { label: "Requests (7d)", value: "43" },
      { label: "Avg. resolution SLA", value: "5 days (target: 7)" },
      { label: "Rain-correlated reports", value: "91%" },
      { label: "Last culvert clearance", value: "18 days ago" },
    ],
    citizenQuotes: [
      {
        original: "A rua inunda toda vez que chove forte, mas secou rápido desta vez.",
        translated: "The street floods every time it rains hard, but it dried up quickly this time.",
        language: "Portuguese",
        sentiment: "neutral",
      },
    ],
  },
];

export const totalRequests = mockHotspots.reduce(
  (sum, h) => sum + h.requestCount,
  0
);

export const activeHotspotCount = mockHotspots.length;

export const criticalCount = mockHotspots.filter(
  (h) => h.severity === "critical"
).length;
