"use strict";

class Home {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取自身角色
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.Role/getRoleBySelf`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const roleArray = responseResult.content.array;
          if (0 < roleArray.length) {
            const role = roleArray[0];
            if (role.hasOwnProperty("menus")) {
              source.roleMenuArray = role.menus;
              //////////////////////////////////////////////////////////////////
              // 检查登录状态。
              //////////////////////////////////////////////////////////////////
              AccountSecurity.checkLoginStatus();
              //////////////////////////////////////////////////////////////////
              // 刷新Token。
              //////////////////////////////////////////////////////////////////
              AccountSecurity.refreshToken();
              //////////////////////////////////////////////////////////////////
              // 初始化视图
              //////////////////////////////////////////////////////////////////
              source.initView();
              //////////////////////////////////////////////////////////////////
              // 初始化事件
              //////////////////////////////////////////////////////////////////
              source.initEvent();
              //////////////////////////////////////////////////////////////////
              // 隐藏等待遮盖
              //////////////////////////////////////////////////////////////////
              WaitMask.hide();
            } else {
              Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, "当前用户尚未配置菜单"/* 内容 */);
            }
          } else {
            Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, "当前用户尚未配置角色"/* 内容 */);
          }
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
   * 初始化视图
   */
  initView() {
    $("title").html(Configure.getTitle());
    $("body").addClass("flex flex-row justify-between");
    ////////////////////////////////////////////////////////////////////////////
    // 按照order_group升序排序
    ////////////////////////////////////////////////////////////////////////////
    this.roleMenuArray.sort(function(obj1, obj2) {
      if (obj1.order_group === obj2.order_group) {
        return 0;
      } else if (obj1.order_group > obj2.order_group) {
        return 1;
      }
      return -1;
    });
    ////////////////////////////////////////////////////////////////////////////
    // 生成一级菜单代码
    ////////////////////////////////////////////////////////////////////////////
    let menuLv1Code = "";
    for (let i = 0; i < this.roleMenuArray.length; i++) {
      const menu = this.roleMenuArray[i];
      if (1 === menu.level) {
        menuLv1Code += `<li class = "menu_lv1 h-full px-4 list-none flex justify-center items-center cursor-pointer hover:bg-indigo-100" data-uuid = "${menu.uuid}" data-parent-uuid = "${menu.parent_uuid}">${menu.text}</li>`;
      }
    }
    $("body").append(`
      <div class = "side_bar w-60 h-full text-slate-600 select-none flex flex-col justify-between overflow-x-hidden overflow-y-hidden hover:overflow-y-auto">
        <div style = "width: inherit;">
          <div class = "h-14 flex flex-row justify-start items-center px-6 truncate">
            <svg class = "w-8 h-auto text-indigo-500 mr-3" xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 118 94" role = "img">
              <path fill-rule = "evenodd" clip-rule = "evenodd" d = "M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z" fill = "currentColor"></path>
            </svg>
            <span class = "font-semibold">${Configure.getTitle()}</span>
          </div>
          <ul class = "h-auto text-base"></ul>
        </div>
      </div>
      <div class = "w-full h-full content select-none text-slate-600 flex flex-col justify-start items-center">
        <div class = "w-full h-14 flex flex-row justify-between items-center">
          <ul class = "w-auto h-full flex flex-row justify-start items-center overflow-hidden">${menuLv1Code}</ul>
          <div class = "h-full flex flex-row justify-end items-center">
            <div class = "message h-full px-4 flex justify-center items-center cursor-pointer relative hover:text-indigo-500">
              <svg class = "w-6" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
                <path stroke-linecap = "round" stroke-linejoin = "round" d = "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
              </svg>
              <div class = "w-3 h-3 rounded-full absolute top-3.5 right-3 bg-red-400 z-10"></div>
              <div class = "w-3 h-3 rounded-full absolute top-3.5 right-3 bg-red-400 animate-ping opacity-75"></div>
            </div>
            <div class = "account h-full px-4 flex justify-center items-center cursor-pointer hover:bg-indigo-100">
              <span class = "mr-2">${LocalStorage.getItem("account_name")}</span>
              <svg class = "w-4" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
                <path stroke-linecap = "round" stroke-linejoin = "round" d = "M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            </div>
          </div>
        </div>
        <iframe class = "w-full grow"></iframe>
      </div>
    `);
    Copyright.build($("body").find(".side_bar")/* 目标对象 */, "w-full text-xs text-start text-gray-400 pl-14"/* 类 */, null/* 样式 */);
  }

  /**
   * 初始化事件
   */
  initEvent() {
    ////////////////////////////////////////////////////////////////////////////
    // 注册一级菜单的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv1").off("click").on("click", null, this, this.menuLv1ClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册消息图标的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(".message").off("click").on("click", null, this, function(event) {
      //////////////////////////////////////////////////////////////////////////
      // 获取调用源
      //////////////////////////////////////////////////////////////////////////
      const source = event.data;
        // 这里还需要将lv1和lv3的选中去掉。
      alert("消息。。。");
    });
    ////////////////////////////////////////////////////////////////////////////
    // 注册账户弹出菜单的click事件
    ////////////////////////////////////////////////////////////////////////////
    PopupMenu.bind($(".account")/* 目标对象 */, PopupMenu.Position.BOTTOM_RIGHT/* 位置 */, "w-36 text-slate-600"/* ul类 */, null/* ul样式 */, [
      new PopupMenuItem(`
        <svg class = "w-5 mr-3" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
          <path stroke-linecap = "round" stroke-linejoin = "round" d = "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
        </svg>
        <span>账户中心</span>
      `/* 文本 */, `modify_password`/* 值 */, true/* 是否有分割线 */, "flex flex-row justify-start items-center hover:bg-indigo-100"/* li类 */, null/* li样式 */),
      new PopupMenuItem(`
        <svg class = "w-5 h-5 mr-3" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
          <path stroke-linecap = "round" stroke-linejoin = "round" d = "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"></path>
        </svg>
        <span>退出</span>
      `/* 文本 */, `logoff`/* 值 */, false/* 是否有分割线 */, "flex flex-row justify-start items-center hover:bg-indigo-100"/* li类 */, null/* li样式 */)
    ]/* 项数组 */, null/* 距离 */, function(item) {
      if (Toolkit.equalsIgnoreCase("modify_password", item.attr("data-value"))) {
        ////////////////////////////////////////////////////////////////////////
        // 修改字体和背景色样式
        ////////////////////////////////////////////////////////////////////////
        $(".menu_lv1").removeClass("font-semibold bg-indigo-200");
        $(".menu_lv3").removeClass("bg-indigo-200");
        ////////////////////////////////////////////////////////////////////////
        // 打开账户中心
        ////////////////////////////////////////////////////////////////////////
        $("iframe").attr("src", "./account.html" + "?" + Toolkit.generateUuid());
      } else if (Toolkit.equalsIgnoreCase("logoff", item.attr("data-value"))) {
        ////////////////////////////////////////////////////////////////////////
        // 登出
        ////////////////////////////////////////////////////////////////////////
        AccountSecurity.logoff();
        ////////////////////////////////////////////////////////////////////////
        // 返回登录页
        ////////////////////////////////////////////////////////////////////////
        window.location.href = "../login/login.html";
      }
    }/* li点击方法 */);
    ////////////////////////////////////////////////////////////////////////////
    // 设置默认显示菜单
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv1:eq(0)").trigger("click");
  }

  /**
   * 一级菜单的click事件
   * @param {object} event 事件对象
   */
  menuLv1ClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 修改字体和背景色样式
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv1").removeClass("font-semibold bg-indigo-200");
    $(this).addClass("font-semibold bg-indigo-200");
    //////////////////////////////////////////////////////////////////////////
    // 加载一级菜单下的所有二级菜单和三级菜单
    //////////////////////////////////////////////////////////////////////////
    $(".side_bar").find("ul").html("");
    let firstMenuLv2 = null;
    for (let i = 0; i < source.roleMenuArray.length; i++) {
      const menu = source.roleMenuArray[i];
      if ($(this).attr("data-uuid") === menu.parent_uuid) {
        if (null === firstMenuLv2) {
          firstMenuLv2 = menu;
        }
        $(".side_bar").find("ul").append(`
          <li class = "menu_lv2 list-none px-14 pl-6 py-2 flex justify-start items-center cursor-pointer hover:bg-indigo-100" data-uuid = "${menu.uuid}" data-parent-uuid = "${menu.parent_uuid}" data-menu-open = "true">
            <svg class = "w-4 mr-3 duration-500" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
              <path stroke-linecap = "round" stroke-linejoin = "round" d = "M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
            </svg>
            <span>${menu.text}</span>
          </li>
        `);
        for (let j = 0; j < source.roleMenuArray.length; j++) {
          const m = source.roleMenuArray[j];
          if (menu.uuid === m.parent_uuid) {
            $(".side_bar").find("ul").append(`
              <li class = "menu_lv3 list-none px-14 py-2 cursor-pointer duration-500 hover:bg-indigo-100" data-uuid = "${m.uuid}" data-parent-uuid = "${m.parent_uuid}" data-link = "${m.link}"><span>${m.text}</span></li>
            `);
          }
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 注册二级和三级菜单的click事件
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv2").off("click").on("click", null, source, source.menuLv2ClickEvent);
    $(".menu_lv3").off("click").on("click", null, source, source.menuLv3ClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册二级菜单转换事件
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv2").off("transitionend").on("transitionend", null, null, function() {
      if (!Toolkit.equalsIgnoreCase("true", $(this).attr("data-menu-open"))) {
        $(`.menu_lv3[data-parent-uuid="${$(this).attr("data-uuid")}"]`).addClass("hidden");
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 默认选中第一个二级菜单下的第一个三级菜单
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv3").each(function() {
      if ($(this).attr("data-parent-uuid") === firstMenuLv2.uuid) {
        $(this).trigger("click");
        return false;
      }
    });
  }

  /**
   * 二级菜单的click事件
   * @param {object} event 事件对象
   */
  menuLv2ClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    if (Toolkit.equalsIgnoreCase("true", $(this).attr("data-menu-open"))) {
      $(this).attr("data-menu-open", false);
      $(this).children("svg").addClass("transform -rotate-90");
      $(`.menu_lv3[data-parent-uuid="${$(this).attr("data-uuid")}"]`).addClass("opacity-0");
    } else {
      $(this).attr("data-menu-open", true);
      $(this).children("svg").removeClass("transform -rotate-90");
      $(`.menu_lv3[data-parent-uuid="${$(this).attr("data-uuid")}"]`).removeClass("hidden");
      const dataUuid = $(this).attr("data-uuid");
      setTimeout(function() {
        $(`.menu_lv3[data-parent-uuid="${dataUuid}"]`).removeClass("opacity-0");
      }, 1);
    }
  }

  /**
   * 三级菜单的click事件
   * @param {object} event 事件对象
   */
  menuLv3ClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 修改字体和背景色样式
    ////////////////////////////////////////////////////////////////////////////
    $(".menu_lv3").removeClass("bg-indigo-200");
    $(this).addClass("bg-indigo-200");
    ////////////////////////////////////////////////////////////////////////////
    // 打开菜单链接
    ////////////////////////////////////////////////////////////////////////////
    $("iframe").attr("src", $(this).attr("data-link") + "?" + Toolkit.generateUuid());
  }
}
