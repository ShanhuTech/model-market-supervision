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

@Module(description = "事件记录摄像头")
public final class EventRecordCamera extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public EventRecordCamera() {
    }

    public EventRecordCamera(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter)
        throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "获取事件记录摄像头", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "事件记录摄像头uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "record_uuid_array", text = "记录的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "camera_uuid_array", text = "摄像头的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "事件记录的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "record_uuid", type = "string[1,40]", isNecessary = true, description = "记录的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "camera_uuid", type = "string[1,40]", isNecessary = true, description = "摄像头的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "capture_data", type = "string[1,64]", isNecessary = true, description = "抓拍数据"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getEventRecordCamera() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] recordUuidArray = null;
            final String recordUuidArrayStr = (String) this.getParameter(this.parameter, "record_uuid_array");
            if (null != recordUuidArrayStr) {
                recordUuidArray = recordUuidArrayStr.split(";");
            }
            String[] cameraUuidArray = null;
            final String cameraUuidArrayStr = (String) this.getParameter(this.parameter, "camera_uuid_array");
            if (null != cameraUuidArrayStr) {
                cameraUuidArray = cameraUuidArrayStr.split(";");
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取事件记录摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.EventRecordCamera obj = new mms.dao.EventRecordCamera(con);
                    final Message resultMsg = obj.getEventRecordCamera(uuidArray, recordUuidArray, cameraUuidArray, offset, rows);
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