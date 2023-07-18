"use strict";

class AdminManagement {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 默认无修改密码值
    ////////////////////////////////////////////////////////////////////////////
    this.defaultPasswordNotChangeValue = "defaultPwd";
    ////////////////////////////////////////////////////////////////////////////
    // 管理员数据数组
    ////////////////////////////////////////////////////////////////////////////
    this.adminArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 获取管理员分页参数
    ////////////////////////////////////////////////////////////////////////////
    this.getAdminParameter = new FormData();
    this.adminManagementOrgUuid = LocalStorage.getItem("admin_management_org_uuid");
    this.adminManagementOrgName = LocalStorage.getItem("admin_management_org_name");
    if (null === this.adminManagementOrgUuid) {
      throw new Error("Invalid Org Uuid");
    }
    this.getAdminParameter.append("org_uuid_array", this.adminManagementOrgUuid);
    this.getAdminParameter.append("offset", 0);
    this.getAdminParameter.append("rows", 20);
    ////////////////////////////////////////////////////////////////////////////
    // 控件标识
    ////////////////////////////////////////////////////////////////////////////
    this.dataTable = Toolkit.generateUuid();
    this.addPopupWindow = Toolkit.generateUuid();
    this.removePopupWindow = Toolkit.generateUuid();
    this.modifyPopupWindow = Toolkit.generateUuid();
    this.filterPopupWindow = Toolkit.generateUuid();
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块规则
    ////////////////////////////////////////////////////////////////////////////
    Module.getModuleRulePromise(this, "security.Admin").then(function(result) {
      //////////////////////////////////////////////////////////////////////////
      // 管理员规则
      //////////////////////////////////////////////////////////////////////////
      result.source.adminRule = result.rule;
      //////////////////////////////////////////////////////////////////////////
      // 初始化视图
      //////////////////////////////////////////////////////////////////////////
      result.source.initView();
      //////////////////////////////////////////////////////////////////////////
      // 隐藏等待遮盖
      //////////////////////////////////////////////////////////////////////////
      WaitMask.hide();
      //////////////////////////////////////////////////////////////////////////
      // 获取角色
      //////////////////////////////////////////////////////////////////////////
      result.source.getRole();
    });
  }

  /**
   * 初始化视图
   */
  initView() {
    $("title").html(Configure.getTitle());
  }

  /**
   * 获取角色
   */
  getRole() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取角色
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Role/getRole`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          source.roleArray = responseResult.content.array;
          //////////////////////////////////////////////////////////////////////
          // 本地对象
          //////////////////////////////////////////////////////////////////////
          const thisObj = source;
          //////////////////////////////////////////////////////////////////////
          // 下拉框数据填充
          //////////////////////////////////////////////////////////////////////
          const popupWindowFormItemSelectOptionArray = new Array();
          for (let i = 0; i < source.roleArray.length; i++) {
            const role = source.roleArray[i];
            popupWindowFormItemSelectOptionArray.push(new PopupWindowFormItemSelectOption(role.name/* 文本 */, role.uuid/* 值 */, (0 === i) ? true : false/* 是否选中 */));
          }
          //////////////////////////////////////////////////////////////////////
          // 添加管理员弹窗
          //////////////////////////////////////////////////////////////////////
          PopupWindow.build($("body")/* 目标对象 */, source.addPopupWindow/* 弹窗的uuid */, PopupWindow.Theme.NORMAL/* 主题 */, "添加管理员"/* 标题 */, 400/* 宽度 */, [
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}org_name`/* id */, "所属组织"/* 标签 */, null/* 提示 */, source.adminManagementOrgName/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemSelect(true/* 是否必填 */, `${thisObj.addPopupWindow}role_uuid`/* id */, "角色"/* 标签 */, popupWindowFormItemSelectOptionArray/* 弹窗下拉项表单项数组 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}name`/* id */, "名称"/* 标签 */, Module.getMethodParameterRuleObj(source.adminRule, "addAdmin", "name").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.addPopupWindow}password`/* id */, "密码"/* 标签 */, Module.getMethodParameterRuleObj(source.adminRule, "addAdmin", "password").format_prompt/* 提示 */, null/* 值 */, true/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */)
            ]/* 表单项数组 */, [
              new PopupWindowButton("确定"/* 文本 */, "text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300 disabled:opacity-70"/* 类 */, function() {
                ////////////////////////////////////////////////////////////////
                // 校验之前删除提示
                ////////////////////////////////////////////////////////////////
                $(`#${thisObj.addPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
                ////////////////////////////////////////////////////////////////
                // 获取数据
                ////////////////////////////////////////////////////////////////
                const roleUuid = $(`#${thisObj.addPopupWindow}role_uuid`).attr("data-popup-value");
                const name = $(`#${thisObj.addPopupWindow}name`).val();
                const password = $(`#${thisObj.addPopupWindow}password`).val();
                ////////////////////////////////////////////////////////////////
                // 参数检查数组
                ////////////////////////////////////////////////////////////////
                const parameterCheckArray = new Array();
                parameterCheckArray.push({"name": "role_uuid", "value": roleUuid, "obj": $(`#${thisObj.addPopupWindow}role_uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "org_uuid", "value": thisObj.adminManagementOrgUuid, "obj": $(`#${thisObj.adminPopupWindow}org_name`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "name", "value": name, "obj": $(`#${thisObj.addPopupWindow}name`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "password", "value": password, "obj": $(`#${thisObj.addPopupWindow}password`), "allow_null": false, "custom_error_message": null});
                ////////////////////////////////////////////////////////////////
                // 检查参数
                ////////////////////////////////////////////////////////////////
                for (let i = 0; i < parameterCheckArray.length; i++) {
                  const parameterObj = parameterCheckArray[i];
                  if (!Module.checkParameter(thisObj.adminRule, "addAdmin", parameterObj, thisObj, function error(thisObj, errorMessage) {
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
                // 添加管理员
                ////////////////////////////////////////////////////////////////
                Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Admin/addAdmin`, parameter, thisObj,
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
                      // 重置添加管理员控件
                      //////////////////////////////////////////////////////////
                      thisObj.resetControlAddAdmin();
                      //////////////////////////////////////////////////////////
                      // 获取管理员
                      //////////////////////////////////////////////////////////
                      thisObj.getAdmin();
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
              // 重置添加管理员控件
              //////////////////////////////////////////////////////////////////
              thisObj.resetControlAddAdmin();
            }/* 隐藏回调方法 */
          );
          //////////////////////////////////////////////////////////////////////
          // 删除管理员弹窗
          //////////////////////////////////////////////////////////////////////
          PopupWindow.build($("body")/* 目标对象 */, source.removePopupWindow/* 弹窗的uuid */, PopupWindow.Theme.DANGER/* 主题 */, "删除管理员"/* 标题 */, 300/* 宽度 */, [
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.removePopupWindow}uuid`/* id */, "uuid"/* 标签 */, Module.getMethodParameterRuleObj(source.adminRule, "removeAdmin", "uuid_array").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, true/* 是否隐藏 */),
              new PopupWindowFormItemMessage(`${thisObj.removePopupWindow}order`/* id */, "确认要删除管理员吗？"/* 标签 */, false/* 是否隐藏 */)
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
                  if (!Module.checkParameter(thisObj.adminRule, "removeAdmin", parameterObj, thisObj, function error(thisObj, errorMessage) {
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
                // 删除管理员
                ////////////////////////////////////////////////////////////////
                Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Admin/removeAdmin`, parameter, thisObj,
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
                      // 获取管理员
                      //////////////////////////////////////////////////////////
                      thisObj.getAdmin();
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
          // 修改管理员弹窗
          //////////////////////////////////////////////////////////////////////
          PopupWindow.build($("body")/* 目标对象 */, source.modifyPopupWindow/* 弹窗的uuid */, PopupWindow.Theme.WARN/* 主题 */, "修改管理员"/* 标题 */, 400/* 宽度 */, [
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}uuid`/* id */, "uuid"/* 标签 */, Module.getMethodParameterRuleObj(source.adminRule, "modifyAdmin", "uuid").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, true/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}org_name`/* id */, "所属组织"/* 标签 */, null/* 提示 */, source.adminManagementOrgName/* 值 */, false/* 是否为密码 */, true/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemSelect(true/* 是否必填 */, `${thisObj.modifyPopupWindow}role_uuid`/* id */, "类型"/* 标签 */, popupWindowFormItemSelectOptionArray/* 弹窗下拉项表单项数组 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}name`/* id */, "名称"/* 标签 */, Module.getMethodParameterRuleObj(source.adminRule, "modifyAdmin", "name").format_prompt/* 提示 */, null/* 值 */, false/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */),
              new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPopupWindow}password`/* id */, "密码"/* 标签 */, Module.getMethodParameterRuleObj(source.adminRule, "modifyAdmin", "password").format_prompt/* 提示 */, thisObj.defaultPasswordNotChangeValue/* 值 */, true/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */)
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
                const roleUuid = $(`#${thisObj.modifyPopupWindow}role_uuid`).attr("data-popup-value");
                const name = $(`#${thisObj.modifyPopupWindow}name`).val();
                const password = $(`#${thisObj.modifyPopupWindow}password`).val();
                ////////////////////////////////////////////////////////////////
                // 参数检查数组
                ////////////////////////////////////////////////////////////////
                const parameterCheckArray = new Array();
                parameterCheckArray.push({"name": "uuid", "value": uuid, "obj": $(`#${thisObj.modifyPopupWindow}uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "role_uuid", "value": roleUuid, "obj": $(`#${thisObj.modifyPopupWindow}role_uuid`), "allow_null": false, "custom_error_message": null});
                parameterCheckArray.push({"name": "name", "value": name, "obj": $(`#${thisObj.modifyPopupWindow}name`), "allow_null": false, "custom_error_message": null});
                if (!Toolkit.equalsIgnoreCase(thisObj.defaultPasswordNotChangeValue, password)) {
                  parameterCheckArray.push({"name": "password", "value": password, "obj": $(`#${thisObj.modifyPopupWindow}password`), "allow_null": false, "custom_error_message": null});
                }
                ////////////////////////////////////////////////////////////////
                // 检查参数
                ////////////////////////////////////////////////////////////////
                for (let i = 0; i < parameterCheckArray.length; i++) {
                  const parameterObj = parameterCheckArray[i];
                  if (!Module.checkParameter(thisObj.adminRule, "modifyAdmin", parameterObj, thisObj, function error(thisObj, errorMessage) {
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
                // 修改管理员
                ////////////////////////////////////////////////////////////////
                Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Admin/modifyAdmin`, parameter, thisObj,
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
                      // 获取管理员
                      //////////////////////////////////////////////////////////
                      thisObj.getAdmin();
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
            new TemplateButton("返回组织架构"/* 文本 */, null/* 类 */, false/* 是否禁用 */, function() {
              window.location.href = "./org_management.html";
            }/* 点击方法 */),
            new TemplateButton("添加管理员"/* 文本 */, null/* 类 */, false/* 是否禁用 */, function() {
              PopupWindow.show(thisObj.addPopupWindow/* 弹窗的uuid */);
            }/* 点击方法 */)
          ]/* 模板按钮数组 */, tableCode/* 内容 */);
          //////////////////////////////////////////////////////////////////////
          // 隐藏等待遮盖
          //////////////////////////////////////////////////////////////////////
          WaitMask.hide();
          //////////////////////////////////////////////////////////////////////
          // 获取管理员
          //////////////////////////////////////////////////////////////////////
          source.getAdmin();
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
   * 获取管理员
   */
  getAdmin() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取管理员
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Admin/getAdmin`, this.getAdminParameter, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const adminCount = responseResult.content.count;
          source.adminArray = responseResult.content.array; 
          //////////////////////////////////////////////////////////////////////
          // 添加显示数据
          //////////////////////////////////////////////////////////////////////
          let tbodyCode = "";
          for (let i = 0; i < source.adminArray.length; i++) {
            const leftRoundedCode = ((i + 1) === source.adminArray.length) ? "rounded-bl-lg" : "";
            const rightRoundedCode = ((i + 1) === source.adminArray.length) ? "rounded-br-lg" : "";
            const admin = source.adminArray[i];
            tbodyCode += `
              <tr class = "bg-white hover:bg-orange-50">
                <td class = "px-4 py-3 flex flex-row justify-start items-center ${leftRoundedCode}">${admin.name}</td><td class = "px-4 py-3">${admin.role_name}</td><td class = "px-4 py-3 ${rightRoundedCode}" data-uuid = "${admin.uuid}"><span class = "modify text-amber-500 ml-4 cursor-pointer select-none">修改</span><span class = "remove text-rose-500 ml-4 cursor-pointer select-none">删除</span></td>
              </tr>
            `;
          }
          if (0 < tbodyCode.length) {
            $(`#${source.dataTable}`).find("tbody").html(tbodyCode);
            ////////////////////////////////////////////////////////////////////
            // 注册操作的click事件
            ////////////////////////////////////////////////////////////////////
            $(`#${source.dataTable}`).find("tbody").find("tr").find(".modify").off("click").on("click", null, source, function(event) {
              const source = event.data;
              for (let i = 0; i < source.adminArray.length; i++) {
                const admin = source.adminArray[i];
                if (admin.uuid === $(this).parent().attr("data-uuid")) {
                  $(`#${source.modifyPopupWindow}uuid`).val(admin.uuid);
                  $(`#${$(`#${source.modifyPopupWindow}role_uuid`).attr("data-popup-id")}`).each(function() {
                    if (Toolkit.equalsIgnoreCase($(this).attr("data-value"), $(`#${source.modifyPopupWindow}role_uuid`).attr("data-popup-value"))) {
                      $(this).trigger("click");
                      return false;
                    }
                  });
                  $(`#${source.modifyPopupWindow}name`).val(admin.name);
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
            Pagination.build($("body").find(".pagination"), 3/*分页按钮数量*/, parseInt(source.getAdminParameter.get("offset"))/*数据偏移*/, parseInt(source.getAdminParameter.get("rows"))/*数据行数*/, adminCount/*数据总数*/, source, function(offset, source) {
              source.getAdminParameter.set("offset", offset);
              source.getAdmin();
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
   * 重置添加管理员控件
   */
  resetControlAddAdmin() {
    $(`#${$(`#${this.addPopupWindow}role_uuid`).attr("data-popup-id")}`).find("li:eq(0)").trigger("click");
    $(`#${this.addPopupWindow}name`).val("");
    $(`#${this.addPopupWindow}password`).val("");
  }
}
