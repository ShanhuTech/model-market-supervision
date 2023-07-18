package mms;

import java.sql.Connection;
import java.util.HashMap;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import mms.dao.Camera.ConnectType;
import mms.dao.Camera.ProtocolType;

@Module(description = "摄像头")
public final class Camera extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public Camera() {
    }

    public Camera(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest,
            final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "code", text = "代码", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64}$", formatPrompt = "1-64位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
                    @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
                    @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,128}$", formatPrompt = "1-128位的任意字符", remark = ""),
                    @Parameter(name = "url", text = "地址", type = Parameter.Type.STRING, allowNull = false, format = "^.{1,128}$", formatPrompt = "1-128位的任意字符", remark = ""),
                    @Parameter(name = "protocol_type", text = "协议类型", type = Parameter.Type.STRING, allowNull = false, format = "^RTSP|RTMP$", formatPrompt = "常量RTSP或RTMP", remark = ""),
                    @Parameter(name = "connect_type", text = "连接类型", type = Parameter.Type.STRING, allowNull = false, format = "^DIRECT|HIKVISION$", formatPrompt = "常量DIRECT或HIKVISION", remark = "DIRECT：直连；HIKVISION：海康"),
                    @Parameter(name = "lng", text = "经度", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,16}$", formatPrompt = "1-64位的任意字符", remark = ""),
                    @Parameter(name = "lat", text = "纬度", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,16}$", formatPrompt = "1-64位的任意字符", remark = ""),
                    @Parameter(name = "platform_extend_parameter", text = "平台扩展参数", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "JSON格式") }, returns = @Returns())
    public final Message addCamera() {
        try {
            final String code = (String) this.getParameter(this.parameter, "code");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String url = (String) this.getParameter(this.parameter, "url");
            final String protocolTypeStr = (String) this.getParameter(this.parameter, "protocol_type");
            ProtocolType protocolType = null;
            if (null != protocolTypeStr) {
                protocolType = ProtocolType.valueOf(protocolTypeStr);
            }
            final String connectTypeStr = (String) this.getParameter(this.parameter, "connect_type");
            ConnectType connectType = null;
            if (null != connectTypeStr) {
                connectType = ConnectType.valueOf(connectTypeStr);
            }
            final String lng = (String) this.getParameter(this.parameter, "lng");
            final String lat = (String) this.getParameter(this.parameter, "lat");
            final String platformExtendParameter = (String) this.getParameter(this.parameter,
                    "platform_extend_parameter");
            // 检查参数
            {
                // platformExtendParameter
                if (null != platformExtendParameter) {
                    try {
                        final JSONObject obj = new JSONObject(platformExtendParameter);
                        obj.clear();
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "PLATFORM_EXTEND_PARAMETER_FORMAT_ERROR",
                                "平台扩展参数格式错误");
                    }
                }
            }
            // 添加摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Camera obj = new mms.dao.Camera(con);
                    final Message resultMsg = obj.addCamera(code, name, description, url, protocolType, connectType,
                            lng, lat, platformExtendParameter);
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

    @Method(description = "删除摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.IP, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "uuid_array", text = "摄像头的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeCamera() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Camera obj = new mms.dao.Camera(con);
                    final Message resultMsg = obj.removeCameraByUuid(uuidArray);
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

    @Method(description = "修改摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "uuid", text = "待修改摄像头的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "code", text = "代码", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64}$", formatPrompt = "1-64位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
                    @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
                    @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,128}$", formatPrompt = "1-128位的任意字符", remark = "传递空值则清空"),
                    @Parameter(name = "url", text = "地址", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,128}$", formatPrompt = "1-128位的任意字符", remark = ""),
                    @Parameter(name = "protocol_type", text = "协议类型", type = Parameter.Type.STRING, allowNull = true, format = "^RTSP|RTMP$", formatPrompt = "常量RTSP或RTMP", remark = ""),
                    @Parameter(name = "connect_type", text = "连接类型", type = Parameter.Type.STRING, allowNull = true, format = "^DIRECT|HIKVISION$", formatPrompt = "常量DIRECT或HIKVISION", remark = "DIRECT：直连；HIKVISION：海康"),
                    @Parameter(name = "lng", text = "经度", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,16}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
                    @Parameter(name = "lat", text = "纬度", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,16}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
                    @Parameter(name = "platform_extend_parameter", text = "平台扩展参数", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "JSON格式，传递空值则清空") }, returns = @Returns())
    public final Message modifyCamera() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String code = (String) this.getParameter(this.parameter, "code");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String url = (String) this.getParameter(this.parameter, "url");
            final String protocolTypeStr = (String) this.getParameter(this.parameter, "protocol_type");
            ProtocolType protocolType = null;
            if (null != protocolTypeStr) {
                protocolType = ProtocolType.valueOf(protocolTypeStr);
            }
            final String connectTypeStr = (String) this.getParameter(this.parameter, "connect_type");
            ConnectType connectType = null;
            if (null != connectTypeStr) {
                connectType = ConnectType.valueOf(connectTypeStr);
            }
            final String lng = (String) this.getParameter(this.parameter, "lng");
            final String lat = (String) this.getParameter(this.parameter, "lat");
            final String platformExtendParameter = (String) this.getParameter(this.parameter,
                    "platform_extend_parameter");
            // 检查参数
            {
                // platformExtendParameter
                if (null != platformExtendParameter) {
                    try {
                        final JSONObject obj = new JSONObject(platformExtendParameter);
                        obj.clear();
                    } catch (final Exception e) {
                        return new Message(Message.Status.ERROR, "PLATFORM_EXTEND_PARAMETER_FORMAT_ERROR",
                                "平台扩展参数格式错误");
                    }
                }
            }
            // 修改摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Camera obj = new mms.dao.Camera(con);
                    final Message resultMsg = obj.modifyCamera(uuid, code, name, description, url, protocolType,
                            connectType, lng, lat, platformExtendParameter, null, null);
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

    @Method(description = "获取摄像头", anonymousAccess = false, frequencys = {
            @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
                    @Parameter(name = "uuid_array", text = "摄像头uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
                    @Parameter(name = "code_array", text = "代码的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,64})*$", formatPrompt = "以分号分割的1-64位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
                    @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
                    @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
                    @Parameter(name = "description_like", text = "描述的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,128}$", formatPrompt = "1-128位的任意字符", remark = ""),
                    @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
                    @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
                            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "摄像头的uuid"),
                            @ReturnResult(parentId = "array_id", id = "", name = "code", type = "string[1,64]", isNecessary = true, description = "代码"),
                            @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "名称"),
                            @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,64]", isNecessary = false, description = "描述"),
                            @ReturnResult(parentId = "array_id", id = "", name = "url", type = "string[1,128]", isNecessary = true, description = "地址"),
                            @ReturnResult(parentId = "array_id", id = "", name = "protocol_type", type = "string[1,8]", isNecessary = true, description = "协议类型"),
                            @ReturnResult(parentId = "array_id", id = "", name = "connect_type", type = "string[1,16]", isNecessary = true, description = "连接类型"),
                            @ReturnResult(parentId = "array_id", id = "", name = "lng", type = "string[1,16]", isNecessary = false, description = "经度"),
                            @ReturnResult(parentId = "array_id", id = "", name = "lat", type = "string[1,16]", isNecessary = false, description = "纬度"),
                            @ReturnResult(parentId = "array_id", id = "", name = "platform_extend_parameter", type = "string[1,256]", isNecessary = false, description = "平台扩展参数"),
                            @ReturnResult(parentId = "array_id", id = "", name = "last_capture_data", type = "string[1,64]", isNecessary = false, description = "最后抓拍数据"),
                            @ReturnResult(parentId = "array_id", id = "", name = "last_capture_timestamp", type = "long", isNecessary = false, description = "最后抓拍时间戳"),
                            @ReturnResult(parentId = "array_id", id = "", name = "last_capture_datetime", type = "string[1,30]", isNecessary = false, description = "最后抓拍时间"),
                            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getCamera() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
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
            final String descriptionLike = (String) this.getParameter(this.parameter, "description_like");
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取摄像头
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final mms.dao.Camera obj = new mms.dao.Camera(con);
                    final Message resultMsg = obj.getCamera(uuidArray, codeArray, nameArray, nameLike, descriptionLike,
                            null, offset, rows);
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