"use strict";

/**
 * 模板下拉项
 */
class TemplateSelectOption {
  /**
   * 构造函数
   * @param {string} text 文本
   * @param {string} value 值（允许为空）
   * @param {boolean} selected 是否选中
   */
  constructor(text, value, selected) {
    if ((null === text) || (!Toolkit.equalsIgnoreCase("string", typeof(text)))) {
      throw new Error("Invalid Text");
    }
    if ((null !== value) && (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === selected) || (!Toolkit.equalsIgnoreCase("boolean", typeof(selected)))) {
      throw new Error("Invalid Selected");
    }
    this.text = text;
    this.value = (null === value) ? "" : value;
    this.selected = selected;
  }
}

/**
 * 模板下拉框
 */
class TemplateSelect {
  /**
   * 构造函数
   * @param {string} id id
   * @param {number} width 宽度
   * @param {array} templateSelectOptionArray 模板下拉框数组
   * @param {boolean} disabled 是否禁用
   * @param {function} changeCallback 改变回调方法
   */
  constructor(id, width, templateSelectOptionArray, disabled, changeCallback) {
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === width) || (!Toolkit.equalsIgnoreCase("number", typeof(width)))) {
      throw new Error("Invalid Width");
    }
    if ((null === templateSelectOptionArray) || (!Array.isArray(templateSelectOptionArray)) || (!templateSelectOptionArray.every(function(templateSelectOption) { return templateSelectOption instanceof TemplateSelectOption; }))) {
      throw new Error("Invalid Template Select Option Array");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === changeCallback) || (!Toolkit.equalsIgnoreCase("function", typeof(changeCallback)))) {
      throw new Error("Invalid Change Callback");
    }
    this.id = id;
    this.width = width;
    this.templateSelectOptionArray = templateSelectOptionArray;
    this.disabled = disabled;
    this.changeCallback = changeCallback;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    let text = null;
    let value = null; 
    for (let i = 0; i < this.templateSelectOptionArray.length; i++) {
      const templateSelectOption = this.templateSelectOptionArray[i];
      if (null === text) {
        text = templateSelectOption.text;
        value = templateSelectOption.value;
      }
      if (this.templateSelectOptionArray[i].selected) {
        text = templateSelectOption.text;
        value = templateSelectOption.value;
      }
    }
    return `<button id = "${this.id}" class = "text-sm text-center rounded-md p-2 border border-gray-500 disabled:text-slate-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex flex-row justify-between items-center" data-popup-value = "${value}" style = "width: ${this.width}px"><span class = "text">${text}</span><svg class = "w-4" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M19.5 8.25l-7.5 7.5-7.5-7.5"></path></svg></button>`;
  }

  /**
   * 初始化事件
   */
  initEvent() {
    const popupMenuItemArray = new Array();
    for (let i = 0; i < this.templateSelectOptionArray.length; i++) {
      const templateSelectOption = this.templateSelectOptionArray[i];
      popupMenuItemArray.push(new PopupMenuItem(templateSelectOption.text/* 文本 */, templateSelectOption.value/* 值 */, false/* 是否有分割线 */, "px-2.5 hover:bg-indigo-100"/* li类 */, `width: ${this.width}px`/* li样式 */));
    }
    ////////////////////////////////////////////////////////////////////////////
    // 本地对象
    ////////////////////////////////////////////////////////////////////////////
    const thisObj = this;
    PopupMenu.bind($(`#${this.id}`)/* 目标对象 */, PopupMenu.Position.BOTTOM_CENTER/* 位置 */, "text-slate-600"/* ul类 */, `width: ${this.width}px`/* ul样式 */, popupMenuItemArray/* 项数组 */, null/* 距离 */, function(item) {
      $(`#${thisObj.id}`).find(".text").html(item.html());
      thisObj.changeCallback();
    }/* li点击方法 */);
  }
}

/**
 * 模板按钮
 */
class TemplateButton {
  /**
   * 构造函数
   * @param {string} text 文本
   * @param {string} clazz 类（允许为空）
   * @param {boolean} disabled 是否禁用
   * @param {function} click 点击方法
   */
  constructor(text, clazz, disabled, click) {
    if ((null === text) || (!Toolkit.equalsIgnoreCase("string", typeof(text)))) {
      throw new Error("Invalid Text");
    }
    if ((null !== clazz) && (!Toolkit.equalsIgnoreCase("string", typeof(clazz)))) {
      throw new Error("Invalid Class");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === click) || (!Toolkit.equalsIgnoreCase("function", typeof(click)))) {
      throw new Error("Invalid Click");
    }
    this.text = text;
    this.clazz = (null === clazz) ? "" : clazz;
    this.disabled = disabled;
    this.click = click;
    this.id = Toolkit.generateUuid();
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<button id = "${this.id}" class = "template_button text-sm text-white text-center font-medium bg-indigo-500 rounded-lg px-6 py-2 ml-4 select-none hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 disabled:bg-opacity-50 disabled:cursor-not-allowed ${this.clazz}" type = "button" ${this.disabled ? "disabled" : ""}>${this.text}</button>`;
  }

  /**
   * 初始化事件
   */
  initEvent() {
    $(`#${this.id}`).off("click").on("click", null, this, function(event) {
      const source = event.data;
      source.click();
    });
  }
}

/**
 * 模板
 */
class Template {
  /**
   * 构建
   * @param targetObject 目标对象
   * @param templateWidgetArray 模板控件数组（允许为空）
   * @param content 内容
   */
  static build(targetObject, templateWidgetArray, content) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查目标对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null === targetObject) || (!Toolkit.equalsIgnoreCase("object", typeof(targetObject))) || (0 >= targetObject.length)) {
      throw new Error("Invalid Target Object");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查模板控件数组
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== templateWidgetArray) && ((!Array.isArray(templateWidgetArray)) || (0 >= templateWidgetArray.length))) {
      throw new Error("Invalid Template Widget Array");
    }
    if (null !== templateWidgetArray) {
      for (let i = 0; i < templateWidgetArray.length; i++) {
        const templateWidget = templateWidgetArray[i];
        if (!((templateWidget instanceof TemplateButton) || (templateWidget instanceof TemplateSelect))) {
          throw new Error("Invalid Template Widget Array");
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查内容
    ////////////////////////////////////////////////////////////////////////////
    if ((null === content) || (!Toolkit.equalsIgnoreCase("string", typeof(content))) || (0 >= content.length)) {
      throw new Error("Invalid Content");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 构建模板
    ////////////////////////////////////////////////////////////////////////////
    targetObject.addClass("h-auto px-4 bg-slate-50");
    if (null !== templateWidgetArray) {
      targetObject.append(`<div class = "toolbar flex flex-row justify-end items-center mt-4"></div>`);
      for (let i = 0; i < templateWidgetArray.length; i++) {
        const templateWidget = templateWidgetArray[i];
        targetObject.find(".toolbar").append(templateWidget.getCode());
        if (Toolkit.equalsIgnoreCase("function", (typeof templateWidget.initEvent))) {
          templateWidget.initEvent();
        }
      }
    }
    targetObject.append(`<div class = "content pt-4 pb-4">${content}</div>`);
  }
}
