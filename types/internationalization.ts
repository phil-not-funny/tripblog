export const Locale = {
  EN: "en",
  DE: "de",
} as const;
export type Locale = (typeof Locale)[keyof typeof Locale];
