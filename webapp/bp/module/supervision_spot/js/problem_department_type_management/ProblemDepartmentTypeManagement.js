"use strict";

class ProblemDepartmentTypeManagement {
  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 问题单位类型规则。
    ////////////////////////////////////////////////////////////////////////////
    this.problemDepartmentTypeRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 问题单位类型数组。
    ////////////////////////////////////////////////////////////////////////////
    this.problemDepartmentTypeArray = new Array();
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
    // 添加一级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelOneButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 添加二级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelTwoButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 添加三级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelThreeButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 问题单位类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.problemDepartmentTypeTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM = new ProblemDepartmentTypeAM(this, "添加问题单位类型", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM = new ProblemDepartmentTypeAM(this, "修改问题单位类型", 40);
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
    // 添加一级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelOneButton.setAttribute(
      {
        "class": "global_button_primary add_problem_department_type_level_one_button"
      }
    );
    this.addProblemDepartmentTypeLevelOneButton.setContent("添加一级问题单位类型");
    ////////////////////////////////////////////////////////////////////////////
    // 添加二级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelTwoButton.setAttribute(
      {
        "class": "global_button_primary add_problem_department_type_level_two_button"
      }
    );
    this.addProblemDepartmentTypeLevelTwoButton.setContent("添加二级问题单位类型");
    ////////////////////////////////////////////////////////////////////////////
    // 添加三级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelThreeButton.setAttribute(
      {
        "class": "global_button_primary add_problem_department_type_level_three_button"
      }
    );
    this.addProblemDepartmentTypeLevelThreeButton.setContent("添加三级问题单位类型");
    ////////////////////////////////////////////////////////////////////////////
    // 问题单位类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.problemDepartmentTypeTable.setAttribute(
      {
        "class": "global_table problem_department_type_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "name">名称</td>
        <td class = "description">描述</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.problemDepartmentTypeTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "3">尚无数据</td>
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
    // 添加问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM.setClassSign("add_problem_department_type_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM.setClassSign("modify_problem_department_type_am");
    ////////////////////////////////////////////////////////////////////////////
    // 删除确认窗。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.setAttribute(
      {
        "class": "remove_confirm_window"
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
    // 添加一级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelOneButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加二级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelTwoButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加三级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelThreeButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 问题单位类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.problemDepartmentTypeTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM.generateCode();
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
    // 工具栏添加添加一级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addProblemDepartmentTypeLevelOneButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏添加添加二级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addProblemDepartmentTypeLevelTwoButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏添加添加三级问题单位类型按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addProblemDepartmentTypeLevelThreeButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加问题单位类型表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.problemDepartmentTypeTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加一级问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addProblemDepartmentTypeAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改问题单位类型AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyProblemDepartmentTypeAM.getCode());
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
    // 注册添加一级问题单位类型按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelOneButton.getObject().off("click").on("click", null, this, this.addProblemDepartmentTypeLevelOneButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加二级问题单位类型按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelTwoButton.getObject().off("click").on("click", null, this, this.addProblemDepartmentTypeLevelTwoButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加三级问题单位类型按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeLevelThreeButton.getObject().off("click").on("click", null, this, this.addProblemDepartmentTypeLevelThreeButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加问题单位类型AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改问题单位类型AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加问题单位类型AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addProblemDepartmentTypeAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加问题单位类型AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addProblemDepartmentTypeAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加问题单位类型AM一级问题单位类型下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addProblemDepartmentTypeAM.levelOneSelect.getObject().off("change").on("change", null, this, this.addProblemDepartmentTypeAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改问题单位类型AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyProblemDepartmentTypeAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改问题单位类型AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyProblemDepartmentTypeAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改问题单位类型AM一级问题单位类型下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().off("change").on("change", null, this, this.modifyProblemDepartmentTypeLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 添加一级问题单位类型按钮click事件
   * @param event 事件对象
   */
  addProblemDepartmentTypeLevelOneButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addProblemDepartmentTypeAM.show(1);
  }

  /**
   * 添加二级问题单位类型按钮click事件
   * @param event 事件对象
   */
  addProblemDepartmentTypeLevelTwoButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addProblemDepartmentTypeAM.show(2);
  }

  /**
   * 添加三级问题单位类型按钮click事件
   * @param event 事件对象
   */
  addProblemDepartmentTypeLevelThreeButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addProblemDepartmentTypeAM.show(3);
  }

  /**
   * 添加问题单位类型AM确认按钮click事件
   * @param event 事件对象
   */
  addProblemDepartmentTypeAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addProblemDepartmentTypeAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    if (1 == source.addProblemDepartmentTypeAM.problemDepartmentTypeLevel) {
      //////////////////////////////////////////////////////////////////////////
      // 添加一级问题单位类型。
      //////////////////////////////////////////////////////////////////////////
      parameterCheckArray.push({"name": "parent_uuid", "value": "0", "id": source.addProblemDepartmentTypeAM.levelOneSelect.getId(), "allow_null": false, "custom_error_message": null});
      parameterCheckArray.push({"name": "name", "value": source.addProblemDepartmentTypeAM.nameTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
      parameterCheckArray.push({"name": "order", "value": source.addProblemDepartmentTypeAM.orderTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
      if (0 < source.addProblemDepartmentTypeAM.descriptionTextField.getObject().val().length) {
        parameterCheckArray.push({"name": "description", "value": source.addProblemDepartmentTypeAM.descriptionTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true, "custom_error_message": null});
      }
    } else if (2 == source.addProblemDepartmentTypeAM.problemDepartmentTypeLevel) {
      //////////////////////////////////////////////////////////////////////////
      // 添加二级问题单位类型。
      //////////////////////////////////////////////////////////////////////////
      parameterCheckArray.push({"name": "parent_uuid", "value": source.addProblemDepartmentTypeAM.levelOneSelect.getObject().val(), "id": source.addProblemDepartmentTypeAM.levelOneSelect.getId(), "allow_null": false, "custom_error_message": null});
      parameterCheckArray.push({"name": "name", "value": source.addProblemDepartmentTypeAM.nameTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
      parameterCheckArray.push({"name": "order", "value": source.addProblemDepartmentTypeAM.orderTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
      if (0 < source.addProblemDepartmentTypeAM.descriptionTextField.getObject().val().length) {
        parameterCheckArray.push({"name": "description", "value": source.addProblemDepartmentTypeAM.descriptionTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true, "custom_error_message": null});
      }
    } else if (3 == source.addProblemDepartmentTypeAM.problemDepartmentTypeLevel) {
      //////////////////////////////////////////////////////////////////////////
      // 添加三级问题单位类型。
      //////////////////////////////////////////////////////////////////////////
      parameterCheckArray.push({"name": "parent_uuid", "value": source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().val(), "id": source.addProblemDepartmentTypeAM.levelTwoSelect.getId(), "allow_null": false, "custom_error_message": null});
      parameterCheckArray.push({"name": "name", "value": source.addProblemDepartmentTypeAM.nameTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
      parameterCheckArray.push({"name": "order", "value": source.addProblemDepartmentTypeAM.orderTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
      if (0 < source.addProblemDepartmentTypeAM.descriptionTextField.getObject().val().length) {
        parameterCheckArray.push({"name": "description", "value": source.addProblemDepartmentTypeAM.descriptionTextField.getObject().val(), "id": source.addProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true, "custom_error_message": null});
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.problemDepartmentTypeRule, "addProblemDepartmentType", parameterObj, source, function error(source, errorMessage) {
        source.addProblemDepartmentTypeAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 添加问题单位类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.ProblemDepartmentType/addProblemDepartmentType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addProblemDepartmentTypeAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addProblemDepartmentTypeAM.frozenControl("addProblemDepartmentType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addProblemDepartmentTypeAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addProblemDepartmentTypeAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addProblemDepartmentTypeAM.recoverControl("addProblemDepartmentType"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addProblemDepartmentTypeAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addProblemDepartmentTypeAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取问题单位类型。
            ////////////////////////////////////////////////////////////////////
            source.getProblemDepartmentType();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addProblemDepartmentTypeAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addProblemDepartmentTypeAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加问题单位类型AM取消按钮click事件
   * @param event 事件对象
   */
  addProblemDepartmentTypeAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addProblemDepartmentTypeAM.hide();
  }

  /**
   * 添加问题单位类型AM一级下拉框确认change事件
   * @param event 事件对象
   */
  addProblemDepartmentTypeAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空二级问题单位类型下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().empty();
    source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 填充二级问题单位类型数据。
    ////////////////////////////////////////////////////////////////////////////
    {
      const selectVal = source.addProblemDepartmentTypeAM.levelOneSelect.getObject().val();
      for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
        const m = source.problemDepartmentTypeArray[i];
        if (selectVal == m.parent_uuid) {
          source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addProblemDepartmentTypeAM二级问题单位类型下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().children("option").length) {
      source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().removeAttr("disabled");
      source.addProblemDepartmentTypeAM.levelTwoSelect.getObject().trigger("change");
    }
  }

  /**
   * 修改问题单位类型AM确认按钮click事件
   * @param event 事件对象
   */
  modifyProblemDepartmentTypeAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyProblemDepartmentTypeAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    if (1 == source.modifyProblemDepartmentTypeAM.problemDepartmentTypeLevel) {
      //////////////////////////////////////////////////////////////////////////
      // 修改一级问题单位类型。
      //////////////////////////////////////////////////////////////////////////
      parameterCheckArray.push({"name": "uuid", "value": source.modifyProblemDepartmentTypeAM.uuidTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.uuidTextField.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "parent_uuid", "value": "0", "id": source.modifyProblemDepartmentTypeAM.levelOneSelect.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "name", "value": source.modifyProblemDepartmentTypeAM.nameTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.nameTextField.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "order", "value": source.modifyProblemDepartmentTypeAM.orderTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.orderTextField.getId(), "allow_null": false});
      if (0 < source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val().length) {
        parameterCheckArray.push({"name": "description", "value": source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true});
      } else {
        parameterCheckArray.push({"name": "description_null", "value": "null", "id": source.modifyProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true});
      }
    } else if (2 == source.modifyProblemDepartmentTypeAM.problemDepartmentTypeLevel) {
      //////////////////////////////////////////////////////////////////////////
      // 修改二级问题单位类型。
      //////////////////////////////////////////////////////////////////////////
      parameterCheckArray.push({"name": "uuid", "value": source.modifyProblemDepartmentTypeAM.uuidTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.uuidTextField.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "parent_uuid", "value": source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.levelOneSelect.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "name", "value": source.modifyProblemDepartmentTypeAM.nameTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.nameTextField.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "order", "value": source.modifyProblemDepartmentTypeAM.orderTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.orderTextField.getId(), "allow_null": false});
      if (0 < source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val().length) {
        parameterCheckArray.push({"name": "description", "value": source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true});
      } else {
        parameterCheckArray.push({"name": "description_null", "value": "null", "id": source.modifyProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true});
      }
    } else if (3 == source.modifyProblemDepartmentTypeAM.problemDepartmentTypeLevel) {
      //////////////////////////////////////////////////////////////////////////
      // 修改三级问题单位类型。
      //////////////////////////////////////////////////////////////////////////
      parameterCheckArray.push({"name": "uuid", "value": source.modifyProblemDepartmentTypeAM.uuidTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.uuidTextField.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "parent_uuid", "value": source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.levelTwoSelect.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "name", "value": source.modifyProblemDepartmentTypeAM.nameTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.nameTextField.getId(), "allow_null": false});
      parameterCheckArray.push({"name": "order", "value": source.modifyProblemDepartmentTypeAM.orderTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.orderTextField.getId(), "allow_null": false});
      if (0 < source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val().length) {
        parameterCheckArray.push({"name": "description", "value": source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val(), "id": source.modifyProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true});
      } else {
        parameterCheckArray.push({"name": "description_null", "value": "null", "id": source.modifyProblemDepartmentTypeAM.descriptionTextField.getId(), "allow_null": true});
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.problemDepartmentTypeRule, "modifyProblemDepartmentType", parameterObj, source, function error(source, errorMessage) {
        source.modifyProblemDepartmentTypeAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 修改问题单位类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.ProblemDepartmentType/modifyProblemDepartmentType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyProblemDepartmentTypeAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyProblemDepartmentTypeAM.frozenControl("modifyProblemDepartmentType"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyProblemDepartmentTypeAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyProblemDepartmentTypeAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyProblemDepartmentTypeAM.recoverControl("modifyProblemDepartmentType"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyProblemDepartmentTypeAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyProblemDepartmentTypeAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取问题单位类型。
            ////////////////////////////////////////////////////////////////////
            source.getProblemDepartmentType();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyProblemDepartmentTypeAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyProblemDepartmentTypeAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改问题单位类型AM取消按钮click事件
   * @param event 事件对象
   */
  modifyProblemDepartmentTypeAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyProblemDepartmentTypeAM.hide();
  }

  /**
   * 修改问题单位类型AM一级问题单位类型下拉框change事件
   * @param event 事件对象
   */
  modifyProblemDepartmentTypeLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空二级问题单位类型下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().empty();
    source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 遍历子问题单位类型数组添加至二级问题单位类型下拉框。
    ////////////////////////////////////////////////////////////////////////////
    {
      const selectVal = source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().val();
      for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
        const m = source.problemDepartmentTypeArray[i];
        if (selectVal == m.parent_uuid) {
          source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 根据modifyProblemDepartmentTypeAM二级问题单位类型下拉框的数据有无设置状态。
      //////////////////////////////////////////////////////////////////////////
      if (0 < source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().children("option").length) {
        source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().removeAttr("disabled");
      }
    }
  }

  /**
   * 问题单位类型表格修改按钮click事件
   * @param event 事件对象
   */
  problemDepartmentTypeTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从问题单位类型数组中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
      if (uuid == source.problemDepartmentTypeArray[i].uuid) {
        obj = source.problemDepartmentTypeArray[i];
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
      source.modifyProblemDepartmentTypeAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyProblemDepartmentTypeAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载排序。
      //////////////////////////////////////////////////////////////////////////
      source.modifyProblemDepartmentTypeAM.orderTextField.getObject().val(obj.order);
      //////////////////////////////////////////////////////////////////////////
      // 加载描述。
      //////////////////////////////////////////////////////////////////////////
      if (Toolkit.isJSONObjectExistKey(obj, "description")) {
        source.modifyProblemDepartmentTypeAM.descriptionTextField.getObject().val(obj.description);
      }
      if (1 == obj.level) {
        ////////////////////////////////////////////////////////////////////////
        // 显示修改一级问题单位类型。
        ////////////////////////////////////////////////////////////////////////
        source.modifyProblemDepartmentTypeAM.show(1);
      } else if (2 == obj.level) {
        ////////////////////////////////////////////////////////////////////////
        // 加载一级问题单位类型下拉框并设置状态。
        ////////////////////////////////////////////////////////////////////////
        source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().empty();
        source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().attr("disabled", "disabled");
        ////////////////////////////////////////////////////////////////////////
        // 加载一级问题单位类型下拉框并设置选中项。
        ////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
          const m = source.problemDepartmentTypeArray[i];
          if (1 == m.level) {
            let selectedCode = "";
            if (obj.parent_uuid == m.uuid) {
              selectedCode = ` selected = "selected"`;
            }
            source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}"${selectedCode}>${m.name}</option>`);
          }
        }
        //////////////////////////////////////////////////////////////////////
        // 根据modifyProblemDepartmentTypeAM一级问题单位类型下拉框的数据有无设置状态。
        //////////////////////////////////////////////////////////////////////
        if (0 < source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().children("option").length) {
          source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().removeAttr("disabled");
        }
        ////////////////////////////////////////////////////////////////////////
        // 显示修改二级问题单位类型。
        ////////////////////////////////////////////////////////////////////////
        source.modifyProblemDepartmentTypeAM.show(2);
      } else if (3 == obj.level) {
        ////////////////////////////////////////////////////////////////////////
        // 根据三级问题单位类型的parent_uuid找到对应uuid的二级问题单位类型。
        ////////////////////////////////////////////////////////////////////////
        let levelTwoProblemDepartmentTypeUuid = null;
        let levelTwoProblemDepartmentTypeParentUuid = null;
        for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
          if (obj.parent_uuid == source.problemDepartmentTypeArray[i].uuid) {
            levelTwoProblemDepartmentTypeUuid = source.problemDepartmentTypeArray[i].uuid;
            levelTwoProblemDepartmentTypeParentUuid = source.problemDepartmentTypeArray[i].parent_uuid;
            break;
          }
        }
        if ((null == levelTwoProblemDepartmentTypeUuid) || (null == levelTwoProblemDepartmentTypeParentUuid)) {
          return;
        }
        ////////////////////////////////////////////////////////////////////////
        // 根据二级问题单位类型的parent_uuid找到对应uuid的一级问题单位类型。
        ////////////////////////////////////////////////////////////////////////
        let levelOneProblemDepartmentTypeUuid = null;
        for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
          if (levelTwoProblemDepartmentTypeParentUuid == source.problemDepartmentTypeArray[i].uuid) {
            levelOneProblemDepartmentTypeUuid = source.problemDepartmentTypeArray[i].uuid;
            break;
          }
        }
        if (null == levelOneProblemDepartmentTypeUuid) {
          return;
        }
        ////////////////////////////////////////////////////////////////////////
        // 清空一级问题单位类型下拉框的数据并设置状态。
        ////////////////////////////////////////////////////////////////////////
        source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().empty();
        source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().attr("disabled", "disabled");
        ////////////////////////////////////////////////////////////////////////
        // 加载一级问题单位类型下拉框并设置选中项。
        ////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
          const m = source.problemDepartmentTypeArray[i];
          if (1 == m.level) {
            let selectedCode = "";
            if (levelOneProblemDepartmentTypeUuid == m.uuid) {
              selectedCode = ` selected = "selected"`;
            }
            source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}"${selectedCode}>${m.name}</option>`);
          }
        }
        ////////////////////////////////////////////////////////////////////////
        // 根据modifyProblemDepartmentTypeAM一级问题单位类型下拉框的数据有无设置状态。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().children("option").length) {
          source.modifyProblemDepartmentTypeAM.levelOneSelect.getObject().removeAttr("disabled");
        }
        ////////////////////////////////////////////////////////////////////////
        // 清空二级问题单位类型下拉框的数据并设置状态。
        ////////////////////////////////////////////////////////////////////////
        source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().empty();
        source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().attr("disabled", "disabled");
        ////////////////////////////////////////////////////////////////////////
        // 加载二级问题单位类型下拉框并设置选中项。
        ////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
          const m = source.problemDepartmentTypeArray[i];
          if (levelTwoProblemDepartmentTypeParentUuid == m.parent_uuid) {
            let selectedCode = "";
            if (levelTwoProblemDepartmentTypeUuid == m.uuid) {
              selectedCode = ` selected = "selected"`;
            }
            source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}"${selectedCode}>${m.name}</option>`);
          }
        }
        ////////////////////////////////////////////////////////////////////////
        // 根据modifyProblemDepartmentTypeAM二级问题单位类型下拉框的数据有无设置状态。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().children("option").length) {
          source.modifyProblemDepartmentTypeAM.levelTwoSelect.getObject().removeAttr("disabled");
        }
        ////////////////////////////////////////////////////////////////////////
        // 显示修改三级问题单位类型。
        ////////////////////////////////////////////////////////////////////////
        source.modifyProblemDepartmentTypeAM.show(3);
      }
    }
  }

  /**
   * 问题单位类型表格删除按钮click事件
   * @param event 事件对象
   */
  problemDepartmentTypeTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除问题单位类型吗？");
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
    parameterCheckArray.push({"name": "uuid", "value": source.removeDataUuid, "id": source.removeConfirmWindow.contentLabel.getId(), "allow_null": false});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.problemDepartmentTypeRule, "removeProblemDepartmentType", parameterObj, source, function error(source, errorMessage) {
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
    // 删除问题单位类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.ProblemDepartmentType/removeProblemDepartmentType", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl(); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl(); // 恢复控件。
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
            // 获取问题单位类型。
            ////////////////////////////////////////////////////////////////////
            source.getProblemDepartmentType();
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
   * 获取问题单位类型
   */
  getProblemDepartmentType() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取问题单位类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.ProblemDepartmentType/getProblemDepartmentType", [{"Account-Token": AccountSecurity.getItem("account_token")}], this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getProblemDepartmentType"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取问题单位类型", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取问题单位类型", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getProblemDepartmentType"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 清空数组。
            ////////////////////////////////////////////////////////////////////
            source.problemDepartmentTypeArray.splice(0, source.problemDepartmentTypeArray.length);
            ////////////////////////////////////////////////////////////////////
            // 存入问题单位类型数组。
            ////////////////////////////////////////////////////////////////////
            for (let i = 0; i < responseResult.content.array.length; i++) {
              source.problemDepartmentTypeArray.push(responseResult.content.array[i]);
            }
            ////////////////////////////////////////////////////////////////////
            // 刷新下拉框，这里只能刷新添加问题单位类型的下拉框，修改问题单位类型里下拉框的数据
            // 在点击修改按钮时加载。
            ////////////////////////////////////////////////////////////////////
            source.addProblemDepartmentTypeAM.refreshSelect(source.problemDepartmentTypeArray);
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getProblemDepartmentType");
            ////////////////////////////////////////////////////////////////////
            // 如果问题单位类型数组不为空，则添加表格数据。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.problemDepartmentTypeArray.length) {
              let code = "";
              for (let i = 0; i < source.problemDepartmentTypeArray.length; i++) {
                const problemDepartmentType = source.problemDepartmentTypeArray[i];
                let problemDepartmentTypeLevelClassName = "";
                if (1 == problemDepartmentType.level) {
                  // 一级问题单位类型
                  problemDepartmentTypeLevelClassName = "problem_department_type_level_one";
                } else if (2 == problemDepartmentType.level) {
                  // 二级问题单位类型
                  problemDepartmentTypeLevelClassName = "problem_department_type_level_two";
                } else {
                  // 三级问题单位类型
                  problemDepartmentTypeLevelClassName = "problem_department_type_level_three";
                }
                let description = "";
                ////////////////////////////////////////////////////////////////
                // 根据显示要求优化数据。
                ////////////////////////////////////////////////////////////////
                if (null == problemDepartmentType.description) {
                  description = "无";
                } else {
                  description = problemDepartmentType.description;
                }
                code += `
                  <tr data-parent_uuid = "${problemDepartmentType.parent_uuid}" data-order = "${problemDepartmentType.order}">
                    <td class = "name ${problemDepartmentTypeLevelClassName}">${problemDepartmentType.name}</td>
                    <td class = "description">${description}</td>
                    <td class = "operation" data-uuid = "${problemDepartmentType.uuid}"><span class = "modify">修改</span><span class = "remove">删除</span></td>
                  </tr>
                `;
              }
              source.problemDepartmentTypeTable.getObject().find("tbody").html(code);
            } else {
              source.problemDepartmentTypeTable.getObject().find("tbody").html(`
                <tr>
                  <td class = "rowspan" colspan = "3">尚无数据</td>
                </tr>
              `);
            }
            ////////////////////////////////////////////////////////////////////
            // 加载完成后注册事件。
            ////////////////////////////////////////////////////////////////////
            source.problemDepartmentTypeTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.problemDepartmentTypeTableModifyButtonClickEvent);
            source.problemDepartmentTypeTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.problemDepartmentTypeTableRemoveButtonClickEvent);
          } else {
            Error.redirect("../home/error.html", "获取问题单位类型", responseResult.attach, window.location.href);
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
    this.addProblemDepartmentTypeLevelOneButton.getObject().attr("disabled", "disabled");
    this.addProblemDepartmentTypeLevelTwoButton.getObject().attr("disabled", "disabled");
    this.addProblemDepartmentTypeLevelThreeButton.getObject().attr("disabled", "disabled");
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
      this.addProblemDepartmentTypeLevelOneButton.getObject().removeAttr("disabled");
      this.addProblemDepartmentTypeLevelTwoButton.getObject().removeAttr("disabled");
      this.addProblemDepartmentTypeLevelThreeButton.getObject().removeAttr("disabled");
    }
  }
}
