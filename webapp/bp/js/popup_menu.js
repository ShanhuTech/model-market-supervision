"use strict";

class PopupMenuItem {
  /**
   * 构造函数
   * @param {string} text 文本
   * @param {string} value 值
   * @param {boolean} divider 是否有分割线
   * @param {string} liClass li类（允许为空）
   * @param {string} liStyle li样式（允许为空）
   */
  constructor(text, value, divider, liClass, liStyle) {
    if ((null === text) || (!Toolkit.equalsIgnoreCase("string", typeof(text)))) {
      throw new Error("Invalid Text");
    }
    if ((null === value) || (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === divider) || (!Toolkit.equalsIgnoreCase("boolean", typeof(divider)))) {
      throw new Error("Invalid Divider");
    }
    if ((null !== liClass) && (!Toolkit.equalsIgnoreCase("string", typeof(liClass)))) {
      throw new Error("Invalid Li Class");
    }
    if ((null !== liStyle) && (!Toolkit.equalsIgnoreCase("string", typeof(liStyle)))) {
      throw new Error("Invalid Li Style");
    }
    this.text = text;
    this.value = value;
    this.divider = divider;
    this.liClass = (null === liClass) ? "" : liClass;
    this.liStyle = (null === liStyle) ? "" : liStyle;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<li class = "px-4 py-2.5 list-none whitespace-nowrap cursor-pointer ${this.divider ? "border-b border-solid border-gray-300" : ""} ${this.liClass} first:mt-0 first:rounded-t-lg last:mb-0 last:rounded-b-lg hover:bg-gray-100" style = "${this.liStyle}" data-value = "${this.value}">${this.text}</li>`;
  }
}

/**
 * 弹出菜单
 */
class PopupMenu {
  /*
   * 位置
   */
  static Position = {
    "TOP_LEFT": "TOP_LEFT",
    "TOP_CENTER": "TOP_CENTER",
    "TOP_RIGHT": "TOP_RIGHT",
    "RIGHT_TOP": "RIGHT_TOP",
    "RIGHT_MIDDLE": "RIGHT_MIDDLE",
    "RIGHT_BOTTOM": "RIGHT_BOTTOM",
    "BOTTOM_LEFT": "BOTTOM_LEFT",
    "BOTTOM_CENTER": "BOTTOM_CENTER",
    "BOTTOM_RIGHT": "BOTTOM_RIGHT",
    "LEFT_TOP": "LEFT_TOP",
    "LEFT_MIDDLE": "LEFT_MIDDLE",
    "LEFT_BOTTOM": "LEFT_BOTTOM"
  };

  /**
   * 绑定
   * @param {object} targetObject 目标对象
   * @param {enum} position PopupMenu.Position枚举的位置
   * @param {string} ulClass ul类（允许为空）
   * @param {string} ulStyle ul样式（允许为空）
   * @param {array} popupMenuItemArray popupMenuItem数组
   * @param {number} distance 距离（允许为空）
   * @param {function} liClick li点击方法（允许为空）
   */
  static bind(targetObject, position, ulClass, ulStyle, popupMenuItemArray, distance, liClick) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查目标对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null === targetObject) || (!Toolkit.equalsIgnoreCase("object", typeof(targetObject))) || (0 >= targetObject.length)) {
      throw new Error("Invalid Target Object");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查位置
    ////////////////////////////////////////////////////////////////////////////
    if ((null === position) || (!Object.values(PopupMenu.Position).includes(position))) {
      throw new Error("Invalid Position Value");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查ui类
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== ulClass) && (!Toolkit.equalsIgnoreCase("string", typeof(ulClass)))) {
      throw new Error("Invalid Ul Class");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查ui样式
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== ulStyle) && (!Toolkit.equalsIgnoreCase("string", typeof(ulStyle)))) {
      throw new Error("Invalid Ul Style");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查popupMenuItem数组
    ////////////////////////////////////////////////////////////////////////////
    if ((null === popupMenuItemArray) || (!Array.isArray(popupMenuItemArray)) || (0 >= popupMenuItemArray.length) || (!popupMenuItemArray.every(function(popupMenuItem) { return popupMenuItem instanceof PopupMenuItem; }))) {
      throw new Error("Invalid Popup Menu Item Array");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查距离
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== distance) && (!Toolkit.equalsIgnoreCase("number", typeof(distance)))) {
      throw new Error("Invalid Distance");
    }
    if (null === distance) {
      distance = 10;
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查li点击方法
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== liClick) && (!Toolkit.equalsIgnoreCase("function", typeof(liClick)))) {
      throw new Error("Invalid Li Click");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 生成
    ////////////////////////////////////////////////////////////////////////////
    const uuid = Toolkit.generateUuid();
    {
      if ((null === ulClass) || (0 >= ulClass.length)) {
        ulClass = "";
      }
      if ((null === ulStyle) || (0 >= ulStyle.length)) {
        ulStyle = "";
      }
      let code = `<ul id = "${uuid}" class = "popup_menu text-sm text-gray-700 overflow-y-hidden bg-white rounded-lg shadow shadow-gray-300 select-none z-10 opacity-0 transition-opacity duration-500 ease-in-out absolute hidden ${ulClass} focus:outline-none" style = "${ulStyle}">`;
      for (let i = 0; i < popupMenuItemArray.length; i++) {
        const popupMenuItem = popupMenuItemArray[i];
        code += popupMenuItem.getCode();
      }
      code += `</ul>`;
      targetObject.parent().append(code);
      targetObject.attr("data-popup-id", uuid);
      targetObject.attr("data-popup-open", false);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 注册监听事件
    ////////////////////////////////////////////////////////////////////////////
    $(`#${uuid}`).find("li").off("click").on("click", null, null, function() {
      //////////////////////////////////////////////////////////////////////////
      // 考虑到文本的内容可能为html代码，其意义不大，所以忽略文本的值
      //////////////////////////////////////////////////////////////////////////
      targetObject.attr("data-popup-value", $(this).attr("data-value"));
      $(`#${uuid}`).trigger("blur");
      if (null !== liClick) {
        liClick($(this));
      }
    });
    targetObject.on/* 这里只能用on添加，不能用off删除其他事件 */("click", null, null, function() {
      $(`#${uuid}`).removeClass("hidden");
      //////////////////////////////////////////////////////////////////////////
      // 计算显示位置
      //////////////////////////////////////////////////////////////////////////
      {
        const ul = document.getElementById(`${uuid}`);
        const ulWidth = ul.getBoundingClientRect().width;
        const ulHeight = ul.getBoundingClientRect().height;
        const targetTop = targetObject.offset().top;
        const targetLeft = targetObject.offset().left;
        const targetWidth = targetObject.get(0).getBoundingClientRect().width;
        const targetHeight = targetObject.get(0).getBoundingClientRect().height;
        let top = null, left = null;
        if (PopupMenu.Position.TOP_LEFT === position) {
          top = targetTop - distance - ulHeight;
          left = targetLeft;
        } else if (PopupMenu.Position.TOP_CENTER === position) {
          top = targetTop - distance - ulHeight;
          left = targetLeft + ((targetWidth - ulWidth) / 2);
        } else if (PopupMenu.Position.TOP_RIGHT === position) {
          top = targetTop - distance - ulHeight;
          left = targetLeft + (targetWidth - ulWidth);
        } else if (PopupMenu.Position.RIGHT_TOP === position) {
          top = targetTop;
          left = targetLeft + targetWidth + distance;
        } else if (PopupMenu.Position.RIGHT_MIDDLE === position) {
          top = targetTop + ((targetHeight - ulHeight) / 2);
          left = targetLeft + targetWidth + distance;
        } else if (PopupMenu.Position.RIGHT_BOTTOM === position) {
          top = targetTop - (ulHeight - targetHeight);
          left = targetLeft + targetWidth + distance;
        } else if (PopupMenu.Position.BOTTOM_LEFT === position) {
          top = targetTop + targetHeight + distance;
          left = targetLeft;
        } else if (PopupMenu.Position.BOTTOM_CENTER === position) {
          top = targetTop + targetHeight + distance;
          left = targetLeft + ((targetWidth - ulWidth) / 2);
        } else if (PopupMenu.Position.BOTTOM_RIGHT === position) {
          top = targetTop + targetHeight + distance;
          left = targetLeft + (targetWidth - ulWidth);
        } else if (PopupMenu.Position.LEFT_TOP === position) {
          top = targetTop;
          left = targetLeft - distance - ulWidth;
        } else if (PopupMenu.Position.LEFT_MIDDLE === position) {
          top = targetTop + ((targetHeight - ulHeight) / 2);
          left = targetLeft - distance - ulWidth;
        } else if (PopupMenu.Position.LEFT_BOTTOM === position) {
          top = targetTop - (ulHeight - targetHeight);
          left = targetLeft - distance - ulWidth;
        } else {
          throw new Error("Invalid Position Value");
        }
        $(`#${uuid}`).css("top", `${top}px`);
        $(`#${uuid}`).css("left", `${left}px`);
      }
      $(`#${uuid}`).off("transitionend").on("transitionend", null, null, function() {
        $(`#${uuid}`).attr("tabindex", "0");
        $(`#${uuid}`).focus();
        targetObject.attr("data-popup-open", true);
      });
      setTimeout(function() {
        $(`#${uuid}`).addClass("opacity-100");
      }, 1);
    });
    $(`#${uuid}`).on/* 这里只能用on添加，不能用off删除其他事件 */("blur", null, null, function() {
      $(`#${uuid}`).off("transitionend").on("transitionend", null, null, function() {
        $(`#${uuid}`).addClass("hidden");
        $(`#${uuid}`).removeAttr("tabindex");
        targetObject.attr("data-popup-open", false);
      });
      setTimeout(function() {
        $(`#${uuid}`).removeClass("opacity-100");
      }, 1);
    });
  }

  /**
   * 解绑
   * @param targetObject 目标对象
   */
  static unbind(targetObject) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查目标对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null === targetObject) || (!Toolkit.equalsIgnoreCase("object", typeof(targetObject))) || (0 >= targetObject.length)) {
      throw new Error("Invalid Target Object");
    }
    const dataPopupId = targetObject.attr("data-popup-id");
    if (undefined !== dataPopupId) {
      $(`#${dataPopupId}`).remove();
    }
    targetObject.removeAttr("data-popup-id");
    targetObject.removeAttr("data-popup-open");
    targetObject.removeAttr("data-popup-value");
  }
}
