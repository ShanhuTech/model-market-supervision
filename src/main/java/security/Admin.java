package security;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
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
import com.palestink.server.sdk.module.annotation.Parameter;
import com.palestink.server.sdk.module.annotation.ReturnResult;
import com.palestink.server.sdk.module.annotation.Returns;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.encrypt.Md5;
import com.palestink.utils.string.StringKit;
import env.db.DruidInstance;
import security.dao.Admin.Status;

@Module(description = "管理员")
public final class Admin extends AbstractModule {
    private HttpServlet httpServlet;
    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;
    private Account account;

    public Admin() {
    }

    public Admin(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
        this.account = new Account(this.httpServlet, this.httpServletRequest, this.httpServletResponse, this.parameter);
    }

    @Method(description = "添加管理员", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "org_uuid", text = "组织架构的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "role_uuid", text = "角色的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z_-]{4,16}$", formatPrompt = "4-16位的数字、大小写字母、下划线或横线", remark = ""),
        @Parameter(name = "password", text = "密码", type = Parameter.Type.STRING, allowNull = false, format = "^\\S{1,16}$", formatPrompt = "1-16位的非空白字符", remark = "") }, returns = @Returns())
    public final Message addAdmin() {
        try {
            final String orgUuid = (String) this.getParameter(this.parameter, "org_uuid");
            final String roleUuid = (String) this.getParameter(this.parameter, "role_uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String password = (String) this.getParameter(this.parameter, "password");
            // 添加管理员
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.addAdmin(orgUuid, roleUuid, name, password);
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

    @Method(description = "删除管理员", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "管理员的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeAdmin() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除管理员
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.removeAdminByUuid(uuidArray);
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

    @Method(description = "修改管理员", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid", text = "管理员的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "org_uuid", text = "组织架构的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "role_uuid", text = "角色的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{4,16}$", formatPrompt = "4-16位的数字、大小写字母、下划线或横线", remark = ""),
        @Parameter(name = "password", text = "密码", type = Parameter.Type.STRING, allowNull = true, format = "^\\S{1,16}$", formatPrompt = "1-16位的非空白字符", remark = ""),
        @Parameter(name = "status", text = "状态", type = Parameter.Type.STRING, allowNull = true, format = "^NORMAL|LOCK$", formatPrompt = "常量NORMAL或LOCK", remark = "NORMAL：正常；LOCK：锁定") }, returns = @Returns())
    public final Message modifyAdmin() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String orgUuid = (String) this.getParameter(this.parameter, "org_uuid");
            final String roleUuid = (String) this.getParameter(this.parameter, "role_uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String password = (String) this.getParameter(this.parameter, "password");
            final String statusStr = (String) this.getParameter(this.parameter, "status");
            Status status = null;
            if (null != statusStr) {
                status = Status.valueOf(statusStr);
            }
            // 修改管理员
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.modifyAdmin(uuid, orgUuid, roleUuid, name, password, null, null, null, status);
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

    @Method(description = "修改管理员信息", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid", text = "管理员的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "nick_name", text = "昵称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "传递空值则清空"),
            @Parameter(name = "real_name", text = "真实姓名", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "传递空值则清空"),
            @Parameter(name = "gender", text = "性别", type = Parameter.Type.STRING, allowNull = true, format = "^0|1$", formatPrompt = "常量0或1", remark = "0：女；1：男。传递空值则清空"),
            @Parameter(name = "birthday_datetime", text = "生日时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33。传递空值则清空"),
            @Parameter(name = "email", text = "email", type = Parameter.Type.STRING, allowNull = true, format = "^[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?$", formatPrompt = "email格式", remark = "传递空值则清空"),
            @Parameter(name = "telephone_numbers", text = "电话号码的集合", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+(;\\d+)*$", formatPrompt = "以分号分割的数字", remark = "传递空值则清空"),
            @Parameter(name = "id_card_type", text = "身份证件类型", type = Parameter.Type.STRING, allowNull = true, format = "^ID|PASSPORT|DRIVER_LICENSE$", formatPrompt = "常量ID、PASSPORT或DRIVER_LICENSE", remark = "ID：身份证；PASSPORT：护照；DRIVER_LICENSE：驾照。传递空值则清空"),
            @Parameter(name = "id_card_number", text = "身份证件号码", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、下划线或横线", remark = "传递空值则清空"),
            @Parameter(name = "avatar", text = "头像", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,32}$", formatPrompt = "1-32位的任意字符", remark = "传递空值则清空"),
            @Parameter(name = "level", text = "等级", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = "传递空值则清空"),
            @Parameter(name = "balance", text = "余额", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+\\.\\d+$", formatPrompt = "大于等于0的小数", remark = "传递空值则清空"),
            @Parameter(name = "score", text = "分值", type = Parameter.Type.STRING, allowNull = true, format = "^-*[1-9]\\d*$", formatPrompt = "正负整数", remark = "传递空值则清空"),
            @Parameter(name = "points", text = "积分", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = "传递空值则清空") }, returns = @Returns())
    public final Message modifyAdminInfo() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String nickName = (String) this.parameter.get("nick_name"); // 允许为空且可清空
            final String realName = (String) this.parameter.get("real_name"); // 允许为空且可清空
            final String gender = (String) this.parameter.get("gender"); // 允许为空且可清空
            final String birthdayDatetime = (String) this.parameter.get("birthday_datetime"); // 允许为空且可清空
            final String email = (String) this.parameter.get("email"); // 允许为空且可清空
            final String telephoneNumbers = (String) this.parameter.get("telephone_numbers"); // 允许为空且可清空
            final String idCardType = (String) this.parameter.get("id_card_type"); // 允许为空且可清空
            final String idCardNumber = (String) this.parameter.get("id_card_number"); // 允许为空且可清空
            final String avatar = (String) this.parameter.get("avatar"); // 允许为空且可清空
            final String level = (String) this.parameter.get("level"); // 允许为空且可清空
            final String balance = (String) this.parameter.get("balance"); // 允许为空且可清空
            final String score = (String) this.parameter.get("score"); // 允许为空且可清空
            final String points = (String) this.parameter.get("points"); // 允许为空且可清空
            // 修改管理员信息
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.modifyAdminInfo(uuid, nickName, realName, gender, birthdayDatetime, email, telephoneNumbers, idCardType, idCardNumber, avatar, level, balance, score, points,
                        null, null, StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"));
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

    @Method(description = "修改管理员自身信息", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "nick_name", text = "昵称", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,32}$", formatPrompt = "1-32位的任意字符", remark = "传递空值则清空"),
            @Parameter(name = "real_name", text = "真实姓名", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,32}$", formatPrompt = "1-32位的任意字符", remark = "传递空值则清空"),
            @Parameter(name = "gender", text = "性别", type = Parameter.Type.STRING, allowNull = true, format = "^0|1$", formatPrompt = "常量0或1", remark = "0：女；1：男。传递空值则清空"),
            @Parameter(name = "birthday_datetime", text = "生日时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33。传递空值则清空"),
            @Parameter(name = "email", text = "email", type = Parameter.Type.STRING, allowNull = true, format = "^[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?$", formatPrompt = "email格式", remark = "传递空值则清空"),
            @Parameter(name = "telephone_numbers", text = "电话号码的集合", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+(;\\d+)*$", formatPrompt = "以分号分割的数字", remark = "传递空值则清空"),
            @Parameter(name = "id_card_type", text = "身份证件类型", type = Parameter.Type.STRING, allowNull = true, format = "^ID|PASSPORT|DRIVER_LICENSE$", formatPrompt = "常量ID、PASSPORT或DRIVER_LICENSE", remark = "ID：身份证；PASSPORT：护照；DRIVER_LICENSE：驾照。传递空值则清空"),
            @Parameter(name = "id_card_number", text = "身份证件号码", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,32}$", formatPrompt = "1-32位的任意字符", remark = "传递空值则清空"),
            @Parameter(name = "avatar", text = "头像", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,32}$", formatPrompt = "1-32位的任意字符", remark = "传递空值则清空"),
            @Parameter(name = "level", text = "等级", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = "传递空值则清空"),
            @Parameter(name = "balance", text = "余额", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+\\.\\d+$", formatPrompt = "大于等于0的小数", remark = "传递空值则清空"),
            @Parameter(name = "score", text = "分值", type = Parameter.Type.STRING, allowNull = true, format = "^-*[1-9]\\d*$", formatPrompt = "正负整数", remark = "传递空值则清空"),
            @Parameter(name = "points", text = "积分", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = "传递空值则清空") }, returns = @Returns())
    public final Message modifyAdminInfoBySelf() {
        try {
            String accountUuid = null;
            // 从账户令牌中获取信息
            {
                final Message resultMsg = this.account.getTokenData(Framework.ACCOUNT_TOKEN_UUID);
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                accountUuid = ((JSONObject) resultMsg.getContent()).getString("data");
            }
            final String nickName = (String) this.parameter.get("nick_name"); // 允许为空且可清空
            final String realName = (String) this.parameter.get("real_name"); // 允许为空且可清空
            final String gender = (String) this.parameter.get("gender"); // 允许为空且可清空
            final String birthdayDatetime = (String) this.parameter.get("birthday_datetime"); // 允许为空且可清空
            final String email = (String) this.parameter.get("email"); // 允许为空且可清空
            final String telephoneNumbers = (String) this.parameter.get("telephone_numbers"); // 允许为空且可清空
            final String idCardType = (String) this.parameter.get("id_card_type"); // 允许为空且可清空
            final String idCardNumber = (String) this.parameter.get("id_card_number"); // 允许为空且可清空
            final String avatar = (String) this.parameter.get("avatar"); // 允许为空且可清空
            final String level = (String) this.parameter.get("level"); // 允许为空且可清空
            final String balance = (String) this.parameter.get("balance"); // 允许为空且可清空
            final String score = (String) this.parameter.get("score"); // 允许为空且可清空
            final String points = (String) this.parameter.get("points"); // 允许为空且可清空
            // 修改管理员信息
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.modifyAdminInfo(accountUuid, nickName, realName, gender, birthdayDatetime, email, telephoneNumbers, idCardType, idCardNumber, avatar, level, balance, score,
                        points, null, null, StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"));
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

    @Method(description = "修改管理员自身密码", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "old_password", text = "旧密码", type = Parameter.Type.STRING, allowNull = false, format = "^\\S{1,16}$", formatPrompt = "1-16位的非空白字符", remark = ""),
            @Parameter(name = "new_password", text = "新密码", type = Parameter.Type.STRING, allowNull = false, format = "^\\S{1,16}$", formatPrompt = "1-16位的非空白字符", remark = "") }, returns = @Returns())
    public final Message modifyAdminPasswordBySelf() {
        try {
            final String oldPassword = (String) this.getParameter(this.parameter, "old_password");
            final String newPassword = (String) this.getParameter(this.parameter, "new_password");
            String accountUuid = null;
            // 从账户令牌中获取信息
            {
                final Message resultMsg = this.account.getTokenData(Framework.ACCOUNT_TOKEN_UUID);
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                accountUuid = ((JSONObject) resultMsg.getContent()).getString("data");
            }
            String passwordInDb = null;
            // 获取管理员密码
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.getAdmin(new String[] { accountUuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    this.messageResultHandler(resultMsg, con, true);
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONObject resultObj = (JSONObject) resultMsg.getContent();
                    passwordInDb = resultObj.getJSONArray("array").getJSONObject(0).getString("password");
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
            // 检查旧密码和数据库存储的密码是否相同
            {
                if (!passwordInDb.equalsIgnoreCase(Md5.encode((oldPassword).getBytes()))) {
                    return new Message(Message.Status.ERROR, "OLD_PASSWORD_ERROR", "旧密码错误");
                }
            }
            // 修改新密码
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.modifyAdmin(accountUuid, null, null, null, newPassword, null, null, null, null);
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

    @Method(description = "获取管理员", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "管理员uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "org_uuid_array", text = "组织架构uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "role_uuid_array", text = "角色uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{4,16}(;[0-9a-zA-Z_-]{4,16})*$", formatPrompt = "以分号分割的4-16位的数字、大小写字母、下划线或横线", remark = ""),
            @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{1,16}$", formatPrompt = "1-16位的数字、大小写字母、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "start_frozen_datetime", text = "开始冻结时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_frozen_datetime", text = "结束冻结时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "status_array", text = "状态的集合", type = Parameter.Type.STRING, allowNull = true, format = "^(NORMAL|FROZEN|LOCK)(;(NORMAL|FROZEN|LOCK))*$", formatPrompt = "以分号分割的常量NORMAL、FROZEN或LOCK", remark = "NORMAL：正常；FROZEN：冻结；LOCK：锁定"),
            @Parameter(name = "start_create_datetime", text = "开始创建时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_create_datetime", text = "结束创建时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = ""),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "管理员的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "org_uuid", type = "string[1,40]", isNecessary = true, description = "组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "role_uuid", type = "string[1,40]", isNecessary = true, description = "角色的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,16]", isNecessary = true, description = "管理员的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "failed_retry_count", type = "int", isNecessary = true, description = "失败重试次数"),
                @ReturnResult(parentId = "array_id", id = "", name = "frozen_timestamp", type = "long", isNecessary = false, description = "冻结时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "frozen_datetime", type = "string[1,30]", isNecessary = false, description = "冻结时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "status", type = "string[1,16]", isNecessary = true, description = "状态"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "org_name", type = "string[1,32]", isNecessary = true, description = "组织架构的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "role_name", type = "string[1,32]", isNecessary = true, description = "角色的名称") }))
    public final Message getAdmin() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] orgArray = null;
            final String orgArrayStr = (String) this.getParameter(this.parameter, "org_uuid_array");
            if (null != orgArrayStr) {
                orgArray = orgArrayStr.split(";");
            }
            String[] roleArray = null;
            final String roleArrayStr = (String) this.getParameter(this.parameter, "role_uuid_array");
            if (null != roleArrayStr) {
                roleArray = roleArrayStr.split(";");
            }
            String[] nameArray = null;
            final String nameArrayStr = (String) this.getParameter(this.parameter, "name_array");
            if (null != nameArrayStr) {
                nameArray = nameArrayStr.split(";");
            }
            final String nameLike = (String) this.getParameter(this.parameter, "name_like");
            final ArrayList<String> frozenDatetimeRange = new ArrayList<>();
            final String startFrozenDatetime = (String) this.getParameter(this.parameter, "start_frozen_datetime");
            final String endFrozenDatetime = (String) this.getParameter(this.parameter, "end_frozen_datetime");
            if (null != startFrozenDatetime) {
                frozenDatetimeRange.add(startFrozenDatetime);
                if (null != endFrozenDatetime) {
                    frozenDatetimeRange.add(endFrozenDatetime);
                }
            }
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
            JSONObject resultObj = null;
            // 获取管理员
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.getAdmin(uuidArray, orgArray, roleArray, nameArray, nameLike, frozenDatetimeRange.toArray(new String[frozenDatetimeRange.size()]), statusArray,
                        createDatetimeRange.toArray(new String[createDatetimeRange.size()]), null, offset, rows);
                    this.messageResultHandler(resultMsg, con, true);
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    resultObj = (JSONObject) resultMsg.getContent();
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
            // 数据脱敏
            {
                final JSONArray array = resultObj.getJSONArray("array");
                for (int i = 0; i < array.length(); i++) {
                    final JSONObject obj = array.getJSONObject(i);
                    obj.remove("permissions");
                    obj.remove("password");
                    obj.remove("login_token");
                }
                return new Message(Message.Status.SUCCESS, resultObj, null);
            }
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    @Method(description = "获取管理员信息", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "管理员uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "nick_name_array", text = "昵称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "nick_name_like", text = "昵称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "real_name_array", text = "真实姓名的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "real_name_like", text = "真实姓名的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "gender_array", text = "性别的集合", type = Parameter.Type.STRING, allowNull = true, format = "^(0|1)(;(0|1))*$", formatPrompt = "以分号分割的常量0或1", remark = "0：女；1：男"),
            @Parameter(name = "start_birthday_datetime", text = "开始生日时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_birthday_datetime", text = "结束生日时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "email_array", text = "email的集合", type = Parameter.Type.STRING, allowNull = true, format = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?(;[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?)$", formatPrompt = "以分号分割的email格式", remark = ""),
            @Parameter(name = "email_like", text = "email的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?$", formatPrompt = "email格式", remark = ""),
            @Parameter(name = "telephone_numbers_like", text = "电话号码的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^\\d$", formatPrompt = "数字", remark = ""),
            @Parameter(name = "id_card_type_array", text = "身份证件类型的集合", type = Parameter.Type.STRING, allowNull = true, format = "^(ID|PASSPORT|DRIVER_LICENSE)(;(ID|PASSPORT|DRIVER_LICENSE))*$", formatPrompt = "以分号分割的常量ID、PASSPORT或DRIVER_LICENSE", remark = "ID：身份证；PASSPORT：护照；DRIVER_LICENSE：驾照"),
            @Parameter(name = "id_card_number_array", text = "身份证件号码的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{1,32}(;[0-9a-zA-Z_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、下划线或横线", remark = ""),
            @Parameter(name = "level_array", text = "等级的集合", type = Parameter.Type.STRING, allowNull = true, format = "^\\d(;\\d)*$", formatPrompt = "以分号分割的数字", remark = ""),
            @Parameter(name = "start_balance", text = "开始余额", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+\\.\\d+$", formatPrompt = "大于等于0的小数", remark = ""),
            @Parameter(name = "end_balance", text = "开始余额", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+\\.\\d+$", formatPrompt = "大于等于0的小数", remark = ""),
            @Parameter(name = "start_score", text = "开始分值", type = Parameter.Type.STRING, allowNull = true, format = "^-*[1-9]\\d*$", formatPrompt = "正负整数", remark = ""),
            @Parameter(name = "end_score", text = "结束分值", type = Parameter.Type.STRING, allowNull = true, format = "^-*[1-9]\\d*$", formatPrompt = "正负整数", remark = ""),
            @Parameter(name = "start_points", text = "开始积分", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = ""),
            @Parameter(name = "end_points", text = "结束积分", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = ""),
            @Parameter(name = "last_login_ip_array", text = "最后登入ip的集合", type = Parameter.Type.STRING, allowNull = true, format = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])(;^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5]))*$", formatPrompt = "以分号分割的ipv4地址格式", remark = ""),
            @Parameter(name = "start_last_login_datetime", text = "开始最后登入时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_last_login_datetime", text = "结束最后登入时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "start_last_update_datetime", text = "开始最后修改时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_last_update_datetime", text = "结束最后修改时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = ""),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "管理员的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "org_uuid", type = "string[1,40]", isNecessary = true, description = "组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "role_uuid", type = "string[1,40]", isNecessary = true, description = "角色的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,16]", isNecessary = true, description = "管理员的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "failed_retry_count", type = "int", isNecessary = true, description = "失败重试次数"),
                @ReturnResult(parentId = "array_id", id = "", name = "frozen_timestamp", type = "long", isNecessary = false, description = "冻结时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "frozen_datetime", type = "string[1,30]", isNecessary = false, description = "冻结时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "status", type = "string[1,16]", isNecessary = true, description = "状态"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "org_name", type = "string[1,32]", isNecessary = true, description = "组织架构的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "role_name", type = "string[1,32]", isNecessary = true, description = "角色的名称") }))
    public final Message getAdminInfo() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] nickNameArray = null;
            final String nickNameStr = (String) this.getParameter(this.parameter, "nick_name_array");
            if (null != nickNameStr) {
                nickNameArray = nickNameStr.split(";");
            }
            final String nickNameLike = (String) this.getParameter(this.parameter, "nick_name_like");
            String[] realNameArray = null;
            final String realNameStr = (String) this.getParameter(this.parameter, "real_name_array");
            if (null != realNameStr) {
                realNameArray = realNameStr.split(";");
            }
            final String realNameLike = (String) this.getParameter(this.parameter, "real_name_like");
            String[] genderArray = null;
            final String genderStr = (String) this.getParameter(this.parameter, "gender_array");
            if (null != genderStr) {
                genderArray = genderStr.split(";");
            }
            final ArrayList<String> birthdayDatetimeRange = new ArrayList<>();
            final String startBirthdayDatetime = (String) this.getParameter(this.parameter, "start_birthday_datetime");
            final String endBirthdayDatetime = (String) this.getParameter(this.parameter, "end_birthday_datetime");
            if (null != startBirthdayDatetime) {
                birthdayDatetimeRange.add(startBirthdayDatetime);
                if (null != endBirthdayDatetime) {
                    birthdayDatetimeRange.add(endBirthdayDatetime);
                }
            }
            String[] emailArray = null;
            final String emailStr = (String) this.getParameter(this.parameter, "email_array");
            if (null != emailStr) {
                emailArray = emailStr.split(";");
            }
            final String emailLike = (String) this.getParameter(this.parameter, "email_like");
            final String telephoneNumbersLike = (String) this.getParameter(this.parameter, "telephone_numbers_like");
            String[] idCardTypeArray = null;
            final String idCardTypeStr = (String) this.getParameter(this.parameter, "id_card_type_array");
            if (null != idCardTypeStr) {
                idCardTypeArray = idCardTypeStr.split(";");
            }
            String[] idCardNumberArray = null;
            final String idCardNumberStr = (String) this.getParameter(this.parameter, "id_card_number_array");
            if (null != idCardNumberStr) {
                idCardNumberArray = idCardNumberStr.split(";");
            }
            String[] levelArray = null;
            final String levelStr = (String) this.getParameter(this.parameter, "level_array");
            if (null != levelStr) {
                levelArray = levelStr.split(";");
            }
            final ArrayList<String> balanceRange = new ArrayList<>();
            final String startBalance = (String) this.getParameter(this.parameter, "start_balance");
            final String endBalance = (String) this.getParameter(this.parameter, "end_balance");
            if (null != startBalance) {
                balanceRange.add(startBalance);
                if (null != endBalance) {
                    balanceRange.add(endBalance);
                }
            }
            final ArrayList<String> scoreRange = new ArrayList<>();
            final String startScore = (String) this.getParameter(this.parameter, "start_score");
            final String endScore = (String) this.getParameter(this.parameter, "end_score");
            if (null != startScore) {
                scoreRange.add(startScore);
                if (null != endScore) {
                    scoreRange.add(endScore);
                }
            }
            final ArrayList<String> pointsRange = new ArrayList<>();
            final String startPoints = (String) this.getParameter(this.parameter, "start_points");
            final String endPoints = (String) this.getParameter(this.parameter, "end_points");
            if (null != startPoints) {
                pointsRange.add(startPoints);
                if (null != endPoints) {
                    pointsRange.add(endPoints);
                }
            }
            String[] lastLoginIpArray = null;
            final String lastLoginIpStr = (String) this.getParameter(this.parameter, "last_login_ip_array");
            if (null != lastLoginIpStr) {
                lastLoginIpArray = lastLoginIpStr.split(";");
            }
            final ArrayList<String> lastLoginDatetimeRange = new ArrayList<>();
            final String startLastLoginDatetime = (String) this.getParameter(this.parameter, "start_last_login_datetime");
            final String endLastLoginDatetime = (String) this.getParameter(this.parameter, "end_last_login_datetime");
            if (null != startLastLoginDatetime) {
                lastLoginDatetimeRange.add(startLastLoginDatetime);
                if (null != endLastLoginDatetime) {
                    lastLoginDatetimeRange.add(endLastLoginDatetime);
                }
            }
            final ArrayList<String> lastUpdateDatetimeRange = new ArrayList<>();
            final String startLastUpdateDatetime = (String) this.getParameter(this.parameter, "start_last_update_datetime");
            final String endLastUpdateDatetime = (String) this.getParameter(this.parameter, "end_last_update_datetime");
            if (null != startLastUpdateDatetime) {
                lastUpdateDatetimeRange.add(startLastUpdateDatetime);
                if (null != endLastUpdateDatetime) {
                    lastUpdateDatetimeRange.add(endLastUpdateDatetime);
                }
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取管理员
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.getAdminInfo(uuidArray, nickNameArray, nickNameLike, realNameArray, realNameLike, genderArray,
                        birthdayDatetimeRange.toArray(new String[birthdayDatetimeRange.size()]), emailArray, emailLike, telephoneNumbersLike, idCardTypeArray, idCardNumberArray, levelArray,
                        balanceRange.toArray(new String[balanceRange.size()]), scoreRange.toArray(new String[scoreRange.size()]), pointsRange.toArray(new String[pointsRange.size()]), lastLoginIpArray,
                        lastLoginDatetimeRange.toArray(new String[lastLoginDatetimeRange.size()]), lastUpdateDatetimeRange.toArray(new String[lastUpdateDatetimeRange.size()]), null, offset, rows);
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

    @Method(description = "获取管理员自身信息", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "nick_name_array", text = "昵称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "nick_name_like", text = "昵称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "real_name_array", text = "真实姓名的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "real_name_like", text = "真实姓名的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "gender_array", text = "性别的集合", type = Parameter.Type.STRING, allowNull = true, format = "^(0|1)(;(0|1))*$", formatPrompt = "以分号分割的常量0或1", remark = "0：女；1：男"),
            @Parameter(name = "start_birthday_datetime", text = "开始生日时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_birthday_datetime", text = "结束生日时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "email_array", text = "email的集合", type = Parameter.Type.STRING, allowNull = true, format = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?(;[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?)$", formatPrompt = "以分号分割的email格式", remark = ""),
            @Parameter(name = "email_like", text = "email的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?$", formatPrompt = "email格式", remark = ""),
            @Parameter(name = "telephone_numbers_like", text = "电话号码的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^\\d$", formatPrompt = "数字", remark = ""),
            @Parameter(name = "id_card_type_array", text = "身份证件类型的集合", type = Parameter.Type.STRING, allowNull = true, format = "^(ID|PASSPORT|DRIVER_LICENSE)(;(ID|PASSPORT|DRIVER_LICENSE))*$", formatPrompt = "以分号分割的常量ID、PASSPORT或DRIVER_LICENSE", remark = "ID：身份证；PASSPORT：护照；DRIVER_LICENSE：驾照"),
            @Parameter(name = "id_card_number_array", text = "身份证件号码的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{1,32}(;[0-9a-zA-Z_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、下划线或横线", remark = ""),
            @Parameter(name = "level_array", text = "等级的集合", type = Parameter.Type.STRING, allowNull = true, format = "^\\d(;\\d)*$", formatPrompt = "以分号分割的数字", remark = ""),
            @Parameter(name = "start_balance", text = "开始余额", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+\\.\\d+$", formatPrompt = "大于等于0的小数", remark = ""),
            @Parameter(name = "end_balance", text = "开始余额", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+\\.\\d+$", formatPrompt = "大于等于0的小数", remark = ""),
            @Parameter(name = "start_score", text = "开始分值", type = Parameter.Type.STRING, allowNull = true, format = "^-*[1-9]\\d*$", formatPrompt = "正负整数", remark = ""),
            @Parameter(name = "end_score", text = "结束分值", type = Parameter.Type.STRING, allowNull = true, format = "^-*[1-9]\\d*$", formatPrompt = "正负整数", remark = ""),
            @Parameter(name = "start_points", text = "开始积分", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = ""),
            @Parameter(name = "end_points", text = "结束积分", type = Parameter.Type.STRING, allowNull = true, format = "^\\d+$", formatPrompt = "数字", remark = ""),
            @Parameter(name = "last_login_ip_array", text = "最后登入ip的集合", type = Parameter.Type.STRING, allowNull = true, format = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])(;^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5]))*$", formatPrompt = "以分号分割的ipv4地址格式", remark = ""),
            @Parameter(name = "start_last_login_datetime", text = "开始最后登入时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_last_login_datetime", text = "结束最后登入时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "start_last_update_datetime", text = "开始最后修改时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "end_last_update_datetime", text = "结束最后修改时间", type = Parameter.Type.STRING, allowNull = true, format = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", formatPrompt = "yyyy-MM-dd HH:mm:ss时间格式", remark = "如：1994-06-17 09:40:33"),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = ""),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "管理员的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "org_uuid", type = "string[1,40]", isNecessary = true, description = "组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "role_uuid", type = "string[1,40]", isNecessary = true, description = "角色的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,16]", isNecessary = true, description = "管理员的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "failed_retry_count", type = "int", isNecessary = true, description = "失败重试次数"),
                @ReturnResult(parentId = "array_id", id = "", name = "frozen_timestamp", type = "long", isNecessary = false, description = "冻结时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "frozen_datetime", type = "string[1,30]", isNecessary = false, description = "冻结时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "status", type = "string[1,16]", isNecessary = true, description = "状态"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "org_name", type = "string[1,32]", isNecessary = true, description = "组织架构的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "role_name", type = "string[1,32]", isNecessary = true, description = "角色的名称") }))
    public final Message getAdminInfoBySelf() {
        try {
            String accountUuid = null;
            // 从账户令牌中获取信息
            {
                final Message resultMsg = this.account.getTokenData(Framework.ACCOUNT_TOKEN_UUID);
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                accountUuid = ((JSONObject) resultMsg.getContent()).getString("data");
            }
            final String[] uuidArray = new String[] { accountUuid };
            String[] nickNameArray = null;
            final String nickNameStr = (String) this.getParameter(this.parameter, "nick_name_array");
            if (null != nickNameStr) {
                nickNameArray = nickNameStr.split(";");
            }
            final String nickNameLike = (String) this.getParameter(this.parameter, "nick_name_like");
            String[] realNameArray = null;
            final String realNameStr = (String) this.getParameter(this.parameter, "real_name_array");
            if (null != realNameStr) {
                realNameArray = realNameStr.split(";");
            }
            final String realNameLike = (String) this.getParameter(this.parameter, "real_name_like");
            String[] genderArray = null;
            final String genderStr = (String) this.getParameter(this.parameter, "gender_array");
            if (null != genderStr) {
                genderArray = genderStr.split(";");
            }
            final ArrayList<String> birthdayDatetimeRange = new ArrayList<>();
            final String startBirthdayDatetime = (String) this.getParameter(this.parameter, "start_birthday_datetime");
            final String endBirthdayDatetime = (String) this.getParameter(this.parameter, "end_birthday_datetime");
            if (null != startBirthdayDatetime) {
                birthdayDatetimeRange.add(startBirthdayDatetime);
                if (null != endBirthdayDatetime) {
                    birthdayDatetimeRange.add(endBirthdayDatetime);
                }
            }
            String[] emailArray = null;
            final String emailStr = (String) this.getParameter(this.parameter, "email_array");
            if (null != emailStr) {
                emailArray = emailStr.split(";");
            }
            final String emailLike = (String) this.getParameter(this.parameter, "email_like");
            final String telephoneNumbersLike = (String) this.getParameter(this.parameter, "telephone_numbers_like");
            String[] idCardTypeArray = null;
            final String idCardTypeStr = (String) this.getParameter(this.parameter, "id_card_type_array");
            if (null != idCardTypeStr) {
                idCardTypeArray = idCardTypeStr.split(";");
            }
            String[] idCardNumberArray = null;
            final String idCardNumberStr = (String) this.getParameter(this.parameter, "id_card_number_array");
            if (null != idCardNumberStr) {
                idCardNumberArray = idCardNumberStr.split(";");
            }
            String[] levelArray = null;
            final String levelStr = (String) this.getParameter(this.parameter, "level_array");
            if (null != levelStr) {
                levelArray = levelStr.split(";");
            }
            final ArrayList<String> balanceRange = new ArrayList<>();
            final String startBalance = (String) this.getParameter(this.parameter, "start_balance");
            final String endBalance = (String) this.getParameter(this.parameter, "end_balance");
            if (null != startBalance) {
                balanceRange.add(startBalance);
                if (null != endBalance) {
                    balanceRange.add(endBalance);
                }
            }
            final ArrayList<String> scoreRange = new ArrayList<>();
            final String startScore = (String) this.getParameter(this.parameter, "start_score");
            final String endScore = (String) this.getParameter(this.parameter, "end_score");
            if (null != startScore) {
                scoreRange.add(startScore);
                if (null != endScore) {
                    scoreRange.add(endScore);
                }
            }
            final ArrayList<String> pointsRange = new ArrayList<>();
            final String startPoints = (String) this.getParameter(this.parameter, "start_points");
            final String endPoints = (String) this.getParameter(this.parameter, "end_points");
            if (null != startPoints) {
                pointsRange.add(startPoints);
                if (null != endPoints) {
                    pointsRange.add(endPoints);
                }
            }
            String[] lastLoginIpArray = null;
            final String lastLoginIpStr = (String) this.getParameter(this.parameter, "last_login_ip_array");
            if (null != lastLoginIpStr) {
                lastLoginIpArray = lastLoginIpStr.split(";");
            }
            final ArrayList<String> lastLoginDatetimeRange = new ArrayList<>();
            final String startLastLoginDatetime = (String) this.getParameter(this.parameter, "start_last_login_datetime");
            final String endLastLoginDatetime = (String) this.getParameter(this.parameter, "end_last_login_datetime");
            if (null != startLastLoginDatetime) {
                lastLoginDatetimeRange.add(startLastLoginDatetime);
                if (null != endLastLoginDatetime) {
                    lastLoginDatetimeRange.add(endLastLoginDatetime);
                }
            }
            final ArrayList<String> lastUpdateDatetimeRange = new ArrayList<>();
            final String startLastUpdateDatetime = (String) this.getParameter(this.parameter, "start_last_update_datetime");
            final String endLastUpdateDatetime = (String) this.getParameter(this.parameter, "end_last_update_datetime");
            if (null != startLastUpdateDatetime) {
                lastUpdateDatetimeRange.add(startLastUpdateDatetime);
                if (null != endLastUpdateDatetime) {
                    lastUpdateDatetimeRange.add(endLastUpdateDatetime);
                }
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取管理员
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.getAdminInfo(uuidArray, nickNameArray, nickNameLike, realNameArray, realNameLike, genderArray,
                        birthdayDatetimeRange.toArray(new String[birthdayDatetimeRange.size()]), emailArray, emailLike, telephoneNumbersLike, idCardTypeArray, idCardNumberArray, levelArray,
                        balanceRange.toArray(new String[balanceRange.size()]), scoreRange.toArray(new String[scoreRange.size()]), pointsRange.toArray(new String[pointsRange.size()]), lastLoginIpArray,
                        lastLoginDatetimeRange.toArray(new String[lastLoginDatetimeRange.size()]), lastUpdateDatetimeRange.toArray(new String[lastUpdateDatetimeRange.size()]), null, offset, rows);
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

    @Method(description = "管理员登入", anonymousAccess = true, frequencys = { @Frequency(source = Frequency.Source.IP, count = 100, unit = Frequency.Unit.DAY) }, methodType = Method.Type.GET, parameters = {
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z_-]{4,16}$", formatPrompt = "4-16位的数字、大小写字母、下划线或横线", remark = ""),
        @Parameter(name = "password", text = "密码", type = Parameter.Type.STRING, allowNull = false, format = "^\\S{1,16}$", formatPrompt = "1-16位的非空白字符", remark = "") }, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "name", type = "string[4,16]", isNecessary = true, description = "名称"),
            @ReturnResult(parentId = "", id = "", name = "token", type = "string[1,]", isNecessary = true, description = "token"),
            @ReturnResult(parentId = "", id = "", name = "token_expires_timestamp", type = "long", isNecessary = false, description = "token过期时间戳（单位：毫秒）") }))
    public final Message adminLogin() {
        try {
            final String name = (String) this.getParameter(this.parameter, "name");
            final String password = (String) this.getParameter(this.parameter, "password");
            // 管理员登入
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.adminLogin(name, password, this.httpServletRequest.getRemoteAddr());
                    this.messageResultHandler(resultMsg, con, true);
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONObject resultObj = (JSONObject) resultMsg.getContent();
                    return new Message(Message.Status.SUCCESS, resultObj, null);
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

    @Method(description = "管理员登出", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {}, returns = @Returns())
    public final Message adminLogoff() {
        return new Message(Message.Status.SUCCESS, null, null);
    }

    /**
     * 比较管理员登入Token
     * 
     * @return 消息对象
     */
    private final Message compareAdminLoginToken() {
        try {
            String accountUuid = null;
            String loginToken = null;
            // 从账户令牌中获取信息
            {
                Message resultMsg = this.account.getTokenData(Framework.ACCOUNT_TOKEN_UUID);
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                accountUuid = ((JSONObject) resultMsg.getContent()).getString("data");
                resultMsg = this.account.getTokenData(security.dao.Admin.JWT_KEY_MAP.get("LOGIN_TOKEN"));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                loginToken = ((JSONObject) resultMsg.getContent()).getString("data");
            }
            JSONObject resultObj = null;
            // 获取账户的数据库登陆令牌是否存在
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Admin obj = new security.dao.Admin(con);
                    final Message resultMsg = obj.getAdmin(new String[] { accountUuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    this.messageResultHandler(resultMsg, con, true);
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    resultObj = (JSONObject) resultMsg.getContent();
                } catch (final Exception e) {
                    return this.catchHandler(con, e);
                } finally {
                    this.finallyHandler(con);
                }
            }
            {
                final String dbLoginToken = resultObj.getJSONArray("array").getJSONObject(0).getString("login_token");
                if (!dbLoginToken.equalsIgnoreCase(loginToken)) {
                    return new Message(Message.Status.ERROR, "LOGIN_TOKEN_REFRESHED", "登陆令牌已刷新");
                }
            }
            return new Message(Message.Status.SUCCESS, null, null);
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    @Method(description = "刷新管理员令牌", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 100, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {}, returns = @Returns())
    public final Message refreshAdminToken() {
        // 比较管理员自身的登陆令牌（确保单点登入，如果不需要单点登入可以注销代码）
        {
            final Message resultMsg = this.compareAdminLoginToken();
            if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                return resultMsg;
            }
        }
        // 刷新令牌
        {
            final JSONArray array = new JSONArray();
            for (final Map.Entry<String, String> entry : security.dao.Admin.JWT_KEY_MAP.entrySet()) {
                final String value = entry.getValue();
                final JSONObject obj = new JSONObject();
                obj.put("name", value);
                array.put(obj);
            }
            final Message resultMsg = this.account.refreshToken(array);
            return resultMsg;
        }
    }
}