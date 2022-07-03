import type { Chalk } from "chalk";

export type { Logger } from "winston";

export interface LevelColor {
  error: Chalk;
  warn: Chalk;
  info: Chalk;
  verbose: Chalk;
  debug: Chalk;
  silly: Chalk;
}

export type LevelColorKey = keyof LevelColor;

export class LogOption {
  /** 项目名称 */
  label: string;
  /** 日志保存地址 */
  dirname: string;
  /** 前缀 默认: `$` */
  prefix: string;
  /** 模板输出格式 */
  format: string;
  /** 日期 默认: `YYYY-MM-DD hh:ss:mm` */
  dateFormat: string;
  /** JSON转字符串最大显示字数 */
  objectLen: number;
}

export type FormatLogOption = LogOption & {
  /** 打印等级 */
  level: LevelColorKey;
};
