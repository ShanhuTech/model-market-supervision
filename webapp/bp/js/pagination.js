"use strict";

/**
 * 分页
 */
class Pagination {
  //////////////////////////////////////////////////////////////////////////////
  // 选中样式
  //////////////////////////////////////////////////////////////////////////////
  static SelectedStyle = "color: #2563eb; font-weight: 600; background-color: #dbeafe;";

  /**
   * 构建
   * @param {object} targetObject 目标对象
   * @param {number} buttonCount 分页按钮的数量（不包括“向前”和“向后”）
   * @param {number} dataOffset 数据偏移（从0开始）
   * @param {number} dataRows 数据行数（每页显示的数据数量）
   * @param {number} dataCount 数据总数
   * @param {object} source 调用源对象
   * @param {function} click 点击方法
   */
  static build(targetObject, buttonCount, dataOffset, dataRows, dataCount, source, click) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查目标对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null === targetObject) || (!Toolkit.equalsIgnoreCase("object", typeof(targetObject))) || (0 >= targetObject.length)) {
      throw new Error("Invalid Target Object");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查分页按钮的数量
    ////////////////////////////////////////////////////////////////////////////
    if ((null === buttonCount) || (!Toolkit.equalsIgnoreCase("number", typeof(buttonCount))) || (0 >= buttonCount)) {
      throw new Error("Invalid Button Count");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查数据偏移
    ////////////////////////////////////////////////////////////////////////////
    if ((null === dataOffset) || (!Toolkit.equalsIgnoreCase("number", typeof(dataOffset))) || (0 > dataOffset)) {
      throw new Error("Invalid Data Offset");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查数据行数
    ////////////////////////////////////////////////////////////////////////////
    if ((null === dataRows) || (!Toolkit.equalsIgnoreCase("number", typeof(dataRows))) || (0 >= dataRows)) {
      throw new Error("Invalid Data Rows");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查source
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== source) && (!Toolkit.equalsIgnoreCase("object", typeof(source)))) {
      throw new Error("Invalid Source");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查点击方法
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== click) && (!Toolkit.equalsIgnoreCase("function", typeof(click)))) {
      throw new Error("Invalid Click");
    }
    const currentPage = (0 === dataOffset) ? 1 : Math.ceil(dataOffset / dataRows) + 1;
    const count = Math.ceil(dataCount / dataRows);
    const displaySceneCount = Math.ceil(count / buttonCount);
    const currentPageSceneNum = Math.ceil(currentPage / buttonCount);
    const uuid = Toolkit.generateUuid();
    let code = `<div id = "${uuid}" class = "w-fit flex flex-row justify-center items-stretch cursor-pointer select-none">`;
    if (currentPageSceneNum > 1) {
      const offset = ((currentPageSceneNum - 1) * buttonCount * dataRows) - dataRows;
      code += `<span class = "px-3 py-1.5 text-gray-500 bg-white border border-r-0 border-gray-300 rounded-l-lg flex flex-row justify-center items-center hover:bg-gray-100" data-offset = "${offset}"><svg class = "w-3 h-auto" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M15.75 19.5L8.25 12l7.5-7.5"></path></svg></span>`;
    }
    for (let i = ((currentPageSceneNum * buttonCount) - buttonCount + 1); i <= (currentPageSceneNum * buttonCount); i++) {
      if (i > count) {
        break;
      }
      const offset = i * dataRows - dataRows;
      if (i == (currentPage)) {
        code += `<span class = "btn px-3 py-1.5 text-gray-500 bg-white border border-r-0 border-gray-300 last:border-r hover:bg-gray-100" data-offset = "${offset}" style = "${Pagination.SelectedStyle}">${i}</span>`;
      } else {
        code += `<span class = "btn px-3 py-1.5 text-gray-500 bg-white border border-r-0 border-gray-300 last:border-r hover:bg-gray-100" data-offset = "${offset}">${i}</span>`;
      }
    }
    if ((displaySceneCount - currentPageSceneNum) >= 1) {
      const offset = currentPageSceneNum * buttonCount * dataRows;
      code += `<span class = "px-3 py-1.5 text-gray-500 bg-white border border-gray-300 rounded-r-lg flex flex-row justify-center items-center hover:bg-gray-100" data-offset = "${offset}"><svg class = "w-3 h-auto" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M8.25 4.5l7.5 7.5-7.5 7.5"></path></svg></span>`;
    }
    code += `</div>`;
    targetObject.html(code);
    ////////////////////////////////////////////////////////////////////////////
    // 注册分页按钮的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(`#${uuid}`).find("span").off("click").on("click", null, null, function() {
      $(`#${uuid}`).find(".btn").removeAttr("style");
      if ($(this).hasClass("btn")) {
        $(this).attr("style", Pagination.SelectedStyle);
      }
      click($(this).attr("data-offset"), source);
    });
  }
}
