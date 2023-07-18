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
 * 地点
 */
public final class Location extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_location";

    // 状态
    public static enum Status {
        ENABLE, // 启用
        DISABLED // 禁用
    }

    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public Location(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加地点
     * 
     * @param typeUuid 类型的uuid
     * @param captureUuid 抓拍引擎的uuid
     * @param code 代码
     * @param name 名称
     * @param description 描述（允许为null）
     * @param status 状态
     * @return 消息对象
     */
    public final Message addLocation(final String typeUuid, final String captureUuid, final String code, final String name, final String description, final Status status) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { typeUuid, captureUuid, code, name, status });
            }
            // 是否存在地点类型
            {
                final LocationType obj = new LocationType(this.connection);
                final Message resultMsg = obj.getLocationType(new String[] { typeUuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_TYPE_NOT_EXIST", "地点类型不存在");
                }
            }
            // 是否存在抓拍引擎
            {
                final EngineCapture obj = new EngineCapture(this.connection);
                final Message resultMsg = obj.getEngineCapture(new String[] { captureUuid }, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "CAPTURE_VISION_NOT_EXIST", "抓拍引擎不存在");
                }
            }
            // 是否存在地点代码
            {
                final Message resultMsg = this.getLocation(null, null, null, new String[] { code }, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 < array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_CODE_EXIST", "地点代码已存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加地点
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("type_uuid", typeUuid);
                    hm.put("capture_uuid", captureUuid);
                    hm.put("code", code);
                    hm.put("name", name);
                    hm.put("description", description);
                    hm.put("status", status.toString());
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_LOCATION_FAIL", "添加地点失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            final JSONObject content = new JSONObject();
            content.put("uuid", uuid);
            return new Message(Message.Status.SUCCESS, content, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 根据uuid删除地点
     * 
     * @param uuidArray 地点的uuid数组
     * @return 消息对象
     */
    public final Message removeLocationByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 关联查询
            {
                // mms_event-record
                {
                    final EventRecord obj = new EventRecord(this.connection);
                    final Message resultMsg = obj.getEventRecord(null, null, uuidArray, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "EVENT_RECORD_EXIST_ASSOCIATE_DATA", "事件记录存在关联数据");
                    }
                }
                // mms_location-camera
                {
                    final LocationCamera obj = new LocationCamera(this.connection);
                    final Message resultMsg = obj.getLocationCamera(null, uuidArray, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_CAMERA_EXIST_ASSOCIATE_DATA", "地点摄像头存在关联数据");
                    }
                }
                // mms_location-model
                {
                    final LocationModel obj = new LocationModel(this.connection);
                    final Message resultMsg = obj.getLocationModel(null, uuidArray, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_MODEL_EXIST_ASSOCIATE_DATA", "地点模型存在关联数据");
                    }
                }
            }
            // 删除地点
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
                        return new Message(Message.Status.ERROR, "REMOVE_LOCATION_FAIL", "删除地点失败");
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
     * 修改地点（至少修改一项字段）
     * 
     * @param uuid 地点的uuid
     * @param typeUuid 类型的uuid（允许为null）
     * @param captureUuid 抓拍引擎的uuid（允许为null）
     * @param code 代码（允许为null）
     * @param name 名称（允许为null）
     * @param description 描述（允许为空，为null不修改，长度为0则清空）
     * @param status 状态（允许为null）
     * @return 消息对象
     */
    public final Message modifyLocation(final String uuid, final String typeUuid, final String captureUuid, final String code, final String name, final String description, final Status status) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { typeUuid, captureUuid, code, name, description, status });
            }
            // 是否存在地点
            {
                final Message resultMsg = this.getLocation(new String[] { uuid }, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_NOT_EXIST", "地点不存在");
                }
            }
            // 是否存在地点类型
            {
                if (null != typeUuid) {
                    final LocationType obj = new LocationType(this.connection);
                    final Message resultMsg = obj.getLocationType(new String[] { typeUuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_TYPE_NOT_EXIST", "地点类型不存在");
                    }
                }
            }
            // 是否存在抓拍引擎
            {
                if (null != captureUuid) {
                    final EngineCapture obj = new EngineCapture(this.connection);
                    final Message resultMsg = obj.getEngineCapture(new String[] { captureUuid }, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "CAPTURE_VISION_NOT_EXIST", "抓拍引擎不存在");
                    }
                }
            }
            // 是否存在地点代码
            {
                if (null != code) {
                    final Message resultMsg = this.getLocation(null, null, null, new String[] { code }, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_CODE_EXIST", "地点代码已存在");
                    }
                }
            }
            // 修改地点
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != typeUuid) {
                        hm.put("type_uuid", typeUuid);
                    }
                    if (null != captureUuid) {
                        hm.put("capture_uuid", captureUuid);
                    }
                    if (null != code) {
                        hm.put("code", code);
                    }
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
                    if (null != status) {
                        hm.put("status", status.toString());
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_LOCATION_FAIL", "修改地点失败");
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
     * 获取地点
     * 
     * @param uuidArray 地点的uuid数组（允许为null）
     * @param typeUuidArray 类型的uuid数组（允许为null）
     * @param captureUuidArray 抓拍引擎的uuid数组（允许为null）
     * @param codeArray 代码的数组（允许为null）
     * @param nameArray 名称的数组（允许为null）
     * @param nameLike 名称的模糊查询（允许为null）
     * @param excludeUuidArray 排除地点类型的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getLocation(final String[] uuidArray, final String[] typeUuidArray, final String[] captureUuidArray, final String[] codeArray, final String[] nameArray, final String nameLike,
        final String[] excludeUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != typeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "type_uuid");
                obj.put("symbol", "in");
                obj.put("value", typeUuidArray);
                whereArray.put(obj);
            }
            if (null != captureUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "capture_uuid");
                obj.put("symbol", "in");
                obj.put("value", captureUuidArray);
                whereArray.put(obj);
            }
            if (null != codeArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "code");
                obj.put("symbol", "in");
                obj.put("value", codeArray);
                whereArray.put(obj);
            }
            if (null != nameArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "name");
                obj.put("symbol", "in");
                obj.put("value", nameArray);
                whereArray.put(obj);
            }
            if (null != nameLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "name");
                obj.put("symbol", "like");
                obj.put("value", "%" + nameLike + "%");
                whereArray.put(obj);
            }
            if (null != excludeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
                obj.put("name", "uuid");
                obj.put("symbol", "not in");
                obj.put("value", excludeUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "l");
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
                    ps = this.connection.prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` l " + whereSql);
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
                    ps = this.connection.prepareStatement("select l.*, t.`name` as `type_name`, c.`name` as `capture_name` from `" + DATABASE_TABLE_NAME + "` l inner join `" + LocationType.DATABASE_TABLE_NAME
                        + "` t on l.`type_uuid` = t.`uuid` inner join `" + EngineCapture.DATABASE_TABLE_NAME + "` c on l.`capture_uuid` = c.`uuid` " + whereSql + " order by l.`create_timestamp` desc "
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