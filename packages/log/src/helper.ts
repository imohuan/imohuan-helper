import chalk from "chalk";
import { defaultsDeep, get, isArray, isObject, upperFirst } from "lodash-es";
import moment from "moment";

import { FormatLogOption, LevelColor, LevelColorKey } from "./typings";

const levelColor: LevelColor = {
  info: chalk.green.bold,
  warn: chalk.yellow.bold,
  error: chalk.red.bold,
  debug: chalk.blue.bold,
  verbose: chalk.cyan.bold,
  silly: chalk.white.bold
};

export function formatLog(
  ops: Pick<FormatLogOption, "label" | "level"> & Partial<FormatLogOption>,
  ...msgs: any[]
): string {
  const option: FormatLogOption = defaultsDeep(ops, {
    prefix: "$",
    format: "{prefix} {date} {label} {level} {msg}",
    dateFormat: "YYYY-MM-DD hh:ss:mm",
    objectLen: 100
  } as FormatLogOption);

  const msgData = {
    prefix: chalk.gray.bold(option.prefix),
    label: chalk.blue.bold(`[${option.label}]`),
    level: get(levelColor, option.level, chalk.red.bold)(`[${upperFirst(option.level)}]`),
    date: chalk.gray.bold(moment().format(option.dateFormat)),
    msg: msgs
  };

  const regexp = /(\{[_a-zA-Z0-9]+})/;
  const result = option.format
    .split(regexp)
    .filter((f) => f)
    .map((f) => {
      if (regexp.test(f)) {
        const key = f.slice(1, -1);
        const value = get(msgData, key, false);
        return isArray(value) ? value.reduce((pre, cur) => pre.concat(cur, " "), []) : value;
      } else return f;
    })
    .flat()
    .map((m) => {
      if (!isObject(m)) return m;
      const result = JSON.stringify(m);
      return result.length < option.objectLen
        ? result
        : chalk.red.bold(`[Object Len:${result.length}]`);
    })
    .join("");
  return chalk.white.bold(result);
}
