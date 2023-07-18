"use strict";

/**
 * 版权
 */
class Copyright {
  /**
   * 构建
   * @param {object} targetObject 目标对象
   * @param {string} clazz 类（允许为空）
   * @param {string} style 样式（允许为空）
   */
  static build(targetObject, clazz, style) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查目标对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null === targetObject) || (!Toolkit.equalsIgnoreCase("object", typeof(targetObject))) || (0 >= targetObject.length)) {
      throw new Error("Invalid Target Object");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查类
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== clazz) && (!Toolkit.equalsIgnoreCase("string", typeof(clazz)))) {
      throw new Error("Invalid Class");
    }
    if (null === clazz) {
      clazz = "";
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查样式
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== style) && (!Toolkit.equalsIgnoreCase("string", typeof(style)))) {
      throw new Error("Invalid Style");
    }
    if (null === style) {
      style = "";
    }
    targetObject.append(`<div class = "copyright text-sm text-center text-zine-500 p-3 select-none ${clazz}" style = "${style}">${Configure.getCopyright()}</div>`);
  }
}
