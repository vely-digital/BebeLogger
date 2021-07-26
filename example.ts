import BebeLog from "./src/BebeLogger";

import { resolve } from "path";

let logsPath = resolve(__dirname, "./logs/");

const loggerMain = BebeLog({ consoleLog: true, rootPath: logsPath });
loggerMain.addType({ type: "info", file: "info.txt" });
loggerMain.addType({ type: "error", file: "error.txt" });

const logger = loggerMain.logs;

console.log(logger);

logger.error("test bare", { testObject: "test" });
