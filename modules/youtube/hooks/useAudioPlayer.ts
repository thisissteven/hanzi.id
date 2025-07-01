"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseAudioPlayerReturn {
	play: () => void;
	pause: () => void;
	stop: () => void;
	audio: HTMLAudioElement | null;
}

/**
 * Hook to play audio automatically when audioDataUrl changes, and also provide manual controls.
 */
export function useAudioPlayer(audioDataUrl?: string, autoPlay: boolean = true): UseAudioPlayerReturn {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Create or update the audio element when dataUrl changes
	useEffect(() => {
		if (!audioDataUrl) return;

		// Stop and cleanup previous audio
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = "";
		}

		const audio = new Audio(audioDataUrl);
		audioRef.current = audio;

		if (autoPlay) {
			audio.play().catch((err) => {
				console.error("Auto playback failed:", err);
			});
		}

		// Optional: cleanup on unmount
		return () => {
			audio.pause();
			audio.src = "";
		};
	}, [audioDataUrl, autoPlay]);

	// Manual control methods
	const play = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.play().catch((err) => {
				console.error("Manual playback failed:", err);
			});
		}
	}, []);

	const pause = useCallback(() => {
		audioRef.current?.pause();
	}, []);

	const stop = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
	}, []);

	return {
		play,
		pause,
		stop,
		audio: audioRef.current,
	};
}
