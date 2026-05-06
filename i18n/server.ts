import "server-only";

import { cookies } from "next/headers";

import { defaultLocale, type Locale, locales } from "@/i18n/config";
import { getMessages, type Messages } from "@/i18n/messages";

export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  if (raw && (locales as readonly string[]).includes(raw)) return raw as Locale;
  return defaultLocale;
}

export async function getI18n(): Promise<{ locale: Locale; messages: Messages }> {
  const locale = await getLocaleFromCookies();
  return { locale, messages: getMessages(locale) };
}

