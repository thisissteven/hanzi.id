import { Popover } from "@/components";
import { Slider } from "@/components";
import { useReading } from "@/modules/layout";
import { GaugeIcon, RabbitIcon, TurtleIcon } from "lucide-react";
import React from "react";

export function ChangeSpeed() {
  const { speed, changeSpeed } = useReading();

  return (
    <Popover>
      <Popover.Trigger className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200">
        <GaugeIcon size={22} />
      </Popover.Trigger>
      <Popover.Content
        align="end"
        className="text-xs sm:text-sm leading-5 text-smokewhite px-2 w-screen max-w-[calc(100vw-2rem)] sm:max-w-80"
      >
        <div className="w-full py-4 px-2 flex items-center gap-3">
          <button onClick={() => changeSpeed(Math.max(0.6, speed - 0.1))}>
            <TurtleIcon size={22} className="shrink-0 max-[320px]:hidden" />
          </button>
          <Slider min={0.6} max={3} step={0.1} value={[speed]} onValueChange={(value) => changeSpeed(value[0])} />
          <button onClick={() => changeSpeed(Math.min(3, speed + 0.1))}>
            <RabbitIcon size={22} className="shrink-0 max-[320px]:hidden" />
          </button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
