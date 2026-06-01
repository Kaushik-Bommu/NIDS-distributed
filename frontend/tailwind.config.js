export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
              "on-primary-container": "#107100",
              "inverse-surface": "#dae3ee",
              "error-container": "#93000a",
              "tertiary": "#fff8f7",
              "on-background": "#dae3ee",
              "secondary-fixed": "#9cf0ff",
              "tertiary-fixed": "#ffdad6",
              "primary": "#efffe3",
              "on-tertiary-fixed": "#2c1513",
              "on-tertiary-fixed-variant": "#5d3f3c",
              "secondary": "#bdf4ff",
              "background": "#0b141c",
              "inverse-on-surface": "#29313a",
              "surface-container-low": "#141c24",
              "on-primary": "#053900",
              "on-surface-variant": "#baccb0",
              "on-secondary-fixed-variant": "#004f58",
              "surface-dim": "#0b141c",
              "error": "#ffb4ab",
              "surface-variant": "#2d363e",
              "on-secondary-fixed": "#001f24",
              "surface-tint": "#2ae500",
              "surface-container-lowest": "#060f16",
              "tertiary-container": "#ffd3ce",
              "on-surface": "#dae3ee",
              "primary-fixed": "#79ff5b",
              "surface-container": "#182028",
              "primary-container": "#39ff14",
              "on-primary-fixed-variant": "#095300",
              "on-tertiary": "#442927",
              "surface-container-highest": "#2d363e",
              "surface-bright": "#313a43",
              "on-tertiary-container": "#7a5955",
              "on-secondary-container": "#00616d",
              "on-error": "#690005",
              "inverse-primary": "#106e00",
              "secondary-container": "#00e3fd",
              "primary-fixed-dim": "#2ae500",
              "outline": "#85967c",
              "on-primary-fixed": "#022100",
              "surface": "#0b141c",
              "outline-variant": "#3c4b35",
              "tertiary-fixed-dim": "#e7bdb8",
              "surface-container-high": "#222b33",
              "on-error-container": "#ffdad6",
              "on-secondary": "#00363d",
              "secondary-fixed-dim": "#00daf3"
      },
      "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
      },
      "spacing": {
              "gutter": "16px",
              "margin-mobile": "16px",
              "base": "4px",
              "margin-desktop": "32px",
              "container-max": "1440px"
      },
      "fontFamily": {
              "headline-lg-mobile": ["Hanken Grotesk"],
              "body-md": ["Hanken Grotesk"],
              "display-lg": ["Hanken Grotesk"],
              "headline-lg": ["Hanken Grotesk"],
              "label-sm": ["JetBrains Mono"],
              "data-mono": ["JetBrains Mono"]
      },
      "fontSize": {
              "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
              "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
              "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "600"}],
              "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
              "data-mono": ["14px", {"lineHeight": "20px", "fontWeight": "450"}]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
