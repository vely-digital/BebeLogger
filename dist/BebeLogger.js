"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
let osName = process.platform;
const BebeLog = (paramsGlobal) => {
    const logs = {};
    const selectColor = (type, colorOverride = undefined) => {
        if (colorOverride) {
            return colorOverride;
        }
        switch (type) {
            case "info":
                return "";
            case "error":
                return "\x1b[31m";
            case "warning":
                return "\x1b[33m";
            case "critical":
                return "\x1b[35m";
            case "debug":
                return "\x1b[34m";
            default:
                return "";
        }
    };
    const createType = (params) => {
        const logObject = (msg, object = undefined) => {
            let stream = undefined;
            if (!params.disableFileLog) {
                stream = fs_1.default.createWriteStream(paramsGlobal.rootPath + "/" + params.file, {
                    flags: "a",
                });
            }
            let color = selectColor(params.type, params.colorOverride);
            const log = (msg, object = undefined) => {
                const text = ` ${new Date().toLocaleString()} ${params.type}  ${msg} \n`;
                let textObject = undefined;
                let textObjectTerminal = undefined;
                let lineEnding = "\n";
                if (osName == "win32") {
                    lineEnding = "\r\n";
                }
                if (object) {
                    let objectMsg = JSON.stringify(object);
                    textObject = ` ${new Date().toLocaleString()} ${params.type} ${msg} => ${objectMsg} ${lineEnding}`;
                    textObjectTerminal = ` ${color} ${new Date().toLocaleString()} ${params.type} \x1b[0m \u001b[30;1m \x1b[0m ${msg} => ${lineEnding}`;
                }
                const textTerminal = ` ${color} ${new Date().toLocaleString()} ${params.type} \x1b[0m \u001b[30;1m \x1b[0m ${msg} \n`;
                if (paramsGlobal.consoleLog && params.consoleLog != false) {
                    if (textObject) {
                        console.log(textObjectTerminal);
                        console.log(object);
                    }
                    else {
                        console.log(textTerminal);
                    }
                }
                if (!params.disableFileLog) {
                    if (textObject) {
                        stream.write(textObject);
                    }
                    else {
                        stream.write(text);
                    }
                }
            };
            if (msg) {
                log(msg, object);
            }
            return {
                log,
            };
        };
        return { logObject };
    };
    const addType = (params) => {
        const createdType = createType(params);
        logs[params.type] = createdType.logObject;
    };
    return {
        addType,
        logs,
    };
};
exports.default = BebeLog;
//# sourceMappingURL=BebeLogger.js.map