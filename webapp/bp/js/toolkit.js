"use strict";

/**
 * 工具箱
 */
class Toolkit {
  //############################################################################
  // 字符串
  //############################################################################

  /**
   * 生成uuid
   * @return {string} uuid
   */
  static generateUuid() {
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g, function(c) {
      let r = Math.random() * 16 | 0,
          v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 忽略大小写比较字符串
   * @param {string} src1 字符串1
   * @param {string} src2 字符串2
   * @return {boolean} 字符串一致返回true，否则返回false
   */
  static equalsIgnoreCase(src1, src2) {
    if ((null === src1) || (null === src2)) {
      throw new Error("Invalid Compare String");
    }
    if (("string" !== typeof(src1)) || ("string" !== typeof(src2))) {
      return false;
    }
    if (src1.length !== src2.length) {
      return false;
    }
    return (src1.toLowerCase() === src2.toLowerCase());
  }

  //############################################################################
  // 文件
  //############################################################################

  /**
   * base64数据转Blob对象
   * @param {string} data base64数据
   * @param {string} type 文件类型
   * @return {object} Blob对象
   */
  static base64ToBlob(data, type) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查base64数据
    ////////////////////////////////////////////////////////////////////////////
    if ((null === data) || (!Toolkit.equalsIgnoreCase("string", typeof(data))) || (0 >= data.length)) {
      throw new Error("Invalid Data");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查文件类型
    ////////////////////////////////////////////////////////////////////////////
    if ((null === type) || (!Toolkit.equalsIgnoreCase("string", typeof(type))) || (0 >= type.length)) {
      throw new Error("Invalid Type");
    }
    const rawData = data.split(",");
    const array = rawData[0].match(/:(.*?);/);
    const mime = (array && array.length > 1 ? array[1] : type) || type;
    const bytes = window.atob(rawData[1]);
    const buff = new ArrayBuffer(bytes.length);
    const u8Buff = new Uint8Array(buff);
    for (let i = 0; i < bytes.length; i++) {
      u8Buff[i] = bytes.charCodeAt(i);
    }
    return new Blob([buff], {"type": mime});
  }

  /**
   * 下载导出文件
   * @param {string} blob blob对象
   * @param {string} fileName 下载默认的文件名（包含后缀）
   */
  static downloadExportFile(blob, fileName) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查blob对象
    ////////////////////////////////////////////////////////////////////////////
    if (null === blob) {
      throw new Error("Invalid Blob");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查文件名
    ////////////////////////////////////////////////////////////////////////////
    if ((null === fileName) || (!Toolkit.equalsIgnoreCase("string", typeof(fileName))) || (0 >= fileName.length)) {
      throw new Error("Invalid File Name");
    }
    const downloadElement = document.createElement("a");
    let href = blob;
    if (Toolkit.equalsIgnoreCase("string", typeof(blob))) {
      downloadElement.target = "_blank";
    } else {
      href = window.URL.createObjectURL(blob);
    }
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    if (!Toolkit.equalsIgnoreCase("string", typeof(blob))) {
      window.URL.revokeObjectURL(href);
    }
  }

  //############################################################################
  // 时间与日期
  //############################################################################

  /**
   * 获取指定时间格式当前时间的字符串，格式如下：年（yyyy）、年（yy）、月（MM）、日（dd）、时（HH）、分（mm）、秒（ss）、毫秒（SSS），常用格式有：yyyy-MM-dd HH:mm:ss
   * @param {string} format 时间格式
   * @return {string} 指定格式下当前时间的字符串
   */
  static getCurrentFormatDateTime(format) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查时间格式
    ////////////////////////////////////////////////////////////////////////////
    if ((null === format) || (!Toolkit.equalsIgnoreCase("string", typeof(format))) || (0 >= format.length)) {
      throw new Error("Invalid Format");
    }
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const millisecond = String(date.getMilliseconds()).padStart(3, "0");
    const formattedDate = format.replace("yyyy", year).replace("yy", year.slice(-2)).replace("MM", month).replace("dd", day).replace("HH", hour).replace("mm", minute).replace("ss", second).replace("SSS", millisecond);
    return formattedDate;
  }

  /**
   * 动态加载JavaScript
   * @param {string} url javascript地址
   */
  static dynamicLoadJavaScript(url) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查url
    ////////////////////////////////////////////////////////////////////////////
    if ((null === url) || (!Toolkit.equalsIgnoreCase("string", typeof(url))) || (0 >= url.length)) {
      throw new Error("Invalid Url");
    }
    return new Promise(function(resolve, reject) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.addEventListener("load", function() {
        resolve();
      });
      script.addEventListener("error", function() {
        reject(new Error("Failed to load script: " + url));
      });
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }

  /**
   * 动态加载Css
   * @param {string} url css地址
   */
  static dynamicLoadCss(url) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查url
    ////////////////////////////////////////////////////////////////////////////
    if ((null === url) || (!Toolkit.equalsIgnoreCase("string", typeof(url))) || (0 >= url.length)) {
      throw new Error("Invalid Url");
    }
    return new Promise(function(resolve, reject) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = url;
      link.addEventListener("load", function() {
        resolve();
      });
      link.addEventListener("error", function() {
        reject(new Error("Failed to load css: " + url));
      });
      document.getElementsByTagName("head")[0].appendChild(link);
    });
  }

  //############################################################################
  // 动态参数
  //############################################################################

  /**
   * 根据参数名从url获取参数值
   * @param {string} name 参数名
   * @return {string} 返回参数名对应的值，没有找到返回null
   */
  static getUrlParameter(name) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数名
    ////////////////////////////////////////////////////////////////////////////
    if ((null === name) || (!Toolkit.equalsIgnoreCase("string", typeof(name))) || (0 >= name.length)) {
      throw new Error("Invalid Name");
    }
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const result = window.location.search.substr(1).match(reg);
    if (null !== result) {
      const value = result[2];
      if (0 >= value.length) {
        return null;
      }
      return value;
    } else {
      return null;
    }
  }

  //############################################################################
  // 编码
  //############################################################################

  /**
   * Url参数编码
   * @param {string} value 值
   * @return {string} 返回对应值的Url编码（如果值为null，则返回null）
   */
  static urlParameterEncode(value) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查值
    ////////////////////////////////////////////////////////////////////////////
    if ((null === value) || (!Toolkit.equalsIgnoreCase("string", typeof(value))) || (0 >= value.length)) {
      throw new Error("Invalid Value");
    }
    return encodeURIComponent(value);
  }

  /**
   * Url参数解码
   * @param {string} value 值
   * @return {string} 返回对应值的Url解码（如果值为null，则返回null）
   */
  static urlParameterDecode(value) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查值
    ////////////////////////////////////////////////////////////////////////////
    if ((null === value) || (!Toolkit.equalsIgnoreCase("string", typeof(value))) || (0 >= value.length)) {
      throw new Error("Invalid Value");
    }
    return decodeURIComponent(value);
  }

  //############################################################################
  // 表单数据
  //############################################################################

  /**
   * 表单数据转字符串
   * @param {object} formData 表单数据
   * @return {string} 返回对应的字符串
   */
  static formDataToString(formData) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查表单数据
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== formData) && (!(formData instanceof FormData))) {
      throw new Error("Invalid Form Data");
    }
    const formObj = {};
    for (const obj of formData.entries()) {
      formObj[obj[0]] = obj[1];
    }
    return JSON.stringify(formObj);
  }

  /**
   * 字符串转表单数据
   * @param {string} str 字符串
   * @return {object} 返回对应的表单对象
   */
  static stringToFormData(str) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查字符串
    ////////////////////////////////////////////////////////////////////////////
    if ((null === str) || (!Toolkit.equalsIgnoreCase("string", typeof(str))) || (0 >= str.length)) {
      throw new Error("Invalid String");
    }
    try {
      const formObj = JSON.parse(str);
      const formData = new FormData();
      for (const key in formObj) {
        formData.append(key, formObj[key]);
      }
      return formData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
