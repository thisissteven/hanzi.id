import { Popover } from "@/components";
import { Slider } from "@/components";
import { useReading } from "@/modules/layout";
import { GaugeIcon } from "lucide-react";
import React from "react";

export function ChangeSpeed() {
  const { speed, changeSpeed } = useReading();

  return (
    <Popover>
      <Popover.Trigger className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200">
        <GaugeIcon size={22} />
      </Popover.Trigger>
      <Popover.Content align="end" className="text-xs sm:text-sm leading-5 text-smokewhite px-2 ">
        <div className="w-80 py-4 px-2">
          <Slider min={0.6} max={3} step={0.2} value={[speed]} onValueChange={(value) => changeSpeed(value[0])} />
        </div>
      </Popover.Content>
    </Popover>
  );
}
