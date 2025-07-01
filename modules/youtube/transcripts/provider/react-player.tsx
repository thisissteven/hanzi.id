"use client";

import { createContext, useContext } from "react";

interface ReactPlayerContextType {
	onTimestampClick: (start: number, end?: number) => void;
}

export const ReactPlayerContext = createContext<ReactPlayerContextType | undefined>(undefined);

export function useReactPlayer() {
	const context = useContext(ReactPlayerContext);
	if (!context) {
		throw new Error("useReactPlayer must be used within a ReactPlayerProvider");
	}
	return context;
}
