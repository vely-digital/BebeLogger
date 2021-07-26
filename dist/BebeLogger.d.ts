interface BebeLogParams {
    consoleLog: boolean;
    rootPath: string;
}
export declare function get(belowFn: any): string;
declare const BebeLog: (paramsGlobal: BebeLogParams) => any;
export default BebeLog;
