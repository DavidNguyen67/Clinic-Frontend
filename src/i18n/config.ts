export const languages = [
  {
    code: "en",
    label: "English",
    shortCode: "EN",
  },
  {
    code: "vi",
    label: "Tiếng Việt",
    shortCode: "VI",
  },
];

export type LanguageCode = (typeof languages)[number]["code"];
