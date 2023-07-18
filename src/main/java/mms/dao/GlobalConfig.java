package mms.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import org.json.JSONArray;
import org.json.JSONObject;
import com.palestink.server.sdk.module.AbstractDao;
import com.palestink.server.sdk.module.exception.MessageParameterException;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.db.DatabaseKit;
import com.palestink.utils.string.StringKit;

/**
 * 全局配置
 */
public final class GlobalConfig extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "mms_global-config";
    private Connection connection;

    public GlobalConfig(final Connection connection) throws Exception {
        this.connection = connection;
    }

    /**
     * 修改全局配置（至少修改一项字段）
     * 
     * @param mmsServerIp 模型超市后台ip（允许为null）
     * @param mmsServerPort 模型超市后台端口（允许为空）
     * @return 消息对象
     */
    public final Message modifyGlobalConfig(final String mmsServerIp, final Integer mmsServerPort) {
        try {
            // 数据检查
            {
                // 至少一个不为空
                this.oneNotNull(new Object[] { mmsServerIp, mmsServerPort });
            }
            // 修改全局配置
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` is not null";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != mmsServerIp) {
                        hm.put("mms_server_ip", mmsServerIp);
                    }
                    if (null != mmsServerPort) {
                        hm.put("mms_server_port", mmsServerPort);
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_GLOBAL_CONFIG_FAIL", "修改全局配置失败");
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
     * 获取全局配置
     * 
     * @return 消息对象
     */
    public Message getGlobalConfig() {
        try {
            final JSONObject resultObj = new JSONObject();
            final JSONArray array = new JSONArray();
            {
                PreparedStatement ps = null;
                ResultSet rs = null;
                try {
                    ps = this.connection.prepareStatement("select * from `" + DATABASE_TABLE_NAME + "`");
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