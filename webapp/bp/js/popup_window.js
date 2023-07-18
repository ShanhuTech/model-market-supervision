"use strict";

////////////////////////////////////////////////////////////////////////////////
// 临时Demo
////////////////////////////////////////////////////////////////////////////////
// PopupWindow.build($("body")/* 目标对象 */, "add_role"/* 弹窗的uuid */, PopupWindow.Theme.NORMAL/* 主题 */, "添加角色"/* 标题 */, 400/* 宽度 */, [
//     new PopupWindowFormItemText(true/* 是否必填 */, "name"/* id */, "名称"/* label */, "1-32位的任意字符"/* 提示 */, "jack"/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemText(true/* 是否必填 */, "name2"/* id */, "密码"/* label */, "1-32位的任意字符"/* 提示 */, null/* 值 */, true/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemTextArea(false/* 是否必填 */, "remark"/* id */, "备注"/* label */, 6/* 行数 */, "1-32位的任意字符"/* 提示 */, "永远的神"/* 值 */, false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemSelect(false/* 是否必填 */, "sex"/* id */, "性别"/* label */, [
//       new PopupWindowFormItemSelectOption("男"/* 文本 */, "man"/* 值 */, false/* 是否选中 */),
//       new PopupWindowFormItemSelectOption("女"/* 文本 */, "woman"/* 值 */, true/* 是否选中 */),
//     ], false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemFile(false/* 是否必填 */, "attch_file"/* id */, "附件"/* label */, "1-10MB的png、jpg文件"/* 提示 */, true/* 是否多选 */, false/* 是否禁用 */, false/* 是否隐藏 */, function(fileInput) {
//       for (let i = 0; i < fileInput.files.length; i++) {
//         const file = fileInput.files[i];
//         const fr = new FileReader();
//         fr.readAsDataURL(file);
//         fr.onload = function() {
//           console.log(this.result);
//         };
//         console.log("aaaaaaaaaaaaaaaaaaaa");
//       }
//     }/* 改变事件 */),
//     new PopupWindowFormItemCheckBox(true/* 是否必填 */, "dep_id"/* id */, "部门"/* label */, [
//       new PopupWindowFormItemCheckBoxOption("科信部"/* 文本 */, "kexin"/* 值 */, false/* 是否选中 */),
//       new PopupWindowFormItemCheckBoxOption("技术部"/* 文本 */, "jishu"/* 值 */, false/* 是否选中 */),
//       new PopupWindowFormItemCheckBoxOption("信息部"/* 文本 */, "jishu"/* 值 */, true/* 是否选中 */),
//     ], false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemRadio(true/* 是否必填 */, "sex"/* id */, "性别"/* label */, [
//       new PopupWindowFormItemRadioOption("男"/* 文本 */, "man"/* 值 */, true/* 是否选中 */),
//       new PopupWindowFormItemRadioOption("女"/* 文本 */, "woman"/* 值 */, false/* 是否选中 */)
//     ], false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemToggle(false/* 是否必填 */, "status"/* id */, "是否开启"/* label */, true/* 值 */, false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemDatetime(false/* 是否必填 */, "birthday_date"/* id */, PopupWindowFormItemDatetime.Format.DATE/* 格式 */, "生日"/* label */, null/* 提示 */, "2022-12-12"/* 值 */, false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemDatetime(false/* 是否必填 */, "birthday_time"/* id */, PopupWindowFormItemDatetime.Format.TIME/* 格式 */, "生日"/* label */, "输入生日"/* 提示 */, null/* 值 */, false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemDatetime(false/* 是否必填 */, "birthday_datetime"/* id */, PopupWindowFormItemDatetime.Format.DATETIME/* 格式 */, "生日"/* label */, null/* 提示 */, null/* 值 */, false/* 是否禁用 */, false/* 是否隐藏 */),
//     new PopupWindowFormItemMessage("remove"/* id */, "确认要删除角色吗？"/* 标签 */, false/* 是否隐藏 */),
//   ]/* 表单项数组 */, [
//     new PopupWindowButton("确定"/* 文本 */, "text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300 disabled:opacity-70"/* 类 */, function() {
//       alert("确定");
//     }/* 点击方法 */),
//     new PopupWindowButton("取消"/* 文本 */, "text-gray-500 border border-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100 disabled:opacity-70"/* 类 */, function() {
//       PopupWindow.hide("add_role"/* 弹窗的uuid */, null/* 回调方法 */);
//     }/* 点击方法 */)
//   ]/* 弹窗按钮数组 */
// );

/**
 * 弹窗文本表单项
 */
class PopupWindowFormItemText {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {string} prompt 提示（允许为空）
   * @param {string} value 值（允许为空）
   * @param {boolean} password 是否为密码
   * @param {boolean} disabled 是否禁用
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, label, prompt, value, password, disabled, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null !== prompt) && (!Toolkit.equalsIgnoreCase("string", typeof(prompt)))) {
      throw new Error("Invalid Prompt");
    }
    if ((null !== value) && (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === password) || (!Toolkit.equalsIgnoreCase("boolean", typeof(password)))) {
      throw new Error("Invalid Password");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.prompt = (null === prompt) ? "" : prompt;
    this.value = (null === value) ? "" : value;
    this.password = password;
    this.disabled = disabled;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><input id = "${this.id}" class = "w-full text-sm rounded-md p-2 disabled:text-slate-400 disabled:bg-gray-200" type = "${this.password ? "password" : "text"}" placeholder = "${this.prompt}" value = "${this.value}" ${this.disabled ? "disabled" : ""} /></td></tr>`;
  }
}

/**
 * 弹窗文本域表单项
 */
class PopupWindowFormItemTextArea {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {number} rows 行数
   * @param {string} prompt 提示（允许为空）
   * @param {string} value 值（允许为空）
   * @param {boolean} disabled 是否禁用
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, label, rows, prompt, value, disabled, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null === rows) || (!Toolkit.equalsIgnoreCase("number", typeof(rows)))) {
      throw new Error("Invalid Label");
    }
    if ((null !== prompt) && (!Toolkit.equalsIgnoreCase("string", typeof(prompt)))) {
      throw new Error("Invalid Prompt");
    }
    if ((null !== value) && (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.rows = rows;
    this.prompt = (null === prompt) ? "" : prompt;
    this.value = (null === value) ? "" : value;
    this.disabled = disabled;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><textarea id = "${this.id}" class = "w-full text-sm rounded-md p-2 disabled:text-slate-400 disabled:bg-gray-200" rows = "${this.rows}" placeholder = "${this.prompt}" ${this.disabled ? "disabled" : ""}>${this.value}</textarea></td></tr>`;
  }
}

/**
 * 弹窗下拉项表单项
 */
class PopupWindowFormItemSelectOption {
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
 * 弹窗下拉框表单项
 */
class PopupWindowFormItemSelect {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {array} popupWindowFormItemSelectOptionArray 弹窗下拉项表单项数组
   * @param {boolean} disabled 是否禁用
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, label, popupWindowFormItemSelectOptionArray, disabled, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null === popupWindowFormItemSelectOptionArray) || (!Array.isArray(popupWindowFormItemSelectOptionArray)) || (!popupWindowFormItemSelectOptionArray.every(function(popupWindowFormItemSelectOption) { return popupWindowFormItemSelectOption instanceof PopupWindowFormItemSelectOption; }))) {
      throw new Error("Invalid Popup Window Form Item Select Option Array");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.popupWindowFormItemSelectOptionArray = popupWindowFormItemSelectOptionArray;
    this.disabled = disabled;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    let text = null;
    let value = null; 
    for (let i = 0; i < this.popupWindowFormItemSelectOptionArray.length; i++) {
      const popupWindowFormItemSelectOption = this.popupWindowFormItemSelectOptionArray[i];
      if (null === text) {
        text = popupWindowFormItemSelectOption.text;
        value = popupWindowFormItemSelectOption.value;
      }
      if (this.popupWindowFormItemSelectOptionArray[i].selected) {
        text = popupWindowFormItemSelectOption.text;
        value = popupWindowFormItemSelectOption.value;
      }
    }
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><button id = "${this.id}" class = "w-full text-sm text-center rounded-md p-2 border border-gray-500 disabled:text-slate-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex flex-row justify-between items-center" data-popup-value = "${value}"><span class = "text">${text}</span><svg class = "w-4" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M19.5 8.25l-7.5 7.5-7.5-7.5"></path></svg></button></td></tr>`;
  }

  /**
   * 初始化事件
   */
  initEvent() {
    const popupMenuItemArray = new Array();
    for (let i = 0; i < this.popupWindowFormItemSelectOptionArray.length; i++) {
      const popupWindowFormItemSelectOption = this.popupWindowFormItemSelectOptionArray[i];
      popupMenuItemArray.push(new PopupMenuItem(popupWindowFormItemSelectOption.text/* 文本 */, popupWindowFormItemSelectOption.value/* 值 */, false/* 是否有分割线 */, "px-2.5 hover:bg-indigo-100"/* li类 */, null/* li样式 */));
    }
    ////////////////////////////////////////////////////////////////////////////
    // 本地对象
    ////////////////////////////////////////////////////////////////////////////
    const thisObj = this;
    PopupMenu.bind($(`#${this.id}`)/* 目标对象 */, PopupMenu.Position.BOTTOM_RIGHT/* 位置 */, "w-fit text-slate-600"/* ul类 */, null/* ul样式 */, popupMenuItemArray/* 项数组 */, null/* 距离 */, function(item) {
      $(`#${thisObj.id}`).find(".text").html(item.html());
    }/* li点击方法 */);
  }
}

/**
 * 弹窗选择文件表单项
 */
class PopupWindowFormItemFile {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {string} prompt 提示（允许为空）
   * @param {boolean} multiple 是否多选
   * @param {boolean} disabled 是否禁用
   * @param {boolean} hidden 是否隐藏
   * @param {function} change 改变事件
   */
  constructor(required, id, label, prompt, multiple, disabled, hidden, change) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null !== prompt) && (!Toolkit.equalsIgnoreCase("string", typeof(prompt)))) {
      throw new Error("Invalid Prompt");
    }
    if ((null === multiple) || (!Toolkit.equalsIgnoreCase("boolean", typeof(multiple)))) {
      throw new Error("Invalid Multiple");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    if ((null === change) || (!Toolkit.equalsIgnoreCase("function", typeof(change)))) {
      throw new Error("Invalid Change");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.prompt = (null === prompt) ? "" : prompt;
    this.multiple = multiple;
    this.disabled = disabled;
    this.hidden = hidden;
    this.change = change;
    this.inputFileId = Toolkit.generateUuid();
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><input id = "${this.inputFileId}" class = "hidden" type = "file" ${this.multiple ? "multiple" : ""} /><div class = "relative"><div class = "absolute inset-y-0 right-0 flex items-center pr-2"><svg class = "w-4" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"></path></svg></div><input id = "${this.id}" class = "w-full text-sm rounded-md p-2 pr-8 cursor-pointer disabled:text-slate-400 disabled:bg-gray-200" type = "text" value = "${this.prompt}" ${this.disabled ? "disabled" : ""} readonly /></div></td></tr>`;
  }

  /**
   * 初始化事件
   */
  initEvent() {
    ////////////////////////////////////////////////////////////////////////////
    // 本地对象
    ////////////////////////////////////////////////////////////////////////////
    const thisObj = this;
    $(`#${this.inputFileId}`).off("change").on("change", null, this, function(event) {
      const source = event.data;
      let code  = "";
      for (let i = 0; i < this.files.length; i++) {
        code += this.files[i].name + " ";
      }
      if (0 < code.length) {
        code = code.substring(0, code.length - 1);
        $(`#${thisObj.id}`).val(code);
      }
      thisObj.change(this);
    });
    const inputFileId = this.inputFileId;
    $(`#${this.id}`).off("click").on("click", null, this, function(event) {
      const source = event.data;
      $(`#${inputFileId}`).trigger("click");
    });
  }
}

/**
 * 弹窗多选项表单项
 */
class PopupWindowFormItemCheckBoxOption {
  /**
   * 构造函数
   * @param {string} text 文本
   * @param {string} value 值（允许为空）
   * @param {boolean} checked 是否选中
   * @param {boolean} disabled 是否禁用
   */
  constructor(text, value, checked, disabled) {
    if ((null === text) || (!Toolkit.equalsIgnoreCase("string", typeof(text)))) {
      throw new Error("Invalid Text");
    }
    if ((null === value) || (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === checked) || (!Toolkit.equalsIgnoreCase("boolean", typeof(checked)))) {
      throw new Error("Invalid Checked");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    this.text = text;
    this.value = value;
    this.checked = checked;
    this.disabled = disabled;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    const uuid = Toolkit.generateUuid();
    return `<div class = "flex flex-row justify-start items-center mr-4"><input id = "${uuid}" class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed" type = "checkbox" value = "${this.value}" ${this.checked ? "checked" : ""} ${this.disabled ? "disabled" : ""} /><label for = "${uuid}" class = "ml-2 text-sm text-gray-900 cursor-pointer">${this.text}</label></div>`;
  }
}

/**
 * 弹窗多选框表单项
 */
class PopupWindowFormItemCheckBox {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {array} popupWindowFormItemCheckBoxOptionArray 弹窗多选项表单项数组
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, label, popupWindowFormItemCheckBoxOptionArray, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null === popupWindowFormItemCheckBoxOptionArray) || (!Array.isArray(popupWindowFormItemCheckBoxOptionArray)) || (!popupWindowFormItemCheckBoxOptionArray.every(function(popupWindowFormItemCheckBoxOption) { return popupWindowFormItemCheckBoxOption instanceof PopupWindowFormItemCheckBoxOption; }))) {
      throw new Error("Invalid Popup Window Form Item CheckBox Option Array");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.popupWindowFormItemCheckBoxOptionArray = popupWindowFormItemCheckBoxOptionArray;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    let code = "";
    for (let i = 0; i < this.popupWindowFormItemCheckBoxOptionArray.length; i++) {
      const popupWindowFormItemCheckBoxOption = this.popupWindowFormItemCheckBoxOptionArray[i];
      code += popupWindowFormItemCheckBoxOption.getCode();
    }
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><div id = ${this.id} class = "flex flex-row flex-wrap justify-start items-center justify-items-start">${code}</div></td></tr>`;
  }
}

/**
 * 弹窗单选项表单项
 */
class PopupWindowFormItemRadioOption {
  /**
   * 构造函数
   * @param {string} text 文本
   * @param {string} value 值（允许为空）
   * @param {boolean} checked 是否选中
   * @param {boolean} disabled 是否禁用
   */
  constructor(text, value, checked, disabled) {
    if ((null === text) || (!Toolkit.equalsIgnoreCase("string", typeof(text)))) {
      throw new Error("Invalid Text");
    }
    if ((null === value) || (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === checked) || (!Toolkit.equalsIgnoreCase("boolean", typeof(checked)))) {
      throw new Error("Invalid Checked");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    this.text = text;
    this.value = value;
    this.checked = checked;
    this.disabled = disabled;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    const group = Toolkit.generateUuid();
    return `<div class = "flex flex-row justify-start items-center mr-4"><input id = "${uuid}" type = "radio" class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" value = "${this.value}" name = "${group}" ${this.checked ? "checked" : ""} ${this.disabled ? "disabled" : ""} /><label for = "${uuid}" class = "ml-2 text-sm text-gray-900 cursor-pointer">${this.text}</label></div>`;
  }
}

/**
 * 弹窗单选框表单项
 */
class PopupWindowFormItemRadio {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {array} popupWindowFormItemRadioOptionArray 弹窗单选项表单项数组
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, label, popupWindowFormItemRadioOptionArray, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null === popupWindowFormItemRadioOptionArray) || (!Array.isArray(popupWindowFormItemRadioOptionArray)) || (!popupWindowFormItemRadioOptionArray.every(function(popupWindowFormItemRadioOption) { return popupWindowFormItemRadioOption instanceof PopupWindowFormItemRadioOption; }))) {
      throw new Error("Invalid Popup Window Form Item Radio Option Array");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.popupWindowFormItemRadioOptionArray = popupWindowFormItemRadioOptionArray;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    let code = "";
    const group = Toolkit.generateUuid();
    for (let i = 0; i < this.popupWindowFormItemRadioOptionArray.length; i++) {
      const popupWindowFormItemRadioOption = this.popupWindowFormItemRadioOptionArray[i];
      code += popupWindowFormItemRadioOption.getCode();
    }
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><div id = "${this.id}" class = "flex flex-row flex-wrap justify-start items-center justify-items-start">${code}</div></td></tr>`;
  }
}

/**
 * 弹窗开关表单项
 */
class PopupWindowFormItemToggle {
  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {string} label 标签
   * @param {boolean} open 是否开启
   * @param {boolean} disabled 是否禁用
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, label, open, disabled, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null === open) || (!Toolkit.equalsIgnoreCase("boolean", typeof(open)))) {
      throw new Error("Invalid Open");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.label = label;
    this.open = open;
    this.disabled = disabled;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black"></span><span>${this.label}</span></td><td class = "pr-3 pt-3"><div class = "flex flex-row flex-wrap justify-start items-center justify-items-start"><label class = "relative inline-flex items-center cursor-pointer"><input id = ${this.id} type = "checkbox" class = "sr-only peer" ${this.open ? "checked" : ""} /><div class = "w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></label></div></td></tr>`;
  }
}

/**
 * 弹窗日期时间表单项
 */
class PopupWindowFormItemDatetime {
  /*
   * 格式
   * 由于事件控件的设置还有timepicker，所以不能直接以键值的形式，还需要另做判断
   */
  static Format = {
    "DATE": "DATE", // 日期
    "TIME": "TIME", // 时间
    "DATETIME": "DATETIME" // 日期时间
  };

  /**
   * 构造函数
   * @param {boolean} required 是否必填
   * @param {string} id id
   * @param {enum} format 格式
   * @param {string} label 标签
   * @param {string} prompt 提示（允许为空）
   * @param {string} value 值（允许为空）
   * @param {boolean} disabled 是否禁用
   * @param {boolean} hidden 是否隐藏
   */
  constructor(required, id, format, label, prompt, value, disabled, hidden) {
    if ((null === required) || (!Toolkit.equalsIgnoreCase("boolean", typeof(required)))) {
      throw new Error("Invalid Required");
    }
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === format) || (!Object.values(PopupWindowFormItemDatetime.Format).includes(format))) {
      throw new Error("Invalid Format");
    }
    if ((null === label) || (!Toolkit.equalsIgnoreCase("string", typeof(label)))) {
      throw new Error("Invalid Label");
    }
    if ((null !== prompt) && (!Toolkit.equalsIgnoreCase("string", typeof(prompt)))) {
      throw new Error("Invalid Prompt");
    }
    if ((null !== value) && (!Toolkit.equalsIgnoreCase("string", typeof(value)))) {
      throw new Error("Invalid Value");
    }
    if ((null === disabled) || (!Toolkit.equalsIgnoreCase("boolean", typeof(disabled)))) {
      throw new Error("Invalid Disabled");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.required = required;
    this.id = id;
    this.format = format;
    this.label = label;
    this.prompt = (null === prompt) ? "" : prompt;
    this.value = (null === value) ? "" : value;
    this.disabled = disabled;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<tr class = "${this.hidden ? "hidden" : ""}"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"><span class = "text-red-600 font-black">${this.required ? "*" : ""}</span><span>${this.label}</span></td><td class = "pr-3 pt-3"><input id = "${this.id}" class = "w-full text-sm rounded-md p-2 disabled:text-slate-400 disabled:bg-gray-200" type = "text" placeholder = "${this.prompt}" value = "${this.value}" ${this.disabled ? "disabled" : ""} /></td></tr>`;
  }

  /**
   * 初始化事件
   */
  initEvent() {
    if (PopupWindowFormItemDatetime.Format.DATE === this.format) {
      $(`#${this.id}`).datetimepicker({
        "format": "Y-m-d",
        "timepicker": false
      });
    } else if (PopupWindowFormItemDatetime.Format.TIME === this.format) {
      $(`#${this.id}`).datetimepicker({
        "format": "H:i",
        "datepicker": false
      });
    } else if (PopupWindowFormItemDatetime.Format.DATETIME === this.format) {
      $(`#${this.id}`).datetimepicker({
        "format": "Y-m-d H:i:s"
      });
    }
    ////////////////////////////////////////////////////////////////////////////
    // 设置语言为简体中文
    ////////////////////////////////////////////////////////////////////////////
    $.datetimepicker.setLocale("zh");
  }
}

/**
 * 弹窗消息表单项
 */
class PopupWindowFormItemMessage {
  /**
   * 构造函数
   * @param {string} id id
   * @param {string} content 内容
   * @param {boolean} hidden 是否隐藏
   */
  constructor(id, content, hidden) {
    if ((null === id) || (!Toolkit.equalsIgnoreCase("string", typeof(id)))) {
      throw new Error("Invalid Id");
    }
    if ((null === content) || (!Toolkit.equalsIgnoreCase("string", typeof(content)))) {
      throw new Error("Invalid Content");
    }
    if ((null === hidden) || (!Toolkit.equalsIgnoreCase("boolean", typeof(hidden)))) {
      throw new Error("Invalid Hidden");
    }
    this.id = id;
    this.content = content;
    this.hidden = hidden;
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<tr class = "message ${this.hidden ? "hidden" : ""}"><td class = "text-sm text-center px-3 pt-3" colspan = "2"><div id = "${this.id}" class = "p-2">${this.content}</div></tr>`;
  }
}

/**
 * 弹窗按钮
 */
class PopupWindowButton {
  /**
   * 构造函数
   * @param {string} text 文本
   * @param {string} clazz 类（允许为空）
   * @param {function} click 点击方法
   */
  constructor(text, clazz, click) {
    if ((null === text) || (!Toolkit.equalsIgnoreCase("string", typeof(text)))) {
      throw new Error("Invalid Text");
    }
    if ((null !== clazz) && (!Toolkit.equalsIgnoreCase("string", typeof(clazz)))) {
      throw new Error("Invalid Class");
    }
    if ((null === click) || (!Toolkit.equalsIgnoreCase("function", typeof(click)))) {
      throw new Error("Invalid Click");
    }
    this.text = text;
    this.clazz = (null === clazz) ? "" : clazz;
    this.click = click;
    this.id = Toolkit.generateUuid();
  }

  /**
   * 获取代码
   * @return {string} 代码
   */
  getCode() {
    return `<button id = "${this.id}" class = "text-sm text-center font-medium rounded-lg px-8 py-2 mx-2 first:ml-0 last:mr-0 focus:ring-4 focus:outline-none disabled:bg-opacity-50 disabled:cursor-not-allowed ${this.clazz}" type = "button">${this.text}</button>`;
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
 * 弹窗
 */
class PopupWindow {
  /*
   * 主题
   */
  static Theme = {
    "NORMAL": "bg-indigo-200", // 正常
    "WARN": "text-amber-600 bg-amber-200", // 警告
    "DANGER": "text-rose-600 bg-rose-200" // 危险
  };

  /**
   * 构建
   * @param {object} targetObject 目标对象
   * @param {string} popupWindowUuid 弹窗的uuid
   * @param {enum} theme 主题
   * @param {string} title 标题
   * @param {number} width 宽度
   * @param {array} formItemArray 表单项数组，数组内的对象为：PopupWindowFormItemText、PopupWindowFormItemTextArea、PopupWindowFormItemSelect、PopupWindowFormItemFile、PopupWindowFormItemCheckBox、PopupWindowFormItemRadio、PopupWindowFormItemToggle、PopupWindowFormItemDatetime、PopupWindowFormItemMessage
   * @param {array} popupWindowButtonArray 弹窗按钮数组，格式为：[{"text": "...", "class": "...", "click": ...}]
   * @param {function} hideCallback 隐藏回调方法（允许为空）
   */
  static build(targetObject, popupWindowUuid, theme, title, width, formItemArray, popupWindowButtonArray, hideCallback) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查目标对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null === targetObject) || (!Toolkit.equalsIgnoreCase("object", typeof(targetObject))) || (0 >= targetObject.length)) {
      throw new Error("Invalid Target Object");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查弹窗的uuid
    ////////////////////////////////////////////////////////////////////////////
    if ((null === popupWindowUuid) || (!Toolkit.equalsIgnoreCase("string", typeof(popupWindowUuid)))) {
      throw new Error("Invalid Popup Window Uuid");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查主题
    ////////////////////////////////////////////////////////////////////////////
    if ((null === theme) || (!Object.values(PopupWindow.Theme).includes(theme))) {
      throw new Error("Invalid Theme");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查标题
    ////////////////////////////////////////////////////////////////////////////
    if ((null === title) || (!Toolkit.equalsIgnoreCase("string", typeof(title)))) {
      throw new Error("Invalid Title");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查宽度
    ////////////////////////////////////////////////////////////////////////////
    if ((null === width) || (!Toolkit.equalsIgnoreCase("number", typeof(width)))) {
      throw new Error("Invalid Width");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查表单项数组
    ////////////////////////////////////////////////////////////////////////////
    if ((null === formItemArray) || (!Array.isArray(formItemArray)) || (0 >= formItemArray.length)) {
      throw new Error("Invalid Form Item Array");
    }
    for (let i = 0; i < formItemArray.length; i++) {
      const formItem = formItemArray[i];
      if (!((formItem instanceof PopupWindowFormItemText) || (formItem instanceof PopupWindowFormItemTextArea) || (formItem instanceof PopupWindowFormItemSelect) || (formItem instanceof PopupWindowFormItemFile) || (formItem instanceof PopupWindowFormItemCheckBox) || (formItem instanceof PopupWindowFormItemRadio) || (formItem instanceof PopupWindowFormItemToggle) || (formItem instanceof PopupWindowFormItemDatetime) || (formItem instanceof PopupWindowFormItemMessage))) {
        throw new Error("Invalid Form Item Array");
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查弹窗按钮数组
    ////////////////////////////////////////////////////////////////////////////
    if ((null === popupWindowButtonArray) || (!Array.isArray(popupWindowButtonArray)) || (0 >= popupWindowButtonArray.length)) {
      throw new Error("Invalid Button Array");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查隐藏回调方法
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== hideCallback) && (!Toolkit.equalsIgnoreCase("function", typeof(hideCallback)))) {
      throw new Error("Invalid Hide Callback");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 构建弹窗
    ////////////////////////////////////////////////////////////////////////////
    $(`#${popupWindowUuid}`).remove();
    let code = "";
    for (let i = 0; i < formItemArray.length; i++) {
      const formItem = formItemArray[i];
      code += formItem.getCode();
    }
    targetObject.append(`
      <div id = "${popupWindowUuid}" class = "popup_window w-screen h-screen top-0 left-0 fixed select-none flex-row justify-between items-stretch opacity-0 transition-opacity duration-500 ease-in-out hidden">
        <div class = "mask w-full h-full grow bg-black bg-opacity-70"></div>
        <div class = "flex flex-row justify-center items-stretch">
          <div class = "window grow bg-white overflow-y-auto" style = "width: ${width}px">
            <div class = "title text-sm font-semibold px-4 py-3 flex flex-row justify-between items-center ${theme}"><span>${title}</span><span><svg class = "w-4 h-4 cursor-pointer hover:text-red-500" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M6 18L18 6M6 6l12 12"></path></svg></span></div>
            <table class = "form w-full">
              <tbody>${code}</tbody>
            </table>
            <div class = "button_bar text-center p-3"></div>
          </div>
        </div>
      </div>
    `);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化事件
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < formItemArray.length; i++) {
      const formItem = formItemArray[i];
      if (Toolkit.equalsIgnoreCase("function", (typeof formItem.initEvent))) {
        formItem.initEvent();
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 添加按钮栏
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < popupWindowButtonArray.length; i++) {
      const popupWindowButton = popupWindowButtonArray[i];
      $(`#${popupWindowUuid}`).find(".button_bar").append(popupWindowButton.getCode());
      if (Toolkit.equalsIgnoreCase("function", (typeof popupWindowButton.initEvent))) {
        popupWindowButton.initEvent();
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 注册左上角关闭按钮的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(`#${popupWindowUuid}`).find(".title").find("svg").off("click").on("click", null, this, function(event) {
      const source = event.data;
      PopupWindow.hide(popupWindowUuid/* 弹窗的uuid */, hideCallback/* 回调方法 */);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 注册右侧遮挡的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(`#${popupWindowUuid}`).find(".mask").off("click").on("click", null, this, function(event) {
      const source = event.data;
      PopupWindow.hide(popupWindowUuid/* 弹窗的uuid */, hideCallback/* 回调方法 */);
    });
  }

  /**
   * 显示
   * @param {string} popupWindowUuid 弹窗的uuid
   */
  static show(popupWindowUuid) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查弹窗的uuid
    ////////////////////////////////////////////////////////////////////////////
    if ((null === popupWindowUuid) || (!Toolkit.equalsIgnoreCase("string", typeof(popupWindowUuid)))) {
      throw new Error("Invalid Popup Window Uuid");
    }
    $(`#${popupWindowUuid}`).removeClass("hidden");
    ////////////////////////////////////////////////////////////////////////////
    // 设置弹出菜单宽度
    ////////////////////////////////////////////////////////////////////////////
    if (0 < $(`#${popupWindowUuid}`).find(".popup_menu").length) {
      const width = $(`#${popupWindowUuid}`).find("table").find("tbody").find("tr").find("td").find("button").get(0).getBoundingClientRect().width;
      $(`#${popupWindowUuid}`).find(".popup_menu").css("width", width);
    }
    ////////////////////////////////////////////////////////////////////////////
    // setTimeout延迟1毫秒可以给渐入效果提供渲染时间
    ////////////////////////////////////////////////////////////////////////////
    setTimeout(function() {
      $(`#${popupWindowUuid}`).addClass("opacity-100");
    }, 1);
  }

  /**
   * 隐藏
   * @param {string} popupWindowUuid 弹窗的uuid
   * @param {function} callback 回调方法
   */
  static hide(popupWindowUuid, callback) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查弹窗的uuid
    ////////////////////////////////////////////////////////////////////////////
    if ((null === popupWindowUuid) || (!Toolkit.equalsIgnoreCase("string", typeof(popupWindowUuid)))) {
      throw new Error("Invalid Popup Window Uuid");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查回调方法
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== callback) && (!Toolkit.equalsIgnoreCase("function", typeof(callback)))) {
      throw new Error("Invalid Callback");
    }
    $(`#${popupWindowUuid}`).off("transitionend").on("transitionend", null, null, function() {
      $(`#${popupWindowUuid}`).addClass("hidden");
      $(`#${popupWindowUuid}`).off("transitionend");
      if (null !== callback) {
        callback();
      }
    });
    $(`#${popupWindowUuid}`).removeClass("opacity-100");
  }
}
