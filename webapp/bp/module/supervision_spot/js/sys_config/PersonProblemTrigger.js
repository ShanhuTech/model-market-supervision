"use strict";

class PersonProblemTrigger {
  /**
   * 构造函数
   *
   * @param source 调用源
   * @param windowTitle 窗口标题
   * @param windowWidth 窗口宽度
   */
  constructor(source, windowTitle, windowWidth) {
    ////////////////////////////////////////////////////////////////////////////
    // 调用源。
    ////////////////////////////////////////////////////////////////////////////
    this.source = source;
    ////////////////////////////////////////////////////////////////////////////
    // 赋值窗口标题。
    ////////////////////////////////////////////////////////////////////////////
    this.windowTitle = windowTitle;
    ////////////////////////////////////////////////////////////////////////////
    // 赋值窗口宽度。
    ////////////////////////////////////////////////////////////////////////////
    this.windowWidth = windowWidth;
    ////////////////////////////////////////////////////////////////////////////
    // 窗口class标记。
    ////////////////////////////////////////////////////////////////////////////
    this.windowClassSign = "";
    ////////////////////////////////////////////////////////////////////////////
    // 队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue = new Queue();
  }

  /**
   * 设置窗口class标记
   */
  setClassSign(classSign) {
    this.windowClassSign = classSign;
  }

  /**
   * 生成代码
   */
  generateCode() {
    ////////////////////////////////////////////////////////////////////////////
    // 个人问题触发报告次数标签。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountLabel = new JSControl("label");
    ////////////////////////////////////////////////////////////////////////////
    // 个人问题触发报告次数输入框。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountTextField = new JSControl("input");
    ////////////////////////////////////////////////////////////////////////////
    // 表单列表。
    ////////////////////////////////////////////////////////////////////////////
    this.formList = new FormList();
    ////////////////////////////////////////////////////////////////////////////
    // 弹窗。
    ////////////////////////////////////////////////////////////////////////////
    this.popupWindow = new PopupWindow(this, this.windowTitle, this.windowWidth, this.popupWindowHideCallback);
    ////////////////////////////////////////////////////////////////////////////
    // 个人问题触发报告次数标签。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountLabel.setAttribute(
      {
        "class": "global_label"
      }
    );
    this.personProblemTriggerReportCountLabel.setContent("个人问题触发报告次数");
    ////////////////////////////////////////////////////////////////////////////
    // 个人问题触发报告次数输入框。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountTextField.setAttribute(
      {
        "type": "text",
        "class": "global_input",
        "placeholder": Module.getMethodParameterRuleObj(this.source.sysConfigRule, "modifySystemConfig", "person_problem_trigger_report_count").format_prompt,
        "style": "width: -webkit-fill-available;"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 表单列表。
    ////////////////////////////////////////////////////////////////////////////
    this.formList.setAttribute(
      {
        "class": "global_form_list"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 弹窗。
    ////////////////////////////////////////////////////////////////////////////
    this.popupWindow.setAttribute(
      {
        "class": `global_popup_window ${this.windowClassSign}`,
        "style": "display: none;"
      }
    );
    ////////////////////////////////////////////////////////////////////////////
    // 个人问题触发报告次数标签。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountLabel.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 个人问题触发报告次数输入框。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountTextField.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 表单列表。
    ////////////////////////////////////////////////////////////////////////////
    const list = new Array();
    list.push({"attr": {}, "required": true, "label_code": `${this.personProblemTriggerReportCountLabel.getCode()}`, "control_id": `${this.personProblemTriggerReportCountTextField.getId()}`, "control_code": `${this.personProblemTriggerReportCountTextField.getCode()}`});
    this.formList.setContent(list);
    this.formList.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 弹窗。
    ////////////////////////////////////////////////////////////////////////////
    this.popupWindow.setContent(this.formList.getCode());
    this.popupWindow.generateCode();
  }

  /**
   * 初始化事件
   */
  initEvent() {
    ////////////////////////////////////////////////////////////////////////////
    // 初始化弹窗事件。
    ////////////////////////////////////////////////////////////////////////////
    this.popupWindow.initEvent();
  }

  /**
   * 获取代码
   */
  getCode() {
    ////////////////////////////////////////////////////////////////////////////
    // 由于当前对象基于PopupWindow，所有的内容都放在了popupWindow里面
    // 所以应该返回popupWindow的代码。
    ////////////////////////////////////////////////////////////////////////////
    return this.popupWindow.getCode();
  }

  /**
   * 显示弹窗
   */
  show() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示弹窗。
    ////////////////////////////////////////////////////////////////////////////
    this.popupWindow.show();
    ////////////////////////////////////////////////////////////////////////////
    // 设置焦点在个人问题触发报告次数输入框。
    ////////////////////////////////////////////////////////////////////////////
    this.personProblemTriggerReportCountTextField.getObject().focus();
  }

  /**
   * 隐藏弹窗
   */
  hide() {
    ////////////////////////////////////////////////////////////////////////////
    // 隐藏弹窗。
    ////////////////////////////////////////////////////////////////////////////
    this.popupWindow.hide();
  }

  /**
   * 弹窗隐藏回调方法
   * @param source 调用源
   */
  popupWindowHideCallback(source) {
    ////////////////////////////////////////////////////////////////////////////
    // 隐藏结果信息。
    ////////////////////////////////////////////////////////////////////////////
    source.formList.hideResultInfo();
    ////////////////////////////////////////////////////////////////////////////
    // 隐藏所有提示。
    ////////////////////////////////////////////////////////////////////////////
    source.formList.hideAllPrompt();
    ////////////////////////////////////////////////////////////////////////////
    // 重置控件。
    ////////////////////////////////////////////////////////////////////////////
    source.resetControl();
  }

  /**
   * 冻结控件
   *
   * @param name 冻结标记名称
   */
  frozenControl(name) {
    ////////////////////////////////////////////////////////////////////////////
    // 存入队列。
    ////////////////////////////////////////////////////////////////////////////
    this.queue.push(name);
    this.personProblemTriggerReportCountTextField.getObject().attr("disabled", "disabled");
    this.formList.confirmButton.getObject().attr("disabled", "disabled");
    this.formList.cancelButton.getObject().attr("disabled", "disabled");
    this.popupWindow.removeEvent();
  }

  /**
   * 恢复控件
   *
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
      this.personProblemTriggerReportCountTextField.getObject().removeAttr("disabled");
      this.formList.confirmButton.getObject().removeAttr("disabled");
      this.formList.cancelButton.getObject().removeAttr("disabled");
      this.popupWindow.recoverEvent();
    }
  }

  /**
   * 重置控件
   */
  resetControl() {
    this.personProblemTriggerReportCountTextField.getObject().val("");
  }
}
