import { defaultsDeep } from "lodash-es";
import { resolve } from "path";
import { createLogger as _createLogger, Logger as _Logger } from "winston";

import { formatLog } from "./helper";
import { Console, DefaultFormat, RotateFile } from "./plugins";
import { FormatLogOption, LogOption } from "./typings";

let defaultOption: LogOption = {
  label: "Name",
  prefix: "$",
  objectLen: 100,
  format: "{prefix} {date} {label} {level} {msg}",
  dirname: resolve(process.cwd(), "logs"),
  dateFormat: "YYYY-MM-DD hh:ss:mm"
};

/**
 * 设置全局配置
 * @param option 配置
 */
export function setOption(option: Partial<LogOption>) {
  defaultOption = defaultsDeep(option, defaultOption);
}

/**
 * 创建日志实例
 * @param option 配置
 * @returns 实例
 */
export function createLogger(option: LogOption) {
  option = defaultsDeep(option, defaultOption);
  return _createLogger({
    level: "silly",
    format: DefaultFormat(defaultsDeep({ prefix: "" }, option)),
    transports: [
      Console(option.label, option),
      RotateFile("info", option.dirname),
      RotateFile("debug", option.dirname),
      RotateFile("error", option.dirname)
    ]
  });
}

function base(level: string, ...args: any[]) {
  console.log(formatLog(defaultsDeep({ level } as FormatLogOption, defaultOption), ...args));
}

/** Info 日志 (只打印不保存) */
export const info = (...args: any[]) => base("info", ...args);
/** Error 日志 (只打印不保存) */
export const error = (...args: any[]) => base("error", ...args);
/** Debug 日志 (只打印不保存) */
export const debug = (...args: any[]) => base("debug", ...args);
/** Warn 日志 (只打印不保存) */
export const warn = (...args: any[]) => base("warn", ...args);

export class Logger {
  private log: any;
  private option: LogOption;

  constructor(_option: Partial<LogOption>) {
    this.option = defaultsDeep(_option, defaultOption);
    this.log = createLogger(this.option);
  }

  path() {
    return this.option.dirname;
  }

  info(...args: any[]) {
    this.log.info(...args);
  }

  error(...args: any[]) {
    this.log.error(...args);
  }

  debug(...args: any[]) {
    this.log.debug(...args);
  }

  warn(...args: any[]) {
    this.log.warn(...args);
  }

  static info(...args: any[]) {
    info(...args);
  }

  static error(...args: any[]) {
    error(...args);
  }

  static debug(...args: any[]) {
    debug(...args);
  }

  static warn(...args: any[]) {
    warn(...args);
  }
}
