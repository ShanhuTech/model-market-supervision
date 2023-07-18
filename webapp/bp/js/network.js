"use strict";

/**
 * 网络
 */
class Network {
  /*
   * 请求类型枚举
   */
  static RequestType = {
    "GET": "GET",
    "POST": "POST"
  };

  /**
   * 请求
   * @param {enum} requestType Network.RequestType枚举的请求类型
   * @param {string} url 请求地址
   * @param {object} parameter 参数对象（允许为null）
   * @param {object} source 调用源
   * @param {function} onSuccess 成功回调方法
   * @param {function} onError 失败回调方法
   */
  static request(requestType, url, parameter, source, onSuccess, onError) {
    ////////////////////////////////////////////////////////////////////////////
    // 检查请求类型
    ////////////////////////////////////////////////////////////////////////////
    if ((null === requestType) || (!Object.values(Network.RequestType).includes(requestType))) {
      throw new Error("Invalid Request Type");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查url
    ////////////////////////////////////////////////////////////////////////////
    if ((null === url) || (!Toolkit.equalsIgnoreCase("string", typeof(url))) || (0 >= url.length)) {
      throw new Error("Invalid Url");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查参数对象
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== parameter) && (!(parameter instanceof FormData))) {
      throw new Error("Invalid Parameter Type");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查调用源
    ////////////////////////////////////////////////////////////////////////////
    if ((null !== source) && (!Toolkit.equalsIgnoreCase("object", typeof(source)))) {
      throw new Error("Invalid Source");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查成功回调方法
    ////////////////////////////////////////////////////////////////////////////
    if ((null === onSuccess) || (!Toolkit.equalsIgnoreCase("function", typeof(onSuccess)))) {
      throw new Error("Invalid On Success");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 检查失败回调方法
    ////////////////////////////////////////////////////////////////////////////
    if ((null === onError) || (!Toolkit.equalsIgnoreCase("function", typeof(onError)))) {
      throw new Error("Invalid On Error");
    }
    ////////////////////////////////////////////////////////////////////////////
    // 请求选项
    ////////////////////////////////////////////////////////////////////////////
    const option = {
      "method": requestType, "mode": "cors", "cache": "no-store",
      "headers": {"Content-Type": "application/x-www-form-urlencoded"},
      "credentials": "omit", "redirect": "error", "referrerPolicy": "no-referrer"
    };
    if ((Network.RequestType.GET === requestType) && (null !== parameter)) {
      url += `?`;
      for (const obj of parameter.entries()) {
        url += `${encodeURIComponent(obj[0])}=${encodeURIComponent(obj[1])}&`;
      }
      url = url.substring(0, url.length - 1);
    }
    if ((Network.RequestType.POST === requestType) && (null !== LocalStorage.getItem("account_token"))) {
      const formData = new FormData();
      if (null !== parameter) {
        for (const obj of parameter.entries()) {
          formData.append(obj[0], obj[1]);
        }
      }
      formData.append("Account-Token", LocalStorage.getItem("account_token"));
      option.body = new URLSearchParams(formData).toString();
    }
    ////////////////////////////////////////////////////////////////////////////
    // 请求
    ////////////////////////////////////////////////////////////////////////////
    fetch(url, option).then(function(response) {
      if (!response.ok) {
        onError(response, source);
      } else {
        ////////////////////////////////////////////////////////////////////////
        // 接口返回都是json，所以这里仅处理json数据
        ////////////////////////////////////////////////////////////////////////
        return response.json();
      }
    }).then(function(data) {
      onSuccess(data, source);
    }).catch(function(error) {
      onError(error, source)
    });
  }
}
