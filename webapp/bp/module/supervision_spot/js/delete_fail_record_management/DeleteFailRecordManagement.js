"use strict";

class DeleteFailRecordManagement {
  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 存储文件删除失败记录规则。
    ////////////////////////////////////////////////////////////////////////////
    this.logRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 存储文件删除失败记录对象。
    ////////////////////////////////////////////////////////////////////////////
    this.logObj = {};
    ////////////////////////////////////////////////////////////////////////////
    // 待删除数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    this.removeDataUuid = null;
    ////////////////////////////////////////////////////////////////////////////
    // 队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue = new Queue();
    ////////////////////////////////////////////////////////////////////////////
    // 获取存储文件删除失败记录的参数。
    ////////////////////////////////////////////////////////////////////////////
    this.getStorageFileDeleteFailRecordParameter = {
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
    // 存储文件删除失败记录表格。
    ////////////////////////////////////////////////////////////////////////////
    this.logTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination = new Pagination(this);
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
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
    // 存储文件删除失败记录表格。
    ////////////////////////////////////////////////////////////////////////////
    this.logTable.setAttribute(
      {
        "class": "global_table log_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "url">路径</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.logTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "2">尚无数据</td>
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
    this.pagination.setLimit(this.getStorageFileDeleteFailRecordParameter.rows);
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
    // 存储文件删除失败记录表格。
    ////////////////////////////////////////////////////////////////////////////
    this.logTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 分页。
    ////////////////////////////////////////////////////////////////////////////
    this.pagination.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
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
    // 容器添加存储文件删除失败记录表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.logTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加分页。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.pagination.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
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
    // 初始化删除确认窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.initEvent();
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取存储文件删除失败记录的LoadStartEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getStorageFileDeleteFailRecordLoadStartEvent").on("getStorageFileDeleteFailRecordLoadStartEvent", this.getStorageFileDeleteFailRecordLoadStartEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取存储文件删除失败记录的ErrorEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getStorageFileDeleteFailRecordErrorEvent").on("getStorageFileDeleteFailRecordErrorEvent", this.getStorageFileDeleteFailRecordErrorEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取存储文件删除失败记录的TimeoutEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getStorageFileDeleteFailRecordTimeoutEvent").on("getStorageFileDeleteFailRecordTimeoutEvent", this.getStorageFileDeleteFailRecordTimeoutEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册获取存储文件删除失败记录的ReadyStateChangeEvent事件。
    ////////////////////////////////////////////////////////////////////////////
    $(document).off("getStorageFileDeleteFailRecordReadyStateChangeEvent").on("getStorageFileDeleteFailRecordReadyStateChangeEvent", this.getStorageFileDeleteFailRecordReadyStateChangeEvent);
    ////////////////////////////////////////////////////////////////////////////
    // 注册删除确认窗确认按钮的click事件。
    ////////////////////////////////////////////////////////////////////////////
    this.removeConfirmWindow.confirmButton.getObject().off("click").on("click", null, this, this.removeConfirmWindowConfirmButtonClickEvent);
  }

  /**
   * 获取存储文件删除失败记录LoadStartEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getStorageFileDeleteFailRecordLoadStartEvent(event, xhr, xhrEvent, source) {
    source.frozenControl("getStorageFileDeleteFailRecord"); // 冻结控件。
    source.waitMask.show(); // 显示等待遮蔽。
  }

  /**
   * 获取存储文件删除失败记录ErrorEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getStorageFileDeleteFailRecordErrorEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取存储文件删除失败记录", "网络请求失败", window.location.href);
  }

  /**
   * 获取存储文件删除失败记录TimeoutEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getStorageFileDeleteFailRecordTimeoutEvent(event, xhr, xhrEvent, source) {
    Error.redirect("../home/error.html", "获取存储文件删除失败记录", "网络请求超时", window.location.href);
  }

  /**
   * 获取存储文件删除失败记录ReadyStateChangeEvent事件
   *
   * @param event 事件对象
   * @param xhr xhr对象
   * @param xhrEvent xhr事件
   * @param source 调用源
   */
  getStorageFileDeleteFailRecordReadyStateChangeEvent(event, xhr, xhrEvent, source) {
    if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
      source.recoverControl("getStorageFileDeleteFailRecord"); // 恢复控件。
      source.waitMask.hide(); // 隐藏等待遮蔽。
      //////////////////////////////////////////////////////////////////////////
      // 响应结果。
      //////////////////////////////////////////////////////////////////////////
      const responseResult = xhr.response;
      if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
        ////////////////////////////////////////////////////////////////////////
        // 清空对象。
        ////////////////////////////////////////////////////////////////////////
        delete source.logObj;
        source.logObj = {};
        ////////////////////////////////////////////////////////////////////////
        // 更新对象。
        ////////////////////////////////////////////////////////////////////////
        source.logObj["count"] = responseResult.content.count;
        source.logObj["array"] = new Array();
        for (let i = 0; i < responseResult.content.array.length; i++) {
          source.logObj.array.push(responseResult.content.array[i]);
        }
        ////////////////////////////////////////////////////////////////////////
        // 如果存储文件删除失败记录对象不为空，则添加表格数据。
        ////////////////////////////////////////////////////////////////////////
        if (0 < source.logObj.array.length) {
          let code = "";
          for (let i = 0; i < source.logObj.array.length; i++) {
            const log = source.logObj.array[i];
            code += `
              <tr>
                <td class = "url">${log.url}</td>
                <td class = "operation" data-uuid = "${log.uuid}"><span class = "remove">删除</span></td>
              </tr>
            `;
          }
          source.logTable.getObject().find("tbody").html(code);
        } else {
          source.logTable.getObject().find("tbody").html(`
            <tr>
              <td class = "rowspan" colspan = "2">尚无数据</td>
            </tr>
          `);
        }
        ////////////////////////////////////////////////////////////////////////
        // 更新分页数据。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.setOffset(source.getStorageFileDeleteFailRecordParameter.offset);
        source.pagination.setTotalCount(source.logObj.count);
        source.pagination.generateCode();
        source.pagination.getObject().replaceWith(source.pagination.getCode());
        ////////////////////////////////////////////////////////////////////////
        // 初始化分页事件。
        ////////////////////////////////////////////////////////////////////////
        source.pagination.initEvent();
        ////////////////////////////////////////////////////////////////////////
        // 加载完成后注册事件。
        ////////////////////////////////////////////////////////////////////////
        source.logTable.getObject().find("tbody").find("tr").find(".operation").find(".remove").off("click").on("click", null, source, source.logTableRemoveButtonClickEvent);
      } else {
        Error.redirect("../home/error.html", "获取存储文件删除失败记录", responseResult.attach, window.location.href);
      }
    }
  }

  /**
   * 分页按钮点击事件
   * @param source 源对象
   */
  paginationButtonClickEvent(source) {
    source.getStorageFileDeleteFailRecordParameter.offset = this.dataOffset;
    source.getStorageFileDeleteFailRecord();
  }

  /**
   * 存储文件删除失败记录表格删除按钮click事件
   * @param event 事件对象
   */
  logTableRemoveButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    source.removeDataUuid = $(this).parent().attr("data-uuid");
    source.removeConfirmWindow.show("确认要删除存储文件删除失败记录吗？");
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
      if (!Module.checkParameter(source.logRule, "removeStorageFileDeleteFailRecord", parameterObj, source, function error(source, errorMessage) {
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
    // 删除存储文件删除失败记录。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.StorageFileDeleteFailRecord/removeStorageFileDeleteFailRecord", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.removeConfirmWindow.hideResultInfo(); // 隐藏结果信息。
        source.removeConfirmWindow.frozenControl("removeStorageFileDeleteFailRecord"); // 冻结控件。
      },
      function error(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求失败");
      },
      function timeout(xhr, xhrEvent, source) {
        source.removeConfirmWindow.showResultInfo("error", "网络请求超时");
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.removeConfirmWindow.recoverControl("removeStorageFileDeleteFailRecord"); // 恢复控件。
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
            // 获取存储文件删除失败记录。
            ////////////////////////////////////////////////////////////////////
            source.getStorageFileDeleteFailRecord();
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
   * 获取存储文件删除失败记录
   */
  getStorageFileDeleteFailRecord() {
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "offset", "value": this.getStorageFileDeleteFailRecordParameter.offset, "id": "0", "allow_null": false, "custom_error_message": null});
    parameterCheckArray.push({"name": "rows", "value": this.getStorageFileDeleteFailRecordParameter.rows, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(this.logRule, "getStorageFileDeleteFailRecord", parameterObj, this, function error(source, errorMessage) {
        Error.redirect("../home/error.html", "获取存储文件删除失败记录", errorMessage, window.location.href);
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
    // 获取存储文件删除失败记录。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.StorageFileDeleteFailRecord/getStorageFileDeleteFailRecord", parameterArray, this, "getStorageFileDeleteFailRecord");
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
    }
  }
}
