"use strict";

class DepartmentTypeManagement {
  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 单位类别规则。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTypeRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 单位类别数组。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTypeArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 待删除数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    this.removeDataUuid = null;
    ////////////////////////////////////////////////////////////////////////////
    // 队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue = new Queue();
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
    // 添加单位类别按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 单位类别表格。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTypeTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeAM = new DepartmentTypeAM(this, "添加单位类别", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentTypeAM = new DepartmentTypeAM(this, "修改单位类别", 40);
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
    // 添加单位类别按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeButton.setAttribute(
      {
        "class": "global_button_primary add_department_type_button"
      }
    );
    this.addDepartmentTypeButton.setContent("添加单位类别");
    ////////////////////////////////////////////////////////////////////////////
    // 单位类别表格。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTypeTable.setAttribute(
      {
        "class": "global_table department_type_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "name">名称</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.departmentTypeTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "2">尚无数据</td>
        </tr>
      </tbody>
    `);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.setAttribute(
      {
        "class": "global_wait_mask"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeAM.setClassSign("add_department_type_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentTypeAM.setClassSign("modify_department_type_am");
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
    // 添加单位类别按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 单位类别表格。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTypeTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentTypeAM.generateCode();
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
    // 工具栏添加添加单位类别按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addDepartmentTypeButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加单位类别表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.departmentTypeTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addDepartmentTypeAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改单位类别AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyDepartmentTypeAM.getCode());
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
    // 注册添加单位类别按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeButton.getObject().off("click").on("click", null, this, this.addDepartmentTypeButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加单位类别AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改单位类别AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentTypeAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位类别AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addDepartmentTypeAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位类别AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentTypeAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addDepartmentTypeAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位类别AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentTypeAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyDepartmentTypeAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位类别AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentTypeAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyDepartmentTypeAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 添加单位类别按钮click事件
   * @param event 事件对象
   */
  addDepartmentTypeButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addDepartmentTypeAM.show();
  }

  /**
   * 添加单位类别AM确认按钮click事件
   * @param event 事件对象
   */
  addDepartmentTypeAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentTypeAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "name", "value": source.addDepartmentTypeAM.nameTextField.getObject().val(), "id": source.addDepartmentTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "order", "value": source.addDepartmentTypeAM.orderTextField.getObject().val(), "id": source.addDepartmentTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.departmentTypeRule, "addDepartmentType", parameterObj, source, function error(source, errorMessage) {
        source.addDepartmentTypeAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 添加单位类别。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.DepartmentType/addDepartmentType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addDepartmentTypeAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addDepartmentTypeAM.frozenControl("addDepartmentType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addDepartmentTypeAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addDepartmentTypeAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addDepartmentTypeAM.recoverControl("addDepartmentType"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addDepartmentTypeAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addDepartmentTypeAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取单位类别。
            ////////////////////////////////////////////////////////////////////
            source.getDepartmentType();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addDepartmentTypeAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addDepartmentTypeAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加单位类别AM取消按钮click事件
   * @param event 事件对象
   */
  addDepartmentTypeAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addDepartmentTypeAM.hide();
  }

  /**
   * 修改单位类别AM确认按钮click事件
   * @param event 事件对象
   */
  modifyDepartmentTypeAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentTypeAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "uuid", "value": source.modifyDepartmentTypeAM.uuidTextField.getObject().val(), "id": source.modifyDepartmentTypeAM.uuidTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.modifyDepartmentTypeAM.nameTextField.getObject().val(), "id": source.modifyDepartmentTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "order", "value": source.modifyDepartmentTypeAM.orderTextField.getObject().val(), "id": source.modifyDepartmentTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.departmentTypeRule, "modifyDepartmentType", parameterObj, source, function error(source, errorMessage) {
        source.modifyDepartmentTypeAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 修改单位类别。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.DepartmentType/modifyDepartmentType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyDepartmentTypeAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyDepartmentTypeAM.frozenControl("modifyDepartmentType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyDepartmentTypeAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyDepartmentTypeAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyDepartmentTypeAM.recoverControl("modifyDepartmentType"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyDepartmentTypeAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyDepartmentTypeAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取单位类别。
            ////////////////////////////////////////////////////////////////////
            source.getDepartmentType();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyDepartmentTypeAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyDepartmentTypeAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改单位类别AM取消按钮click事件
   * @param event 事件对象
   */
  modifyDepartmentTypeAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyDepartmentTypeAM.hide();
  }

  /**
   * 单位类别表格修改按钮click事件
   * @param event 事件对象
   */
  departmentTypeTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从单位类别数组中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.departmentTypeArray.length; i++) {
      if (uuid == source.departmentTypeArray[i].uuid) {
        obj = source.departmentTypeArray[i];
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
      source.modifyDepartmentTypeAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyDepartmentTypeAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载排序。
      //////////////////////////////////////////////////////////////////////////
      source.modifyDepartmentTypeAM.orderTextField.getObject().val(obj.order);
      //////////////////////////////////////////////////////////////////////////
      // 显示修改单位类别。
      //////////////////////////////////////////////////////////////////////////
      source.modifyDepartmentTypeAM.show();
    }
  }

  /**
   * 单位类别表格删除按钮click事件
   * @param event 事件对象
   */
  departmentTypeTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除单位类别吗？");
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
      if (!Module.checkParameter(source.departmentTypeRule, "removeDepartmentType", parameterObj, source, function error(source, errorMessage) {
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
    // 删除单位类别。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.DepartmentType/removeDepartmentType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removeDepartmentType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removeDepartmentType"); // 恢复控件。
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
            // 获取单位类别。
            ////////////////////////////////////////////////////////////////////
            source.getDepartmentType();
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
   * 获取单位类别
   */
  getDepartmentType() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取单位类别。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.DepartmentType/getDepartmentType", [{"Account-Token": AccountSecurity.getItem("account_token")}], this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getDepartmentType"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取单位类别", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取单位类别", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getDepartmentType"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 清空数组。
            ////////////////////////////////////////////////////////////////////
            source.departmentTypeArray.splice(0, source.departmentTypeArray.length);
            ////////////////////////////////////////////////////////////////////
            // 更新数组。
            ////////////////////////////////////////////////////////////////////
            for (let i = 0; i < responseResult.content.array.length; i++) {
              source.departmentTypeArray.push(responseResult.content.array[i]);
            }
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getDepartmentType");
            ////////////////////////////////////////////////////////////////////
            // 如果单位类别数组不为空，则添加表格数据。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.departmentTypeArray.length) {
              let code = "";
              for (let i = 0; i < source.departmentTypeArray.length; i++) {
                const departmentType = source.departmentTypeArray[i];
                code += `
                  <tr data-order = "${departmentType.order}">
                    <td class = "name">${departmentType.name}</td>
                    <td class = "operation" data-uuid = "${departmentType.uuid}"><span class = "modify">修改</span><span class = "remove">删除</span></td>
                  </tr>
                `;
              }
              source.departmentTypeTable.getObject().find("tbody").html(code);
            } else {
              source.departmentTypeTable.getObject().find("tbody").html(`
                <tr>
                  <td class = "rowspan" colspan = "2">尚无数据</td>
                </tr>
              `);
            }
            ////////////////////////////////////////////////////////////////////
            // 加载完成后注册事件。
            ////////////////////////////////////////////////////////////////////
            source.departmentTypeTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.departmentTypeTableModifyButtonClickEvent);
            source.departmentTypeTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.departmentTypeTableRemoveButtonClickEvent);
          } else {
            Error.redirect("../home/error.html", "获取单位类别", responseResult.attach, window.location.href);
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
    this.addDepartmentTypeButton.getObject().attr("disabled", "disabled");
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
      this.addDepartmentTypeButton.getObject().removeAttr("disabled");
    }
  }
}
