import { beforeEach, describe, expect, it } from "vitest";
import { info, error, warn, debug, Logger, setOption } from "../src/index";

describe("日志测试", () => {
  it("设置配置", async () => {
    setOption({ label: "你好" });
  });

  it("基础", async () => {
    info("base", 123);
    error("base", 123);
    debug("base", 123);
    warn("base", 123);
  });

  it("实例静态方法", async () => {
    Logger.info("instance static", 123);
    Logger.error("instance static", 123);
    Logger.debug("instance static", 123);
    Logger.warn("instance static", 123);
  });

  it("本地日志保存", async () => {
    const logger = new Logger({ label: "Local" });
    logger.info("保存地址", logger.path());
    logger.info("instance local", 123);
    logger.error("instance local", 123);
    logger.debug("instance local", 123);
    logger.warn("instance local", 123);
  });
});
