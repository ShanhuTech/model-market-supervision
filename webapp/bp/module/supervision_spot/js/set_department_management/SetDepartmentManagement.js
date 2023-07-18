"use strict";

class DepartmentManagement {
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
    // 传递参数。
    ////////////////////////////////////////////////////////////////////////////
    this.adminUuid = Toolkit.getUrlParameter("admin_uuid");
    // this.manageDepartments = Toolkit.getUrlParameter("manage_departments");
    this.manageDepartments = AccountSecurity.getItem("manage_departments");
    if (null == this.adminUuid) {
      Error.redirect("../home/error.html", "管理员的uuid不能为空", "网络请求失败", window.location.href);
    }
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
    // 注册单位筛选确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.formList.confirmButton.getObject().off("click").on("click", null, this, this.departmentFilterConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册单位筛选取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.departmentFilter.formList.cancelButton.getObject().off("click").on("click", null, this, this.departmentFilterCancelButtonClickEvent);
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
            let operateType = "ADD";
            let operateText = "添加";
            if ((null != source.manageDepartments) && (0 < source.manageDepartments.length)) {
              if (-1 != source.manageDepartments.indexOf(department.uuid)) {
                operateType = "REMOVE";
                operateText = "【移除】";
              }
            }
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
                <td class = "operation" id = "${Toolkit.generateUuid()}" data-uuid = "${department.uuid}" data-operate-type = "${operateType}" data-department-full-name = "${department.full_name}"><span class = "modify">${operateText}</span></td>
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
        source.departmentTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.departmentTableModifyButtonClickEvent);
      } else {
        Error.redirect("../home/error.html", "获取单位", responseResult.attach, window.location.href);
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
    source.departmentFilter.show();
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
    const tdUuid = $(this).parent().attr("id");
    const operateType = $(this).parent().attr("data-operate-type");
    const parameterArray = new Array();
    parameterArray.push({"uuid": source.adminUuid});
    parameterArray.push({"manage_department_uuid": uuid});
    parameterArray.push({"manage_department_type": operateType});
    parameterArray.push({"Account-Token": AccountSecurity.getItem("account_token")});
    ////////////////////////////////////////////////////////////////////////////
    // 设置监督单位。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.AdminInfo/modifyAdmin", parameterArray, source,
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
            if ("ADD" == operateType) {
              $("#" + tdUuid).find("span").html("【移除】");
              $("#" + tdUuid).attr("data-operate-type", "REMOVE");
            } else {
              $("#" + tdUuid).find("span").html("添加");
              $("#" + tdUuid).attr("data-operate-type", "ADD");
            }
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            alert(responseResult.attach);
          } else {
            alert("操作异常");
          }
        }
      }
    );
    // alert("aaa");
    // return;




    // ////////////////////////////////////////////////////////////////////////////
    // // 从单位对象中获取该uuid对应的数据。
    // ////////////////////////////////////////////////////////////////////////////
    // let obj = null;
    // for (let i = 0; i < source.departmentObj.array.length; i++) {
    //   if (uuid == source.departmentObj.array[i].uuid) {
    //     obj = source.departmentObj.array[i];
    //     break;
    //   }
    // }
    // ////////////////////////////////////////////////////////////////////////////
    // // 设置当前数据至修改界面。
    // ////////////////////////////////////////////////////////////////////////////
    // if (null != obj) {
    //   //////////////////////////////////////////////////////////////////////////
    //   // 加载uuid。
    //   //////////////////////////////////////////////////////////////////////////
    //   source.modifyDepartmentAM.uuidTextField.getObject().val(obj.uuid);
    //   //////////////////////////////////////////////////////////////////////////
    //   // 加载级别下拉框等级。
    //   //////////////////////////////////////////////////////////////////////////
    //   if (Toolkit.isJSONObjectExistKey(obj, "parent_array")) {
    //     for (let i = 0; i < obj.parent_array.length; i++) {
    //       const parent = obj.parent_array[i];
    //       source.getDepartmentByParentUuidLevel(parent.parent_uuid, parent.level, DepartmentManagement.WindowType.MODIFY_DEPARTMENT_AM, parent.uuid);
    //     }
    //   }
    //   //////////////////////////////////////////////////////////////////////////
    //   // 加载单位类型。
    //   //////////////////////////////////////////////////////////////////////////
    //   {
    //     ////////////////////////////////////////////////////////////////////////
    //     // 清空modifyDepartmentAM类型下拉框的数据并设置状态。
    //     ////////////////////////////////////////////////////////////////////////
    //     source.modifyDepartmentAM.typeSelect.getObject().empty();
    //     source.modifyDepartmentAM.typeSelect.getObject().attr("disabled", "disabled");
    //     ////////////////////////////////////////////////////////////////////////
    //     // 如果单位类型数组不为空，则添加类型下拉框数据。
    //     ////////////////////////////////////////////////////////////////////////
    //     if (0 < source.departmentTypeArray.length) {
    //       //////////////////////////////////////////////////////////////////////
    //       // 绑定modifyDepartmentAM类型下拉框数据。
    //       //////////////////////////////////////////////////////////////////////
    //       source.modifyDepartmentAM.typeSelect.getObject().append(`<option value = "">请选择</option>`);
    //       for (let i = 0; i < source.departmentTypeArray.length; i++) {
    //         let selectedCode = "";
    //         const departmentType = source.departmentTypeArray[i];
    //         if (obj.type_uuid == departmentType.uuid) {
    //           selectedCode = ` selected = "selected"`;
    //         }
    //         ////////////////////////////////////////////////////////////////////
    //         // 绑定modifyDepartmentAM类型下拉框数据。
    //         ////////////////////////////////////////////////////////////////////
    //         source.modifyDepartmentAM.typeSelect.getObject().append(`<option value = "${departmentType.uuid}"${selectedCode}>${departmentType.name}</option>`);
    //       }
    //     }
    //     ////////////////////////////////////////////////////////////////////////
    //     // 根据modifyDepartmentAM类型下拉框的数据有无设置状态。
    //     ////////////////////////////////////////////////////////////////////////
    //     if (0 < source.modifyDepartmentAM.typeSelect.getObject().children("option").length) {
    //       source.modifyDepartmentAM.typeSelect.getObject().removeAttr("disabled");
    //     }
    //   }
    //   //////////////////////////////////////////////////////////////////////////
    //   // 加载名称。
    //   //////////////////////////////////////////////////////////////////////////
    //   source.modifyDepartmentAM.nameTextField.getObject().val(obj.name);
    //   //////////////////////////////////////////////////////////////////////////
    //   // 加载排序编号。
    //   //////////////////////////////////////////////////////////////////////////
    //   source.modifyDepartmentAM.orderTextField.getObject().val(obj.order);
    //   //////////////////////////////////////////////////////////////////////////
    //   // 加载预警。
    //   //////////////////////////////////////////////////////////////////////////
    //   if (Toolkit.isJSONObjectExistKey(obj, "warn_uuids")) {
    //     const warnUuidArray = obj.warn_uuids.split(";");
    //     for (let i = 0; i < warnUuidArray.length; i++) {
    //       const warnUuid = warnUuidArray[i];
    //       source.modifyDepartmentAM.formList.getObject().find("table").find("tbody").find("tr").find("td").find(":checkbox").each(function() {
    //         if ($(this).val() == warnUuid) {
    //           $(this).prop("checked", true);
    //           return false;
    //         }
    //       });
    //     }
    //   }
    //   //////////////////////////////////////////////////////////////////////////
    //   // 显示修改单位。
    //   //////////////////////////////////////////////////////////////////////////
    //   source.modifyDepartmentAM.show();
    // }
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
   * 冻结控件
   * @param name 冻结标记名称
   */
  frozenControl(name) {
    ////////////////////////////////////////////////////////////////////////////
    // 存入队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue.push(name);
    this.filterButton.getObject().attr("disabled", "disabled");
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
    }
  }
}
