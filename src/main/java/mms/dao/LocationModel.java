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
 * 地点模型
 */
public final class LocationModel extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_location-model";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public LocationModel(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加地点模型
     * 
     * @param locationUuid 地点的uuid
     * @param modelUuid 模型的uuid
     * @param toleranceTime 容忍时间
     * @param mergeTime 合并时间
     * @param threshold 阈值
     * @param confidence 置信度
     * @return 消息对象
     */
    public final Message addLocationModel(final String locationUuid, final String modelUuid, final Integer toleranceTime, final Integer mergeTime, final Integer threshold, final Integer confidence) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { locationUuid, modelUuid, toleranceTime, mergeTime, threshold, confidence });
            }
            // 是否存在地点
            {
                final Location obj = new Location(this.connection);
                final Message resultMsg = obj.getLocation(new String[] { locationUuid }, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_MODEL_NOT_EXIST", "地点不存在");
                }
            }
            // 是否存在模型
            {
                final Model obj = new Model(this.connection);
                final Message resultMsg = obj.getModel(new String[] { modelUuid }, null, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "MODEL_NOT_EXIST", "模型不存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加地点模型
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("location_uuid", locationUuid);
                    hm.put("model_uuid", modelUuid);
                    hm.put("tolerance_time", toleranceTime);
                    hm.put("merge_time", mergeTime);
                    hm.put("threshold", threshold);
                    hm.put("confidence", confidence);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_LOCATION_MODEL_MODEL_FAIL", "添加地点模型失败");
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
     * 根据uuid删除地点模型
     * 
     * @param uuidArray 地点模型的uuid数组
     * @return 消息对象
     */
    public final Message removeLocationModelByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 关联查询（无）
            // 删除地点模型
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
                        return new Message(Message.Status.ERROR, "REMOVE_LOCATION_MODEL_FAIL", "删除地点模型失败");
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
     * 修改地点模型（至少修改一项字段）
     * 
     * @param uuid 地点模型的uuid
     * @param locationUuid 地点的uuid
     * @param modelUuid 模型的uuid
     * @param toleranceTime 容忍时间（允许为null）
     * @param mergeTime 合并时间（允许为null）
     * @param threshold 阈值（允许为null）
     * @param confidence 置信度（允许为null）
     * @return 消息对象
     */
    public final Message modifyLocationModel(final String uuid, final String locationUuid, final String modelUuid, final Integer toleranceTime, final Integer mergeTime, final Integer threshold,
        final Integer confidence) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { locationUuid, modelUuid, toleranceTime, mergeTime, threshold, confidence });
            }
            // 是否存在地点模型
            {
                final Message resultMsg = this.getLocationModel(new String[] { uuid }, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_MODEL_NOT_EXIST", "地点模型不存在");
                }
            }
            // 是否存在地点
            {
                if (null != locationUuid) {
                    final Location obj = new Location(this.connection);
                    final Message resultMsg = obj.getLocation(new String[] { locationUuid }, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_MODEL_NOT_EXIST", "地点不存在");
                    }
                }
            }
            // 是否存在模型
            {
                if (null != modelUuid) {
                    final Model obj = new Model(this.connection);
                    final Message resultMsg = obj.getModel(new String[] { modelUuid }, null, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "MODEL_NOT_EXIST", "模型不存在");
                    }
                }
            }
            // 修改地点模型
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != locationUuid) {
                        hm.put("location_uuid", locationUuid);
                    }
                    if (null != modelUuid) {
                        hm.put("model_uuid", modelUuid);
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
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_LOCATION_MODEL_FAIL", "修改地点模型失败");
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
     * 获取地点模型
     * 
     * @param uuidArray 地点模型的uuid数组（允许为null）
     * @param locationUuidArray 地点的uuid数组（允许为null）
     * @param modelUuidArray 模型的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getLocationModel(final String[] uuidArray, final String[] locationUuidArray, final String[] modelUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lm");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != locationUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lm");
                obj.put("name", "location_uuid");
                obj.put("symbol", "in");
                obj.put("value", locationUuidArray);
                whereArray.put(obj);
            }
            if (null != modelUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lm");
                obj.put("name", "model_uuid");
                obj.put("symbol", "in");
                obj.put("value", modelUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lm");
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
                    ps = this.connection.prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` lm " + whereSql);
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
                    ps = this.connection.prepareStatement("select lm.*, l.`name` as `location_name`, m.`name` as `model_name` from `" + DATABASE_TABLE_NAME + "` lm inner join `" + Location.DATABASE_TABLE_NAME
                        + "` l on lm.`location_uuid` = l.`uuid` inner join `" + Model.DATABASE_TABLE_NAME + "` m on lm.`model_uuid` = m.`uuid` " + whereSql + " order by lm.`create_timestamp` desc "
                        + limitCode);
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