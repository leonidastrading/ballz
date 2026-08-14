"use client";

import { useEffect, useMemo, useState } from "react";
import { BALLS } from "../lib/data";

const CONDITION_TABS = [
  { key: "Driver Fast", label: "Driver Fast" },
  { key: "Driver Mid", label: "Driver Mid" },
  { key: "7 Iron Fast", label: "7 Iron Fast" },
  { key: "7 Iron Mid", label: "7 Iron Mid" },
  { key: "Wedge Full (Dry)", label: "Full Wedge" },
  { key: "Wedge 35", label: "Wedge 35 yd" },
];

const N = BALLS.length;
function colorFor(index) {
  const hue = Math.round((index * 360) / N);
  return `hsl(${hue}, 70%, 58%)`;
}

const BALL_COLORS = Object.fromEntries(BALLS.map((b, i) => [b.name, colorFor(i)]));

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
  const text =
    dir === "desc" ? "High → Low" : dir === "asc" ? "Low → High" : "Sort";
  const arrow = dir === "desc" ? "↓" : dir === "asc" ? "↑" : "↕";
  return (
    <button onClick={onClick} style={styles.sortBtn} title={`Sort by ${label}`}>
      {arrow} {text}
    </button>
  );
}

const STORAGE_KEY_BALLS = "ballz.selectedBalls";
const STORAGE_KEY_CONDITION = "ballz.condition";

export default function Home() {
  const [selected, setSelected] = useState(() => new Set());
  const [condition, setCondition] = useState("Driver Fast");
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load saved selection/condition from localStorage once, on mount.
  useEffect(() => {
    try {
      const savedBalls = window.localStorage.getItem(STORAGE_KEY_BALLS);
      if (savedBalls) {
        const names = JSON.parse(savedBalls);
        if (Array.isArray(names)) setSelected(new Set(names));
      }
      const savedCondition = window.localStorage.getItem(STORAGE_KEY_CONDITION);
      if (savedCondition) setCondition(savedCondition);
    } catch (e) {
      // localStorage unavailable (private mode, etc.) - just skip persistence
    }
    setHydrated(true);
  }, []);

  // Persist selection after the initial load, so refreshing keeps your picks.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_BALLS,
        JSON.stringify(Array.from(selected))
      );
    } catch (e) {}
  }, [selected, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_CONDITION, condition);
    } catch (e) {}
  }, [condition, hydrated]);

  const [sortDir, setSortDir] = useState({
    footprint: null,
    spray: null,
    range: null,
    axis: null,
    speed: null,
    carry: null,
    total: null,
    spin: null,
    compression: null,
  });

  function cycleSort(key) {
    setSortDir((prev) => {
      const cur = prev[key];
      const next = cur === null ? "desc" : cur === "desc" ? "asc" : null;
      return { ...prev, [key]: next };
    });
  }

  const selectedBalls = useMemo(
    () => BALLS.filter((b) => selected.has(b.name)),
    [selected]
  );

  const filteredBalls = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BALLS;
    return BALLS.filter((b) => b.name.toLowerCase().includes(q));
  }, [search]);

  function toggleBall(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(BALLS.map((b) => b.name)));
  }
  function clearAll() {
    setSelected(new Set());
  }

  // ---- shared scales for the current condition, based on selected balls ----
  const condData = selectedBalls.map((b) => ({
    name: b.name,
    color: BALL_COLORS[b.name],
    compression: b.compression,
    ...b.conditions[condition],
  }));

  const maxFootprint = Math.max(1, ...condData.map((d) => d.footprint || 0));
  const maxSpray = Math.max(0.1, ...condData.map((d) => d.spray || 0));
  const maxRange = Math.max(0.1, ...condData.map((d) => d.range || 0));
  const maxCompression = 120;

  const sortedFootprint = sortByKey(condData, "footprint", sortDir.footprint);
  const sortedSpray = sortByKey(condData, "spray", sortDir.spray);
  const sortedRange = sortByKey(condData, "range", sortDir.range);
  const sortedAxis = sortByKey(condData, "axis", sortDir.axis);
  const maxSpeed = Math.max(1, ...condData.map((d) => d.speed || 0));
  const maxCarry = Math.max(1, ...condData.map((d) => d.carry || 0));
  const maxTotal = Math.max(1, ...condData.map((d) => d.total || 0));
  const maxSpin = Math.max(1, ...condData.map((d) => d.spin || 0));
  const sortedSpeed = sortByKey(condData, "speed", sortDir.speed);
  const sortedCarry = sortByKey(condData, "carry", sortDir.carry);
  const sortedTotal = sortByKey(condData, "total", sortDir.total);
  const sortedSpin = sortByKey(condData, "spin", sortDir.spin);
  const compressionData = selectedBalls.map((b) => ({
    name: b.name,
    compression: b.compression,
    color: BALL_COLORS[b.name],
  }));
  const sortedCompression = sortByKey(compressionData, "compression", sortDir.compression);

  const CIRCLE_MAX_RADIUS = 70; // px, for the largest footprint among selected
  const LINE_MAX_HALF = 220; // px, half-width for the largest spray/range among selected

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>⛳ Ball Test Explorer</h1>
        <p style={styles.subtitle}>
          Select balls, switch conditions, compare footprint, dispersion, curve, and compression.
        </p>
      </header>

      <section style={styles.tabs}>
        {CONDITION_TABS.map((t) => (
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
          <h2 style={styles.panelTitle}>Balls ({selected.size} selected)</h2>
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
                <span
                  style={{
                    ...styles.swatch,
                    background: BALL_COLORS[b.name],
                  }}
                />
                <span style={styles.ballName}>{b.name}</span>
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
          {/* Footprint area */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Footprint Area — {condition}{" "}
                <span style={styles.unit}>(yd², circle area to scale)</span>
              </h2>
              <SortButton
                dir={sortDir.footprint}
                onClick={() => cycleSort("footprint")}
                label="footprint area"
              />
            </div>
            <div style={styles.circleRow}>
              {sortedFootprint.map((d) => {
                const r =
                  CIRCLE_MAX_RADIUS * Math.sqrt((d.footprint || 0) / maxFootprint);
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
                    <div style={styles.cellValue}>{fmt(d.footprint, 1)} yd²</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Side spray */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Side Spray — {condition} <span style={styles.unit}>(± yd)</span>
              </h2>
              <SortButton
                dir={sortDir.spray}
                onClick={() => cycleSort("spray")}
                label="side spray"
              />
            </div>
            <ErrorLineChart
              data={sortedSpray}
              valueKey="spray"
              maxValue={maxSpray}
              maxHalfWidth={LINE_MAX_HALF}
            />
          </section>

          {/* Distance range */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Distance Range — {condition} <span style={styles.unit}>(± yd)</span>
              </h2>
              <SortButton
                dir={sortDir.range}
                onClick={() => cycleSort("range")}
                label="distance range"
              />
            </div>
            <ErrorLineChart
              data={sortedRange}
              valueKey="range"
              maxValue={maxRange}
              maxHalfWidth={LINE_MAX_HALF}
            />
          </section>

          {/* Axis degree */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Axis — {condition} <span style={styles.unit}>(degrees of tilt/curve)</span>
              </h2>
              <SortButton
                dir={sortDir.axis}
                onClick={() => cycleSort("axis")}
                label="axis"
              />
            </div>
            <div style={styles.circleRow}>
              {sortedAxis.map((d) => {
                const size = 100;
                const half = size / 2;
                const hasAxis = d.axis !== null && d.axis !== undefined;
                const len = half - 10;
                const angleRad = ((hasAxis ? d.axis : 0) * Math.PI) / 180;
                const x2 = half + len * Math.sin(angleRad);
                const y2 = half - len * Math.cos(angleRad);
                return (
                  <div key={d.name} style={styles.circleCell}>
                    <svg width={size} height={size}>
                      <line
                        x1={half}
                        y1={half}
                        x2={half}
                        y2={10}
                        stroke="#3a3a3a"
                        strokeWidth="2"
                        strokeDasharray="3,3"
                      />
                      {hasAxis && (
                        <line
                          x1={half}
                          y1={half}
                          x2={x2}
                          y2={y2}
                          stroke={d.color}
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      )}
                      <circle cx={half} cy={half} r="3" fill="#888" />
                    </svg>
                    <div style={styles.cellLabel}>{d.name}</div>
                    <div style={styles.cellValue}>
                      {hasAxis ? `${fmt(d.axis, 2)}°` : "n/a"}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ball speed */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Ball Speed — {condition} <span style={styles.unit}>(mph)</span>
              </h2>
              <SortButton
                dir={sortDir.speed}
                onClick={() => cycleSort("speed")}
                label="ball speed"
              />
            </div>
            <BarPanel data={sortedSpeed} valueKey="speed" maxValue={maxSpeed} digits={1} suffix=" mph" />
          </section>

          {/* Carry */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Carry — {condition} <span style={styles.unit}>(yd)</span>
              </h2>
              <SortButton
                dir={sortDir.carry}
                onClick={() => cycleSort("carry")}
                label="carry"
              />
            </div>
            <BarPanel data={sortedCarry} valueKey="carry" maxValue={maxCarry} digits={1} suffix=" yd" />
          </section>

          {/* Total distance */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Total Distance — {condition} <span style={styles.unit}>(yd)</span>
              </h2>
              <SortButton
                dir={sortDir.total}
                onClick={() => cycleSort("total")}
                label="total distance"
              />
            </div>
            <BarPanel data={sortedTotal} valueKey="total" maxValue={maxTotal} digits={1} suffix=" yd" />
          </section>

          {/* Spin */}
          <section style={styles.panel}>
            <div style={styles.panelHeadRow}>
              <h2 style={styles.panelTitle}>
                Spin — {condition} <span style={styles.unit}>(rpm)</span>
              </h2>
              <SortButton
                dir={sortDir.spin}
                onClick={() => cycleSort("spin")}
                label="spin"
              />
            </div>
            <BarPanel data={sortedSpin} valueKey="spin" maxValue={maxSpin} digits={0} suffix=" rpm" />
          </section>
        </>
      )}

      {/* Compression - condition independent */}
      <section style={styles.panel}>
        <div style={styles.panelHeadRow}>
          <h2 style={styles.panelTitle}>
            Compression <span style={styles.unit}>(does not change with condition)</span>
          </h2>
          {selectedBalls.length > 0 && (
            <SortButton
              dir={sortDir.compression}
              onClick={() => cycleSort("compression")}
              label="compression"
            />
          )}
        </div>
        {selectedBalls.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
            Select balls to compare compression.
          </p>
        ) : (
          <BarPanel
            data={sortedCompression}
            valueKey="compression"
            maxValue={maxCompression}
            digits={0}
            suffix=""
          />
        )}
      </section>

      <footer style={styles.footer}>Data: MyGolfSpy 2026 Ball Test — dispersion &amp; compression.</footer>
    </main>
  );
}

function ErrorLineChart({ data, valueKey, maxValue, maxHalfWidth }) {
  return (
    <div style={styles.errorChart}>
      {data.map((d) => {
        const v = d[valueKey] || 0;
        const halfPx = maxHalfWidth * (v / maxValue);
        return (
          <div key={d.name} style={styles.errorRow}>
            <div style={styles.errorLabel}>{d.name}</div>
            <div style={styles.errorTrack}>
              <div style={styles.errorCenterLine} />
              <svg
                width={maxHalfWidth * 2 + 20}
                height="24"
                style={{ position: "relative" }}
              >
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
                <circle cx={maxHalfWidth + 10} cy="12" r="2" fill="#666" />
              </svg>
            </div>
            <div style={styles.errorValue}>± {fmt(v, 2)} yd</div>
          </div>
        );
      })}
    </div>
  );
}

function BarPanel({ data, valueKey, maxValue, digits = 1, suffix = "" }) {
  return (
    <div style={styles.barChart}>
      {data.map((d) => {
        const v = d[valueKey];
        const widthPct = v == null ? 0 : Math.min(100, (v / maxValue) * 100);
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
            <div style={styles.barValue}>
              {v == null ? "—" : `${fmt(v, digits)}${suffix}`}
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
  ballName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
  },
  barFill: { height: "100%" },
  barValue: { fontSize: 12, color: "#ccc", textAlign: "right" },
  footer: {
    textAlign: "center",
    color: "#555",
    fontSize: 11,
    marginTop: 24,
  },
};
