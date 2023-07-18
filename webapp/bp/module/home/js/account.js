"use strict";

class Account {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 控件标识
    ////////////////////////////////////////////////////////////////////////////
    this.dataTable = Toolkit.generateUuid();
    this.modifyPasswordPopupWindow = Toolkit.generateUuid();
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
    });
  }

  /**
   * 初始化视图
   */
  initView() {
    $("title").html(Configure.getTitle());
    ////////////////////////////////////////////////////////////////////////////
    // 本地对象
    ////////////////////////////////////////////////////////////////////////////
    const thisObj = this;
    ////////////////////////////////////////////////////////////////////////////
    // 修改密码弹窗
    ////////////////////////////////////////////////////////////////////////////
    PopupWindow.build($("body")/* 目标对象 */, this.modifyPasswordPopupWindow/* 弹窗的uuid */, PopupWindow.Theme.WARN/* 主题 */, "修改密码"/* 标题 */, 400/* 宽度 */, [
        new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPasswordPopupWindow}old_password`/* id */, "旧密码"/* 标签 */, Module.getMethodParameterRuleObj(this.adminRule, "modifyAdminPasswordBySelf", "old_password").format_prompt/* 提示 */, null/* 值 */, true/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */),
        new PopupWindowFormItemText(true/* 是否必填 */, `${thisObj.modifyPasswordPopupWindow}new_password`/* id */, "新密码"/* 标签 */, Module.getMethodParameterRuleObj(this.adminRule, "modifyAdminPasswordBySelf", "new_password").format_prompt/* 提示 */, null/* 值 */, true/* 是否为密码 */, false/* 是否禁用 */, false/* 是否隐藏 */)
      ]/* 表单项数组 */, [
        new PopupWindowButton("确定"/* 文本 */, "text-white bg-amber-500 hover:bg-amber-600 focus:ring-amber-300 disabled:opacity-70"/* 类 */, function() {
          //////////////////////////////////////////////////////////////////////
          // 校验之前删除提示
          //////////////////////////////////////////////////////////////////////
          $(`#${thisObj.modifyPasswordPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
          //////////////////////////////////////////////////////////////////////
          // 获取数据
          //////////////////////////////////////////////////////////////////////
          const oldPassword = $(`#${thisObj.modifyPasswordPopupWindow}old_password`).val();
          const newPassword = $(`#${thisObj.modifyPasswordPopupWindow}new_password`).val();
          //////////////////////////////////////////////////////////////////////
          // 参数检查数组
          //////////////////////////////////////////////////////////////////////
          const parameterCheckArray = new Array();
          parameterCheckArray.push({"name": "old_password", "value": oldPassword, "obj": $(`#${thisObj.modifyPasswordPopupWindow}old_password`), "allow_null": false, "custom_error_message": null});
          parameterCheckArray.push({"name": "new_password", "value": newPassword, "obj": $(`#${thisObj.modifyPasswordPopupWindow}new_password`), "allow_null": false, "custom_error_message": null});
          //////////////////////////////////////////////////////////////////////
          // 检查参数
          //////////////////////////////////////////////////////////////////////
          for (let i = 0; i < parameterCheckArray.length; i++) {
            const parameterObj = parameterCheckArray[i];
            if (!Module.checkParameter(thisObj.adminRule, "modifyAdminPasswordBySelf", parameterObj, thisObj, function error(thisObj, errorMessage) {
              parameterObj.obj.parent().parent().after(`<tr class = "prompt"><td class = "text-sm text-right px-3 pt-3 w-1 whitespace-nowrap"></td><td class = "text-sm text-left text-rose-600 pr-3">${errorMessage}</td></tr>`);
            })) return;
          }
          //////////////////////////////////////////////////////////////////////
          // 参数对象
          //////////////////////////////////////////////////////////////////////
          const parameter = new FormData();
          for (const obj of parameterCheckArray) {
            parameter.append(obj.name, obj.value);
          }
          //////////////////////////////////////////////////////////////////////
          // 显示等待遮盖
          //////////////////////////////////////////////////////////////////////
          WaitMask.show();
          //////////////////////////////////////////////////////////////////////
          // 修改管理员自身密码
          //////////////////////////////////////////////////////////////////////
          Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Admin/modifyAdminPasswordBySelf`, parameter, thisObj,
            function success(data, source) {
              const responseResult = data;
              //////////////////////////////////////////////////////////////////
              // 隐藏等待遮盖
              //////////////////////////////////////////////////////////////////
              WaitMask.hide();
              if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
                ////////////////////////////////////////////////////////////////
                // 显示消息
                ////////////////////////////////////////////////////////////////
                $(`#${thisObj.modifyPasswordPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-indigo-600 px-3 pt-3" colspan = "2"><div class = "bg-violet-200 rounded-md p-2.5">操作成功</div></td></tr>`);
                ////////////////////////////////////////////////////////////////
                // 重置修改密码控件
                ////////////////////////////////////////////////////////////////
                thisObj.resetControlModifyPassword();
              } else {
                ////////////////////////////////////////////////////////////////
                // 显示消息
                ////////////////////////////////////////////////////////////////
                $(`#${thisObj.modifyPasswordPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">${responseResult.attach}</div></td></tr>`);
              }
            },
            function error(error, source) {
              //////////////////////////////////////////////////////////////////
              // 隐藏等待遮盖
              //////////////////////////////////////////////////////////////////
              WaitMask.hide();
              console.error(error);
              //////////////////////////////////////////////////////////////////
              // 显示消息
              //////////////////////////////////////////////////////////////////
              $(`#${thisObj.modifyPasswordPopupWindow}`).find("table").find("tbody").find("tr:eq(0)").before(`<tr class = "prompt"><td class = "text-sm text-center text-rose-600 px-3 pt-3" colspan = "2"><div class = "bg-rose-200 rounded-md p-2.5">操作失败</div></td></tr>`);
            }
          );
        }/* 点击方法 */),
        new PopupWindowButton("取消"/* 文本 */, "text-gray-500 border border-gray-500 bg-white hover:bg-gray-100 focus:ring-gray-100 disabled:opacity-70"/* 类 */, function() {
          PopupWindow.hide(thisObj.modifyPasswordPopupWindow/* 弹窗的uuid */, function() {
            ////////////////////////////////////////////////////////////////////
            // 隐藏之后删除提示
            ////////////////////////////////////////////////////////////////////
            $(`#${thisObj.modifyPasswordPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
          }/* 回调方法 */);
        }/* 点击方法 */)
      ]/* 弹窗按钮数组 */, function() {
        ////////////////////////////////////////////////////////////////////////
        // 隐藏之后删除提示
        ////////////////////////////////////////////////////////////////////////
        $(`#${thisObj.modifyPasswordPopupWindow}`).find("table").find("tbody").find(".prompt").remove();
      }/* 隐藏回调方法 */
    );
    ////////////////////////////////////////////////////////////////////////////
    // 模板构建
    ////////////////////////////////////////////////////////////////////////////
    const tableCode = `
      <table id = "${this.dataTable}" class = "w-full text-sm text-left text-slate-600">
        <thead class = "font-semibold select-none">
          <tr class = "bg-violet-200"><th class = "px-4 py-3 rounded-tl-lg">名称</th><th class = "w-1/5 px-4 py-3 rounded-tr-lg">操作</th></tr>
        </thead>
        <tbody>
          <tr class = "bg-white hover:bg-orange-50">
            <td class = "px-4 py-3 rounded-bl-lg">${LocalStorage.getItem("account_name")}</td><td class = "px-4 py-3 rounded-br-lg"><span class = "modify_password text-amber-500 cursor-pointer select-none">修改密码</span></td>
          </tr>
        </tbody>
      </table>
    `;
    Template.build($("body")/* 目标对象 */, [
      new TemplateButton("添加管理员"/* 文本 */, null/* 类 */, false/* 是否禁用 */, function() {
        PopupWindow.show(thisObj.addPopupWindow/* 弹窗的uuid */);
      }/* 点击方法 */)
    ]/* 模板按钮数组 */, tableCode/* 内容 */);
    ////////////////////////////////////////////////////////////////////////////
    // 注册操作的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(`#${this.dataTable}`).find("tbody").find("tr").find(".modify_password").off("click").on("click", null, this, function(event) {
      const source = event.data;
      PopupWindow.show(source.modifyPasswordPopupWindow/* 弹窗的uuid */);
    });
  }

  /**
   * 重置修改密码控件
   */
  resetControlModifyPassword() {
    $(`#${this.modifyPasswordPopupWindow}old_password`).val("");
    $(`#${this.modifyPasswordPopupWindow}new_password`).val("");
  }
}
