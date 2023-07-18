"use strict";

/**
 * 本地存储
 */
class LocalStorage {
  //////////////////////////////////////////////////////////////////////////////
  // 存储id
  //////////////////////////////////////////////////////////////////////////////
  static LsId = `${Configure.getProjectName()}_bp`;

  /**
   * 获取存储项
   * @param {string} key 存储项的key
   * @return {string} 返回找到的存储项，否则返回null
   */
  static getItem(key) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查key
    ////////////////////////////////////////////////////////////////////////////
    if ((null === key) || (!Toolkit.equalsIgnoreCase("string", typeof(key))) || (0 >= key.length)) {
      throw new Error("Invalid Key");
    }
    const itemStr = localStorage.getItem(LocalStorage.LsId);
    if (null === itemStr) {
      return null;
    } else {
      try {
        const itemObj = JSON.parse(itemStr);
        if (itemObj.hasOwnProperty(key)) {
          return itemObj[key];
        }
        return null;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }

  /**
   * 设置存储项
   * @param {string} key 存储项的key
   * @param {string} value 存储项的value
   */
  static setItem(key, value) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查key
    ////////////////////////////////////////////////////////////////////////////
    if ((null === key) || (!Toolkit.equalsIgnoreCase("string", typeof(key))) || (0 >= key.length)) {
      throw new Error("Invalid Key");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查value
    ////////////////////////////////////////////////////////////////////////////
    if (null === value) {
      throw new Error("Invalid Value");
    }
    let itemStr = localStorage.getItem(LocalStorage.LsId);
    try {
      let itemObj = {};
      if (null !== itemStr) {
        itemObj = JSON.parse(itemStr);
      }
      itemObj[key] = value;
      itemStr = JSON.stringify(itemObj);
      localStorage.setItem(LocalStorage.LsId, itemStr);
    } catch (e) {
      console.error(e.message);
    }
  }

  /**
   * 删除存储项
   * @param {string} key 存储项的key
   */
  static removeItem(key) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查key
    ////////////////////////////////////////////////////////////////////////////
    if ((null === key) || (!Toolkit.equalsIgnoreCase("string", typeof(key))) || (0 >= key.length)) {
      throw new Error("Invalid Key");
    }
    let itemStr = localStorage.getItem(LocalStorage.LsId);
    if (null !== itemStr) {
      try {
        const itemObj = JSON.parse(itemStr);
        delete itemObj[key];
        itemStr = JSON.stringify(itemObj);
        localStorage.setItem(LocalStorage.LsId, itemStr);
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * 清除存储项
   */
  static clearItem() {
    localStorage.removeItem(LocalStorage.LsId);
  }
}
