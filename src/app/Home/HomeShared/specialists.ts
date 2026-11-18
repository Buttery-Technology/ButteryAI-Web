export const SPECIALISTS = {
  Contracts: {
    color: "#288ED2",
    glyph: ["M9.3 7h3.5l2.1 2.1V17H9.3z", "M11 12.2h2.2M11 14.5h2.2"],
  },
  Support: {
    color: "#0F9B81",
    glyph: [
      "M7.6 9.1c0-.8.6-1.4 1.4-1.4h6c.8 0 1.4.6 1.4 1.4v4c0 .8-.6 1.4-1.4 1.4h-3.5L9.2 16.4v-1.9h-.2c-.8 0-1.4-.6-1.4-1.4z",
    ],
  },
  Research: {
    color: "#31AFF5",
    glyph: ["M14.4 11.2a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0z", "M13.6 13.6l2.6 2.6"],
  },
  Finance: {
    color: "#D12A89",
    glyph: ["M8 16.4h8M9.6 14.4v-2.6M12 14.4V8.2M14.4 14.4v-4.2"],
  },
  Sales: {
    color: "#755CBA",
    glyph: ["M7.6 15l3-3.1 2 2 3.8-4.3", "M13.6 9.6h2.8v2.8"],
  },
} as const;

export type SpecialistName = keyof typeof SPECIALISTS;
