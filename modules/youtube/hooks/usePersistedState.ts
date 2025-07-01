"use client";
import { useEffect, useState } from "react";

export function usePersistedState<T>(key: string, defaultValue: T) {
	const [value, setValue] = useState<T>(() => {
		if (typeof window === "undefined") return defaultValue;
		try {
			const stored = localStorage.getItem(key);
			return stored ? (JSON.parse(stored) as T) : defaultValue;
		} catch {
			return defaultValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {
			// fail silently
		}
	}, [key, value]);

	return [value, setValue] as const;
}
