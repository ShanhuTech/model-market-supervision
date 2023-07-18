package mms;

import java.sql.Connection;
import java.util.HashMap;
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

@Module(description = "地点摄像头")
public final class LocationCamera extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public LocationCamera() {
    }

    public LocationCamera(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest,
            final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加地点摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "location_uuid", text = "地点的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "camera_uuid", text = "摄像头的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "vision_area", text = "识别区域", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "JSON格式"),
                    @Parameter(name = "vision_line", text = "识别线段", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "JSON格式"),
                    @Parameter(name = "is_mark", text = "是否标记", type = Parameter.Type.INTEGER, allowNull = false, format = "^0|1$", formatPrompt = "常量0或1", remark = "0：未标记；1：已标记") }, returns = @Returns())
    public final Message addLocationCamera() {
        try {
            final String locationUuid = (String) this.getParameter(this.parameter, "location_uuid");
            final String cameraUuid = (String) this.getParameter(this.parameter, "camera_uuid");
            final String visionArea = (String) this.getParameter(this.parameter, "vision_area");
            final String visionLine = (String) this.getParameter(this.parameter, "vision_line");
            final Integer isMark = (Integer) this.getParameter(this.parameter, "is_mark");
            // 检查参数
            {
                // visionArea
                if (null != visionArea) {
                    try {
                        final JSONArray array = new JSONArray(visionArea);
                        if (0 >= array.length()) {
                            throw new Exception();
                        }
                        for (int i = 0; i < array.length(); i++) {
                            final JSONObject obj = array.getJSONObject(i);
                            if (!(obj.has("type") && (obj.has("points")))) {
                                throw new Exception();
                            }
                            if (!((obj.getJSONObject("points").has("x")) && (obj.getJSONObject("points").has("y")))) {
                                throw new Exception();
                            }
                        }
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "VISION_AREA_FORMAT_ERROR", "识别区域格式错误");
                    }
                }
                // visionLine
                if (null != visionLine) {
                    try {
                        final JSONArray array = new JSONArray(visionLine);
                        if (0 >= array.length()) {
                            throw new Exception();
                        }
                        for (int i = 0; i < array.length(); i++) {
                            final JSONObject obj = array.getJSONObject(i);
                            if (!(obj.has("type") && (obj.has("start_point")) && (obj.has("end_point")))) {
                                throw new Exception();
                            }
                            if (!((obj.getJSONObject("start_point").has("x"))
                                    && (obj.getJSONObject("start_point").has("y")))) {
                                throw new Exception();
                            }
                            if (!((obj.getJSONObject("end_point").has("x"))
                                    && (obj.getJSONObject("end_point").has("y")))) {
                                throw new Exception();
                            }
                        }
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "VISION_LINE_FORMAT_ERROR", "识别线段格式错误");
                    }
                }
            }
            // 添加地点摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationCamera obj = new mms.dao.LocationCamera(con);
                    final Message resultMsg = obj.addLocationCamera(locationUuid, cameraUuid, visionArea, visionLine,
                            isMark);
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

    @Method(description = "删除地点摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.IP, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "uuid_array", text = "地点摄像头的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeLocationCamera() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除地点摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationCamera obj = new mms.dao.LocationCamera(con);
                    final Message resultMsg = obj.removeLocationCameraByUuid(uuidArray);
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

    @Method(description = "修改地点摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "uuid", text = "待修改地点摄像头的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "location_uuid", text = "地点的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "camera_uuid", text = "摄像头的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "vision_area", text = "识别区域", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "JSON格式，传递空值则清空"),
                    @Parameter(name = "vision_line", text = "识别线段", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "JSON格式，传递空值则清空"),
                    @Parameter(name = "is_mark", text = "是否标记", type = Parameter.Type.INTEGER, allowNull = true, format = "^0|1$", formatPrompt = "常量0或1", remark = "0：未标记；1：已标记") }, returns = @Returns())
    public final Message modifyLocationCamera() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String locationUuid = (String) this.getParameter(this.parameter, "location_uuid");
            final String cameraUuid = (String) this.getParameter(this.parameter, "camera_uuid");
            final String visionArea = (String) this.getParameter(this.parameter, "vision_area");
            final String visionLine = (String) this.getParameter(this.parameter, "vision_line");
            final Integer isMark = (Integer) this.getParameter(this.parameter, "is_mark");
            // 检查参数
            {
                // visionArea
                if (null != visionArea) {
                    try {
                        final JSONArray array = new JSONArray(visionArea);
                        if (0 >= array.length()) {
                            throw new Exception();
                        }
                        for (int i = 0; i < array.length(); i++) {
                            final JSONObject obj = array.getJSONObject(i);
                            if (!(obj.has("type") && (obj.has("points")))) {
                                throw new Exception();
                            }
                            if (!((obj.getJSONObject("points").has("x")) && (obj.getJSONObject("points").has("y")))) {
                                throw new Exception();
                            }
                        }
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "VISION_AREA_FORMAT_ERROR", "识别区域格式错误");
                    }
                }
                // visionLine
                if (null != visionLine) {
                    try {
                        final JSONArray array = new JSONArray(visionLine);
                        if (0 >= array.length()) {
                            throw new Exception();
                        }
                        for (int i = 0; i < array.length(); i++) {
                            final JSONObject obj = array.getJSONObject(i);
                            if (!(obj.has("type") && (obj.has("start_point")) && (obj.has("end_point")))) {
                                throw new Exception();
                            }
                            if (!((obj.getJSONObject("start_point").has("x"))
                                    && (obj.getJSONObject("start_point").has("y")))) {
                                throw new Exception();
                            }
                            if (!((obj.getJSONObject("end_point").has("x"))
                                    && (obj.getJSONObject("end_point").has("y")))) {
                                throw new Exception();
                            }
                        }
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "VISION_LINE_FORMAT_ERROR", "识别线段格式错误");
                    }
                }
            }
            // 修改地点摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationCamera obj = new mms.dao.LocationCamera(con);
                    final Message resultMsg = obj.modifyLocationCamera(uuid, locationUuid, cameraUuid, visionArea,
                            visionLine, isMark);
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

    @Method(description = "获取地点摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "uuid_array", text = "地点摄像头uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "location_uuid_array", text = "地点的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "camera_uuid_array", text = "摄像头的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
                    @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
                            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "地点摄像头的uuid"),
                            @ReturnResult(parentId = "array_id", id = "", name = "location_uuid", type = "string[1,40]", isNecessary = true, description = "地点的uuid"),
                            @ReturnResult(parentId = "array_id", id = "", name = "camera_uuid", type = "string[1,40]", isNecessary = true, description = "摄像头的uuid"),
                            @ReturnResult(parentId = "array_id", id = "", name = "vision_area", type = "string[1,256]", isNecessary = false, description = "识别区域"),
                            @ReturnResult(parentId = "array_id", id = "", name = "vision_line", type = "string[1,256]", isNecessary = false, description = "识别线段"),
                            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                            @ReturnResult(parentId = "array_id", id = "", name = "location_name", type = "string[1,32]", isNecessary = true, description = "地点名称"),
                            @ReturnResult(parentId = "array_id", id = "", name = "camera_name", type = "string[1,32]", isNecessary = true, description = "摄像头名称") }))
    public final Message getLocationCamera() {
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
            String[] cameraUuidArray = null;
            final String cameraUuidArrayStr = (String) this.getParameter(this.parameter, "camera_uuid_array");
            if (null != cameraUuidArrayStr) {
                cameraUuidArray = cameraUuidArrayStr.split(";");
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取地点摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.LocationCamera obj = new mms.dao.LocationCamera(con);
                    final Message resultMsg = obj.getLocationCamera(uuidArray, locationUuidArray, cameraUuidArray,
                            offset, rows);
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