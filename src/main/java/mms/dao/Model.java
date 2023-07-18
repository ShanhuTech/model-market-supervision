package mms.dao;

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
 * 模型
 */
public final class Model extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_model";

    // 状态
    public static enum Status {
        ENABLE, // 启用
        DISABLED // 禁用
    }

    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public Model(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加模型
     * 
     * @param typeUuid 类型的uuid
     * @param eventId 事件的id
     * @param name 名称
     * @param text 文本
     * @param description 描述（允许为null）
     * @param toleranceTime 容忍时间
     * @param mergeTime 合并时间
     * @param threshold 阈值
     * @param confidence 置信度
     * @param order 排序编号
     * @param status 状态
     * @param attach 附件（允许为null）
     * @return 消息对象
     */
    public final Message addModel(final String typeUuid, final String eventId, final String name, final String text, final String description, final Integer toleranceTime, final Integer mergeTime,
        final Integer threshold, final Integer confidence, final Integer order, final Status status, final String attach) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { typeUuid, eventId, name, text, toleranceTime, mergeTime, threshold, confidence, order, status });
            }
            // 是否存在模型类型
            {
                final ModelType obj = new ModelType(this.connection);
                final Message resultMsg = obj.getModelType(new String[] { typeUuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "MODEL_TYPE_NOT_EXIST", "模型类型不存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加模型
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("type_uuid", typeUuid);
                    hm.put("event_id", eventId);
                    hm.put("name", name);
                    hm.put("text", text);
                    hm.put("description", description);
                    hm.put("tolerance_time", toleranceTime);
                    hm.put("merge_time", mergeTime);
                    hm.put("threshold", threshold);
                    hm.put("confidence", confidence);
                    hm.put("order", order);
                    hm.put("status", status.toString());
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_MODEL_FAIL", "添加模型失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            // 添加附件
            {
                if (null != attach) {
                    final ModelAttach obj = new ModelAttach(this.connection);
                    final JSONArray attachArray = new JSONArray(attach);
                    for (int i = 0; i < attachArray.length(); i++) {
                        final JSONObject attachObj = attachArray.getJSONObject(i);
                        final String title = attachObj.getString("title");
                        final String desc = attachObj.has("description") ? attachObj.getString("description") : null;
                        final String data = attachObj.getString("data");
                        final Message resultMsg = obj.addModelAttach(uuid, title, desc, data);
                        if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                            return resultMsg;
                        }
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
     * 根据uuid删除模型
     * 
     * @param uuidArray 模型的uuid数组
     * @return 消息对象
     */
    public final Message removeModelByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 关联查询
            {
                // mms_location-model
                {
                    final LocationModel obj = new LocationModel(this.connection);
                    final Message resultMsg = obj.getLocationModel(null, null, uuidArray, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_MODEL_EXIST_ASSOCIATE_DATA", "地点模型存在关联数据");
                    }
                }
                // mms_model-attach
                {
                    final ModelAttach obj = new ModelAttach(this.connection);
                    final Message resultMsg = obj.getModelAttach(null, uuidArray, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "MODEL_ATTACH_EXIST_ASSOCIATE_DATA", "地点附件存在关联数据");
                    }
                }
            }
            // 删除模型
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
                        return new Message(Message.Status.ERROR, "REMOVE_MODEL_FAIL", "删除模型失败");
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
     * 修改模型（至少修改一项字段）
     * 
     * @param uuid
     * @param typeUuid 类型的uuid（允许为null）
     * @param eventId 事件的id（允许为null）
     * @param name 名称（允许为null）
     * @param text 文本（允许为null）
     * @param description 描述（允许为空，为null不修改，长度为0则清空）
     * @param toleranceTime 容忍时间（允许为null）
     * @param mergeTime 合并时间（允许为null）
     * @param threshold 阈值（允许为null）
     * @param confidence 置信度（允许为null）
     * @param order 排序编号（允许为null）
     * @param status 状态（允许为null）
     * @return 消息对象
     */
    public final Message modifyModel(final String uuid, final String typeUuid, final String eventId, final String name, final String text, final String description, final Integer toleranceTime,
        final Integer mergeTime, final Integer threshold, final Integer confidence, final Integer order, final Status status) {
        try { // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { typeUuid, eventId, name, text, description, toleranceTime, mergeTime, threshold, confidence, order, status });
            }
            // 是否存在模型
            {
                final Message resultMsg = this.getModel(new String[] { uuid }, null, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "MODEL_NOT_EXIST", "模型不存在");
                }
            }
            // 是否存在模型类型
            {
                if (null != typeUuid) {
                    final ModelType obj = new ModelType(this.connection);
                    final Message resultMsg = obj.getModelType(new String[] { typeUuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "MODEL_TYPE_NOT_EXIST", "模型类型不存在");
                    }
                }
            }
            // 修改模型
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != typeUuid) {
                        hm.put("type_uuid", typeUuid);
                    }
                    if (null != eventId) {
                        hm.put("event_id", eventId);
                    }
                    if (null != name) {
                        hm.put("name", name);
                    }
                    if (null != text) {
                        hm.put("text", text);
                    }
                    if (null != description) {
                        if (0 >= description.length()) {
                            hm.put("description", null);
                        } else {
                            hm.put("description", description);
                        }
                    }
                    if (null != toleranceTime) {
                        hm.put("tolerance_time", toleranceTime);
                    }
                    if (null != mergeTime) {
                        hm.put("merge_time", mergeTime);
                    }
                    if (null != threshold) {
                        hm.put("threshold", threshold);
                    }
                    if (null != confidence) {
                        hm.put("confidence", confidence);
                    }
                    if (null != order) {
                        hm.put("order", order);
                    }
                    if (null != status) {
                        hm.put("status", status.toString());
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_MODEL_FAIL", "修改模型失败");
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
     * 获取模型
     * 
     * @param uuidArray 模型的uuid数组（允许为null）
     * @param typeUuidArray 类型的uuid数组（允许为null）
     * @param eventIdArray 事件的id数组（允许为null）
     * @param nameArray 名称的数组（允许为null）
     * @param nameLike 名称的模糊查询（允许为null）
     * @param textArray 文本的数组（允许为null）
     * @param textLike 文本的模糊查询（允许为null）
     * @param statusArray 状态的数组（允许为null）
     * @param createDatetimeRange 创建时间的范围（格式：new String[] {开始时间}、new String[] {开始时间,结束时间}）（允许为null）
     * @param excludeUuidArray 排除模型类型的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getModel(final String[] uuidArray, final String[] typeUuidArray, final String[] eventIdArray, final String[] nameArray, final String nameLike, final String[] textArray,
        final String textLike, final Status[] statusArray, final String[] createDatetimeRange, final String[] excludeUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != typeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "type_uuid");
                obj.put("symbol", "in");
                obj.put("value", typeUuidArray);
                whereArray.put(obj);
            }
            if (null != eventIdArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "event_id");
                obj.put("symbol", "in");
                obj.put("value", eventIdArray);
                whereArray.put(obj);
            }
            if (null != nameArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "name");
                obj.put("symbol", "in");
                obj.put("value", nameArray);
                whereArray.put(obj);
            }
            if (null != nameLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "name");
                obj.put("symbol", "like");
                obj.put("value", "%" + nameLike + "%");
                whereArray.put(obj);
            }
            if (null != textArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "text");
                obj.put("symbol", "in");
                obj.put("value", textArray);
                whereArray.put(obj);
            }
            if (null != textLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "text");
                obj.put("symbol", "like");
                obj.put("value", "%" + textLike + "%");
                whereArray.put(obj);
            }
            if (null != statusArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "status");
                obj.put("symbol", "in");
                obj.put("value", statusArray);
                whereArray.put(obj);
            }
            if (null != createDatetimeRange) {
                if (0 < createDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "m");
                    obj.put("name", "create_timestamp");
                    obj.put("symbol", ">");
                    obj.put("value", this.simpleDateFormat.parse(createDatetimeRange[0]).getTime());
                    whereArray.put(obj);
                }
                if (1 < createDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "m");
                    obj.put("name", "create_timestamp");
                    obj.put("symbol", "<");
                    obj.put("value", this.simpleDateFormat.parse(createDatetimeRange[1]).getTime());
                    whereArray.put(obj);
                }
            }
            if (null != excludeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
                obj.put("name", "uuid");
                obj.put("symbol", "not in");
                obj.put("value", excludeUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "m");
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
                    ps = this.connection.prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` m " + whereSql);
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
                    ps = this.connection.prepareStatement("select m.*, t.`name` as `type_name` from `" + DATABASE_TABLE_NAME + "` m inner join `" + ModelType.DATABASE_TABLE_NAME
                        + "` t on m.`type_uuid` = t.`uuid` " + whereSql + " order by m.`order` asc " + limitCode);
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
}