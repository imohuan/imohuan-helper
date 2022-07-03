import { existsSync, removeSync, statSync } from "fs-extra";
import { basename, extname, resolve } from "path";

/**
 * 获取归类地址
 * @returns 对象归类
 */
export const getFileType = () => {
  const docList = "doc pdf ppt pps".split(" ");
  const musicList = "mp3 wav wma mpa ram ra aac aif m4a".split(" ");
  const videoList = "avi mpg mpe mpeg asf wmv mov qt rm mp4 flv m4v webm ogv ogg".split(" ");
  const pictureList =
    "xbm tif pjp svgz jpg jpeg ico tiff gif svg jfif webp png bmp pjpeg avif".split(" ");
  return {
    doc: docList,
    music: musicList,
    video: videoList,
    picture: pictureList
  };
};

/**
 * 根据地址获取到对应归类的区域
 * @param text 地址
 * @returns outDir[类型] -> 最终返回 docs或者其他值
 */
export const getSuffixForDir = (text: string, ext: string = "") => {
  const outDir: any = {
    doc: "docs",
    music: "music",
    video: "videos",
    picture: "pictures"
  };
  const typeObj: any = getFileType();
  const type = ext || extname(text).slice(1);
  const keys = Object.keys(typeObj);
  for (let i = 0; i < keys.length; i++) {
    const extlist: any[] = typeObj[keys[i]];
    if (extlist.includes(type)) {
      return outDir[keys[i]];
    }
  }
  return ".";
};

/**
 * 配置Aria2c下载路径
 * 根据URL和文件名返回对应的Aria2c配置`{ dir, out }`
 * @param url 下载地址
 * @param name 保存的名称
 * @param dirname 保存到目录
 * @param isFenlei 是否分类
 * @returns
 */
export const getUrlForAria2c = (
  url: string,
  name: string,
  dirname: string,
  isFenlei: boolean = true
) => {
  const ext = extname(url);
  if (name === "") name = basename(url, ext);
  return {
    dir: resolve(dirname, isFenlei ? getSuffixForDir(url) : ""),
    out: `${name}${ext}`
  };
};

/**
 * 检查文件 大小是否大于某个数量（默认 < 100b则直接删除返回 false， 反则true）
 * @param filename 文件地址
 * @param size 文件大小来区别错误文件
 * @returns boolean
 */
export const checkFile = (filename: string, size = 100) => {
  if (existsSync(filename)) {
    const stat = statSync(filename);
    if (stat.size < size) {
      removeSync(filename);
      return false;
    }
    return true;
  }
  return false;
};
