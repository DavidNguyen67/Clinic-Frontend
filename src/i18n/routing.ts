import { defineRouting } from "next-intl/routing";

import { languages } from "./config";

export const routing = defineRouting({
  locales: languages.map((lang) => lang.code),

  defaultLocale: languages[0].code,

  localeDetection: true,

  localeCookie: {
    name: "USER_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});
