package security.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;
import com.palestink.server.sdk.Framework;
import com.palestink.server.sdk.module.AbstractDao;
import com.palestink.server.sdk.module.exception.MessageParameterException;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.db.DatabaseKit;
import com.palestink.utils.string.StringKit;

/**
 * 角色
 */
public final class Role extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "security_role";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public Role(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加角色
     * 
     * @param name 名称
     * @param description 描述（允许为null）
     * @param permissions 权限（允许为null）
     * @param order 排序编号
     * @return 消息对象
     */
    public final Message addRole(final String name, final String description, final String permissions, final Integer order) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { name, order });
            }
            // 是否存在角色名称
            {
                final Message resultMsg = this.getRole(null, new String[] { name }, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 < array.length()) {
                    return new Message(Message.Status.ERROR, "ROLE_NAME_EXIST", "角色名称已存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加角色
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("name", name);
                    hm.put("description", description);
                    hm.put("permissions", permissions);
                    hm.put("order", order);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_ROLE_FAIL", "添加角色失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            return new Message(Message.Status.SUCCESS, null, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 根据uuid删除角色
     * 
     * @param uuidArray 角色的uuid数组
     * @return 消息对象
     */
    public final Message removeRoleByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 删除角色
            {
                final JSONArray whereArray = new JSONArray();
                {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("name", "uuid");
                    obj.put("symbol", "in");
                    obj.put("value", uuidArray);
                    whereArray.put(obj);
                }
                {
                    // 排除逻辑删除
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("name", "remove_timestamp");
                    obj.put("symbol", "is");
                    obj.put("value", JSONObject.NULL);
                    whereArray.put(obj);
                }
                final String whereSql = DatabaseKit.composeWhereSql(whereArray);
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("remove_timestamp", Long.valueOf(System.currentTimeMillis()));
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "REMOVE_ROLE_FAIL", "删除角色失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            // 删除关联
            // security_org
            {
                final security.dao.Org obj = new security.dao.Org(this.connection);
                obj.removeOrgByTypeUuid(uuidArray); // 可能没有关联数据，所以不对返回结果做判断。
            }
            return new Message(Message.Status.SUCCESS, null, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 修改角色（至少修改一项字段）
     * 
     * @param uuid 角色的uuid
     * @param name 角色名称（允许为null）
     * @param description 描述（允许为空，为null不修改，长度为0则清空）
     * @param permissions 权限（允许为空，为null不修改，长度为0则清空）
     * @param menus 菜单（允许为空，为null不修改，长度为0则清空）
     * @param order 排序编号（允许为null）
     * @return 消息对象
     */
    public final Message modifyRole(final String uuid, final String name, final String description, final String permissions, final String menus, final Integer order) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { name, description, permissions, menus, order });
            }
            // 是否存在角色
            {
                // 是否存在角色
                {
                    final Message resultMsg = this.getRole(new String[] { uuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "ROLE_NOT_EXIST", "角色不存在");
                    }
                }
            }
            // 是否存在重名角色
            {
                if (null != name) {
                    // 是否存在角色名称
                    {
                        final Message resultMsg = this.getRole(null, new String[] { name }, null, null, new String[] { uuid }, Integer.valueOf(0), Integer.valueOf(1));
                        if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                            return resultMsg;
                        }
                        final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                        if (0 < array.length()) {
                            return new Message(Message.Status.ERROR, "ROLE_NAME_EXIST", "角色名称已存在");
                        }
                    }
                }
            }
            String roleMenu = null;
            // 获取菜单
            {
                if ((null != menus) && (0 < menus.length())) {
                    final security.dao.Menu obj = new security.dao.Menu(this.connection);
                    final Message resultMsg = obj.getMenu(menus.split(";"), null, null, null, null, null, null, null, null, null, null);
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "MENU_NOT_EXIST", "菜单不存在");
                    }
                    final StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < array.length(); i++) {
                        final JSONObject jo = array.getJSONObject(i);
                        sb.append(jo.getString("uuid")).append(";");
                    }
                    roleMenu = sb.toString();
                }
            }
            // 修改角色
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != name) {
                        hm.put("name", name);
                    }
                    if (null != description) {
                        if (0 >= description.length()) {
                            hm.put("description", null);
                        } else {
                            hm.put("description", description);
                        }
                    }
                    if (null != permissions) {
                        if (0 >= permissions.length()) {
                            hm.put("permissions", null);
                        } else {
                            if (permissions.equalsIgnoreCase("*")) {
                                hm.put("permissions", permissions);
                            } else {
                                final StringBuilder sb = new StringBuilder();
                                final String[] permissionArray = permissions.split(";");
                                final String[] modulePermissionArray = this.getModulePermission().split(";");
                                for (int i = 0; i < permissionArray.length; i++) {
                                    for (int j = 0; j < modulePermissionArray.length; j++) {
                                        if (permissionArray[i].equalsIgnoreCase(modulePermissionArray[j])) {
                                            sb.append(permissionArray[i]).append(";");
                                            break;
                                        }
                                    }
                                }
                                if (0 < sb.length()) {
                                    hm.put("permissions", sb.toString());
                                } else {
                                    return new Message(Message.Status.ERROR, "PERMISSION_NOT_EXIST", "权限不存在");
                                }
                            }
                        }
                    }
                    if (null != menus) {
                        if (0 >= menus.length()) {
                            hm.put("menus", null);
                        } else if (null != roleMenu) {
                            hm.put("menus", roleMenu);
                        }
                    }
                    if (null != order) {
                        hm.put("order", order);
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_ROLE_FAIL", "修改角色失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            return new Message(Message.Status.SUCCESS, null, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 获取角色
     * 
     * @param uuidArray 角色的uuid数组（允许为null）
     * @param nameArray 名称的数组（允许为null）
     * @param nameLike 名称的模糊查询（允许为null）
     * @param orderArray 排序编号的数组（允许为null）
     * @param excludeUuidArray 排除角色的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public Message getRole(final String[] uuidArray, final String[] nameArray, final String nameLike, final Integer[] orderArray, final String[] excludeUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != nameArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "name");
                obj.put("symbol", "in");
                obj.put("value", nameArray);
                whereArray.put(obj);
            }
            if (null != nameLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "name");
                obj.put("symbol", "like");
                obj.put("value", "%" + nameLike + "%");
                whereArray.put(obj);
            }
            if (null != orderArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "name");
                obj.put("symbol", "in");
                obj.put("value", orderArray);
                whereArray.put(obj);
            }
            if (null != excludeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "uuid");
                obj.put("symbol", "not in");
                obj.put("value", excludeUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "remove_timestamp");
                obj.put("symbol", "is");
                obj.put("value", JSONObject.NULL);
                whereArray.put(obj);
            }
            final JSONObject resultObj = new JSONObject();
            final String whereSql = DatabaseKit.composeWhereSql(whereArray);
            {
                PreparedStatement ps = null;
                ResultSet rs = null;
                try {
                    ps = this.connection.prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` " + whereSql);
                    rs = ps.executeQuery();
                    if (rs.next()) {
                        resultObj.put("count", rs.getInt("count"));
                    } else {
                        resultObj.put("count", 0);
                    }
                } finally {
                    if (null != rs) {
                        rs.close();
                    }
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            final JSONArray array = new JSONArray();
            {
                PreparedStatement ps = null;
                ResultSet rs = null;
                try {
                    String limitCode = "";
                    if ((null != offset) && (null != rows)) {
                        limitCode = "limit ?, ?";
                    }
                    ps = this.connection.prepareStatement("select * from `" + DATABASE_TABLE_NAME + "` " + whereSql + " order by `order` asc " + limitCode);
                    if ((null != offset) && (null != rows)) {
                        ps.setInt(1, offset.intValue());
                        ps.setInt(2, rows.intValue());
                    }
                    rs = ps.executeQuery();
                    final ResultSetMetaData rsmd = rs.getMetaData();
                    final ArrayList<String> columnLabelList = new ArrayList<>();
                    for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                        columnLabelList.add(rsmd.getColumnLabel(i));
                    }
                    while (rs.next()) {
                        final JSONObject obj = new JSONObject();
                        for (int i = 0; i < columnLabelList.size(); i++) {
                            final String columnLabel = columnLabelList.get(i);
                            if (columnLabel.equalsIgnoreCase("permissions") && (null != rs.getString(columnLabel) && (rs.getString(columnLabel).equalsIgnoreCase("*")))) {
                                obj.put(columnLabel, this.getModulePermission());
                            } else {
                                obj.put(columnLabel, rs.getObject(columnLabel));
                            }
                            if (columnLabel.equalsIgnoreCase("menus") && (null != rs.getString(columnLabel))) {
                                final Menu menu = new Menu(this.connection);
                                final Message resultMsg = menu.getMenu(rs.getString(columnLabel).split(";"), null, null, null, null, null, null, null, null, null, null);
                                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                                    return resultMsg;
                                }
                                final JSONArray menuArray = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                                if (0 < menuArray.length()) {
                                    obj.put(columnLabel, menuArray);
                                }
                            }
                        }
                        array.put(obj);
                    }
                } finally {
                    if (null != rs) {
                        rs.close();
                    }
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            resultObj.put("array", array);
            return new Message(Message.Status.SUCCESS, resultObj, null);
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 获取模块和权限的字符串
     * 
     * @return 模块和权限的字符串
     */
    private final String getModulePermission() {
        final StringBuilder sb = new StringBuilder();
        for (final Map.Entry<String, ArrayList<String>> entry : Framework.MODULE_MAP.entrySet()) {
            final ArrayList<String> value = entry.getValue();
            final Iterator<String> servletIter = value.iterator();
            while (servletIter.hasNext()) {
                final String s = servletIter.next();
                sb.append(s + ";");
            }
        }
        return sb.toString();
    }
}