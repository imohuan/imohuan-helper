import "winston-daily-rotate-file";

import chalk from "chalk";
import { isArray, isObject, upperFirst } from "lodash-es";
import stripAnsi from "strip-ansi";
import { format, transports } from "winston";

import { formatLog } from "./helper";
import { FormatLogOption, LevelColorKey } from "./typings";

const { combine, timestamp, label, printf, splat } = format;

/** 自定义多个 log 多个参数输出 */
export const ParseArg = (objectLen: number): any => {
  return {
    transform(info: any) {
      try {
        const msg = info.message;
        const symbols = Object.getOwnPropertySymbols(info);
        if (symbols.length === 1) {
          info.message = isObject(msg) ? JSON.stringify(msg) : msg;
          return info;
        }
        const splatKey = symbols.slice(-1)[0];
        const splat = info[splatKey] || info.splat;
        if (/%[scdjifoO%]/g.test(msg)) return info;
        info[splatKey] = [];
        if (isArray(splat)) {
          splat.unshift(msg);
          info.message = splat
            .map((m: any) => {
              if (!isObject(m)) return m;
              const result = JSON.stringify(m);
              return result.length < objectLen
                ? result
                : chalk.red.bold(`[Object Len:${result.length}]`);
            })
            .join(" ");
        }
        return info;
      } catch {
        return info;
      }
    }
  };
};

/**
 * 自定义打印格式
 * @param labelName 项目名称
 */
export const Console = (
  labelName: string,
  option: Omit<Partial<FormatLogOption>, "label" | "level">
) => {
  return new transports.Console({
    format: combine(
      label({ label: labelName }),
      timestamp(),
      printf(({ level, message }) =>
        formatLog({ label: labelName, level: level as any, ...option }, message)
      )
    )
  } as any);
};

/**
 * 日志轮转
 * @param level 日志等级
 * @param dirname 日志保存地址
 */
export const RotateFile = (level: LevelColorKey, dirname: string) => {
  const transport = new transports.DailyRotateFile({
    level,
    dirname,
    filename: `%DATE%-${upperFirst(level)}.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "1d"
  } as any);
  return transport;
};

export const DefaultFormat = (option: Omit<FormatLogOption, "level">) => {
  return combine(
    ParseArg(option.objectLen),
    splat(),
    label({ label: option.label }),
    timestamp(),
    printf(({ level, message }) =>
      stripAnsi(formatLog({ level: level as any, ...option }, message))
    )
  );
};
