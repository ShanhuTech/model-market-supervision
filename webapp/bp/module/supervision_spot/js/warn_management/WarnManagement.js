"use strict";

class WarnManagement {
  /*
   * 窗体类型枚举
   */
  static WindowType = {
    "ADD_WARN_AM": "ADD_WARN_AM",
    "MODIFY_WARN_AM": "MODIFY_WARN_AM"
  };

  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 问题类型规则。
    ////////////////////////////////////////////////////////////////////////////
    this.problemTypeRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 预警规则。
    ////////////////////////////////////////////////////////////////////////////
    this.warnRule = ruleArray[1];
    ////////////////////////////////////////////////////////////////////////////
    // 预警对象。
    ////////////////////////////////////////////////////////////////////////////
    this.warnObj = {};
    ////////////////////////////////////////////////////////////////////////////
    // 问题类型数组。
    ////////////////////////////////////////////////////////////////////////////
    this.problemTypeArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 待删除数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    this.removeDataUuid = null;
    ////////////////////////////////////////////////////////////////////////////
    // 队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue = new Queue();
    ////////////////////////////////////////////////////////////////////////////
    // 获取预警的参数。
    ////////////////////////////////////////////////////////////////////////////
    this.getWarnParameter = {
      "offset": 0,
      "rows": 20
    };
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
    // 添加预警按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 预警表格。
    ////////////////////////////////////////////////////////////////////////////
    this.warnTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination = new Pagination(this);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM = new WarnAM(this, "添加预警", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM = new WarnAM(this, "修改预警", 40);
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
    // 添加预警按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnButton.setAttribute(
      {
        "class": "global_button_primary add_warn_button"
      }
    );
    this.addWarnButton.setContent("添加预警");
    ////////////////////////////////////////////////////////////////////////////
    // 预警表格。
    ////////////////////////////////////////////////////////////////////////////
    this.warnTable.setAttribute(
      {
        "class": "global_table warn_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "name">名称</td>
        <td class = "confidence">灵敏度（分）</td>
        <td class = "interval">合并间隔（分）</td>
        <td class = "warn_tolerance">预警容忍时间</td>
        <td class = "problem_tolerance">问题容忍时间（分）</td>
        <td class = "observation">观察时间（分）</td>
        <td class = "holiday_status">假期停止预警</td>
        <td class = "status">状态</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.warnTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "9">尚无数据</td>
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
    this.pagination.setLimit(this.getWarnParameter.rows);
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
    // 添加预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.setClassSign("add_warn_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.setClassSign("modify_warn_am");
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
    // 添加预警按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 预警表格。
    ////////////////////////////////////////////////////////////////////////////
    this.warnTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.generateCode();
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
    // 工具栏添加添加预警按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addWarnButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加预警表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.warnTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加分页。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.pagination.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addWarnAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改预警AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyWarnAM.getCode());
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
    // 注册添加预警按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnButton.getObject().off("click").on("click", null, this, this.addWarnButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加预警AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改预警AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取预警的LoadStartEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getWarnLoadStartEvent").on("getWarnLoadStartEvent", this.getWarnLoadStartEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取预警的ErrorEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getWarnErrorEvent").on("getWarnErrorEvent", this.getWarnErrorEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取预警的TimeoutEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getWarnTimeoutEvent").on("getWarnTimeoutEvent", this.getWarnTimeoutEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取预警的ReadyStateChangeEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getWarnReadyStateChangeEvent").on("getWarnReadyStateChangeEvent", this.getWarnReadyStateChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加预警AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addWarnAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加预警AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addWarnAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加预警AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelOneSelect.getObject().off("change").on("change", null, this, this.addWarnAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加预警AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelTwoSelect.getObject().off("change").on("change", null, this, this.addWarnAMLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加预警AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelThreeSelect.getObject().off("change").on("change", null, this, this.addWarnAMLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改预警AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyWarnAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改预警AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyWarnAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改预警AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelOneSelect.getObject().off("change").on("change", null, this, this.modifyWarnAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改预警AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelTwoSelect.getObject().off("change").on("change", null, this, this.modifyWarnAMLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改预警AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelThreeSelect.getObject().off("change").on("change", null, this, this.modifyWarnAMLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 获取预警LoadStartEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getWarnLoadStartEvent(event, xhr, xhrEvent, source) {
    source.frozenControl("getWarn"); // 冻结控件。
    source.waitMask.show(); // 显示等待遮蔽。
  }

  /**
   * 获取预警ErrorEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getWarnErrorEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取预警", "网络请求失败", window.location.href);
  }

  /**
   * 获取预警TimeoutEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getWarnTimeoutEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取预警", "网络请求超时", window.location.href);
  }

  /**
   * 获取预警ReadyStateChangeEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getWarnReadyStateChangeEvent(event, xhr, xhrEvent, source) {
    if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
      source.recoverControl("getWarn"); // 恢复控件。
      source.waitMask.hide(); // 隐藏等待遮蔽。
      //////////////////////////////////////////////////////////////////////////
      // 响应结果。
      //////////////////////////////////////////////////////////////////////////
      const responseResult = xhr.response;
      if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
        ////////////////////////////////////////////////////////////////////////
        // 清空对象。
        ////////////////////////////////////////////////////////////////////////
        delete source.warnObj;
        source.warnObj = {};
        ////////////////////////////////////////////////////////////////////////
        // 更新对象。
        ////////////////////////////////////////////////////////////////////////
        source.warnObj["count"] = responseResult.content.count;
        source.warnObj["array"] = new Array();
        for (let i = 0; i < responseResult.content.array.length; i++) {
          source.warnObj.array.push(responseResult.content.array[i]);
        }
        ////////////////////////////////////////////////////////////////////////
        // 如果预警对象不为空，则添加表格数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.warnObj.array.length) {
          let code = "";
          for (let i = 0; i < source.warnObj.array.length; i++) {
            const warn = source.warnObj.array[i];
            let holidayStatus = "";
            let status = "";
            ////////////////////////////////////////////////////////////////////
            // 根据显示要求优化数据。
            ////////////////////////////////////////////////////////////////////
            if (Toolkit.stringEqualsIgnoreCase("ENABLE", warn.holiday_status)) {
              holidayStatus = "是";
            } else {
              holidayStatus = "否";
            }
            if (Toolkit.stringEqualsIgnoreCase("ENABLE", warn.status)) {
              status = "启用";
            } else {
              status = "禁用";
            }
            code += `
              <tr>
                <td class = "name">${warn.name}</td>
                <td class = "confidence">${warn.confidence}</td>
                <td class = "interval">${warn.interval}</td>
                <td class = "warn_tolerance">${warn.warn_tolerance}</td>
                <td class = "problem_tolerance">${warn.problem_tolerance}</td>
                <td class = "observation">${warn.observation}</td>
                <td class = "holiday_status">${holidayStatus}</td>
                <td class = "status">${status}</td>
                <td class = "operation" data-uuid = "${warn.uuid}"><span class = "modify">修改</span><span class = "remove">删除</span></td>
              </tr>
            `;
          }
          source.warnTable.getObject().find("tbody").html(code);
        } else {
          source.warnTable.getObject().find("tbody").html(`
            <tr>
              <td class = "rowspan" colspan = "9">尚无数据</td>
            </tr>
          `);
        }
        ////////////////////////////////////////////////////////////////////////
        // 更新分页数据。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.setOffset(source.getWarnParameter.offset);
        source.pagination.setTotalCount(source.warnObj.count);
        source.pagination.generateCode();
        source.pagination.getObject().replaceWith(source.pagination.getCode());
        ////////////////////////////////////////////////////////////////////////
        // 初始化分页事件。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.initEvent();
        ////////////////////////////////////////////////////////////////////////
        // 加载完成后注册事件。
        ////////////////////////////////////////////////////////////////////////
        source.warnTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.warnTableModifyButtonClickEvent);
        source.warnTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.warnTableRemoveButtonClickEvent);
        ////////////////////////////////////////////////////////////////////////
        // 获取获取一级问题类型。
        ////////////////////////////////////////////////////////////////////////
        source.getProblemTypeByParentUuidLevel(0, 1, WarnManagement.WindowType.ADD_WARN_AM, null);
      } else {
        Error.redirect("../home/error.html", "获取预警", responseResult.attach, window.location.href);
      }
    }
  }

  /**
   * 添加预警按钮click事件
   * @param event 事件对象
   */
  addWarnButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addWarnAM.show();
  }

  /**
   * 添加预警AM确认按钮click事件
   * @param event 事件对象
   */
  addWarnAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      //////////////////////////////////////////////////////////////////////////
      // 地址是必填项，所以默认地址为一级问题类型。
      //////////////////////////////////////////////////////////////////////////
      const levelSelect = {
        "name": "problem_type_uuid",
        "value": source.addWarnAM.levelOneSelect.getObject().val(),
        "id": source.addWarnAM.levelOneSelect.getId(),
        "allow_null": false,
        "custom_error_message": null
      };
      if ((null != source.addWarnAM.levelTwoSelect.getObject().val()) && (0 < source.addWarnAM.levelTwoSelect.getObject().val().length)) {
        levelSelect.value = source.addWarnAM.levelTwoSelect.getObject().val();
        levelSelect.id = source.addWarnAM.levelTwoSelect.getId();
      }
      if ((null != source.addWarnAM.levelThreeSelect.getObject().val()) && (0 < source.addWarnAM.levelThreeSelect.getObject().val().length)) {
        levelSelect.value = source.addWarnAM.levelThreeSelect.getObject().val();
        levelSelect.id = source.addWarnAM.levelThreeSelect.getId();
      }
      if ((null != source.addWarnAM.levelFourSelect.getObject().val()) && (0 < source.addWarnAM.levelFourSelect.getObject().val().length)) {
        levelSelect.value = source.addWarnAM.levelFourSelect.getObject().val();
        levelSelect.id = source.addWarnAM.levelFourSelect.getId();
      }
      parameterCheckArray.push(levelSelect);
    }
    parameterCheckArray.push({"name": "name", "value": source.addWarnAM.nameTextField.getObject().val(), "id": source.addWarnAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "confidence", "value": source.addWarnAM.confidenceTextField.getObject().val(), "id": source.addWarnAM.confidenceTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "interval", "value": source.addWarnAM.intervalTextField.getObject().val(), "id": source.addWarnAM.intervalTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "warn_tolerance", "value": source.addWarnAM.warnToleranceTextField.getObject().val(), "id": source.addWarnAM.warnToleranceTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "problem_tolerance", "value": source.addWarnAM.problemToleranceTextField.getObject().val(), "id": source.addWarnAM.problemToleranceTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "observation", "value": source.addWarnAM.observationTextField.getObject().val(), "id": source.addWarnAM.observationTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "holiday_status", "value": source.addWarnAM.holidayStatusSelect.getObject().val(), "id": source.addWarnAM.holidayStatusSelect.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "time_range", "value": source.addWarnAM.timeRangeTextField.getObject().val(), "id": source.addWarnAM.timeRangeTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "status", "value": source.addWarnAM.statusSelect.getObject().val(), "id": source.addWarnAM.statusSelect.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.warnRule, "addWarn", parameterObj, source, function error(source, errorMessage) {
        source.addWarnAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 添加预警。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Warn/addWarn", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addWarnAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addWarnAM.frozenControl("addWarn"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addWarnAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addWarnAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addWarnAM.recoverControl("addWarn"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addWarnAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addWarnAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取预警。
            ////////////////////////////////////////////////////////////////////
            source.getWarn();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addWarnAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addWarnAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加预警AM取消按钮click事件
   * @param event 事件对象
   */
  addWarnAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addWarnAM.hide();
  }

  /**
   * 添加预警AM一级下拉框确认change事件
   * @param event 事件对象
   */
  addWarnAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.levelTwoSelect.getObject().empty();
    source.addWarnAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.levelThreeSelect.getObject().empty();
    source.addWarnAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.levelFourSelect.getObject().empty();
    source.addWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级问题类型。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getProblemTypeByParentUuidLevel(selectVal, 2, WarnManagement.WindowType.ADD_WARN_AM, null);
    }
  }

  /**
   * 添加预警AM二级下拉框确认change事件
   * @param event 事件对象
   */
  addWarnAMLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.levelThreeSelect.getObject().empty();
    source.addWarnAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.levelFourSelect.getObject().empty();
    source.addWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级问题类型。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getProblemTypeByParentUuidLevel(selectVal, 3, WarnManagement.WindowType.ADD_WARN_AM, null);
    }
  }

  /**
   * 添加预警AM三级下拉框确认change事件
   * @param event 事件对象
   */
  addWarnAMLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addWarnAM.levelFourSelect.getObject().empty();
    source.addWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级问题类型。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getProblemTypeByParentUuidLevel(selectVal, 4, WarnManagement.WindowType.ADD_WARN_AM, null);
    }
  }

  /**
   * 修改预警AM确认按钮click事件
   * @param event 事件对象
   */
  modifyWarnAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      //////////////////////////////////////////////////////////////////////////
      // 地址是必填项，所以默认地址为一级问题类型。
      //////////////////////////////////////////////////////////////////////////
      const levelSelect = {
        "name": "problem_type_uuid",
        "value": source.modifyWarnAM.levelOneSelect.getObject().val(),
        "id": source.modifyWarnAM.levelOneSelect.getId(),
        "allow_null": false,
        "custom_error_message": null
      };
      if ((null != source.modifyWarnAM.levelTwoSelect.getObject().val()) && (0 < source.modifyWarnAM.levelTwoSelect.getObject().val().length)) {
        levelSelect.value = source.modifyWarnAM.levelTwoSelect.getObject().val();
        levelSelect.id = source.modifyWarnAM.levelTwoSelect.getId();
      }
      if ((null != source.modifyWarnAM.levelThreeSelect.getObject().val()) && (0 < source.modifyWarnAM.levelThreeSelect.getObject().val().length)) {
        levelSelect.value = source.modifyWarnAM.levelThreeSelect.getObject().val();
        levelSelect.id = source.modifyWarnAM.levelThreeSelect.getId();
      }
      if ((null != source.modifyWarnAM.levelFourSelect.getObject().val()) && (0 < source.modifyWarnAM.levelFourSelect.getObject().val().length)) {
        levelSelect.value = source.modifyWarnAM.levelFourSelect.getObject().val();
        levelSelect.id = source.modifyWarnAM.levelFourSelect.getId();
      }
      parameterCheckArray.push(levelSelect);
    }
    parameterCheckArray.push({"name": "uuid", "value": source.modifyWarnAM.uuidTextField.getObject().val(), "id": source.modifyWarnAM.uuidTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.modifyWarnAM.nameTextField.getObject().val(), "id": source.modifyWarnAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "confidence", "value": source.modifyWarnAM.confidenceTextField.getObject().val(), "id": source.modifyWarnAM.confidenceTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "interval", "value": source.modifyWarnAM.intervalTextField.getObject().val(), "id": source.modifyWarnAM.intervalTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "warn_tolerance", "value": source.modifyWarnAM.warnToleranceTextField.getObject().val(), "id": source.modifyWarnAM.warnToleranceTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "problem_tolerance", "value": source.modifyWarnAM.problemToleranceTextField.getObject().val(), "id": source.modifyWarnAM.problemToleranceTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "observation", "value": source.modifyWarnAM.observationTextField.getObject().val(), "id": source.modifyWarnAM.observationTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "holiday_status", "value": source.modifyWarnAM.holidayStatusSelect.getObject().val(), "id": source.modifyWarnAM.holidayStatusSelect.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "time_range", "value": source.modifyWarnAM.timeRangeTextField.getObject().val(), "id": source.modifyWarnAM.timeRangeTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "status", "value": source.modifyWarnAM.statusSelect.getObject().val(), "id": source.modifyWarnAM.statusSelect.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.warnRule, "modifyWarn", parameterObj, source, function error(source, errorMessage) {
        source.modifyWarnAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 修改预警。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Warn/modifyWarn", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyWarnAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyWarnAM.frozenControl("modifyWarn"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyWarnAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyWarnAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyWarnAM.recoverControl("modifyWarn"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyWarnAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyWarnAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取预警。
            ////////////////////////////////////////////////////////////////////
            source.getWarn();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyWarnAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyWarnAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改预警AM取消按钮click事件
   * @param event 事件对象
   */
  modifyWarnAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyWarnAM.hide();
  }

  /**
   * 修改预警AM一级下拉框确认change事件
   * @param event 事件对象
   */
  modifyWarnAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.levelTwoSelect.getObject().empty();
    source.modifyWarnAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.levelThreeSelect.getObject().empty();
    source.modifyWarnAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.levelFourSelect.getObject().empty();
    source.modifyWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级问题类型。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getProblemTypeByParentUuidLevel(selectVal, 2, WarnManagement.WindowType.MODIFY_WARN_AM, null);
    }
  }

  /**
   * 修改预警AM二级下拉框确认change事件
   * @param event 事件对象
   */
  modifyWarnAMLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.levelThreeSelect.getObject().empty();
    source.modifyWarnAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.levelFourSelect.getObject().empty();
    source.modifyWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级问题类型。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getProblemTypeByParentUuidLevel(selectVal, 3, WarnManagement.WindowType.MODIFY_WARN_AM, null);
    }
  }

  /**
   * 修改预警AM三级下拉框确认change事件
   * @param event 事件对象
   */
  modifyWarnAMLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyWarnAM.levelFourSelect.getObject().empty();
    source.modifyWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级问题类型。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getProblemTypeByParentUuidLevel(selectVal, 4, WarnManagement.WindowType.MODIFY_WARN_AM, null);
    }
  }

  /**
   * 分页按钮点击事件
   * @param source 源对象
   */
  paginationButtonClickEvent(source) {
    source.getWarnParameter.offset = this.dataOffset;
    source.getWarn();
  }

  /**
   * 预警表格修改按钮click事件
   * @param event 事件对象
   */
  warnTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从预警对象中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.warnObj.array.length; i++) {
      if (uuid == source.warnObj.array[i].uuid) {
        obj = source.warnObj.array[i];
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
      source.modifyWarnAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载级别下拉框等级。
      //////////////////////////////////////////////////////////////////////////
      if (Toolkit.isJSONObjectExistKey(obj, "node_array")) {
        if (0 >= obj.node_array.length) {
          source.getProblemTypeByParentUuidLevel(0, 1, WarnManagement.WindowType.MODIFY_WARN_AM, obj.problem_type_uuid);
        } else {
          for (let i = 0; i < obj.node_array.length; i++) {
            const node = obj.node_array[i];
            source.getProblemTypeByParentUuidLevel(node.parent_uuid, node.level, WarnManagement.WindowType.MODIFY_WARN_AM, node.uuid);
          }
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 加载名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载灵敏度。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.confidenceTextField.getObject().val(obj.confidence);
      //////////////////////////////////////////////////////////////////////////
      // 加载合并间隔。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.intervalTextField.getObject().val(obj.interval);
      //////////////////////////////////////////////////////////////////////////
      // 加载预警容忍时间。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.warnToleranceTextField.getObject().val(obj.warn_tolerance);
      //////////////////////////////////////////////////////////////////////////
      // 加载问题容忍时间。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.problemToleranceTextField.getObject().val(obj.problem_tolerance);
      //////////////////////////////////////////////////////////////////////////
      // 加载观察时间。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.observationTextField.getObject().val(obj.observation);
      //////////////////////////////////////////////////////////////////////////
      // 加载假期状态。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.holidayStatusSelect.getObject().children("option").each(function() {
        if (Toolkit.stringEqualsIgnoreCase($(this).val(), obj.holiday_status)) {
          $(this).prop("selected", "selected");
        } else {
          $(this).removeProp("selected");
        }
      });
      //////////////////////////////////////////////////////////////////////////
      // 加载时间范围。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.timeRangeTextField.getObject().val(obj.time_range);
      //////////////////////////////////////////////////////////////////////////
      // 加载状态。
      //////////////////////////////////////////////////////////////////////////
       source.modifyWarnAM.statusSelect.getObject().children("option").each(function() {
        if (Toolkit.stringEqualsIgnoreCase($(this).val(), obj.status)) {
          $(this).prop("selected", "selected");
        } else {
          $(this).removeProp("selected");
        }
      });     
      //////////////////////////////////////////////////////////////////////////
      // 显示修改预警。
      //////////////////////////////////////////////////////////////////////////
      source.modifyWarnAM.show();
    }
  }

  /**
   * 预警表格删除按钮click事件
   * @param event 事件对象
   */
  warnTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除预警吗？");
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
      if (!Module.checkParameter(source.warnRule, "removeWarn", parameterObj, source, function error(source, errorMessage) {
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
    // 删除预警。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Warn/removeWarn", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removeWarn"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removeWarn"); // 恢复控件。
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
            // 获取预警。
            ////////////////////////////////////////////////////////////////////
            source.getWarn();
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
   * 获取预警
   */
  getWarn() {
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "offset", "value": this.getWarnParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": this.getWarnParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(this.warnRule, "getWarn", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取预警", errorMessage, window.location.href);
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
    // 获取预警。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Warn/getWarn", parameterArray, this, "getWarn");
  }

  /**
   * 根据父级的uuid和级别获取问题类型
   * @param parentUuid 父级问题类型的uuid
   * @param level 级别
   * @param window WindowType枚举的窗体类型
   * @param defaultSelect 默认选项
   */
  getProblemTypeByParentUuidLevel(parentUuid, level, windowType, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "parent_uuid", "value": parentUuid, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "level", "value": level, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(this.problemTypeRule, "getProblemType", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取问题类型", errorMessage, window.location.href);
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
    // 获取问题类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.ProblemType/getProblemType", parameterArray, this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getProblemType"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取问题类型", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取问题类型", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getProblemType"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getProblemType");
            if (1 == level) {
              if (WarnManagement.WindowType.ADD_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addWarnAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddWarnAMLevelOneSelectData(responseResult.content.array);
              } else if (WarnManagement.WindowType.MODIFY_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyWarnAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyWarnAMLevelOneSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (2 == level) {
              if (WarnManagement.WindowType.ADD_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addWarnAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddWarnAMLevelTwoSelectData(responseResult.content.array);
              } else if (WarnManagement.WindowType.MODIFY_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyWarnAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyWarnAMLevelTwoSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (3 == level) {
              if (WarnManagement.WindowType.ADD_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addWarnAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddWarnAMLevelThreeSelectData(responseResult.content.array);
              } else if (WarnManagement.WindowType.MODIFY_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyWarnAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyWarnAMLevelThreeSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (4 == level) {
              if (WarnManagement.WindowType.ADD_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addWarnAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddWarnAMLevelFourSelectData(responseResult.content.array);
              } else if (WarnManagement.WindowType.MODIFY_WARN_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyWarnAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyWarnAMLevelFourSelectData(responseResult.content.array, defaultSelect);
              }
            }
          } else {
            Error.redirect("../home/error.html", "获取问题类型", responseResult.attach, window.location.href);
          }
        }
      }
    );
  }

  /**
   * 绑定addWarnAM一级下拉框数据
   * @param array 数组
   */
  bindAddWarnAMLevelOneSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelOneSelect.getObject().empty();
    this.addWarnAM.levelOneSelect.getObject().attr("disabled", "disabled");
    this.addWarnAM.levelOneSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addWarnAM一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addWarnAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addWarnAM一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addWarnAM.levelOneSelect.getObject().children("option").length) {
      this.addWarnAM.levelOneSelect.getObject().removeAttr("disabled");
    } else {
      this.addWarnAM.levelOneSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addWarnAM二级下拉框数据
   * @param array 数组
   */
  bindAddWarnAMLevelTwoSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelTwoSelect.getObject().empty();
    this.addWarnAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    this.addWarnAM.levelTwoSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addWarnAM二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addWarnAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addWarnAM二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addWarnAM.levelTwoSelect.getObject().children("option").length) {
      this.addWarnAM.levelTwoSelect.getObject().removeAttr("disabled");
    } else {
      this.addWarnAM.levelTwoSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addWarnAM三级下拉框数据
   * @param array 数组
   */
  bindAddWarnAMLevelThreeSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelThreeSelect.getObject().empty();
    this.addWarnAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    this.addWarnAM.levelThreeSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addWarnAM三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addWarnAM.levelThreeSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addWarnAM三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addWarnAM.levelThreeSelect.getObject().children("option").length) {
      this.addWarnAM.levelThreeSelect.getObject().removeAttr("disabled");
    } else {
      this.addWarnAM.levelThreeSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addWarnAM四级下拉框数据
   * @param array 数组
   */
  bindAddWarnAMLevelFourSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addWarnAM.levelFourSelect.getObject().empty();
    this.addWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    this.addWarnAM.levelFourSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addWarnAM四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addWarnAM.levelFourSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addWarnAM四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addWarnAM.levelFourSelect.getObject().children("option").length) {
      this.addWarnAM.levelFourSelect.getObject().removeAttr("disabled");
    } else {
      this.addWarnAM.levelFourSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyWarnAM一级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyWarnAMLevelOneSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelOneSelect.getObject().empty();
    this.modifyWarnAM.levelOneSelect.getObject().attr("disabled", "disabled");
    this.modifyWarnAM.levelOneSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyWarnAM一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyWarnAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyWarnAM一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyWarnAM.levelOneSelect.getObject().children("option").length) {
      this.modifyWarnAM.levelOneSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyWarnAM.levelOneSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyWarnAM二级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyWarnAMLevelTwoSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelTwoSelect.getObject().empty();
    this.modifyWarnAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    this.modifyWarnAM.levelTwoSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyWarnAM二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyWarnAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyWarnAM二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyWarnAM.levelTwoSelect.getObject().children("option").length) {
      this.modifyWarnAM.levelTwoSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyWarnAM.levelTwoSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyWarnAM三级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyWarnAMLevelThreeSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelThreeSelect.getObject().empty();
    this.modifyWarnAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    this.modifyWarnAM.levelThreeSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyWarnAM三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyWarnAM.levelThreeSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyWarnAM三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyWarnAM.levelThreeSelect.getObject().children("option").length) {
      this.modifyWarnAM.levelThreeSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyWarnAM.levelThreeSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyWarnAM四级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyWarnAMLevelFourSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyWarnAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyWarnAM.levelFourSelect.getObject().empty();
    this.modifyWarnAM.levelFourSelect.getObject().attr("disabled", "disabled");
    this.modifyWarnAM.levelFourSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyWarnAM四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyWarnAM.levelFourSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyWarnAM四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyWarnAM.levelFourSelect.getObject().children("option").length) {
      this.modifyWarnAM.levelFourSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyWarnAM.levelFourSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
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
    this.addWarnButton.getObject().attr("disabled", "disabled");
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
      this.addWarnButton.getObject().removeAttr("disabled");
    }
  }
}
