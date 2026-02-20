---
status: testing
phase: 04-depth-layers-content-integration
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md]
started: 2026-02-21T18:45:00Z
updated: 2026-02-21T18:45:00Z
---

## Current Test

number: 1
name: Concept Tooltip on Discovered Element
expected: |
  In Crystal Lab, achieve a discovery (rotate a polarizer to observe intensity change).
  Then hover over the polarizer — a small tooltip appears near the element showing
  the concept name (e.g. "马吕斯定律" / "Malus's Law") and "深入了解" / "Learn more".
  Tooltip has dark semi-transparent background with white text.
awaiting: user response

## Tests

### 1. Concept Tooltip on Discovered Element
expected: In Crystal Lab, achieve a discovery (rotate polarizer), then hover over it. Tooltip appears near the element with concept name + "深入了解" / "Learn more".
result: [pending]

### 2. Depth Panel Slide-in
expected: Click the tooltip "深入了解". A panel slides in from the right side (~65% viewport width) with smooth spring animation (~0.7s). The world behind is visible but dimmed and blurred.
result: [pending]

### 3. Qualitative Content Layer (Default Tab)
expected: Panel shows concept name as header with a brief intuition intro. Default tab is "理解 / Understanding" showing an SVG physics diagram (e.g. Malus's Law with polarizer and intensity arrows) with subtle animation, plus bilingual explanation text below.
result: [pending]

### 4. Quantitative Content Layer (Formula Tab)
expected: Switch to "数学 / Mathematics" tab. KaTeX-rendered formulas appear in styled cards (e.g. I = I₀cos²θ for Malus's Law). Formulas have labels. If derivation exists, a collapsible "展开推导" section can be toggled.
result: [pending]

### 5. Panel Dismiss Methods
expected: All three dismiss methods work: (1) Press Escape key — panel closes. (2) Click the × close button — panel closes. (3) Click the dimmed backdrop area — panel closes. Each with smooth exit animation.
result: [pending]

### 6. Demo Explorer with Bidirectional Sync
expected: Open Malus's Law depth panel, switch to "探索 / Explore" tab. An interactive SVG demo loads with an angle slider (0-360°) and intensity curve. Dragging the slider updates the SVG visualization AND rotates the polarizer in the isometric scene behind the dimmed panel.
result: [pending]

### 7. Invisible Gating (No Tooltip on Undiscovered)
expected: Hover over an optical element whose associated concept has NOT been discovered yet. No tooltip appears — the element behaves as before (hover glow only, no "Learn more").
result: [pending]

### 8. WorldMap Constellation Nodes
expected: After making at least one discovery, open WorldMap (M key). Small colored dots appear within region shapes representing discovered concepts. Hovering a dot shows the concept name as a tooltip. Connection lines between related concepts are visible with different styles (solid/amber for causal, dashed/blue for analogous, dotted/rose for contrasting).
result: [pending]

### 9. Constellation Node → Depth Panel
expected: On the WorldMap, click a discovered concept dot. The WorldMap closes and the depth panel slides in showing that concept's content.
result: [pending]

### 10. WorldMap/DepthPanel Mutual Exclusivity
expected: With the depth panel open, press M to open WorldMap. The depth panel closes and WorldMap opens. Conversely, from WorldMap click a concept node — WorldMap closes and depth panel opens. Only one overlay is visible at a time.
result: [pending]

## Summary

total: 10
passed: 0
issues: 0
pending: 10
skipped: 0

## Gaps

[none yet]
