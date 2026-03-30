import { useState, useRef, useCallback, useEffect } from "react";

const COLORS = {
  bg: "#0a0a0f",
  grid: "#1a1a2e",
  gridAccent: "#16213e",
  node: "#12121f",
  nodeBorder: "#2a2a4a",
  nodeSelected: "#7b2ff7",
  text: "#e0e0e8",
  textDim: "#6a6a8a",
  accent: "#7b2ff7",
  accentDim: "#4a1f8a",
  connection: "#3a3a6a",
  connectionActive: "#7b2ff7",
  danger: "#ff4444",
  warren: "rgba(123, 47, 247, 0.06)",
  warrenBorder: "rgba(123, 47, 247, 0.25)",
  attractor: "#ff6b2b",
  attractorGlow: "rgba(255, 107, 43, 0.15)",
  convergence: "#00e5ff",
  convergenceGlow: "rgba(0, 229, 255, 0.1)",
};

const NODE_TYPES = {
  concept: { label: "Concept", color: "#7b2ff7", icon: "◆" },
  warren: { label: "Warren", color: "#00e5ff", icon: "⬡" },
  manifold: { label: "Manifold", color: "#ff6b2b", icon: "🜏" },
  attractor: { label: "Dark Attractor", color: "#ff4444", icon: "◉" },
  house: { label: "House", color: "#ffd700", icon: "♛" },
  note: { label: "Note", color: "#4a6a4a", icon: "▪" },
};

let idCounter = 0;
const genId = () => `n_${++idCounter}_${Date.now()}`;

export default function KhaosPlanes() {
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [nodes, setNodes] = useState([
    {
      id: "root",
      x: 0,
      y: 0,
      text: "KHAOS\nCosmology",
      type: "house",
      w: 180,
      h: 90,
    },
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

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setCamera((c) => ({
        ...c,
        zoom: Math.max(0.1, Math.min(5, c.zoom * delta)),
      }));
    },
    []
  );

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
        if (
          wx >= n.x - n.w / 2 &&
          wx <= n.x + n.w / 2 &&
          wy >= n.y - n.h / 2 &&
          wy <= n.y + n.h / 2
        ) {
          return n;
        }
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
        if (node) {
          setConnecting(node.id);
        }
        return;
      }

      if (tool === "add") {
        const node = getNodeAt(world.x, world.y);
        if (!node) {
          const newNode = {
            id: genId(),
            x: world.x,
            y: world.y,
            text: NODE_TYPES[addType].label,
            type: addType,
            w: 160,
            h: 70,
          };
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
        setDragging({
          nodeId: node.id,
          offsetX: world.x - node.x,
          offsetY: world.y - node.y,
        });
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
            (c) =>
              (c.from === connecting && c.to === target.id) ||
              (c.from === target.id && c.to === connecting)
          );
          if (!exists) {
            setConnections((prev) => [
              ...prev,
              { from: connecting, to: target.id, id: genId() },
            ]);
          }
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
      setConnections((prev) =>
        prev.filter((c) => c.from !== selected && c.to !== selected)
      );
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
        if (e.key === "Escape") {
          commitEdit();
        }
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      } else if (e.key === "Escape") {
        setSelected(null);
        setConnecting(null);
        setTool("select");
      } else if (e.key === "1") setTool("select");
      else if (e.key === "2") setTool("add");
      else if (e.key === "3") setTool("connect");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [editing, commitEdit, deleteSelected]);

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
    for (let x = bigOx - bigSpacing; x < rect.width + bigSpacing; x += bigSpacing) {
      lines.push(
        <line key={`bx${x}`} x1={x} y1={0} x2={x} y2={rect.height} stroke={COLORS.gridAccent} strokeWidth={0.5} />
      );
    }
    for (let y = bigOy - bigSpacing; y < rect.height + bigSpacing; y += bigSpacing) {
      lines.push(
        <line key={`by${y}`} x1={0} y1={y} x2={rect.width} y2={y} stroke={COLORS.gridAccent} strokeWidth={0.5} />
      );
    }
    if (camera.zoom > 0.4) {
      for (let x = ox - spacing; x < rect.width + spacing; x += spacing) {
        lines.push(
          <line key={`sx${x}`} x1={x} y1={0} x2={x} y2={rect.height} stroke={COLORS.grid} strokeWidth={0.3} />
        );
      }
      for (let y = oy - spacing; y < rect.height + spacing; y += spacing) {
        lines.push(
          <line key={`sy${y}`} x1={0} y1={y} x2={rect.width} y2={y} stroke={COLORS.grid} strokeWidth={0.3} />
        );
      }
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
      const isSelected = selected === conn.from || selected === conn.to;
      return (
        <g key={conn.id}>
          <line
            x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
            stroke={isSelected ? COLORS.connectionActive : COLORS.connection}
            strokeWidth={isSelected ? 2 : 1}
            strokeDasharray={isSelected ? "none" : "6 4"}
            opacity={0.7}
          />
          <circle
            cx={(s1.x + s2.x) / 2}
            cy={(s1.y + s2.y) / 2}
            r={3}
            fill={isSelected ? COLORS.connectionActive : COLORS.connection}
          />
        </g>
      );
    });
  };

  const renderNodes = () => {
    return nodes.map((node) => {
      const screen = worldToScreen(node.x, node.y);
      const w = node.w * camera.zoom;
      const h = node.h * camera.zoom;
      const typeInfo = NODE_TYPES[node.type] || NODE_TYPES.concept;
      const isSelected = selected === node.id;
      const isHovered = hoveredNode === node.id;
      const isEditing = editing === node.id;
      const fontSize = Math.max(8, 13 * camera.zoom);
      const iconSize = Math.max(8, 11 * camera.zoom);

      return (
        <g key={node.id}>
          {(node.type === "attractor") && (
            <ellipse
              cx={screen.x} cy={screen.y}
              rx={w * 0.9} ry={h * 0.9}
              fill={COLORS.attractorGlow}
              opacity={0.4 + (isSelected ? 0.3 : 0)}
            />
          )}
          {(node.type === "warren") && (
            <ellipse
              cx={screen.x} cy={screen.y}
              rx={w * 0.85} ry={h * 0.85}
              fill={COLORS.convergenceGlow}
              opacity={0.3 + (isSelected ? 0.2 : 0)}
            />
          )}
          <rect
            x={screen.x - w / 2}
            y={screen.y - h / 2}
            width={w}
            height={h}
            rx={node.type === "warren" ? w * 0.15 : 6}
            ry={node.type === "warren" ? h * 0.15 : 6}
            fill={COLORS.node}
            stroke={isSelected ? typeInfo.color : isHovered ? COLORS.nodeBorder : COLORS.nodeBorder}
            strokeWidth={isSelected ? 2 : 1}
            opacity={0.95}
            style={{ cursor: tool === "connect" ? "crosshair" : "grab" }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          />
          <text
            x={screen.x - w / 2 + 8 * camera.zoom}
            y={screen.y - h / 2 + 14 * camera.zoom}
            fontSize={iconSize}
            fill={typeInfo.color}
            opacity={0.7}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {typeInfo.icon}
          </text>
          {isEditing ? (
            <foreignObject
              x={screen.x - w / 2 + 4}
              y={screen.y - h / 2 + 4}
              width={w - 8}
              height={h - 8}
            >
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commitEdit();
                  }
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: COLORS.text,
                  fontSize: `${fontSize}px`,
                  fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                  resize: "none",
                  padding: "2px",
                  lineHeight: 1.4,
                }}
              />
            </foreignObject>
          ) : (
            node.text.split("\n").map((line, i) => (
              <text
                key={i}
                x={screen.x}
                y={screen.y + (i - (node.text.split("\n").length - 1) / 2) * (fontSize * 1.4)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fontSize}
                fontFamily="'JetBrains Mono', 'SF Mono', monospace"
                fill={COLORS.text}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {line}
              </text>
            ))
          )}
        </g>
      );
    });
  };

  const rect = containerRef.current?.getBoundingClientRect();

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        background: COLORS.bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
        cursor: tool === "add" ? "crosshair" : tool === "connect" ? "crosshair" : panning ? "grabbing" : "default",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {renderGrid()}
        {renderConnections()}
        {renderNodes()}
        {connecting && hoveredNode && hoveredNode !== connecting && (
          <circle
            cx={worldToScreen(nodes.find((n) => n.id === hoveredNode)?.x || 0, nodes.find((n) => n.id === hoveredNode)?.y || 0).x}
            cy={worldToScreen(nodes.find((n) => n.id === hoveredNode)?.x || 0, nodes.find((n) => n.id === hoveredNode)?.y || 0).y}
            r={8}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={2}
            opacity={0.8}
          />
        )}
      </svg>

      {/* Toolbar */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          gap: 4,
          background: "rgba(10,10,15,0.9)",
          border: `1px solid ${COLORS.nodeBorder}`,
          borderRadius: 8,
          padding: 4,
          backdropFilter: "blur(10px)",
        }}
      >
        {[
          { key: "select", label: "Select", shortcut: "1", icon: "↖" },
          { key: "add", label: "Add", shortcut: "2", icon: "+" },
          { key: "connect", label: "Connect", shortcut: "3", icon: "⟶" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTool(t.key)}
            style={{
              padding: "6px 12px",
              background: tool === t.key ? COLORS.accentDim : "transparent",
              border: `1px solid ${tool === t.key ? COLORS.accent : "transparent"}`,
              borderRadius: 6,
              color: tool === t.key ? COLORS.text : COLORS.textDim,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>{t.icon}</span>
            <span>{t.label}</span>
            <span style={{ opacity: 0.4, fontSize: 10 }}>{t.shortcut}</span>
          </button>
        ))}
      </div>

      {/* Node type selector (when add tool active) */}
      {tool === "add" && (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 12,
            display: "flex",
            gap: 4,
            background: "rgba(10,10,15,0.9)",
            border: `1px solid ${COLORS.nodeBorder}`,
            borderRadius: 8,
            padding: 4,
            backdropFilter: "blur(10px)",
            flexWrap: "wrap",
            maxWidth: 360,
          }}
        >
          {Object.entries(NODE_TYPES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setAddType(key)}
              style={{
                padding: "4px 10px",
                background: addType === key ? `${info.color}22` : "transparent",
                border: `1px solid ${addType === key ? info.color : "transparent"}`,
                borderRadius: 5,
                color: addType === key ? info.color : COLORS.textDim,
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Zoom indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          color: COLORS.textDim,
          fontSize: 11,
          fontFamily: "inherit",
          background: "rgba(10,10,15,0.8)",
          padding: "4px 10px",
          borderRadius: 6,
          border: `1px solid ${COLORS.nodeBorder}`,
        }}
      >
        {Math.round(camera.zoom * 100)}%
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          color: COLORS.textDim,
          fontSize: 11,
          fontFamily: "inherit",
          textAlign: "right",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: COLORS.accent, fontSize: 13 }}>KHAOS-Planes</span>
        <br />
        <span style={{ opacity: 0.5 }}>
          scroll: zoom · drag: pan · dbl-click: edit
        </span>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: "absolute",
            left: contextMenu.x,
            top: contextMenu.y,
            background: "rgba(10,10,15,0.95)",
            border: `1px solid ${COLORS.nodeBorder}`,
            borderRadius: 8,
            padding: 4,
            backdropFilter: "blur(10px)",
            minWidth: 150,
            zIndex: 100,
          }}
        >
          {[
            { label: "Edit", action: () => { setEditing(contextMenu.nodeId); setEditText(nodes.find(n => n.id === contextMenu.nodeId)?.text || ""); setContextMenu(null); } },
            { label: "Cycle Type", action: cycleType },
            { label: "Delete", action: deleteSelected, danger: true },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: "block",
                width: "100%",
                padding: "6px 12px",
                background: "transparent",
                border: "none",
                borderRadius: 4,
                color: item.danger ? COLORS.danger : COLORS.text,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.target.style.background = "rgba(123,47,247,0.1)")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Help overlay */}
      {showHelp && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            background: "rgba(10,10,15,0.9)",
            border: `1px solid ${COLORS.nodeBorder}`,
            borderRadius: 8,
            padding: "10px 14px",
            backdropFilter: "blur(10px)",
            color: COLORS.textDim,
            fontSize: 11,
            lineHeight: 1.8,
            maxWidth: 280,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ color: COLORS.text, fontSize: 12 }}>Controls</span>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                background: "transparent",
                border: "none",
                color: COLORS.textDim,
                cursor: "pointer",
                fontSize: 14,
                padding: 0,
              }}
            >
              ×
            </button>
          </div>
          <div><span style={{ color: COLORS.accent }}>Select [1]</span> — click node, drag to move</div>
          <div><span style={{ color: COLORS.accent }}>Add [2]</span> — click canvas to place</div>
          <div><span style={{ color: COLORS.accent }}>Connect [3]</span> — drag node to node</div>
          <div><span style={{ color: COLORS.accent }}>Dbl-click</span> — edit text (Shift+Enter: newline)</div>
          <div><span style={{ color: COLORS.accent }}>Right-click</span> — context menu (type, delete)</div>
          <div><span style={{ color: COLORS.accent }}>Del</span> — delete selected</div>
        </div>
      )}
    </div>
  );
}
