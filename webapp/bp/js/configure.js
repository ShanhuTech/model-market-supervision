"use strict";

class Configure {
  /**
   * 获取项目名称
   * @return {string} 项目名称
   */
  static getProjectName() {
    return "mms";
  }

  /**
   * 获取后台服务的URL
   * @return {string} 项目路径
   */
  static getServerUrl() {
    return `http://127.0.0.1:9110/${Configure.getProjectName()}`;
    // return `http://192.168.10.150:9110/${Configure.getProjectName()}`;
  }

  /**
   * 获取标题
   * @return {string} 版权信息
   */
  static getTitle() {
    return `模型超市`;
  }

  /**
   * 获取版权信息
   * @return {string} 版权信息
   */
  static getCopyright() {
    // return `&copy; ${Toolkit.getCurrentFormatDateTime("yyyy")} BlackPearl`;
    return `&copy; ${Toolkit.getCurrentFormatDateTime("yyyy")} 锦绣蓝图`;
  }
}
