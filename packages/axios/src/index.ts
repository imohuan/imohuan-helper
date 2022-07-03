import Aria2 from "aria2";
import { isArray } from "lodash-es";

export * from "./helper";

export interface Aria2ToolOption {
  host?: string;
  port?: number;
  secure?: boolean;
  secret?: string;
  path?: string;
}

export interface Aria2ToolDownloadOption {
  // 存储下载文件的目录。
  dir?: string;
  // 保存文件名称
  out?: string;
  // 日志文件的文件名称
  log?: string;
  // 最大同时下载数量
  "max-concurrent-downloads"?: number;
  // 校验文件是否完整，如果失败则从头下载
  "check-integrity"?: boolean;
  // 失败尝试最大次数
  "max-tries"?: number;
  // 重试等待时间
  "retry-wait"?: number;
  // 超时时间
  timeout?: number;
  // http代理
  "http-proxy"?: string;
  // 设置 http-proxy 代理密码
  "https-proxy-passwd"?: string;
  // 设置用户
  "https-proxy-user"?: string;
  // 设置请求头
  header?: string;
  // 设置下载的用户代理
  "user-agent"?: string;
  // https://aria2.github.io/manual/en/html/aria2c.html#cmdoption--rpc-secret
  [key: string]: any;
}

export class Aria2Tool extends Aria2 {
  private keys: string[] = [
    "gid",
    "status",
    "totalLength",
    "completedLength",
    "downloadSpeed",
    "errorMessage",
    "dir",
    "files"
  ];
  constructor(option: Aria2ToolOption | Aria2ToolOption[] = {}) {
    if (!isArray(option)) option = [option as any];

    const defaultOption: Aria2ToolOption = {
      host: "localhost",
      port: 6800,
      secure: false,
      secret: "",
      path: "/jsonrpc"
    };

    option = (option as Aria2ToolOption[]).map((op: Aria2ToolOption) =>
      Object.assign(defaultOption, op)
    );

    super(option);
  }

  /**
   * 连接 Aria2c 时，调用方法
   */
  public open(): Promise<any> {
    return super.open();
  }

  public close(): Promise<any> {
    return super.close();
  }

  public call(...args: any[]): Promise<any> {
    return super.call(...args);
  }

  /**
   * 批处理指令 [ [methodA, param1, param2], [methodA, param1, param2] ]
   * 如果任一指令出现错误，返回一种结果
   * @param multicall
   * @returns
   */
  public multicall(multicall: any[][]) {
    return super.multicall(multicall);
  }

  /**
   * 同 multicall 但会返回多种结果
   * @param batch
   * @returns
   */
  public batch(batch: any[][]) {
    return super.batch(batch);
  }

  /**
   * 获取 aria2 监听事件 on调用
   */
  public async getEventNames() {
    return ["open", "close", "output", "input"].concat(await super.listNotifications());
  }

  /**
   * 获取 aria2 方法 call调用
   */
  public getMethodNames() {
    return super.listMethods();
  }

  /**
   * 监听事件
   * @param key getEventNames() keys
   * @param callback 回调方法
   */
  public on(key: string, callback: Function) {
    super.on(key, callback);
  }

  /**
   * 将对象中的类型转换为字符串类型
   */
  private objValueToString(option: Aria2ToolDownloadOption) {
    Object.keys(option).forEach((key: string) => {
      option[key] = option[key].toString();
    });
    return option;
  }

  /**
   * 添加下载连接
   * @param urls 下载地址
   * @param option 下载配置
   * @param position 位置位置
   * @returns 添加下载后的 id
   */
  public addUri(
    urls: string | string[],
    option: Aria2ToolDownloadOption = {},
    position: number = 0
  ): Promise<string> {
    if (!isArray(urls)) urls = [urls as any];
    return super.call("addUri", urls, option, position);
  }

  /**
   * 修改当前最大同时下载数
   * @returns OK
   */
  public setMaxConcurrentDownloads(size: number): Promise<string> {
    return super.call(
      "changeGlobalOption",
      this.objValueToString({
        "max-concurrent-downloads": size
      } as Aria2ToolDownloadOption)
    );
  }

  /**
   * 获取全局下载配置
   */
  public getGlobalOption(): Promise<Aria2ToolDownloadOption> {
    return super.call("getGlobalOption");
  }

  /**
   * 获取任务的下载配置
   * @param gid 任务id
   * @returns 配置文件
   */
  public getOption(gid: string): Promise<Aria2ToolDownloadOption> {
    return super.call("getOption", gid);
  }

  /**
   * 获取任务 状态，上传速度，文件大小， 保存位置
   * @param gid 任务id
   * @param keys 需要返回的字段数组
   * @returns
   */
  public getStatus(gid: string, keys: string[] = []): Promise<any> {
    if (keys.length === 0) keys = this.keys;
    if (keys.includes("all")) {
      return super.call("tellStatus", gid);
    } else {
      return super.call("tellStatus", gid, keys);
    }
  }

  /**
   * 获取任务  Url
   * @param gid 任务id
   * @returns { uri, status }
   */
  public getUrl(gid: string): Promise<{ uri: string; status: string }> {
    return super.call("getUris", gid);
  }

  /**
   * 获取正在下载的列表数据
   * @param keys 需要返回的字段数组
   * @returns 包含keys字段的列表对象
   */
  public getActiveList(keys: string[] = []): Promise<any[]> {
    if (keys.length === 0) keys = this.keys;
    if (keys.includes("all")) {
      return super.call("tellActive");
    } else {
      return super.call("tellActive", keys);
    }
  }

  /**
   * 获取等待和已暂停的列表数据 默认返回所有数据(0, 999)
   * @param start 数据开始位置
   * @param end 数据结束位置
   * @param keys 需要返回的字段数组
   * @returns 包含keys字段的列表对象
   * @example getWaitingList(0, 1) returns ["A"]
   * getWaitingList(1, 2) returns ["B", "C"]
   * getWaitingList(-1, 2) returns ["C", "B"].
   */
  public getWaitingList(start: number = 0, end: number = 9999, keys: string[] = []) {
    if (keys.length === 0) keys = this.keys;
    if (keys.includes("all")) {
      return super.call("tellWaiting", start, end);
    } else {
      return super.call("tellWaiting", start, end, keys);
    }
  }

  /**
   * 获取已停止结束的列表数据 默认返回所有数据(0, 999)
   * @param start 数据开始位置
   * @param end 数据结束位置
   * @param keys 需要返回的字段数组
   * @returns 包含keys字段的列表对象
   * @example getWaitingList(0, 1) returns ["A"]
   * getWaitingList(1, 2) returns ["B", "C"]
   * getWaitingList(-1, 2) returns ["C", "B"].
   */
  public getStoppedList(start: number = 0, end: number = 9999, keys: string[] = []) {
    if (keys.length === 0) keys = this.keys;
    if (keys.includes("all")) {
      return super.call("tellStopped", start, end);
    } else {
      return super.call("tellStopped", start, end, keys);
    }
  }

  /**
   * 删除任务
   * @param gid 任务id
   * @returns gid
   */
  public remove(gid: string): Promise<string> {
    return super.call("remove", gid);
  }

  /**
   * 删除任务文件 (已完成/错误/删除的下载)
   * @param gid 任务id
   * @returns OK
   */
  public removeResult(gid: string): Promise<string> {
    return super.call("removeDownloadResult", gid);
  }

  /**
   * 删除所有任务文件 (已完成/错误/删除的下载)
   * @returns OK
   */
  public removeAll(): Promise<string> {
    return super.call("purgeDownloadResult");
  }

  /**
   * 暂停任务
   * @param gid 任务id
   * @returns gid
   */
  public pause(gid: string): Promise<string> {
    return super.call("pause", gid);
  }

  /**
   * 暂停所有任务
   * @returns OK
   */
  public pauseAll(): Promise<string> {
    return super.call("pauseAll");
  }

  /**
   * 恢复等待任务 (开始任务)
   * @param gid 任务id
   * @returns gid
   */
  public unpause(gid: string): Promise<string> {
    return super.call("unpause", gid);
  }

  /**
   * 恢复全部任务为等待任务 (开始所有任务)
   * @returns OK
   */
  public unpauseAll(): Promise<string> {
    return super.call("unpauseAll");
  }
}
