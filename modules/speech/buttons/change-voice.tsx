import { Drawer, Popover } from "@/components";
import { Slider } from "@/components";
import { useWindowSize } from "@/hooks";
import { useReading } from "@/modules/layout";
import { cn } from "@/utils";
import { CheckIcon, GaugeIcon, RabbitIcon, SpeechIcon, TurtleIcon } from "lucide-react";
import React from "react";

export function ChangeVoice({
  voices,
  changeVoice,
}: {
  voices: SpeechSynthesisVoice[];
  changeVoice: (voice: SpeechSynthesisVoice) => void;
}) {
  const [selectedVoice, setSelectedVoice] = React.useState<SpeechSynthesisVoice | null>(null);

  const { width } = useWindowSize();

  const isMobile = width < 640;

  if (isMobile) {
    return (
      <Drawer direction="bottom">
        <Drawer.Trigger className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200">
          <SpeechIcon size={22} />
        </Drawer.Trigger>
        <Drawer.Content className="text-xs sm:text-sm leading-5 text-smokewhite px-2 w-full">
          {voices.map((voice, index) => {
            const isSelected = !selectedVoice ? index === 0 : selectedVoice?.name === voice.name;
            return (
              <Drawer.Close
                key={voice.name}
                onClick={() => {
                  setSelectedVoice(voice);
                  changeVoice(voice);
                }}
                className="text-sm text-left font-light hover:bg-zinc active:bg-zinc w-full py-4 px-2 flex items-center gap-3 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <CheckIcon size={22} className={cn(isSelected ? "opacity-100" : "opacity-0")} />
                  <div>{voice.name}</div>
                </div>
              </Drawer.Close>
            );
          })}
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Popover>
      <Popover.Trigger className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200">
        <SpeechIcon size={22} />
      </Popover.Trigger>
      <Popover.Content
        align="end"
        className="text-xs sm:text-sm leading-5 text-smokewhite px-2 w-screen max-w-[calc(100vw-2rem)] sm:max-w-80"
      >
        {voices.map((voice, index) => {
          const isSelected = !selectedVoice ? index === 0 : selectedVoice?.name === voice.name;

          return (
            <Popover.Item
              key={voice.name}
              onSelect={() => {
                setSelectedVoice(voice);
                changeVoice(voice);
              }}
              className="w-full py-4 px-2 flex items-center gap-3 rounded-md"
            >
              <div className="flex items-center gap-2">
                <CheckIcon size={22} className={cn(isSelected ? "opacity-100" : "opacity-0")} />
                <div>{voice.name}</div>
              </div>
            </Popover.Item>
          );
        })}
      </Popover.Content>
    </Popover>
  );
}
