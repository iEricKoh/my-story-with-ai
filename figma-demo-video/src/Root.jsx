import { Composition } from "remotion";
import { FigmaDevModeDemo } from "./FigmaDevModeDemo";
import { FigmaToCodeDemo } from "./FigmaToCodeDemo";
import { TaskBreakdownDemo } from "./TaskBreakdownDemo";
import { QAHandoffDemo } from "./QAHandoffDemo";
import { TypelessDemo, TypelessNaturalSpeech, TypelessAskAnything, TypelessTranslation } from "./TypelessDemo";
import { PRGeneratorDemo } from "./PRGeneratorDemo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="FigmaDevModeDemo"
        component={FigmaDevModeDemo}
        durationInFrames={340}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FigmaToCodeDemo"
        component={FigmaToCodeDemo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TaskBreakdownDemo"
        component={TaskBreakdownDemo}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="QAHandoffDemo"
        component={QAHandoffDemo}
        durationInFrames={990}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PRGeneratorDemo"
        component={PRGeneratorDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TypelessDemo"
        component={TypelessDemo}
        durationInFrames={580}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TypelessNaturalSpeech"
        component={TypelessNaturalSpeech}
        durationInFrames={290}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TypelessAskAnything"
        component={TypelessAskAnything}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TypelessTranslation"
        component={TypelessTranslation}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
