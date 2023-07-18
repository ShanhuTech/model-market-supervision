"use strict";

/**
 * 模块
 */
class Module {
  /**
   * 获取模块规则的Promise
   * @param {object} source 调用源
   * @param {string} moduleName 模块名称
   * @return {object} 模块规则的Promise
   */
  static getModuleRulePromise(source, moduleName) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查source
    ////////////////////////////////////////////////////////////////////////////
    if ((null === source) || (!Toolkit.equalsIgnoreCase("object", typeof(source)))) {
      throw new Error("Invalid Source");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查moduleName
    ////////////////////////////////////////////////////////////////////////////
    if ((null === moduleName) || (!Toolkit.equalsIgnoreCase("string", typeof(moduleName))) || (0 >= moduleName.length)) {
      throw new Error("Invalid Module Name");
    }
    return new Promise(function(resolve, reject) {
      Network.request(Network.RequestType.GET, `${Configure.getServerUrl()}/rule/${moduleName}`, null, source,
        function success(data, source) {
          const responseResult = data;
          if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
            const rule = responseResult.content;
            resolve({
              "source": source,
              "rule": rule
            });
          } else {
            Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.BOTTOM_RIGHT/* 位置 */, "错误"/* 标题 */, responseResult.attach/* 内容 */);
          }
        },
        function error(error, source) {
          Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.BOTTOM_RIGHT/* 位置 */, "错误"/* 标题 */, error.toString()/* 内容 */);
        }
      );
    });
  }

  /**
   * 获取方法参数的规则对象
   * @param {object} ruleObj 规则对象
   * @param {string} methodName 方法名称
   * @param {string} parameterName 参数名称
   * @return {object} 成功返回方法参数的规则对象，否则返回null
   */
  static getMethodParameterRuleObj(ruleObj, methodName, parameterName) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查ruleObj
    ////////////////////////////////////////////////////////////////////////////
    if ((null === ruleObj) || (!Toolkit.equalsIgnoreCase("object", typeof(ruleObj)))) {
      throw new Error("Invalid Rule Obj");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查methodName
    ////////////////////////////////////////////////////////////////////////////
    if ((null === methodName) || (!Toolkit.equalsIgnoreCase("string", typeof(methodName))) || (0 >= methodName.length)) {
      throw new Error("Invalid Method Name");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查parameterName
    ////////////////////////////////////////////////////////////////////////////
    if ((null === parameterName) || (!Toolkit.equalsIgnoreCase("string", typeof(parameterName))) || (0 >= parameterName.length)) {
      throw new Error("Invalid Parameter Name");
    }
    for (let i = 0; i < ruleObj.methods.length; i++) {
      const method = ruleObj.methods[i];
      if (Toolkit.equalsIgnoreCase(methodName, method.name)) {
        for (let j = 0; j < method.parameters.length; j++) {
          let parameter = method.parameters[j];
          if (Toolkit.equalsIgnoreCase(parameterName, parameter.name)) {
            return parameter;
          }
        }
        break;
      }
    }
    return null;
  }

  /**
   * 获取验证提示类名
   * @return {string} 验证提示类名
   */
  static getValidatePromptClassName() {
    return "validate_prompt";
  }

  /**
   * 检查参数
   * @param {object} ruleObj 规则对象
   * @param {string} methodName 方法名称
   * @param {object} parameterObj 参数对象
   * @param {object} source 调用源
   * @param {function} errorCallback 错误回调方法
   * @return {boolean} 没有错误返回true，否则返回false并且触发错误回调函数
   */
  static checkParameter(ruleObj, methodName, parameterObj, source, errorCallback) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查ruleObj
    ////////////////////////////////////////////////////////////////////////////
    if ((null === ruleObj) || (!Toolkit.equalsIgnoreCase("object", typeof(ruleObj)))) {
      throw new Error("Invalid Rule Obj");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查methodName
    ////////////////////////////////////////////////////////////////////////////
    if ((null === methodName) || (!Toolkit.equalsIgnoreCase("string", typeof(methodName))) || (0 >= methodName.length)) {
      throw new Error("Invalid Method Name");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查parameterObj
    ////////////////////////////////////////////////////////////////////////////
    if ((null === parameterObj) || (!Toolkit.equalsIgnoreCase("object", typeof(parameterObj)))) {
      throw new Error("Invalid Parameter Obj");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查source
    ////////////////////////////////////////////////////////////////////////////
    if ((null === source) || (!Toolkit.equalsIgnoreCase("object", typeof(source)))) {
      throw new Error("Invalid Source");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查errorCallback
    ////////////////////////////////////////////////////////////////////////////
    if ((null === errorCallback) || (!Toolkit.equalsIgnoreCase("function", typeof(errorCallback)))) {
      throw new Error("Invalid Error Callback");
    }
    if (!parameterObj.hasOwnProperty("name")) {
      errorCallback(source, "参数名称不存在");
      return false;
    }
    if (!parameterObj.allow_null) {
      if ((!parameterObj.hasOwnProperty("value")) || (null === parameterObj.value)) {
        if (null !== parameterObj.custom_error_message) {
          errorCallback(source, parameterObj.custom_error_message);
        } else {
          errorCallback(source, `${parameterObj.name}参数值不存在`);
        }
        return false;
      }
    }
    const parameterRule = Module.getMethodParameterRuleObj(ruleObj, methodName, parameterObj.name);
    if (null === parameterRule) {
      if (null !== parameterObj.custom_error_message) {
        errorCallback(source, parameterObj.custom_error_message);
      } else {
        errorCallback(source, `接口中没有找到检查参数: ${parameterObj.name}`);
      }
      return false;
    }
    if ((!parameterObj.allow_null) && (0 >= parameterObj.value.length)) {
      if (null !== parameterObj.custom_error_message) {
        errorCallback(source, parameterObj.custom_error_message);
      } else {
        errorCallback(source, `${parameterRule.text}不能为空`);
      }
      return false;
    }
    if ((!parameterRule.allow_null) && (0 >= parameterObj.value.length)) {
      if (null !== parameterObj.custom_error_message) {
        errorCallback(source, parameterObj.custom_error_message);
      } else {
        errorCallback(source, `${parameterRule.text}不能为空`);
      }
      return false;
    }
    if ((null !== parameterObj.value) && (0 < parameterObj.value.length)) {
      if (null === parameterObj.value.match(parameterRule.format)) {
        if (null !== parameterObj.custom_error_message) {
          errorCallback(source, parameterObj.custom_error_message);
        } else {
          errorCallback(source, `${parameterRule.text}必须是${parameterRule.format_prompt}`);
        }
        return false;
      }
    }
    return true;
  }
}
