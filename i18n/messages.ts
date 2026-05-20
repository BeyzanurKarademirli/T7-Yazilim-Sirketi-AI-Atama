import type { Locale } from "@/i18n/config";
import { translations, type TranslationKey } from "@/i18n/translations";

export type Messages = Record<TranslationKey, string>;

export function getMessages(locale: Locale): Messages {
  return translations[locale] as Messages;
}

