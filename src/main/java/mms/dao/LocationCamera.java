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
 * 地点摄像头
 */
public final class LocationCamera extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_location-camera";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public LocationCamera(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加地点摄像头
     * 
     * @param locationUuid 地点的uuid
     * @param cameraUuid   摄像头的uuid
     * @param visionArea   识别区域（允许为null）
     * @param visionLine   识别线段（允许为null）
     * @param isMark       是否标记
     * @return 消息对象
     */
    public final Message addLocationCamera(final String locationUuid, final String cameraUuid, final String visionArea,
            final String visionLine, final Integer isMark) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { locationUuid, cameraUuid, isMark });
            }
            // 是否存在地点
            {
                final Location obj = new Location(this.connection);
                final Message resultMsg = obj.getLocation(new String[] { locationUuid }, null, null, null, null, null,
                        null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_CAMERA_NOT_EXIST", "地点不存在");
                }
            }
            // 是否存在摄像头
            {
                final Camera obj = new Camera(this.connection);
                final Message resultMsg = obj.getCamera(new String[] { cameraUuid }, null, null, null, null, null,
                        Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "CAMERA_NOT_EXIST", "摄像头不存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加地点摄像头
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("location_uuid", locationUuid);
                    hm.put("camera_uuid", cameraUuid);
                    hm.put("vision_area", visionArea);
                    hm.put("vision_line", visionLine);
                    hm.put("is_mark", isMark);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_LOCATION_CAMERA_CAMERA_FAIL", "添加地点摄像头失败");
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
     * 根据uuid删除地点摄像头
     * 
     * @param uuidArray 地点摄像头的uuid数组
     * @return 消息对象
     */
    public final Message removeLocationCameraByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 关联查询（无）
            // 删除地点摄像头
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
                        return new Message(Message.Status.ERROR, "REMOVE_LOCATION_CAMERA_FAIL", "删除地点摄像头失败");
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
     * 修改地点摄像头（至少修改一项字段）
     * 
     * @param uuid         地点摄像头的uuid
     * @param locationUuid 地点的uuid
     * @param cameraUuid   摄像头的uuid
     * @param visionArea   识别区域（允许为空，为null不修改，长度为0则清空）
     * @param visionLine   识别线段（允许为空，为null不修改，长度为0则清空）
     * @param isMark       是否标记（允许为空）
     * @return 消息对象
     */
    public final Message modifyLocationCamera(final String uuid, final String locationUuid, final String cameraUuid,
            final String visionArea, final String visionLine, final Integer isMark) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { locationUuid, cameraUuid, visionArea, visionLine, isMark });
            }
            // 是否存在地点摄像头
            {
                final Message resultMsg = this.getLocationCamera(new String[] { uuid }, null, null, Integer.valueOf(0),
                        Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "LOCATION_CAMERA_NOT_EXIST", "地点摄像头不存在");
                }
            }
            // 是否存在地点
            {
                if (null != locationUuid) {
                    final Location obj = new Location(this.connection);
                    final Message resultMsg = obj.getLocation(new String[] { locationUuid }, null, null, null, null,
                            null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_CAMERA_NOT_EXIST", "地点不存在");
                    }
                }
            }
            // 是否存在摄像头
            {
                if (null != cameraUuid) {
                    final Camera obj = new Camera(this.connection);
                    final Message resultMsg = obj.getCamera(new String[] { cameraUuid }, null, null, null, null, null,
                            Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "CAMERA_NOT_EXIST", "摄像头不存在");
                    }
                }
            }
            // 修改地点摄像头
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != locationUuid) {
                        hm.put("location_uuid", locationUuid);
                    }
                    if (null != cameraUuid) {
                        hm.put("camera_uuid", cameraUuid);
                    }
                    if (null != visionArea) {
                        if (0 >= visionArea.length()) {
                            hm.put("vision_area", null);
                        } else {
                            hm.put("vision_area", visionArea);
                        }
                    }
                    if (null != visionLine) {
                        if (0 >= visionLine.length()) {
                            hm.put("vision_line", null);
                        } else {
                            hm.put("vision_line", visionLine);
                        }
                    }
                    if (null != isMark) {
                        hm.put("is_mark", isMark);
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_LOCATION_CAMERA_FAIL", "修改地点摄像头失败");
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
     * 获取地点摄像头
     * 
     * @param uuidArray         地点摄像头的uuid数组（允许为null）
     * @param locationUuidArray 地点的uuid数组（允许为null）
     * @param cameraUuidArray   摄像头的uuid数组（允许为null）
     * @param offset            查询的偏移（允许为null）
     * @param rows              查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getLocationCamera(final String[] uuidArray, final String[] locationUuidArray,
            final String[] cameraUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lc");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != locationUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lc");
                obj.put("name", "location_uuid");
                obj.put("symbol", "in");
                obj.put("value", locationUuidArray);
                whereArray.put(obj);
            }
            if (null != cameraUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lc");
                obj.put("name", "camera_uuid");
                obj.put("symbol", "in");
                obj.put("value", cameraUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "lc");
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
                    ps = this.connection.prepareStatement(
                            "select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` lc " + whereSql);
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
                    ps = this.connection.prepareStatement(
                            "select lc.*, l.`name` as `location_name`, c.`name` as `camera_name` from `"
                                    + DATABASE_TABLE_NAME + "` lc inner join `" + Location.DATABASE_TABLE_NAME
                                    + "` l on lc.`location_uuid` = l.`uuid` inner join `" + Camera.DATABASE_TABLE_NAME
                                    + "` c on lc.`camera_uuid` = c.`uuid` " + whereSql
                                    + " order by lc.`create_timestamp` desc "
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