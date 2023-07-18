package mms;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
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
import mms.dao.Model.Status;

@Module(description = "模型")
public final class Model extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public Model() {
    }

    public Model(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加模型", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "type_uuid", text = "类型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "event_id", text = "事件的id", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,16}$", formatPrompt = "1-16位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "text", text = "文本", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = ""),
        @Parameter(name = "tolerance_time", text = "容忍时间", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "merge_time", text = "合并时间", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "threshold", text = "阈值", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "confidence", text = "置信度", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = ""),
        @Parameter(name = "status", text = "状态", type = Parameter.Type.STRING, allowNull = false, format = "^ENABLE|DISABLED$", formatPrompt = "常量ENABLE或DISABLED", remark = "ENABLE：启用；DISABLED：禁用"),
        @Parameter(name = "attach", text = "附件", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,}$", formatPrompt = "大于1位的任意字符", remark = "JSON格式：[{'title': '...', 'description': '...', 'data': '...'}]，数组中对象数量不能超过10个，其中title必填^.{1,32}$（即，1-32位任意字符）；description选填为^.{1,64}$（即，1-64位任意字符）；data必填^.{1,5242880}$（即，1-5242880位任意字符，用于保存图片base64数据）"/* ，base64.length * 0.75 = 文件大小（单位：字节）。如果限制文件大小为2MB，那么base64长度限制为：(2 * 1024 * 1024) / 0.75 = 2796202.67 */), }, returns = @Returns())
    public final Message addModel() {
        try {
            final String typeUuid = (String) this.getParameter(this.parameter, "type_uuid");
            final String eventId = (String) this.getParameter(this.parameter, "event_id");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String text = (String) this.getParameter(this.parameter, "text");
            final String description = (String) this.getParameter(this.parameter, "description");
            final Integer toleranceTime = (Integer) this.getParameter(this.parameter, "tolerance_time");
            final Integer mergeTime = (Integer) this.getParameter(this.parameter, "merge_time");
            final Integer threshold = (Integer) this.getParameter(this.parameter, "threshold");
            final Integer confidence = (Integer) this.getParameter(this.parameter, "confidence");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            final String statusStr = (String) this.getParameter(this.parameter, "status");
            Status status = null;
            if (null != statusStr) {
                status = Status.valueOf(statusStr);
            }
            final String attach = (String) this.getParameter(this.parameter, "attach");
            // 检查参数
            {
                // attach
                if (null != attach) {
                    try {
                        final JSONArray array = new JSONArray(attach);
                        for (int i = 0; i < array.length(); i++) {
                            if (10 < array.length()) {
                                return new Message(Message.Status.ERROR, "ATTACH_COUNT_MORE_THAN_10", "附件数量不能超过10个");
                            }
                            final JSONObject obj = array.getJSONObject(i);
                            if (!(obj.has("title") && (obj.has("data")))) {
                                throw new Exception();
                            }
                            if (!StringKit.regularExpressionCheck("^.{1,32}$", obj.getString("title"), Pattern.CASE_INSENSITIVE)) {
                                return new Message(Message.Status.ERROR, "PARAMETER_FORMAT_ERROR", "参数attach[" + i + "].title格式错误");
                            }
                            if (obj.has("description")) {
                                if (!StringKit.regularExpressionCheck("^.{1,64}$", obj.getString("description"), Pattern.CASE_INSENSITIVE)) {
                                    return new Message(Message.Status.ERROR, "PARAMETER_FORMAT_ERROR", "参数attach[" + i + "].description格式错误");
                                }
                            }
                            if (!StringKit.regularExpressionCheck("^.{1,5242880}$", obj.getString("data"), Pattern.CASE_INSENSITIVE)) {
                                return new Message(Message.Status.ERROR, "PARAMETER_FORMAT_ERROR", "参数attach[" + i + "].data格式错误");
                            }
                        }
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "VISION_AREA_FORMAT_ERROR", "识别区域格式错误");
                    }
                }
            }
            // 添加模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Model obj = new mms.dao.Model(con);
                    final Message resultMsg = obj.addModel(typeUuid, eventId, name, text, description, toleranceTime, mergeTime, threshold, confidence, order, status, attach);
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

    @Method(description = "删除模型", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.IP, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "模型的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeModel() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Model obj = new mms.dao.Model(con);
                    final Message resultMsg = obj.removeModelByUuid(uuidArray);
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

    @Method(description = "修改模型", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid", text = "待修改模型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "type_uuid", text = "类型的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "event_id", text = "事件的id", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,16}$", formatPrompt = "1-16位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "text", text = "文本", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
        @Parameter(name = "tolerance_time", text = "容忍时间", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "merge_time", text = "合并时间", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "threshold", text = "阈值", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "confidence", text = "置信度", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = ""),
        @Parameter(name = "status", text = "状态", type = Parameter.Type.STRING, allowNull = true, format = "^ENABLE|DISABLED$", formatPrompt = "常量ENABLE或DISABLED", remark = "ENABLE：启用；DISABLED：禁用") }, returns = @Returns())
    public final Message modifyModel() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String typeUuid = (String) this.getParameter(this.parameter, "type_uuid");
            final String eventId = (String) this.getParameter(this.parameter, "event_id");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String text = (String) this.getParameter(this.parameter, "text");
            final String description = (String) this.getParameter(this.parameter, "description");
            final Integer toleranceTime = (Integer) this.getParameter(this.parameter, "tolerance_time");
            final Integer mergeTime = (Integer) this.getParameter(this.parameter, "merge_time");
            final Integer threshold = (Integer) this.getParameter(this.parameter, "threshold");
            final Integer confidence = (Integer) this.getParameter(this.parameter, "confidence");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            final String statusStr = (String) this.getParameter(this.parameter, "status");
            Status status = null;
            if (null != statusStr) {
                status = Status.valueOf(statusStr);
            }
            // 修改模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Model obj = new mms.dao.Model(con);
                    final Message resultMsg = obj.modifyModel(uuid, typeUuid, eventId, name, text, description, toleranceTime, mergeTime, threshold, confidence, order, status);
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

    @Method(description = "应用模型", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid", text = "模型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "tolerance_time", text = "容忍时间", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "merge_time", text = "合并时间", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "threshold", text = "阈值", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
        @Parameter(name = "confidence", text = "置信度", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = "")}, returns = @Returns())
    public final Message applyModel() {
        try {
            // final String uuid = (String) this.getParameter(this.parameter, "uuid");

            // final Integer toleranceTime = (Integer) this.getParameter(this.parameter, "tolerance_time");
            // final Integer mergeTime = (Integer) this.getParameter(this.parameter, "merge_time");
            // final Integer threshold = (Integer) this.getParameter(this.parameter, "threshold");
            // final Integer confidence = (Integer) this.getParameter(this.parameter, "confidence");

            // 后期对接引擎接口，暂留，保存！
            return null;
            
            
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    @Method(description = "获取模型", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "模型uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "type_uuid_array", text = "类型的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "event_id_array", text = "事件id的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,16}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,16})*$", formatPrompt = "以分号分割的1-16位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
        @Parameter(name = "text_array", text = "文本的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "text_like", text = "文本的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
        @Parameter(name = "status_array", text = "状态的集合", type = Parameter.Type.STRING, allowNull = true, format = "^(ENABLE|DISABLED)(;(ENABLE|DISABLED))*$", formatPrompt = "以分号分割的常量ENABLE或DISABLED", remark = "ENABLE：启用；DISABLED：禁用"),
        @Parameter(name = "start_create_datetime", text = "开始创建时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
        @Parameter(name = "end_create_datetime", text = "结束创建时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
        @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
        @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "模型的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "type_uuid", type = "string[1,40]", isNecessary = true, description = "类型的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "event_id", type = "string[1,16]", isNecessary = true, description = "事件的id"),
            @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "text", type = "string[1,32]", isNecessary = true, description = "文本"),
            @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,128]", isNecessary = false, description = "描述"),
            @ReturnResult(parentId = "array_id", id = "", name = "tolerance_time", type = "int", isNecessary = true, description = "容忍时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "merge_time", type = "int", isNecessary = true, description = "合并时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "threshold", type = "int", isNecessary = true, description = "阈值"),
            @ReturnResult(parentId = "array_id", id = "", name = "confidence", type = "int", isNecessary = true, description = "置信度"),
            @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
            @ReturnResult(parentId = "array_id", id = "", name = "status", type = "string[1,16]", isNecessary = false, description = "状态"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "type_name", type = "string[1,32]", isNecessary = true, description = "类型名称") }))
    public final Message getModel() {
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
            String[] eventIdArray = null;
            final String eventIdArrayStr = (String) this.getParameter(this.parameter, "event_id_array");
            if (null != eventIdArrayStr) {
                eventIdArray = eventIdArrayStr.split(";");
            }
            String[] nameArray = null;
            final String nameArrayStr = (String) this.getParameter(this.parameter, "name_array");
            if (null != nameArrayStr) {
                nameArray = nameArrayStr.split(";");
            }
            final String nameLike = (String) this.getParameter(this.parameter, "name_like");
            String[] textArray = null;
            final String textArrayStr = (String) this.getParameter(this.parameter, "text_array");
            if (null != textArrayStr) {
                textArray = textArrayStr.split(";");
            }
            final String textLike = (String) this.getParameter(this.parameter, "text_like");
            Status[] statusArray = null;
            final String statusArrayStr = (String) this.getParameter(this.parameter, "status_array");
            if (null != statusArrayStr) {
                final String[] array = statusArrayStr.split(";");
                statusArray = new Status[array.length];
                for (int i = 0; i < array.length; i++) {
                    statusArray[i] = Status.valueOf(array[i]);
                }
            }
            final ArrayList<String> createDatetimeRange = new ArrayList<>();
            final String startCreateDatetime = (String) this.getParameter(this.parameter, "start_create_datetime");
            final String endCreateDatetime = (String) this.getParameter(this.parameter, "end_create_datetime");
            if (null != startCreateDatetime) {
                createDatetimeRange.add(startCreateDatetime);
                if (null != endCreateDatetime) {
                    createDatetimeRange.add(endCreateDatetime);
                }
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Model obj = new mms.dao.Model(con);
                    final Message resultMsg = obj.getModel(uuidArray, typeUuidArray, eventIdArray, nameArray, nameLike, textArray, textLike, statusArray,
                        createDatetimeRange.toArray(new String[createDatetimeRange.size()]), null, offset, rows);
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