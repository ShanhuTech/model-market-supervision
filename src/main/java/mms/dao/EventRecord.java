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
 * 事件记录
 */
public final class EventRecord extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_event-record";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public EventRecord(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加事件记录
     * 
     * @param alarmId      警告的id（事件回调的id）
     * @param locationUuid 地点的uuid
     * @param eventId      事件的id
     * @return 消息对象
     */
    public final Message addEventRecord(final String alarmId, final String locationUuid, final String eventId) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { alarmId, locationUuid, eventId });
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
                    hm.put("alarm_id", alarmId);
                    hm.put("location_uuid", locationUuid);
                    hm.put("event_id", eventId);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_EVENT_RECORD_FAIL", "添加事件记录失败");
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
     * 获取事件记录
     * 注意：事件推送原则上不应保存，所以只做记录保存，因此获取数据时不做关联查询，避免关联数据修改删除后的缺失造成不能匹配记录的情况。
     * 
     * @param uuidArray         事件记录的uuid数组（允许为null）
     * @param alarmIdArray      警告的id数组（允许为null）
     * @param locationUuidArray 地点的uuid数组（允许为null）
     * @param eventIdArray      事件的id数组（允许为null）
     * @param offset            查询的偏移（允许为null）
     * @param rows              查询的行数（允许为null）
     * @return 消息对象
     */
    public Message getEventRecord(final String[] uuidArray, final String[] alarmIdArray,
            final String[] locationUuidArray, final String[] eventIdArray, final Integer offset, final Integer rows) {
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
            if (null != alarmIdArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "alarm_id");
                obj.put("symbol", "in");
                obj.put("value", alarmIdArray);
                whereArray.put(obj);
            }
            if (null != locationUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "location_uuid");
                obj.put("symbol", "in");
                obj.put("value", locationUuidArray);
                whereArray.put(obj);
            }
            if (null != eventIdArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("name", "event_id");
                obj.put("symbol", "in");
                obj.put("value", eventIdArray);
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
                    ps = this.connection.prepareStatement("select * from `" + DATABASE_TABLE_NAME + "` " + whereSql
                            + " order by `create_timestamp` desc " + limitCode);
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
                        // 附加事件记录摄像头数据
                        {
                            final String recordUuid = obj.getString("uuid");
                            final EventRecordCamera erc = new EventRecordCamera(this.connection);
                            final Message resultMsg = erc.getEventRecordCamera(null, new String[] { recordUuid }, null,
                                    null, null);
                            if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                                return resultMsg;
                            }
                            final JSONArray ercArray = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                            if (0 < ercArray.length()) {
                                obj.put("camera", ercArray);
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
}