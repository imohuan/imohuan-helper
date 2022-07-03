import { resolve } from "path";
import { beforeEach, describe, expect, it, test } from "vitest";

import { getFileType, getSuffixForDir, getUrlForAria2c, Aria2Tool, checkFile } from "../src";
import { ensureFileSync, writeFileSync } from "fs-extra";

describe("工具测试", () => {
  it("测试", async () => {
    const download = new Aria2Tool();
    const result = getFileType();
    // console.log("result", result);

    expect(getSuffixForDir("1.jpg")).toBe("pictures");
    expect(getSuffixForDir("1.mp3")).toBe("music");
    expect(getSuffixForDir("1.mp4")).toBe("videos");
    expect(getSuffixForDir("1.jpg", "zip")).toBe(".");

    /** 通过url获取到后缀名称，并且获取到对应分类地址，自定义名称 */
    expect(getUrlForAria2c("https://www.baidu.com/1.png", "nihao", __dirname, true)).toEqual({
      dir: resolve(__dirname, "pictures"),
      out: "nihao.png"
    });

    // 使用
    // download.addUri("https://www.baidu.com/1.png", {
    //   dir: resolve(__dirname, "pictures"),
    //   out: "nihao.png"
    // });
    console.log(checkFile(__filename));

    const testPath = resolve(__dirname, "1.txt");
    writeFileSync(testPath, "-");
    // 文件内容太小则会直接删除 （可以用来删除错误文件）
    console.log(checkFile(testPath));
  });
});
