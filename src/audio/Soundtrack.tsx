import React from 'react';
import {Audio, staticFile} from 'remotion';

// The music and every cue in ./cues.ts are pre-mixed and limited into one
// master by `npm run audio` (scripts/generate_audio.py): consistent loudness,
// no inter-sample overs, identical in Studio preview and in the render.
export const Soundtrack: React.FC = () => <Audio src={staticFile('audio/mix.wav')} />;
