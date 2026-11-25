# Handover — Frontend Engineering Guidelines

## 1. Design System & Tokens

Handover utilizes a minimalist, professional SaaS design inspired by Linear, Notion, Apple, and Stripe.

- **Base Background**: `#F8FAFC` (Slate 50)
- **Cards & Surfaces**: `#FFFFFF` (Pure white) with 1px border `#E2E8F0` and subtle elevation (`shadow-xs`)
- **Primary Accent**: `#4F46E5` (Indigo 600)
- **Primary Text**: `#1E293B` (Slate 800)
- **Secondary Text**: `#64748B` (Slate 500)
- **Success / Warning / Danger**: `#16A34A` / `#D97706` / `#DC2626`
- **Font Stack**: Inter & Manrope system font scale with crisp tabular numeric typography (`font-mono`) for marks and roll numbers.

---

## 2. Mandatory 4-State Data Representation

Every data-driven screen and table in Handover MUST handle all 4 fundamental states:

1. **Loading State**: Render bone skeletons (`Skeleton`) that preserve layout geometry without content shifts.
2. **Empty State**: Friendly visual icon, clear explanatory title, and a direct primary action button (e.g. "Add Student" or "Create Section").
3. **Error State**: Non-blocking alert badge with human-readable error description and a **Retry** action.
4. **Success / Populated State**: Dense, readable tables and cards with interactive hover states and quick actions.

---

## 3. Spreadsheet Ergonomics

- **Keyboard Traversal**:
  - <kbd>Tab</kbd>: Advance horizontally to next mark column.
  - <kbd>Shift</kbd>+<kbd>Tab</kbd>: Step back to previous mark cell.
  - <kbd>Enter</kbd>: Commit current cell and move down to next student row.
  - <kbd>Escape</kbd>: Discard active edit and reset to previous value.
- **Column Freezing**:
  - Sticky `left-0` for Roll Number and `left-16` for Student Name to preserve student context when scrolling horizontally on mobile or laptop displays.
- **Feedback Loop**:
  - Save status indicator (`Saving...` $\to$ `Saved just now` $\to$ `All changes saved`).

---

## 4. Accessibility (WCAG 2.1 AA Standards)

- Explicit `<label>` or `aria-label` on all input elements.
- High-contrast color ratios $\ge 4.5:1$ for normal text and $\ge 3:1$ for large headings.
- Focus rings: visible `focus:ring-2 focus:ring-indigo-500` outline on all interactive triggers.
- Accessible modals using Radix Dialog primitives that trap focus and dismiss on <kbd>Escape</kbd>.

---

## 5. Client Bundle Secrets Audit Checklist

- [x] Zero API secret keys, service role tokens, or private database passwords bundled into client JS.
- [x] All client environment variables prefixed strictly with `VITE_` and documented in `.env.example`.
