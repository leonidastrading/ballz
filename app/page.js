"use client";

import { useEffect, useMemo, useState } from "react";
import { BALLS } from "../lib/data";
import { BALLS_2024 } from "../lib/data2024";
import { BALLS_2025 } from "../lib/data2025";
import { BALLS_MGS2025 } from "../lib/dataMgs2025";
import { WEDGE_WET_DRY } from "../lib/dataWedgeWetDry";

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
    footerNote: "Data: MyGolfSpy 2026 Ball Test — dispersion & compression.",
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
      "Data: MyGolfSpy 2025 Ball Test — single-shot driver/mid-iron/wedge results, 44 balls (coverage varies by ball/condition).",
  },
];

const SOURCE_COLORS = Object.fromEntries(SOURCES.map((s) => [s.id, colorsFor(s.balls)]));

function fmt(v, digits = 2) {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return v.toFixed(digits);
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
  const [sortDir, setSortDir] = useState({});

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

  function cycleSort(key) {
    setSortDir((prev) => {
      const cur = prev[key];
      const next = !cur ? "desc" : cur === "desc" ? "asc" : null;
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
  const condData = selectedBalls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    meta: b.meta,
    compression: b.compression,
    ...b.conditions[condition],
  }));

  const CIRCLE_MAX_RADIUS = 70; // px, for the largest footprint among selected
  const LINE_MAX_HALF = 220; // px, half-width for the largest spray/range among selected

  const ballLevelData = selectedBalls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
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

      {selectedBalls.length === 0 ? (
        <section style={styles.panel}>
          <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
            Select one or more balls above to see charts.
          </p>
        </section>
      ) : (
        <>
          {activeSource.panels.map((panel) => {
            const dir = sortDir[panel.key] || null;
            const sorted = sortByKey(condData, panel.key, dir);

            if (panel.type === "circle") {
              const maxValue = Math.max(1, ...condData.map((d) => d[panel.key] || 0));
              return (
                <section style={styles.panel} key={panel.key}>
                  <div style={styles.panelHeadRow}>
                    <h2 style={styles.panelTitle}>
                      {panel.label} — {condition} <span style={styles.unit}>{panel.unit}</span>
                    </h2>
                    <SortButton dir={dir} onClick={() => cycleSort(panel.key)} label={panel.label} />
                  </div>
                  <div style={styles.circleRow}>
                    {sorted.map((d) => {
                      const val = d[panel.key];
                      const r = CIRCLE_MAX_RADIUS * Math.sqrt((val || 0) / maxValue);
                      const size = CIRCLE_MAX_RADIUS * 2 + 20;
                      return (
                        <div key={d.name} style={styles.circleCell}>
                          <svg width={size} height={size}>
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={Math.max(r, 2)}
                              fill={d.color}
                              fillOpacity="0.35"
                              stroke={d.color}
                              strokeWidth="2"
                            />
                          </svg>
                          <div style={styles.cellLabel}>{d.name}</div>
                          <div style={styles.cellValue}>
                            {fmt(val, panel.digits ?? 1)}
                            {panel.valueSuffix || ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
            return (
              <section style={styles.panel} key={panel.key}>
                <div style={styles.panelHeadRow}>
                  <h2 style={styles.panelTitle}>
                    {panel.label} — {condition} <span style={styles.unit}>{panel.unit}</span>
                  </h2>
                  <SortButton dir={dir} onClick={() => cycleSort(panel.key)} label={panel.label} />
                </div>
                <BarPanel
                  data={sorted}
                  valueKey={panel.key}
                  maxValue={maxValue}
                  digits={panel.digits ?? 1}
                  suffix={panel.suffix || ""}
                  signed={!!panel.signed}
                />
              </section>
            );
          })}
        </>
      )}

      {(activeSource.ballLevelBars || []).map((bl) => (
        <section style={styles.panel} key={bl.key}>
          <div style={styles.panelHeadRow}>
            <h2 style={styles.panelTitle}>
              {bl.label} <span style={styles.unit}>{bl.unit}</span>
            </h2>
            {selectedBalls.length > 0 && (
              <SortButton
                dir={sortDir[bl.key] || null}
                onClick={() => cycleSort(bl.key)}
                label={bl.label}
              />
            )}
          </div>
          {selectedBalls.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
              Select balls to compare {bl.label.toLowerCase()}.
            </p>
          ) : (
            <BarPanel
              data={sortByKey(ballLevelData, bl.key, sortDir[bl.key])}
              valueKey={bl.key}
              maxValue={bl.maxValue}
              digits={bl.digits}
              suffix={bl.suffix}
            />
          )}
        </section>
      ))}

      {activeSource.wedgeWetDryPanels && selectedBalls.length > 0 && (
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
            const dir = sortDir[sortKey] || null;
            const raw = selectedBalls.map((b) => {
              const entry = activeSource.wedgeWetDryData[b.name] || {};
              const dry = entry.dry ? entry.dry[panel.key] ?? null : null;
              const wet = entry.wet ? entry.wet[panel.key] ?? null : null;
              return {
                name: b.name,
                color: BALL_COLORS[b.name],
                dry,
                wet,
                sortval: wet ?? dry,
              };
            });
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
                <RangeBarChart
                  data={sorted}
                  domainMin={domainMin}
                  domainMax={domainMax}
                  digits={panel.digits ?? 1}
                  suffix={panel.suffix || ""}
                />
              </section>
            );
          })}
        </>
      )}

      <footer style={styles.footer}>{activeSource.footerNote}</footer>
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
        return (
          <div key={d.name} style={styles.errorRow}>
            <div style={styles.errorLabel}>{d.name}</div>
            <div style={styles.errorTrack}>
              <div style={styles.errorCenterLine} />
              <svg width={maxHalfWidth * 2 + 20} height="24" style={{ position: "relative" }}>
                {hasVal && (
                  <>
                    <line
                      x1={maxHalfWidth + 10 - halfPx}
                      y1="12"
                      x2={maxHalfWidth + 10 + halfPx}
                      y2="12"
                      stroke={d.color}
                      strokeWidth="3"
                    />
                    <line
                      x1={maxHalfWidth + 10 - halfPx}
                      y1="4"
                      x2={maxHalfWidth + 10 - halfPx}
                      y2="20"
                      stroke={d.color}
                      strokeWidth="3"
                    />
                    <line
                      x1={maxHalfWidth + 10 + halfPx}
                      y1="4"
                      x2={maxHalfWidth + 10 + halfPx}
                      y2="20"
                      stroke={d.color}
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

function BarPanel({ data, valueKey, maxValue, digits = 1, suffix = "", signed = false }) {
  return (
    <div style={styles.barChart}>
      {data.map((d) => {
        const v = d[valueKey];
        const mag = v == null ? 0 : Math.abs(v);
        const widthPct = v == null ? 0 : Math.min(100, (mag / maxValue) * 100);
        const displayVal =
          v == null ? "—" : `${signed && v > 0 ? "+" : ""}${fmt(v, digits)}${suffix}`;
        return (
          <div key={d.name} style={styles.barRow}>
            <div style={styles.barLabel}>{d.name}</div>
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

function RangeBarChart({ data, domainMin, domainMax, digits = 1, suffix = "" }) {
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
            <div style={styles.barLabel}>{d.name}</div>
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
  },
  cellLabel: {
    fontSize: 11.5,
    color: "#ccc",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 1.3,
  },
  cellValue: { fontSize: 11, color: "#888" },
  errorChart: { display: "flex", flexDirection: "column", gap: 6 },
  errorRow: {
    display: "grid",
    gridTemplateColumns: "160px 1fr 90px",
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
    gridTemplateColumns: "170px 1fr 50px",
    alignItems: "center",
    gap: 10,
  },
  barLabel: {
    fontSize: 12.5,
    color: "#ccc",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
