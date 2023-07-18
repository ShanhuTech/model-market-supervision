"use strict";

class ReportTemplate {
  /**
   * 构造函数
   *
   * @param ruleArray 规则数组
   */
  constructor(ruleArray) {
    ////////////////////////////////////////////////////////////////////////////
    // 报告模板规则。
    ////////////////////////////////////////////////////////////////////////////
    this.reportTemplateRule = ruleArray[0];
    ////////////////////////////////////////////////////////////////////////////
    // 模板文件名称数组。
    ////////////////////////////////////////////////////////////////////////////
    this.templateFileNameArray = new Array();
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
    // 报告模板表格。
    ////////////////////////////////////////////////////////////////////////////
    this.reportTemplateTable = new JSControl("table");
    ////////////////////////////////////////////////////////////////////////////
    // 提示框。
    ////////////////////////////////////////////////////////////////////////////
    this.prompt = new Prompt();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask = new WaitMask();
    ////////////////////////////////////////////////////////////////////////////
    // 容器。
    ////////////////////////////////////////////////////////////////////////////
    this.container.setAttribute(
      {
        "class": "global_scroll global_scroll_dark container"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 报告模板表格。
    ////////////////////////////////////////////////////////////////////////////
    this.reportTemplateTable.setAttribute(
      {
        "class": "global_table report_template_table"
      }
    );
    const tableHead = `
      <tr>
        <td class = "name">模板名称</td>
        <td class = "operation">操作</td>
      </tr>
    `;
    this.reportTemplateTable.setContent(`
      <thead>${tableHead}</thead>
      <tbody>
        <tr>
          <td class = "rowspan" colspan = "2">尚无数据</td>
        </tr>
      </tbody>
    `);
    ////////////////////////////////////////////////////////////////////////////
    // 提示框。
    ////////////////////////////////////////////////////////////////////////////
    this.prompt.setAttribute(
      {
        "class": "global_prompt"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.setAttribute(
      {
        "class": "global_wait_mask"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 容器。
    ////////////////////////////////////////////////////////////////////////////
    this.container.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 报告模板表格。
    ////////////////////////////////////////////////////////////////////////////
    this.reportTemplateTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 提示框。
    ////////////////////////////////////////////////////////////////////////////
    this.prompt.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.waitMask.generateCode();
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
    // 容器添加报告模板表格。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.reportTemplateTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待提示框。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.prompt.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 容器添加等待遮蔽。
    ////////////////////////////////////////////////////////////////////////////
    this.container.getObject().append(this.waitMask.getCode());
  }

  /**
   * 初始化事件
   */
  initEvent() {
  }

  /**
   * 报告模板表格下载按钮click事件
   * @param event 事件对象
   */
  reportTemplateTableDownloadButtonClickEvent(event) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取调用源。
    ////////////////////////////////////////////////////////////////////////////
    const source = event.data;
    ////////////////////////////////////////////////////////////////////////////
    // 获取待下载数据的uuid。
    ////////////////////////////////////////////////////////////////////////////
    const key = $(this).parent().attr("data-key");
    ////////////////////////////////////////////////////////////////////////////
    // 参数检查数组。
    ////////////////////////////////////////////////////////////////////////////
    const parameterCheckArray = new Array();
    parameterCheckArray.push({"name": "key", "value": key, "id": "0", "allow_null": false, "custom_error_message": null});
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数。
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < parameterCheckArray.length; i++) {
      const parameterObj = parameterCheckArray[i];
      if (!Module.checkParameter(source.reportTemplateRule, "getTemplateFile", parameterObj, source, function error(source, errorMessage) {
        source.prompt.show("error", errorMessage, 500);
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
    // 获取模板文件。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Report/getTemplateFile", parameterArray, source,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getTemplateFile"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取模板文件", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取模板文件", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getTemplateFile"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            const fileName = responseResult.content.file_name;
            const fileType = fileName.substring(fileName.indexOf(".") + 1);
            const data = "data:application/octet-stream;base64," + responseResult.content.data;
            const blob = Toolkit.base64ToBlob(data, fileType);
            Toolkit.downloadExportFile(blob, fileName);
          } else if (Toolkit.stringEqualsIgnoreCase("ERROR", responseResult.status)) {
            source.prompt.show("error", responseResult.attach, 500);
          } else {
            Error.redirect("../home/error.html", "获取模板文件", responseResult.attach, window.location.href);
          }
        }
      }
    );
  }

  /**
   * 获取模板文件名称
   */
  getTemplateFileName() {
    ////////////////////////////////////////////////////////////////////////////
    // 获取模板文件名称列表。
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, Network.ResponseType.JSON, [{"Content-Type": "application/x-www-form-urlencoded"}],
      Configure.getServerUrl() + "/module/supervision.spot.Report/getTemplateFileName", [{"Account-Token": AccountSecurity.getItem("account_token")}], this,
      function loadStart(xhr, xhrEvent, source) {
        source.frozenControl("getTemplateFileName"); // 冻结控件。
        source.waitMask.show(); // 显示等待遮蔽。
      },
      function error(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取报告模板", "网络请求失败", window.location.href);
      },
      function timeout(xhr, xhrEvent, source) {
        Error.redirect("../home/error.html", "获取报告模板", "网络请求超时", window.location.href);
      },
      function readyStateChange(xhr, xhrEvent, source) {
        if ((XMLHttpRequest.DONE == xhr.readyState) && (200 == xhr.status)) {
          source.recoverControl("getTemplateFileName"); // 恢复控件。
          source.waitMask.hide(); // 隐藏等待遮蔽。
          //////////////////////////////////////////////////////////////////////
          // 响应结果。
          //////////////////////////////////////////////////////////////////////
          const responseResult = xhr.response;
          if (Toolkit.stringEqualsIgnoreCase("SUCCESS", responseResult.status)) {
            ////////////////////////////////////////////////////////////////////
            // 清空数组。
            ////////////////////////////////////////////////////////////////////
            source.templateFileNameArray.splice(0, source.templateFileNameArray.length);
            ////////////////////////////////////////////////////////////////////
            // 更新数组。
            ////////////////////////////////////////////////////////////////////
            for (let i = 0; i < responseResult.content.array.length; i++) {
              source.templateFileNameArray.push(responseResult.content.array[i]);
            }
            ////////////////////////////////////////////////////////////////////
            // 恢复控件。
            ////////////////////////////////////////////////////////////////////
            source.recoverControl("getTemplateFileName");
            ////////////////////////////////////////////////////////////////////
            // 如果报告模板数组不为空，则添加表格数据。
            ////////////////////////////////////////////////////////////////////
            if (0 < source.templateFileNameArray.length) {
              let code = "";
              for (let i = 0; i < source.templateFileNameArray.length; i++) {
                const templateFileName = source.templateFileNameArray[i];
                code += `
                  <tr>
                    <td class = "name">${templateFileName.short_name}</td>
                    <td class = "operation" data-key = "${templateFileName.key}"><span class = "download">下载模板</span></td>
                  </tr>
                `;
              }
              source.reportTemplateTable.getObject().find("tbody").html(code);
            } else {
              source.reportTemplateTable.getObject().find("tbody").html(`
                <tr>
                  <td class = "rowspan" colspan = "2">尚无数据</td>
                </tr>
              `);
            }
            ////////////////////////////////////////////////////////////////////
            // 加载完成后注册事件。
            ////////////////////////////////////////////////////////////////////
            source.reportTemplateTable.getObject().find("tbody").find("tr").find(".operation").find(".download").off("click").on("click", null, source, source.reportTemplateTableDownloadButtonClickEvent);
          } else {
            Error.redirect("../home/error.html", "获取报告模板", responseResult.attach, window.location.href);
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
