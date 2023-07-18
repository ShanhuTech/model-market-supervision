"use strict";

/**
 * 全局
 */
class Global {
  /**
   * 加载资源
   * @param {array} cssResourceUrlArray css资源地址数组（允许为空）
   * @param {array} javaScriptResourceUrlArray javaScript资源地址数组（允许为空）
   * @param {function} callback 回调方法
   */
  static async loadResource(cssResourceUrlArray, javaScriptResourceUrlArray, callback) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查css资源地址数组
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== cssResourceUrlArray) && (!Array.isArray(cssResourceUrlArray))) {
      throw new Error("Invalid Css Resource Array");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查javaScript资源地址数组
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== javaScriptResourceUrlArray) && (!Array.isArray(javaScriptResourceUrlArray))) {
      throw new Error("Invalid JavaScript Resource Url Array");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查回调函数
    ////////////////////////////////////////////////////////////////////////////
    if ((null === callback) || (!Toolkit.equalsIgnoreCase("function", typeof(callback)))) {
      throw new Error("Invalid Callback");
    }
    const defaultCssResourceArray = [
      //////////////////////////////////////////////////////////////////////////
      // 插件css
      //////////////////////////////////////////////////////////////////////////
      "../../plugin/flowbite/1.6.5/flowbite.min.css?",
      // 一定要在flowbite.min.css之后引入tailwind.css，否则flowbite的样式会覆盖tailwind.css
      "../../plugin/tailwind/output/tailwind.css?",
      "../../plugin/datetimepicker/2.5.20/datetimepicker.full.min.css?",
      //////////////////////////////////////////////////////////////////////////
      // 全局css
      //////////////////////////////////////////////////////////////////////////
      "../../css/global.css?"
    ];
    const defaultJavaScriptResourceArray = [
      //////////////////////////////////////////////////////////////////////////
      // 插件js
      //////////////////////////////////////////////////////////////////////////
      "../../plugin/jquery/3.6.4/jquery.min.js?",
      "../../plugin/flowbite/1.6.5/flowbite.min.js?",
      "../../plugin/clipboardjs/2.0.11/clipboard.min.js?",
      "../../plugin/datetimepicker/2.5.20/datetimepicker.full.min.js?",
      //////////////////////////////////////////////////////////////////////////
      // 组件js
      //////////////////////////////////////////////////////////////////////////
      "../../js/copyright.js?",
      "../../js/pagination.js?",
      "../../js/popup_menu.js?",
      "../../js/popup_window.js?",
      "../../js/toast.js?",
      "../../js/wait_mask.js?",
      //////////////////////////////////////////////////////////////////////////
      // 模块js
      //////////////////////////////////////////////////////////////////////////
      "../../js/configure.js?",
      "../../js/local_storage.js?",
      "../../js/network.js?",
      "../../js/module.js?",
      "../../js/account_security.js?",
      "../../js/template.js?"
    ];
    for (let i = 0; i < defaultCssResourceArray.length; i++) {
      await Toolkit.dynamicLoadCss(defaultCssResourceArray[i] + "?" + Toolkit.generateUuid());
    }
    if (null !== cssResourceUrlArray) {
      for (let i = 0; i < cssResourceUrlArray.length; i++) {
        await Toolkit.dynamicLoadCss(cssResourceUrlArray[i] + "?" + Toolkit.generateUuid());
      }
    }
    for (let i = 0; i < defaultJavaScriptResourceArray.length; i++) {
      await Toolkit.dynamicLoadJavaScript(defaultJavaScriptResourceArray[i] + "?" + Toolkit.generateUuid());
    }
    if (null !== javaScriptResourceUrlArray) {
      for (let i = 0; i < javaScriptResourceUrlArray.length; i++) {
        await Toolkit.dynamicLoadJavaScript(javaScriptResourceUrlArray[i] + "?" + Toolkit.generateUuid());
      }
    }
    callback();
  }
}
