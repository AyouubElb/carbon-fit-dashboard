import { useEffect, useState } from "react";

/**
 * Debounces a value by delaying updates until the user stops typing.
 *
 * **Purpose:** Prevents excessive API calls during user input (e.g., search)
 *
 * **How it works:**
 * 1. User types "BMW" → triggers 3 immediate updates: "B", "BM", "BMW"
 * 2. This hook waits 300ms after LAST keystroke
 * 3. Only then returns "BMW" → triggers single API call
 *
 * **Example:**
 * ```tsx
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebouncedValue(search, 300);
 *
 * // API call only happens 300ms after user stops typing
 * useOrders({ search: debouncedSearch });
 * ```
 *
 * @param value - The value to debounce (e.g., search input)
 * @param delay - Milliseconds to wait (default: 500ms)
 * @returns Debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timer if value changes before delay completes
    // This is the "debouncing" - cancels previous timer on each keystroke
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
