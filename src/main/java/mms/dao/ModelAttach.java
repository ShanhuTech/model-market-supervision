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
 * 模型附件
 */
public final class ModelAttach extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_model-attach";
    private Connection connection;
    private SimpleDateFormat simpleDateFormat;

    public ModelAttach(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 添加模型附件
     * 
     * @param modelUuid 模型的uuid
     * @param title 标题
     * @param description 描述（允许为null）
     * @param data 数据
     * @return 消息对象
     */
    public final Message addModelAttach(final String modelUuid, final String title, final String description, final String data) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { modelUuid, title, data });
            }
            // 不做检查是否存在模型，因为添加模型附件时，模型数据尚未提交，所以无法检查。
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加模型附件
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("model_uuid", modelUuid);
                    hm.put("title", title);
                    hm.put("description", description);
                    hm.put("data", data);
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_MODEL_ATTACH_MODEL_FAIL", "添加模型附件失败");
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
     * 根据uuid删除模型附件
     * 
     * @param uuidArray 模型附件的uuid数组
     * @return 消息对象
     */
    public final Message removeModelAttachByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // // 关联查询
            // ...
            // 删除模型附件
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
                        return new Message(Message.Status.ERROR, "REMOVE_MODEL_ATTACH_FAIL", "删除模型附件失败");
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
     * 修改模型附件（至少修改一项字段）
     * 
     * @param uuid 模型附件的uuid
     * @param modelUuid 模型的uuid
     * @return 消息对象
     */
    public final Message modifyModelAttach(final String uuid, final String modelUuid, final String title, final String description, final String data) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { modelUuid, title, description, data });
            }
            // 是否存在模型附件
            {
                final Message resultMsg = this.getModelAttach(new String[] { uuid }, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "MODEL_ATTACH_NOT_EXIST", "模型附件不存在");
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
            // 修改模型附件
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != modelUuid) {
                        hm.put("model_uuid", modelUuid);
                    }
                    if (null != title) {
                        hm.put("title", title);
                    }
                    if (null != description) {
                        if (0 >= description.length()) {
                            hm.put("description", null);
                        } else {
                            hm.put("description", description);
                        }
                    }
                    if (null != data) {
                        hm.put("data", data);
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_MODEL_ATTACH_FAIL", "修改模型附件失败");
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
     * 获取模型附件
     * 
     * @param uuidArray 模型附件的uuid数组（允许为null）
     * @param modelUuidArray 模型的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public final Message getModelAttach(final String[] uuidArray, final String[] modelUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "ma");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != modelUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "ma");
                obj.put("name", "model_uuid");
                obj.put("symbol", "in");
                obj.put("value", modelUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "ma");
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
                    ps = this.connection.prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` ma " + whereSql);
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
                    ps = this.connection.prepareStatement("select ma.*, m.`name` as `model_name` from `" + DATABASE_TABLE_NAME + "` ma inner join `" + Model.DATABASE_TABLE_NAME
                        + "` m on ma.`model_uuid` = m.`uuid` " + whereSql + " order by ma.`create_timestamp` desc " + limitCode);
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