package security;

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
import security.dao.Admin;

@Module(description = "角色")
public final class Role extends AbstractModule {
    private HttpServlet httpServlet;
    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;
    private Account account;

    public Role() {
    }

    public Role(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
        this.account = new Account(this.httpServlet, this.httpServletRequest, this.httpServletResponse, this.parameter);
    }

    @Method(description = "添加角色", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = ""),
        @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns())
    public final Message addRole() {
        try {
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.getParameter(this.parameter, "description");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            // 添加角色
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Role role = new security.dao.Role(con);
                    final Message resultMsg = role.addRole(name, description, null, order);
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

    @Method(description = "删除角色", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "角色的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeRole() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除角色
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Role role = new security.dao.Role(con);
                    final Message resultMsg = role.removeRoleByUuid(uuidArray);
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

    @Method(description = "修改角色", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 1, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid", text = "角色的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
        @Parameter(name = "permission_array", text = "权限的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z.*]{1,64}(;[0-9a-zA-Z.*]{1,64})*$", formatPrompt = "以分号分割的1-64位的数字、大小写字母、点或星号集合", remark = ""),
        @Parameter(name = "menu_array", text = "菜单uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns())
    public final Message modifyRole() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String description = (String) this.parameter.get("description"); // 允许为空且可清空
            final String permissionArray = (String) this.getParameter(this.parameter, "permission_array");
            final String menuArray = (String) this.getParameter(this.parameter, "menu_array");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            // 修改角色
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Role role = new security.dao.Role(con);
                    final Message resultMsg = role.modifyRole(uuid, name, description, permissionArray, menuArray, order);
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

    @Method(description = "获取角色", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "角色uuid的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{4,16}(;[0-9a-zA-Z_-]{4,16})*$", formatPrompt = "以分号分割的4-16位的数字、大小写字母、下划线或横线", remark = ""),
        @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z_-]{1,16}$", formatPrompt = "1-16位的数字、大小写字母、下划线或横线", remark = "从头匹配"),
        @Parameter(name = "order_array", text = "排序的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[1-9]\\d(;[1-9]\\d)*$", formatPrompt = "以分号分割的大于等于1的正整数", remark = ""),
        @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
        @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "角色的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,64]", isNecessary = false, description = "描述"),
            @ReturnResult(parentId = "array_id", id = "", name = "permissions", type = "string[1,]", isNecessary = false, description = "权限"),
            @ReturnResult(parentId = "array_id", id = "menus", name = "menus", type = "array", isNecessary = false, description = "菜单"),
            @ReturnResult(parentId = "menus", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "菜单的uuid"),
            @ReturnResult(parentId = "menus", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级菜单的uuid"),
            @ReturnResult(parentId = "menus", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "菜单的名称"),
            @ReturnResult(parentId = "menus", id = "", name = "text", type = "string[1,32]", isNecessary = true, description = "文本的名称"),
            @ReturnResult(parentId = "menus", id = "", name = "description", type = "string[1,64]", isNecessary = true, description = "描述"),
            @ReturnResult(parentId = "menus", id = "", name = "link", type = "string[1,256]", isNecessary = true, description = "链接"),
            @ReturnResult(parentId = "menus", id = "", name = "icon", type = "string[1,32]", isNecessary = true, description = "图标"),
            @ReturnResult(parentId = "menus", id = "", name = "level", type = "int", isNecessary = false, description = "级别"),
            @ReturnResult(parentId = "menus", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
            @ReturnResult(parentId = "menus", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
            @ReturnResult(parentId = "menus", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "menus", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getRole() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            String[] nameArray = null;
            final String nameArrayStr = (String) this.getParameter(this.parameter, "name_array");
            if (null != nameArrayStr) {
                nameArray = nameArrayStr.split(";");
            }
            final String nameLike = (String) this.getParameter(this.parameter, "name_like");
            Integer[] orderArray = null;
            final String orderArrayStr = (String) this.getParameter(this.parameter, "order_array");
            if (null != orderArrayStr) {
                final String[] array = orderArrayStr.split(";");
                orderArray = new Integer[array.length];
                for (int i = 0; i < array.length; i++) {
                    orderArray[i] = Integer.valueOf(array[i]);
                }
            }
            final Integer offset = (Integer) this.getParameter(this.parameter, "offset");
            final Integer rows = (Integer) this.getParameter(this.parameter, "rows");
            // 获取角色
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Role role = new security.dao.Role(con);
                    final Message resultMsg = role.getRole(uuidArray, nameArray, nameLike, orderArray, null, offset, rows);
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

    @Method(description = "获取自身角色", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {}, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "角色的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,64]", isNecessary = false, description = "描述"),
            @ReturnResult(parentId = "array_id", id = "", name = "permissions", type = "string[1,]", isNecessary = false, description = "权限"),
            @ReturnResult(parentId = "array_id", id = "menus", name = "menus", type = "array", isNecessary = false, description = "菜单"),
            @ReturnResult(parentId = "menus", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "菜单的uuid"),
            @ReturnResult(parentId = "menus", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级菜单的uuid"),
            @ReturnResult(parentId = "menus", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "菜单的名称"),
            @ReturnResult(parentId = "menus", id = "", name = "text", type = "string[1,32]", isNecessary = true, description = "文本的名称"),
            @ReturnResult(parentId = "menus", id = "", name = "description", type = "string[1,64]", isNecessary = true, description = "描述"),
            @ReturnResult(parentId = "menus", id = "", name = "link", type = "string[1,256]", isNecessary = true, description = "链接"),
            @ReturnResult(parentId = "menus", id = "", name = "icon", type = "string[1,32]", isNecessary = true, description = "图标"),
            @ReturnResult(parentId = "menus", id = "", name = "level", type = "int", isNecessary = false, description = "级别"),
            @ReturnResult(parentId = "menus", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
            @ReturnResult(parentId = "menus", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
            @ReturnResult(parentId = "menus", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "menus", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间"),
            @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getRoleBySelf() {
        try {
            String roleUuid = null;
            // 从账户令牌中获取信息
            {
                final Message resultMsg = this.account.getTokenData(Admin.JWT_KEY_MAP.get("ROLE_UUID"));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                roleUuid = ((JSONObject) resultMsg.getContent()).getString("data");
            }
            // 获取角色
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Role role = new security.dao.Role(con);
                    final Message resultMsg = role.getRole(new String[] { roleUuid }, null, null, null, null, null, null);
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