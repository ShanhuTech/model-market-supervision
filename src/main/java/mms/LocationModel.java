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

@Module(description = "地点模型")
public final class LocationModel extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public LocationModel() {
    }

    public LocationModel(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加地点模型", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "location_uuid", text = "地点的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "model_uuid", text = "模型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "tolerance_time", text = "容忍时间", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
            @Parameter(name = "merge_time", text = "合并时间", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
            @Parameter(name = "threshold", text = "阈值", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
            @Parameter(name = "confidence", text = "置信度", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = "") }, returns = @Returns())
    public final Message addLocationModel() {
        try {
            final String locationUuid = (String) this.getParameter(this.parameter, "location_uuid");
            final String modelUuid = (String) this.getParameter(this.parameter, "model_uuid");
            final Integer toleranceTime = (Integer) this.getParameter(this.parameter, "tolerance_time");
            final Integer mergeTime = (Integer) this.getParameter(this.parameter, "merge_time");
            final Integer threshold = (Integer) this.getParameter(this.parameter, "threshold");
            final Integer confidence = (Integer) this.getParameter(this.parameter, "confidence");
            // 添加地点模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationModel obj = new mms.dao.LocationModel(con);
                    final Message resultMsg = obj.addLocationModel(locationUuid, modelUuid, toleranceTime, mergeTime, threshold, confidence);
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

    @Method(description = "删除地点模型", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.IP, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "地点模型的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeLocationModel() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除地点模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationModel obj = new mms.dao.LocationModel(con);
                    final Message resultMsg = obj.removeLocationModelByUuid(uuidArray);
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

    @Method(description = "修改地点模型", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid", text = "待修改地点模型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "location_uuid", text = "地点的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "model_uuid", text = "模型的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "tolerance_time", text = "容忍时间", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
            @Parameter(name = "merge_time", text = "合并时间", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
            @Parameter(name = "threshold", text = "阈值", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = ""),
            @Parameter(name = "confidence", text = "置信度", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于0的正整数", remark = "") }, returns = @Returns())
    public final Message modifyLocationModel() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String locationUuid = (String) this.getParameter(this.parameter, "location_uuid");
            final String modelUuid = (String) this.getParameter(this.parameter, "model_uuid");
            final Integer toleranceTime = (Integer) this.getParameter(this.parameter, "tolerance_time");
            final Integer mergeTime = (Integer) this.getParameter(this.parameter, "merge_time");
            final Integer threshold = (Integer) this.getParameter(this.parameter, "threshold");
            final Integer confidence = (Integer) this.getParameter(this.parameter, "confidence");
            // 修改地点模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationModel obj = new mms.dao.LocationModel(con);
                    final Message resultMsg = obj.modifyLocationModel(uuid, locationUuid, modelUuid, toleranceTime, mergeTime, threshold, confidence);
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

    @Method(description = "获取地点模型", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "地点模型uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "location_uuid_array", text = "地点的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "model_uuid_array", text = "模型的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "地点模型的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "location_uuid", type = "string[1,40]", isNecessary = true, description = "地点的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "model_uuid", type = "string[1,32]", isNecessary = true, description = "模型的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "location_name", type = "string[1,32]", isNecessary = true, description = "地点名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "model_name", type = "string[1,32]", isNecessary = true, description = "模型名称") }))
    public final Message getLocationModel() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] locationUuidArray = null;
            final String locationUuidArrayStr = (String) this.getParameter(this.parameter, "location_uuid_array");
            if (null != locationUuidArrayStr) {
                locationUuidArray = locationUuidArrayStr.split(";");
            }
            String[] modelUuidArray = null;
            final String modelUuidArrayStr = (String) this.getParameter(this.parameter, "model_uuid_array");
            if (null != modelUuidArrayStr) {
                modelUuidArray = modelUuidArrayStr.split(";");
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取地点模型
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationModel obj = new mms.dao.LocationModel(con);
                    final Message resultMsg = obj.getLocationModel(uuidArray, locationUuidArray, modelUuidArray, offset, rows);
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