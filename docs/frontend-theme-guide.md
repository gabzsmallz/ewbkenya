# Frontend Theme Guide

This guide explains how to change the existing brand theme or add a new one for the EWB Kenya frontend. The current setup is intentionally lightweight: global CSS variables describe the palette and Tailwind exposes them as design tokens.

## 1. Know where the theme lives

| Layer | File | Purpose |
| --- | --- | --- |
| CSS custom properties | [`styles/globals.css`](../styles/globals.css) | Source of truth for brand colors and shared UI patterns such as buttons, cards, and shadows. |
| Tailwind tokens | [`tailwind.config.js`](../tailwind.config.js) | Maps CSS variables to `theme('colors.brand.*')` and `theme('boxShadow.brand')`. |
| Components | `components/**/*.jsx`, `pages/**/*.jsx` | Consume the tokens via Tailwind classes (`text-brand-primary`) or CSS vars (`var(--brand-primary)`). |

## 2. Modifying the existing theme

1. Update the CSS variables inside the `:root` block of `styles/globals.css`. Keep the semantic names (`--brand-primary`, `--brand-accent`, …) so components continue to reference them.
2. Review the derived styles (buttons, cards, gradients) lower in the same file. They frequently use `color-mix` with the root variables; minor palette changes rarely require edits, but drastic shifts might need tuning.
3. Because Tailwind reads from the CSS variables at runtime, you **do not** need to rebuild the design tokens. Just restart `npm run dev` if it is already running so the stylesheet is reloaded.
4. Manually inspect the UI in light and dark contexts to confirm accessible contrast. Aim for WCAG AA (4.5:1 for body text, 3:1 for UI elements). Tools like the built-in browser inspector or [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/) can help.

## 3. Adding a new theme variant

1. **Define a CSS scope.** Create a new class or data-attribute selector in `styles/globals.css` that overrides the root variables:

   ```css
   :root,
   .theme-founders {
     --brand-primary: #294B08;
     --brand-accent:  #3A6223;
     /* ...existing defaults... */
   }

   .theme-solar {
     --brand-primary: #F97316;
     --brand-accent:  #FBBF24;
     --brand-muted:   #FDE68A;
     --brand-bg:      #FFF7ED;
     --brand-tint:    #FED7AA;
     --brand-text:    #1C1917;
   }
   ```

2. **Wrap content with the theme selector.** Apply `className="theme-solar"` on the `<body>` tag (edit `pages/_app.js` if you need a global switch) or on a specific section to scope the palette.
3. **Reuse shared UI styles.** Because the button, card, and section rules consume the variables, they will automatically adopt the new colors.
4. **Toggle dynamically (optional).** Store the user’s choice (e.g., `localStorage`) and add/remove the theme class in a layout component or React context.

## 4. Extending Tailwind tokens

If you introduce new variables (e.g., `--brand-warning`), expose them through Tailwind for ergonomic usage:

```js
// tailwind.config.js
extend: {
  colors: {
    brand: {
      warning: "var(--brand-warning)",
    },
  },
}
```

After editing the config, restart the dev server so Tailwind recompiles (`npm run dev`). You can then use `bg-brand-warning` or `text-brand-warning` in JSX.

## 5. Testing your changes

1. Run the dev server with `npm run dev` and load the site at `http://localhost:3000`.
2. Exercise interactive components (buttons, forms, cards) in every theme to ensure hover/focus states remain legible.
3. Check responsive breakpoints; gradients or shadows may need tweaks on small screens.

## 6. Best practices

- **Keep semantic names.** Avoid hard-coding `--brand-green`; stick to usage-based names (`primary`, `accent`, `text`).
- **Document new tokens.** Update this guide or inline comments whenever you add or repurpose variables.
- **Prefer CSS variables over ad-hoc colors.** This keeps runtime theming possible without rebuilding assets.
- **Be mindful of gradients and `color-mix`.** Large palette shifts may require adjusting percentages for balanced output.

Following the steps above keeps theming predictable and makes it easy for future developers to introduce campaign-specific palettes or seasonal looks without duplicating component logic.
