declare namespace ConsolePro {
  export interface InspectOptions {
    showHidden?: boolean;
    depth?: number | null;
    colors?: boolean;
    customInspect?: boolean;
    showProxy?: boolean;
    maxArrayLength?: number | null;
    breakLength?: number;
  }
  export type ConsoleOptions = {
    auto_reduce_indent?: boolean;
    silence?: boolean;
    date_format?: string;
    time_fixed?: number;
    namespace?: string;
    stdout?: NodeJS.WriteStream;
    stderr?: NodeJS.WriteStream;
  };
  export type MenuConfig = {
    isChild?: boolean;
    waiting_msg?: string;
    useArrowKeys_msg?: string;
  };
  export type MenuOption = {
    key?: string | number;
    name: string;
    value: any;
  };
  //   type AllArgument<T> = T extends (...args: infer U) => any ? U : any;
}
interface Date {
  __hrt: [number, number];
}
