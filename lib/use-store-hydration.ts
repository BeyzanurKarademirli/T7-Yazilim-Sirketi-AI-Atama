"use client";

import * as React from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
};

export function useStoreHydration(persistApi: PersistApi) {
  const [hydrated, setHydrated] = React.useState(
    persistApi?.hasHydrated?.() ?? false
  );

  React.useEffect(() => {
    if (!persistApi) return;
    const unsub = persistApi.onFinishHydration(() => setHydrated(true));
    setHydrated(persistApi.hasHydrated());
    return unsub;
  }, [persistApi]);

  return hydrated;
}