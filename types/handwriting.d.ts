// handwriting.d.ts
declare namespace handwriting {
  interface Options {
    width?: number;
    height?: number;
    language?: string;
    numOfWords?: number;
    numOfReturn?: number;
  }

  interface CanvasOptions {
    cvs: HTMLCanvasElement;
    lineWidth?: number;
  }

  class Canvas {
    constructor(cvs: HTMLCanvasElement, lineWidth?: number);
    set_Undo_Redo(undo: boolean, redo: boolean): void;
    setLineWidth(lineWidth: number): void;
    setCallBack(callback: (results: string[], error?: Error) => void): void;
    setOptions(options: Options): void;
    mouseDown(e: MouseEvent): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(): void;
    touchStart(e: TouchEvent): void;
    touchMove(e: TouchEvent): void;
    touchEnd(e: TouchEvent): void;
    undo(): void;
    redo(): void;
    erase(): void;
  }

  function recognize(trace: number[][][], options: Options, callback: (results: string[], error?: Error) => void): void;
}

interface Window {
  handwriting: typeof handwriting;
}
