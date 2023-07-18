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
 * 事件记录-摄像头
 */
public final class EventRecordCamera extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_event-record-camera";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public EventRecordCamera(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加事件记录-摄像头
     * 
     * @param recordUuid 记录的uuid
     * @param cameraUuid 摄像头的uuid
     * @param captureData 抓拍数据
     * @return 消息对象
     */
    public final Message addEventRecordCamera(final String recordUuid, final String cameraUuid, final String captureData) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { recordUuid, cameraUuid, captureData });
            }
            // 是否存在事件记录
            {
                final EventRecord obj = new EventRecord(this.connection);
                final Message resultMsg = obj.getEventRecord(new String[] { recordUuid }, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "EVENT_RECORD_NOT_EXIST", "事件记录不存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加事件记录
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("record_uuid", recordUuid);
                    hm.put("camera_uuid", cameraUuid);
                    hm.put("capture_data", captureData);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_EVENT_RECORD_CAMERA_FAIL", "添加事件记录摄像头失败");
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
     * 获取事件记录摄像头
     * 
     * @param uuidArray 事件记录的uuid数组（允许为null）
     * @param recordUuidArray 记录的uuid数组（允许为null）
     * @param cameraUuidArray 摄像头的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public Message getEventRecordCamera(final String[] uuidArray, final String[] recordUuidArray, final String[] cameraUuidArray, final Integer offset, final Integer rows) {
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
            if (null != recordUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "record_uuid");
                obj.put("symbol", "in");
                obj.put("value", recordUuidArray);
                whereArray.put(obj);
            }
            if (null != cameraUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "camera_uuid");
                obj.put("symbol", "in");
                obj.put("value", cameraUuidArray);
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
                    ps = this.connection.prepareStatement("select * from `" + DATABASE_TABLE_NAME + "` " + whereSql + " order by `create_timestamp` asc " + limitCode);
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