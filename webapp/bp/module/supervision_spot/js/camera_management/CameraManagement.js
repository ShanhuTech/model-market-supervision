"hfr fgevpg";

class CameraManagement {
  /*
   * 窗体类型枚举
   */
  static WindowType = {
    "ADD_CAMERA_AM": "ADD_CAMERA_AM",
    "MODIFY_CAMERA_AM": "MODIFY_CAMERA_AM"
  };

  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头规则。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 地点规则。
    ////////////////////////////////////////////////////////////////////////////
    this.placeRule = ruleArray[1];
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头对象。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraObj = {};
    ////////////////////////////////////////////////////////////////////////////
    // 待删除数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    this.removeDataUuid = null;
    ////////////////////////////////////////////////////////////////////////////
    // 队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue = new Queue();
    ////////////////////////////////////////////////////////////////////////////
    // 获取摄像头的参数。
    ////////////////////////////////////////////////////////////////////////////
    this.getCameraParameter = {
      "last_check_result": null,
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
    // 筛选按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.filterButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 添加摄像头按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraButton = new JSControl("button");
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头表格。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination = new Pagination(this);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 添加摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM = new CameraAM(this, "添加摄像头", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 修改摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM = new CameraAM(this, "修改摄像头", 40);
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraFilter = new CameraFilter(this, "筛选", 40);
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
    // 添加摄像头按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraButton.setAttribute(
      {
        "class": "global_button_primary add_camera_button"
      }
    );
    this.addCameraButton.setContent("添加摄像头");
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头表格。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraTable.setAttribute(
      {
        "class": "global_table camera_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "full_name">地点</td>
        <td class = "name">名称</td>
        <td class = "last_camera_log_image_url">最新抓拍</td>
        <td class = "status">状态</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.cameraTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "5">尚无数据</td>
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
    this.pagination.setLimit(this.getCameraParameter.rows);
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
    // 添加摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.setClassSign("add_camera_am");
    ////////////////////////////////////////////////////////////////////////////
    // 修改摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.setClassSign("modify_camera_am");
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraFilter.setClassSign("camera_filter");
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
    // 添加摄像头按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraButton.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头表格。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 添加摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 修改摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 摄像头筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraFilter.generateCode();
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
    // 工具栏添加添加摄像头按钮。
    ////////////////////////////////////////////////////////////////////////////
    this.toolbar.getObject().append(this.addCameraButton.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加摄像头表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.cameraTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加分页。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.pagination.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加添加摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.addCameraAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加修改摄像头AM。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.modifyCameraAM.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加摄像头筛选。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.cameraFilter.getCode());
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
    // 注册添加摄像头按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraButton.getObject().off("click").on("click", null, this, this.addCameraButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 初始化添加摄像头AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化修改摄像头AM事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化摄像头筛选事件。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraFilter.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取摄像头的LoadStartEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getCameraLoadStartEvent").on("getCameraLoadStartEvent", this.getCameraLoadStartEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取摄像头的ErrorEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getCameraErrorEvent").on("getCameraErrorEvent", this.getCameraErrorEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取摄像头的TimeoutEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getCameraTimeoutEvent").on("getCameraTimeoutEvent", this.getCameraTimeoutEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取摄像头的ReadyStateChangeEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getCameraReadyStateChangeEvent").on("getCameraReadyStateChangeEvent", this.getCameraReadyStateChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加摄像头AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.addCameraAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加摄像头AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.addCameraAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加摄像头AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelOneSelect.getObject().off("change").on("change", null, this, this.addCameraAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加摄像头AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelTwoSelect.getObject().off("change").on("change", null, this, this.addCameraAMLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加摄像头AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelThreeSelect.getObject().off("change").on("change", null, this, this.addCameraAMLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册添加摄像头AM四级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelFourSelect.getObject().off("change").on("change", null, this, this.addCameraAMLevelFourSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改摄像头AM确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.formList.confirmButton.getObject().off("click").on("click", null, this, this.modifyCameraAMConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改摄像头AM取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.formList.cancelButton.getObject().off("click").on("click", null, this, this.modifyCameraAMCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改摄像头AM一级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelOneSelect.getObject().off("change").on("change", null, this, this.modifyCameraAMLevelOneSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改摄像头AM二级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelTwoSelect.getObject().off("change").on("change", null, this, this.modifyCameraAMLevelTwoSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改摄像头AM三级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelThreeSelect.getObject().off("change").on("change", null, this, this.modifyCameraAMLevelThreeSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册修改摄像头AM四级下拉框的change事件。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelFourSelect.getObject().off("change").on("change", null, this, this.modifyCameraAMLevelFourSelectChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册摄像头筛选确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraFilter.formList.confirmButton.getObject().off("click").on("click", null, this, this.cameraFilterConfirmButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册摄像头筛选取消按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.cameraFilter.formList.cancelButton.getObject().off("click").on("click", null, this, this.cameraFilterCancelButtonClickEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 获取摄像头LoadStartEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getCameraLoadStartEvent(event, xhr, xhrEvent, source) {
    source.frozenControl("getCamera"); // 冻结控件。
    source.waitMask.show(); // 显示等待遮蔽。
  }

  /**
   * 获取摄像头ErrorEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getCameraErrorEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取摄像头", "网络请求失败", window.location.href);
  }

  /**
   * 获取摄像头TimeoutEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getCameraTimeoutEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取摄像头", "网络请求超时", window.location.href);
  }

  /**
   * 获取摄像头ReadyStateChangeEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getCameraReadyStateChangeEvent(event, xhr, xhrEvent, source) {
    if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
      source.recoverControl("getCamera"); // 恢复控件。
      source.waitMask.hide(); // 隐藏等待遮蔽。
      //////////////////////////////////////////////////////////////////////////
      // 响应结果。
      //////////////////////////////////////////////////////////////////////////
      const responseResult = xhr.response;
      if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
        ////////////////////////////////////////////////////////////////////////
        // 清空对象。
        ////////////////////////////////////////////////////////////////////////
        delete source.cameraObj;
        source.cameraObj = {};
        ////////////////////////////////////////////////////////////////////////
        // 更新对象。
        ////////////////////////////////////////////////////////////////////////
        source.cameraObj["count"] = responseResult.content.count;
        source.cameraObj["array"] = new Array();
        for (let i = 0; i < responseResult.content.array.length; i++) {
          source.cameraObj.array.push(responseResult.content.array[i]);
        }
        ////////////////////////////////////////////////////////////////////////
        // 如果摄像头对象不为空，则添加表格数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.cameraObj.array.length) {
          let code = "";
          for (let i = 0; i < source.cameraObj.array.length; i++) {
            const camera = source.cameraObj.array[i];
            let lastCameraLogImageUrl = "暂无";
            let status = "尚未连接测试";
            ////////////////////////////////////////////////////////////////////
            // 根据显示要求优化数据。
            ////////////////////////////////////////////////////////////////////
            if (Toolkit.isJSONObjectExistKey(camera, "last_camera_log_image_url")) {
              lastCameraLogImageUrl = obj.last_camera_log_image_url;
            }
            if (Toolkit.stringEqualsIgnoreCase("SUCCESS", camera.last_check_result)) {
              status = "在线";
            } else if (Toolkit.stringEqualsIgnoreCase("INVALID_RTSP_URL", camera.last_check_result)) {
              status = "非法rtsp地址";
            } else if (Toolkit.stringEqualsIgnoreCase("CONNECT_TIMEOUT", camera.last_check_result)) {
              status = "连接超时";
            } else if (Toolkit.stringEqualsIgnoreCase("HOST_PORT_CLOSED", camera.last_check_result)) {
              status = "主机端口关闭";
            } else if (Toolkit.stringEqualsIgnoreCase("GET_STATUS_FAIL", camera.last_check_result)) {
              status = "获取状态失败";
            } else if (Toolkit.stringEqualsIgnoreCase("GET_AUTHORIZATION_FAIL", camera.last_check_result)) {
              status = "获取认证失败";
            } else if (Toolkit.stringEqualsIgnoreCase("INVALID_STATUS_CODE", camera.last_check_result)) {
              status = "非法状态码";
            } else if (Toolkit.stringEqualsIgnoreCase("PARSE_AUTH_FAIL", camera.last_check_result)) {
              status = "解析身份认证失败";
            } else if (Toolkit.stringEqualsIgnoreCase("AUTH_FAIL", camera.last_check_result)) {
              status = "身份认证失败";
            } else if (Toolkit.stringEqualsIgnoreCase("OTHER_ERROR", camera.last_check_result)) {
              status = "其他错误";
            }
            code += `
              <tr>
                <td class = "full_name">${camera.full_name}</td>
                <td class = "name">${camera.name}</td>
                <td class = "last_camera_image">${lastCameraLogImageUrl}</td>
                <td class = "status">${status}</td>
                <td class = "operation" data-uuid = "${camera.uuid}"><span class = "modify">修改</span><span class = "remove">删除</span></td>
              </tr>
            `;
          }
          source.cameraTable.getObject().find("tbody").html(code);
        } else {
          source.cameraTable.getObject().find("tbody").html(`
            <tr>
              <td class = "rowspan" colspan = "5">尚无数据</td>
            </tr>
          `);
        }
        ////////////////////////////////////////////////////////////////////////
        // 更新分页数据。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.setOffset(source.getCameraParameter.offset);
        source.pagination.setTotalCount(source.cameraObj.count);
        source.pagination.generateCode();
        source.pagination.getObject().replaceWith(source.pagination.getCode());
        ////////////////////////////////////////////////////////////////////////
        // 初始化分页事件。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.initEvent();
        ////////////////////////////////////////////////////////////////////////
        // 加载完成后注册事件。
        ////////////////////////////////////////////////////////////////////////
        source.cameraTable.getObject().find("tbody").find("tr").find(".operation").find(".modify").off("click").on("click", null, source, source.cameraTableModifyButtonClickEvent);
        source.cameraTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.cameraTableRemoveButtonClickEvent);
        ////////////////////////////////////////////////////////////////////////
        // 获取获取一级地点。
        ////////////////////////////////////////////////////////////////////////
        source.getPlaceByParentUuidLevel(0, 1, CameraManagement.WindowType.ADD_CAMERA_AM, null);
      } else {
        Error.redirect("../home/error.html", "获取摄像头", responseResult.attach, window.location.href);
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
    source.cameraFilter.show();
  }

  /**
   * 添加摄像头按钮click事件
   * @param event 事件对象
   */
  addCameraButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addCameraAM.show();
  }

  /**
   * 添加摄像头AM确认按钮click事件
   * @param event 事件对象
   */
  addCameraAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      //////////////////////////////////////////////////////////////////////////
      // 地址是必填项，所以默认地址为一级地点。
      //////////////////////////////////////////////////////////////////////////
      const levelSelect = {
        "name": "place_uuid",
        "value": source.addCameraAM.levelOneSelect.getObject().val(),
        "id": source.addCameraAM.levelOneSelect.getId(),
        "allow_null": false,
        "custom_error_message": null
      };
      if ((null != source.addCameraAM.levelTwoSelect.getObject().val()) && (0 < source.addCameraAM.levelTwoSelect.getObject().val().length)) {
        levelSelect.value = source.addCameraAM.levelTwoSelect.getObject().val();
        levelSelect.id = source.addCameraAM.levelTwoSelect.getId();
      }
      if ((null != source.addCameraAM.levelThreeSelect.getObject().val()) && (0 < source.addCameraAM.levelThreeSelect.getObject().val().length)) {
        levelSelect.value = source.addCameraAM.levelThreeSelect.getObject().val();
        levelSelect.id = source.addCameraAM.levelThreeSelect.getId();
      }
      if ((null != source.addCameraAM.levelFourSelect.getObject().val()) && (0 < source.addCameraAM.levelFourSelect.getObject().val().length)) {
        levelSelect.value = source.addCameraAM.levelFourSelect.getObject().val();
        levelSelect.id = source.addCameraAM.levelFourSelect.getId();
      }
      if ((null != source.addCameraAM.levelFiveSelect.getObject().val()) && (0 < source.addCameraAM.levelFiveSelect.getObject().val().length)) {
        levelSelect.value = source.addCameraAM.levelFiveSelect.getObject().val();
        levelSelect.id = source.addCameraAM.levelFiveSelect.getId();
      }
      parameterCheckArray.push(levelSelect);
    }
    parameterCheckArray.push({"name": "name", "value": source.addCameraAM.nameTextField.getObject().val(), "id": source.addCameraAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "url", "value": source.addCameraAM.urlTextField.getObject().val(), "id": source.addCameraAM.urlTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.cameraRule, "addCamera", parameterObj, source, function error(source, errorMessage) {
        source.addCameraAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 添加摄像头。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Camera/addCamera", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.addCameraAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.addCameraAM.frozenControl("addCamera"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.addCameraAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.addCameraAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.addCameraAM.recoverControl("addCamera"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.addCameraAM.formList.showResultInfo("success", "添加成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件。
            ////////////////////////////////////////////////////////////////////
            source.addCameraAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取摄像头。
            ////////////////////////////////////////////////////////////////////
            source.getCamera();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.addCameraAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.addCameraAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 添加摄像头AM取消按钮click事件
   * @param event 事件对象
   */
  addCameraAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.addCameraAM.hide();
  }

  /**
   * 添加摄像头AM一级下拉框确认change事件
   * @param event 事件对象
   */
  addCameraAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelTwoSelect.getObject().empty();
    source.addCameraAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelThreeSelect.getObject().empty();
    source.addCameraAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFourSelect.getObject().empty();
    source.addCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFiveSelect.getObject().empty();
    source.addCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 2, CameraManagement.WindowType.ADD_CAMERA_AM, null);
    }
  }

  /**
   * 添加摄像头AM二级下拉框确认change事件
   * @param event 事件对象
   */
  addCameraAMLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelThreeSelect.getObject().empty();
    source.addCameraAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFourSelect.getObject().empty();
    source.addCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFiveSelect.getObject().empty();
    source.addCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 3, CameraManagement.WindowType.ADD_CAMERA_AM, null);
    }
  }

  /**
   * 添加摄像头AM三级下拉框确认change事件
   * @param event 事件对象
   */
  addCameraAMLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFourSelect.getObject().empty();
    source.addCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFiveSelect.getObject().empty();
    source.addCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 4, CameraManagement.WindowType.ADD_CAMERA_AM, null);
    }
  }

  /**
   * 添加摄像头AM四级下拉框确认change事件
   * @param event 事件对象
   */
  addCameraAMLevelFourSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.addCameraAM.levelFiveSelect.getObject().empty();
    source.addCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取五级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 5, CameraManagement.WindowType.ADD_CAMERA_AM, null);
    }
  }

  /**
   * 修改摄像头AM确认按钮click事件
   * @param event 事件对象
   */
  modifyCameraAMConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    {
      //////////////////////////////////////////////////////////////////////////
      // 地址是必填项，所以默认地址为一级地点。
      //////////////////////////////////////////////////////////////////////////
      const levelSelect = {
        "name": "place_uuid",
        "value": source.modifyCameraAM.levelOneSelect.getObject().val(),
        "id": source.modifyCameraAM.levelOneSelect.getId(),
        "allow_null": false,
        "custom_error_message": null
      };
      if ((null != source.modifyCameraAM.levelTwoSelect.getObject().val()) && (0 < source.modifyCameraAM.levelTwoSelect.getObject().val().length)) {
        levelSelect.value = source.modifyCameraAM.levelTwoSelect.getObject().val();
        levelSelect.id = source.modifyCameraAM.levelTwoSelect.getId();
      }
      if ((null != source.modifyCameraAM.levelThreeSelect.getObject().val()) && (0 < source.modifyCameraAM.levelThreeSelect.getObject().val().length)) {
        levelSelect.value = source.modifyCameraAM.levelThreeSelect.getObject().val();
        levelSelect.id = source.modifyCameraAM.levelThreeSelect.getId();
      }
      if ((null != source.modifyCameraAM.levelFourSelect.getObject().val()) && (0 < source.modifyCameraAM.levelFourSelect.getObject().val().length)) {
        levelSelect.value = source.modifyCameraAM.levelFourSelect.getObject().val();
        levelSelect.id = source.modifyCameraAM.levelFourSelect.getId();
      }
      if ((null != source.modifyCameraAM.levelFiveSelect.getObject().val()) && (0 < source.modifyCameraAM.levelFiveSelect.getObject().val().length)) {
        levelSelect.value = source.modifyCameraAM.levelFiveSelect.getObject().val();
        levelSelect.id = source.modifyCameraAM.levelFiveSelect.getId();
      }
      parameterCheckArray.push(levelSelect);
    }
    parameterCheckArray.push({"name": "uuid", "value": source.modifyCameraAM.uuidTextField.getObject().val(), "id": source.modifyCameraAM.uuidTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "name", "value": source.modifyCameraAM.nameTextField.getObject().val(), "id": source.modifyCameraAM.nameTextField.getId(), "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "url", "value": source.modifyCameraAM.urlTextField.getObject().val(), "id": source.modifyCameraAM.urlTextField.getId(), "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.cameraRule, "modifyCamera", parameterObj, source, function error(source, errorMessage) {
        source.modifyCameraAM.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 修改摄像头。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Camera/modifyCamera", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.modifyCameraAM.formList.hideResultInfo(); // 隐藏结果信息。
        source.modifyCameraAM.frozenControl("modifyCamera"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.modifyCameraAM.formList.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.modifyCameraAM.formList.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.modifyCameraAM.recoverControl("modifyCamera"); // 恢复控件。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 显示成功信息。
            ////////////////////////////////////////////////////////////////////
            source.modifyCameraAM.formList.showResultInfo("success", "修改成功");
            ////////////////////////////////////////////////////////////////////
            // 重置控件（修改功能在成功修改之后，不需要重置控件内容，这里不用但
            // 做保留）。
            ////////////////////////////////////////////////////////////////////
            // source.modifyCameraAM.resetControl();
            ////////////////////////////////////////////////////////////////////
            // 获取摄像头。
            ////////////////////////////////////////////////////////////////////
            source.getCamera();
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.modifyCameraAM.formList.showResultInfo("error", responseResult.attach);
          } else {
            source.modifyCameraAM.formList.showResultInfo("error", "操作异常");
          }
        }
      }
    );
  }

  /**
   * 修改摄像头AM取消按钮click事件
   * @param event 事件对象
   */
  modifyCameraAMCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.modifyCameraAM.hide();
  }

  /**
   * 修改摄像头AM一级下拉框确认change事件
   * @param event 事件对象
   */
  modifyCameraAMLevelOneSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelTwoSelect.getObject().empty();
    source.modifyCameraAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelThreeSelect.getObject().empty();
    source.modifyCameraAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFourSelect.getObject().empty();
    source.modifyCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFiveSelect.getObject().empty();
    source.modifyCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取二级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 2, CameraManagement.WindowType.MODIFY_CAMERA_AM, null);
    }
  }

  /**
   * 修改摄像头AM二级下拉框确认change事件
   * @param event 事件对象
   */
  modifyCameraAMLevelTwoSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelThreeSelect.getObject().empty();
    source.modifyCameraAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFourSelect.getObject().empty();
    source.modifyCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFiveSelect.getObject().empty();
    source.modifyCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取三级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 3, CameraManagement.WindowType.MODIFY_CAMERA_AM, null);
    }
  }

  /**
   * 修改摄像头AM三级下拉框确认change事件
   * @param event 事件对象
   */
  modifyCameraAMLevelThreeSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFourSelect.getObject().empty();
    source.modifyCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFiveSelect.getObject().empty();
    source.modifyCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取四级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 4, CameraManagement.WindowType.MODIFY_CAMERA_AM, null);
    }
  }

  /**
   * 修改摄像头AM四级下拉框确认change事件
   * @param event 事件对象
   */
  modifyCameraAMLevelFourSelectChangeEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    source.modifyCameraAM.levelFiveSelect.getObject().empty();
    source.modifyCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    ////////////////////////////////////////////////////////////////////////////
    // 获取获取五级地点。
    ////////////////////////////////////////////////////////////////////////////
    const selectVal = $(this).val();
    if ((null != selectVal) && (0 < selectVal.length)) {
      source.getPlaceByParentUuidLevel(selectVal, 5, CameraManagement.WindowType.MODIFY_CAMERA_AM, null);
    }
  }

  /**
   * 摄像头筛选确认按钮click事件
   * @param event 事件对象
   */
  cameraFilterConfirmButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 校验数据之前，先要隐藏之前的提示。
    ////////////////////////////////////////////////////////////////////////////
    source.cameraFilter.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    if (0 < source.cameraFilter.statusSelect.getObject().val().length) {
      parameterCheckArray.push({"name": "last_check_result", "value": source.cameraFilter.statusSelect.getObject().val(), "id": source.cameraFilter.statusSelect.getId(), "allow_null": true, "custom_error_message": null});
      source.getCameraParameter.status = source.cameraFilter.statusSelect.getObject().val();
    } else {
      source.getCameraParameter.status = null;
    }
    source.getCameraParameter.offset = 0;
    parameterCheckArray.push({"name": "offset", "value": source.getCameraParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": source.getCameraParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.cameraRule, "getCamera", parameterObj, source, function error(source, errorMessage) {
        source.cameraFilter.formList.showPrompt(parameterObj.id, errorMessage);
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
    // 获取摄像头。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Camera/getCamera", parameterArray, source, "getCamera"); 
  }

  /**
   * 摄像头筛选取消按钮click事件
   * @param event 事件对象
   */
  cameraFilterCancelButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.cameraFilter.hide();
  }

  /**
   * 分页按钮点击事件
   * @param source 源对象
   */
  paginationButtonClickEvent(source) {
    source.getCameraParameter.offset = this.dataOffset;
    source.getCamera();
  }

  /**
   * 摄像头表格修改按钮click事件
   * @param event 事件对象
   */
  cameraTableModifyButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待修改数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const uuid = $(this).parent().attr("data-uuid");
    ////////////////////////////////////////////////////////////////////////////
    // 从摄像头对象中获取该uuid对应的数据。
    ////////////////////////////////////////////////////////////////////////////
    let obj = null;
    for (let i = 0; i < source.cameraObj.array.length; i++) {
      if (uuid == source.cameraObj.array[i].uuid) {
        obj = source.cameraObj.array[i];
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
      source.modifyCameraAM.uuidTextField.getObject().val(obj.uuid);
      //////////////////////////////////////////////////////////////////////////
      // 加载级别下拉框等级。
      //////////////////////////////////////////////////////////////////////////
      if (Toolkit.isJSONObjectExistKey(obj, "parent_array")) {
        if (0 >= obj.parent_array.length) {
          source.getPlaceByParentUuidLevel(0, 1, CameraManagement.WindowType.MODIFY_CAMERA_AM, obj.place_uuid);
        } else {
          for (let i = 0; i < obj.parent_array.length; i++) {
            const parent = obj.parent_array[i];
            source.getPlaceByParentUuidLevel(parent.parent_uuid, parent.level, CameraManagement.WindowType.MODIFY_CAMERA_AM, parent.uuid);
          }
        }
      }
      //////////////////////////////////////////////////////////////////////////
      // 加载名称。
      //////////////////////////////////////////////////////////////////////////
      source.modifyCameraAM.nameTextField.getObject().val(obj.name);
      //////////////////////////////////////////////////////////////////////////
      // 加载地址。
      //////////////////////////////////////////////////////////////////////////
      source.modifyCameraAM.urlTextField.getObject().val(obj.url);
      //////////////////////////////////////////////////////////////////////////
      // 显示修改摄像头。
      //////////////////////////////////////////////////////////////////////////
      source.modifyCameraAM.show();
    }
  }

  /**
   * 摄像头表格删除按钮click事件
   * @param event 事件对象
   */
  cameraTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除摄像头吗？");
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
      if (!Module.checkParameter(source.cameraRule, "removeCamera", parameterObj, source, function error(source, errorMessage) {
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
    // 删除摄像头。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Camera/removeCamera", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removeCamera"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removeCamera"); // 恢复控件。
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
            // 获取摄像头。
            ////////////////////////////////////////////////////////////////////
            source.getCamera();
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
   * 获取摄像头
   */
  getCamera() {
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    if (null != this.getCameraParameter.last_check_result) {
      parameterCheckArray.push({"name": "last_check_result", "value": this.getCameraParameter.last_check_result, "id": this.cameraFilter.statusSelect.getId(), "allow_null": true, "custom_error_message": null});
    }
    parameterCheckArray.push({"name": "offset", "value": this.getCameraParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": this.getCameraParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(this.cameraRule, "getCamera", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取摄像头", errorMessage, window.location.href);
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
    // 获取摄像头。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Camera/getCamera", parameterArray, this, "getCamera");
  }

  /**
   * 根据父级的uuid和级别获取地点
   * @param parentUuid 父级地点的uuid
   * @param level 级别
   * @param window WindowType枚举的窗体类型
   * @param defaultSelect 默认选项
   */
  getPlaceByParentUuidLevel(parentUuid, level, windowType, defaultSelect) {
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
      if (!Module.checkParameter(this.placeRule, "getPlace", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取地点", errorMessage, window.location.href);
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
    // 获取地点。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Place/getPlace", parameterArray, this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getPlace"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取地点", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取地点", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getPlace"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getPlace");
            if (1 == level) {
              if (CameraManagement.WindowType.ADD_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addCameraAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddCameraAMLevelOneSelectData(responseResult.content.array);
              } else if (CameraManagement.WindowType.MODIFY_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyCameraAM一级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyCameraAMLevelOneSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (2 == level) {
              if (CameraManagement.WindowType.ADD_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addCameraAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddCameraAMLevelTwoSelectData(responseResult.content.array);
              } else if (CameraManagement.WindowType.MODIFY_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyCameraAM二级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyCameraAMLevelTwoSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (3 == level) {
              if (CameraManagement.WindowType.ADD_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addCameraAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddCameraAMLevelThreeSelectData(responseResult.content.array);
              } else if (CameraManagement.WindowType.MODIFY_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyCameraAM三级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyCameraAMLevelThreeSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (4 == level) {
              if (CameraManagement.WindowType.ADD_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addCameraAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddCameraAMLevelFourSelectData(responseResult.content.array);
              } else if (CameraManagement.WindowType.MODIFY_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyCameraAM四级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyCameraAMLevelFourSelectData(responseResult.content.array, defaultSelect);
              }
            } else if (5 == level) {
              if (CameraManagement.WindowType.ADD_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定addCameraAM五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindAddCameraAMLevelFiveSelectData(responseResult.content.array);
              } else if (CameraManagement.WindowType.MODIFY_CAMERA_AM == windowType) {
                ////////////////////////////////////////////////////////////////
                // 绑定modifyCameraAM五级下拉框数据。
                ////////////////////////////////////////////////////////////////
                source.bindModifyCameraAMLevelFiveSelectData(responseResult.content.array, defaultSelect);
              }
            }
          } else {
            Error.redirect("../home/error.html", "获取地点", responseResult.attach, window.location.href);
          }
        }
      }
    );
  }

  /**
   * 绑定addCameraAM一级下拉框数据
   * @param array 数组
   */
  bindAddCameraAMLevelOneSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelOneSelect.getObject().empty();
    this.addCameraAM.levelOneSelect.getObject().attr("disabled", "disabled");
    this.addCameraAM.levelOneSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addCameraAM一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addCameraAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addCameraAM一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addCameraAM.levelOneSelect.getObject().children("option").length) {
      this.addCameraAM.levelOneSelect.getObject().removeAttr("disabled");
    } else {
      this.addCameraAM.levelOneSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addCameraAM二级下拉框数据
   * @param array 数组
   */
  bindAddCameraAMLevelTwoSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelTwoSelect.getObject().empty();
    this.addCameraAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    this.addCameraAM.levelTwoSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addCameraAM二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addCameraAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addCameraAM二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addCameraAM.levelTwoSelect.getObject().children("option").length) {
      this.addCameraAM.levelTwoSelect.getObject().removeAttr("disabled");
    } else {
      this.addCameraAM.levelTwoSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addCameraAM三级下拉框数据
   * @param array 数组
   */
  bindAddCameraAMLevelThreeSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelThreeSelect.getObject().empty();
    this.addCameraAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    this.addCameraAM.levelThreeSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addCameraAM三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addCameraAM.levelThreeSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addCameraAM三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addCameraAM.levelThreeSelect.getObject().children("option").length) {
      this.addCameraAM.levelThreeSelect.getObject().removeAttr("disabled");
    } else {
      this.addCameraAM.levelThreeSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addCameraAM四级下拉框数据
   * @param array 数组
   */
  bindAddCameraAMLevelFourSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelFourSelect.getObject().empty();
    this.addCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    this.addCameraAM.levelFourSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addCameraAM四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addCameraAM.levelFourSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addCameraAM四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addCameraAM.levelFourSelect.getObject().children("option").length) {
      this.addCameraAM.levelFourSelect.getObject().removeAttr("disabled");
    } else {
      this.addCameraAM.levelFourSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定addCameraAM五级下拉框数据
   * @param array 数组
   */
  bindAddCameraAMLevelFiveSelectData(array) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空addCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.addCameraAM.levelFiveSelect.getObject().empty();
    this.addCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    this.addCameraAM.levelFiveSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充addCameraAM五级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      this.addCameraAM.levelFiveSelect.getObject().append(`<option value = "${m.uuid}">${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据addCameraAM五级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.addCameraAM.levelFiveSelect.getObject().children("option").length) {
      this.addCameraAM.levelFiveSelect.getObject().removeAttr("disabled");
    } else {
      this.addCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyCameraAM一级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyCameraAMLevelOneSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM一级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelOneSelect.getObject().empty();
    this.modifyCameraAM.levelOneSelect.getObject().attr("disabled", "disabled");
    this.modifyCameraAM.levelOneSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyCameraAM一级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyCameraAM.levelOneSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyCameraAM一级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyCameraAM.levelOneSelect.getObject().children("option").length) {
      this.modifyCameraAM.levelOneSelect.getObject().removeAttr("disabled");
      this.modifyCameraAM.levelOneSelect.getObject().trigger("change");
    } else {
      this.modifyCameraAM.levelOneSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyCameraAM二级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyCameraAMLevelTwoSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM二级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelTwoSelect.getObject().empty();
    this.modifyCameraAM.levelTwoSelect.getObject().attr("disabled", "disabled");
    this.modifyCameraAM.levelTwoSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyCameraAM二级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyCameraAM.levelTwoSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyCameraAM二级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyCameraAM.levelTwoSelect.getObject().children("option").length) {
      this.modifyCameraAM.levelTwoSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyCameraAM.levelTwoSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyCameraAM三级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyCameraAMLevelThreeSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM三级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelThreeSelect.getObject().empty();
    this.modifyCameraAM.levelThreeSelect.getObject().attr("disabled", "disabled");
    this.modifyCameraAM.levelThreeSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyCameraAM三级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyCameraAM.levelThreeSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyCameraAM三级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyCameraAM.levelThreeSelect.getObject().children("option").length) {
      this.modifyCameraAM.levelThreeSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyCameraAM.levelThreeSelect.getObject().empty(); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyCameraAM四级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyCameraAMLevelFourSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM四级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelFourSelect.getObject().empty();
    this.modifyCameraAM.levelFourSelect.getObject().attr("disabled", "disabled");
    this.modifyCameraAM.levelFourSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyCameraAM四级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyCameraAM.levelFourSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyCameraAM四级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyCameraAM.levelFourSelect.getObject().children("option").length) {
      this.modifyCameraAM.levelFourSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyCameraAM.levelFourSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
    }
  }

  /**
   * 绑定modifyCameraAM五级下拉框数据
   * @param array 数组
   * @param defaultSelect 默认选项
   */
  bindModifyCameraAMLevelFiveSelectData(array, defaultSelect) {
    ////////////////////////////////////////////////////////////////////////////
    // 清空modifyCameraAM五级下拉框的数据并设置状态。
    ////////////////////////////////////////////////////////////////////////////
    this.modifyCameraAM.levelFiveSelect.getObject().empty();
    this.modifyCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled");
    this.modifyCameraAM.levelFiveSelect.getObject().append(`<option value = "">请选择</option>`); // 特殊处理：如果不做选择，默认值为上级下拉框。
    ////////////////////////////////////////////////////////////////////////////
    // 填充modifyCameraAM五级下拉框数据。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < array.length; i++) {
      const m = array[i];
      let selectCode = "";
      if (null != defaultSelect) {
        if (Toolkit.stringEqualsIgnoreCase(m.uuid, defaultSelect)) {
          selectCode = ` selected = "selected"`;
        }
      }
      this.modifyCameraAM.levelFiveSelect.getObject().append(`<option value = "${m.uuid}"${selectCode}>${m.name}</option>`);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 根据modifyCameraAM五级下拉框的数据有无设置状态。
    ////////////////////////////////////////////////////////////////////////////
    if (0 < this.modifyCameraAM.levelFiveSelect.getObject().children("option").length) {
      this.modifyCameraAM.levelFiveSelect.getObject().removeAttr("disabled");
    } else {
      this.modifyCameraAM.levelFiveSelect.getObject().attr("disabled", "disabled"); // 特殊处理：如果不做选择，默认值为上级下拉框。
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
    this.addCameraButton.getObject().attr("disabled", "disabled");
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
      this.addCameraButton.getObject().removeAttr("disabled");
    }
  }
}
