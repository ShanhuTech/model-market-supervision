package mms;

import java.sql.Connection;
import java.util.HashMap;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.palestink.server.sdk.module.AbstractModule;
import com.palestink.server.sdk.module.annotation.Frequency;
import com.palestink.server.sdk.module.annotation.Method;
import com.palestink.server.sdk.module.annotation.Module;
import com.palestink.server.sdk.module.annotation.Parameter;
import com.palestink.server.sdk.module.annotation.ReturnResult;
import com.palestink.server.sdk.module.annotation.Returns;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.string.StringKit;
import env.db.DruidInstance;

@Module(description = "识别引擎")
public final class EngineVision extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public EngineVision() {
    }

    public EngineVision(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加识别引擎", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "capture_uuid", text = "抓拍引擎的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "url", text = "地址", type = Parameter.Type.STRING, allowNull = false, format = "^[\\S]{1,256}$", formatPrompt = "1-256位的非空内容", remark = ""),
            @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = ""),
            @Parameter(name = "version", text = "版本", type = Parameter.Type.STRING, allowNull = false, format = "^.{1,8}$", formatPrompt = "1-8位的任意字符", remark = "") }, returns = @Returns())
    public final Message addEngineVision() {
        try {
            final String captureUuid = (String) this.getParameter(this.parameter, "capture_uuid");
            final String url = (String) this.getParameter(this.parameter, "url");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String version = (String) this.getParameter(this.parameter, "version");
            // 添加识别引擎
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.EngineVision obj = new mms.dao.EngineVision(con);
                    final Message resultMsg = obj.addEngineVision(captureUuid, url, name, description, version);
                    this.messageResultHandler(resultMsg, con, true);
                    return resultMsg;
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    @Method(description = "删除识别引擎", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.IP, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "识别引擎的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeEngineVision() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除识别引擎
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.EngineVision obj = new mms.dao.EngineVision(con);
                    final Message resultMsg = obj.removeEngineVisionByUuid(uuidArray);
                    this.messageResultHandler(resultMsg, con, true);
                    return resultMsg;
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    @Method(description = "修改识别引擎", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid", text = "待修改识别引擎的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "capture_uuid", text = "抓拍引擎的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "url", text = "地址", type = Parameter.Type.STRING, allowNull = true, format = "^[\\S]{1,256}$", formatPrompt = "1-256位的非空内容", remark = ""),
            @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
            @Parameter(name = "version", text = "版本", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,8}$", formatPrompt = "1-8位的任意字符", remark = "") }, returns = @Returns())
    public final Message modifyEngineVision() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String captureUuid = (String) this.getParameter(this.parameter, "capture_uuid");
            final String url = (String) this.getParameter(this.parameter, "url");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String version = (String) this.getParameter(this.parameter, "version");
            // 修改识别引擎
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.EngineVision obj = new mms.dao.EngineVision(con);
                    final Message resultMsg = obj.modifyEngineVision(uuid, captureUuid, url, name, description, version);
                    this.messageResultHandler(resultMsg, con, true);
                    return resultMsg;
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    @Method(description = "获取识别引擎", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "识别引擎uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "capture_uuid_array", text = "抓拍引擎的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "识别引擎的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "capture_uuid", type = "string[1,40]", isNecessary = true, description = "抓拍引擎的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,64]", isNecessary = false, description = "描述"),
                @ReturnResult(parentId = "array_id", id = "", name = "version", type = "string[1,8]", isNecessary = true, description = "版本"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "capture_name", type = "string[1,32]", isNecessary = true, description = "抓拍引擎名称") }))
    public final Message getEngineVision() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] captureUuidArray = null;
            final String captureUuidArrayStr = (String) this.getParameter(this.parameter, "capture_uuid_array");
            if (null != captureUuidArrayStr) {
                captureUuidArray = captureUuidArrayStr.split(";");
            }
            String[] nameArray = null;
            final String nameArrayStr = (String) this.getParameter(this.parameter, "name_array");
            if (null != nameArrayStr) {
                nameArray = nameArrayStr.split(";");
            }
            final String nameLike = (String) this.getParameter(this.parameter, "name_like");
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取识别引擎
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.EngineVision obj = new mms.dao.EngineVision(con);
                    final Message resultMsg = obj.getEngineVision(uuidArray, captureUuidArray, nameArray, nameLike, null, offset, rows);
                    this.messageResultHandler(resultMsg, con, true);
                    return resultMsg;
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }
}