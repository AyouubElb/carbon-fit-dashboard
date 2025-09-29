// hooks/useEditedFields.ts
import { useCallback, useRef, useState } from "react";

export function useEditedFields<T extends Record<string, any>>(
  initial?: T | null
) {
  const initialRef = useRef<T | null>(initial ?? null);
  const [current, setCurrent] = useState<T | null>(initial ?? null);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());

  // call this when the initial object changes (e.g., opening modal with new row)
  const reset = useCallback((next?: T | null) => {
    initialRef.current = next ?? null;
    setCurrent(next ?? null);
    setDirtyKeys(new Set());
  }, []);

  const onChange = useCallback((key: keyof T, value: any) => {
    setCurrent((prev) => {
      const next = { ...(prev ?? {}), [key as string]: value } as T;
      // compare with initialRef to see if key is dirty
      const initVal = initialRef.current
        ? (initialRef.current as any)[key as string]
        : undefined;
      const isDirty = !(
        initVal === value ||
        (Number.isNaN(initVal) && Number.isNaN(value))
      );
      setDirtyKeys((s) => {
        const copy = new Set(s);
        if (isDirty) copy.add(key as string);
        else copy.delete(key as string);
        return copy;
      });
      return next;
    });
  }, []);

  // returns only changed fields (shallow)
  const getChanges = useCallback(() => {
    if (!current || !initialRef.current) return current ?? null;
    const out: Partial<T> = {};
    dirtyKeys.forEach((k) => {
      (out as any)[k] = (current as any)[k];
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
