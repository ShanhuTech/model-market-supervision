"use strict";

class Api {
  /**
   * 构造函数
   */
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // 模块数组
    ////////////////////////////////////////////////////////////////////////////
    this.moduleArray = new Array();
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块方法
    ////////////////////////////////////////////////////////////////////////////
    this.getModuleMethod();
  }

  /**
   * 获取模块方法
   */
  getModuleMethod() {
    ////////////////////////////////////////////////////////////////////////////
    // 显示等待遮盖
    ////////////////////////////////////////////////////////////////////////////
    WaitMask.show();
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块方法
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.POST, `${Configure.getServerUrl()}/module/security.ModuleMethod/getModuleMethod`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          for (let i = 0; i < responseResult.content.array.length; i++) {
            const mmArray = responseResult.content.array[i].methods;
            ////////////////////////////////////////////////////////////////////
            // 模块去重
            ////////////////////////////////////////////////////////////////////
            for (let j = 0; j < mmArray.length; j++) {
              const mm = mmArray[j];
              let isExist = false;
              for (let n = 0; n < source.moduleArray.length; n++) {
                const module = source.moduleArray[n];
                if (mm.class_name === module.class_name) {
                  isExist = true;
                  break;
                }
              }
              if (!isExist) {
                source.moduleArray.push(mm);
              }
            }
          }
          //////////////////////////////////////////////////////////////////////
          // 按照class_name升序排序
          //////////////////////////////////////////////////////////////////////
          source.moduleArray.sort(function (obj1, obj2) {
            if (obj1.class_name === obj2.class_name) {
              return 0;
            } else if (obj1.class_name > obj2.class_name) {
              return 1;
            }
            return -1;
          });
          //////////////////////////////////////////////////////////////////////
          // 当前模块数量
          //////////////////////////////////////////////////////////////////////
          source.currentModuleCount = source.moduleArray.length;
          for (let i = 0; i < source.moduleArray.length; i++) {
            const module = source.moduleArray[i];
            ////////////////////////////////////////////////////////////////////
            // 获取模块注解
            ////////////////////////////////////////////////////////////////////
            source.getModuleAnnotation(module);
          }
        } else {
          Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, responseResult.attach/* 内容 */);
        }
      },
      function error(error, source) {
        console.error(error);
        Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, error.toString()/* 内容 */);
      }
    );
  }

  /**
   * 获取模块注解
   * @param {object} 模块对象
   */
  getModuleAnnotation(module) {
    ////////////////////////////////////////////////////////////////////////////
    // 获取模块方法
    ////////////////////////////////////////////////////////////////////////////
    Network.request(Network.RequestType.GET, `${Configure.getServerUrl()}/annotation/${module.class_name}`, null, this,
      function success(data, source) {
        const responseResult = data;
        if (Toolkit.equalsIgnoreCase("success", responseResult.status)) {
          const moduleAnnotation = responseResult.content;
          module.annotation = moduleAnnotation;
          //////////////////////////////////////////////////////////////////////
          // 按照name升序排序
          //////////////////////////////////////////////////////////////////////
          module.annotation.methods.sort(function (obj1, obj2) {
            if (obj1.name === obj2.name) {
              return 0;
            } else if (obj1.name > obj2.name) {
              return 1;
            }
            return -1;
          });
          source.currentModuleCount--;
          if (0 >= source.currentModuleCount) {
            ////////////////////////////////////////////////////////////////////
            // 初始化视图
            ////////////////////////////////////////////////////////////////////
            source.initView();
            ////////////////////////////////////////////////////////////////////
            // 初始化事件
            ////////////////////////////////////////////////////////////////////
            source.initEvent();
            ////////////////////////////////////////////////////////////////////
            // 隐藏等待遮盖
            ////////////////////////////////////////////////////////////////////
            WaitMask.hide();
          }
        }
      },
      function error(error, source) {
        console.error(error);
        Toast.show(Toast.Type.ERROR/* 类型 */, Toast.Position.MIDDLE_CENTER/* 位置 */, "错误"/* 标题 */, error.toString()/* 内容 */);
      }
    );
  }

  /**
   * 初始化视图
   */
  initView() {
    $("title").html(Configure.getTitle());
    let tableCode = "";
    ////////////////////////////////////////////////////////////////////////////
    // 添加模块表格
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < this.moduleArray.length; i++) {
      const moduleAnnotation = this.moduleArray[i].annotation;
      let tbodyCode = "";
      for (let j = 0; j < moduleAnnotation.methods.length; j++) {
        const method = moduleAnnotation.methods[j];
        const leftRoundedCode = ((j + 1) === moduleAnnotation.methods.length) ? "rounded-bl-lg" : "";
        const rightRoundedCode = ((j + 1) === moduleAnnotation.methods.length) ? "rounded-br-lg" : "";
        tbodyCode += `
          <tr class = "hover:bg-orange-50 odd:bg-white even:bg-gray-100">
            <td class = "w-5/12 px-4 py-3 ${leftRoundedCode}"><a href = "#${moduleAnnotation.class_name}.${method.name}">${method.name}</a></td><td class = "px-4 py-3 ${rightRoundedCode}">${method.description}</td>
          </tr>
        `;
      }
      tableCode += `
        <table class = "w-full text-sm text-left text-slate-600">
          <thead class = "font-semibold select-none">
            <tr class = "bg-violet-200"><th class = "px-4 py-3 rounded-t-lg" colspan = "2">${moduleAnnotation.description}</th></tr>
          </thead>
          <tbody>${tbodyCode}</tbody>
        </table>
        <br />
      `;
    }
    ////////////////////////////////////////////////////////////////////////////
    // 添加方法表格
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < this.moduleArray.length; i++) {
      const moduleAnnotation = this.moduleArray[i].annotation;
      for (let j = 0; j < moduleAnnotation.methods.length; j++) {
        const method = moduleAnnotation.methods[j];
        const anonymousAccess = method.anonymous_access ? "是" : "否";
        let frequencys = "";
        for (let n = 0; n < method.frequencys.length; n++) {
          frequencys += method.frequencys[n].source + ":" + method.frequencys[n].count + ":" + method.frequencys[n].unit + ";";
        }
        frequencys = frequencys.substring(0, frequencys.length - 1);
        const requestUrl = Configure.getServerUrl() + "/module/" + moduleAnnotation.class_name + "/" + method.name;
        let requestParameterCode = `<tr class = "hover:bg-orange-50"><td class = "text-center px-4 py-3 select-none bg-white" colspan = "7">无</td></tr>`;
        if ((method.hasOwnProperty("parameters")) && (0 < method.parameters.length)) {
          requestParameterCode = "";
          for (let n = 0; n < method.parameters.length; n++) {
            const parameter = method.parameters[n];
            let allowNullCode = "";
            if (parameter.allow_null) {
              allowNullCode = "否";
            } else {
              allowNullCode = "是";
            }
            requestParameterCode += `
              <tr class = "hover:bg-orange-50 odd:bg-gray-100 even:bg-white">
                <td class = "px-4 py-3">${parameter.name}</td><td class = "px-4 py-3">${parameter.text}</td><td class = "px-4 py-3">${parameter.type}</td><td class = "px-4 py-3">${allowNullCode}</td><td class = "px-4 py-3">${parameter.format}</td><td class = "px-4 py-3">${parameter.format_prompt}</td><td class = "px-4 py-3">${parameter.remark}</td>
              </tr>
            `;
          }
        }
        let returnDataCode = `<tr class = "hover:bg-orange-50"><td class = "text-center font-semibold px-4 py-3 rounded-b-lg select-none bg-violet-50" colspan = "4">无</td></tr>`;
        if ((method.hasOwnProperty("returns")) && (0 < method.returns.length)) {
          returnDataCode = "";
          const indent = {};
          for (let n = 0; n < method.returns.length; n++) {
            const returnObj = method.returns[n];
            if ((returnObj.hasOwnProperty("parent_id")) && (0 < returnObj.parent_id.length)) {
              // 子级
              indent[returnObj.id] = indent[returnObj.parent_id] + 16;
            } else {
              // 顶级
              indent[returnObj.id] = 0;
            }
            let isNecessaryCode = "否";
            if (returnObj.hasOwnProperty("is_necessary")) {
              if (returnObj.is_necessary) {
                isNecessaryCode = "是";
              }
            }
            const leftRoundedCode = ((n + 1) === method.returns.length) ? "rounded-bl-lg" : "";
            const rightRoundedCode = ((n + 1) === method.returns.length) ? "rounded-br-lg" : "";
            returnDataCode += `
              <tr class = "hover:bg-orange-50 odd:bg-gray-100 even:bg-white">
                <td class = "px-4 py-3 ${leftRoundedCode}" data-indent = "${indent[returnObj.id]}">${returnObj.name}</td><td class = "px-4 py-3">${returnObj.type}</td><td class = "px-4 py-3">${isNecessaryCode}</td><td class = "px-4 py-3 ${rightRoundedCode}">${returnObj.description}</td>
              </tr>
            `;
          }
        }
        tableCode += `
          <br />
          <table id = "${moduleAnnotation.class_name}.${method.name}" class = "w-full text-sm text-left text-slate-600">
            <thead class = "font-semibold select-none">
              <tr class = "bg-violet-200"><th class = "px-4 py-3 rounded-t-lg" colspan = "10">接口信息</th></tr>
            </thead>
            <tbody>
              <tr class = "bg-white hover:bg-orange-50">
                <td class = "font-semibold px-4 py-3 select-none bg-violet-50">名称</td><td class = "text-red-500 font-semibold px-4 py-3">${method.name}</td><td class = "px-4 py-3 select-none bg-violet-50">描述</td><td class = "px-4 py-3">${method.description}</td><td class = "px-4 py-3 select-none bg-violet-50">匿名访问</td><td class = "px-4 py-3">${anonymousAccess}</td><td class = "px-4 py-3 select-none bg-violet-50">频次限制</td><td class = "px-4 py-3">${frequencys}</td><td class = "px-4 py-3 select-none bg-violet-50">请求类型</td><td class = "px-4 py-3">${method.method_type}</td>
              </tr>
              <tr class = "bg-white hover:bg-orange-50">
                <td class = "px-4 py-3 select-none bg-violet-50">请求地址</td><td class = "px-4 py-3" colspan = "9"><div class = "flex flex-row justify-start items-center"><span>${requestUrl}</span><svg class = "copy_url w-5 h-5 cursor-pointer ml-2" data-clipboard-text = "${requestUrl}" fill = "none" stroke = "currentColor" stroke-width = "1.5" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true"><path stroke-linecap = "round" stroke-linejoin = "round" d = "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"></path></svg></div></td>
              </tr>
            </tbody>
          </table>
          <table class = "w-full text-sm text-left text-slate-600">
            <thead class = "font-semibold select-none">
              <tr class = "bg-violet-200"><th class = "px-4 py-3" colspan = "10">请求参数</th></tr>
            </thead>
            <tbody>
              <tr class = "hover:bg-orange-50">
                <td class = "font-semibold px-4 py-3 select-none bg-violet-50">名称</td><td class = "px-4 py-3 select-none bg-violet-50">字段</td><td class = "px-4 py-3 select-none bg-violet-50">类型</td><td class = "px-4 py-3 select-none bg-violet-50">是否必填</td><td class = "px-4 py-3 select-none bg-violet-50">校验正则</td><td class = "px-4 py-3 select-none bg-violet-50">校验描述</td><td class = "px-4 py-3 select-none bg-violet-50">备注</td>
              </tr>
              ${requestParameterCode}
            </tbody>
          </table>
          <table class = "return_data w-full text-sm text-left text-slate-600">
            <thead class = "font-semibold select-none">
              <tr class = "bg-violet-200"><th class = "px-4 py-3" colspan = "10">返回数据</th></tr>
            </thead>
            <tbody>
              <tr class = "hover:bg-orange-50">
                <td class = "font-semibold px-4 py-3 select-none bg-violet-50">名称</td><td class = "px-4 py-3 select-none bg-violet-50">类型</td><td class = "px-4 py-3 select-none bg-violet-50">是否必填</td><td class = "px-4 py-3 select-none bg-violet-50">描述</td>
              </tr>
              ${returnDataCode}
            </tbody>
          </table>
        `;
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 添加返回顶部按钮
    ////////////////////////////////////////////////////////////////////////////
    tableCode += `
      <div class = "return_top w-10 h-10 fixed bottom-10 right-10 rounded-full text-white bg-blue-300 cursor-pointer flex flex-row justify-center items-center hover:bg-blue-400">
        <svg class = "w-6 h-auto" fill = "none" stroke = "currentColor" stroke-width = "2" viewBox = "0 0 24 24" xmlns = "http://www.w3.org/2000/svg" aria-hidden = "true">
          <path stroke-linecap = "round" stroke-linejoin = "round" d = "M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"></path>
        </svg>
      </div>
    `;
    ////////////////////////////////////////////////////////////////////////////
    // 模板构建
    ////////////////////////////////////////////////////////////////////////////
    Template.build($("body"), null, tableCode);
  }

  /**
   * 初始化事件
   */
  initEvent() {
    ////////////////////////////////////////////////////////////////////////////
    // 生效表格缩进
    ////////////////////////////////////////////////////////////////////////////
    $("body").find(".content").find(".return_data").find("tbody").find("tr").find("[data-indent]").each(function () {
      const paddingLeft = parseInt($(this).css("padding-left")) + parseInt($(this).attr("data-indent"));
      $(this).css("padding-left", paddingLeft + "px");
      $(this).removeAttr("data-indent");
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定复制到剪切板事件
    ////////////////////////////////////////////////////////////////////////////
    new ClipboardJS(".copy_url").on("success", function (e) {
      Toast.show(Toast.Type.INFO/* 类型 */, Toast.Position.BOTTOM_RIGHT/* 位置 */, "成功"/* 标题 */, "已复制"/* 内容 */);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 注册返回顶部按钮的click事件
    ////////////////////////////////////////////////////////////////////////////
    $("body").find(".return_top").off("click").on("click", null, this, function (event) {
      const source = event.data;
      window.scrollTo(0, 0);
    });
  }
}
