"use strict";
import fs from "fs";
let osName = process.platform;

interface ICreateType {
  log(msg: string, object: any): any;
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

  const createType = (params: BebeLogTypeParams): ICreateType => {
    const stream = fs.createWriteStream(
      paramsGlobal.rootPath + "/" + params.file,
      {
        flags: "a",
      }
    );

    let color: string = selectColor(params.type, params.colorOverride);

    const log = (msg: string, object: any = undefined) => {
      const text = ` ${new Date().toLocaleString()} ${params.type}  ${msg} \n`;

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
        } \x1b[0m ${msg} => ${objectMsg} ${lineEnding}`;
      }

      const textTerminal = ` ${color} ${new Date().toLocaleString()} ${
        params.type
      } \x1b[0m ${msg} \n`;

      if (paramsGlobal.consoleLog && params.consoleLog != false) {
        if (textObject) {
          console.log(textObjectTerminal);
        } else {
          console.log(textTerminal);
        }
      }

      if (textObject) {
        stream.write(textObject);
      } else {
        stream.write(text);
      }
    };

    return {
      log,
    };
  };

  const addType = (params: BebeLogTypeParams) => {
    logs[params.type] = createType(params);
  };

  return {
    addType,
    logs,
  };
};

export default BebeLog;
