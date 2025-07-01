"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { useSubtitleSettings } from "../../provider/subtitle-settings";
import { Switch } from "@/components/switch";

export function SubtitleSettings() {
  const {
    colorBy,
    setColorBy,
    colorMode,
    setColorMode,
    videoSize,
    setVideoSize,
    audioOnly,
    setAudioOnly,
    showPinyin,
    setShowPinyin,
    showTranslation,
    setShowTranslation,
  } = useSubtitleSettings();

  return (
    <div className="max-w-4xl mx-auto max-md:rounded-none max-md:shadow-none max-md:p-3">
      <p>Subtitle Settings</p>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 mt-2">
        {/* Left side: Color mode */}
        <div className="flex flex-wrap gap-2 items-center">
          <p className="shrink-0">Color by:</p>
          <Select value={colorBy} onValueChange={(v) => setColorBy(v as any)}>
            <SelectTrigger id="size" className="mt-2 min-w-[140px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Color</SelectItem>
              <SelectItem value="pos">Part of Speech</SelectItem>
              <SelectItem value="freq">Vocabulary Level</SelectItem>
            </SelectContent>
          </Select>

          <p className="shrink-0">Video Size</p>
          <Select value={videoSize} onValueChange={(v) => setVideoSize(v as any)}>
            <SelectTrigger id="size" className="mt-2 min-w-[140px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="half-screen">Half Screen</SelectItem>
              <SelectItem value="full-screen">Full Screen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: Extra config toggles */}
        <div className="flex flex-wrap w-full gap-4 items-center">
          <div className="flex justify-between shrink-0 w-full gap-2">
            <p>Underline</p>
            <Switch
              checked={colorMode === "underline"}
              onCheckedChange={(v) => setColorMode(v ? "underline" : "text")}
            />
          </div>

          <div className="flex justify-between shrink-0 w-full gap-2">
            <p>Audio Only</p>
            <Switch checked={audioOnly} onCheckedChange={(v) => setAudioOnly(v)} />
          </div>

          <div className="flex justify-between shrink-0 w-full gap-2">
            <p>Show Translation</p>
            <Switch checked={showTranslation} onCheckedChange={(v) => setShowTranslation(v)} />
          </div>

          <div className="flex justify-between shrink-0 w-full gap-2">
            <p>Show Transliteration</p>
            <Switch checked={showPinyin} onCheckedChange={(v) => setShowPinyin(v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
