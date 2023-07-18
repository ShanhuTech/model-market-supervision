"use strict";

class Login {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 初始化视图
    ////////////////////////////////////////////////////////////////////////////
    this.initView();
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块规则
    ////////////////////////////////////////////////////////////////////////////
    Module.getModuleRulePromise(this, "security.Admin").then(function(result) {
      //////////////////////////////////////////////////////////////////////////
      // 账户规则
      //////////////////////////////////////////////////////////////////////////
      result.source.adminRule = result.rule;
      //////////////////////////////////////////////////////////////////////////
      // 初始化事件
      //////////////////////////////////////////////////////////////////////////
      result.source.initEvent();
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
    $("body").css("background-image", `url(./img/bg.jpg)`);
    $("body").addClass("bg-cover bg-no-repeat flex flex-col justify-between");
    $("body").append(`
      <div>
        <form class = "w-96 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 p-10 rounded-lg shadow bg-slate-300 bg-opacity-40">
          <div class = "text-xl text-gray-900 text-center font-semibold select-none">安全验证</div>
          <div class = "mb-6">
            <label for = "name" class = "text-base text-gray-900 font-medium block mb-2 select-none">用户名</label>
            <input id = "name" class = "w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 block px-3 py-2 focus:border-indigo-500" type = "text" />
          </div>
          <div class = "mb-11">
            <label for = "password" class = "text-base text-gray-900 font-medium block mb-2 select-none">密码</label>
            <input id = "password" class = "w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 block px-3 py-2 focus:border-indigo-500" type = "password" autocomplete = "off" />
          </div>
          <button id = "login_button" class = "w-full text-base text-white text-center font-medium bg-indigo-500 rounded-lg py-2 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 disabled:bg-opacity-50 disabled:cursor-not-allowed" type = "button" disabled>确认</button>
        </form>
      </div>
    `);
    Copyright.build($("body")/* 目标对象 */, null/* 类 */, null/* 样式 */);
  }

  /**
   * 初始化事件
   */
  initEvent() {
    ////////////////////////////////////////////////////////////////////////////
    // 表单输入控件的键盘事件
    ////////////////////////////////////////////////////////////////////////////
    $("body").find("form").find("input").off("keyup").on("keyup", null, this, this.formInputKeyupEvent)
    ////////////////////////////////////////////////////////////////////////////
    // 注册登入按钮的click事件
    ////////////////////////////////////////////////////////////////////////////
    $("body").find("form").find("button").off("click").on("click", null, this, this.loginButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 设置页面初始化焦点
    ////////////////////////////////////////////////////////////////////////////
    $("#name").focus();
  }

  /**
   * 表单输入控件键盘keyup事件
   * @param {object} event 事件对象
   */
  formInputKeyupEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 根据用户名和密码内容长度设置按钮状态
    ////////////////////////////////////////////////////////////////////////////
    {
      const name = $("#name").val();
      const password = $("#password").val();
      if ((0 < name.length) && (0 < password.length)) {
        $("#login_button").prop("disabled", false);
      } else {
        $("#login_button").prop("disabled", true);
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 判断是否点击了Enter键
    ////////////////////////////////////////////////////////////////////////////
    if (13 === event.keyCode) {
      $("body").find("form").find("button").trigger("click");
    }
  }

  /**
   * 登入按钮的click事件
   * @param {object} event 事件对象
   */
  loginButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，删除所有验证提示
    ////////////////////////////////////////////////////////////////////////////
    $("body").find("form").find("." + Module.getValidatePromptClassName()).remove();
    ////////////////////////////////////////////////////////////////////////////
    // 获取数据
    ////////////////////////////////////////////////////////////////////////////
    const name = $("#name").val();
    const password = $("#password").val();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "name", "value": name, "obj": $("#name"), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "password", "value": password, "obj": $("#password"), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.adminRule, "addAdmin", parameterObj, source, function error(source, errorMessage) {
        parameterObj.obj.after(`<div class = "${Module.getValidatePromptClassName()} text-sm text-red-600 mt-1 select-none">${errorMessage}</div>`);
      })) return;
    }
    ////////////////////////////////////////////////////////////////////////////
    // 参数对象
    ////////////////////////////////////////////////////////////////////////////
    const parameter = new FormData();
    for (const obj of parameterCheckArray) {
      parameter.append(obj.name, obj.value);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 管理员登入
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.GET, `${Configure.getServerUrl()}/module/security.Admin/adminLogin`, parameter, source,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          //////////////////////////////////////////////////////////////////////
          // 存储用户信息
          //////////////////////////////////////////////////////////////////////
          const account = responseResult.content;
          LocalStorage.setItem("account_name", account.name);
          LocalStorage.setItem("account_token", account.token);
          LocalStorage.setItem("token_expires_timestamp", account.token_expires_timestamp);
          //////////////////////////////////////////////////////////////////////
          // 刷新管理员Token
          //////////////////////////////////////////////////////////////////////
          AccountSecurity.refreshAdminToken(function() {
            ////////////////////////////////////////////////////////////////////
            // 刷新成功后跳转首页
            ////////////////////////////////////////////////////////////////////
            window.location.href = "../home/home.html";
          });
        } else {
          //////////////////////////////////////////////////////////////////////
          // 隐藏等待遮盖
          //////////////////////////////////////////////////////////////////////
          WaitMask.hide();
          Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.TOP_CENTER/* 位置 */, "错误"/* 标题 */, responseResult.attach/* 内容 */);
        }
      },
      function error(error, source) {
        ////////////////////////////////////////////////////////////////////////
        // 隐藏等待遮盖
        ////////////////////////////////////////////////////////////////////////
        WaitMask.hide();
        console.error(error);
        Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.TOP_CENTER/* 位置 */, "错误"/* 标题 */, error.toString()/* 内容 */);
      }
    );
  }
}
