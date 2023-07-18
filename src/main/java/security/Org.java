package security;

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

@Module(description = "组织架构")
public final class Org extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public Org() {
    }

    public Org(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加组织架构", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "parent_uuid", text = "父级组织架构的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "type_uuid", text = "类型的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns())
    public final Message addOrg() {
        try {
            final String parentUuid = (String) this.getParameter(this.parameter, "parent_uuid");
            final String typeUuid = (String) this.getParameter(this.parameter, "type_uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            // 添加组织架构
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Org obj = new security.dao.Org(con);
                    final Message resultMsg = obj.addOrg(parentUuid, typeUuid, name, order);
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

    @Method(description = "删除组织架构", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "组织架构的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeOrg() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除组织架构
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Org obj = new security.dao.Org(con);
                    final Message resultMsg = obj.removeOrgByUuid(uuidArray);
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

    @Method(description = "修改组织架构", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid", text = "组织架构的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "parent_uuid", text = "父级组织架构的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "type_uuid", text = "类型的uuid", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns())
    public final Message modifyOrg() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String parentUuid = (String) this.getParameter(this.parameter, "parent_uuid");
            final String typeUuid = (String) this.getParameter(this.parameter, "type_uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            // 修改组织架构
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Org obj = new security.dao.Org(con);
                    final Message resultMsg = obj.modifyOrg(uuid, parentUuid, typeUuid, name, order);
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

    @Method(description = "获取组织架构", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "组织架构的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "parent_uuid_array", text = "父级组织架构的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "type_uuid_array", text = "组织架构类型的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
            @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
            @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
            @Parameter(name = "level_array", text = "级别的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[1-9]\\d(;[1-9]\\d)*$", formatPrompt = "以分号分割的大于等于1的正整数", remark = ""),
            @Parameter(name = "order_array", text = "排序的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[1-9]\\d(;[1-9]\\d)*$", formatPrompt = "以分号分割的大于等于1的正整数", remark = ""),
            @Parameter(name = "order_group_array", text = "排序编号组的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9]{1,6}(;[0-9]{1,6})*$", formatPrompt = "以分号分割的大于等于0且长度为1-6位的数字", remark = ""),
            @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
            @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "type_uuid", type = "string[1,40]", isNecessary = true, description = "类型的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "组织架构的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "level", type = "int", isNecessary = true, description = "级别"),
                @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
                @ReturnResult(parentId = "array_id", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
                @ReturnResult(parentId = "array_id", id = "", name = "type_name", type = "string[1,32]", isNecessary = true, description = "类型的名称") }))
    public final Message getOrg() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] parentUuidArray = null;
            final String parentUuidArrayStr = (String) this.getParameter(this.parameter, "parent_uuid_array");
            if (null != parentUuidArrayStr) {
                parentUuidArray = parentUuidArrayStr.split(";");
            }
            String[] typeUuidArray = null;
            final String typeUuidArrayStr = (String) this.getParameter(this.parameter, "type_uuid_array");
            if (null != typeUuidArrayStr) {
                typeUuidArray = typeUuidArrayStr.split(";");
            }
            String[] nameArray = null;
            final String nameArrayStr = (String) this.getParameter(this.parameter, "name_array");
            if (null != nameArrayStr) {
                nameArray = nameArrayStr.split(";");
            }
            final String nameLike = (String) this.getParameter(this.parameter, "name_like");
            Integer[] levelArray = null;
            final String levelArrayStr = (String) this.getParameter(this.parameter, "level_array");
            if (null != levelArrayStr) {
                final String[] array = levelArrayStr.split(";");
                levelArray = new Integer[array.length];
                for (int i = 0; i < array.length; i++) {
                    levelArray[i] = Integer.valueOf(array[i]);
                }
            }
            Integer[] orderArray = null;
            final String orderArrayStr = (String) this.getParameter(this.parameter, "order_array");
            if (null != orderArrayStr) {
                final String[] array = orderArrayStr.split(";");
                orderArray = new Integer[array.length];
                for (int i = 0; i < array.length; i++) {
                    orderArray[i] = Integer.valueOf(array[i]);
                }
            }
            String[] orderGroupArray = null;
            final String orderGroupArrayStr = (String) this.getParameter(this.parameter, "order_group_array");
            if (null != orderGroupArrayStr) {
                orderGroupArray = orderGroupArrayStr.split(";");
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取组织架构
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Org obj = new security.dao.Org(con);
                    final Message resultMsg = obj.getOrg(uuidArray, parentUuidArray, typeUuidArray, nameArray, nameLike, levelArray, orderGroupArray, null, offset, rows);
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

    @Method(description = "获取父组织架构", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "组织架构的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "type_uuid", type = "string[1,40]", isNecessary = true, description = "类型的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "组织架构的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "level", type = "int", isNecessary = true, description = "级别"),
                @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
                @ReturnResult(parentId = "array_id", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getParentOrg() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            // 获取父组织架构
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Org obj = new security.dao.Org(con);
                    final Message resultMsg = obj.getParentOrg(uuidArray);
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

    @Method(description = "获取子组织架构", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "组织架构的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级组织架构的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "type_uuid", type = "string[1,40]", isNecessary = true, description = "类型的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "组织架构的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "level", type = "int", isNecessary = false, description = "级别"),
                @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
                @ReturnResult(parentId = "array_id", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getChildOrg() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            // 获取子组织架构
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Org obj = new security.dao.Org(con);
                    final Message resultMsg = obj.getChildOrg(uuidArray);
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