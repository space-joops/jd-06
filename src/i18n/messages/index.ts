import type { LocaleCode } from "../config";
import ar from "./ar";
import de from "./de";
import en from "./en";
import es from "./es";
import fr from "./fr";
import ja from "./ja";
import ko, { type Messages } from "./ko";
import pt from "./pt";
import ru from "./ru";
import zh from "./zh";

export type { Messages };

export const MESSAGES: Record<LocaleCode, Messages> = {
  ko,
  en,
  ar,
  zh,
  ja,
  es,
  fr,
  de,
  pt,
  ru,
};
