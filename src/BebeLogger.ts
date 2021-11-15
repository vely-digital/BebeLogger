"use strict";
import fs from "fs";
let osName = process.platform;

// const { get } = require("stack-trace");
// const trace = get();

interface ICreateType {
  // loggerObject(msg: string, object: any): any;
}

interface ILogs {
  [key: string]: ICreateType;
}

interface BebeLogParams {
  consoleLog: boolean;
  rootPath: string;
}

interface BebeLogTypeParams {
  consoleLog: boolean;
  disableFileLog: boolean;
  type: string;
  file: string;
  colorOverride?: string;
}

const BebeLog = (paramsGlobal: BebeLogParams): any => {
  const logs: ILogs = {};

  const selectColor = (
    type: string,
    colorOverride: string = undefined
  ): string => {
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

  const createType = (params: BebeLogTypeParams): any => {
    const logObject = (msg: string, object: any = undefined) => {
      let stream: any = undefined;

      if (!params.disableFileLog) {
        stream = fs.createWriteStream(
          paramsGlobal.rootPath + "/" + params.file,
          {
            flags: "a",
          }
        );
      }

      let color: string = selectColor(params.type, params.colorOverride);

      const log = (msg: string, object: any = undefined) => {
        const text = ` ${new Date().toLocaleString()} ${
          params.type
        }  ${msg} \n`;

        let textObject = undefined;
        let textObjectTerminal = undefined;

        let lineEnding = "\n";

        if (osName == "win32") {
          lineEnding = "\r\n";
        }

        if (object) {
          let objectMsg = JSON.stringify(object);
          textObject = ` ${new Date().toLocaleString()} ${
            params.type
          } ${msg} => ${objectMsg} ${lineEnding}`;

          textObjectTerminal = ` ${color} ${new Date().toLocaleString()} ${
            params.type
          } \x1b[0m \u001b[30;1m \x1b[0m ${msg} => ${lineEnding}`;
        }

        const textTerminal = ` ${color} ${new Date().toLocaleString()} ${
          params.type
        } \x1b[0m \u001b[30;1m \x1b[0m ${msg} \n`;

        if (paramsGlobal.consoleLog && params.consoleLog != false) {
          if (textObject) {
            console.log(textObjectTerminal);
            console.log(object);
          } else {
            console.log(textTerminal);
          }
        }

        if (!params.disableFileLog) {
          if (textObject) {
            stream.write(textObject);
          } else {
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

  const addType = (params: BebeLogTypeParams) => {
    const createdType = createType(params);
    logs[params.type] = createdType.logObject;
  };

  return {
    addType,
    logs,
  };
};

export default BebeLog;
