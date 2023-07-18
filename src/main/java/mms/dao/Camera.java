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
 * 摄像头
 */
public final class Camera extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_camera";

    // 协议类型
    public static enum ProtocolType {
        RTSP, RTMP
    }

    // 连接类型
    public static enum ConnectType {
        DIRECT, // 直连
        HIKVISION // 海康
    }

    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public Camera(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加摄像头
     * 
     * @param code                    代码
     * @param name                    名称
     * @param description             描述（允许为null）
     * @param url                     地址
     * @param protocolType            协议类型
     * @param connectType             连接类型
     * @param lng                     经度（允许为null）
     * @param lat                     纬度（允许为null）
     * @param platformExtendParameter 平台扩展参数（允许为null）
     * @return 消息对象
     */
    public final Message addCamera(final String code, final String name, final String description, final String url,
            final ProtocolType protocolType, final ConnectType connectType, final String lng,
            final String lat, final String platformExtendParameter) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { code, name, url, protocolType, connectType });
            }
            // 是否存在摄像头代码
            {
                final Message resultMsg = this.getCamera(null, new String[] { code }, null, null, null, null,
                        Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 < array.length()) {
                    return new Message(Message.Status.ERROR, "CAMERA_CODE_EXIST", "摄像头代码已存在");
                }
            }
            // // 是否存在摄像头名称
            // {
            // final Message resultMsg = this.getCamera(null, null, new String[] { name },
            // null, null, Integer.valueOf(0), Integer.valueOf(1));
            // if (Message.Status.SUCCESS != resultMsg.getStatus()) {
            // return resultMsg;
            // }
            // final JSONArray array = ((JSONObject)
            // resultMsg.getContent()).getJSONArray("array");
            // if (0 < array.length()) {
            // return new Message(Message.Status.ERROR, "CAMERA_NAME_EXIST", "摄像头名称已存在");
            // }
            // }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加摄像头
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("code", code);
                    hm.put("name", name);
                    hm.put("description", description);
                    hm.put("url", url);
                    hm.put("protocol_type", protocolType.toString());
                    hm.put("connect_type", connectType.toString());
                    hm.put("lng", lng);
                    hm.put("lat", lat);
                    hm.put("platform_extend_parameter", platformExtendParameter);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_CAMERA_FAIL", "添加摄像头失败");
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
     * 根据uuid删除摄像头
     * 
     * @param uuidArray 摄像头的uuid数组
     * @return 消息对象
     */
    public final Message removeCameraByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 关联查询
            {
                // mms_event-record-camera
                {
                    final EventRecordCamera obj = new EventRecordCamera(this.connection);
                    final Message resultMsg = obj.getEventRecordCamera(null, null, uuidArray, Integer.valueOf(0),
                            Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "EVENT_RECORD_CAMERA_HAS_ASSOCIATE_DATA",
                                "事件记录摄像头仍有关联数据");
                    }
                }
                // mms_location-camera
                {
                    final LocationCamera obj = new LocationCamera(this.connection);
                    final Message resultMsg = obj.getLocationCamera(null, null, uuidArray, Integer.valueOf(0),
                            Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "LOCATION_CAMERA_EXIST_ASSOCIATE_DATA", "地点摄像头存在关联数据");
                    }
                }
            }
            // 删除摄像头
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
                        return new Message(Message.Status.ERROR, "REMOVE_CAMERA_FAIL", "删除摄像头失败");
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
     * 修改摄像头（至少修改一项字段）
     * 
     * @param uuid                    摄像头的uuid
     * @param code                    代码
     * @param name                    名称（允许为null）
     * @param description             描述（允许为空，为null不修改，长度为0则清空）
     * @param url                     地址（允许为null）
     * @param protocolType            协议类型（允许为null）
     * @param connectType             连接类型（允许为null）
     * @param lng                     经度（允许为空，为null不修改，长度为0则清空）
     * @param lat                     纬度（允许为空，为null不修改，长度为0则清空）
     * @param platformExtendParameter 平台扩展参数（允许为空，为null不修改，长度为0则清空）
     * @param lastCaptureData         最后抓拍数据（允许为空，为null不修改，长度为0则清空）
     * @param lastCaptureDatetime     最后抓拍时间（允许为空，为null不修改，长度为0则清空）
     * @return 消息对象
     */
    public final Message modifyCamera(final String uuid, String code, final String name, final String description,
            final String url, final ProtocolType protocolType, final ConnectType connectType,
            final String lng, final String lat, final String platformExtendParameter, final String lastCaptureData,
            final String lastCaptureDatetime) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { code, name, description, url, protocolType, connectType, lng, lat,
                        platformExtendParameter, lastCaptureData, lastCaptureDatetime });
            }
            // 是否存在摄像头
            {
                final Message resultMsg = this.getCamera(new String[] { uuid }, null, null, null, null, null,
                        Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "CAMERA_NOT_EXIST", "摄像头不存在");
                }
            }
            // 是否存在摄像头代码
            {
                if (null != code) {
                    final Message resultMsg = this.getCamera(null, new String[] { code }, null, null, null, null,
                            Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 < array.length()) {
                        return new Message(Message.Status.ERROR, "CAMERA_CODE_EXIST", "摄像头代码已存在");
                    }
                }
            }
            // // 是否存在重名摄像头
            // {
            // if (null != name) {
            // final Message resultMsg = this.getCamera(null, null, new String[] { name },
            // null,
            // new String[] { uuid }, Integer.valueOf(0), Integer.valueOf(1));
            // if (Message.Status.SUCCESS != resultMsg.getStatus()) {
            // return resultMsg;
            // }
            // final JSONArray array = ((JSONObject)
            // resultMsg.getContent()).getJSONArray("array");
            // if (0 < array.length()) {
            // return new Message(Message.Status.ERROR, "CAMERA_NAME_EXIST", "摄像头名称已存在");
            // }
            // }
            // }
            // 修改摄像头
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
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
                    if (null != url) {
                        hm.put("url", url);
                    }
                    if (null != protocolType) {
                        hm.put("protocol_type", protocolType.toString());
                    }
                    if (null != connectType) {
                        hm.put("connect_type", connectType.toString());
                    }
                    if (null != lng) {
                        if (0 >= lng.length()) {
                            hm.put("lng", null);
                        } else {
                            hm.put("lng", lng);
                        }
                    }
                    if (null != lat) {
                        if (0 >= lat.length()) {
                            hm.put("lat", null);
                        } else {
                            hm.put("lat", lat);
                        }
                    }
                    if (null != platformExtendParameter) {
                        if (0 >= platformExtendParameter.length()) {
                            hm.put("platform_extend_parameter", null);
                        } else {
                            hm.put("platform_extend_parameter", platformExtendParameter);
                        }
                    }
                    if (null != lastCaptureData) {
                        hm.put("last_capture_data", lastCaptureData);
                    }
                    if (null != lastCaptureDatetime) {
                        hm.put("last_capture_timestamp",
                                Long.valueOf(this.simpleDateFormat.parse(lastCaptureDatetime).getTime()));
                        hm.put("last_capture_datetime", lastCaptureDatetime);
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_CAMERA_FAIL", "修改摄像头失败");
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
     * 获取摄像头
     * 
     * @param uuidArray        摄像头的uuid数组（允许为null）
     * @param codeArray        名称的数组（允许为null）
     * @param nameArray        名称的数组（允许为null）
     * @param nameLike         名称的模糊查询（允许为null）
     * @param excludeUuidArray 排除摄像头类型的uuid数组（允许为null）
     * @param offset           查询的偏移（允许为null）
     * @param rows             查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getCamera(final String[] uuidArray, final String[] codeArray, final String[] nameArray,
            final String nameLike, final String descriptionLike, final String[] excludeUuidArray, final Integer offset,
            final Integer rows) {
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
            if (null != codeArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "code");
                obj.put("symbol", "in");
                obj.put("value", codeArray);
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
            if (null != descriptionLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "description");
                obj.put("symbol", "like");
                obj.put("value", "%" + descriptionLike + "%");
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
                    ps = this.connection.prepareStatement(
                            "select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` " + whereSql);
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
                            "select * from `" + DATABASE_TABLE_NAME + "` " + whereSql + " " + limitCode);
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