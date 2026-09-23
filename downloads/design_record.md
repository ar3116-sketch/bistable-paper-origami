# Design development record

23 September 2026

## Kresling

### 01 / Narrow seam

Fabrication problem. The first full-height seam interfered with collapse. The join became a design constraint, rather than something to add after choosing the cylinder.

### 02 / Relief cuts + small tabs

Hand-cutting constraint. A numerical candidate used narrow diamond openings and short tabs. Precise internal cutting and small glue areas were impractical with kitchen scissors, so the next search required a continuous sheet.

### 03 / Two-piece full-facet overlap

Assembly revision. Duplicating a whole triangle replaced the tiny seam tabs. The larger 60 mm design spanned two sheets and still required two body joins; one of its two pieces is pictured.

### 04 / One continuous body

Final physical prototype. Scaling the rim edge to 43 mm and rotating the print by 30° fitted the complete body on Letter paper. One full-triangle overlap closes the cylinder; caps print separately.

## Miura

### 01 / 8 × 8 facet sheet

Folding burden. The large sheet required many coordinated folds. A seeded numerical defect survived, but a direct press-release trial returned to the starting shape. A seeded endpoint did not establish an accessible transition.

### 02 / 12-cell curved lens-box

Manufacturing + model limit. The 4 × 3 design used curved lens creases and glued Miura connectors. It was difficult to score accurately by hand; the full-panel simulations did not switch on release. A smaller diagnostic also failed the clean reverse transition.

### 03 / 6 × 6 straight facets

Refinement check. Straight scoring simplified fabrication. A coarse-model second state disappeared after mesh refinement under the same assumptions. Other thin-sheet cases retained minima, but the finer switching calculation did not converge.

### 04 / One-vertex / 2 × 2 facets

Simplified trial. The 45 mm rhombi retained the Miura vertex while reducing folding work. One illustrative model returned to A; later stiffness choices produced a conditional numerical cycle. The first filmed physical attempt was inconclusive.

### 05 / Diagonal panel hinges

Final physical prototype. Adding P-to-corner creases through B and D divided two rhombi into four triangles. The 65 lb cardstock specimen then showed a visible A → B → A pop-through cycle and retained both configurations after release.

## Evidence

Kresling source: IMG_3887.mov. Miura source: IMG_3942.mov. Both show distinct resting configurations after release. The Miura edit contains one return cycle and two visible pop-through transitions. Timing annotations describe the retained shots; they are not durability measurements. Dimensions are from the final vector layouts. The 65 lb material is confirmed for the Miura; the exact stock of the filmed Kresling was not independently recorded.

Computational history: the initial 8 x 8 Miura seed and loading results, 12-cell lens-box review, 6 x 6 refinement checks, and palm/minimum-vertex calculations were separate models. They cannot be combined into a single validated simulation of the final specimen.
