"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BALLS } from "../lib/data";
import { BALLS_2024 } from "../lib/data2024";
import { BALLS_2025 } from "../lib/data2025";
import { BALLS_MGS2025 } from "../lib/dataMgs2025";
import { WEDGE_WET_DRY } from "../lib/dataWedgeWetDry";
import { BALLS_BALL_ADDICT, CONDITIONS_BALL_ADDICT } from "../lib/dataBallAddict";

function colorsFor(balls) {
  const n = balls.length;
  return Object.fromEntries(
    balls.map((b, i) => [b.name, `hsl(${Math.round((i * 360) / n)}, 70%, 58%)`])
  );
}

const SOURCES = [
  {
    id: "mygolfspy",
    label: "2026 MyGolfSpy",
    balls: BALLS,
    conditions: [
      { key: "Driver Fast", label: "Driver Fast" },
      { key: "Driver Mid", label: "Driver Mid" },
      { key: "7 Iron Fast", label: "7 Iron Fast" },
      { key: "7 Iron Mid", label: "7 Iron Mid" },
      { key: "Wedge Full (Dry)", label: "Full Wedge" },
      { key: "Wedge 35", label: "Wedge 35 yd" },
    ],
    defaultCondition: "Driver Fast",
    panels: [
      {
        type: "circle",
        key: "footprint",
        label: "Footprint Area",
        unit: "(yd², circle area to scale)",
        digits: 1,
        valueSuffix: " yd²",
      },
      {
        type: "errorline",
        key: "spray",
        label: "Side Spray",
        unit: "(± yd)",
        valueSuffix: " yd",
      },
      {
        type: "errorline",
        key: "range",
        label: "Distance Range",
        unit: "(± yd)",
        valueSuffix: " yd",
      },
      { type: "bar", key: "speed", label: "Ball Speed", unit: "(mph)", digits: 1, suffix: " mph" },
      { type: "bar", key: "carry", label: "Carry", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "total", label: "Total Distance", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "spin", label: "Spin", unit: "(rpm)", digits: 0, suffix: " rpm" },
      { type: "bar", key: "launch", label: "Launch Angle", unit: "(°)", digits: 1, suffix: "°" },
    ],
    ballLevelBars: [
      {
        key: "compression",
        label: "Compression",
        unit: "(does not change with condition)",
        maxValue: 120,
        digits: 0,
        suffix: "",
      },
    ],
    wedgeWetDryCondition: "Wedge Full (Dry)",
    wedgeWetDryData: WEDGE_WET_DRY,
    wedgeWetDryPanels: [
      { key: "carry", label: "Carry", unit: "(yd)", digits: 1, suffix: " yd" },
      { key: "total", label: "Total Distance", unit: "(yd)", digits: 1, suffix: " yd" },
      { key: "speed", label: "Ball Speed", unit: "(mph)", digits: 1, suffix: " mph" },
      { key: "spin", label: "Spin", unit: "(rpm)", digits: 0, suffix: " rpm" },
      { key: "footprint", label: "Footprint Area", unit: "(yd²)", digits: 1, suffix: " yd²" },
      { key: "spray", label: "Side Spray", unit: "(yd)", digits: 2, suffix: " yd" },
      { key: "range", label: "Distance Range", unit: "(yd)", digits: 2, suffix: " yd" },
    ],
    footerNote: "Data: MyGolfSpy 2026 Ball Test — dispersion, compression & launch angle.",
  },
  {
    id: "todaysgolfer2024",
    label: "2024 Today's Golfer",
    balls: BALLS_2024,
    conditions: [
      { key: "Driver 115mph", label: "Driver 115 mph" },
      { key: "Driver 100mph", label: "Driver 100 mph" },
      { key: "Driver 85mph", label: "Driver 85 mph" },
      { key: "7-Iron ~85mph", label: "7-Iron ~85 mph" },
      { key: "Wedge 74mph", label: "Wedge 74 mph" },
    ],
    defaultCondition: "Driver 115mph",
    panels: [
      {
        type: "circle",
        key: "footprint",
        label: "Shot Area",
        unit: "(yd², circle area to scale)",
        digits: 1,
        valueSuffix: " yd²",
      },
      { type: "bar", key: "speed", label: "Ball Speed", unit: "(mph)", digits: 1, suffix: " mph" },
      { type: "bar", key: "carry", label: "Carry", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "spin", label: "Backspin", unit: "(rpm)", digits: 0, suffix: " rpm" },
      { type: "bar", key: "launch", label: "Launch Angle", unit: "(°)", digits: 1, suffix: "°" },
      { type: "bar", key: "descent", label: "Descent Angle", unit: "(°)", digits: 1, suffix: "°" },
      { type: "bar", key: "height", label: "Apex Height", unit: "(yd)", digits: 1, suffix: " yd" },
      {
        type: "errorline",
        key: "spray",
        label: "L-R Dispersion",
        unit: "(± yd — only measured on the wedge shot)",
        valueSuffix: " yd",
      },
    ],
    ballLevelBars: [],
    footerNote:
      "Data: Today's Golfer 2024 Robot Test — 24 balls, driver (85/100/115mph), 7-iron (~85mph) & pitching wedge (74mph).",
  },
  {
    id: "todaysgolfer2025",
    label: "2025 Today's Golfer",
    balls: BALLS_2025,
    conditions: [
      { key: "Driver114", label: "Driver 114 mph" },
      { key: "Driver93", label: "Driver 93 mph" },
      { key: "Driver78", label: "Driver 78 mph" },
      { key: "Iron80", label: "7-Iron 80 mph" },
      { key: "Wedge46", label: "Wedge 46 mph" },
    ],
    defaultCondition: "Driver114",
    panels: [
      { type: "bar", key: "carry", label: "Carry", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "speed", label: "Ball Speed", unit: "(mph)", digits: 1, suffix: " mph" },
      { type: "bar", key: "spin", label: "Backspin", unit: "(rpm)", digits: 0, suffix: " rpm" },
      { type: "bar", key: "launch", label: "Launch Angle", unit: "(°)", digits: 1, suffix: "°" },
      { type: "bar", key: "descent", label: "Descent Angle", unit: "(°)", digits: 1, suffix: "°" },
      { type: "bar", key: "height", label: "Apex Height", unit: "(yd)", digits: 1, suffix: " yd" },
    ],
    ballLevelBars: [
      {
        key: "compression",
        label: "Compression",
        unit: "(does not change with condition)",
        maxValue: 120,
        digits: 0,
        suffix: "",
      },
      {
        key: "compression_sd",
        label: "Compression Consistency (± SD)",
        unit: "(lower = more consistent manufacturing, does not change with condition)",
        maxValue: 8,
        digits: 1,
        suffix: "",
      },
    ],
    footerNote:
      "Data: Today's Golfer 2025 Robot Test — 62 balls, driver (78/93/114mph), 7-iron (80mph) & wedge (46mph). Carry/ball speed not measured on the wedge shot.",
  },
  {
    id: "mygolfspy2025",
    label: "2025 MyGolfSpy",
    balls: BALLS_MGS2025,
    conditions: [
      { key: "Driver Fast", label: "Driver Fast" },
      { key: "Driver Mid", label: "Driver Mid" },
      { key: "Driver Slow", label: "Driver Slow" },
      { key: "Mid Iron Fast", label: "Mid Iron Fast" },
      { key: "Mid Iron Mid", label: "Mid Iron Mid" },
      { key: "Mid Iron Slow", label: "Mid Iron Slow" },
      { key: "Wedge 35", label: "Wedge 35 yd" },
    ],
    defaultCondition: "Driver Fast",
    panels: [
      { type: "bar", key: "carry", label: "Carry", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "total", label: "Total Distance", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "speed", label: "Ball Speed", unit: "(mph)", digits: 1, suffix: " mph" },
      { type: "bar", key: "spin", label: "Spin", unit: "(rpm)", digits: 0, suffix: " rpm" },
      { type: "bar", key: "launch", label: "Launch Angle", unit: "(°)", digits: 1, suffix: "°" },
      { type: "bar", key: "descent", label: "Descent Angle", unit: "(°)", digits: 1, suffix: "°" },
      { type: "bar", key: "height", label: "Max Height", unit: "(ft)", digits: 1, suffix: " ft" },
      {
        type: "bar",
        key: "spinaxis",
        label: "Spin Axis",
        unit: "(° — negative = left, positive = right)",
        digits: 2,
        suffix: "°",
        signed: true,
      },
    ],
    ballLevelBars: [],
    footerNote:
      "Data: MyGolfSpy 2025 Ball Test (corrected/complete dataset) — single-shot driver/mid-iron/wedge results, 44 balls; coverage still varies slightly by ball/condition since not every ball was hit under every condition in the original test.",
  },
  {
    id: "balladdict",
    label: "Ball Addict",
    balls: BALLS_BALL_ADDICT,
    conditions: CONDITIONS_BALL_ADDICT.map((c) => ({ key: c, label: c })),
    defaultCondition: "Driver",
    panels: [
      { type: "bar", key: "carry", label: "Carry", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "total", label: "Total Distance", unit: "(yd)", digits: 1, suffix: " yd" },
      { type: "bar", key: "speed", label: "Ball Speed", unit: "(mph)", digits: 1, suffix: " mph" },
      { type: "bar", key: "spin", label: "Spin", unit: "(rpm)", digits: 0, suffix: " rpm" },
      { type: "bar", key: "smash", label: "Smash Factor", unit: "", digits: 2, suffix: "" },
      { type: "bar", key: "launch", label: "Launch Angle", unit: "(°)", digits: 1, suffix: "°" },
    ],
    ballLevelBars: [
      {
        key: "compression",
        label: "Compression",
        unit: "(does not change with condition)",
        maxValue: 120,
        digits: 0,
        suffix: "",
      },
      {
        key: "dimples",
        label: "Dimples",
        unit: "(2026-sheet balls only)",
        maxValue: 450,
        digits: 0,
        suffix: "",
      },
      {
        key: "accuracy",
        label: "Accuracy",
        unit: "(/10 — normalized; 2025-sheet balls originally rated as a %)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "consistency",
        label: "Consistency",
        unit: "(/10)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "durability",
        label: "Durability",
        unit: "(/10)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "forgiveness",
        label: "Forgiveness",
        unit: "(/10)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "feel",
        label: "Feel",
        unit: "(/10 — 2025-sheet balls only)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "missHitFeel",
        label: "Miss-Hit Feel",
        unit: "(/10 — 2025-sheet balls only)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "value",
        label: "Value",
        unit: "(/10 — 2025-sheet balls only)",
        maxValue: 10,
        digits: 1,
        suffix: "",
      },
      {
        key: "greenSpin",
        label: "Green Spin",
        unit: "(rpm — 2025-sheet balls only)",
        maxValue: 9000,
        digits: 0,
        suffix: " rpm",
      },
      {
        key: "price",
        label: "Price",
        unit: "($ — 2026-sheet balls only, approx., parsed from listed price)",
        maxValue: 120,
        digits: 0,
        suffix: "",
      },
    ],
    footerNote:
      "Data: combined & cleaned 2026 + 2025 ball data — 133 balls after removing 2025 duplicates already covered by the 2026 sheet and any ball/brand not found on the official USGA Conforming Golf Ball List. Coverage varies by ball/condition since the two source sheets used different club sets (2026: chipping/pitch/9-iron/7-iron/4H/driver; 2025: 50yd/PW/7-iron/driver).",
  },
];

const SOURCE_COLORS = Object.fromEntries(SOURCES.map((s) => [s.id, colorsFor(s.balls)]));

// Two synthetic "Average" entries can be appended to every chart:
//  - "Average of selected" (diagonal black/white stripes) — the average of just the
//    balls you've currently picked, shown once you've selected more than a handful.
//  - "Average (all N balls)" (black/white polka-dots) — the average across the ENTIRE
//    dataset for this tab/condition, always shown so you always have the field average
//    to compare against, even with only one ball selected.
const AVERAGE_THRESHOLD = 5;

// Bulletproof SVG data-URI tile (not a CSS gradient) so the black/white polka-dot
// pattern renders identically and boldly everywhere, instead of a subtle/near-invisible
// gradient checker.
const GLOBAL_AVERAGE_CSS =
  "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCI+PHJlY3Qgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiBmaWxsPSIjMGEwYTBhIi8+PGNpcmNsZSBjeD0iMy41IiBjeT0iMy41IiByPSIzIiBmaWxsPSIjZjJmMmYyIi8+PGNpcmNsZSBjeD0iMTAuNSIgY3k9IjEwLjUiIHI9IjMiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4=) 0 0/14px 14px repeat";
const GROUP_AVERAGE_CSS =
  "repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 6px, #f2f2f2 6px, #f2f2f2 12px)";

function average(values) {
  const nums = values.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function buildAverageEntry(items, excludeKeys, name, color, avgKind) {
  const keys = new Set();
  items.forEach((it) =>
    Object.keys(it).forEach((k) => {
      if (!excludeKeys.includes(k)) keys.add(k);
    })
  );
  const avgEntry = { name, color, isAverage: true, avgKind };
  keys.forEach((k) => {
    avgEntry[k] = average(items.map((it) => it[k]));
  });
  return avgEntry;
}

// `selectedItems` are shown as normal bars/points. `allItems` is the FULL ball
// population for this dataset/condition, used for the always-on global average.
// A second "average of selected" entry is added on top of that once more than
// AVERAGE_THRESHOLD balls are selected.
function withAverages(selectedItems, allItems, excludeKeys) {
  const out = [...selectedItems];
  if (selectedItems.length > AVERAGE_THRESHOLD) {
    out.push(
      buildAverageEntry(
        selectedItems,
        excludeKeys,
        `Average of selected (${selectedItems.length})`,
        GROUP_AVERAGE_CSS,
        "group"
      )
    );
  }
  if (allItems.length) {
    out.push(
      buildAverageEntry(allItems, excludeKeys, `Average (all ${allItems.length} balls)`, GLOBAL_AVERAGE_CSS, "global")
    );
  }
  return out;
}

// Builds a plain-text summary of exactly what's currently on screen (tab, condition,
// selected balls and their stats) so the chat assistant answers from the same data
// the user is looking at, instead of guessing.
function buildBallContext(activeSource, condition, selectedBalls) {
  if (!selectedBalls || selectedBalls.length === 0) {
    return `Tab: ${activeSource.label}\nNo balls are currently selected.`;
  }

  const lines = [];
  lines.push(`Tab: ${activeSource.label}`);
  lines.push(`Current condition: ${condition}`);
  lines.push(`Selected balls (${selectedBalls.length}):`);

  selectedBalls.forEach((b) => {
    const coverText = coverLabel(b.cover) || b.cover || "unknown";
    const condVals = b.conditions ? b.conditions[condition] : null;
    const metricParts = (activeSource.panels || [])
      .map((p) => {
        const v = condVals ? condVals[p.key] : undefined;
        if (v === null || v === undefined) return null;
        return `${p.label} ${fmt(v, p.digits ?? 1)}${p.suffix || ""}`;
      })
      .filter(Boolean);
    const ballLevelParts = (activeSource.ballLevelBars || [])
      .map((bl) => {
        const v = b[bl.key];
        if (v === null || v === undefined) return null;
        return `${bl.label} ${fmt(v, bl.digits ?? 1)}${bl.suffix || ""}`;
      })
      .filter(Boolean);
    lines.push(
      `- ${b.name} (cover: ${coverText})${metricParts.length ? "; " + metricParts.join(", ") : ""}${
        ballLevelParts.length ? "; " + ballLevelParts.join(", ") : ""
      }`
    );
  });

  if (activeSource.wedgeWetDryData && condition === activeSource.wedgeWetDryCondition) {
    lines.push("Wedge Full wet-vs-dry data for selected balls:");
    selectedBalls.forEach((b) => {
      const entry = activeSource.wedgeWetDryData[b.name];
      if (!entry) return;
      const dryParts = entry.dry
        ? Object.entries(entry.dry)
            .map(([k, v]) => (v == null ? null : `${k} ${fmt(v, 1)} (dry)`))
            .filter(Boolean)
        : [];
      const wetParts = entry.wet
        ? Object.entries(entry.wet)
            .map(([k, v]) => (v == null ? null : `${k} ${fmt(v, 1)} (wet)`))
            .filter(Boolean)
        : [];
      lines.push(`- ${b.name}: ${[...dryParts, ...wetParts].join(", ")}`);
    });
  }

  return lines.join("\n");
}

function fmt(v, digits = 2) {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return v.toFixed(digits);
}

// Normalizes a ball's cover-material string down to "Urethane" or "Ionomer"
// for the small caption shown under each ball on spin panels. Surlyn (incl.
// "Du Pont Surlyn") is an ionomer resin, so it's grouped under Ionomer.
// Returns null when the material isn't known/recognized, so nothing renders.
function coverLabel(cover) {
  if (!cover) return null;
  const c = cover.toLowerCase();
  if (c.includes("urethane")) return "Urethane";
  if (c.includes("ionomer") || c.includes("surlyn")) return "Ionomer";
  return null;
}

// Slight color tint for the ball-name text on Driver Carry/Total Distance panels:
// a touch of blue for Urethane covers, a touch of red for Ionomer covers.
function coverNameColor(cover) {
  const label = coverLabel(cover);
  if (label === "Urethane") return "#a9c6f5";
  if (label === "Ionomer") return "#f2a9a9";
  return null;
}

function sortByKey(arr, key, dir) {
  if (!dir) return arr;
  const copy = [...arr];
  copy.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return dir === "asc" ? av - bv : bv - av;
  });
  return copy;
}

function ScatterPlot({ availableFields, data }) {
  const [xKey, setXKey] = useState(availableFields[0]?.key || "");
  const [yKey, setYKey] = useState(availableFields[1]?.key || availableFields[0]?.key || "");
  const [hover, setHover] = useState(null);

  const xField = availableFields.find((f) => f.key === xKey) || availableFields[0];
  const yField = availableFields.find((f) => f.key === yKey) || availableFields[0];

  const points = data
    .filter((d) => !d.isAverage)
    .map((d) => ({ name: d.name, color: d.color, x: d[xKey], y: d[yKey] }))
    .filter(
      (p) => p.x !== null && p.x !== undefined && p.y !== null && p.y !== undefined && !Number.isNaN(p.x) && !Number.isNaN(p.y)
    );

  const W = 900;
  const H = 540;
  const PAD = 54;

  let body;
  if (points.length === 0) {
    body = (
      <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
        Select balls with data for both axes to see a scatter plot.
      </p>
    );
  } else {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    let xMin = Math.min(...xs);
    let xMax = Math.max(...xs);
    let yMin = Math.min(...ys);
    let yMax = Math.max(...ys);
    if (xMin === xMax) {
      xMin -= 1;
      xMax += 1;
    }
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
    const xPad = (xMax - xMin) * 0.12;
    const yPad = (yMax - yMin) * 0.12;
    xMin -= xPad;
    xMax += xPad;
    yMin -= yPad;
    yMax += yPad;

    const toPx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
    const toPy = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

    const TICK_COUNT = 5;
    const xTicks = Array.from({ length: TICK_COUNT }, (_, i) => xMin + ((xMax - xMin) * i) / (TICK_COUNT - 1));
    const yTicks = Array.from({ length: TICK_COUNT }, (_, i) => yMin + ((yMax - yMin) * i) / (TICK_COUNT - 1));

    const meanX = xs.reduce((a, v) => a + v, 0) / xs.length;
    const meanY = ys.reduce((a, v) => a + v, 0) / ys.length;
    const midPx = toPx(meanX);
    const midPy = toPy(meanY);
    const plotL = PAD;
    const plotR = W - PAD;
    const plotT = PAD;
    const plotB = H - PAD;

    body = (
      <>
        <div style={styles.scatterSvgWrap}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            {/* quadrant background shading, split at the average of each axis */}
            <rect x={plotL} y={plotT} width={midPx - plotL} height={midPy - plotT} fill="#3b82f6" fillOpacity="0.06" />
            <rect x={midPx} y={plotT} width={plotR - midPx} height={midPy - plotT} fill="#22c55e" fillOpacity="0.06" />
            <rect x={plotL} y={midPy} width={midPx - plotL} height={plotB - midPy} fill="#eab308" fillOpacity="0.06" />
            <rect x={midPx} y={midPy} width={plotR - midPx} height={plotB - midPy} fill="#ef4444" fillOpacity="0.06" />

            <line x1={plotL} y1={plotB} x2={plotR} y2={plotB} stroke="#3a3a3a" strokeWidth="1" />
            <line x1={plotL} y1={plotT} x2={plotL} y2={plotB} stroke="#3a3a3a" strokeWidth="1" />

            {/* quadrant crosshair at the average value of each axis */}
            <line x1={midPx} y1={plotT} x2={midPx} y2={plotB} stroke="#888" strokeWidth="1.25" strokeDasharray="5 4" />
            <line x1={plotL} y1={midPy} x2={plotR} y2={midPy} stroke="#888" strokeWidth="1.25" strokeDasharray="5 4" />
            <text x={midPx} y={plotT - 8} textAnchor="middle" fontSize="10" fill="#999">
              avg {fmt(meanX, xField?.digits ?? 1)}
              {xField?.suffix || ""}
            </text>
            <text x={plotL - 9} y={midPy - 6} textAnchor="end" fontSize="10" fill="#999">
              avg {fmt(meanY, yField?.digits ?? 1)}
              {yField?.suffix || ""}
            </text>

            {/* quadrant corner labels */}
            <text x={plotL + 8} y={plotT + 16} fontSize="10.5" fill="#5b9bd5" fontWeight="600">
              Low {xField?.label} / High {yField?.label}
            </text>
            <text x={plotR - 8} y={plotT + 16} textAnchor="end" fontSize="10.5" fill="#4ade80" fontWeight="600">
              High {xField?.label} / High {yField?.label}
            </text>
            <text x={plotL + 8} y={plotB - 8} fontSize="10.5" fill="#facc15" fontWeight="600">
              Low {xField?.label} / Low {yField?.label}
            </text>
            <text x={plotR - 8} y={plotB - 8} textAnchor="end" fontSize="10.5" fill="#f87171" fontWeight="600">
              High {xField?.label} / Low {yField?.label}
            </text>

            {xTicks.map((tv, i) => (
              <g key={`xt-${i}`}>
                <line x1={toPx(tv)} y1={H - PAD} x2={toPx(tv)} y2={H - PAD + 5} stroke="#3a3a3a" strokeWidth="1" />
                <text x={toPx(tv)} y={H - PAD + 18} textAnchor="middle" fontSize="10.5" fill="#888">
                  {fmt(tv, xField?.digits ?? 1)}
                  {xField?.suffix || ""}
                </text>
              </g>
            ))}
            {yTicks.map((tv, i) => (
              <g key={`yt-${i}`}>
                <line x1={PAD - 5} y1={toPy(tv)} x2={PAD} y2={toPy(tv)} stroke="#3a3a3a" strokeWidth="1" />
                <text x={PAD - 9} y={toPy(tv) + 3.5} textAnchor="end" fontSize="10.5" fill="#888">
                  {fmt(tv, yField?.digits ?? 1)}
                  {yField?.suffix || ""}
                </text>
              </g>
            ))}
            {points.map((p) => {
              const isHover = hover?.name === p.name;
              return (
                <circle
                  key={p.name}
                  cx={toPx(p.x)}
                  cy={toPy(p.y)}
                  r={isHover ? 9 : 6}
                  fill={p.color}
                  stroke={isHover ? "#fff" : "#111"}
                  strokeWidth={isHover ? 2 : 1.5}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHover({ name: p.name, x: p.x, y: p.y, px: toPx(p.x), py: toPy(p.y) })}
                  onMouseLeave={() => setHover((h) => (h?.name === p.name ? null : h))}
                />
              );
            })}
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="13" fill="#999">
              {xField?.label}
              {xField?.suffix}
            </text>
            <text x={14} y={H / 2} textAnchor="middle" fontSize="13" fill="#999" transform={`rotate(-90 14 ${H / 2})`}>
              {yField?.label}
              {yField?.suffix}
            </text>
            {hover &&
              (() => {
                const label = `${hover.name}`;
                const sub = `${xField?.label}: ${fmt(hover.x, xField?.digits ?? 1)}${xField?.suffix || ""}   ${yField?.label}: ${fmt(
                  hover.y,
                  yField?.digits ?? 1
                )}${yField?.suffix || ""}`;
                const boxW = Math.max(label.length, sub.length) * 6.6 + 20;
                const boxH = 44;
                let bx = hover.px - boxW / 2;
                let by = hover.py - boxH - 14;
                bx = Math.max(4, Math.min(W - boxW - 4, bx));
                if (by < 4) by = hover.py + 14;
                return (
                  <g pointerEvents="none">
                    <rect x={bx} y={by} width={boxW} height={boxH} rx={7} fill="#0f0f0f" stroke="#444" strokeWidth="1" />
                    <text x={bx + 10} y={by + 18} fontSize="12.5" fontWeight="700" fill="#fff">
                      {label}
                    </text>
                    <text x={bx + 10} y={by + 34} fontSize="11" fill="#aaa">
                      {sub}
                    </text>
                  </g>
                );
              })()}
          </svg>
        </div>
        <p style={styles.overlapHint}>
          Hover a point to see which ball it is instantly. Dashed crosshair = average of each axis, splitting the chart into 4 quadrants.
        </p>
        <div style={styles.overlapLegend}>
          {points.map((p) => (
            <div key={p.name} style={styles.overlapLegendItem}>
              <span style={{ ...styles.swatch, background: p.color, flex: "0 0 auto" }} />
              <span style={styles.overlapLegendName}>{p.name}</span>
              <span style={styles.overlapLegendValue}>
                {fmt(p.x, xField?.digits ?? 1)}
                {xField?.suffix || ""}, {fmt(p.y, yField?.digits ?? 1)}
                {yField?.suffix || ""}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeadRow}>
        <h2 style={styles.panelTitle}>
          Scatter Plot <span style={styles.unit}>(each ball plotted, split into 4 quadrants by axis averages)</span>
        </h2>
      </div>
      <div style={styles.scatterAxisRow}>
        <label style={styles.scatterAxisLabel}>
          X axis
          <select value={xKey} onChange={(e) => setXKey(e.target.value)} style={styles.scatterSelect}>
            {availableFields.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label style={styles.scatterAxisLabel}>
          Y axis
          <select value={yKey} onChange={(e) => setYKey(e.target.value)} style={styles.scatterSelect}>
            {availableFields.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {body}
    </section>
  );
}

function BallChat({ tabId, tabLabel, contextText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function send() {
    const question = input.trim();
    if (!question || loading) return;
    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context: contextText }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || `Request failed (${res.status}).`);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      }
    } catch (e) {
      setError(`Request failed: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeadRow}>
        <h2 style={styles.panelTitle}>
          Ask AI about {tabLabel} <span style={styles.unit}>(uses the balls/condition selected above)</span>
        </h2>
        {messages.length > 0 && (
          <button style={styles.smallBtn} onClick={() => setMessages([])}>
            Clear chat
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div style={styles.chatLog}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={m.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAssistant}
            >
              <strong style={styles.chatRoleLabel}>{m.role === "user" ? "You" : "AI"}</strong>
              <div style={styles.chatBubbleText}>{m.content}</div>
            </div>
          ))}
          {loading && <div style={styles.chatThinking}>AI is thinking…</div>}
        </div>
      )}

      {error && <p style={styles.chatError}>{error}</p>}

      <div style={styles.chatInputRow}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={'Ask about the balls selected above, e.g. which of these spins the least off the driver?'}
          style={styles.chatInput}
          rows={2}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            ...styles.smallBtn,
            ...(loading || !input.trim() ? styles.smallBtnDisabled : {}),
          }}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </section>
  );
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={styles.scrollTopBtn}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      ↑ Top
    </button>
  );
}

function SortButton({ dir, onClick, label }) {
  const text = dir === "desc" ? "High → Low" : dir === "asc" ? "Low → High" : "Sort";
  const arrow = dir === "desc" ? "↓" : dir === "asc" ? "↑" : "↕";
  return (
    <button onClick={onClick} style={styles.sortBtn} title={`Sort by ${label}`}>
      {arrow} {text}
    </button>
  );
}

const STORAGE_KEY = "ballz.appstate.v2";

export default function Home() {
  const [sourceId, setSourceId] = useState(SOURCES[0].id);
  const [selectedBySource, setSelectedBySource] = useState({});
  const [conditionBySource, setConditionBySource] = useState({});
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [overlapCircles, setOverlapCircles] = useState(false);
  const [circleAsBar, setCircleAsBar] = useState(true); // bars are the default view for "circle" panels
  const [sortDir, setSortDir] = useState({
    wetdry_carry: "desc",
    wetdry_total: "desc",
    wetdry_speed: "desc",
    wetdry_spin: "desc",
    wetdry_footprint: "desc",
    wetdry_spray: "desc",
    wetdry_range: "desc",
  });

  // Load saved state from localStorage once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.sourceId) setSourceId(saved.sourceId);
        if (saved.selectedBySource) {
          const rebuilt = {};
          for (const [k, names] of Object.entries(saved.selectedBySource)) {
            rebuilt[k] = new Set(names);
          }
          setSelectedBySource(rebuilt);
        }
        if (saved.conditionBySource) setConditionBySource(saved.conditionBySource);
      }
    } catch (e) {
      // localStorage unavailable (private mode, etc.) - just skip persistence
    }
    setHydrated(true);
  }, []);

  // Persist state after the initial load, so refreshing keeps your picks.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const selectedPlain = {};
      for (const [k, set] of Object.entries(selectedBySource)) {
        selectedPlain[k] = Array.from(set);
      }
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sourceId, selectedBySource: selectedPlain, conditionBySource })
      );
    } catch (e) {}
  }, [sourceId, selectedBySource, conditionBySource, hydrated]);

  // Every sortable column defaults to High -> Low until the user explicitly changes it.
  function getDir(key) {
    return key in sortDir ? sortDir[key] : "desc";
  }

  function cycleSort(key) {
    setSortDir((prev) => {
      const cur = key in prev ? prev[key] : "desc";
      const next = cur === "desc" ? "asc" : cur === "asc" ? null : "desc";
      return { ...prev, [key]: next };
    });
  }

  const activeSource = SOURCES.find((s) => s.id === sourceId) || SOURCES[0];
  const BALL_COLORS = SOURCE_COLORS[activeSource.id];
  const condition = conditionBySource[activeSource.id] || activeSource.defaultCondition;
  const selected = selectedBySource[activeSource.id] || new Set();

  function setCondition(key) {
    setConditionBySource((prev) => ({ ...prev, [activeSource.id]: key }));
  }

  function setSelected(updater) {
    setSelectedBySource((prev) => {
      const cur = prev[activeSource.id] || new Set();
      const next = typeof updater === "function" ? updater(cur) : updater;
      return { ...prev, [activeSource.id]: next };
    });
  }

  const selectedBalls = useMemo(
    () => activeSource.balls.filter((b) => selected.has(b.name)),
    [selected, activeSource]
  );

  const filteredBalls = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeSource.balls;
    return activeSource.balls.filter((b) => b.name.toLowerCase().includes(q));
  }, [search, activeSource]);

  function toggleBall(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(activeSource.balls.map((b) => b.name)));
  }
  function clearAll() {
    setSelected(new Set());
  }

  // ---- shared scales for the current condition, based on selected balls ----
  const condDataRaw = selectedBalls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    meta: b.meta,
    compression: b.compression,
    cover: b.cover,
    ...b.conditions[condition],
  }));
  const condDataAllRaw = activeSource.balls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    meta: b.meta,
    compression: b.compression,
    cover: b.cover,
    ...b.conditions[condition],
  }));
  const condData = withAverages(condDataRaw, condDataAllRaw, ["name", "color", "meta", "isAverage"]);

  const CIRCLE_MAX_RADIUS = 70; // px, for the largest footprint among selected
  const LINE_MAX_HALF = 220; // px, half-width for the largest spray/range among selected

  const ballLevelDataRaw = selectedBalls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    cover: b.cover,
    ...Object.fromEntries((activeSource.ballLevelBars || []).map((bl) => [bl.key, b[bl.key]])),
  }));
  const ballLevelDataAllRaw = activeSource.balls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    cover: b.cover,
    ...Object.fromEntries((activeSource.ballLevelBars || []).map((bl) => [bl.key, b[bl.key]])),
  }));
  const ballLevelData = withAverages(ballLevelDataRaw, ballLevelDataAllRaw, ["name", "color", "isAverage"]);

  // Fields available to plot on the scatter chart: every condition-panel metric
  // plus every ball-level (condition-independent) metric, deduped by key.
  const scatterFields = [];
  (activeSource.panels || []).forEach((p) => {
    scatterFields.push({
      key: p.key,
      label: p.label,
      digits: p.digits ?? 1,
      suffix: p.suffix || p.valueSuffix || "",
    });
  });
  (activeSource.ballLevelBars || []).forEach((bl) => {
    if (scatterFields.some((f) => f.key === bl.key)) return;
    scatterFields.push({
      key: bl.key,
      label: bl.label,
      digits: bl.digits ?? 1,
      suffix: bl.suffix || "",
    });
  });
  const scatterData = selectedBalls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    ...(b.conditions ? b.conditions[condition] : {}),
    ...Object.fromEntries((activeSource.ballLevelBars || []).map((bl) => [bl.key, b[bl.key]])),
  }));

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>⛳ Ball Test Explorer</h1>
        <p style={styles.subtitle}>
          Select balls, switch conditions, compare footprint, dispersion, curve, and compression.
        </p>
      </header>

      <section style={styles.sourceTabs}>
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSourceId(s.id)}
            style={{
              ...styles.sourceTabBtn,
              ...(activeSource.id === s.id ? styles.sourceTabBtnActive : {}),
            }}
          >
            {s.label}
          </button>
        ))}
      </section>

      <section style={styles.tabs}>
        {activeSource.conditions.map((t) => (
          <button
            key={t.key}
            onClick={() => setCondition(t.key)}
            style={{
              ...styles.tabBtn,
              ...(condition === t.key ? styles.tabBtnActive : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeadRow}>
          <h2 style={styles.panelTitle}>
            Balls ({selected.size} selected of {activeSource.balls.length})
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.smallBtn} onClick={selectAll}>
              Select all
            </button>
            <button style={styles.smallBtn} onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>
        <input
          placeholder="Search balls…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <div style={styles.ballGrid}>
          {filteredBalls.map((b) => {
            const isOn = selected.has(b.name);
            return (
              <label
                key={b.name}
                style={{
                  ...styles.ballItem,
                  ...(isOn ? styles.ballItemOn : {}),
                }}
              >
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => toggleBall(b.name)}
                  style={{ marginRight: 8 }}
                />
                <span style={{ ...styles.swatch, background: BALL_COLORS[b.name] }} />
                <span style={styles.ballTextWrap}>
                  <span style={styles.ballName}>{b.name}</span>
                  {b.meta && <span style={styles.ballMeta}>{b.meta}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <BallChat
        key={activeSource.id}
        tabId={activeSource.id}
        tabLabel={activeSource.label}
        contextText={buildBallContext(activeSource, condition, selectedBalls)}
      />

      <ScatterPlot key={activeSource.id + "-scatter"} availableFields={scatterFields} data={scatterData} />

      {selectedBalls.length === 0 ? (
        <section style={styles.panel}>
          <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
            Select one or more balls above to see charts.
          </p>
        </section>
      ) : (
        <>
          {activeSource.panels.map((panel) => {
            const dir = getDir(panel.key);
            const sorted = sortByKey(condData, panel.key, dir);

            if (panel.type === "circle") {
              const maxValue = Math.max(1, ...condData.map((d) => d[panel.key] || 0));
              return (
                <section style={styles.panel} key={panel.key}>
                  <div style={styles.panelHeadRow}>
                    <h2 style={styles.panelTitle}>
                      {panel.label} — {condition} <span style={styles.unit}>{panel.unit}</span>
                    </h2>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          ...styles.smallBtn,
                          ...(!circleAsBar ? styles.smallBtnActive : {}),
                        }}
                        onClick={() => setCircleAsBar((v) => !v)}
                      >
                        {circleAsBar ? "Show as circles" : "Show as bars"}
                      </button>
                      {!circleAsBar && (
                        <button
                          style={{
                            ...styles.smallBtn,
                            ...(overlapCircles ? styles.smallBtnActive : {}),
                          }}
                          onClick={() => setOverlapCircles((v) => !v)}
                        >
                          {overlapCircles ? "Show side-by-side" : "Overlap circles"}
                        </button>
                      )}
                      <SortButton dir={dir} onClick={() => cycleSort(panel.key)} label={panel.label} />
                    </div>
                  </div>
                  {circleAsBar ? (
                    <BarPanel
                      data={sorted}
                      valueKey={panel.key}
                      maxValue={maxValue}
                      digits={panel.digits ?? 1}
                      suffix={panel.valueSuffix || ""}
                      colorNameByCover
                    />
                  ) : overlapCircles ? (
                    <OverlapCircleChart
                      data={sorted}
                      valueKey={panel.key}
                      maxValue={maxValue}
                      digits={panel.digits ?? 1}
                      valueSuffix={panel.valueSuffix || ""}
                    />
                  ) : (
                    <div style={styles.circleRow}>
                      {sorted.map((d) => {
                        const val = d[panel.key];
                        const r = CIRCLE_MAX_RADIUS * Math.sqrt((val || 0) / maxValue);
                        const size = CIRCLE_MAX_RADIUS * 2 + 20;
                        const patId = `avgPat-${panel.key}-${d.avgKind}`;
                        return (
                          <div key={d.name} style={styles.circleCell}>
                            <div style={styles.circleSvgWrap}>
                              <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
                                {d.isAverage && <AverageStripeDefs id={patId} kind={d.avgKind} />}
                                <circle
                                  cx={size / 2}
                                  cy={size / 2}
                                  r={Math.max(r, 2)}
                                  fill={d.isAverage ? `url(#${patId})` : d.color}
                                  fillOpacity={d.isAverage ? 0.85 : 0.35}
                                  stroke={d.isAverage ? "#eee" : d.color}
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                            <div
                              style={
                                d.isAverage
                                  ? { ...styles.cellLabel, fontWeight: 700, fontStyle: "italic", color: "#eee" }
                                  : coverNameColor(d.cover)
                                  ? { ...styles.cellLabel, color: coverNameColor(d.cover) }
                                  : styles.cellLabel
                              }
                            >
                              {d.name}
                            </div>
                            <div style={styles.cellValue}>
                              {fmt(val, panel.digits ?? 1)}
                              {panel.valueSuffix || ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            }

            if (panel.type === "errorline") {
              const maxValue = Math.max(0.1, ...condData.map((d) => d[panel.key] || 0));
              return (
                <section style={styles.panel} key={panel.key}>
                  <div style={styles.panelHeadRow}>
                    <h2 style={styles.panelTitle}>
                      {panel.label} — {condition} <span style={styles.unit}>{panel.unit}</span>
                    </h2>
                    <SortButton dir={dir} onClick={() => cycleSort(panel.key)} label={panel.label} />
                  </div>
                  <ErrorLineChart
                    data={sorted}
                    valueKey={panel.key}
                    maxValue={maxValue}
                    maxHalfWidth={LINE_MAX_HALF}
                    suffix={panel.valueSuffix || ""}
                  />
                </section>
              );
            }

            // bar
            const maxValue = Math.max(
              1,
              ...condData.map((d) => (panel.signed ? Math.abs(d[panel.key] || 0) : d[panel.key] || 0))
            );
            const colorNameByCover = true;
            return (
              <section style={styles.panel} key={panel.key}>
                <div style={styles.panelHeadRow}>
                  <h2 style={styles.panelTitle}>
                    {panel.label} — {condition} <span style={styles.unit}>{panel.unit}</span>
                  </h2>
                  <SortButton dir={dir} onClick={() => cycleSort(panel.key)} label={panel.label} />
                </div>
                <p style={styles.coverInfoText}>
                  Ball name color: <span style={{ color: "#a9c6f5" }}>slightly blue = Urethane cover</span>,{" "}
                  <span style={{ color: "#f2a9a9" }}>slightly red = Ionomer cover</span>.
                </p>
                <BarPanel
                  data={sorted}
                  valueKey={panel.key}
                  maxValue={maxValue}
                  digits={panel.digits ?? 1}
                  suffix={panel.suffix || ""}
                  signed={!!panel.signed}
                  colorNameByCover={colorNameByCover}
                />
              </section>
            );
          })}
        </>
      )}

      {(activeSource.ballLevelBars || []).map((bl) => {
        const colorNameByCover = true;
        return (
          <section style={styles.panel} key={bl.key}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                {bl.label} <span style={styles.unit}>{bl.unit}</span>
              </h2>
              {selectedBalls.length > 0 && (
                <SortButton
                  dir={getDir(bl.key)}
                  onClick={() => cycleSort(bl.key)}
                  label={bl.label}
                />
              )}
            </div>
            {colorNameByCover && selectedBalls.length > 0 && (
              <p style={styles.coverInfoText}>
                Ball name color: <span style={{ color: "#a9c6f5" }}>slightly blue = Urethane cover</span>,{" "}
                <span style={{ color: "#f2a9a9" }}>slightly red = Ionomer cover</span>.
              </p>
            )}
            {selectedBalls.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
                Select balls to compare {bl.label.toLowerCase()}.
              </p>
            ) : (
              <BarPanel
                data={sortByKey(ballLevelData, bl.key, getDir(bl.key))}
                valueKey={bl.key}
                maxValue={bl.maxValue}
                digits={bl.digits}
                suffix={bl.suffix}
                colorNameByCover={colorNameByCover}
              />
            )}
          </section>
        );
      })}

      {activeSource.wedgeWetDryPanels &&
        selectedBalls.length > 0 &&
        condition === activeSource.wedgeWetDryCondition && (
        <>
          <h2 style={styles.sectionHeading}>Wedge Full — Wet vs Dry</h2>
          <div style={styles.rangeLegend}>
            <span>
              <span style={{ ...styles.rangeLegendDot, background: "#e6e6e6" }} />
              Dry
            </span>
            <span>
              <span style={{ ...styles.rangeLegendDot, background: "#3fc7ff" }} />
              Wet
            </span>
            <span>Shaded band = change from dry to wet.</span>
          </div>
          {activeSource.wedgeWetDryPanels.map((panel) => {
            const sortKey = `wetdry_${panel.key}`;
            const dir = getDir(sortKey);
            const wetDryEntry = (b) => {
              const entry = activeSource.wedgeWetDryData[b.name] || {};
              const dry = entry.dry ? entry.dry[panel.key] ?? null : null;
              const wet = entry.wet ? entry.wet[panel.key] ?? null : null;
              const delta = dry !== null && wet !== null ? Math.abs(wet - dry) : null;
              return {
                name: b.name,
                color: BALL_COLORS[b.name],
                cover: b.cover,
                dry,
                wet,
                sortval: delta,
              };
            };
            const rawBase = selectedBalls.map(wetDryEntry);
            const rawAllBase = activeSource.balls.map(wetDryEntry);
            const raw = withAverages(rawBase, rawAllBase, ["name", "color", "isAverage"]);
            const sorted = sortByKey(raw, "sortval", dir);
            const vals = raw.flatMap((d) => [d.dry, d.wet]).filter((v) => v !== null && v !== undefined);
            let domainMin = vals.length ? Math.min(...vals) : 0;
            let domainMax = vals.length ? Math.max(...vals) : 1;
            if (domainMin === domainMax) {
              domainMin -= 1;
              domainMax += 1;
            }
            const pad = (domainMax - domainMin) * 0.12;
            domainMin -= pad;
            domainMax = Math.max(domainMax + pad, 0.0001 + domainMin);
            return (
              <section style={styles.panel} key={sortKey}>
                <div style={styles.panelHeadRow}>
                  <h2 style={styles.panelTitle}>
                    {panel.label} — Wedge Full <span style={styles.unit}>{panel.unit}</span>
                  </h2>
                  <SortButton dir={dir} onClick={() => cycleSort(sortKey)} label={panel.label} />
                </div>
                <div style={styles.rangeScaleLabel}>
                  scale: {fmt(domainMin, panel.digits ?? 1)} – {fmt(domainMax, panel.digits ?? 1)}
                  {panel.suffix || ""}
                </div>
                <p style={styles.coverInfoText}>
                  Ball name color: <span style={{ color: "#a9c6f5" }}>slightly blue = Urethane cover</span>,{" "}
                  <span style={{ color: "#f2a9a9" }}>slightly red = Ionomer cover</span>.
                </p>
                <RangeBarChart
                  data={sorted}
                  domainMin={domainMin}
                  domainMax={domainMax}
                  digits={panel.digits ?? 1}
                  suffix={panel.suffix || ""}
                  colorNameByCover
                />
              </section>
            );
          })}
        </>
      )}

      <footer style={styles.footer}>{activeSource.footerNote}</footer>
      <ScrollToTopButton />
    </main>
  );
}

function ErrorLineChart({ data, valueKey, maxValue, maxHalfWidth, suffix = "" }) {
  return (
    <div style={styles.errorChart}>
      {data.map((d) => {
        const raw = d[valueKey];
        const hasVal = raw !== null && raw !== undefined;
        const v = hasVal ? raw : 0;
        const halfPx = maxHalfWidth * (v / maxValue);
        const patId = `avgPatLine-${valueKey}-${d.avgKind}`;
        const strokeColor = d.isAverage ? `url(#${patId})` : d.color;
        return (
          <div key={d.name} style={styles.errorRow}>
            <div
              style={
                d.isAverage
                  ? { ...styles.errorLabel, fontWeight: 700, fontStyle: "italic", color: "#eee" }
                  : coverNameColor(d.cover)
                  ? { ...styles.errorLabel, color: coverNameColor(d.cover) }
                  : styles.errorLabel
              }
            >
              {d.name}
            </div>
            <div style={styles.errorTrack}>
              <div style={styles.errorCenterLine} />
              <svg
                viewBox={`0 0 ${maxHalfWidth * 2 + 20} 24`}
                width="100%"
                height="24"
                preserveAspectRatio="none"
                style={{ display: "block" }}
              >
                {d.isAverage && <AverageStripeDefs id={patId} kind={d.avgKind} />}
                {hasVal && (
                  <>
                    <line
                      x1={maxHalfWidth + 10 - halfPx}
                      y1="12"
                      x2={maxHalfWidth + 10 + halfPx}
                      y2="12"
                      stroke={strokeColor}
                      strokeWidth="3"
                    />
                    <line
                      x1={maxHalfWidth + 10 - halfPx}
                      y1="4"
                      x2={maxHalfWidth + 10 - halfPx}
                      y2="20"
                      stroke={strokeColor}
                      strokeWidth="3"
                    />
                    <line
                      x1={maxHalfWidth + 10 + halfPx}
                      y1="4"
                      x2={maxHalfWidth + 10 + halfPx}
                      y2="20"
                      stroke={strokeColor}
                      strokeWidth="3"
                    />
                  </>
                )}
                <circle cx={maxHalfWidth + 10} cy="12" r="2" fill="#666" />
              </svg>
            </div>
            <div style={styles.errorValue}>{hasVal ? `± ${fmt(v, 2)}${suffix}` : "n/a"}</div>
          </div>
        );
      })}
    </div>
  );
}

// Renders the right black/white SVG pattern for an average entry: diagonal stripes
// for "average of selected", polka dots for the always-on "average of all balls".
function AverageStripeDefs({ id, kind }) {
  if (kind === "group") {
    return (
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#0a0a0a" />
          <rect width="4" height="8" fill="#f2f2f2" />
        </pattern>
      </defs>
    );
  }
  return (
    <defs>
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#0a0a0a" />
        <circle cx="3.5" cy="3.5" r="3" fill="#f2f2f2" />
        <circle cx="10.5" cy="10.5" r="3" fill="#f2f2f2" />
      </pattern>
    </defs>
  );
}

function OverlapCircleChart({ data, valueKey, maxValue, digits = 1, valueSuffix = "" }) {
  const MAX_R = 150;
  const size = MAX_R * 2 + 24;
  const patIdGroup = `avgPatOverlap-${valueKey}-group`;
  const patIdGlobal = `avgPatOverlap-${valueKey}-global`;
  const hasGroupAvg = data.some((d) => d.avgKind === "group");
  const hasGlobalAvg = data.some((d) => d.avgKind === "global");
  // Draw largest first (bottom of stack) so smaller circles stay visible on top.
  const drawOrder = [...data].sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0));

  return (
    <div>
      <div style={styles.overlapSvgWrap}>
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ display: "block" }}>
          {hasGroupAvg && <AverageStripeDefs id={patIdGroup} kind="group" />}
          {hasGlobalAvg && <AverageStripeDefs id={patIdGlobal} kind="global" />}
          {drawOrder.map((d) => {
            const val = d[valueKey];
            if (val === null || val === undefined) return null;
            const r = Math.max(MAX_R * Math.sqrt(val / maxValue), 3);
            const patId = d.avgKind === "group" ? patIdGroup : patIdGlobal;
            return (
              <circle
                key={d.name}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill={d.isAverage ? `url(#${patId})` : d.color}
                fillOpacity={d.isAverage ? 0.6 : 0.3}
                stroke={d.isAverage ? "#eee" : d.color}
                strokeWidth="2"
              >
                <title>{`${d.name}: ${fmt(val, digits)}${valueSuffix}`}</title>
              </circle>
            );
          })}
        </svg>
      </div>
      <p style={styles.overlapHint}>Hover a circle to see which ball it is.</p>
      <div style={styles.overlapLegend}>
        {data.map((d) => (
          <div key={d.name} style={styles.overlapLegendItem}>
            <span style={{ ...styles.swatch, background: d.color, flex: "0 0 auto" }} />
            <span
              style={
                d.isAverage
                  ? styles.overlapLegendNameAvg
                  : coverNameColor(d.cover)
                  ? { ...styles.overlapLegendName, color: coverNameColor(d.cover) }
                  : styles.overlapLegendName
              }
            >
              {d.name}
            </span>
            <span style={styles.overlapLegendValue}>
              {d[valueKey] == null ? "—" : `${fmt(d[valueKey], digits)}${valueSuffix}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarPanel({ data, valueKey, maxValue, digits = 1, suffix = "", signed = false, showCover = false, colorNameByCover = false }) {
  // With more than 2 bars, zoom the scale so the smallest value still reads as a
  // substantial bar (50%) instead of nearly-equal values all looking maxed out.
  const mags = data
    .map((d) => d[valueKey])
    .filter((v) => v !== null && v !== undefined)
    .map((v) => (signed ? Math.abs(v) : v));
  const useZoom = data.length > 2 && mags.length > 1;
  const zoomMin = useZoom ? Math.min(...mags) : 0;
  const zoomMax = useZoom ? Math.max(...mags) : 0;

  return (
    <div style={styles.barChart}>
      {data.map((d) => {
        const v = d[valueKey];
        const mag = v == null ? 0 : signed ? Math.abs(v) : v;
        let widthPct;
        if (v == null) {
          widthPct = 0;
        } else if (useZoom) {
          widthPct = zoomMax > zoomMin ? 50 + (50 * (mag - zoomMin)) / (zoomMax - zoomMin) : 100;
        } else {
          widthPct = Math.min(100, (mag / maxValue) * 100);
        }
        const displayVal =
          v == null ? "—" : `${signed && v > 0 ? "+" : ""}${fmt(v, digits)}${suffix}`;
        const cover = showCover ? coverLabel(d.cover) : null;
        const nameColor = colorNameByCover && !d.isAverage ? coverNameColor(d.cover) : null;
        return (
          <div key={d.name} style={styles.barRow}>
            <div style={styles.barLabelWrap}>
              <div
                style={
                  d.isAverage
                    ? { ...styles.barLabel, fontWeight: 700, fontStyle: "italic", color: "#eee" }
                    : nameColor
                    ? { ...styles.barLabel, color: nameColor }
                    : styles.barLabel
                }
              >
                {d.name}
              </div>
              {cover && <div style={styles.barCoverLabel}>{cover}</div>}
            </div>
            <div style={styles.barTrack}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${widthPct}%`,
                  background: d.color,
                }}
              />
            </div>
            <div style={styles.barValue}>{displayVal}</div>
          </div>
        );
      })}
    </div>
  );
}

function RangeBarChart({ data, domainMin, domainMax, digits = 1, suffix = "", colorNameByCover = false }) {
  const span = domainMax - domainMin || 1;
  const toPct = (v) => Math.min(100, Math.max(0, ((v - domainMin) / span) * 100));
  return (
    <div style={styles.barChart}>
      {data.map((d) => {
        const hasDry = d.dry !== null && d.dry !== undefined;
        const hasWet = d.wet !== null && d.wet !== undefined;
        const dryPct = hasDry ? toPct(d.dry) : null;
        const wetPct = hasWet ? toPct(d.wet) : null;
        const lo = hasDry && hasWet ? Math.min(dryPct, wetPct) : null;
        const hi = hasDry && hasWet ? Math.max(dryPct, wetPct) : null;
        const bandWidth = lo !== null ? Math.max(hi - lo, 1.2) : null;
        return (
          <div key={d.name} style={styles.barRow}>
            <div
              style={
                d.isAverage
                  ? { ...styles.barLabel, fontWeight: 700, fontStyle: "italic", color: "#eee" }
                  : colorNameByCover && coverNameColor(d.cover)
                  ? { ...styles.barLabel, color: coverNameColor(d.cover) }
                  : styles.barLabel
              }
            >
              {d.name}
            </div>
            <div style={styles.barTrack}>
              {lo !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: `${lo}%`,
                    width: `${bandWidth}%`,
                    top: 0,
                    bottom: 0,
                    background: d.color,
                    opacity: 0.55,
                  }}
                />
              )}
              {hasDry && (
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${dryPct}% - 1.5px)`,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "#e6e6e6",
                  }}
                />
              )}
              {hasWet && (
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${wetPct}% - 1.5px)`,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "#3fc7ff",
                  }}
                />
              )}
            </div>
            <div style={styles.barValue}>
              {hasDry ? fmt(d.dry, digits) : "—"} → {hasWet ? fmt(d.wet, digits) : "—"}
              {suffix}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  scrollTopBtn: {
    position: "fixed",
    bottom: 22,
    right: 22,
    zIndex: 50,
    background: "#1f4e78",
    color: "#fff",
    border: "1px solid #3a7ab5",
    borderRadius: 999,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
  },
  main: {
    minHeight: "100vh",
    background: "#000000",
    color: "#e6e6e6",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    padding: "24px 20px 60px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: { marginBottom: 18 },
  title: { fontSize: 28, margin: "0 0 4px" },
  subtitle: { color: "#999", margin: 0, fontSize: 14 },
  sourceTabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  sourceTabBtn: {
    background: "#141414",
    color: "#ccc",
    border: "1px solid #3a3a3a",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  sourceTabBtnActive: {
    background: "#173a17",
    color: "#8bffa0",
    borderColor: "#2fd65f",
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  tabBtn: {
    background: "#1b1b1b",
    color: "#bbb",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  tabBtnActive: {
    background: "#2f5fd6",
    color: "#fff",
    borderColor: "#2f5fd6",
  },
  panel: {
    background: "#161616",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: "18px 20px",
    marginBottom: 18,
  },
  panelHeadRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  panelTitle: { fontSize: 16, margin: "0 0 12px", fontWeight: 600 },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 700,
    margin: "8px 0 4px",
    color: "#eee",
  },
  unit: { color: "#888", fontWeight: 400, fontSize: 12 },
  smallBtn: {
    background: "#232323",
    color: "#ccc",
    border: "1px solid #3a3a3a",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
  },
  smallBtnActive: {
    background: "#1e2a4a",
    color: "#9db8ff",
    borderColor: "#2f5fd6",
  },
  smallBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  chatLog: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: 360,
    overflowY: "auto",
    overflowX: "hidden",
    marginBottom: 12,
    paddingRight: 4,
    width: "100%",
    boxSizing: "border-box",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    minWidth: 0,
    boxSizing: "border-box",
    background: "#1e2a4a",
    border: "1px solid #2f5fd6",
    borderRadius: 10,
    padding: "8px 12px",
  },
  chatBubbleAssistant: {
    alignSelf: "flex-start",
    maxWidth: "85%",
    minWidth: 0,
    boxSizing: "border-box",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 10,
    padding: "8px 12px",
  },
  chatRoleLabel: {
    display: "block",
    fontSize: 10.5,
    color: "#888",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chatBubbleText: {
    fontSize: 13.5,
    color: "#e6e6e6",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    lineHeight: 1.45,
  },
  chatThinking: {
    fontSize: 12.5,
    color: "#888",
    fontStyle: "italic",
    padding: "2px 4px",
  },
  chatError: {
    fontSize: 12.5,
    color: "#f2a9a9",
    marginBottom: 10,
  },
  chatInputRow: {
    display: "flex",
    gap: 8,
    alignItems: "flex-end",
  },
  chatInput: {
    flex: 1,
    background: "#0f0f0f",
    border: "1px solid #333",
    borderRadius: 8,
    color: "#e6e6e6",
    padding: "8px 10px",
    fontSize: 13.5,
    fontFamily: "inherit",
    resize: "vertical",
  },
  overlapSvgWrap: {
    width: "100%",
    maxWidth: 320,
    margin: "0 auto",
    aspectRatio: "1 / 1",
  },
  scatterAxisRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  scatterAxisLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12.5,
    color: "#999",
  },
  scatterSelect: {
    background: "#0f0f0f",
    color: "#e6e6e6",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "5px 8px",
    fontSize: 12.5,
    fontFamily: "inherit",
  },
  scatterSvgWrap: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    aspectRatio: "900 / 540",
  },
  overlapHint: {
    textAlign: "center",
    color: "#777",
    fontSize: 11,
    margin: "8px 0 14px",
  },
  overlapLegend: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 6,
  },
  overlapLegendItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#1b1b1b",
    border: "1px solid #2c2c2c",
    borderRadius: 7,
    padding: "5px 9px",
    fontSize: 12,
  },
  overlapLegendName: {
    color: "#ccc",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  overlapLegendNameAvg: {
    color: "#eee",
    fontWeight: 700,
    fontStyle: "italic",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  overlapLegendValue: {
    color: "#888",
    fontSize: 11,
    flex: "0 0 auto",
  },
  sortBtn: {
    background: "#1b1b1b",
    color: "#9db8ff",
    border: "1px solid #2f5fd6",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  search: {
    width: "100%",
    background: "#0f0f0f",
    border: "1px solid #333",
    borderRadius: 8,
    color: "#eee",
    padding: "8px 10px",
    fontSize: 13,
    marginBottom: 12,
    boxSizing: "border-box",
  },
  ballGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: 6,
    maxHeight: 190,
    overflowY: "auto",
    paddingRight: 6,
  },
  ballItem: {
    display: "flex",
    alignItems: "center",
    background: "#1b1b1b",
    border: "1px solid #2c2c2c",
    borderRadius: 7,
    padding: "6px 10px",
    fontSize: 13,
    cursor: "pointer",
  },
  ballItemOn: {
    background: "#1e2a4a",
    borderColor: "#2f5fd6",
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    display: "inline-block",
    marginRight: 8,
    flex: "0 0 auto",
  },
  ballTextWrap: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    lineHeight: 1.25,
  },
  ballName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  ballMeta: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 10.5,
    color: "#888",
  },
  circleRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    alignItems: "flex-end",
  },
  circleCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 120,
    maxWidth: "100%",
  },
  circleSvgWrap: {
    width: "100%",
    maxWidth: 160,
    aspectRatio: "1 / 1",
  },
  cellLabel: {
    fontSize: 11.5,
    color: "#ccc",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 1.3,
    minHeight: "3.9em",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  cellValue: { fontSize: 11, color: "#888" },
  errorChart: { display: "flex", flexDirection: "column", gap: 6 },
  errorRow: {
    display: "grid",
    gridTemplateColumns: "minmax(70px, 160px) minmax(0, 1fr) minmax(60px, 90px)",
    alignItems: "center",
    gap: 10,
  },
  errorLabel: {
    fontSize: 12.5,
    color: "#ccc",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  errorTrack: { position: "relative" },
  errorCenterLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 1,
    background: "#2a2a2a",
  },
  errorValue: { fontSize: 11.5, color: "#888", textAlign: "right" },
  barChart: { display: "flex", flexDirection: "column", gap: 8 },
  barRow: {
    display: "grid",
    gridTemplateColumns: "minmax(70px, 170px) minmax(0, 1fr) minmax(45px, 50px)",
    alignItems: "center",
    gap: 10,
  },
  barLabelWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  barLabel: {
    fontSize: 12.5,
    color: "#ccc",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  barCoverLabel: {
    fontSize: 9.5,
    color: "#787878",
    fontStyle: "italic",
    marginTop: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  coverInfoText: {
    fontSize: 11.5,
    color: "#999",
    margin: "-4px 0 10px",
  },
  barTrack: {
    background: "#0f0f0f",
    border: "1px solid #2a2a2a",
    borderRadius: 5,
    height: 14,
    overflow: "hidden",
    position: "relative",
  },
  barFill: { height: "100%" },
  barValue: { fontSize: 12, color: "#ccc", textAlign: "right" },
  rangeLegend: {
    display: "flex",
    gap: 16,
    fontSize: 11,
    color: "#999",
    marginBottom: 10,
    alignItems: "center",
  },
  rangeLegendDot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginRight: 5,
  },
  rangeScaleLabel: {
    fontSize: 10.5,
    color: "#777",
    marginBottom: 8,
  },
  footer: {
    textAlign: "center",
    color: "#555",
    fontSize: 11,
    marginTop: 24,
  },
};
