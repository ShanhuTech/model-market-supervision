"use strict";

class AdminManagement {
  /*
   * 窗体类型枚举
   */
  static WindowType = {
    "ADD_ADMIN_AM": "ADD_ADMIN_AM",
    "MODIFY_ADMIN_AM": "MODIFY_ADMIN_AM"
  };

  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 角色规则。
    ////////////////////////////////////////////////////////////////////////////
    this.roleRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 管理员规则。
    ////////////////////////////////////////////////////////////////////////////
    this.adminRule = ruleArray[1];
    ////////////////////////////////////////////////////////////////////////////
    // 单位规则。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentRule = ruleArray[2];
    ////////////////////////////////////////////////////////////////////////////
    // 管理员对象。
    ////////////////////////////////////////////////////////////////////////////
    this.adminObj = {};
    ////////////////////////////////////////////////////////////////////////////
    // 角色数组。
    ////////////////////////////////////////////////////////////////////////////
    this.roleArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 待删除数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    this.removeDataUuid = null;
    ////////////////////////////////////////////////////////////////////////////
    // 队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue = new Queue();
    ////////////////////////////////////////////////////////////////////////////
    // 传递参数。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentUuid = Toolkit.getUrlParameter("department_uuid");
    this.departmentFullName = Toolkit.urlParameterDecode(Toolkit.getUrlParameter("department_full_name"));
    this.returnDepartmentListParameter = Toolkit.getUrlParameter("return_department_list_parameter"); // 不解码直接返回编码格式
    ////////////////////////////////////////////////////////////////////////////
    // 获取管理员的参数。
    ////////////////////////////////////////////////////////////////////////////
    this.getAdminParameter = {
      "department_uuid": this.departmentUuid,
      "name": null,
      "role_uuid": null,
      "status": null,
      "offset": 0,
      "rows": 20
    };
    ////////////////////////////////////////////////////////////////////////////
    // 默认无修改密码值。
    ////////////////////////////////////////////////////////////////////////////
    this.defaultPasswordNotChangeValue = "defaultPwd";
  }

  /**
   * 生成代码
   */
  generateCode() {
    ////////////////////////////////////////////////////////////////////////////
    // 容器。
    ////////////////////////////////////////////////////////////////////////////
    this.container = new JSControl("div");
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar = new JSControl("div");
    ////////////////////////////////////////////////////////////////////////////
    // 返回列表按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.returnListButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 管理员表格。
    ////////////////////////////////////////////////////////////////////////////
    this.adminTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination = new Pagination(this);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminAM = new AdminAM(this, "添加管理员", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyAdminAM = new AdminAM(this, "修改管理员", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 管理员筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.adminFilter = new AdminFilter(this, "筛选", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 删除确认窗。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow = new ConfirmWindow("删除确认", 30);
    ////////////////////////////////////////////////////////////////////////////
    // 容器。
    ////////////////////////////////////////////////////////////////////////////
    this.container.setAttribute(
      {
        "class": "global_scroll global_scroll_dark container"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.setAttribute(
      {
        "class": "tool_bar"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 返回列表按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.returnListButton.setAttribute(
      {
        "class": "global_button_primary return_list_button"
      }
    );
    this.returnListButton.setContent("返回单位列表");
    ////////////////////////////////////////////////////////////////////////////
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton.setAttribute(
      {
        "class": "global_button_primary filter_button"
      }
    );
    this.filterButton.setContent("筛选");
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminButton.setAttribute(
      {
        "class": "global_button_primary add_admin_button"
      }
    );
    this.addAdminButton.setContent("添加管理员");
    ////////////////////////////////////////////////////////////////////////////
    // 管理员表格。
    ////////////////////////////////////////////////////////////////////////////
    this.adminTable.setAttribute(
      {
        "class": "global_table admin_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "department">单位</td>
        <td class = "name">用户名</td>
        <td class = "role_name">角色</td>
        <td class = "frozen_datetime">冻结时间</td>
        <td class = "status">状态</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.adminTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "6">尚无数据</td>
        </tr>
      </tbody>
    `);
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination.setAttribute(
      {
        "class": "global_pagination pagination"
      }
    );
    this.pagination.setPageCount(3);
    this.pagination.setLimit(this.getAdminParameter.rows);
    this.pagination.setButtonClickCallbackFunc(this.paginationButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.setAttribute(
      {
        "class": "global_wait_mask"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminAM.setClassSign("add_admin_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyAdminAM.setClassSign("modify_admin_am");
    ////////////////////////////////////////////////////////////////////////////
    // 管理员筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.adminFilter.setClassSign("admin_filter");
    ////////////////////////////////////////////////////////////////////////////
    // 删除确认窗。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.setAttribute(
      {
        "class": "confirm_window"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 容器。
    ////////////////////////////////////////////////////////////////////////////
    this.container.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 返回列表按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.returnListButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 管理员表格。
    ////////////////////////////////////////////////////////////////////////////
    this.adminTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyAdminAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 管理员筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.adminFilter.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 删除确认窗。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.generateCode();
  }

  /**
   * 初始化视图
   */
  initView() {
    ////////////////////////////////////////////////////////////////////////////
    // 页面添加容器。
    ////////////////////////////////////////////////////////////////////////////
    $("body").html(this.container.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加工具栏。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.toolbar.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏添加返回列表按钮。
    ////////////////////////////////////////////////////////////////////////////
    if (null != this.returnDepartmentListParameter) {
      this.toolbar.getObject().append(this.returnListButton.getCode());
    }
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏添加筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.filterButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏添加添加管理员按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addAdminButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加管理员表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.adminTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加分页。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.pagination.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addAdminAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改管理员AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyAdminAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加管理员筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.adminFilter.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加删除确认窗。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.removeConfirmWindow.getCode());
  }

  /**
   * 初始化事件
   */
  initEvent() {
    ////////////////////////////////////////////////////////////////////////////
    // 注册返回列表按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.returnListButton.getObject().off("click").on("click", null, this, this.returnListButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册筛选按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton.getObject().off("click").on("click", null, this, this.filterButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加管理员按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminButton.getObject().off("click").on("click", null, this, this.addAdminButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加管理员AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改管理员AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyAdminAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化管理员筛选事件。
    ////////////////////////////////////////////////////////////////////////////
    this.adminFilter.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取管理员的LoadStartEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getAdminLoadStartEvent").on("getAdminLoadStartEvent", this.getAdminLoadStartEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取管理员的ErrorEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getAdminErrorEvent").on("getAdminErrorEvent", this.getAdminErrorEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取管理员的TimeoutEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getAdminTimeoutEvent").on("getAdminTimeoutEvent", this.getAdminTimeoutEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取管理员的ReadyStateChangeEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getAdminReadyStateChangeEvent").on("getAdminReadyStateChangeEvent", this.getAdminReadyStateChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加管理员AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addAdminAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加管理员AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addAdminAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addAdminAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改管理员AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyAdminAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyAdminAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改管理员AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyAdminAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyAdminAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册管理员筛选确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.adminFilter.formList.confirmButton.getObject().off("click").on("click", null, this, this.adminFilterConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册管理员筛选取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.adminFilter.formList.cancelButton.getObject().off("click").on("click", null, this, this.adminFilterCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 返回列表按钮click事件
   * @param event 事件对象
   */
  returnListButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    window.location.href = `./department_management.html?return_department_list_parameter=${source.returnDepartmentListParameter}`;
  }

  /**
   * 获取管理员LoadStartEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getAdminLoadStartEvent(event, xhr, xhrEvent, source) {
    source.frozenControl("getAdmin"); // 冻结控件。
    source.waitMask.show(); // 显示等待遮蔽。
  }

  /**
   * 获取管理员ErrorEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getAdminErrorEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取管理员", "网络请求失败", window.location.href);
  }

  /**
   * 获取管理员TimeoutEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getAdminTimeoutEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取管理员", "网络请求超时", window.location.href);
  }

  /**
   * 获取管理员ReadyStateChangeEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getAdminReadyStateChangeEvent(event, xhr, xhrEvent, source) {
    if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
      source.recoverControl("getAdmin"); // 恢复控件。
      source.waitMask.hide(); // 隐藏等待遮蔽。
      //////////////////////////////////////////////////////////////////////////
      // 响应结果。
      //////////////////////////////////////////////////////////////////////////
      const responseResult = xhr.response;
      if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
        ////////////////////////////////////////////////////////////////////////
        // 清空对象。
        ////////////////////////////////////////////////////////////////////////
        delete source.adminObj;
        source.adminObj = {};
        ////////////////////////////////////////////////////////////////////////
        // 更新对象。
        ////////////////////////////////////////////////////////////////////////
        source.adminObj["count"] = responseResult.content.count;
        source.adminObj["array"] = new Array();
        for (let i = 0; i < responseResult.content.array.length; i++) {
          source.adminObj.array.push(responseResult.content.array[i]);
        }
        ////////////////////////////////////////////////////////////////////////
        // 如果管理员对象不为空，则添加表格数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.adminObj.array.length) {
          let code = "";
          for (let i = 0; i < source.adminObj.array.length; i++) {
            const admin = source.adminObj.array[i];
            let frozenDatetime = "";
            let status = "";
            let manageDepartments = "";
            ////////////////////////////////////////////////////////////////////
            // 根据显示要求优化数据。
            ////////////////////////////////////////////////////////////////////
            if (null == admin.frozen_datetime) {
              frozenDatetime = "无";
            } else {
              frozenDatetime = admin.frozen_datetime;
            }
            if (Toolkit.stringEqualsIgnoreCase("NORMAL", admin.status)) {
              status = "正常";
            } else if (Toolkit.stringEqualsIgnoreCase("FROZEN", admin.status)) {
              status = "冻结";
            } else if (Toolkit.stringEqualsIgnoreCase("LOCK", admin.status)) {
              status = "锁定";
            } else if (Toolkit.stringEqualsIgnoreCase("DELETE", admin.status)) {
              status = "删除";
            }
            if (Toolkit.isJSONObjectExistKey(admin, "manage_departments")) {
              manageDepartments = admin.manage_departments;
            }
            code += `
              <tr>
                <td class = "department">${admin.full_name}</td>
                <td class = "name">${admin.name}</td>
                <td class = "role_name">${admin.role_name}</td>
                <td class = "frozen_datetime">${frozenDatetime}</td>
                <td class = "status">${status}</td>
                <td class = "operation" data-uuid = "${admin.uuid}" data-manage-departments = "${manageDepartments}"><span class = "set_department">设置监督单位</span><span class = "modify">修改</span><span class = "remove">删除</span></td>
              </tr>
            `;
          }
          source.adminTable.getObject().find("tbody").html(code);
        } else {
          source.adminTable.getObject().find("tbody").html(`
            <tr>
              <td class = "rowspan" colspan = "6">尚无数据</td>
            </tr>
          `);
        }
        ////////////////////////////////////////////////////////////////////////
        // 更新分页数据。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.setOffset(source.getAdminParameter.offset);
        source.pagination.setTotalCount(source.adminObj.count);
        source.pagination.generateCode();
        source.pagination.getObject().replaceWith(source.pagination.getCode());
        ////////////////////////////////////////////////////////////////////////
        // 初始化分页事件。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.initEvent();
        ////////////////////////////////////////////////////////////////////////
        // 加载完成后注册事件。
        ////////////////////////////////////////////////////////////////////////
        source.adminTable.getObject().find("tbody").find("tr").find(".operation").find(".set_department").off("click").on("click", null, source, source.adminTableSetDepartmentClickEvent);
        source.adminTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.adminTableModifyButtonClickEvent);
        source.adminTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.adminTableRemoveButtonClickEvent);
      } else {
        Error.redirect("../home/error.html", "获取管理员", responseResult.attach, window.location.href);
      }
    }
  }

  /**
   * 筛选按钮click事件
   * @param event 事件对象
   */
  filterButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.adminFilter.show();
  }

  /**
   * 添加管理员按钮click事件
   * @param event 事件对象
   */
  addAdminButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addAdminAM.show();
  }

  /**
   * 添加管理员AM确认按钮click事件
   * @param event 事件对象
   */
  addAdminAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addAdminAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "department_uuid", "value": source.departmentUuid, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "role_uuid", "value": source.addAdminAM.roleNameSelect.getObject().val(), "id": source.addAdminAM.roleNameSelect.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.addAdminAM.nameTextField.getObject().val(), "id": source.addAdminAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "real_name", "value": source.addAdminAM.realNameTextField.getObject().val(), "id": source.addAdminAM.realNameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "password", "value": source.addAdminAM.passwordTextField.getObject().val(), "id": source.addAdminAM.passwordTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.adminRule, "addAdmin", parameterObj, source, function error(source, errorMessage) {
        source.addAdminAM.formList.showPrompt(parameterObj.id, errorMessage);
      })) {
        return;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 参数数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterArray = new Array();
    parameterArray.push({"Account-Token": AccountSecurity.getItem("account_token")});
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameter = parameterCheckArray[i];
      const param = {};
      param[parameter.name] = parameter.value;
      parameterArray.push(param);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 添加管理员。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.AdminInfo/addAdmin", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addAdminAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addAdminAM.frozenControl("addAdmin"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addAdminAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addAdminAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addAdminAM.recoverControl("addAdmin"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addAdminAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addAdminAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取管理员。
            ////////////////////////////////////////////////////////////////////
            source.getAdmin();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addAdminAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addAdminAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加管理员AM取消按钮click事件
   * @param event 事件对象
   */
  addAdminAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addAdminAM.hide();
  }

  /**
   * 修改管理员AM确认按钮click事件
   * @param event 事件对象
   */
  modifyAdminAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyAdminAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "uuid", "value": source.modifyAdminAM.uuidTextField.getObject().val(), "id": source.modifyAdminAM.uuidTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "role_uuid", "value": source.modifyAdminAM.roleNameSelect.getObject().val(), "id": source.modifyAdminAM.roleNameSelect.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.modifyAdminAM.nameTextField.getObject().val(), "id": source.modifyAdminAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "real_name", "value": source.modifyAdminAM.realNameTextField.getObject().val(), "id": source.modifyAdminAM.realNameTextField.getId(), "allow_null": false, "custom_error_message": null});
    if (source.modifyAdminAM.passwordTextField.getObject().val() != source.defaultPasswordNotChangeValue) {
      parameterCheckArray.push({"name": "password", "value": source.modifyAdminAM.passwordTextField.getObject().val(), "id": source.modifyAdminAM.passwordTextField.getId(), "allow_null": false, "custom_error_message": null});
    }
    parameterCheckArray.push({"name": "status", "value": source.modifyAdminAM.statusSelect.getObject().val(), "id": source.modifyAdminAM.statusSelect.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.adminRule, "modifyAdmin", parameterObj, source, function error(source, errorMessage) {
        source.modifyAdminAM.formList.showPrompt(parameterObj.id, errorMessage);
      })) {
        return;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 参数数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterArray = new Array();
    parameterArray.push({"Account-Token": AccountSecurity.getItem("account_token")});
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameter = parameterCheckArray[i];
      const param = {};
      param[parameter.name] = parameter.value;
      parameterArray.push(param);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 修改管理员。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.AdminInfo/modifyAdmin", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyAdminAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyAdminAM.frozenControl("modifyAdmin"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyAdminAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyAdminAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyAdminAM.recoverControl("modifyAdmin"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyAdminAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyAdminAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取管理员。
            ////////////////////////////////////////////////////////////////////
            source.getAdmin();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyAdminAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyAdminAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改管理员AM取消按钮click事件
   * @param event 事件对象
   */
  modifyAdminAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyAdminAM.hide();
  }

  /**
   * 管理员筛选确认按钮click事件
   * @param event 事件对象
   */
  adminFilterConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.adminFilter.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "department_uuid", "value": source.departmentUuid, "id": "0", "allow_null": true, "custom_error_message": null});
    if (0 < source.adminFilter.nameTextField.getObject().val().length) {
      parameterCheckArray.push({"name": "name", "value": source.adminFilter.nameTextField.getObject().val(), "id": source.adminFilter.nameTextField.getId(), "allow_null": true, "custom_error_message": null});
      source.getAdminParameter.name = source.adminFilter.nameTextField.getObject().val();
    } else {
      source.getAdminParameter.name = null;
    }
    if (0 < source.adminFilter.roleNameSelect.getObject().val().length) {
      parameterCheckArray.push({"name": "role_uuid", "value": source.adminFilter.roleNameSelect.getObject().val(), "id": source.adminFilter.roleNameSelect.getId(), "allow_null": true, "custom_error_message": null});
      source.getAdminParameter.role_uuid = source.adminFilter.roleNameSelect.getObject().val();
    } else {
      source.getAdminParameter.role_uuid = null;
    }
    if (0 < source.adminFilter.statusSelect.getObject().val().length) {
      parameterCheckArray.push({"name": "status", "value": source.adminFilter.statusSelect.getObject().val(), "id": source.adminFilter.statusSelect.getId(), "allow_null": true, "custom_error_message": null});
      source.getAdminParameter.status = source.adminFilter.statusSelect.getObject().val();
    } else {
      source.getAdminParameter.status = null;
    }
    source.getAdminParameter.offset = 0;
    parameterCheckArray.push({"name": "offset", "value": source.getAdminParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": source.getAdminParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.adminRule, "getAdmin", parameterObj, source, function error(source, errorMessage) {
        source.adminFilter.formList.showPrompt(parameterObj.id, errorMessage);
      })) {
        return;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 参数数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterArray = new Array();
    parameterArray.push({"Account-Token": AccountSecurity.getItem("account_token")});
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameter = parameterCheckArray[i];
      const param = {};
      param[parameter.name] = parameter.value;
      parameterArray.push(param);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 获取管理员。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.AdminInfo/getAdmin", parameterArray, source, "getAdmin"); 
  }

  /**
   * 管理员筛选取消按钮click事件
   * @param event 事件对象
   */
  adminFilterCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.adminFilter.hide();
  }

  /**
   * 分页按钮点击事件
   * @param source 源对象
   */
  paginationButtonClickEvent(source) {
    source.getAdminParameter.offset = this.dataOffset;
    source.getAdmin();
  }

  /**
   * 管理员表格设置单位按钮click事件
   * @param event 事件对象
   */
  adminTableSetDepartmentClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    const manageDepartments = $(this).parent().attr("data-manage-departments");
    AccountSecurity.setItem("manage_departments", manageDepartments);
    // window.location.href = `./set_department_management.html?admin_uuid=${uuid}&manage_departments=${manageDepartments}`;
    window.location.href = `./set_department_management.html?admin_uuid=${uuid}`;
  }

  /**
   * 管理员表格修改按钮click事件
   * @param event 事件对象
   */
  adminTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从管理员对象中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.adminObj.array.length; i++) {
      if (uuid == source.adminObj.array[i].uuid) {
        obj = source.adminObj.array[i];
        break;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 设置当前数据至修改界面。
    ////////////////////////////////////////////////////////////////////////////
    if (null != obj) {
      //////////////////////////////////////////////////////////////////////////
      // 加载uuid。
      //////////////////////////////////////////////////////////////////////////
      source.modifyAdminAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载角色名称。
      //////////////////////////////////////////////////////////////////////////
      {
        ////////////////////////////////////////////////////////////////////////
        // 清空modifyAdminAM角色名称下拉框的数据并设置状态。
        ////////////////////////////////////////////////////////////////////////
        source.modifyAdminAM.roleNameSelect.getObject().empty();
        source.modifyAdminAM.roleNameSelect.getObject().attr("disabled", "disabled");
        ////////////////////////////////////////////////////////////////////////
        // 如果角色数组不为空，则添加角色名称下拉框数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.roleArray.length) {
          //////////////////////////////////////////////////////////////////////
          // 绑定modifyAdminAM角色名称下拉框数据。
          //////////////////////////////////////////////////////////////////////
          source.modifyAdminAM.roleNameSelect.getObject().append(`<option value = "">请选择</option>`);
          for (let i = 0; i < source.roleArray.length; i++) {
            let selectedCode = "";
            const role = source.roleArray[i];
            if (obj.role_uuid == role.uuid) {
              selectedCode = ` selected = "selected"`;
            }
            ////////////////////////////////////////////////////////////////////
            // 绑定modifyAdminAM角色名称下拉框数据。
            ////////////////////////////////////////////////////////////////////
            source.modifyAdminAM.roleNameSelect.getObject().append(`<option value = "${role.uuid}"${selectedCode}>${role.name}</option>`);
          }
        }
        ////////////////////////////////////////////////////////////////////////
        // 根据modifyAdminAM角色名称下拉框的数据有无设置状态。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.modifyAdminAM.roleNameSelect.getObject().children("option").length) {
          source.modifyAdminAM.roleNameSelect.getObject().removeAttr("disabled");
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 加载账户名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyAdminAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载姓名。
      //////////////////////////////////////////////////////////////////////////
      source.modifyAdminAM.realNameTextField.getObject().val(obj.real_name);
      //////////////////////////////////////////////////////////////////////////
      // 加载账户密码。
      //////////////////////////////////////////////////////////////////////////
      source.modifyAdminAM.passwordTextField.getObject().val(source.defaultPasswordNotChangeValue);
      //////////////////////////////////////////////////////////////////////////
      // 加载状态。
      //////////////////////////////////////////////////////////////////////////
      {
        ////////////////////////////////////////////////////////////////////////
        // 清空modifyAdminAM状态下拉框的数据。
        ////////////////////////////////////////////////////////////////////////
        source.modifyAdminAM.statusSelect.getObject().empty();
        source.modifyAdminAM.statusSelect.getObject().attr("disabled", "disabled");
        ////////////////////////////////////////////////////////////////////////
        // 绑定modifyAdminAM状态下拉框数据。
        ////////////////////////////////////////////////////////////////////////
        let normalStatusCode = ``;
        let lockStatusCode = ``;
        if (Toolkit.stringEqualsIgnoreCase("NORMAL", obj.status)) {
          normalStatusCode = ` selected = "selected"`;
        }
        if (Toolkit.stringEqualsIgnoreCase("LOCK", obj.status)) {
          lockStatusCode = ` selected = "selected"`;
        }
        source.modifyAdminAM.statusSelect.getObject().append(`<option value = "NORMAL"${normalStatusCode}>正常</option>`);
        source.modifyAdminAM.statusSelect.getObject().append(`<option value = "LOCK"${lockStatusCode}>锁定</option>`);
        ////////////////////////////////////////////////////////////////////////
        // 根据modifyAdminAM状态下拉框的数据有无设置状态。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.modifyAdminAM.statusSelect.getObject().children("option").length) {
          source.modifyAdminAM.statusSelect.getObject().removeAttr("disabled");
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 显示修改管理员。
      //////////////////////////////////////////////////////////////////////////
      source.modifyAdminAM.show();
    }
  }

  /**
   * 管理员表格删除按钮click事件
   * @param event 事件对象
   */
  adminTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除管理员吗？");
  }

  /**
   * 删除确认窗确认按钮click事件
   * @param event 事件对象
   */
  removeConfirmWindowConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "uuid", "value": source.removeDataUuid, "id": source.removeConfirmWindow.contentLabel.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.adminRule, "removeAdmin", parameterObj, source, function error(source, errorMessage) {
        source.removeConfirmWindow.showResultInfo("error", errorMessage);
      })) {
        return;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 参数数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterArray = new Array();
    parameterArray.push({"Account-Token": AccountSecurity.getItem("account_token")});
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameter = parameterCheckArray[i];
      const param = {};
      param[parameter.name] = parameter.value;
      parameterArray.push(param);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 删除管理员。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.AdminInfo/removeAdmin", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removeAdmin"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removeAdmin"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.removeConfirmWindow.showResultInfo("success", "删除成功");
            ////////////////////////////////////////////////////////////////////
            // 删除完成。
            ////////////////////////////////////////////////////////////////////
            source.removeConfirmWindow.complete();
            ////////////////////////////////////////////////////////////////////
            // 获取管理员。
            ////////////////////////////////////////////////////////////////////
            source.getAdmin();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.removeConfirmWindow.showResultInfo("error", responseResult.attach);
          } else {
            source.removeConfirmWindow.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 获取管理员
   */
  getAdmin() {
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "department_uuid", "value": this.departmentUuid, "id": "0", "allow_null": true, "custom_error_message": null});
    if (null != this.getAdminParameter.name) {
      parameterCheckArray.push({"name": "name", "value": this.getAdminParameter.name, "id": this.adminFilter.nameTextField.getId(), "allow_null": true, "custom_error_message": null});
    }
    if (null != this.getAdminParameter.role_uuid) {
      parameterCheckArray.push({"name": "role_uuid", "value": this.getAdminParameter.role_uuid, "id": this.adminFilter.roleNameSelect.getId(), "allow_null": true, "custom_error_message": null});
    }
    if (null != this.getAdminParameter.status) {
      parameterCheckArray.push({"name": "status", "value": this.getAdminParameter.status, "id": this.adminFilter.roleNameSelect.getId(), "allow_null": true, "custom_error_message": null});
    }
    parameterCheckArray.push({"name": "offset", "value": this.getAdminParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": this.getAdminParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(this.adminRule, "getAdmin", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取管理员", errorMessage, window.location.href);
      })) {
        return;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 参数数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterArray = new Array();
    parameterArray.push({"Account-Token": AccountSecurity.getItem("account_token")});
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameter = parameterCheckArray[i];
      const param = {};
      param[parameter.name] = parameter.value;
      parameterArray.push(param);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 获取管理员。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.AdminInfo/getAdmin", parameterArray, this, "getAdmin");
  }

  /**
   * 获取角色
   */
  getRole() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取角色。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/security.Role/getRole", [{"Account-Token": AccountSecurity.getItem("account_token")}], this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getRole"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取角色", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取角色", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getRole"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 清空数组。
            ////////////////////////////////////////////////////////////////////
            source.roleArray.splice(0, source.roleArray.length);
            ////////////////////////////////////////////////////////////////////
            // 更新数组。
            ////////////////////////////////////////////////////////////////////
            for (let i = 0; i < responseResult.content.array.length; i++) {
              source.roleArray.push(responseResult.content.array[i]);
            }
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getRole");
            ////////////////////////////////////////////////////////////////////
            // 清空addAdminAM角色名称下拉框的数据并设置状态。
            ////////////////////////////////////////////////////////////////////
            source.addAdminAM.roleNameSelect.getObject().empty();
            source.addAdminAM.roleNameSelect.getObject().attr("disabled", "disabled");
            ////////////////////////////////////////////////////////////////////
            // 清空adminFilter角色名称下拉框的数据并设置状态。
            ////////////////////////////////////////////////////////////////////
            source.adminFilter.roleNameSelect.getObject().empty();
            source.adminFilter.roleNameSelect.getObject().attr("disabled", "disabled");
            ////////////////////////////////////////////////////////////////////
            // 如果角色数组不为空，则添加角色名称下拉框数据。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.roleArray.length) {
              //////////////////////////////////////////////////////////////////
              // 绑定addAdminAM角色名称下拉框数据。
              //////////////////////////////////////////////////////////////////
              source.addAdminAM.roleNameSelect.getObject().append(`<option value = "">请选择</option>`);
              //////////////////////////////////////////////////////////////////
              // 绑定adminFilter角色名称下拉框数据。
              //////////////////////////////////////////////////////////////////
              source.adminFilter.roleNameSelect.getObject().append(`<option value = "">全部</option>`);
              for (let i = 0; i < source.roleArray.length; i++) {
                const role = source.roleArray[i];
                ////////////////////////////////////////////////////////////////
                // 绑定addAdminAM角色名称下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.addAdminAM.roleNameSelect.getObject().append(`<option value = "${role.uuid}">${role.name}</option>`);
                ////////////////////////////////////////////////////////////////
                // 绑定adminFilter角色名称下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.adminFilter.roleNameSelect.getObject().append(`<option value = "${role.uuid}">${role.name}</option>`);
              }
              //////////////////////////////////////////////////////////////////
              // 获取管理员。
              //////////////////////////////////////////////////////////////////
              source.getAdmin();
            }
            ////////////////////////////////////////////////////////////////////
            // 根据addAdminAM角色名称下拉框的数据有无设置状态。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.addAdminAM.roleNameSelect.getObject().children("option").length) {
              source.addAdminAM.roleNameSelect.getObject().removeAttr("disabled");
            }
            ////////////////////////////////////////////////////////////////////
            // 根据adminFilter角色名称下拉框的数据有无设置状态。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.adminFilter.roleNameSelect.getObject().children("option").length) {
              source.adminFilter.roleNameSelect.getObject().removeAttr("disabled");
            }
          } else {
            Error.redirect("../home/error.html", "获取角色", responseResult.attach, window.location.href);
          }
        }
      }
    );
  }

  /**
   * 冻结控件
   * @param name 冻结标记名称
   */
  frozenControl(name) {
    ////////////////////////////////////////////////////////////////////////////
    // 存入队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue.push(name);
    this.returnListButton.getObject().attr("disabled", "disabled");
    this.filterButton.getObject().attr("disabled", "disabled");
    this.addAdminButton.getObject().attr("disabled", "disabled");
  }

  /**
   * 恢复控件
   * @param name 恢复标记名称
   */
  recoverControl(name) {
    ////////////////////////////////////////////////////////////////////////////
    // 队列取出。
    ////////////////////////////////////////////////////////////////////////////
    this.queue.pop(name);
    if (this.queue.isEmpty()) {
      //////////////////////////////////////////////////////////////////////////
      // 如果取出了队列中所有的元素才能恢复。
      //////////////////////////////////////////////////////////////////////////
      this.returnListButton.getObject().removeAttr("disabled");
      this.filterButton.getObject().removeAttr("disabled");
      this.addAdminButton.getObject().removeAttr("disabled");
    }
  }
}
