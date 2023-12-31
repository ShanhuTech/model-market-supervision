"use strict";

class PlaceTypeManagement {
  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 地点类型规则。
    ////////////////////////////////////////////////////////////////////////////
    this.placeTypeRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 地点类型数组。
    ////////////////////////////////////////////////////////////////////////////
    this.placeTypeArray = new Array();
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
    // 添加地点类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 地点类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.placeTypeTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeAM = new PlaceTypeAM(this, "添加地点类型", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyPlaceTypeAM = new PlaceTypeAM(this, "修改地点类型", 40);
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
    // 添加地点类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeButton.setAttribute(
      {
        "class": "global_button_primary add_place_type_button"
      }
    );
    this.addPlaceTypeButton.setContent("添加地点类型");
    ////////////////////////////////////////////////////////////////////////////
    // 地点类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.placeTypeTable.setAttribute(
      {
        "class": "global_table place_type_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "name">名称</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.placeTypeTable.setContent(`
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
    // 添加地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeAM.setClassSign("add_place_type_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyPlaceTypeAM.setClassSign("modify_place_type_am");
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
    // 添加地点类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 地点类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.placeTypeTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyPlaceTypeAM.generateCode();
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
    // 工具栏添加添加地点类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addPlaceTypeButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加地点类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.placeTypeTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addPlaceTypeAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改地点类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyPlaceTypeAM.getCode());
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
    // 注册添加地点类型按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeButton.getObject().off("click").on("click", null, this, this.addPlaceTypeButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加地点类型AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改地点类型AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyPlaceTypeAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加地点类型AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addPlaceTypeAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加地点类型AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addPlaceTypeAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addPlaceTypeAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改地点类型AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyPlaceTypeAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyPlaceTypeAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改地点类型AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyPlaceTypeAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyPlaceTypeAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 添加地点类型按钮click事件
   * @param event 事件对象
   */
  addPlaceTypeButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addPlaceTypeAM.show();
  }

  /**
   * 添加地点类型AM确认按钮click事件
   * @param event 事件对象
   */
  addPlaceTypeAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addPlaceTypeAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "name", "value": source.addPlaceTypeAM.nameTextField.getObject().val(), "id": source.addPlaceTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "order", "value": source.addPlaceTypeAM.orderTextField.getObject().val(), "id": source.addPlaceTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.placeTypeRule, "addPlaceType", parameterObj, source, function error(source, errorMessage) {
        source.addPlaceTypeAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 添加地点类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.PlaceType/addPlaceType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addPlaceTypeAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addPlaceTypeAM.frozenControl("addPlaceType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addPlaceTypeAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addPlaceTypeAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addPlaceTypeAM.recoverControl("addPlaceType"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addPlaceTypeAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addPlaceTypeAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取地点类型。
            ////////////////////////////////////////////////////////////////////
            source.getPlaceType();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addPlaceTypeAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addPlaceTypeAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加地点类型AM取消按钮click事件
   * @param event 事件对象
   */
  addPlaceTypeAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addPlaceTypeAM.hide();
  }

  /**
   * 修改地点类型AM确认按钮click事件
   * @param event 事件对象
   */
  modifyPlaceTypeAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyPlaceTypeAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "uuid", "value": source.modifyPlaceTypeAM.uuidTextField.getObject().val(), "id": source.modifyPlaceTypeAM.uuidTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.modifyPlaceTypeAM.nameTextField.getObject().val(), "id": source.modifyPlaceTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "order", "value": source.modifyPlaceTypeAM.orderTextField.getObject().val(), "id": source.modifyPlaceTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.placeTypeRule, "modifyPlaceType", parameterObj, source, function error(source, errorMessage) {
        source.modifyPlaceTypeAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 修改地点类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.PlaceType/modifyPlaceType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyPlaceTypeAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyPlaceTypeAM.frozenControl("modifyPlaceType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyPlaceTypeAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyPlaceTypeAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyPlaceTypeAM.recoverControl("modifyPlaceType"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyPlaceTypeAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyPlaceTypeAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取地点类型。
            ////////////////////////////////////////////////////////////////////
            source.getPlaceType();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyPlaceTypeAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyPlaceTypeAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改地点类型AM取消按钮click事件
   * @param event 事件对象
   */
  modifyPlaceTypeAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyPlaceTypeAM.hide();
  }

  /**
   * 地点类型表格修改按钮click事件
   * @param event 事件对象
   */
  placeTypeTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从地点类型数组中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.placeTypeArray.length; i++) {
      if (uuid == source.placeTypeArray[i].uuid) {
        obj = source.placeTypeArray[i];
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
      source.modifyPlaceTypeAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyPlaceTypeAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载排序。
      //////////////////////////////////////////////////////////////////////////
      source.modifyPlaceTypeAM.orderTextField.getObject().val(obj.order);
      //////////////////////////////////////////////////////////////////////////
      // 显示修改地点类型。
      //////////////////////////////////////////////////////////////////////////
      source.modifyPlaceTypeAM.show();
    }
  }

  /**
   * 地点类型表格删除按钮click事件
   * @param event 事件对象
   */
  placeTypeTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除地点类型吗？");
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
      if (!Module.checkParameter(source.placeTypeRule, "removePlaceType", parameterObj, source, function error(source, errorMessage) {
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
    // 删除地点类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.PlaceType/removePlaceType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removePlaceType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removePlaceType"); // 恢复控件。
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
            // 获取地点类型。
            ////////////////////////////////////////////////////////////////////
            source.getPlaceType();
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
   * 获取地点类型
   */
  getPlaceType() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取地点类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.PlaceType/getPlaceType", [{"Account-Token": AccountSecurity.getItem("account_token")}], this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getPlaceType"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取地点类型", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取地点类型", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getPlaceType"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 清空数组。
            ////////////////////////////////////////////////////////////////////
            source.placeTypeArray.splice(0, source.placeTypeArray.length);
            ////////////////////////////////////////////////////////////////////
            // 更新数组。
            ////////////////////////////////////////////////////////////////////
            for (let i = 0; i < responseResult.content.array.length; i++) {
              source.placeTypeArray.push(responseResult.content.array[i]);
            }
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getPlaceType");
            ////////////////////////////////////////////////////////////////////
            // 如果地点类型数组不为空，则添加表格数据。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.placeTypeArray.length) {
              let code = "";
              for (let i = 0; i < source.placeTypeArray.length; i++) {
                const placeType = source.placeTypeArray[i];
                code += `
                  <tr data-order = "${placeType.order}">
                    <td class = "name">${placeType.name}</td>
                    <td class = "operation" data-uuid = "${placeType.uuid}"><span class = "modify">修改</span><span class = "remove">删除</span></td>
                  </tr>
                `;
              }
              source.placeTypeTable.getObject().find("tbody").html(code);
            } else {
              source.placeTypeTable.getObject().find("tbody").html(`
                <tr>
                  <td class = "rowspan" colspan = "2">尚无数据</td>
                </tr>
              `);
            }
            ////////////////////////////////////////////////////////////////////
            // 加载完成后注册事件。
            ////////////////////////////////////////////////////////////////////
            source.placeTypeTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.placeTypeTableModifyButtonClickEvent);
            source.placeTypeTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.placeTypeTableRemoveButtonClickEvent);
          } else {
            Error.redirect("../home/error.html", "获取地点类型", responseResult.attach, window.location.href);
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
    this.addPlaceTypeButton.getObject().attr("disabled", "disabled");
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
      this.addPlaceTypeButton.getObject().removeAttr("disabled");
    }
  }
}
