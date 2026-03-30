import { useState, useRef, useCallback, useEffect } from "react";

// ── Cotoaga.ai dark theme ──────────────────────────────────────────────────
// Background layers:  deep-sky (#191A2E) → dark-marine (#16213E)
// Primary accent:     cotoaga-green (#00A86B)
// Secondary accent:   cotoaga-cyan (#00D4FF)
// Danger:             red (#ff4444)
// Text:               cotoaga-ai-white (#fafbfb) / grey-light (#8A8A8A)
// Typography chrome:  Space Grotesk (display) + Inter (body)
// Typography canvas:  JetBrains Mono (node labels)
// Edges:              border-radius 0 everywhere (mathematical precision)

const C = {
  bg:               "#191A2E",  // deep-sky
  grid:             "#1c1f3a",  // minor grid lines
  gridAccent:       "#16213E",  // dark-marine — major grid lines
  node:             "#16213E",  // dark-marine — node fill
  nodeBorder:       "rgba(138,138,138,0.18)",
  nodeHover:        "rgba(0,168,107,0.35)",
  nodeSelected:     "#00A86B",  // cotoaga-green
  text:             "#fafbfb",  // cotoaga-ai-white
  textDim:          "#8A8A8A",  // cotoaga-ai-grey-light
  accent:           "#00A86B",  // cotoaga-green
  accentDim:        "rgba(0,168,107,0.12)",
  accentBorder:     "rgba(0,168,107,0.25)",
  connection:       "rgba(0,168,107,0.22)",
  connectionActive: "#00D4FF",  // cotoaga-cyan
  danger:           "#ff4444",
  warrenGlow:       "rgba(0,212,255,0.07)",
  attractorGlow:    "rgba(255,68,68,0.10)",
};

// Node type colors follow the Cosmological Color Map (KHAOS-COSMOLOGY.md §Color Cosmology)
// Crown → Concept (#7b2ff7 violet), Throat → Warren (#00D4FF cyan),
// Sacral → Manifold (#ff6b2b orange), Root → Dark Attractor (#ff4444 red),
// Solar Plexus → House (#e9b320 gold), Heart → Note (#00A86B green)
const NODE_TYPES = {
  concept:  { label: "Concept",        color: "#7b2ff7", icon: "◆" },
  warren:   { label: "Warren",         color: "#00D4FF", icon: "⬡" },
  manifold: { label: "Manifold",       color: "#ff6b2b", icon: "🜏" },
  attractor:{ label: "Dark Attractor", color: "#ff4444", icon: "◉" },
  house:    { label: "House",          color: "#e9b320", icon: "♛" },
  note:     { label: "Note",           color: "#00A86B", icon: "▪" },
};

const UI_FONT = "'Space Grotesk', 'Inter', sans-serif";
const CANVAS_FONT = "'JetBrains Mono', 'SF Mono', monospace";

let idCounter = 0;
const genId = () => `n_${++idCounter}_${Date.now()}`;

export default function KhaosPlanes() {
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [nodes, setNodes] = useState([
    { id: "root", x: 0, y: 0, text: "KHAOS\nCosmology", type: "house", w: 180, h: 90 },
  ]);
  const [connections, setConnections] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [panning, setPanning] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [connecting, setConnecting] = useState(null);
  const [tool, setTool] = useState("select");
  const [addType, setAddType] = useState("concept");
  const [showHelp, setShowHelp] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const containerRef = useRef(null);

  const screenToWorld = useCallback(
    (sx, sy) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (sx - rect.left - rect.width / 2) / camera.zoom - camera.x,
        y: (sy - rect.top - rect.height / 2) / camera.zoom - camera.y,
      };
    },
    [camera]
  );

  const worldToScreen = useCallback(
    (wx, wy) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (wx + camera.x) * camera.zoom + rect.width / 2,
        y: (wy + camera.y) * camera.zoom + rect.height / 2,
      };
    },
    [camera]
  );

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCamera((c) => ({ ...c, zoom: Math.max(0.1, Math.min(5, c.zoom * delta)) }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const getNodeAt = useCallback(
    (wx, wy) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (wx >= n.x - n.w / 2 && wx <= n.x + n.w / 2 && wy >= n.y - n.h / 2 && wy <= n.y + n.h / 2)
          return n;
      }
      return null;
    },
    [nodes]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (e.button === 2) return;
      setContextMenu(null);
      const world = screenToWorld(e.clientX, e.clientY);

      if (tool === "connect") {
        const node = getNodeAt(world.x, world.y);
        if (node) setConnecting(node.id);
        return;
      }

      if (tool === "add") {
        const node = getNodeAt(world.x, world.y);
        if (!node) {
          const newNode = { id: genId(), x: world.x, y: world.y, text: NODE_TYPES[addType].label, type: addType, w: 160, h: 70 };
          setNodes((prev) => [...prev, newNode]);
          setSelected(newNode.id);
          setEditing(newNode.id);
          setEditText(newNode.text);
          return;
        }
      }

      const node = getNodeAt(world.x, world.y);
      if (node) {
        setSelected(node.id);
        setDragging({ nodeId: node.id, offsetX: world.x - node.x, offsetY: world.y - node.y });
      } else {
        setSelected(null);
        setPanning({ startX: e.clientX, startY: e.clientY, camX: camera.x, camY: camera.y });
      }
    },
    [tool, addType, screenToWorld, getNodeAt, camera]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (dragging) {
        const world = screenToWorld(e.clientX, e.clientY);
        setNodes((prev) =>
          prev.map((n) =>
            n.id === dragging.nodeId
              ? { ...n, x: world.x - dragging.offsetX, y: world.y - dragging.offsetY }
              : n
          )
        );
      } else if (panning) {
        const dx = (e.clientX - panning.startX) / camera.zoom;
        const dy = (e.clientY - panning.startY) / camera.zoom;
        setCamera((c) => ({ ...c, x: panning.camX + dx, y: panning.camY + dy }));
      }
    },
    [dragging, panning, screenToWorld, camera.zoom]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (connecting) {
        const world = screenToWorld(e.clientX, e.clientY);
        const target = getNodeAt(world.x, world.y);
        if (target && target.id !== connecting) {
          const exists = connections.some(
            (c) => (c.from === connecting && c.to === target.id) || (c.from === target.id && c.to === connecting)
          );
          if (!exists)
            setConnections((prev) => [...prev, { from: connecting, to: target.id, id: genId() }]);
        }
        setConnecting(null);
      }
      setDragging(null);
      setPanning(null);
    },
    [connecting, connections, screenToWorld, getNodeAt]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      const world = screenToWorld(e.clientX, e.clientY);
      const node = getNodeAt(world.x, world.y);
      if (node) {
        setEditing(node.id);
        setEditText(node.text);
        setSelected(node.id);
      }
    },
    [screenToWorld, getNodeAt]
  );

  const commitEdit = useCallback(() => {
    if (editing && editText.trim()) {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === editing) {
            const lines = editText.trim().split("\n");
            const maxLine = Math.max(...lines.map((l) => l.length));
            const w = Math.max(140, maxLine * 10 + 40);
            const h = Math.max(60, lines.length * 24 + 36);
            return { ...n, text: editText.trim(), w, h };
          }
          return n;
        })
      );
    }
    setEditing(null);
  }, [editing, editText]);

  const deleteSelected = useCallback(() => {
    if (selected) {
      setNodes((prev) => prev.filter((n) => n.id !== selected));
      setConnections((prev) => prev.filter((c) => c.from !== selected && c.to !== selected));
      setSelected(null);
      setContextMenu(null);
    }
  }, [selected]);

  const cycleType = useCallback(() => {
    if (selected) {
      const types = Object.keys(NODE_TYPES);
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === selected) {
            const idx = types.indexOf(n.type);
            return { ...n, type: types[(idx + 1) % types.length] };
          }
          return n;
        })
      );
      setContextMenu(null);
    }
  }, [selected]);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      const world = screenToWorld(e.clientX, e.clientY);
      const node = getNodeAt(world.x, world.y);
      if (node) {
        setSelected(node.id);
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id });
      } else {
        setContextMenu(null);
      }
    },
    [screenToWorld, getNodeAt]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (editing) {
        if (e.key === "Escape") commitEdit();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      else if (e.key === "Escape") { setSelected(null); setConnecting(null); setTool("select"); }
      else if (e.key === "1") setTool("select");
      else if (e.key === "2") setTool("add");
      else if (e.key === "3") setTool("connect");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [editing, commitEdit, deleteSelected]);

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderGrid = () => {
    const spacing = 50 * camera.zoom;
    const bigSpacing = 250 * camera.zoom;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const ox = (camera.x * camera.zoom + rect.width / 2) % spacing;
    const oy = (camera.y * camera.zoom + rect.height / 2) % spacing;
    const bigOx = (camera.x * camera.zoom + rect.width / 2) % bigSpacing;
    const bigOy = (camera.y * camera.zoom + rect.height / 2) % bigSpacing;

    const lines = [];
    for (let x = bigOx - bigSpacing; x < rect.width + bigSpacing; x += bigSpacing)
      lines.push(<line key={`bx${x}`} x1={x} y1={0} x2={x} y2={rect.height} stroke={C.accentBorder} strokeWidth={0.5} />);
    for (let y = bigOy - bigSpacing; y < rect.height + bigSpacing; y += bigSpacing)
      lines.push(<line key={`by${y}`} x1={0} y1={y} x2={rect.width} y2={y} stroke={C.accentBorder} strokeWidth={0.5} />);

    if (camera.zoom > 0.4) {
      for (let x = ox - spacing; x < rect.width + spacing; x += spacing)
        lines.push(<line key={`sx${x}`} x1={x} y1={0} x2={x} y2={rect.height} stroke={C.grid} strokeWidth={0.3} />);
      for (let y = oy - spacing; y < rect.height + spacing; y += spacing)
        lines.push(<line key={`sy${y}`} x1={0} y1={y} x2={rect.width} y2={y} stroke={C.grid} strokeWidth={0.3} />);
    }
    return lines;
  };

  const renderConnections = () => {
    const nodeMap = {};
    nodes.forEach((n) => (nodeMap[n.id] = n));
    return connections.map((conn) => {
      const from = nodeMap[conn.from];
      const to = nodeMap[conn.to];
      if (!from || !to) return null;
      const s1 = worldToScreen(from.x, from.y);
      const s2 = worldToScreen(to.x, to.y);
      const isActive = selected === conn.from || selected === conn.to;
      return (
        <g key={conn.id}>
          <line
            x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
            stroke={isActive ? C.connectionActive : C.connection}
            strokeWidth={isActive ? 2 : 1}
            strokeDasharray={isActive ? "none" : "6 4"}
            opacity={0.8}
          />
          <circle
            cx={(s1.x + s2.x) / 2} cy={(s1.y + s2.y) / 2} r={3}
            fill={isActive ? C.connectionActive : C.connection}
          />
        </g>
      );
    });
  };

  const renderNodes = () =>
    nodes.map((node) => {
      const screen = worldToScreen(node.x, node.y);
      const w = node.w * camera.zoom;
      const h = node.h * camera.zoom;
      const typeInfo = NODE_TYPES[node.type] || NODE_TYPES.concept;
      const isSelected = selected === node.id;
      const isHovered = hoveredNode === node.id;
      const isEditing = editing === node.id;
      const fontSize = Math.max(8, 13 * camera.zoom);
      const iconSize = Math.max(8, 11 * camera.zoom);

      const borderColor = isSelected
        ? typeInfo.color
        : isHovered
        ? C.nodeHover
        : C.nodeBorder;
      const borderWidth = isSelected ? 2 : 1;

      return (
        <g key={node.id}>
          {node.type === "attractor" && (
            <ellipse cx={screen.x} cy={screen.y} rx={w * 0.9} ry={h * 0.9}
              fill={C.attractorGlow} opacity={0.5 + (isSelected ? 0.2 : 0)} />
          )}
          {node.type === "warren" && (
            <ellipse cx={screen.x} cy={screen.y} rx={w * 0.85} ry={h * 0.85}
              fill={C.warrenGlow} opacity={0.4 + (isSelected ? 0.2 : 0)} />
          )}
          <rect
            x={screen.x - w / 2} y={screen.y - h / 2} width={w} height={h}
            rx={node.type === "warren" ? w * 0.15 : 0}
            ry={node.type === "warren" ? h * 0.15 : 0}
            fill={C.node}
            stroke={borderColor}
            strokeWidth={borderWidth}
            opacity={0.97}
            style={{ cursor: tool === "connect" ? "crosshair" : "grab" }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          />
          {/* Type accent line — left edge */}
          <rect
            x={screen.x - w / 2} y={screen.y - h / 2}
            width={Math.max(2, 3 * camera.zoom)} height={h}
            fill={typeInfo.color} opacity={isSelected ? 0.9 : 0.5}
            style={{ pointerEvents: "none" }}
          />
          <text
            x={screen.x - w / 2 + 10 * camera.zoom}
            y={screen.y - h / 2 + 14 * camera.zoom}
            fontSize={iconSize} fill={typeInfo.color} opacity={0.8}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {typeInfo.icon}
          </text>
          {isEditing ? (
            <foreignObject x={screen.x - w / 2 + 4} y={screen.y - h / 2 + 4} width={w - 8} height={h - 8}>
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitEdit(); }
                }}
                style={{
                  width: "100%", height: "100%",
                  background: "transparent", border: "none", outline: "none",
                  color: C.text, fontSize: `${fontSize}px`,
                  fontFamily: CANVAS_FONT,
                  resize: "none", padding: "2px", lineHeight: 1.4,
                }}
              />
            </foreignObject>
          ) : (
            node.text.split("\n").map((line, i) => (
              <text key={i}
                x={screen.x}
                y={screen.y + (i - (node.text.split("\n").length - 1) / 2) * (fontSize * 1.4)}
                textAnchor="middle" dominantBaseline="central"
                fontSize={fontSize} fontFamily={CANVAS_FONT}
                fill={C.text}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {line}
              </text>
            ))
          )}
        </g>
      );
    });

  // ── Chrome styles ─────────────────────────────────────────────────────────

  const panelStyle = {
    background: "rgba(22,33,62,0.96)",
    border: `1px solid ${C.accentBorder}`,
    borderRadius: 0,
    backdropFilter: "blur(12px)",
    fontFamily: UI_FONT,
  };

  const btnBase = {
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 0,
    color: C.textDim,
    cursor: "pointer",
    fontFamily: UI_FONT,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    transition: "all 150ms ease-in-out",
  };

  const btnActive = {
    ...btnBase,
    background: C.accent,
    border: `1px solid ${C.accent}`,
    color: "#191A2E",
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100vh",
        background: C.bg,
        position: "relative", overflow: "hidden",
        fontFamily: UI_FONT,
        cursor: tool === "add" || tool === "connect" ? "crosshair" : panning ? "grabbing" : "default",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {/* ── Canvas ── */}
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        {renderGrid()}
        {renderConnections()}
        {renderNodes()}
        {connecting && hoveredNode && hoveredNode !== connecting && (() => {
          const hn = nodes.find((n) => n.id === hoveredNode);
          if (!hn) return null;
          const s = worldToScreen(hn.x, hn.y);
          return (
            <circle cx={s.x} cy={s.y} r={8}
              fill="none" stroke={C.connectionActive} strokeWidth={2} opacity={0.8} />
          );
        })()}
      </svg>

      {/* ── Toolbar ── */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 2, ...panelStyle, padding: 4 }}>
        {[
          { key: "select",  label: "Select",  shortcut: "1", icon: "↖" },
          { key: "add",     label: "Add",     shortcut: "2", icon: "+" },
          { key: "connect", label: "Connect", shortcut: "3", icon: "⟶" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTool(t.key)}
            style={tool === t.key ? btnActive : btnBase}>
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            <span>{t.label}</span>
            <span style={{ opacity: 0.45, fontSize: 10, fontWeight: 400 }}>{t.shortcut}</span>
          </button>
        ))}
      </div>

      {/* ── Node type picker ── */}
      {tool === "add" && (
        <div style={{
          position: "absolute", top: 56, left: 12,
          display: "flex", gap: 3, flexWrap: "wrap", maxWidth: 380,
          ...panelStyle, padding: 6,
        }}>
          {Object.entries(NODE_TYPES).map(([key, info]) => (
            <button key={key} onClick={() => setAddType(key)}
              style={{
                padding: "4px 10px",
                background: addType === key ? `${info.color}1a` : "transparent",
                border: `1px solid ${addType === key ? info.color : "transparent"}`,
                borderRadius: 0,
                color: addType === key ? info.color : C.textDim,
                cursor: "pointer",
                fontSize: 11, fontFamily: UI_FONT,
                fontWeight: addType === key ? 600 : 400,
                textTransform: "uppercase", letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 5,
                transition: "all 150ms ease-in-out",
              }}>
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Zoom indicator ── */}
      <div style={{
        position: "absolute", bottom: 12, right: 12,
        color: C.textDim, fontSize: 11,
        ...panelStyle, padding: "4px 12px",
      }}>
        <span style={{ color: C.accent, fontWeight: 600 }}>{Math.round(camera.zoom * 100)}</span>
        <span style={{ opacity: 0.5, marginLeft: 2 }}>%</span>
      </div>

      {/* ── Title ── */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        textAlign: "right", lineHeight: 1.6, fontFamily: UI_FONT,
      }}>
        <div style={{ color: C.accent, fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>
          KHAOS-Planes
        </div>
        <div style={{ color: C.textDim, fontSize: 10, opacity: 0.6, marginTop: 2 }}>
          scroll · drag · dbl-click
        </div>
      </div>

      {/* ── Context menu ── */}
      {contextMenu && (
        <div style={{
          position: "absolute", left: contextMenu.x, top: contextMenu.y,
          ...panelStyle, padding: 4, minWidth: 150, zIndex: 100,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          {[
            { label: "Edit", action: () => { setEditing(contextMenu.nodeId); setEditText(nodes.find(n => n.id === contextMenu.nodeId)?.text || ""); setContextMenu(null); } },
            { label: "Cycle Type", action: cycleType },
            { label: "Delete", action: deleteSelected, danger: true },
          ].map((item) => (
            <button key={item.label} onClick={item.action}
              style={{
                display: "block", width: "100%",
                padding: "7px 14px",
                background: "transparent", border: "none", borderRadius: 0,
                color: item.danger ? C.danger : C.text,
                cursor: "pointer", fontSize: 12,
                fontFamily: UI_FONT, fontWeight: 500,
                textAlign: "left", textTransform: "uppercase", letterSpacing: "0.04em",
                transition: "background 150ms ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.background = item.danger ? "rgba(255,68,68,0.1)" : C.accentDim)}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Help overlay ── */}
      {showHelp && (
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          ...panelStyle, padding: "12px 16px",
          color: C.textDim, fontSize: 11, lineHeight: 1.9,
          maxWidth: 290, boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: C.text, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Controls</span>
            <button onClick={() => setShowHelp(false)}
              style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1, fontFamily: UI_FONT }}>
              ×
            </button>
          </div>
          {[
            ["Select [1]", "click node · drag to move"],
            ["Add [2]",    "click canvas to place"],
            ["Connect [3]","drag node to node"],
            ["Dbl-click",  "edit text (Shift+Enter: newline)"],
            ["Right-click","type cycle · delete"],
            ["Del",        "delete selected"],
          ].map(([key, val]) => (
            <div key={key}>
              <span style={{ color: C.accent, fontWeight: 600 }}>{key}</span>
              <span style={{ opacity: 0.7 }}> — {val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
