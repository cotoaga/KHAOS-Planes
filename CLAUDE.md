# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

This is a single-file React component (`khaos-planes.jsx`) with no build system. To run it, drop it into any React environment that supports JSX imports — e.g., a Vite or Create React App scaffold, or use it as a component in a larger project. There are no scripts, tests, or package.json in this repo.

## Architecture

Everything lives in `khaos-planes.jsx` — one default-exported React component (`KhaosPlanes`), ~750 lines.

**Coordinate system:** Two spaces — world space (node positions, stable regardless of pan/zoom) and screen space (pixels on the viewport). `screenToWorld` and `worldToScreen` convert between them using the `camera` state `{ x, y, zoom }`. The camera origin maps to the center of the viewport, not the top-left.

**Rendering:** The entire canvas is an SVG overlay. `renderGrid()`, `renderConnections()`, and `renderNodes()` return SVG elements positioned in screen space via `worldToScreen`. Node editing uses a `<foreignObject>` containing a `<textarea>` embedded in the SVG.

**State model:**
- `nodes[]` — array of `{ id, x, y, text, type, w, h }` in world coordinates
- `connections[]` — array of `{ id, from, to }` referencing node IDs
- `camera` — pan/zoom state
- `tool` — active tool: `"select"` | `"add"` | `"connect"`
- `dragging`, `panning`, `connecting`, `editing` — transient interaction states

**Node sizing:** Calculated dynamically from text content in `commitEdit()` — width from longest line × 10 + 40, height from line count × 24 + 36, with minimums of 140×60.

**Interaction flow:** All pointer events are on the root `<div>` container (not individual nodes). `handlePointerDown` branches on `tool` and hit-tests via `getNodeAt`. Hit-testing iterates nodes in reverse z-order (last = topmost).

**No persistence:** State is ephemeral — resets on page reload. There is no save/load mechanism.

## Domain Language

This tool is part of the KHAOS ecosystem. The node types have specific cosmological meaning defined in `KHAOS-COSMOLOGY.md`:
- **Warren** — bounded operational theater (project/platform)
- **Manifold** — specialized cognitive agent with cross-Warren identity
- **Dark Attractor** — invisible gravitational influence that shapes output without appearing in it
- **House** — political/operational power unit
- **Concept** — generic knowledge node
- **Note** — lightweight annotation

The color assignments for node types are intentional and cosmologically load-bearing (see KHAOS-COSMOLOGY.md § Color Cosmology). Do not change them arbitrarily.

## Design System

When building UI for this project, follow `COTOAGA-DESIGN-SYSTEM.md`. Key constraints:
- 8px spacing grid (`--space-xs: 4px` through `--space-3xl: 64px`)
- Font: `'JetBrains Mono', 'SF Mono', monospace` (already used throughout)
- Dark theme palette defined in the `COLORS` constant at the top of `khaos-planes.jsx`
