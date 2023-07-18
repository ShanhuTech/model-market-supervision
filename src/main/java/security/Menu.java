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

@Module(description = "菜单")
public final class Menu extends AbstractModule {
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    @SuppressWarnings("unused")
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    private HashMap<String, Object> parameter;

    public Menu() {
    }

    public Menu(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) throws Exception {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    @Method(description = "添加菜单", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "parent_uuid", text = "父级菜单的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = "一级菜单的父级菜单的uuid为0"),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "text", text = "文本", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = ""),
        @Parameter(name = "link", text = "链接", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = ""),
        @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns())
    public final Message addMenu() {
        try {
            final String parentUuid = (String) this.getParameter(this.parameter, "parent_uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String text = (String) this.getParameter(this.parameter, "text");
            final String description = (String) this.getParameter(this.parameter, "description");
            final String link = (String) this.getParameter(this.parameter, "link");
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            // 添加菜单
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Menu obj = new security.dao.Menu(con);
                    final Message resultMsg = obj.addMenu(parentUuid, name, text, description, link, order);
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

    @Method(description = "删除菜单", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "菜单的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns())
    public final Message removeMenu() {
        try {
            final String[] uuidArray = ((String) this.getParameter(this.parameter, "uuid_array")).split(";");
            // 删除菜单
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Menu obj = new security.dao.Menu(con);
                    final Message resultMsg = obj.removeMenuByUuid(uuidArray);
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

    @Method(description = "修改菜单", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid", text = "菜单的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "parent_uuid", text = "父级菜单的uuid", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}$", formatPrompt = "1-40位的数字或大小写字母", remark = "一级菜单的父级菜单的uuid为0"),
        @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "text", text = "文本", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "description", text = "描述", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,64}$", formatPrompt = "1-64位的任意字符", remark = "传递空值则清空"),
        @Parameter(name = "link", text = "链接", type = Parameter.Type.STRING, allowNull = true, format = "^.{1,256}$", formatPrompt = "1-256位的任意字符", remark = "传递空值则清空"),
        @Parameter(name = "order", text = "排序编号", type = Parameter.Type.INTEGER, allowNull = false, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "") }, returns = @Returns())
    public final Message modifyMenu() {
        try {
            final String uuid = (String) this.getParameter(this.parameter, "uuid");
            final String parentUuid = (String) this.getParameter(this.parameter, "parent_uuid");
            final String name = (String) this.getParameter(this.parameter, "name");
            final String text = (String) this.getParameter(this.parameter, "text");
            final String description = (String) this.parameter.get("description"); // 允许为空且可清空
            final String link = (String) this.parameter.get("link"); // 允许为空且可清空
            final Integer order = (Integer) this.getParameter(this.parameter, "order");
            // 修改菜单
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Menu obj = new security.dao.Menu(con);
                    final Message resultMsg = obj.modifyMenu(uuid, parentUuid, name, text, description, link, order);
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

    @Method(description = "获取菜单", anonymousAccess = false, frequencys = { @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
        @Parameter(name = "uuid_array", text = "菜单的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = ""),
        @Parameter(name = "parent_uuid_array", text = "父级菜单的uuid集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "一级菜单的父级菜单的uuid为0"),
        @Parameter(name = "name_array", text = "名称的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "name_like", text = "名称的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = "从头匹配"),
        @Parameter(name = "text_array", text = "文本的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}(;[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32})*$", formatPrompt = "以分号分割的1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "text_like", text = "文本的模糊查询", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9a-zA-Z\\u4E00-\\u9FA5_-]{1,32}$", formatPrompt = "1-32位的数字、大小写字母、所有汉字、下划线或横线", remark = ""),
        @Parameter(name = "level_array", text = "级别的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[1-9]\\d(;[1-9]\\d)*$", formatPrompt = "以分号分割的大于等于1的正整数", remark = ""),
        @Parameter(name = "order_array", text = "排序的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[1-9]\\d(;[1-9]\\d)*$", formatPrompt = "以分号分割的大于等于1的正整数", remark = ""),
        @Parameter(name = "order_group_array", text = "排序编号组的集合", type = Parameter.Type.STRING, allowNull = true, format = "^[0-9]{1,6}(;[0-9]{1,6})*$", formatPrompt = "以分号分割的大于等于0且长度为1-6位的数字", remark = ""),
        @Parameter(name = "offset", text = "查询的偏移", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*|0$", formatPrompt = "大于等于0的正整数", remark = "从0开始"),
        @Parameter(name = "rows", text = "查询的行数", type = Parameter.Type.INTEGER, allowNull = true, format = "^[1-9]\\d*$", formatPrompt = "大于等于1的正整数", remark = "从1开始") }, returns = @Returns(results = {
            @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
            @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
            @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "菜单的uuid"),
            @ReturnResult(parentId = "array_id", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级菜单的uuid（一级菜单的父级菜单的uuid为0）"),
            @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "菜单的名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "text", type = "string[1,32]", isNecessary = true, description = "文本的名称"),
            @ReturnResult(parentId = "array_id", id = "", name = "description", type = "string[1,64]", isNecessary = true, description = "描述"),
            @ReturnResult(parentId = "array_id", id = "", name = "link", type = "string[1,256]", isNecessary = true, description = "链接"),
            @ReturnResult(parentId = "array_id", id = "", name = "level", type = "int", isNecessary = false, description = "级别"),
            @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
            @ReturnResult(parentId = "array_id", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
            @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getMenu() {
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
            // 获取菜单
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Menu obj = new security.dao.Menu(con);
                    final Message resultMsg = obj.getMenu(uuidArray, parentUuidArray, nameArray, nameLike, textArray, textLike, levelArray, orderGroupArray, null, offset, rows);
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

    @Method(description = "获取父菜单", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "菜单的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "菜单的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级菜单的uuid（一级菜单的父级菜单的uuid为0）"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "菜单的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "level", type = "int", isNecessary = false, description = "级别"),
                @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
                @ReturnResult(parentId = "array_id", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getParentMenu() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            // 获取父菜单
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Menu obj = new security.dao.Menu(con);
                    final Message resultMsg = obj.getParentMenu(uuidArray);
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

    @Method(description = "获取子菜单", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 10, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.POST, parameters = {
            @Parameter(name = "uuid_array", text = "菜单的uuid集合", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z]{1,40}(;[0-9a-zA-Z]{1,40})*$", formatPrompt = "以分号分割的1-40位的数字或大小写字母", remark = "") }, returns = @Returns(results = {
                @ReturnResult(parentId = "", id = "", name = "count", type = "int", isNecessary = true, description = "数量"),
                @ReturnResult(parentId = "", id = "array_id", name = "array", type = "array", isNecessary = true, description = "列表"),
                @ReturnResult(parentId = "array_id", id = "", name = "uuid", type = "string[1,40]", isNecessary = true, description = "菜单的uuid"),
                @ReturnResult(parentId = "array_id", id = "", name = "parent_uuid", type = "string[1,40]", isNecessary = true, description = "父级菜单的uuid（一级菜单的父级菜单的uuid为0）"),
                @ReturnResult(parentId = "array_id", id = "", name = "name", type = "string[1,32]", isNecessary = true, description = "菜单的名称"),
                @ReturnResult(parentId = "array_id", id = "", name = "level", type = "int", isNecessary = false, description = "级别"),
                @ReturnResult(parentId = "array_id", id = "", name = "order", type = "int", isNecessary = true, description = "排序编号"),
                @ReturnResult(parentId = "array_id", id = "", name = "order_group", type = "string[1,60]", isNecessary = true, description = "排序编号组"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_timestamp", type = "long", isNecessary = true, description = "创建时间戳"),
                @ReturnResult(parentId = "array_id", id = "", name = "create_datetime", type = "string[1,30]", isNecessary = true, description = "创建时间") }))
    public final Message getChildMenu() {
        try {
            String[] uuidArray = null;
            final String uuidArrayStr = (String) this.getParameter(this.parameter, "uuid_array");
            if (null != uuidArrayStr) {
                uuidArray = uuidArrayStr.split(";");
            }
            // 获取子菜单
            {
                Connection con = null;
                try {
                    con = DruidInstance.getInstance().getTransConnection();
                    final security.dao.Menu obj = new security.dao.Menu(con);
                    final Message resultMsg = obj.getChildMenu(uuidArray);
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