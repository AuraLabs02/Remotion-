import React from 'react';
import {Composition} from 'remotion';
import {APIVideo} from './APIVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="APIVideo"
        component={APIVideo}
        durationInFrames={1800} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
