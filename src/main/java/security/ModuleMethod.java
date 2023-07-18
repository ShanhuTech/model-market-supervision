package security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import com.palestink.server.sdk.Framework;
import com.palestink.server.sdk.module.AbstractModule;
import com.palestink.server.sdk.module.annotation.Frequency;
import com.palestink.server.sdk.module.annotation.Method;
import com.palestink.server.sdk.module.annotation.Module;
import com.palestink.server.sdk.module.annotation.ReturnResult;
import com.palestink.server.sdk.module.annotation.Returns;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.string.StringKit;

@Module(description = "模块方法")
public final class ModuleMethod extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    @SuppressWarnings("unused")
    private HashMap<String, Object> parameter;

    public ModuleMethod() {
    }

    public ModuleMethod(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "获取模块方法", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {}, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
            @ReturnResult(parentId = "array_id", id = "", name = "method_full_name", type = "string[1,]", isNecessary = true, description = "方法全称（类名+方法名）"),
            @ReturnResult(parentId = "array_id", id = "", name = "class_name", type = "string[1,]", isNecessary = true, description = "类名"),
            @ReturnResult(parentId = "array_id", id = "", name = "method_name", type = "string[1,]", isNecessary = true, description = "方法名") }))
    public final Message getModuleMethod() {
        try {
            final JSONArray array = new JSONArray();
            final Iterator<Entry<String, ArrayList<String>>> iter = Framework.MODULE_MAP.entrySet().iterator();
            while (iter.hasNext()) {
                final Entry<String, ArrayList<String>> module = iter.next();
                final String moduleName = module.getKey();
                final JSONObject moduleObj = new JSONObject();
                moduleObj.put("module", moduleName);
                final JSONArray methodArray = new JSONArray();
                final Iterator<String> moduleIter = module.getValue().iterator();
                while (moduleIter.hasNext()) {
                    final String methodFullName = moduleIter.next();
                    final String className = methodFullName.substring(0, methodFullName.lastIndexOf("."));
                    final String methodName = methodFullName.substring(methodFullName.lastIndexOf(".") + 1);
                    final JSONObject method = new JSONObject();
                    method.put("method_full_name", methodFullName);
                    method.put("class_name", className);
                    method.put("method_name", methodName);
                    methodArray.put(method);
                }
                moduleObj.put("methods", methodArray);
                array.put(moduleObj);
            }
            final JSONObject resultObj = new JSONObject();
            resultObj.put("array", array);
            return new Message(Message.Status.SUCCESS, resultObj, null);
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }
}