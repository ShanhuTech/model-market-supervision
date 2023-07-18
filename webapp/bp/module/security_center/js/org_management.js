"use strict";

class OrgManagement {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 组织架构数据数组
    ////////////////////////////////////////////////////////////////////////////
    this.orgArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 获取组织架构分页参数
    ////////////////////////////////////////////////////////////////////////////
    const orgManagementGetParameter = LocalStorage.getItem("org_management_get_parameter");
    if ((null === orgManagementGetParameter) || (null === (this.getOrgParameter = Toolkit.stringToFormData(orgManagementGetParameter)))) {
      this.getOrgParameter = new FormData();
      this.getOrgParameter.append("offset", 0);
      this.getOrgParameter.append("rows", 20);
    } else {
      LocalStorage.removeItem("org_management_get_parameter");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 控件标识
    ////////////////////////////////////////////////////////////////////////////
    this.dataTable = Toolkit.generateUuid();
    this.addPopupWindow = Toolkit.generateUuid();
    this.removePopupWindow = Toolkit.generateUuid();
    this.modifyPopupWindow = Toolkit.generateUuid();
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块规则
    ////////////////////////////////////////////////////////////////////////////
    Module.getModuleRulePromise(this, "security.Org").then(function(result) {
      //////////////////////////////////////////////////////////////////////////
      // 组织架构规则
      //////////////////////////////////////////////////////////////////////////
      result.source.orgRule = result.rule;
      //////////////////////////////////////////////////////////////////////////
      // 初始化视图
      //////////////////////////////////////////////////////////////////////////
      result.source.initView();
      //////////////////////////////////////////////////////////////////////////
      // 隐藏等待遮盖
      //////////////////////////////////////////////////////////////////////////
      WaitMask.hide();
      //////////////////////////////////////////////////////////////////////////
      // 获取组织架构类型
      //////////////////////////////////////////////////////////////////////////
      result.source.getOrgType();
    });
  }

  /**
   * 初始化视图
   */
  initView() {
    $("title").html(Configure.getTitle());
  }

  /**
   * 获取组织架构类型
   */
  getOrgType() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取组织架构类型
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.OrgType/getOrgType`, this.getOrgParameter, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const orgCount = responseResult.content.count;
          source.orgTypeArray = responseResult.content.array; 
          //////////////////////////////////////////////////////////////////////
          // 本地对象
          //////////////////////////////////////////////////////////////////////
          const thisObj = source;
          //////////////////////////////////////////////////////////////////////
          // 下拉框数据填充
          //////////////////////////////////////////////////////////////////////
          const popupWindowFormItemSelectOptionArray = new Array();
          for (let i = 0; i < source.orgTypeArray.length; i++) {
            const orgType = source.orgTypeArray[i];
            popupWindowFormItemSelectOptionArray.push(new PopupWindowFormItemSelectOption(orgType.name/* 文本 */, orgType.uuid/* 值 */, (0 === i) ? true : false/* 是否选中 */));
          }
          //////////////////////////////////////////////////////////////////////
          // 添加组织架构弹窗
          //////////////////////////////////////////////////////////////////////
          PopupWindow.build($("body")/* 目标对象 */, source.addPopupWindow/* 弹窗的uuid */, PopupWindow.Theme.NORMAL/* 主题 */, "添加组织架构"/* 标题 */, 400/* 宽度 */, [
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}parent_uuid`/* id */, "parent_uuid"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "addOrg", "parent_uuid").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, true/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}parent_text`/* id */, "上级组织"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "addOrg", "name").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemSelect(true/* 是否必填 */, `${thisObj.addPopupWindow}type_uuid`/* id */, "类型"/* 标签 */, popupWindowFormItemSelectOptionArray/* 弹窗下拉项表单项数组 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}name`/* id */, "名称"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "addOrg", "name").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}order`/* id */, "排序编号"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "addOrg", "order").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */)
            ]/* 表单项数组 */, [
              new PopupWindowButton("确定"/* 文本 */, "text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300 disabled:opacity-70"/* 类 */, function() {
                ////////////////////////////////////////////////////////////////
                // 校验之前删除提示
                ////////////////////////////////////////////////////////////////
                $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                ////////////////////////////////////////////////////////////////
                // 获取数据
                ////////////////////////////////////////////////////////////////
                const parentUuid = $(`#${thisObj.addPopupWindow}parent_uuid`).val();
                const typeUuid = $(`#${thisObj.addPopupWindow}type_uuid`).attr("data-popup-value");
                const name = $(`#${thisObj.addPopupWindow}name`).val();
                const order = $(`#${thisObj.addPopupWindow}order`).val();
                ////////////////////////////////////////////////////////////////
                // 参数检查数组
                ////////////////////////////////////////////////////////////////
                const parameterCheckArray = new Array();
                parameterCheckArray.push({"name": "parent_uuid", "value": parentUuid, "obj": $(`#${thisObj.addPopupWindow}parent_text`)/* 错误定位于parent_text而非parent_uuid */, "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "type_uuid", "value": typeUuid, "obj": $(`#${thisObj.addPopupWindow}type_uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "name", "value": name, "obj": $(`#${thisObj.addPopupWindow}name`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "order", "value": order, "obj": $(`#${thisObj.addPopupWindow}order`), "allow_null": false, "custom_error_message": null});
                ////////////////////////////////////////////////////////////////
                // 检查参数
                ////////////////////////////////////////////////////////////////
                for (let i = 0; i < parameterCheckArray.length; i++) {
                  const parameterObj = parameterCheckArray[i];
                  if (!Module.checkParameter(thisObj.orgRule, "addOrg", parameterObj, thisObj, function error(thisObj, errorMessage) {
                    parameterObj.obj.parent().parent().after(`<tr class = "prompt"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"></td><td class = "text-sm text-left text-rose-600 pr-3">${errorMessage}</td></tr>`);
                  })) return;
                }
                ////////////////////////////////////////////////////////////////
                // 参数对象
                ////////////////////////////////////////////////////////////////
                const parameter = new FormData();
                for (const obj of parameterCheckArray) {
                  parameter.append(obj.name, obj.value);
                }
                ////////////////////////////////////////////////////////////////
                // 显示等待遮盖
                ////////////////////////////////////////////////////////////////
                WaitMask.show();
                ////////////////////////////////////////////////////////////////
                // 添加组织架构
                ////////////////////////////////////////////////////////////////
                Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Org/addOrg`, parameter, thisObj,
                  function success(data, source) {
                    const responseResult = data;
                    ////////////////////////////////////////////////////////////
                    // 隐藏等待遮盖
                    ////////////////////////////////////////////////////////////
                    WaitMask.hide();
                    if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
                      //////////////////////////////////////////////////////////
                      // 显示消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-indigo-600 px-3 pt-3" colspan = "2"><div class = "bg-violet-200 rounded-md p-2.5">操作成功</div></td></tr>`);
                      //////////////////////////////////////////////////////////
                      // 重置添加组织架构控件
                      //////////////////////////////////////////////////////////
                      thisObj.resetControlAddOrg();
                      //////////////////////////////////////////////////////////
                      // 获取组织架构
                      //////////////////////////////////////////////////////////
                      thisObj.getOrg();
                    } else {
                      //////////////////////////////////////////////////////////
                      // 显示消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">${responseResult.attach}</div></td></tr>`);
                    }
                  },
                  function error(error, source) {
                    ////////////////////////////////////////////////////////////
                    // 隐藏等待遮盖
                    ////////////////////////////////////////////////////////////
                    WaitMask.hide();
                    console.error(error);
                    ////////////////////////////////////////////////////////////
                    // 显示消息
                    ////////////////////////////////////////////////////////////
                    $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">操作失败</div></td></tr>`);
                  }
                );
              }/* 点击方法 */),
              new PopupWindowButton("取消"/* 文本 */, "text-gray-500 border border-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100 disabled:opacity-70"/* 类 */, function() {
                PopupWindow.hide(thisObj.addPopupWindow/* 弹窗的uuid */, function() {
                  //////////////////////////////////////////////////////////////
                  // 隐藏之后删除提示
                  //////////////////////////////////////////////////////////////
                  $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                }/* 回调方法 */);
              }/* 点击方法 */)
            ]/* 弹窗按钮数组 */, function() {
              //////////////////////////////////////////////////////////////////
              // 隐藏之后删除提示
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
              //////////////////////////////////////////////////////////////////
              // 重置添加组织架构控件
              //////////////////////////////////////////////////////////////////
              thisObj.resetControlAddOrg();
            }/* 隐藏回调方法 */
          );
          //////////////////////////////////////////////////////////////////////
          // 删除组织架构弹窗
          //////////////////////////////////////////////////////////////////////
          PopupWindow.build($("body")/* 目标对象 */, source.removePopupWindow/* 弹窗的uuid */, PopupWindow.Theme.DANGER/* 主题 */, "删除组织架构"/* 标题 */, 300/* 宽度 */, [
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.removePopupWindow}uuid`/* id */, "uuid"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "removeOrg", "uuid_array").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, true/* 是否隐藏 */),
              new PopupWindowFormItemMessage(`${thisObj.removePopupWindow}order`/* id */, "确认要删除组织架构吗？"/* 标签 */, false/* 是否隐藏 */)
            ]/* 表单项数组 */, [
              new PopupWindowButton("确定"/* 文本 */, "text-white bg-rose-500 hover:bg-rose-600 focus:ring-rose-300 disabled:opacity-70"/* 类 */, function() {
                ////////////////////////////////////////////////////////////////
                // 校验之前删除提示
                ////////////////////////////////////////////////////////////////
                $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                ////////////////////////////////////////////////////////////////
                // 获取数据
                ////////////////////////////////////////////////////////////////
                const uuid = $(`#${thisObj.removePopupWindow}uuid`).val();
                ////////////////////////////////////////////////////////////////
                // 参数检查数组
                ////////////////////////////////////////////////////////////////
                const parameterCheckArray = new Array();
                parameterCheckArray.push({"name": "uuid_array", "value": uuid, "obj": null, "allow_null": false, "custom_error_message": null});
                ////////////////////////////////////////////////////////////////
                // 检查参数
                ////////////////////////////////////////////////////////////////
                for (let i = 0; i < parameterCheckArray.length; i++) {
                  const parameterObj = parameterCheckArray[i];
                  if (!Module.checkParameter(thisObj.orgRule, "removeOrg", parameterObj, thisObj, function error(thisObj, errorMessage) {
                    $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">${errorMessage}</div></td></tr>`);
                  })) return;
                }
                ////////////////////////////////////////////////////////////////
                // 参数对象
                ////////////////////////////////////////////////////////////////
                const parameter = new FormData();
                for (const obj of parameterCheckArray) {
                  parameter.append(obj.name, obj.value);
                }
                ////////////////////////////////////////////////////////////////
                // 显示等待遮盖
                ////////////////////////////////////////////////////////////////
                WaitMask.show();
                ////////////////////////////////////////////////////////////////
                // 删除组织架构
                ////////////////////////////////////////////////////////////////
                Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Org/removeOrg`, parameter, thisObj,
                  function success(data, source) {
                    const responseResult = data;
                    ////////////////////////////////////////////////////////////
                    // 隐藏等待遮盖
                    ////////////////////////////////////////////////////////////
                    WaitMask.hide();
                    if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
                      //////////////////////////////////////////////////////////
                      // 隐藏消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find(".message").addClass("hidden");
                      //////////////////////////////////////////////////////////
                      // 隐藏按钮
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.removePopupWindow}`).find(".button_bar").find("button:eq(0)").addClass("hidden");
                      //////////////////////////////////////////////////////////
                      // 修改按钮文本
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.removePopupWindow}`).find(".button_bar").find("button:eq(1)").html("关闭");
                      //////////////////////////////////////////////////////////
                      // 显示消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-indigo-600 px-3 pt-3" colspan = "2"><div class = "bg-violet-200 rounded-md p-2.5">操作成功</div></td></tr>`);
                      //////////////////////////////////////////////////////////
                      // 获取组织架构
                      //////////////////////////////////////////////////////////
                      thisObj.getOrg();
                    } else {
                      //////////////////////////////////////////////////////////
                      // 显示消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">${responseResult.attach}</div></td></tr>`);
                    }
                  },
                  function error(error, source) {
                    ////////////////////////////////////////////////////////////
                    // 隐藏等待遮盖
                    ////////////////////////////////////////////////////////////
                    WaitMask.hide();
                    console.error(error);
                    ////////////////////////////////////////////////////////////
                    // 显示消息
                    ////////////////////////////////////////////////////////////
                    $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">操作失败</div></td></tr>`);
                  }
                );
              }/* 点击方法 */),
              new PopupWindowButton("取消"/* 文本 */, "text-gray-500 border border-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100 disabled:opacity-70"/* 类 */, function() {
                PopupWindow.hide(thisObj.removePopupWindow/* 弹窗的uuid */, function() {
                  //////////////////////////////////////////////////////////////
                  // 隐藏之后删除提示
                  //////////////////////////////////////////////////////////////
                  $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                  //////////////////////////////////////////////////////////////
                  // 显示消息
                  //////////////////////////////////////////////////////////////
                  $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find(".message").removeClass("hidden");
                  //////////////////////////////////////////////////////////////
                  // 显示按钮
                  //////////////////////////////////////////////////////////////
                  $(`#${thisObj.removePopupWindow}`).find(".button_bar").find("button:eq(0)").removeClass("hidden");
                  //////////////////////////////////////////////////////////////
                  // 恢复按钮文本
                  //////////////////////////////////////////////////////////////
                  $(`#${thisObj.removePopupWindow}`).find(".button_bar").find("button:eq(1)").html("取消");
                }/* 回调方法 */);
              }/* 点击方法 */)
            ]/* 弹窗按钮数组 */, function() {
              //////////////////////////////////////////////////////////////////
              // 隐藏之后删除提示
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find(".prompt").remove();
              //////////////////////////////////////////////////////////////////
              // 显示消息
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.removePopupWindow}`).find("table").find("tbody").find(".message").removeClass("hidden");
              //////////////////////////////////////////////////////////////////
              // 显示按钮
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.removePopupWindow}`).find(".button_bar").find("button:eq(0)").removeClass("hidden");
              //////////////////////////////////////////////////////////////////
              // 恢复按钮文本
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.removePopupWindow}`).find(".button_bar").find("button:eq(1)").html("取消");
            }/* 隐藏回调方法 */
          );
          //////////////////////////////////////////////////////////////////////
          // 修改组织架构弹窗
          //////////////////////////////////////////////////////////////////////
          PopupWindow.build($("body")/* 目标对象 */, source.modifyPopupWindow/* 弹窗的uuid */, PopupWindow.Theme.WARN/* 主题 */, "修改组织架构"/* 标题 */, 400/* 宽度 */, [
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}uuid`/* id */, "uuid"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "modifyOrg", "uuid").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, true/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}parent_uuid`/* id */, "parent_uuid"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "modifyOrg", "parent_uuid").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, true/* 是否隐藏 */),
              new PopupWindowFormItemSelect(true/* 是否必填 */, `${thisObj.modifyPopupWindow}type_uuid`/* id */, "类型"/* 标签 */, popupWindowFormItemSelectOptionArray/* 弹窗下拉项表单项数组 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}name`/* id */, "名称"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "modifyOrg", "name").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}order`/* id */, "排序编号"/* 标签 */, Module.getMethodParameterRuleObj(source.orgRule, "modifyOrg", "order").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */)
            ]/* 表单项数组 */, [
              new PopupWindowButton("确定"/* 文本 */, "text-white bg-amber-500 hover:bg-amber-600 focus:ring-amber-300 disabled:opacity-70"/* 类 */, function() {
                ////////////////////////////////////////////////////////////////
                // 校验之前删除提示
                ////////////////////////////////////////////////////////////////
                $(`#${thisObj.modifyPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                ////////////////////////////////////////////////////////////////
                // 获取数据
                ////////////////////////////////////////////////////////////////
                const uuid = $(`#${thisObj.modifyPopupWindow}uuid`).val();
                const parentUuid = $(`#${thisObj.modifyPopupWindow}parent_uuid`).val();
                const typeUuid = $(`#${thisObj.modifyPopupWindow}type_uuid`).attr("data-popup-value");
                const name = $(`#${thisObj.modifyPopupWindow}name`).val();
                const order = $(`#${thisObj.modifyPopupWindow}order`).val();
                ////////////////////////////////////////////////////////////////
                // 参数检查数组
                ////////////////////////////////////////////////////////////////
                const parameterCheckArray = new Array();
                parameterCheckArray.push({"name": "uuid", "value": uuid, "obj": $(`#${thisObj.modifyPopupWindow}uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "parent_uuid", "value": parentUuid, "obj": $(`#${thisObj.modifyPopupWindow}parent_uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "type_uuid", "value": typeUuid, "obj": $(`#${thisObj.modifyPopupWindow}type_uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "name", "value": name, "obj": $(`#${thisObj.modifyPopupWindow}name`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "order", "value": order, "obj": $(`#${thisObj.modifyPopupWindow}order`), "allow_null": false, "custom_error_message": null});
                ////////////////////////////////////////////////////////////////
                // 检查参数
                ////////////////////////////////////////////////////////////////
                for (let i = 0; i < parameterCheckArray.length; i++) {
                  const parameterObj = parameterCheckArray[i];
                  if (!Module.checkParameter(thisObj.orgRule, "modifyOrg", parameterObj, thisObj, function error(thisObj, errorMessage) {
                    parameterObj.obj.parent().parent().after(`<tr class = "prompt"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"></td><td class = "text-sm text-left text-rose-600 pr-3">${errorMessage}</td></tr>`);
                  })) return;
                }
                ////////////////////////////////////////////////////////////////
                // 参数对象
                ////////////////////////////////////////////////////////////////
                const parameter = new FormData();
                for (const obj of parameterCheckArray) {
                  parameter.append(obj.name, obj.value);
                }
                ////////////////////////////////////////////////////////////////
                // 显示等待遮盖
                ////////////////////////////////////////////////////////////////
                WaitMask.show();
                ////////////////////////////////////////////////////////////////
                // 修改组织架构
                ////////////////////////////////////////////////////////////////
                Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Org/modifyOrg`, parameter, thisObj,
                  function success(data, source) {
                    const responseResult = data;
                    ////////////////////////////////////////////////////////////
                    // 隐藏等待遮盖
                    ////////////////////////////////////////////////////////////
                    WaitMask.hide();
                    if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
                      //////////////////////////////////////////////////////////
                      // 显示消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.modifyPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-indigo-600 px-3 pt-3" colspan = "2"><div class = "bg-violet-200 rounded-md p-2.5">操作成功</div></td></tr>`);
                      //////////////////////////////////////////////////////////
                      // 获取组织架构
                      //////////////////////////////////////////////////////////
                      thisObj.getOrg();
                    } else {
                      //////////////////////////////////////////////////////////
                      // 显示消息
                      //////////////////////////////////////////////////////////
                      $(`#${thisObj.modifyPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">${responseResult.attach}</div></td></tr>`);
                    }
                  },
                  function error(error, source) {
                    ////////////////////////////////////////////////////////////
                    // 隐藏等待遮盖
                    ////////////////////////////////////////////////////////////
                    WaitMask.hide();
                    console.error(error);
                    ////////////////////////////////////////////////////////////
                    // 显示消息
                    ////////////////////////////////////////////////////////////
                    $(`#${thisObj.modifyPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">操作失败</div></td></tr>`);
                  }
                );
              }/* 点击方法 */),
              new PopupWindowButton("取消"/* 文本 */, "text-gray-500 border border-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100 disabled:opacity-70"/* 类 */, function() {
                PopupWindow.hide(thisObj.modifyPopupWindow/* 弹窗的uuid */, function() {
                  //////////////////////////////////////////////////////////////
                  // 隐藏之后删除提示
                  //////////////////////////////////////////////////////////////
                  $(`#${thisObj.modifyPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                }/* 回调方法 */);
              }/* 点击方法 */)
            ]/* 弹窗按钮数组 */, function() {
              //////////////////////////////////////////////////////////////////
              // 隐藏之后删除提示
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.modifyPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
            }/* 隐藏回调方法 */
          );
          //////////////////////////////////////////////////////////////////////
          // 模板构建
          //////////////////////////////////////////////////////////////////////
          const tableCode = `
            <table id = "${source.dataTable}" class = "w-full text-sm text-left text-slate-600">
              <thead class = "font-semibold select-none">
                <tr class = "bg-violet-200"><th class = "px-4 py-3 rounded-tl-lg">名称</th><th class = "px-4 py-3">类型</th><th class = "px-4 py-3 rounded-tr-lg">操作</th></tr>
              </thead>
              <tbody>
                <tr class = "bg-white hover:bg-orange-50"><td class = "text-center px-4 py-3 rounded-b-lg select-none" colspan = "3">无</td></tr>
              </tbody>
            </table>
          `;
          Template.build($("body")/* 目标对象 */, [
            new TemplateButton("添加组织架构"/* 文本 */, null/* 类 */, false/* 是否禁用 */, function() {
              $(`#${thisObj.addPopupWindow}parent_uuid`).val("0");
              $(`#${thisObj.addPopupWindow}parent_text`).val("无");
              PopupWindow.show(thisObj.addPopupWindow/* 弹窗的uuid */);
            }/* 点击方法 */)
          ]/* 模板按钮数组 */, tableCode/* 内容 */);
          //////////////////////////////////////////////////////////////////////
          // 隐藏等待遮盖
          //////////////////////////////////////////////////////////////////////
          WaitMask.hide();
          //////////////////////////////////////////////////////////////////////
          // 获取组织架构
          //////////////////////////////////////////////////////////////////////
          source.getOrg();
        } else {
          Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, responseResult.attach/* 内容 */);
        }
      },
      function error(error, source) {
        console.error(error);
        Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, error.toString()/* 内容 */);
      }
    );
  }

  /**
   * 获取组织架构
   */
  getOrg() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取组织架构
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Org/getOrg`, this.getOrgParameter, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const orgCount = responseResult.content.count;
          source.orgArray = responseResult.content.array; 
          //////////////////////////////////////////////////////////////////////
          // 添加显示数据
          //////////////////////////////////////////////////////////////////////
          let tbodyCode = "";
          for (let i = 0; i < source.orgArray.length; i++) {
            const leftRoundedCode = ((i + 1) === source.orgArray.length) ? "rounded-bl-lg" : "";
            const rightRoundedCode = ((i + 1) === source.orgArray.length) ? "rounded-br-lg" : "";
            const org = source.orgArray[i];
            ////////////////////////////////////////////////////////////////////
            // 理论上，左右间距数值应为(org.level - 1) * 16，但这里的样式会覆盖t
            // d的px-4，所以需要把px-4的距离加上
            ////////////////////////////////////////////////////////////////////
            const styleCode = `style = "padding-left: ${org.level * 16}px; padding-right: ${org.level * 16}px"`;
            let svgCode = "";
            if (1 < org.level) {
              svgCode = `<svg class = "w-3 mr-2" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M19.5 12h-15"></path></svg>`;
            }
            tbodyCode += `
              <tr class = "bg-white hover:bg-orange-50">
                <td class = "px-4 py-3 flex flex-row justify-start items-center ${leftRoundedCode}" ${styleCode}>${svgCode}<span>${org.name}</span></td><td class = "px-4 py-3">${org.type_name}</td><td class = "px-4 py-3 ${rightRoundedCode}" data-uuid = "${org.uuid}" data-name = "${org.name}"><span class = "add_admin text-lime-500 ml-4 cursor-pointer select-none">添加管理员</span><span class = "add_org text-indigo-500 ml-4 cursor-pointer select-none">添加组织架构</span><span class = "modify text-amber-500 ml-4 cursor-pointer select-none">修改</span><span class = "remove text-rose-500 ml-4 cursor-pointer select-none">删除</span></td>
              </tr>
            `;
          }
          if (0 < tbodyCode.length) {
            $(`#${source.dataTable}`).find("tbody").html(tbodyCode);
            ////////////////////////////////////////////////////////////////////
            // 注册操作的click事件
            ////////////////////////////////////////////////////////////////////
            $(`#${source.dataTable}`).find("tbody").find("tr").find(".add_admin").off("click").on("click", null, source, function(event) {
              const source = event.data;
              LocalStorage.setItem("org_management_get_parameter", Toolkit.formDataToString(source.getOrgParameter));
              LocalStorage.setItem("admin_management_org_uuid", $(this).parent().attr("data-uuid"));
              LocalStorage.setItem("admin_management_org_name", $(this).parent().attr("data-name"));
              window.location.href = "./admin_management.html";
            });
            $(`#${source.dataTable}`).find("tbody").find("tr").find(".add_org").off("click").on("click", null, source, function(event) {
              const source = event.data;
              for (let i = 0; i < source.orgArray.length; i++) {
                const org = source.orgArray[i];
                if (org.uuid === $(this).parent().attr("data-uuid")) {
                  $(`#${source.addPopupWindow}parent_uuid`).val(org.uuid);
                  $(`#${source.addPopupWindow}parent_text`).val(org.name);
                  PopupWindow.show(source.addPopupWindow/* 弹窗的uuid */);
                  break;
                }
              }
            });
            $(`#${source.dataTable}`).find("tbody").find("tr").find(".modify").off("click").on("click", null, source, function(event) {
              const source = event.data;
              for (let i = 0; i < source.orgArray.length; i++) {
                const org = source.orgArray[i];
                if (org.uuid === $(this).parent().attr("data-uuid")) {
                  $(`#${source.modifyPopupWindow}uuid`).val(org.uuid);
                  $(`#${source.modifyPopupWindow}parent_uuid`).val(org.parent_uuid);
                  $(`#${$(`#${source.modifyPopupWindow}type_uuid`).attr("data-popup-id")}`).each(function() {
                    if (Toolkit.equalsIgnoreCase($(this).attr("data-value"), $(`#${source.modifyPopupWindow}type_uuid`).attr("data-popup-value"))) {
                      $(this).trigger("click");
                      return false;
                    }
                  });
                  $(`#${source.modifyPopupWindow}name`).val(org.name);
                  $(`#${source.modifyPopupWindow}order`).val(org.order);
                  PopupWindow.show(source.modifyPopupWindow/* 弹窗的uuid */);
                  break;
                }
              }
            });
            $(`#${source.dataTable}`).find("tbody").find("tr").find(".remove").off("click").on("click", null, source, function(event) {
              const source = event.data;
              $(`#${source.removePopupWindow}uuid`).val($(this).parent().attr("data-uuid"));
              PopupWindow.show(source.removePopupWindow/* 弹窗的uuid */);
            });
            ////////////////////////////////////////////////////////////////////
            // 分页构建
            ////////////////////////////////////////////////////////////////////
            $("body").find(".pagination").remove();
            $("body").append(`<div class = "pagination flex flex-row justify-end items-center"></div>`);
            Pagination.build($("body").find(".pagination"), 3/*分页按钮数量*/, parseInt(source.getOrgParameter.get("offset"))/*数据偏移*/, parseInt(source.getOrgParameter.get("rows"))/*数据行数*/, orgCount/*数据总数*/, source, function(offset, source) {
              source.getOrgParameter.set("offset", offset);
              source.getOrg();
            }/* 点击方法 */);
          }
          //////////////////////////////////////////////////////////////////////
          // 隐藏等待遮盖
          //////////////////////////////////////////////////////////////////////
          WaitMask.hide();
        } else {
          Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, responseResult.attach/* 内容 */);
        }
      },
      function error(error, source) {
        console.error(error);
        Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, error.toString()/* 内容 */);
      }
    );
  }

  /**
   * 重置添加组织架构控件
   */
  resetControlAddOrg() {
    $(`#${$(`#${this.addPopupWindow}type_uuid`).attr("data-popup-id")}`).find("li:eq(0)").trigger("click");
    $(`#${this.addPopupWindow}name`).val("");
    $(`#${this.addPopupWindow}order`).val("");
  }
}
