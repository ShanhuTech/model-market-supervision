"use strict";

class RoleMenu {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 角色数据数组
    ////////////////////////////////////////////////////////////////////////////
    this.roleArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 菜单数据数组
    ////////////////////////////////////////////////////////////////////////////
    this.menuArray = new Array();
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
              <thead class = "font-semibold select-none">
                <tr class = "bg-violet-200"><th class = "text-center px-2 py-3 rounded-tl-lg"><input id = "select_all_menu" class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed" type = "checkbox" /></th><th class = "px-4 py-3">名称</th><th class = "px-4 py-3">文本</th><th class = "px-4 py-3 rounded-tr-lg">描述</th></tr>
              </thead>
              <tbody class = "select-none">
                <tr class = "bg-white hover:bg-orange-50"><td class = "text-center px-4 py-3 rounded-b-lg select-none" colspan = "4">无</td></tr>
              </tbody>
            </table>
          `;
          Template.build($("body")/* 目标对象 */, [
            new TemplateSelect("role_select"/* id */, 200/* 宽度 */, templateSelectOptionArray/* 模板下拉框数组 */, false/* 是否禁用 */, function() {
              const selectRoleUuid = $("#role_select").attr("data-popup-value");
              $(`#${source.dataTable}`).find("tr").find(`input[type = "checkbox"]`).prop("checked", false);
              for (let i = 0; i < source.roleArray.length; i++) {
                const role = source.roleArray[i];
                if (selectRoleUuid === role.uuid) {
                  if (role.hasOwnProperty("menus")) {
                    for (let j = 0; j < role.menus.length; j++) {
                      const menu = role.menus[j];
                      $(`#${menu.uuid}`).trigger("click");
                    }
                    $(".toolbar").find("button").prop("disabled", false);
                  } else {
                    $(`#${source.dataTable}`).find("tr").find(`input[type = "checkbox"]`).prop("checked", false);
                  }
                  break;
                }
              }
            }/* 改变回调方法 */),
            new TemplateButton("保存"/* 文本 */, null/* 类 */, false/* 是否禁用 */, function() {
              //////////////////////////////////////////////////////////////////
              // 获取数据
              //////////////////////////////////////////////////////////////////
              const uuid = $("#role_select").attr("data-popup-value");
              let menuArray = "";
              $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]:checked`).each(function() {
                menuArray += $(this).attr("id") + ";";
              });
              if (0 < menuArray.length) {
                menuArray = menuArray.substring(0, menuArray.length - 1);
              }
              //////////////////////////////////////////////////////////////////
              // 参数检查数组
              //////////////////////////////////////////////////////////////////
              const parameterCheckArray = new Array();
              parameterCheckArray.push({"name": "uuid", "value": uuid, "obj": null, "allow_null": false, "custom_error_message": "必须选择一个角色"});
              parameterCheckArray.push({"name": "menu_array", "value": menuArray, "obj": null, "allow_null": true, "custom_error_message": null});
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
          // 获取菜单
          //////////////////////////////////////////////////////////////////////
          source.getMenu();
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
   * 获取菜单
   */
  getMenu() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取菜单
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Menu/getMenu`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const menuCount = responseResult.content.count;
          source.menuArray = responseResult.content.array; 
          //////////////////////////////////////////////////////////////////////
          // 添加显示数据
          //////////////////////////////////////////////////////////////////////
          let tbodyCode = "";
          for (let i = 0; i < source.menuArray.length; i++) {
            const leftRoundedCode = ((i + 1) === source.menuArray.length) ? "rounded-bl-lg" : "";
            const rightRoundedCode = ((i + 1) === source.menuArray.length) ? "rounded-br-lg" : "";
            const menu = source.menuArray[i];
            ////////////////////////////////////////////////////////////////////
            // 理论上，左右间距数值应为(menu.level - 1) * 16，但这里的样式会覆盖
            // td的px-4，所以需要把px-4的距离加上
            ////////////////////////////////////////////////////////////////////
            const styleCode = `style = "padding-left: ${menu.level * 16}px; padding-right: ${menu.level * 16}px"`;
            let svgCode = "";
            if (1 < menu.level) {
              svgCode = `<svg class = "w-3 mr-2" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M19.5 12h-15"></path></svg>`;
            }
            tbodyCode += `
              <tr class = "bg-white hover:bg-orange-50">
                <td class = "text-center px-2 py-3 ${leftRoundedCode}"><input id = "${menu.uuid}" class = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed" type = "checkbox" /></td><td class = "px-4 py-3 flex flex-row justify-start items-center" ${styleCode}>${svgCode}<span>${menu.name}</span></td><td class = "px-4 py-3">${menu.text}</td><td class = "px-4 py-3 ${rightRoundedCode}">${menu.hasOwnProperty("description") ? menu.description : ""}</td>
              </tr>
            `;
          }
          if (0 < tbodyCode.length) {
            $(`#${source.dataTable}`).find("tbody").html(tbodyCode);
            ////////////////////////////////////////////////////////////////////
            // 注册多选框的click事件
            ////////////////////////////////////////////////////////////////////
            $("#select_all_menu").off("click").on("click", null, source, function(event) {
              const source = event.data;
              $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]`).prop("checked", $("#select_all_menu").prop("checked"));
              event.stopPropagation();
            });
            $(`#${source.dataTable}`).find("thead").find("tr").off("click").on("click", null, source, function(event) {
              const source = event.data;
              $("#select_all_menu").trigger("click");
            });
            $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]`).off("click").on("click", null, source, function(event) {
              const source = event.data;
              const checkedCount = $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]:checked`).length;
              const allCount = $(`#${source.dataTable}`).find("tbody").find("tr").find(`input[type = "checkbox"]`).length;
              if (checkedCount === allCount) {
                $("#select_all_menu").prop("checked", true);
              } else {
                $("#select_all_menu").prop("checked", false);
              }
              event.stopPropagation();
            });
            $(`#${source.dataTable}`).find("tbody").find("tr").off("click").on("click", null, source, function(event) {
              const source = event.data;
              $(this).find(`input[type = "checkbox"]`).trigger("click");
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
