"use strict";

class DepartmentManagement {
  /*
   * 窗体类型枚举
   */
  static WindowType = {
    "ADD_DEPARTMENT_AM": "ADD_DEPARTMENT_AM",
    "DEPARTMENT_FILTER": "DEPARTMENT_FILTER",
    "AP_BOTH": "AP_BOTH",
    "MODIFY_DEPARTMENT_AM": "MODIFY_DEPARTMENT_AM"
  };

  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 单位规则。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 单位类型规则。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTypeRule = ruleArray[1];
    ////////////////////////////////////////////////////////////////////////////
    // 单位对象。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentObj = {};
    ////////////////////////////////////////////////////////////////////////////
    // 单位类型数组。
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
    ////////////////////////////////////////////////////////////////////////////
    // 获取单位的参数。
    ////////////////////////////////////////////////////////////////////////////
    this.getDepartmentParameter = {
      "parent_uuid": null,
      "type_uuid": null,
      "offset": 0,
      "rows": 20
    };
    ////////////////////////////////////////////////////////////////////////////
    // 根据参数设置默认搜索条件。
    ////////////////////////////////////////////////////////////////////////////
    {
      let returnDepartmentListParameter = Toolkit.urlParameterDecode(Toolkit.getUrlParameter("return_department_list_parameter"));
      if (null != returnDepartmentListParameter) {
        returnDepartmentListParameter = JSON.parse(returnDepartmentListParameter);
        this.getDepartmentParameter = returnDepartmentListParameter.get_department_parameter;
      }
    }
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
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 单位表格。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination = new Pagination(this);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM = new DepartmentAM(this, "添加单位", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM = new DepartmentAM(this, "修改单位", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 单位筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter = new DepartmentFilter(this, "筛选", 40);
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
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton.setAttribute(
      {
        "class": "global_button_primary filter_button"
      }
    );
    this.filterButton.setContent("筛选");
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentButton.setAttribute(
      {
        "class": "global_button_primary add_department_button"
      }
    );
    this.addDepartmentButton.setContent("添加单位");
    ////////////////////////////////////////////////////////////////////////////
    // 单位表格。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTable.setAttribute(
      {
        "class": "global_table department_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "department">单位</td>
        <td class = "name">名称</td>
        <td class = "type">类型</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.departmentTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "4">尚无数据</td>
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
    this.pagination.setLimit(this.getDepartmentParameter.rows);
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
    // 添加单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.setClassSign("add_department_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.setClassSign("modify_department_am");
    ////////////////////////////////////////////////////////////////////////////
    // 单位筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.setClassSign("department_filter");
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
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 单位表格。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 单位筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.generateCode();
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
    // 工具栏添加筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.filterButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 工具栏添加添加单位按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addDepartmentButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加单位表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.departmentTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加分页。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.pagination.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addDepartmentAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改单位AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyDepartmentAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加单位筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.departmentFilter.getCode());
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
    // 注册筛选按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton.getObject().off("click").on("click", null, this, this.filterButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentButton.getObject().off("click").on("click", null, this, this.addDepartmentButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加单位AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改单位AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化单位筛选事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取单位的LoadStartEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getDepartmentLoadStartEvent").on("getDepartmentLoadStartEvent", this.getDepartmentLoadStartEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取单位的ErrorEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getDepartmentErrorEvent").on("getDepartmentErrorEvent", this.getDepartmentErrorEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取单位的TimeoutEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getDepartmentTimeoutEvent").on("getDepartmentTimeoutEvent", this.getDepartmentTimeoutEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取单位的ReadyStateChangeEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getDepartmentReadyStateChangeEvent").on("getDepartmentReadyStateChangeEvent", this.getDepartmentReadyStateChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addDepartmentAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addDepartmentAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelOneSelect.getObject().off("change").on("change", null, this, this.addDepartmentAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelTwoSelect.getObject().off("change").on("change", null, this, this.addDepartmentAMLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelThreeSelect.getObject().off("change").on("change", null, this, this.addDepartmentAMLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加单位AM四级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelFourSelect.getObject().off("change").on("change", null, this, this.addDepartmentAMLevelFourSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyDepartmentAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyDepartmentAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelOneSelect.getObject().off("change").on("change", null, this, this.modifyDepartmentAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelTwoSelect.getObject().off("change").on("change", null, this, this.modifyDepartmentAMLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelThreeSelect.getObject().off("change").on("change", null, this, this.modifyDepartmentAMLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改单位AM四级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelFourSelect.getObject().off("change").on("change", null, this, this.modifyDepartmentAMLevelFourSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.formList.confirmButton.getObject().off("click").on("click", null, this, this.departmentFilterConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.formList.cancelButton.getObject().off("click").on("click", null, this, this.departmentFilterCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelOneSelect.getObject().off("change").on("change", null, this, this.departmentFilterLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelTwoSelect.getObject().off("change").on("change", null, this, this.departmentFilterLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelThreeSelect.getObject().off("change").on("change", null, this, this.departmentFilterLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选AM四级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelFourSelect.getObject().off("change").on("change", null, this, this.departmentFilterLevelFourSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 获取单位LoadStartEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getDepartmentLoadStartEvent(event, xhr, xhrEvent, source) {
    source.frozenControl("getDepartment"); // 冻结控件。
    source.waitMask.show(); // 显示等待遮蔽。
  }

  /**
   * 获取单位ErrorEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getDepartmentErrorEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取单位", "网络请求失败", window.location.href);
  }

  /**
   * 获取单位TimeoutEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getDepartmentTimeoutEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取单位", "网络请求超时", window.location.href);
  }

  /**
   * 获取单位ReadyStateChangeEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getDepartmentReadyStateChangeEvent(event, xhr, xhrEvent, source) {
    if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
      source.recoverControl("getDepartment"); // 恢复控件。
      source.waitMask.hide(); // 隐藏等待遮蔽。
      //////////////////////////////////////////////////////////////////////////
      // 响应结果。
      //////////////////////////////////////////////////////////////////////////
      const responseResult = xhr.response;
      if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
        ////////////////////////////////////////////////////////////////////////
        // 清空对象。
        ////////////////////////////////////////////////////////////////////////
        delete source.departmentObj;
        source.departmentObj = {};
        ////////////////////////////////////////////////////////////////////////
        // 更新对象。
        ////////////////////////////////////////////////////////////////////////
        source.departmentObj["count"] = responseResult.content.count;
        source.departmentObj["array"] = new Array();
        for (let i = 0; i < responseResult.content.array.length; i++) {
          source.departmentObj.array.push(responseResult.content.array[i]);
        }
        ////////////////////////////////////////////////////////////////////////
        // 如果单位对象不为空，则添加表格数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.departmentObj.array.length) {
          let code = "";
          for (let i = 0; i < source.departmentObj.array.length; i++) {
            const department = source.departmentObj.array[i];
            let typeName = "";
            ////////////////////////////////////////////////////////////////////
            // 根据显示要求优化数据。
            ////////////////////////////////////////////////////////////////////
            if (Toolkit.isJSONObjectExistKey(department, "type_name")) {
              typeName = department.type_name;
            } else {
              typeName = "无";
            }
            code += `
              <tr>
                <td class = "department">${department.full_name}</td>
                <td class = "name">${department.name}</td>
                <td class = "type">${typeName}</td>
                <td class = "operation" data-uuid = "${department.uuid}" data-department-full-name = "${department.full_name}"><span class = "admin_manage">管理员管理</span><span class = "problem_department_type">设置问题分类</span><span class = "modify">修改</span><span class = "remove">删除</span></td>
              </tr>
            `;
          }
          source.departmentTable.getObject().find("tbody").html(code);
        } else {
          source.departmentTable.getObject().find("tbody").html(`
            <tr>
              <td class = "rowspan" colspan = "4">尚无数据</td>
            </tr>
          `);
        }
        ////////////////////////////////////////////////////////////////////////
        // 更新分页数据。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.setOffset(source.getDepartmentParameter.offset);
        source.pagination.setTotalCount(source.departmentObj.count);
        source.pagination.generateCode();
        source.pagination.getObject().replaceWith(source.pagination.getCode());
        ////////////////////////////////////////////////////////////////////////
        // 初始化分页事件。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.initEvent();
        ////////////////////////////////////////////////////////////////////////
        // 加载完成后注册事件。
        ////////////////////////////////////////////////////////////////////////
        source.departmentTable.getObject().find("tbody").find("tr").find(".operation").find(".admin_manage").off("click").on("click", null, source, source.departmentTableAdminManageButtonClickEvent);
        source.departmentTable.getObject().find("tbody").find("tr").find(".operation").find(".problem_department_type").off("click").on("click", null, source, source.departmentTableProblemDepartmentTypeButtonClickEvent);
        source.departmentTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.departmentTableModifyButtonClickEvent);
        source.departmentTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.departmentTableRemoveButtonClickEvent);
        ////////////////////////////////////////////////////////////////////////
        // 获取获取一级单位。
        ////////////////////////////////////////////////////////////////////////
        source.getDepartmentByParentUuidLevel(0, 1, DepartmentManagement.WindowType.AP_BOTH, null);
      } else {
        Error.redirect("../home/error.html", "获取单位", responseResult.attach, window.location.href);
      }
    }
  }

  /**
   * 添加单位按钮click事件
   * @param event 事件对象
   */
  addDepartmentButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addDepartmentAM.show();
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
    source.departmentFilter.show();
  }

  /**
   * 添加单位AM确认按钮click事件
   * @param event 事件对象
   */
  addDepartmentAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      const levelSelect = {
        "name": "parent_uuid",
        "allow_null": false,
        "custom_error_message": null
      };
      if ((null == source.addDepartmentAM.levelOneSelect.getObject().val()) || (0 >= source.addDepartmentAM.levelOneSelect.getObject().val().length)) {
        levelSelect.value = "0";
        levelSelect.id = source.addDepartmentAM.levelOneSelect.getId();
      }
      if ((null != source.addDepartmentAM.levelOneSelect.getObject().val()) && (0 < source.addDepartmentAM.levelOneSelect.getObject().val().length)) {
        levelSelect.value = source.addDepartmentAM.levelOneSelect.getObject().val();
        levelSelect.id = source.addDepartmentAM.levelOneSelect.getId();
      }
      if ((null != source.addDepartmentAM.levelTwoSelect.getObject().val()) && (0 < source.addDepartmentAM.levelTwoSelect.getObject().val().length)) {
        levelSelect.value = source.addDepartmentAM.levelTwoSelect.getObject().val();
        levelSelect.id = source.addDepartmentAM.levelTwoSelect.getId();
      }
      if ((null != source.addDepartmentAM.levelThreeSelect.getObject().val()) && (0 < source.addDepartmentAM.levelThreeSelect.getObject().val().length)) {
        levelSelect.value = source.addDepartmentAM.levelThreeSelect.getObject().val();
        levelSelect.id = source.addDepartmentAM.levelThreeSelect.getId();
      }
      if ((null != source.addDepartmentAM.levelFourSelect.getObject().val()) && (0 < source.addDepartmentAM.levelFourSelect.getObject().val().length)) {
        levelSelect.value = source.addDepartmentAM.levelFourSelect.getObject().val();
        levelSelect.id = source.addDepartmentAM.levelFourSelect.getId();
      }
      if ((null != source.addDepartmentAM.levelFiveSelect.getObject().val()) && (0 < source.addDepartmentAM.levelFiveSelect.getObject().val().length)) {
        levelSelect.value = source.addDepartmentAM.levelFiveSelect.getObject().val();
        levelSelect.id = source.addDepartmentAM.levelFiveSelect.getId();
      }
      if (Toolkit.isJSONObjectExistKey(levelSelect, "value")) {
        parameterCheckArray.push(levelSelect);
      }
    }
    parameterCheckArray.push({"name": "type_uuid", "value": source.addDepartmentAM.typeSelect.getObject().val(), "id": source.addDepartmentAM.typeSelect.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.addDepartmentAM.nameTextField.getObject().val(), "id": source.addDepartmentAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "order", "value": source.addDepartmentAM.orderTextField.getObject().val(), "id": source.addDepartmentAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.departmentRule, "addDepartment", parameterObj, source, function error(source, errorMessage) {
        source.addDepartmentAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 添加单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Department/addDepartment", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addDepartmentAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addDepartmentAM.frozenControl("addDepartment"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addDepartmentAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addDepartmentAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addDepartmentAM.recoverControl("addDepartment"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addDepartmentAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addDepartmentAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取单位。
            ////////////////////////////////////////////////////////////////////
            source.getDepartment();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addDepartmentAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addDepartmentAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加单位AM取消按钮click事件
   * @param event 事件对象
   */
  addDepartmentAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addDepartmentAM.hide();
  }

  /**
   * 添加单位AM一级下拉框确认change事件
   * @param event 事件对象
   */
  addDepartmentAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelTwoSelect.getObject().empty();
    source.addDepartmentAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelThreeSelect.getObject().empty();
    source.addDepartmentAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFourSelect.getObject().empty();
    source.addDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFiveSelect.getObject().empty();
    source.addDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 2, DepartmentManagement.WindowType.ADD_DEPARTMENT_AM, null);
    }
  }

  /**
   * 添加单位AM二级下拉框确认change事件
   * @param event 事件对象
   */
  addDepartmentAMLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelThreeSelect.getObject().empty();
    source.addDepartmentAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFourSelect.getObject().empty();
    source.addDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFiveSelect.getObject().empty();
    source.addDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 3, DepartmentManagement.WindowType.ADD_DEPARTMENT_AM, null);
    }
  }

  /**
   * 添加单位AM三级下拉框确认change事件
   * @param event 事件对象
   */
  addDepartmentAMLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFourSelect.getObject().empty();
    source.addDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFiveSelect.getObject().empty();
    source.addDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 4, DepartmentManagement.WindowType.ADD_DEPARTMENT_AM, null);
    }
  }

  /**
   * 添加单位AM四级下拉框确认change事件
   * @param event 事件对象
   */
  addDepartmentAMLevelFourSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addDepartmentAM.levelFiveSelect.getObject().empty();
    source.addDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取五级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 5, DepartmentManagement.WindowType.ADD_DEPARTMENT_AM, null);
    }
  }

  /**
   * 修改单位AM确认按钮click事件
   * @param event 事件对象
   */
  modifyDepartmentAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      const levelSelect = {
        "name": "parent_uuid",
        "allow_null": false,
        "custom_error_message": null
      };
      if ((null == source.modifyDepartmentAM.levelOneSelect.getObject().val()) || (0 >= source.modifyDepartmentAM.levelOneSelect.getObject().val().length)) {
        levelSelect.value = "0";
        levelSelect.id = source.modifyDepartmentAM.levelOneSelect.getId();
      }
      if ((null != source.modifyDepartmentAM.levelOneSelect.getObject().val()) && (0 < source.modifyDepartmentAM.levelOneSelect.getObject().val().length)) {
        levelSelect.value = source.modifyDepartmentAM.levelOneSelect.getObject().val();
        levelSelect.id = source.modifyDepartmentAM.levelOneSelect.getId();
      }
      if ((null != source.modifyDepartmentAM.levelTwoSelect.getObject().val()) && (0 < source.modifyDepartmentAM.levelTwoSelect.getObject().val().length)) {
        levelSelect.value = source.modifyDepartmentAM.levelTwoSelect.getObject().val();
        levelSelect.id = source.modifyDepartmentAM.levelTwoSelect.getId();
      }
      if ((null != source.modifyDepartmentAM.levelThreeSelect.getObject().val()) && (0 < source.modifyDepartmentAM.levelThreeSelect.getObject().val().length)) {
        levelSelect.value = source.modifyDepartmentAM.levelThreeSelect.getObject().val();
        levelSelect.id = source.modifyDepartmentAM.levelThreeSelect.getId();
      }
      if ((null != source.modifyDepartmentAM.levelFourSelect.getObject().val()) && (0 < source.modifyDepartmentAM.levelFourSelect.getObject().val().length)) {
        levelSelect.value = source.modifyDepartmentAM.levelFourSelect.getObject().val();
        levelSelect.id = source.modifyDepartmentAM.levelFourSelect.getId();
      }
      if ((null != source.modifyDepartmentAM.levelFiveSelect.getObject().val()) && (0 < source.modifyDepartmentAM.levelFiveSelect.getObject().val().length)) {
        levelSelect.value = source.modifyDepartmentAM.levelFiveSelect.getObject().val();
        levelSelect.id = source.modifyDepartmentAM.levelFiveSelect.getId();
      }
      if (Toolkit.isJSONObjectExistKey(levelSelect, "value")) {
        parameterCheckArray.push(levelSelect);
      }
    }
    parameterCheckArray.push({"name": "uuid", "value": source.modifyDepartmentAM.uuidTextField.getObject().val(), "id": source.modifyDepartmentAM.uuidTextField.getId(), "allow_null": false, "custom_error_message": null});
    if ((null != source.modifyDepartmentAM.typeSelect.getObject().val()) && (0 < source.modifyDepartmentAM.typeSelect.getObject().val().length)) {
      parameterCheckArray.push({"name": "type_uuid", "value": source.modifyDepartmentAM.typeSelect.getObject().val(), "id": source.modifyDepartmentAM.typeSelect.getId(), "allow_null": false, "custom_error_message": null});
    }
    parameterCheckArray.push({"name": "name", "value": source.modifyDepartmentAM.nameTextField.getObject().val(), "id": source.modifyDepartmentAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "order", "value": source.modifyDepartmentAM.orderTextField.getObject().val(), "id": source.modifyDepartmentAM.orderTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.departmentRule, "modifyDepartment", parameterObj, source, function error(source, errorMessage) {
        source.modifyDepartmentAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 修改单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Department/modifyDepartment", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyDepartmentAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyDepartmentAM.frozenControl("modifyDepartment"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyDepartmentAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyDepartmentAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyDepartmentAM.recoverControl("modifyDepartment"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyDepartmentAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyDepartmentAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取单位。
            ////////////////////////////////////////////////////////////////////
            source.getDepartment();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyDepartmentAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyDepartmentAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改单位AM取消按钮click事件
   * @param event 事件对象
   */
  modifyDepartmentAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyDepartmentAM.hide();
  }

  /**
   * 修改单位AM一级下拉框确认change事件
   * @param event 事件对象
   */
  modifyDepartmentAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelTwoSelect.getObject().empty();
    source.modifyDepartmentAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelThreeSelect.getObject().empty();
    source.modifyDepartmentAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFourSelect.getObject().empty();
    source.modifyDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFiveSelect.getObject().empty();
    source.modifyDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 2, DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM, null);
    }
  }

  /**
   * 修改单位AM二级下拉框确认change事件
   * @param event 事件对象
   */
  modifyDepartmentAMLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelThreeSelect.getObject().empty();
    source.modifyDepartmentAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFourSelect.getObject().empty();
    source.modifyDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFiveSelect.getObject().empty();
    source.modifyDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 3, DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM, null);
    }
  }

  /**
   * 修改单位AM三级下拉框确认change事件
   * @param event 事件对象
   */
  modifyDepartmentAMLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFourSelect.getObject().empty();
    source.modifyDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFiveSelect.getObject().empty();
    source.modifyDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 4, DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM, null);
    }
  }

  /**
   * 修改单位AM四级下拉框确认change事件
   * @param event 事件对象
   */
  modifyDepartmentAMLevelFourSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyDepartmentAM.levelFiveSelect.getObject().empty();
    source.modifyDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取五级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 5, DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM, null);
    }
  }

  /**
   * 单位筛选确认按钮click事件
   * @param event 事件对象
   */
  departmentFilterConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      let parentUuid = null;
      let id = null;
      if ((null != source.departmentFilter.levelOneSelect.getObject().val()) && (0 < source.departmentFilter.levelOneSelect.getObject().val().length)) {
        parentUuid = source.departmentFilter.levelOneSelect.getObject().val();
        id = source.departmentFilter.levelOneSelect.getId();
      }
      if ((null != source.departmentFilter.levelTwoSelect.getObject().val()) && (0 < source.departmentFilter.levelTwoSelect.getObject().val().length)) {
        parentUuid = source.departmentFilter.levelTwoSelect.getObject().val();
        id = source.departmentFilter.levelTwoSelect.getId();
      }
      if ((null != source.departmentFilter.levelThreeSelect.getObject().val()) && (0 < source.departmentFilter.levelThreeSelect.getObject().val().length)) {
        parentUuid = source.departmentFilter.levelThreeSelect.getObject().val();
        id = source.departmentFilter.levelThreeSelect.getId();
      }
      if ((null != source.departmentFilter.levelFourSelect.getObject().val()) && (0 < source.departmentFilter.levelFourSelect.getObject().val().length)) {
        parentUuid = source.departmentFilter.levelFourSelect.getObject().val();
        id = source.departmentFilter.levelFourSelect.getId();
      }
      if ((null != source.departmentFilter.levelFiveSelect.getObject().val()) && (0 < source.departmentFilter.levelFiveSelect.getObject().val().length)) {
        parentUuid = source.departmentFilter.levelFiveSelect.getObject().val();
        id = source.departmentFilter.levelFiveSelect.getId();
      }
      if (null != parentUuid) {
        parameterCheckArray.push({"name": "parent_uuid", "value": parentUuid, "id": id, "allow_null": true, "custom_error_message": null});
      }
      source.getDepartmentParameter.parent_uuid = parentUuid;
    }
    if (0 < source.departmentFilter.typeSelect.getObject().val().length) {
      parameterCheckArray.push({"name": "type_uuid", "value": source.departmentFilter.typeSelect.getObject().val(), "id": source.departmentFilter.typeSelect.getId(), "allow_null": true, "custom_error_message": null});
      source.getDepartmentParameter.type_uuid = source.departmentFilter.typeSelect.getObject().val();
    } else {
      source.getDepartmentParameter.type_uuid = null;
    }
    if (0 < source.departmentFilter.nameTextField.getObject().val().length) {
      parameterCheckArray.push({"name": "name", "value": source.departmentFilter.nameTextField.getObject().val(), "id": source.departmentFilter.nameTextField.getId(), "allow_null": true, "custom_error_message": null});
      source.getDepartmentParameter.name = source.departmentFilter.nameTextField.getObject().val();
    } else {
      source.getDepartmentParameter.name = null;
    }
    parameterCheckArray.push({"name": "offset", "value": source.getDepartmentParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": source.getDepartmentParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.departmentRule, "getDepartment", parameterObj, source, function error(source, errorMessage) {
        source.departmentFilter.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 获取单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Department/getDepartment", parameterArray, source, "getDepartment"); 
  }

  /**
   * 单位筛选取消按钮click事件
   * @param event 事件对象
   */
  departmentFilterCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.departmentFilter.hide();
  }

  /**
   * 单位筛选AM一级下拉框确认change事件
   * @param event 事件对象
   */
  departmentFilterLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelTwoSelect.getObject().empty();
    source.departmentFilter.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelThreeSelect.getObject().empty();
    source.departmentFilter.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFourSelect.getObject().empty();
    source.departmentFilter.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFiveSelect.getObject().empty();
    source.departmentFilter.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 2, DepartmentManagement.WindowType.DEPARTMENT_FILTER, null);
    }
  }

  /**
   * 单位筛选AM二级下拉框确认change事件
   * @param event 事件对象
   */
  departmentFilterLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelThreeSelect.getObject().empty();
    source.departmentFilter.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFourSelect.getObject().empty();
    source.departmentFilter.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFiveSelect.getObject().empty();
    source.departmentFilter.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 3, DepartmentManagement.WindowType.DEPARTMENT_FILTER, null);
    }
  }

  /**
   * 单位筛选AM三级下拉框确认change事件
   * @param event 事件对象
   */
  departmentFilterLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFourSelect.getObject().empty();
    source.departmentFilter.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFiveSelect.getObject().empty();
    source.departmentFilter.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 4, DepartmentManagement.WindowType.DEPARTMENT_FILTER, null);
    }
  }

  /**
   * 单位筛选AM四级下拉框确认change事件
   * @param event 事件对象
   */
  departmentFilterLevelFourSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空departmentFilter五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.departmentFilter.levelFiveSelect.getObject().empty();
    source.departmentFilter.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取五级单位。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getDepartmentByParentUuidLevel(selectVal, 5, DepartmentManagement.WindowType.DEPARTMENT_FILTER, null);
    }
  }

  /**
   * 分页按钮点击事件
   * @param source 源对象
   */
  paginationButtonClickEvent(source) {
    source.getDepartmentParameter.offset = this.dataOffset;
    source.getDepartment();
  }

  /**
   * 单位表格管理员管理按钮click事件
   * @param event 事件对象
   */
  departmentTableAdminManageButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 需要传递的参数。
    ////////////////////////////////////////////////////////////////////////////
    const departmentUuid = $(this).parent().attr("data-uuid");
    const departmentFullName = Toolkit.urlParameterEncode($(this).parent().attr("data-department-full-name"));
    ////////////////////////////////////////////////////////////////////////////
    // 返回单位列表参数。
    ////////////////////////////////////////////////////////////////////////////
    const returnDepartmentListParameter = {
      "get_department_parameter": source.getDepartmentParameter
    };
    ////////////////////////////////////////////////////////////////////////////
    // 跳转页面。
    ////////////////////////////////////////////////////////////////////////////
    const returnDepartmentListParameterStr = Toolkit.urlParameterEncode(JSON.stringify(returnDepartmentListParameter));
    window.location.href = `./admin_management.html?department_uuid=${departmentUuid}&department_full_name=${departmentFullName}&return_department_list_parameter=${returnDepartmentListParameterStr}`;
  }

  /**
   * 单位表格问题单位类型按钮click事件
   * @param event 事件对象
   */
  departmentTableProblemDepartmentTypeButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 需要传递的参数。
    ////////////////////////////////////////////////////////////////////////////
    const departmentUuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 返回单位列表参数。
    ////////////////////////////////////////////////////////////////////////////
    const returnDepartmentListParameter = {
      "get_department_parameter": source.getDepartmentParameter
    };
    ////////////////////////////////////////////////////////////////////////////
    // 跳转页面。
    ////////////////////////////////////////////////////////////////////////////
    const returnDepartmentListParameterStr = Toolkit.urlParameterEncode(JSON.stringify(returnDepartmentListParameter));
    window.location.href = `./department_problem_type.html?department_uuid=${departmentUuid}&return_department_list_parameter=${returnDepartmentListParameterStr}`;
  }

  /**
   * 单位表格修改按钮click事件
   * @param event 事件对象
   */
  departmentTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从单位对象中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.departmentObj.array.length; i++) {
      if (uuid == source.departmentObj.array[i].uuid) {
        obj = source.departmentObj.array[i];
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
      source.modifyDepartmentAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载级别下拉框等级。
      //////////////////////////////////////////////////////////////////////////
      if (Toolkit.isJSONObjectExistKey(obj, "parent_array")) {
        for (let i = 0; i < obj.parent_array.length; i++) {
          const parent = obj.parent_array[i];
          source.getDepartmentByParentUuidLevel(parent.parent_uuid, parent.level, DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM, parent.uuid);
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 加载单位类型。
      //////////////////////////////////////////////////////////////////////////
      {
        ////////////////////////////////////////////////////////////////////////
        // 清空modifyDepartmentAM类型下拉框的数据并设置状态。
        ////////////////////////////////////////////////////////////////////////
        source.modifyDepartmentAM.typeSelect.getObject().empty();
        source.modifyDepartmentAM.typeSelect.getObject().attr("disabled", "disabled");
        ////////////////////////////////////////////////////////////////////////
        // 如果单位类型数组不为空，则添加类型下拉框数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.departmentTypeArray.length) {
          //////////////////////////////////////////////////////////////////////
          // 绑定modifyDepartmentAM类型下拉框数据。
          //////////////////////////////////////////////////////////////////////
          source.modifyDepartmentAM.typeSelect.getObject().append(`<option value = "">请选择</option>`);
          for (let i = 0; i < source.departmentTypeArray.length; i++) {
            let selectedCode = "";
            const departmentType = source.departmentTypeArray[i];
            if (obj.type_uuid == departmentType.uuid) {
              selectedCode = ` selected = "selected"`;
            }
            ////////////////////////////////////////////////////////////////////
            // 绑定modifyDepartmentAM类型下拉框数据。
            ////////////////////////////////////////////////////////////////////
            source.modifyDepartmentAM.typeSelect.getObject().append(`<option value = "${departmentType.uuid}"${selectedCode}>${departmentType.name}</option>`);
          }
        }
        ////////////////////////////////////////////////////////////////////////
        // 根据modifyDepartmentAM类型下拉框的数据有无设置状态。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.modifyDepartmentAM.typeSelect.getObject().children("option").length) {
          source.modifyDepartmentAM.typeSelect.getObject().removeAttr("disabled");
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 加载名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyDepartmentAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载排序编号。
      //////////////////////////////////////////////////////////////////////////
      source.modifyDepartmentAM.orderTextField.getObject().val(obj.order);
      //////////////////////////////////////////////////////////////////////////
      // 加载预警。
      //////////////////////////////////////////////////////////////////////////
      if (Toolkit.isJSONObjectExistKey(obj, "warn_uuids")) {
        const warnUuidArray = obj.warn_uuids.split(";");
        for (let i = 0; i < warnUuidArray.length; i++) {
          const warnUuid = warnUuidArray[i];
          source.modifyDepartmentAM.formList.getObject().find("table").find("tbody").find("tr").find("td").find(":checkbox").each(function() {
            if ($(this).val() == warnUuid) {
              $(this).prop("checked", true);
              return false;
            }
          });
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 显示修改单位。
      //////////////////////////////////////////////////////////////////////////
      source.modifyDepartmentAM.show();
    }
  }

  /**
   * 单位表格删除按钮click事件
   * @param event 事件对象
   */
  departmentTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除单位吗？");
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
      if (!Module.checkParameter(source.departmentRule, "removeDepartment", parameterObj, source, function error(source, errorMessage) {
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
    // 删除单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Department/removeDepartment", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removeDepartment"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removeDepartment"); // 恢复控件。
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
            // 获取单位。
            ////////////////////////////////////////////////////////////////////
            source.getDepartment();
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
   * 获取单位类型
   */
  getDepartmentType() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取单位类型。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.DepartmentType/getDepartmentType", [{"Account-Token": AccountSecurity.getItem("account_token")}], this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getDepartmentType"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取单位类型", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取单位类型", "网络请求超时", window.location.href);
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
            // 清空单位类型数组。
            ////////////////////////////////////////////////////////////////////
            source.departmentTypeArray.splice(0, source.departmentTypeArray.length);
            ////////////////////////////////////////////////////////////////////
            // 更新单位类型数组。
            ////////////////////////////////////////////////////////////////////
            for (let i = 0; i < responseResult.content.array.length; i++) {
              source.departmentTypeArray.push(responseResult.content.array[i]);
            }
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getDepartmentType");
            ////////////////////////////////////////////////////////////////////
            // 清空addDepartmentAM单位类型下拉框的数据并设置状态。
            ////////////////////////////////////////////////////////////////////
            source.addDepartmentAM.typeSelect.getObject().empty();
            source.addDepartmentAM.typeSelect.getObject().attr("disabled", "disabled");
            ////////////////////////////////////////////////////////////////////
            // 清空departmentFilter单位类型下拉框的数据并设置状态。
            ////////////////////////////////////////////////////////////////////
            source.departmentFilter.typeSelect.getObject().empty();
            source.departmentFilter.typeSelect.getObject().attr("disabled", "disabled");
            ////////////////////////////////////////////////////////////////////
            // 如果单位类型数组不为空，则添加单位类型下拉框数据。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.departmentTypeArray.length) {
              //////////////////////////////////////////////////////////////////
              // 绑定addDepartmentAM单位类型下拉框数据。
              //////////////////////////////////////////////////////////////////
              source.addDepartmentAM.typeSelect.getObject().append(`<option value = "">请选择</option>`);
              //////////////////////////////////////////////////////////////////
              // 绑定departmentFilter单位类型下拉框数据。
              //////////////////////////////////////////////////////////////////
              source.departmentFilter.typeSelect.getObject().append(`<option value = "">全部</option>`);
              for (let i = 0; i < source.departmentTypeArray.length; i++) {
                const departmentType = source.departmentTypeArray[i];
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM单位类型下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.addDepartmentAM.typeSelect.getObject().append(`<option value = "${departmentType.uuid}">${departmentType.name}</option>`);
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter单位类型下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.departmentFilter.typeSelect.getObject().append(`<option value = "${departmentType.uuid}">${departmentType.name}</option>`);
              }
              //////////////////////////////////////////////////////////////////
              // 获取单位。
              //////////////////////////////////////////////////////////////////
              source.getDepartment();
            }
            ////////////////////////////////////////////////////////////////////
            // 根据addDepartmentAM单位类型下拉框的数据有无设置状态。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.addDepartmentAM.typeSelect.getObject().children("option").length) {
              source.addDepartmentAM.typeSelect.getObject().removeAttr("disabled");
            }
            ////////////////////////////////////////////////////////////////////
            // 根据departmentFilter单位类型下拉框的数据有无设置状态。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.departmentFilter.typeSelect.getObject().children("option").length) {
              source.departmentFilter.typeSelect.getObject().removeAttr("disabled");
            }
          } else {
            Error.redirect("../home/error.html", "获取单位类型", responseResult.attach, window.location.href);
          }
        }
      }
    );
  }

  /**
   * 获取单位
   */
  getDepartment() {
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    if (null != this.getDepartmentParameter.parent_uuid) {
      parameterCheckArray.push({"name": "parent_uuid", "value": this.getDepartmentParameter.parent_uuid, "id": this.departmentFilter.levelOneSelect.getId(), "allow_null": true, "custom_error_message": null});
    }
    if (null != this.getDepartmentParameter.type_uuid) {
      parameterCheckArray.push({"name": "type_uuid", "value": this.getDepartmentParameter.type_uuid, "id": this.departmentFilter.typeSelect.getId(), "allow_null": true, "custom_error_message": null});
    }
    parameterCheckArray.push({"name": "offset", "value": this.getDepartmentParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": this.getDepartmentParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(this.departmentRule, "getDepartment", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取单位", errorMessage, window.location.href);
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
    // 获取单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Department/getDepartment", parameterArray, this, "getDepartment"); 
  }

  /**
   * 根据父级的uuid和级别获取单位
   * @param parentUuid 父级单位的uuid
   * @param level 级别
   * @param window WindowType枚举的窗体类型
   * @param defaultSelect 默认选项
   */
  getDepartmentByParentUuidLevel(parentUuid, level, windowType, defaultSelect) {
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
      if (!Module.checkParameter(this.departmentRule, "getDepartment", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取单位", errorMessage, window.location.href);
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
    // 获取单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Department/getDepartment", parameterArray, this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getDepartment"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取单位", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取单位", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getDepartment"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getDepartment");
            if (1 == level) {
              if (DepartmentManagement.WindowType.ADD_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelOneSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.DEPARTMENT_FILTER == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelOneSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.AP_BOTH == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelOneSelectData(responseResult.content.array);
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelOneSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyDepartmentAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyDepartmentAMLevelOneSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (2 == level) {
              if (DepartmentManagement.WindowType.ADD_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelTwoSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.DEPARTMENT_FILTER == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelTwoSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.AP_BOTH == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelTwoSelectData(responseResult.content.array);
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelTwoSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyDepartmentAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyDepartmentAMLevelTwoSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (3 == level) {
              if (DepartmentManagement.WindowType.ADD_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelThreeSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.DEPARTMENT_FILTER == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelThreeSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.AP_BOTH == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelThreeSelectData(responseResult.content.array);
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelThreeSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyDepartmentAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyDepartmentAMLevelThreeSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (4 == level) {
              if (DepartmentManagement.WindowType.ADD_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelFourSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.DEPARTMENT_FILTER == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelFourSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.AP_BOTH == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelFourSelectData(responseResult.content.array);
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelFourSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyDepartmentAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyDepartmentAMLevelFourSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (5 == level) {
              if (DepartmentManagement.WindowType.ADD_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelFiveSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.DEPARTMENT_FILTER == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelFiveSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.AP_BOTH == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addDepartmentAM五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddDepartmentAMLevelFiveSelectData(responseResult.content.array);
                ////////////////////////////////////////////////////////////////
                // 绑定departmentFilter五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindDepartmentFilterLevelFiveSelectData(responseResult.content.array);
              } else if (DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyDepartmentAM五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyDepartmentAMLevelFiveSelectData(responseResult.content.array, defaultSelect);
              }
            }
          } else {
            Error.redirect("../home/error.html", "获取单位", responseResult.attach, window.location.href);
          }
        }
      }
    );
  }

  /**
   * 绑定addDepartmentAM一级下拉框数据
   * @param array 数组
   */
  bindAddDepartmentAMLevelOneSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelOneSelect.getObject().empty();
    this.addDepartmentAM.levelOneSelect.getObject().attr("disabled", "disabled");
    this.addDepartmentAM.levelOneSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addDepartmentAM一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addDepartmentAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addDepartmentAM一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addDepartmentAM.levelOneSelect.getObject().children("option").length) {
      this.addDepartmentAM.levelOneSelect.getObject().removeAttr("disabled");
    } else {
      this.addDepartmentAM.levelOneSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addDepartmentAM二级下拉框数据
   * @param array 数组
   */
  bindAddDepartmentAMLevelTwoSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelTwoSelect.getObject().empty();
    this.addDepartmentAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    this.addDepartmentAM.levelTwoSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addDepartmentAM二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addDepartmentAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addDepartmentAM二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addDepartmentAM.levelTwoSelect.getObject().children("option").length) {
      this.addDepartmentAM.levelTwoSelect.getObject().removeAttr("disabled");
    } else {
      this.addDepartmentAM.levelTwoSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addDepartmentAM三级下拉框数据
   * @param array 数组
   */
  bindAddDepartmentAMLevelThreeSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelThreeSelect.getObject().empty();
    this.addDepartmentAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    this.addDepartmentAM.levelThreeSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addDepartmentAM三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addDepartmentAM.levelThreeSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addDepartmentAM三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addDepartmentAM.levelThreeSelect.getObject().children("option").length) {
      this.addDepartmentAM.levelThreeSelect.getObject().removeAttr("disabled");
    } else {
      this.addDepartmentAM.levelThreeSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addDepartmentAM四级下拉框数据
   * @param array 数组
   */
  bindAddDepartmentAMLevelFourSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelFourSelect.getObject().empty();
    this.addDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    this.addDepartmentAM.levelFourSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addDepartmentAM四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addDepartmentAM.levelFourSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addDepartmentAM四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addDepartmentAM.levelFourSelect.getObject().children("option").length) {
      this.addDepartmentAM.levelFourSelect.getObject().removeAttr("disabled");
    } else {
      this.addDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addDepartmentAM五级下拉框数据
   * @param array 数组
   */
  bindAddDepartmentAMLevelFiveSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addDepartmentAM.levelFiveSelect.getObject().empty();
    this.addDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    this.addDepartmentAM.levelFiveSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addDepartmentAM五级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addDepartmentAM.levelFiveSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addDepartmentAM五级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addDepartmentAM.levelFiveSelect.getObject().children("option").length) {
      this.addDepartmentAM.levelFiveSelect.getObject().removeAttr("disabled");
    } else {
      this.addDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyDepartmentAM一级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyDepartmentAMLevelOneSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelOneSelect.getObject().empty();
    this.modifyDepartmentAM.levelOneSelect.getObject().attr("disabled", "disabled");
    this.modifyDepartmentAM.levelOneSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyDepartmentAM一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyDepartmentAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyDepartmentAM一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyDepartmentAM.levelOneSelect.getObject().children("option").length) {
      this.modifyDepartmentAM.levelOneSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyDepartmentAM.levelOneSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyDepartmentAM二级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyDepartmentAMLevelTwoSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelTwoSelect.getObject().empty();
    this.modifyDepartmentAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    this.modifyDepartmentAM.levelTwoSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyDepartmentAM二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyDepartmentAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyDepartmentAM二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyDepartmentAM.levelTwoSelect.getObject().children("option").length) {
      this.modifyDepartmentAM.levelTwoSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyDepartmentAM.levelTwoSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyDepartmentAM三级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyDepartmentAMLevelThreeSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelThreeSelect.getObject().empty();
    this.modifyDepartmentAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    this.modifyDepartmentAM.levelThreeSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyDepartmentAM三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyDepartmentAM.levelThreeSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyDepartmentAM三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyDepartmentAM.levelThreeSelect.getObject().children("option").length) {
      this.modifyDepartmentAM.levelThreeSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyDepartmentAM.levelThreeSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyDepartmentAM四级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyDepartmentAMLevelFourSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelFourSelect.getObject().empty();
    this.modifyDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled");
    this.modifyDepartmentAM.levelFourSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyDepartmentAM四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyDepartmentAM.levelFourSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyDepartmentAM四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyDepartmentAM.levelFourSelect.getObject().children("option").length) {
      this.modifyDepartmentAM.levelFourSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyDepartmentAM.levelFourSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyDepartmentAM五级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyDepartmentAMLevelFiveSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyDepartmentAM.levelFiveSelect.getObject().empty();
    this.modifyDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    this.modifyDepartmentAM.levelFiveSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyDepartmentAM五级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyDepartmentAM.levelFiveSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyDepartmentAM五级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyDepartmentAM.levelFiveSelect.getObject().children("option").length) {
      this.modifyDepartmentAM.levelFiveSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyDepartmentAM.levelFiveSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定departmentFilter一级下拉框数据
   * @param array 数组
   */
  bindDepartmentFilterLevelOneSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelOneSelect.getObject().empty();
    this.departmentFilter.levelOneSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 填充departmentFilter一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelOneSelect.getObject().append(`<option value = "">全部</option>`);
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.departmentFilter.levelOneSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据departmentFilter一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.departmentFilter.levelOneSelect.getObject().children("option").length) {
      this.departmentFilter.levelOneSelect.getObject().removeAttr("disabled");
    }
  }

  /**
   * 绑定departmentFilter二级下拉框数据
   * @param array 数组
   */
  bindDepartmentFilterLevelTwoSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelTwoSelect.getObject().empty();
    this.departmentFilter.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 填充departmentFilter二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelTwoSelect.getObject().append(`<option value = "">全部</option>`);
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.departmentFilter.levelTwoSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据departmentFilter二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.departmentFilter.levelTwoSelect.getObject().children("option").length) {
      this.departmentFilter.levelTwoSelect.getObject().removeAttr("disabled");
    }
  }

  /**
   * 绑定departmentFilter三级下拉框数据
   * @param array 数组
   */
  bindDepartmentFilterLevelThreeSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelThreeSelect.getObject().empty();
    this.departmentFilter.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 填充departmentFilter三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelThreeSelect.getObject().append(`<option value = "">全部</option>`);
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.departmentFilter.levelThreeSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据departmentFilter三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.departmentFilter.levelThreeSelect.getObject().children("option").length) {
      this.departmentFilter.levelThreeSelect.getObject().removeAttr("disabled");
    }
  }

  /**
   * 绑定departmentFilter四级下拉框数据
   * @param array 数组
   */
  bindDepartmentFilterLevelFourSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelFourSelect.getObject().empty();
    this.departmentFilter.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 填充departmentFilter四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelFourSelect.getObject().append(`<option value = "">全部</option>`);
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.departmentFilter.levelFourSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据departmentFilter四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.departmentFilter.levelFourSelect.getObject().children("option").length) {
      this.departmentFilter.levelFourSelect.getObject().removeAttr("disabled");
    }
  }

  /**
   * 绑定departmentFilter五级下拉框数据
   * @param array 数组
   */
  bindDepartmentFilterLevelFiveSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addDepartmentAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelFiveSelect.getObject().empty();
    this.departmentFilter.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 填充departmentFilter五级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.levelFiveSelect.getObject().append(`<option value = "">全部</option>`);
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.departmentFilter.levelFiveSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据departmentFilter五级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.departmentFilter.levelFiveSelect.getObject().children("option").length) {
      this.departmentFilter.levelFiveSelect.getObject().removeAttr("disabled");
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
    this.filterButton.getObject().attr("disabled", "disabled");
    this.addDepartmentButton.getObject().attr("disabled", "disabled");
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
      this.filterButton.getObject().removeAttr("disabled");
      this.addDepartmentButton.getObject().removeAttr("disabled");
    }
  }
}
