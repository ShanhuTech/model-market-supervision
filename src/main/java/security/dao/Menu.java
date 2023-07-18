package security.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import org.json.JSONArray;
import org.json.JSONObject;
import com.palestink.server.sdk.module.AbstractDao;
import com.palestink.server.sdk.module.exception.MessageParameterException;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.db.DatabaseKit;
import com.palestink.utils.string.StringKit;

/**
 * 菜单
 */
public final class Menu extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "security_menu";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public Menu(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加菜单
     * 
     * @param parentUuid 父级菜单的uuid
     * @param name 名称
     * @param text 文本
     * @param description 描述
     * @param link 链接
     * @param order 排序编号
     * @return 消息对象
     */
    public final Message addMenu(final String parentUuid, final String name, final String text, final String description, final String link, final Integer order) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { parentUuid, name, text, order });
            }
            int level = 1;
            String orderGroup = String.format("%06d", order);
            // 如果parentUuid不是顶级菜单检查parentUuid是否存在
            {
                if (!"0".equalsIgnoreCase(parentUuid)) {
                    final Message resultMsg = this.getMenu(new String[] { parentUuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "PARENT_MENU_NOT_EXIST", "父级菜单不存在");
                    }
                    level = array.getJSONObject(0).getInt("level") + 1;
                    orderGroup = array.getJSONObject(0).getString("order_group") + orderGroup;
                }
            }
            // 是否存在菜单名称
            {
                final Message resultMsg = this.getMenu(null, null, new String[] { name }, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 < array.length()) {
                    return new Message(Message.Status.ERROR, "MENU_NAME_EXIST", "菜单名称已存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加菜单
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("parent_uuid", parentUuid);
                    hm.put("name", name);
                    hm.put("text", text);
                    hm.put("description", description);
                    hm.put("link", link);
                    hm.put("level", Integer.valueOf(level));
                    hm.put("order", order);
                    hm.put("order_group", orderGroup);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_MENU_FAIL", "添加菜单失败");
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
     * 根据uuid删除菜单
     * 
     * @param uuidArray 菜单的uuid数组
     * @return 消息对象
     */
    public final Message removeMenuByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 删除菜单
            {
                final ArrayList<String> uuidList = new ArrayList<>();
                final JSONArray whereArray = new JSONArray();
                for (int i = 0; i < uuidArray.length; i++) {
                    final String uuid = uuidArray[i];
                    final Message resultMsg = this.getChildMenu(new String[] { uuid });
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    for (int j = 0; j < array.length(); j++) {
                        uuidList.add(array.getJSONObject(j).getString("uuid"));
                    }
                }
                if (0 >= uuidList.size()) {
                    return new Message(Message.Status.ERROR, "MENU_NOT_EXIST", "菜单不存在");
                }
                {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("name", "uuid");
                    obj.put("symbol", "in");
                    obj.put("value", uuidList.toArray(new String[uuidList.size()]));
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
                        return new Message(Message.Status.ERROR, "REMOVE_MENU_FAIL", "删除菜单失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            // 删除关联（无）
            return new Message(Message.Status.SUCCESS, null, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 修改菜单（至少修改一项字段）
     * 
     * @param uuid 菜单的uuid
     * @param parentUuid 父级菜单的uuid
     * @param name 名称（允许为null）
     * @param text 文本（允许为null）
     * @param description 描述（允许为null）
     * @param link 链接（允许为null）
     * @param order 排序编号
     * @return 消息对象
     */
    public final Message modifyMenu(final String uuid, final String parentUuid, final String name, final String text, final String description, final String link, final Integer order) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid, parentUuid, order });
                // 至少一个不为空
                this.oneNotNull(new Object[] { name, text, description, link });
            }
            // 是否存在菜单
            {
                final Message resultMsg = this.getMenu(new String[] { uuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "MENU_NOT_EXIST", "菜单不存在");
                }
            }
            int level = 1;
            String orderGroup = String.format("%06d", order);
            // 是否存在父级菜单
            {
                // 如果parentUuid不是顶级菜单检查parentUuid是否存在
                if (!"0".equalsIgnoreCase(parentUuid)) {
                    final Message resultMsg = this.getMenu(new String[] { parentUuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "PARENT_MENU_NOT_EXIST", "父级菜单不存在");
                    }
                    level = array.getJSONObject(0).getInt("level") + 1;
                    orderGroup = array.getJSONObject(0).getString("order_group") + orderGroup;
                }
            }
            // 是否存在重名菜单
            {
                if (null != name) {
                    final Message resultMsg = this.getMenu(null, null, new String[] { name }, null, null, null, null, null, new String[] { uuid }, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "MENU_NAME_EXIST", "菜单名称已存在");
                    }
                }
            }
            // 修改菜单
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    {
                        hm.put("parent_uuid", parentUuid);
                        hm.put("level", Integer.valueOf(level));
                        hm.put("order", order);
                        hm.put("order_group", orderGroup);
                    }
                    if (null != name) {
                        hm.put("name", name);
                    }
                    if (null != text) {
                        hm.put("text", text);
                    }
                    if (null != description) {
                        hm.put("description", description);
                    }
                    if (null != link) {
                        hm.put("link", link);
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_MENU_FAIL", "修改菜单失败");
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
     * 获取菜单
     * 
     * @param uuidArray 菜单的uuid数组（允许为null）
     * @param parentUuidArray 父级菜单的uuid数组（允许为null）
     * @param nameArray 名称的数组（允许为null）
     * @param nameLike 名称的模糊查询（允许为null）
     * @param textArray 文本的数组（允许为null）
     * @param textLike 文本的模糊查询（允许为null）
     * @param levelArray 级别的数组（允许为null）
     * @param orderGroupArray 排序编号组的数组（允许为null）
     * @param excludeUuidArray 排除菜单类型的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getMenu(final String[] uuidArray, final String[] parentUuidArray, final String[] nameArray, final String nameLike, final String[] textArray, final String textLike,
        final Integer[] levelArray, final String[] orderGroupArray, final String[] excludeUuidArray, final Integer offset, final Integer rows) {
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
            if (null != parentUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "parent_uuid");
                obj.put("symbol", "in");
                obj.put("value", parentUuidArray);
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
            if (null != textArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "text");
                obj.put("symbol", "in");
                obj.put("value", textArray);
                whereArray.put(obj);
            }
            if (null != textLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "text");
                obj.put("symbol", "like");
                obj.put("value", "%" + textLike + "%");
                whereArray.put(obj);
            }
            if (null != levelArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "level");
                obj.put("symbol", "in");
                obj.put("value", levelArray);
                whereArray.put(obj);
            }
            if (null != orderGroupArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "order_group");
                obj.put("symbol", "in");
                obj.put("value", orderGroupArray);
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
                    ps = this.connection.prepareStatement("select * from `" + DATABASE_TABLE_NAME + "` " + whereSql + " order by `order_group` asc " + limitCode);
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
                            obj.put(columnLabel, rs.getObject(columnLabel));
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
     * 获取父菜单（返回结果包含当前查询uuid）
     * 
     * @param uuidArray 菜单的uuid数组
     * @return 消息对象
     */
    public final Message getParentMenu(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotNull(new Object[] { uuidArray });
            }
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
            final JSONObject resultObj = new JSONObject();
            final String whereSql = DatabaseKit.composeWhereSql(whereArray);
            final JSONArray array = new JSONArray();
            {
                PreparedStatement ps = null;
                ResultSet rs = null;
                try {
                    ps = this.connection.prepareStatement("with recursive `trees` as (select * from `" + DATABASE_TABLE_NAME + "` " + whereSql + " union all select t.* from `" + DATABASE_TABLE_NAME
                        + "` t inner join `trees` on `trees`.`parent_uuid` = t.`uuid`) select * from `trees` order by `order_group` asc");
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
                            obj.put(columnLabel, rs.getObject(columnLabel));
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
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 获取子菜单（返回结果包含当前查询uuid）
     * 
     * @param uuidArray 菜单的uuid数组
     * @return 消息对象
     */
    public final Message getChildMenu(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotNull(new Object[] { uuidArray });
            }
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
            final JSONObject resultObj = new JSONObject();
            final String whereSql = DatabaseKit.composeWhereSql(whereArray);
            final JSONArray array = new JSONArray();
            {
                PreparedStatement ps = null;
                ResultSet rs = null;
                try {
                    ps = this.connection.prepareStatement("with recursive `trees` as (select * from `" + DATABASE_TABLE_NAME + "` " + whereSql + " union all select t.* from trees join `" + DATABASE_TABLE_NAME
                        + "` t on t.`parent_uuid` = `trees`.`uuid`) select * from trees order by `order_group` asc");
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
                            obj.put(columnLabel, rs.getObject(columnLabel));
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
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }
}