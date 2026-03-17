import { Audio } from 'expo-av';
import React, { useEffect, useRef } from 'react';

import { AUDIO_MODE } from '../../lib/constants';

export enum ERingerSounds {
	DIALTONE = 'dialtone',
	RINGTONE = 'ringtone'
}

let seq = 0; // monotonic id to ignore stale async completions

const Ringer = React.memo(({ ringer }: { ringer: ERingerSounds }) => {
	const soundRef = useRef<Audio.Sound | null>(null);
	const seqRef = useRef(0);

	useEffect(() => {
		let cancelled = false;
		const thisSeq = ++seq;
		seqRef.current = thisSeq;

		const ensureSound = () => {
			if (!soundRef.current) soundRef.current = new Audio.Sound();
			return soundRef.current;
		};

		const loadAndPlay = async () => {
			try {
				const s = ensureSound();

				// If we were unmounted or superseded, ignore
				if (cancelled || seqRef.current !== thisSeq) return;

				// Set audio mode to play in silent mode on iOS
				await Audio.setAudioModeAsync(AUDIO_MODE);

				const file = ringer === ERingerSounds.DIALTONE ? require('./dialtone.mp3') : require('./ringtone.mp3');

				// Set looping at load to avoid play→loop reordering races
				await s.loadAsync(file, { isLooping: true }, true);

				if (cancelled || seqRef.current !== thisSeq) return;

				await s.playAsync();
			} catch (e) {
				// swallow; component may be unmounted
			}
		};

		loadAndPlay();

		return () => {
			cancelled = true;

			// Stop and unload whatever might have started, ignoring errors
			const s = soundRef.current;
			if (s) {
				(async () => {
					try {
						await s.setIsLoopingAsync(false);
					} catch {}
					try {
						await s.stopAsync();
					} catch {}
					try {
						await s.unloadAsync();
					} catch {}
				})();
			}
		};
	}, [ringer]);

	return null;
});

export default Ringer;
