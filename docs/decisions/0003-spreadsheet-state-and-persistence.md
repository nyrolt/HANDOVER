# ADR 0003: Spreadsheet-First Reactive State and Auto-Save Engine

## Context

Teachers spend significant time updating continuous marks (Internal, Lab, Practical, Project) across 50–100 students per section. Traditional web forms requiring modal popups or explicit "Submit" buttons for every student are sluggish and frustrating. Teachers expect the speed and ergonomics of Google Sheets or Microsoft Excel with keyboard navigation (<kbd>Tab</kbd>, <kbd>Enter</kbd>) and instant auto-calculation.

## Decision

1. We implement an Excel-like interactive spreadsheet grid:
   - Click to edit inline.
   - <kbd>Tab</kbd> navigates horizontally between continuous mark cells; <kbd>Enter</kbd> commits and advances vertically.
   - Automatic live calculation of `total`, `percentage`, and letter `grade`.
   - Frozen/sticky Roll Number and Student Name columns during horizontal scrolling.
2. The state engine triggers debounced background persistence to `localStorage` (and API sync) with a subtle save status indicator (`Saved just now` / `All changes saved`).
3. Inputs are strictly bounded to valid score ranges ($0 \le \text{mark} \le \text{maxMarks}$) with defensive clamping.

## Alternatives Considered

- **Standard modal per student**:
  - _Rejected_: Too slow; updating 50 students would require 50 individual modal interactions.
- **Single massive submit button for the whole table**:
  - _Rejected_: High risk of data loss if a teacher closes the tab without pressing "Save All".

## Consequences

- **Positive**: Exceptional user experience matching teacher expectations, zero data loss, instant recalculation.
- **Negative**: Requires careful cell focus and keyboard event handling to prevent focus jumping.
