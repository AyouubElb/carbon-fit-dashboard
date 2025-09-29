// hooks/useEditedFields.ts
import { useCallback, useRef, useState } from "react";

/**
 * Track edited fields on an object and return only changed fields.
 * Accepts any object-like T (no index signature required).
 */
export function useEditedFields<T extends object>(initial?: T | null) {
  type Key = Extract<keyof T, string>;

  const initialRef = useRef<T | null>(initial ?? null);
  const [current, setCurrent] = useState<T | null>(initial ?? null);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());

  const reset = useCallback((next?: T | null) => {
    initialRef.current = next ?? null;
    setCurrent(next ?? null);
    setDirtyKeys(new Set());
  }, []);

  // onChange accepts a key (one of T's keys) and a value of that property's type
  const onChange = useCallback((key: Key, value: T[Key]) => {
    setCurrent((prev) => {
      const next = { ...(prev ?? {}) } as T;
      // assign using index signature cast
      (next as Record<string, unknown>)[key] = value as unknown;

      // compare with initialRef to see if key is dirty
      const initVal = initialRef.current
        ? (initialRef.current as Record<string, unknown>)[key]
        : undefined;

      const bothNumbers =
        typeof initVal === "number" && typeof value === "number";

      const isDirty = !(
        initVal === (value as unknown) ||
        (bothNumbers &&
          Number.isNaN(initVal as number) &&
          Number.isNaN(value as number))
      );

      setDirtyKeys((s) => {
        const copy = new Set(s);
        if (isDirty) copy.add(key);
        else copy.delete(key);
        return copy;
      });

      return next;
    });
  }, []);

  // returns only changed fields (shallow) or null if nothing changed
  const getChanges = useCallback((): Partial<T> | null => {
    if (!current || !initialRef.current) return current ?? null;

    const out: Partial<T> = {};
    const currRec = current as Record<string, unknown>;

    dirtyKeys.forEach((k) => {
      const kk = k as Key;
      (out as Record<string, unknown>)[kk] = currRec[kk];
    });

    return Object.keys(out).length ? out : null;
  }, [current, dirtyKeys]);

  return {
    current,
    reset,
    onChange,
    getChanges,
    isDirty: dirtyKeys.size > 0,
    dirtyKeys,
  };
}
