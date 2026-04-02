"use client";

import * as React from "react";

import { defaultLocale, type Locale, locales } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { TranslationKey } from "@/i18n/translations";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function I18nProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialMessages: Messages;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(
    initialLocale ?? defaultLocale,
  );
  const [messages, setMessages] = React.useState<Messages>(initialMessages);

  // Hydration-safe locale init from client storage/browser preferences.
  React.useEffect(() => {
    const stored = window.localStorage.getItem("locale");
    const candidate =
      (stored && isLocale(stored) && stored) ||
      (isLocale(navigator.language.slice(0, 2)) ? (navigator.language.slice(0, 2) as Locale) : null);

    if (candidate && candidate !== locale) {
      setLocale(candidate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("locale", next);
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;

    // Keep messages in sync on the client without an extra request.
    // (Since this app ships both dictionaries, this is fine for "basic" i18n.)
    void import("@/i18n/messages").then(({ getMessages }) => {
      setMessages(getMessages(next));
    });
  }, []);

  const t = React.useCallback(
    (key: TranslationKey) => messages[key] ?? key,
    [messages],
  );

  const value = React.useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

