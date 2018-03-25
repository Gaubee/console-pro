interface InspectOptions {
	showHidden?: boolean;
	depth?: number | null;
	colors?: boolean;
	customInspect?: boolean;
	showProxy?: boolean;
	maxArrayLength?: number | null;
	breakLength?: number;
}
type ConsoleOptions = {
	async_log?: boolean;
	auto_reduce_indent?: boolean;
	silence?: boolean;
};

export declare class ConsolePro {
	constructor(opts?: ConsoleOptions);
	assert(value: any, message?: string, ...optionalParams: any[]): void;
	debug(message?: any, ...optionalParams: any[]): void;
	success(message?: any, ...optionalParams: any[]): void;
	warn(message?: any, ...optionalParams: any[]): void;
	error(message?: any, ...optionalParams: any[]): void;
	info(message?: any, ...optionalParams: any[]): void;
	dir(message?: any, options?: InspectOptions): void;
	log(message?: any, ...optionalParams: any[]): void;
	time(label: string, ...optionalParams: any[]): Symbol;
	timeEnd(group_flag: Symbol, label?: string): void;
	group(label: string, ...optionalParams: any[]): Symbol;
	groupEnd(group_flag: Symbol, label?: string): void;
	trace(message?: any, ...optionalParams: any[]): void;
	warn(message?: any, ...optionalParams: any[]): void;
	flag(flag: string, message?: any, ...optionalParams: any[]): void;
	flagHead(flag: string, withBG?: boolean): string;
	menu(
		title: string,
		opts?: {
			waiting_msg?: string;
			useArrowKeys_msg?: string;
		}
	): TerminalMenu;
	getLine(
		question: string,
		filter?: (answer: string) => boolean
	): Promise<string>;
	line(message?: any, ...optionalParams: any[]): void;
	clear(): void;
	silence(to_be_silence: boolean): void;
}

declare class TerminalMenu {
	constructor(title: string, opts: any, logger: any);
	addOption(name: string, value: string): void;
}
