"use strict";

/**
 * Toast
 */
class Toast {
  //////////////////////////////////////////////////////////////////////////////
  // Toast默认延迟时间（单位：毫秒）
  //////////////////////////////////////////////////////////////////////////////
  static ToastDefaultDelayTime = 1000 * 5;

  /*
   * 类型
   */
  static Type = {
    "INFO": {
      "bg_color": "bg-blue-100",
      "icon": `
        <svg class = "w-6 h-6 mr-1 text-blue-500" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
          <path stroke-linecap = "round" stroke-linejoin = "round" d = "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
        </svg>
      `
    },
    "WARN": {
      "bg_color": "bg-yellow-100",
      "icon": `
        <svg class = "w-6 h-6 mr-1 text-yellow-500" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
          <path stroke-linecap = "round" stroke-linejoin = "round" d = "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
        </svg>
      `
    },
    "ERROR": {
      "bg_color": "bg-red-100",
      "icon": `
        <svg class = "w-6 h-6 mr-1 text-red-500" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
          <path stroke-linecap = "round" stroke-linejoin = "round" d = "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
        </svg>
      `
    }
  };

  /*
   * 位置
   */
  static Position = {
    "TOP_LEFT": "top-5 left-5",
    "TOP_CENTER": "top-5 left-1/2 -translate-x-1/2",
    "TOP_RIGHT": "top-5 right-5",
    "MIDDLE_LEFT": "top-1/2 -translate-y-1/2 left-5",
    "MIDDLE_CENTER": "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2",
    "MIDDLE_RIGHT": "top-1/2 -translate-y-1/2 right-5",
    "BOTTOM_LEFT": "bottom-5 left-5",
    "BOTTOM_CENTER": "bottom-5 left-1/2 -translate-x-1/2",
    "BOTTOM_RIGHT": "bottom-5 right-5"
  };


  /**
   * 显示
   * @param {enum} type Toast.Type枚举的类型
   * @param {enum} position Toast.Position枚举的位置
   * @param {string} title 标题
   * @param {string} content 内容
   */
  static show(type, position, title, content) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查类型
    ////////////////////////////////////////////////////////////////////////////
    if (!Object.values(Toast.Type).includes(type)) {
      throw new Error("Invalid Type Value");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查位置
    ////////////////////////////////////////////////////////////////////////////
    if (!Object.values(Toast.Position).includes(position)) {
      throw new Error("Invalid Position Value");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查标题
    ////////////////////////////////////////////////////////////////////////////
    if ((null === title) || (!Toolkit.equalsIgnoreCase("string", typeof(title))) || (0 >= title.length)) {
      throw new Error("Invalid Title");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查内容
    ////////////////////////////////////////////////////////////////////////////
    if ((null === content) || (!Toolkit.equalsIgnoreCase("string", typeof(content))) || (0 >= content.length)) {
      throw new Error("Invalid Content");
    }
    let positionKey = null;
    for (const key of Object.keys(Toast.Position)) {
      if (Toast.Position[key] === position) {
        positionKey = key.toLowerCase();
        break;
      }
    }
    if (0 >= $(".toast-container_" + positionKey).length) {
      //////////////////////////////////////////////////////////////////////////
      // 这里的布局要用fixed，否则当页面高度出现滚动条时，窗体的位置显示出错
      //////////////////////////////////////////////////////////////////////////
      $("body").append(`<div class = "toast-container_${positionKey} fixed ${position} z-50"></div>`);
    }
    const uuid = Toolkit.generateUuid();
    $("body").find(".toast-container_" + positionKey).append(`
      <div id = "${uuid}" class = "toast w-96 m-2 bg-gray-50 border border-solid border-gray-300 rounded-lg shadow-md opacity-0 transition-opacity duration-1000 ease-in-out">
        <div class = "toast-header flex flex-row justify-between w-full px-3 py-2.5 rounded-lg rounded-b-none ${type.bg_color} border-b border-solid border-gray-300 select-none">
          <div class = "flex flex-row justify-start items-center">
            ${type.icon}
            <span class = "text-sm font-semibold">${title}</span>
          </div>
          <div class = "flex flex-row items-center text-gray-400">
            <span class = "text-sm">${Toolkit.getCurrentFormatDateTime("HH:mm:ss")}</span>
            <button class = "hover:text-red-400" type = "button">
              <svg class = "w-5 h-5 ml-1" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
                <path stroke-linecap = "round" stroke-linejoin = "round" d = "M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class = "toast-body w-full px-3 py-3 text-sm text-center">${content}</div>
      </div>
    `);
    ////////////////////////////////////////////////////////////////////////////
    // setTimeout延迟1毫秒可以给渐入效果提供渲染时间
    ////////////////////////////////////////////////////////////////////////////
    setTimeout(function() {
      $(`#${uuid}`).addClass("opacity-100");
    }, 1);
    ////////////////////////////////////////////////////////////////////////////
    // 注册监听事件
    ////////////////////////////////////////////////////////////////////////////
    $(`#${uuid}`).find("button").off("click").on("click", null, null, function() {
      $(`#${uuid}`).off("transitionend").on("transitionend", null, null, function() {
        $(this).remove();
        if (0 >= $("body").find(".toast-container_" + positionKey).find(".toast").length) {
          $("body").find(".toast-container_" + positionKey).remove();
        }
      });
      $(`#${uuid}`).removeClass("opacity-100");
    });
    ////////////////////////////////////////////////////////////////////////////
    // 设置延迟后隐藏
    ////////////////////////////////////////////////////////////////////////////
    setTimeout(function() {
      $(`#${uuid}`).off("transitionend").on("transitionend", null, null, function() {
        $(this).remove();
        if (0 >= $("body").find(".toast-container_" + positionKey).find(".toast").length) {
          $("body").find(".toast-container_" + positionKey).remove();
        }
      });
      $(`#${uuid}`).removeClass("opacity-100");
    }, Toast.ToastDefaultDelayTime);
  }
}
