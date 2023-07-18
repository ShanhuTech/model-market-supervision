"use strict";

class RolePermission {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 角色数据数组
    ////////////////////////////////////////////////////////////////////////////
    this.roleArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 权限数据数组
    ////////////////////////////////////////////////////////////////////////////
    this.permissionArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 控件标识
    ////////////////////////////////////////////////////////////////////////////
    this.dataTable = Toolkit.generateUuid();
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块规则
    ////////////////////////////////////////////////////////////////////////////
    Module.getModuleRulePromise(this, "security.Role").then(function(result) {
      //////////////////////////////////////////////////////////////////////////
      // 角色规则
      //////////////////////////////////////////////////////////////////////////
      result.source.roleRule = result.rule;
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
          const roleCount = responseResult.content.count;
          source.roleArray = responseResult.content.array; 
          //////////////////////////////////////////////////////////////////////
          // 下拉框数据填充
          //////////////////////////////////////////////////////////////////////
          const templateSelectOptionArray = new Array();
          templateSelectOptionArray.push(new TemplateSelectOption("选择角色"/* 文本 */, null/* 值 */, true/* 是否选中 */));
          for (let i = 0; i < source.roleArray.length; i++) {
            const role = source.roleArray[i];
            templateSelectOptionArray.push(new TemplateSelectOption(role.name/* 文本 */, role.uuid/* 值 */, false/* 是否选中 */));
          }
          //////////////////////////////////////////////////////////////////////
          // 模板构建
          //////////////////////////////////////////////////////////////////////
          const tableCode = `
            <table id = "${source.dataTable}" class = "w-full text-sm text-left text-slate-600">
              <tbody class = "bg-white select-none">
                <tr class = "bg-white hover:bg-orange-50"><td class = "text-center px-4 py-3 rounded-b-lg select-none">无</td></tr>
              </tbody>
            </table>
          `;
          Template.build($("body")/* 目标对象 */, [
            new TemplateSelect("permission_select"/* id */, 200/* 宽度 */, templateSelectOptionArray/* 模板下拉框数组 */, false/* 是否禁用 */, function() {
              const selectRoleUuid = $("#permission_select").attr("data-popup-value");
              $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]`).prop("checked", false);
              for (let i = 0; i < source.roleArray.length; i++) {
                const role = source.roleArray[i];
                if (selectRoleUuid === role.uuid) {
                  if (role.hasOwnProperty("permissions")) {
                    const permissions = role.permissions.split(";");
                    for (let j = 0; j < permissions.length; j++) {
                      const permission = permissions[j];
                      if (0 < permission.length) {
                        $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[value = "${permission}"]`).trigger("click");
                      }
                    }
                    $(".toolbar").find("button").prop("disabled", false);
                  } else {
                    $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]`).prop("checked", false);
                  }
                  break;
                }
              }
            }/* 改变回调方法 */),
            new TemplateButton("保存"/* 文本 */, null/* 类 */, false/* 是否禁用 */, function() {
              //////////////////////////////////////////////////////////////////
              // 获取数据
              //////////////////////////////////////////////////////////////////
              const uuid = $("#permission_select").attr("data-popup-value");
              let permissionArray = "";
              $(`#${source.dataTable}`).find("tbody").find(".method_row").find(`input[type = "checkbox"]:checked`).each(function() {
                permissionArray += $(this).val() + ";";
              });
              if (0 < permissionArray.length) {
                permissionArray = permissionArray.substring(0, permissionArray.length - 1);
              }
              //////////////////////////////////////////////////////////////////
              // 参数检查数组
              //////////////////////////////////////////////////////////////////
              const parameterCheckArray = new Array();
              parameterCheckArray.push({"name": "uuid", "value": uuid, "obj": null, "allow_null": false, "custom_error_message": "必须选择一个角色"});
              parameterCheckArray.push({"name": "permission_array", "value": permissionArray, "obj": null, "allow_null": true, "custom_error_message": null});
              //////////////////////////////////////////////////////////////////
              // 检查参数
              //////////////////////////////////////////////////////////////////
              for (let i = 0; i < parameterCheckArray.length; i++) {
                const parameterObj = parameterCheckArray[i];
                if (!Module.checkParameter(source.roleRule, "modifyRole", parameterObj, source, function error(source, errorMessage) {
                  Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, errorMessage/* 内容 */);
                })) return;
              }
              //////////////////////////////////////////////////////////////////
              // 参数对象
              //////////////////////////////////////////////////////////////////
              const parameter = new FormData();
              for (const obj of parameterCheckArray) {
                parameter.append(obj.name, obj.value);
              }
              //////////////////////////////////////////////////////////////////
              // 显示等待遮盖
              //////////////////////////////////////////////////////////////////
              WaitMask.show();
              //////////////////////////////////////////////////////////////////
              // 修改角色
              //////////////////////////////////////////////////////////////////
              Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Role/modifyRole`, parameter, source,
                function success(data, source) {
                  const responseResult = data;
                  //////////////////////////////////////////////////////////////
                  // 隐藏等待遮盖
                  //////////////////////////////////////////////////////////////
                  WaitMask.hide();
                  if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
                    ////////////////////////////////////////////////////////////
                    // 显示消息
                    ////////////////////////////////////////////////////////////
                    Toast.show(Toast.Type.INFO/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "成功"/* 标题 */, "保存成功"/* 内容 */);
                    ////////////////////////////////////////////////////////////
                    // 更新角色数据
                    ////////////////////////////////////////////////////////////
                    source.updateRoleData();
                  } else {
                    ////////////////////////////////////////////////////////////
                    // 显示消息
                    ////////////////////////////////////////////////////////////
                    Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, responseResult.attach/* 内容 */);
                  }
                },
                function error(error, source) {
                  //////////////////////////////////////////////////////////////
                  // 隐藏等待遮盖
                  //////////////////////////////////////////////////////////////
                  WaitMask.hide();
                  console.error(error);
                  //////////////////////////////////////////////////////////////
                  // 显示消息
                  //////////////////////////////////////////////////////////////
                  Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, "操作失败"/* 内容 */);
                }
              );
            }/* 点击方法 */)
          ]/* 模板按钮数组 */, tableCode/* 内容 */);
          //////////////////////////////////////////////////////////////////////
          // 获取权限
          //////////////////////////////////////////////////////////////////////
          source.getPermission();
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
   * 更新角色数据
   */
  updateRoleData() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取角色
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Role/getRole`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const roleCount = responseResult.content.count;
          source.roleArray = responseResult.content.array; 
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
   * 获取权限
   */
  getPermission() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取权限
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.ModuleMethod/getModuleMethod`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          source.moduleMethodArray = responseResult.content.array;
          let tbodyCode = "";
          for (let i = 0; i < source.moduleMethodArray.length; i++) {
            ////////////////////////////////////////////////////////////////////
            // 权限对象
            ////////////////////////////////////////////////////////////////////
            const moduleMethod = source.moduleMethodArray[i];
            tbodyCode += `
              <tr class = "module_row">
                <td class = "px-4 p-3" colspan = "4">
                  <input class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded mr-1 focus:ring-blue-500 disabled:cursor-not-allowed" type = "checkbox" data-module = "${moduleMethod.module}" />
                  <label class = "module cursor-pointer" data-module = "${moduleMethod.module}">${moduleMethod.module}</label>
                </td>
              </tr>
            `;
            ////////////////////////////////////////////////////////////////////
            // 屏蔽ping方法，角色权限中不需要
            ////////////////////////////////////////////////////////////////////
            for (let j = 0; j < moduleMethod.methods.length; j++) {
              if (Toolkit.equalsIgnoreCase("ping", moduleMethod.methods[j].method_name)) {
                moduleMethod.methods.splice(j, 1);
              }
            }
            ////////////////////////////////////////////////////////////////////
            // 按照method_name升序排序
            ////////////////////////////////////////////////////////////////////
            moduleMethod.methods.sort(function(obj1, obj2) {
              if (obj1.method_name === obj2.method_name) {
                return 0;
              } else if (obj1.method_name > obj2.method_name) {
                return 1;
              }
              return -1;
            });
            for (let j = 0; j < moduleMethod.methods.length; j++) {
              //////////////////////////////////////////////////////////////////
              // td代码
              //////////////////////////////////////////////////////////////////
              let tdCode = "";
              //////////////////////////////////////////////////////////////////
              // 遍历权限中的接口
              //////////////////////////////////////////////////////////////////
              let n = 0;
              for (n = 0; n < 4; n++) {
                if ((j + n) < moduleMethod.methods.length) {
                  tdCode += `
                      <td class = "px-10 py-3">
                        <input class = "method w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded mr-1 focus:ring-blue-500 disabled:cursor-not-allowed" type = "checkbox"  data-parent-module = "${moduleMethod.module}" value = "${moduleMethod.methods[j + n].method_full_name}" />
                        <label class = "method cursor-pointer" data-parent-module = "${moduleMethod.module}">${moduleMethod.methods[j + n].method_name}</label>
                      </td>
                  `;
                } else {
                  tdCode += `<td></td>`;
                }
              }
              j += (n - 1);
              tbodyCode += `<tr class = "method_row">${tdCode}</tr>`;
            }
          }
          if (0 < tbodyCode.length) {
            $(`#${source.dataTable}`).find("tbody").html(tbodyCode);
            $(`#${source.dataTable}`).find("tbody").find("tr:first").find("td:first").addClass("rounded-tl-lg");
            $(`#${source.dataTable}`).find("tbody").find("tr:first").find("td:last").addClass("rounded-tr-lg");
            $(`#${source.dataTable}`).find("tbody").find("tr:last").find("td:first").addClass("rounded-bl-lg");
            $(`#${source.dataTable}`).find("tbody").find("tr:last").find("td:last").addClass("rounded-br-lg");
            ////////////////////////////////////////////////////////////////////
            // 注册多选框的click事件
            ////////////////////////////////////////////////////////////////////
            $(`#${source.dataTable}`).find("tbody").find("tr").find("td").off("click").on("click", null, source, function(event) {
              const source = event.data;
              $(this).find(`input[type = "checkbox"]`).trigger("click");
              event.stopPropagation();
            });
            $(`#${source.dataTable}`).find("tbody").find(".module_row").find("td").find(`input[type = "checkbox"]`).off("click").on("click", null, source, function(event) {
              const source = event.data;
              $(`#${source.dataTable}`).find("tbody").find("tr").find("td").find(`input[data-parent-module = "${$(this).attr("data-module")}"]`).prop("checked", $(this).prop("checked"));
              event.stopPropagation();
            });
            $(`#${source.dataTable}`).find("tbody").find(".method_row").find("td").find(`input[type = "checkbox"]`).off("click").on("click", null, source, function(event) {
              const source = event.data;
              const dataParentModule = $(this).attr("data-parent-module");
              const checkedCount = $(`#${source.dataTable}`).find("tbody").find("tr").find("td").find(`input[data-parent-module = "${dataParentModule}"]:checked`).length;
              const allCount = $(`#${source.dataTable}`).find("tbody").find("tr").find("td").find(`input[data-parent-module = "${dataParentModule}"]`).length;
              if (checkedCount === allCount) {
                $(`#${source.dataTable}`).find("tbody").find("tr").find("td").find(`input[data-module = "${dataParentModule}"]`).prop("checked", true);
              } else {
                $(`#${source.dataTable}`).find("tbody").find("tr").find("td").find(`input[data-module = "${dataParentModule}"]`).prop("checked", false);
              }
              event.stopPropagation();
            });
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
}
