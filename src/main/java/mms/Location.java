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
import mms.dao.Location.Status;

@Module(description = "地点")
public final class Location extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public Location() {
    }

    public Location(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加地点", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "type_uuid", text = "类型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "capture_uuid", text = "抓拍引擎的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "code", text = "代码", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64}$", formatPrompt = "1-64位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = ""),
        @Parameter(name = "status", text = "状态", type = Parameter.Type.STRING, allowNull = false, format = "^ENABLE|DISABLED$", formatPrompt = "常量ENABLE或DISABLED", remark = "ENABLE：启用；DISABLED：禁用") }, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "地点的uuid") }))
    public final Message addLocation() {
        try {
            final String typeUuid = (String) this.getParameter(this.parameter, "type_uuid");
            final String captureUuid = (String) this.getParameter(this.parameter, "capture_uuid");
            final String code = (String) this.getParameter(this.parameter, "code");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String statusStr = (String) this.getParameter(this.parameter, "status");
            Status status = null;
            if (null != statusStr) {
                status = Status.valueOf(statusStr);
            }
            // 添加地点
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Location obj = new mms.dao.Location(con);
                    final Message resultMsg = obj.addLocation(typeUuid, captureUuid, code, name, description, status);
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

    @Method(description = "删除地点", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.IP, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "地点的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeLocation() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除地点
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Location obj = new mms.dao.Location(con);
                    final Message resultMsg = obj.removeLocationByUuid(uuidArray);
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

    @Method(description = "修改地点", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid", text = "待修改地点的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "type_uuid", text = "类型的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "capture_uuid", text = "抓拍引擎的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "code", text = "代码", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64}$", formatPrompt = "1-64位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
        @Parameter(name = "status", text = "状态", type = Parameter.Type.STRING, allowNull = true, format = "^ENABLE|DISABLED$", formatPrompt = "常量ENABLE或DISABLED", remark = "ENABLE：启用；DISABLED：禁用") }, returns = @Returns())
    public final Message modifyLocation() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String typeUuid = (String) this.getParameter(this.parameter, "type_uuid");
            final String captureUuid = (String) this.getParameter(this.parameter, "capture_uuid");
            final String code = (String) this.getParameter(this.parameter, "code");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String statusStr = (String) this.getParameter(this.parameter, "status");
            Status status = null;
            if (null != statusStr) {
                status = Status.valueOf(statusStr);
            }
            // 修改地点
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Location obj = new mms.dao.Location(con);
                    final Message resultMsg = obj.modifyLocation(uuid, typeUuid, captureUuid, code, name, description, status);
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

    @Method(description = "获取地点", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "地点uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "type_uuid_array", text = "类型的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "capture_uuid_array", text = "抓拍引擎的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "code_array", text = "代码的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64})*$", formatPrompt = "以分号分割的1-64位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
        @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
        @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "地点的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "capture_uuid", type = "string[1,40]", isNecessary = true, description = "抓拍引擎的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,64]", isNecessary = false, description = "描述"),
            @ReturnResult(parentId = "array_id", id = "", name = "tolerance_time", type = "int", isNecessary = true, description = "容忍时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "merge_time", type = "int", isNecessary = true, description = "合并时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "threshold", type = "int", isNecessary = true, description = "阈值"),
            @ReturnResult(parentId = "array_id", id = "", name = "confidence", type = "int", isNecessary = true, description = "置信度"),
            @ReturnResult(parentId = "array_id", id = "", name = "status", type = "string[1,16]", isNecessary = true, description = "状态"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "type_name", type = "string[1,32]", isNecessary = true, description = "类型名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "capture_name", type = "string[1,32]", isNecessary = true, description = "抓拍引擎名称") }))
    public final Message getLocation() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] typeUuidArray = null;
            final String typeUuidArrayStr = (String) this.getParameter(this.parameter, "type_uuid_array");
            if (null != typeUuidArrayStr) {
                typeUuidArray = typeUuidArrayStr.split(";");
            }
            String[] captureUuidArray = null;
            final String captureUuidArrayStr = (String) this.getParameter(this.parameter, "capture_uuid_array");
            if (null != captureUuidArrayStr) {
                captureUuidArray = captureUuidArrayStr.split(";");
            }
            String[] codeArray = null;
            final String codeArrayStr = (String) this.getParameter(this.parameter, "code_array");
            if (null != codeArrayStr) {
                codeArray = codeArrayStr.split(";");
            }
            String[] nameArray = null;
            final String nameArrayStr = (String) this.getParameter(this.parameter, "name_array");
            if (null != nameArrayStr) {
                nameArray = nameArrayStr.split(";");
            }
            final String nameLike = (String) this.getParameter(this.parameter, "name_like");
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取地点
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Location obj = new mms.dao.Location(con);
                    final Message resultMsg = obj.getLocation(uuidArray, typeUuidArray, captureUuidArray, codeArray, nameArray, nameLike, null, offset, rows);
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