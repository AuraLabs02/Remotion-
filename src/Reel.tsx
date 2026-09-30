import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Soundtrack} from './audio/Soundtrack';
import {b} from './config/timing';
import {Hud} from './fx/Hud';
import {Finish} from './fx/Stage';
import {BrowserAct} from './scenes/BrowserAct';
import {Drop} from './scenes/Drop';
import {Hook} from './scenes/Hook';
import {Outro} from './scenes/Outro';
import {Perks} from './scenes/Perks';

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={b(8)} name="Hook">
        <Hook />
      </Sequence>
      <Sequence from={b(8)} durationInFrames={b(36)} name="Browser act">
        <BrowserAct />
      </Sequence>
      <Sequence from={b(44)} durationInFrames={b(12)} name="Drop">
        <Drop />
      </Sequence>
      <Sequence from={b(56)} durationInFrames={b(12)} name="Perks">
        <Perks />
      </Sequence>
      <Sequence from={b(68)} durationInFrames={b(12)} name="Outro">
        <Outro />
      </Sequence>
      <Hud frame={frame} />
      <Finish frame={frame} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
