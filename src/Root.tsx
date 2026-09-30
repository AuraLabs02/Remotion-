import React from 'react';
import {Composition} from 'remotion';
import {DURATION, FPS, HEIGHT, WIDTH} from './config/timing';
import {Reel} from './Reel';
import './theme/fonts';

export const Root: React.FC = () => (
  <>
    <Composition id="MembershipReel" component={Reel} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
