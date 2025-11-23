import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(() => ({
  // Corpse File - Overridden in layout
  locale: "en",
  messages: {},
}));
