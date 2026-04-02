import { Composition } from 'remotion';
import { PromptEngineering } from './PromptEngineering';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromptEngineering"
        component={PromptEngineering}
        durationInFrames={5400}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
