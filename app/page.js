"use client";

import { useMemo, useState } from "react";
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

export default function Home() {
  const [selected, setSelected] = useState(() => new Set());
  const [condition, setCondition] = useState("Driver Fast");
  const [search, setSearch] = useState("");

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
            <h2 style={styles.panelTitle}>
              Footprint Area — {condition}{" "}
              <span style={styles.unit}>(yd², circle area to scale)</span>
            </h2>
            <div style={styles.circleRow}>
              {condData.map((d) => {
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
            <h2 style={styles.panelTitle}>
              Side Spray — {condition} <span style={styles.unit}>(± yd)</span>
            </h2>
            <ErrorLineChart
              data={condData}
              valueKey="spray"
              maxValue={maxSpray}
              maxHalfWidth={LINE_MAX_HALF}
            />
          </section>

          {/* Distance range */}
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Distance Range — {condition} <span style={styles.unit}>(± yd)</span>
            </h2>
            <ErrorLineChart
              data={condData}
              valueKey="range"
              maxValue={maxRange}
              maxHalfWidth={LINE_MAX_HALF}
            />
          </section>

          {/* Axis degree */}
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Axis — {condition} <span style={styles.unit}>(degrees of tilt/curve)</span>
            </h2>
            <div style={styles.circleRow}>
              {condData.map((d) => {
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
        </>
      )}

      {/* Compression - condition independent */}
      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>
          Compression <span style={styles.unit}>(does not change with condition)</span>
        </h2>
        {selectedBalls.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>
            Select balls to compare compression.
          </p>
        ) : (
          <div style={styles.barChart}>
            {selectedBalls.map((b) => {
              const color = BALL_COLORS[b.name];
              const widthPct = Math.min(100, (b.compression / maxCompression) * 100);
              return (
                <div key={b.name} style={styles.barRow}>
                  <div style={styles.barLabel}>{b.name}</div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${widthPct}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <div style={styles.barValue}>{b.compression}</div>
                </div>
              );
            })}
          </div>
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

const styles = {
  main: {
    minHeight: "100vh",
    background: "#0d0d0d",
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
    maxHeight: 320,
    overflowY: "auto",
    paddingRight: 4,
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
