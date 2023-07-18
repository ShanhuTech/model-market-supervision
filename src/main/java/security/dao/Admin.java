package security.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import org.json.JSONArray;
import org.json.JSONObject;
import com.palestink.server.sdk.module.AbstractDao;
import com.palestink.server.sdk.module.exception.MessageParameterException;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.db.DatabaseKit;
import com.palestink.utils.encrypt.Md5;
import com.palestink.utils.string.StringKit;
import security.Account;

/**
 * 管理员
 */
public final class Admin extends AbstractDao {
    // 数据库表名
    public static final String DATABASE_TABLE_NAME = "security_admin";
    public static final String DATABASE_TABLE_NAME_INFO = "security_admin-info";
    // JwtKey的Map
    public static final HashMap<String, String> JWT_KEY_MAP = new HashMap<>();
    static {
        Admin.JWT_KEY_MAP.put("LOGIN_TOKEN", "LOGIN_TOKEN"); // 登入Token
        Admin.JWT_KEY_MAP.put("ORG_UUID", "ORG_UUID"); // 组织架构的uuid
        Admin.JWT_KEY_MAP.put("ROLE_UUID", "ROLE_UUID"); // 角色的uuid
        // （若有其他登入后需要放入Token的数据，可通过静态调用添加）
    }
    // 登入失败重试计数（单位:次）
    public static final int LOGIN_FAILED_RETRY_COUNT = 5;
    // 账户冻结时间（默认:10分钟）
    public static final long ACCOUNT_FROZEN_TIME = 1000 * 60 * 10;

    // 状态
    public static enum Status {
        // 正常
        NORMAL,
        // 冻结
        FROZEN,
        // 锁定
        LOCK
    }

    private Connection connection;
    private SimpleDateFormat simpleDateFormat;
    private Account account;

    public Admin(final Connection connection) throws Exception {
        this.connection = connection;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.account = new Account();
    }

    /**
     * 添加管理员
     * 
     * @param orgUuid 组织架构的uuid
     * @param roleUuid 角色的uuid
     * @param name 名称
     * @param password 密码
     * @return 消息对象
     */
    public final Message addAdmin(final String orgUuid, final String roleUuid, final String name, final String password) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { orgUuid, roleUuid, name, password });
            }
            // 是否存在组织架构
            {
                final Org obj = new Org(this.connection);
                final Message resultMsg = obj.getOrg(new String[] { orgUuid }, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "ORG_NOT_EXIST", "组织架构不存在");
                }
            }
            // 是否存在角色
            {
                final Role obj = new Role(this.connection);
                final Message resultMsg = obj.getRole(new String[] { roleUuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "ROLE_NOT_EXIST", "角色不存在");
                }
            }
            // 是否存在管理员名称
            {
                final Message resultMsg = this.getAdmin(null, null, null, new String[] { name }, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                if (0 < array.length()) {
                    return new Message(Message.Status.ERROR, "ADMIN_NAME_EXIST", "管理员名称已存在");
                }
            }
            final String uuid = StringKit.getUuidStr(true);
            final long createTimestamp = System.currentTimeMillis();
            final String createDatetime = this.simpleDateFormat.format(new Date(createTimestamp));
            // 添加管理员
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("uuid", uuid);
                    hm.put("org_uuid", orgUuid);
                    hm.put("role_uuid", roleUuid);
                    hm.put("name", name);
                    hm.put("password", Md5.encode(password.getBytes()));
                    hm.put("failed_retry_count", Integer.valueOf(0));
                    hm.put("login_token", uuid);
                    hm.put("status", Status.NORMAL.toString());
                    hm.put("create_timestamp", Long.valueOf(createTimestamp));
                    hm.put("create_datetime", createDatetime);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_ADMIN_FAIL", "添加管理员失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            // 添加管理员信息
            {
                PreparedStatement ps = null;
                try {
                    final HashMap<String, Object> hm = new HashMap<>();
                    hm.put("admin_uuid", uuid);
                    final String sql = DatabaseKit.composeInsertSql(DATABASE_TABLE_NAME_INFO, hm);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "ADD_ADMIN_INFO_FAIL", "添加管理员信息失败");
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
     * 根据uuid删除管理员
     * 
     * @param uuidArray 管理员的uuid数组
     * @return 消息对象
     */
    public final Message removeAdminByUuid(final String[] uuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuidArray });
            }
            // 删除管理员
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
                        return new Message(Message.Status.ERROR, "REMOVE_ADMIN_FAIL", "删除管理员失败");
                    }
                } finally {
                    if (null != ps) {
                        ps.close();
                    }
                }
            }
            // 删除关联
            // 未来肯定有，比如存储文件等等！
            return new Message(Message.Status.SUCCESS, null, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }

    /**
     * 根据组织架构的uuid删除管理员
     * 
     * @param orgUuidArray 组织架构的uuid数组
     * @return 消息对象
     */
    public final Message removeAdminByOrgUuid(final String[] orgUuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { orgUuidArray });
            }
            // 删除管理员
            {
                final JSONArray whereArray = new JSONArray();
                {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("name", "org_uuid");
                    obj.put("symbol", "in");
                    obj.put("value", orgUuidArray);
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
                        return new Message(Message.Status.ERROR, "REMOVE_ADMIN_FAIL", "删除管理员失败");
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
     * 根据角色的uuid删除管理员
     * 
     * @param roleUuidArray 角色的uuid数组
     * @return 消息对象
     */
    public final Message removeAdminByRoleUuid(final String[] roleUuidArray) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { roleUuidArray });
            }
            // 删除管理员
            {
                final JSONArray whereArray = new JSONArray();
                {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("name", "role_uuid");
                    obj.put("symbol", "in");
                    obj.put("value", roleUuidArray);
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
                        return new Message(Message.Status.ERROR, "REMOVE_ADMIN_FAIL", "删除管理员失败");
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
     * 修改管理员（至少修改一项字段）
     * 
     * @param uuid 管理员的uuid
     * @param orgUuid 组织架构的uuid（允许为空）
     * @param roleUuid 角色的uuid（允许为空）
     * @param name 名称（允许为空）
     * @param password 密码（允许为空）
     * @param failedRetryCount 失败重复计数（允许为空）
     * @param loginToken 登陆令牌（允许为空）
     * @param frozenDatetime 冻结时间（允许为空，为null不修改，长度为0则清空）
     * @param status 状态（允许为空）
     * @return 消息对象
     */
    public final Message modifyAdmin(final String uuid, final String orgUuid, final String roleUuid, final String name, final String password, final Integer failedRetryCount, final String loginToken,
        final String frozenDatetime, final Status status) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { name, orgUuid, roleUuid, name, password, failedRetryCount, loginToken, frozenDatetime, status });
            }
            // 是否存在管理员
            {
                // 是否存在管理员
                {
                    final Message resultMsg = this.getAdmin(new String[] { uuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "ADMIN_NOT_EXIST", "管理员不存在");
                    }
                }
            }
            // 是否存在组织架构
            {
                if (null != orgUuid) {
                    final Org obj = new Org(this.connection);
                    final Message resultMsg = obj.getOrg(new String[] { orgUuid }, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "ORG_NOT_EXIST", "组织架构不存在");
                    }
                }
            }
            // 是否存在角色
            {
                if (null != roleUuid) {
                    final Role obj = new Role(this.connection);
                    final Message resultMsg = obj.getRole(new String[] { roleUuid }, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "ROLE_NOT_EXIST", "角色不存在");
                    }
                }
            }
            // 是否存在重名管理员
            {
                if (null != name) {
                    // 是否存在管理员名称
                    {
                        final Message resultMsg = this.getAdmin(null, null, null, new String[] { name }, null, null, null, null, new String[] { uuid }, Integer.valueOf(0), Integer.valueOf(1));
                        if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                            return resultMsg;
                        }
                        final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                        if (0 < array.length()) {
                            return new Message(Message.Status.ERROR, "ADMIN_NAME_EXIST", "管理员名称已存在");
                        }
                    }
                }
            }
            // 修改管理员
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != orgUuid) {
                        hm.put("org_uuid", orgUuid);
                    }
                    if (null != roleUuid) {
                        hm.put("role_uuid", roleUuid);
                    }
                    if (null != name) {
                        hm.put("name", name);
                    }
                    if (null != password) {
                        hm.put("password", Md5.encode(password.getBytes()));
                    }
                    if (null != failedRetryCount) {
                        hm.put("failed_retry_count", failedRetryCount);
                    }
                    if (null != loginToken) {
                        hm.put("login_token", loginToken);
                    }
                    if (null != frozenDatetime) {
                        if (0 >= frozenDatetime.length()) {
                            hm.put("frozen_timestamp", null);
                            hm.put("frozen_datetime", null);
                        } else {
                            hm.put("frozen_timestamp", Long.valueOf(this.simpleDateFormat.parse(frozenDatetime).getTime()));
                            hm.put("frozen_datetime", frozenDatetime);
                        }
                    }
                    if (null != status) {
                        hm.put("status", status.toString());
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_ADMIN_FAIL", "修改管理员失败");
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
     * 修改管理员信息（至少修改一项字段）
     * 
     * @param uuid 管理员的uuid
     * @param nickName 昵称（允许为空，为null不修改，长度为0则清空）
     * @param realName 真实姓名（允许为空，为null不修改，长度为0则清空）
     * @param gender 性别（允许为空，为null不修改，长度为0则清空）
     * @param birthdayDatetime 生日时间（允许为空，为null不修改，长度为0则清空）
     * @param email email（允许为空，为null不修改，长度为0则清空）
     * @param telephoneNumbers 电话号码（允许为空，为null不修改，长度为0则清空）
     * @param idCardType 身份证件类型（允许为空，为null不修改，长度为0则清空）
     * @param idCardNumber 身份证件号码（允许为空，为null不修改，长度为0则清空）
     * @param avatar 头像（允许为空，为null不修改，长度为0则清空）
     * @param level 等级（允许为空，为null不修改，长度为0则清空）
     * @param balance 余额（允许为空，为null不修改，长度为0则清空）
     * @param score 分值（允许为空，为null不修改，长度为0则清空）
     * @param points 积分（允许为空，为null不修改，长度为0则清空）
     * @param lastLoginIp 最后登入ip（允许为空，为null不修改，长度为0则清空）
     * @param lastLoginDatetime 最后登入时间（允许为空，为null不修改，长度为0则清空）
     * @param lastUpdateDatetime 最后修改时间（允许为空，为null不修改，长度为0则清空）
     * @return 消息对象
     */
    public final Message modifyAdminInfo(final String uuid, final String nickName, final String realName, final String gender, final String birthdayDatetime, final String email, final String telephoneNumbers,
        final String idCardType, final String idCardNumber, final String avatar, final String level, final String balance, final String score, final String points, final String lastLoginIp,
        final String lastLoginDatetime, final String lastUpdateDatetime) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { uuid });
                // 至少一个不为空
                this.oneNotNull(new Object[] { nickName, realName, gender, birthdayDatetime, email, telephoneNumbers, idCardType, idCardNumber, avatar, level, balance, score, points, lastLoginIp,
                    lastLoginDatetime, lastUpdateDatetime });
            }
            // 是否存在管理员
            {
                // 是否存在管理员
                {
                    final Message resultMsg = this.getAdmin(new String[] { uuid }, null, null, null, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return resultMsg;
                    }
                    final JSONArray array = ((JSONObject) resultMsg.getContent()).getJSONArray("array");
                    if (0 >= array.length()) {
                        return new Message(Message.Status.ERROR, "ADMIN_NOT_EXIST", "管理员不存在");
                    }
                }
            }
            // 修改管理员
            {
                PreparedStatement ps = null;
                try {
                    final String whereSql = "where `admin_uuid` = '" + uuid + "'";
                    final HashMap<String, Object> hm = new HashMap<>();
                    if (null != nickName) {
                        if (0 >= nickName.length()) {
                            hm.put("nick_name", null);
                        } else {
                            hm.put("nick_name", nickName);
                        }
                    }
                    if (null != realName) {
                        if (0 >= realName.length()) {
                            hm.put("real_name", null);
                        } else {
                            hm.put("real_name", realName);
                        }
                    }
                    if (null != gender) {
                        if (0 >= gender.length()) {
                            hm.put("gender", null);
                        } else {
                            hm.put("gender", gender);
                        }
                    }
                    if (null != birthdayDatetime) {
                        if (0 >= birthdayDatetime.length()) {
                            hm.put("birthday_timestamp", null);
                            hm.put("birthday_datetime", null);
                        } else {
                            hm.put("birthday_timestamp", Long.valueOf(this.simpleDateFormat.parse(birthdayDatetime).getTime()));
                            hm.put("birthday_datetime", birthdayDatetime);
                        }
                    }
                    if (null != email) {
                        if (0 >= email.length()) {
                            hm.put("email", null);
                        } else {
                            hm.put("email", email);
                        }
                    }
                    if (null != telephoneNumbers) {
                        if (0 >= telephoneNumbers.length()) {
                            hm.put("telephone_numbers", null);
                        } else {
                            hm.put("telephone_numbers", telephoneNumbers);
                        }
                    }
                    if (null != idCardType) {
                        if (0 >= idCardType.length()) {
                            hm.put("id_card_type", null);
                        } else {
                            hm.put("id_card_type", idCardType);
                        }
                    }
                    if (null != idCardNumber) {
                        if (0 >= idCardNumber.length()) {
                            hm.put("id_card_number", null);
                        } else {
                            hm.put("id_card_number", idCardNumber);
                        }
                    }
                    if (null != avatar) {
                        if (0 >= avatar.length()) {
                            hm.put("avatar", null);
                        } else {
                            hm.put("avatar", avatar);
                        }
                    }
                    if (null != level) {
                        if (0 >= level.length()) {
                            hm.put("level", null);
                        } else {
                            hm.put("level", level);
                        }
                    }
                    if (null != balance) {
                        if (0 >= balance.length()) {
                            hm.put("balance", null);
                        } else {
                            hm.put("balance", balance);
                        }
                    }
                    if (null != score) {
                        if (0 >= score.length()) {
                            hm.put("score", null);
                        } else {
                            hm.put("score", score);
                        }
                    }
                    if (null != points) {
                        if (0 >= points.length()) {
                            hm.put("points", null);
                        } else {
                            hm.put("points", points);
                        }
                    }
                    if (null != lastLoginIp) {
                        if (0 >= lastLoginIp.length()) {
                            hm.put("last_login_ip", null);
                        } else {
                            hm.put("last_login_ip", lastLoginIp);
                        }
                    }
                    if (null != lastLoginDatetime) {
                        if (0 >= lastLoginDatetime.length()) {
                            hm.put("last_login_timestamp", null);
                            hm.put("last_login_datetime", null);
                        } else {
                            hm.put("last_login_timestamp", Long.valueOf(this.simpleDateFormat.parse(lastLoginDatetime).getTime()));
                            hm.put("last_login_datetime", lastLoginDatetime);
                        }
                    }
                    if (null != lastUpdateDatetime) {
                        if (0 >= lastUpdateDatetime.length()) {
                            hm.put("last_update_timestamp", null);
                            hm.put("last_update_datetime", null);
                        } else {
                            hm.put("last_update_timestamp", Long.valueOf(this.simpleDateFormat.parse(lastUpdateDatetime).getTime()));
                            hm.put("last_update_datetime", lastUpdateDatetime);
                        }
                    }
                    final String sql = DatabaseKit.composeUpdateSql(DATABASE_TABLE_NAME_INFO, hm, whereSql);
                    ps = this.connection.prepareStatement(sql);
                    final int res = ps.executeUpdate();
                    if (0 >= res) {
                        return new Message(Message.Status.ERROR, "MODIFY_ADMIN_FAIL", "修改管理员失败");
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
     * 获取管理员
     * 
     * @param uuidArray 管理员的uuid数组（允许为null）
     * @param orgUuidArray 组织架构的uuid数组（允许为null）
     * @param roleUuidArray 管理员的uuid数组（允许为null）
     * @param nameArray 名称的数组（允许为null）
     * @param nameLike 名称的模糊查询（允许为null）
     * @param frozenDatetimeRange 冻结时间的范围（格式：new String[] {开始时间}、new String[] {开始时间,
     *            结束时间}）（允许为null）
     * @param statusArray 状态的数组（允许为null）
     * @param createDatetimeRange 创建时间的范围（格式：new String[] {开始时间}、new String[] {开始时间,
     *            结束时间}）（允许为null）
     * @param excludeUuidArray 排除管理员的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public Message getAdmin(final String[] uuidArray, final String[] orgUuidArray, final String[] roleUuidArray, final String[] nameArray, final String nameLike, final String[] frozenDatetimeRange,
        final Status[] statusArray, final String[] createDatetimeRange, final String[] excludeUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != orgUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "org_uuid");
                obj.put("symbol", "in");
                obj.put("value", orgUuidArray);
                whereArray.put(obj);
            }
            if (null != roleUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "role_uuid");
                obj.put("symbol", "in");
                obj.put("value", roleUuidArray);
                whereArray.put(obj);
            }
            if (null != nameArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "name");
                obj.put("symbol", "in");
                obj.put("value", nameArray);
                whereArray.put(obj);
            }
            if (null != nameLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "name");
                obj.put("symbol", "like");
                obj.put("value", "%" + nameLike + "%");
                whereArray.put(obj);
            }
            if (null != frozenDatetimeRange) {
                if (0 < frozenDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "a");
                    obj.put("name", "frozen_timestamp");
                    obj.put("symbol", ">");
                    obj.put("value", this.simpleDateFormat.parse(frozenDatetimeRange[0]).getTime());
                    whereArray.put(obj);
                }
                if (1 < frozenDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "a");
                    obj.put("name", "frozen_timestamp");
                    obj.put("symbol", "<");
                    obj.put("value", this.simpleDateFormat.parse(frozenDatetimeRange[1]).getTime());
                    whereArray.put(obj);
                }
            }
            if (null != statusArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "status");
                obj.put("symbol", "in");
                obj.put("value", statusArray);
                whereArray.put(obj);
            }
            if (null != createDatetimeRange) {
                if (0 < createDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "a");
                    obj.put("name", "create_timestamp");
                    obj.put("symbol", ">");
                    obj.put("value", this.simpleDateFormat.parse(createDatetimeRange[0]).getTime());
                    whereArray.put(obj);
                }
                if (1 < createDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "a");
                    obj.put("name", "create_timestamp");
                    obj.put("symbol", "<");
                    obj.put("value", this.simpleDateFormat.parse(createDatetimeRange[1]).getTime());
                    whereArray.put(obj);
                }
            }
            if (null != excludeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "uuid");
                obj.put("symbol", "not in");
                obj.put("value", excludeUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
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
                    ps = this.connection.prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME + "` a " + whereSql);
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
                        "select a.*, o.`name` as `org_name`, r.`name` as `role_name`, r.`permissions` as `permissions` from `" + DATABASE_TABLE_NAME + "` a inner join `" + Org.DATABASE_TABLE_NAME
                            + "` o on a.`org_uuid` = o.`uuid` inner join `" + Role.DATABASE_TABLE_NAME + "` r on a.`role_uuid` = r.`uuid` " + whereSql + " order by a.`create_timestamp` desc " + limitCode);
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
     * 获取管理员
     * 
     * @param uuidArray 管理员的uuid数组（允许为null）
     * @param nickNameArray 昵称的数组（允许为null）
     * @param nickNameLike 昵称的模糊查询（允许为null）
     * @param realNameArray 真实姓名的数组（允许为null）
     * @param realNameLike 真实姓名的模糊查询（允许为null）
     * @param genderArray 性别的数组（允许为null）
     * @param birthdayDatetimeRange 生日时间的范围（格式：new String[] {开始时间}、new String[]
     *            {开始时间, 结束时间}）（允许为null）
     * @param emailArray email的数组（允许为null）
     * @param emailLike email的模糊查询（允许为null）
     * @param telephoneNumbersLike 电话号码的模糊查询（允许为null）
     * @param idCardTypeArray 身份证件类型的数组（允许为null）
     * @param idCardNumberArray 身份证件号码的数组（允许为null）
     * @param levelArray 等级的uuid数组（允许为null）
     * @param balanceRange 余额的范围（格式：new String[] {开始时间}、new String[]
     *            {开始时间, 结束时间}）（允许为null）
     * @param scoreRange 分值的范围（格式：new String[] {开始时间}、new String[]
     *            {开始时间, 结束时间}）（允许为null）
     * @param pointsRange 积分的范围（格式：new String[] {开始时间}、new String[]
     *            {开始时间, 结束时间}）（允许为null）
     * @param lastLoginIpArray 最后登入ip的数组（允许为null）
     * @param lastLoginDatetimeRange 最后登入时间的范围（格式：new String[] {开始时间}、new String[]
     *            {开始时间, 结束时间}）（允许为null）
     * @param lastUpdateDatetimeRange 最后修改时间的范围（格式：new String[] {开始时间}、new String[]
     *            {开始时间, 结束时间}）（允许为null）
     * @param excludeUuidArray 排除管理员的uuid数组（允许为null）
     * @param offset 查询的偏移（允许为null）
     * @param rows 查询的行数（允许为null）
     * @return 消息对象
     */
    public Message getAdminInfo(final String[] uuidArray, final String[] nickNameArray, final String nickNameLike, final String[] realNameArray, final String realNameLike, final String[] genderArray,
        final String[] birthdayDatetimeRange, final String[] emailArray, final String emailLike, final String telephoneNumbersLike, final String[] idCardTypeArray, final String[] idCardNumberArray,
        final String[] levelArray, final String[] balanceRange, final String[] scoreRange, final String[] pointsRange, final String[] lastLoginIpArray, final String[] lastLoginDatetimeRange,
        final String[] lastUpdateDatetimeRange, final String[] excludeUuidArray, final Integer offset, final Integer rows) {
        try {
            final JSONArray whereArray = new JSONArray();
            if (null != uuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "uuid");
                obj.put("symbol", "in");
                obj.put("value", uuidArray);
                whereArray.put(obj);
            }
            if (null != nickNameArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "nick_name");
                obj.put("symbol", "in");
                obj.put("value", nickNameArray);
                whereArray.put(obj);
            }
            if (null != nickNameLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "nick_name");
                obj.put("symbol", "like");
                obj.put("value", "%" + nickNameLike + "%");
                whereArray.put(obj);
            }
            if (null != realNameArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "real_name");
                obj.put("symbol", "in");
                obj.put("value", realNameArray);
                whereArray.put(obj);
            }
            if (null != realNameLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "real_name");
                obj.put("symbol", "like");
                obj.put("value", "%" + realNameLike + "%");
                whereArray.put(obj);
            }
            if (null != genderArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "gender");
                obj.put("symbol", "in");
                obj.put("value", genderArray);
                whereArray.put(obj);
            }
            if (null != birthdayDatetimeRange) {
                if (0 < birthdayDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "birthday_timestamp");
                    obj.put("symbol", ">");
                    obj.put("value", this.simpleDateFormat.parse(birthdayDatetimeRange[0]).getTime());
                    whereArray.put(obj);
                }
                if (1 < birthdayDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "birthday_timestamp");
                    obj.put("symbol", "<");
                    obj.put("value", this.simpleDateFormat.parse(birthdayDatetimeRange[1]).getTime());
                    whereArray.put(obj);
                }
            }
            if (null != emailArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "email");
                obj.put("symbol", "in");
                obj.put("value", emailArray);
                whereArray.put(obj);
            }
            if (null != emailLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "email");
                obj.put("symbol", "like");
                obj.put("value", "%" + emailLike + "%");
                whereArray.put(obj);
            }
            if (null != telephoneNumbersLike) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "telephone_numbers");
                obj.put("symbol", "like");
                obj.put("value", "%" + telephoneNumbersLike + "%");
                whereArray.put(obj);
            }
            if (null != idCardTypeArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "id_card_type");
                obj.put("symbol", "in");
                obj.put("value", idCardTypeArray);
                whereArray.put(obj);
            }
            if (null != idCardNumberArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "id_card_number");
                obj.put("symbol", "in");
                obj.put("value", idCardNumberArray);
                whereArray.put(obj);
            }
            if (null != levelArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "level");
                obj.put("symbol", "in");
                obj.put("value", levelArray);
                whereArray.put(obj);
            }
            if (null != balanceRange) {
                if (0 < balanceRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "balance");
                    obj.put("symbol", ">");
                    obj.put("value", balanceRange[0]);
                    whereArray.put(obj);
                }
                if (1 < balanceRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "balance");
                    obj.put("symbol", "<");
                    obj.put("value", balanceRange[1]);
                    whereArray.put(obj);
                }
            }
            if (null != scoreRange) {
                if (0 < scoreRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "score");
                    obj.put("symbol", ">");
                    obj.put("value", scoreRange[0]);
                    whereArray.put(obj);
                }
                if (1 < scoreRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "score");
                    obj.put("symbol", "<");
                    obj.put("value", scoreRange[1]);
                    whereArray.put(obj);
                }
            }
            if (null != pointsRange) {
                if (0 < pointsRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "points");
                    obj.put("symbol", ">");
                    obj.put("value", pointsRange[0]);
                    whereArray.put(obj);
                }
                if (1 < pointsRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "points");
                    obj.put("symbol", "<");
                    obj.put("value", pointsRange[1]);
                    whereArray.put(obj);
                }
            }
            if (null != lastLoginIpArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "i");
                obj.put("name", "last_login_ip");
                obj.put("symbol", "in");
                obj.put("value", lastLoginIpArray);
                whereArray.put(obj);
            }
            if (null != lastLoginDatetimeRange) {
                if (0 < lastLoginDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "last_login_timestamp");
                    obj.put("symbol", ">");
                    obj.put("value", this.simpleDateFormat.parse(lastLoginDatetimeRange[0]).getTime());
                    whereArray.put(obj);
                }
                if (1 < lastLoginDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "last_login_timestamp");
                    obj.put("symbol", "<");
                    obj.put("value", this.simpleDateFormat.parse(lastLoginDatetimeRange[1]).getTime());
                    whereArray.put(obj);
                }
            }
            if (null != lastUpdateDatetimeRange) {
                if (0 < lastUpdateDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "last_update_timestamp");
                    obj.put("symbol", ">");
                    obj.put("value", this.simpleDateFormat.parse(lastUpdateDatetimeRange[0]).getTime());
                    whereArray.put(obj);
                }
                if (1 < lastUpdateDatetimeRange.length) {
                    final JSONObject obj = new JSONObject();
                    obj.put("condition", "and");
                    obj.put("alias", "i");
                    obj.put("name", "last_update_timestamp");
                    obj.put("symbol", "<");
                    obj.put("value", this.simpleDateFormat.parse(lastUpdateDatetimeRange[1]).getTime());
                    whereArray.put(obj);
                }
            }
            if (null != excludeUuidArray) {
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
                obj.put("name", "uuid");
                obj.put("symbol", "not in");
                obj.put("value", excludeUuidArray);
                whereArray.put(obj);
            }
            {
                // 排除逻辑删除
                final JSONObject obj = new JSONObject();
                obj.put("condition", "and");
                obj.put("alias", "a");
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
                    ps = this.connection
                        .prepareStatement("select count(*) as `count` from `" + DATABASE_TABLE_NAME_INFO + "` i inner join `" + DATABASE_TABLE_NAME + "` a on i.`admin_uuid` = a.`uuid` " + whereSql);
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
                    ps = this.connection.prepareStatement("select i.* from `" + DATABASE_TABLE_NAME_INFO + "` i inner join `" + DATABASE_TABLE_NAME + "` a on i.`admin_uuid` = a.`uuid` " + whereSql
                        + " order by a.`create_timestamp` desc " + limitCode);
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
     * 管理员登入
     * 
     * @param name 名称
     * @param password 密码
     * @param ipAddr ip地址
     * @return 消息对象
     */
    public final Message adminLogin(final String name, final String password, final String ipAddr) {
        try {
            // 数据检查
            {
                // 全部不允许为空
                this.allNotEmpty(new Object[] { name, password });
            }
            String uuid = null;
            String orgUuid = null;
            String roleUuid = null;
            String passwordInDb = null;
            String permissions = null;
            Integer failedRetryCount = null;
            Long frozenTimestamp = null;
            Status status = null;
            // 获取账户基本信息
            {
                final Message resultMsg = this.getAdmin(null, null, null, new String[] { name }, null, null, null, null, null, Integer.valueOf(0), Integer.valueOf(1));
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return resultMsg;
                }
                final JSONObject resultObj = (JSONObject) resultMsg.getContent();
                final JSONArray array = resultObj.getJSONArray("array");
                if (0 >= array.length()) {
                    return new Message(Message.Status.ERROR, "PASSWORD_WRONG", "密码错误"); // 这里应该返回“没有找到账户”才对，但考虑到安全因素，所以返回密码错误（Password
                                                                                        // Wrong，用以区分密码错误）。
                }
                final JSONObject obj = array.getJSONObject(0);
                uuid = obj.getString("uuid");
                orgUuid = obj.getString("org_uuid");
                roleUuid = obj.getString("role_uuid");
                passwordInDb = obj.getString("password");
                failedRetryCount = Integer.valueOf(obj.getInt("failed_retry_count"));
                if (obj.has("frozen_timestamp")) {
                    frozenTimestamp = Long.valueOf(obj.getLong("frozen_timestamp"));
                }
                final String statusStr = obj.getString("status");
                status = Status.valueOf(statusStr);
                if (obj.has("permissions")) {
                    permissions = obj.getString("permissions");
                }
            }
            // 登入“检索”成功，判断账户状态。
            {
                STATUS: {
                    if (Status.NORMAL == status) { // 账户正常
                        break STATUS;
                    } else if (Status.FROZEN == status) { // 账号冻结
                        if (null != frozenTimestamp) { // 判断冻结时间是否已过
                            if ((frozenTimestamp.longValue() + Admin.ACCOUNT_FROZEN_TIME) < System.currentTimeMillis()) { // 冻结时间已过，解冻账号。
                                final Message resultMsg = this.modifyAdmin(uuid, null, null, null, null, Integer.valueOf(0), null, ""/* 清空 */, Status.NORMAL);
                                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                                    return new Message(Message.Status.ERROR, "UNFROZEN_ACCOUNT_FAIL", "解冻账户失败");
                                }
                                break STATUS;
                            }
                        }
                        return new Message(Message.Status.ERROR, "ACCOUNT_HAS_BEEN_FROZEN", "账户已冻结");
                    } else if (Status.LOCK == status) {
                        return new Message(Message.Status.ERROR, "ACCOUNT_HAS_BEEN_LOCKED", "账户已锁定");
                    } else {
                        return new Message(Message.Status.ERROR, "ACCOUNT_STATUS_EXCEPTION", "账户状态异常");
                    }
                }
            }
            // 判断密码是否匹配
            {
                final String encryptPwd = Md5.encode((password).getBytes());
                if (!passwordInDb.equalsIgnoreCase(encryptPwd)) { // 如果密码不匹配，判断是否超过最大重试计数限制。
                    // 框架对于Message非Message.Status.SUCCESS的返回都会做事务回滚处理，但这里即需要保存数据库修改有需要对前端返回ERROR，所以需要修改事务为自动提交）
                    this.connection.setAutoCommit(true);
                    final int count = Admin.LOGIN_FAILED_RETRY_COUNT - (failedRetryCount.intValue() + 1);
                    if (0 < count) { // 如果没有超过限制计数，那么增加失败重试计数。并且给予密码错误的提示信息。
                        final Message resultMsg = this.modifyAdmin(uuid, null, null, null, null, Integer.valueOf(failedRetryCount.intValue() + 1), null, null, null);
                        if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                            return new Message(Message.Status.ERROR, "INCREASE_FAILED_RETRY_COUNT_FAIL", "增加失败重试计数失败");
                        }
                        return new Message(Message.Status.ERROR, "PASSWORD_ERROR", String.format("密码错误（剩余重试次数：%d）", Integer.valueOf((Admin.LOGIN_FAILED_RETRY_COUNT - failedRetryCount.intValue() - 1))));
                    }
                    // 如果已经超过规定值，执行以下操作：冻结账号；失败重试计数归零；返回账户冻结信息。
                    final Message resultMsg = this.modifyAdmin(uuid, null, null, null, null, Integer.valueOf(0), null, StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"), Status.FROZEN);
                    if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                        return new Message(Message.Status.ERROR, "FROZEN_ACCOUNT_FAIL", "冻结账户失败");
                    }
                    return new Message(Message.Status.ERROR, "ACCOUNT_FROZEN", "密码重试次数太多账户被冻结");
                }
            }
            final String loginToken = StringKit.getUuidStr(true);
            // 用户名密码匹配，正常登入。需要重置账户数据，包括：登陆令牌、失败重试次数、冻结时间、账户状态。
            {
                final Message resultMsg = this.modifyAdmin(uuid, null, null, null, null, Integer.valueOf(0), loginToken, ""/* 清空 */, Status.NORMAL);
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return new Message(Message.Status.ERROR, "MODIFY_ACCOUNT_DATA_FAIL", "修改账户数据失败");
                }
            }
            // 修改最后登入信息
            {
                final Message resultMsg = this.modifyAdminInfo(uuid, null, null, null, null, null, null, null, null, null, null, null, null, null, ipAddr,
                    StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"), null);
                if (Message.Status.SUCCESS != resultMsg.getStatus()) {
                    return new Message(Message.Status.ERROR, "MODIFY_ACCOUNT_DATA_FAIL", "修改账户数据失败");
                }
            }
            String jwt = null;
            // 生成Jwt
            {
                final JSONArray array = new JSONArray();
                final JSONObject obj = new JSONObject();
                {
                    obj.put(Admin.JWT_KEY_MAP.get("LOGIN_TOKEN"), loginToken);
                    obj.put(Admin.JWT_KEY_MAP.get("ORG_UUID"), orgUuid);
                    obj.put(Admin.JWT_KEY_MAP.get("ROLE_UUID"), roleUuid);
                    // （若有其他登入后需要放入Token的数据，可在这里添加）
                }
                array.put(obj);
                jwt = this.account.generateToken(uuid, permissions, array);
            }
            final JSONObject resultObj = new JSONObject();
            {
                resultObj.put("name", name);
                resultObj.put("token", jwt);
                final Calendar cal = Calendar.getInstance();
                cal.add(Calendar.SECOND, Account.TOKEN_EXPIRES_TIME_IN_SECOND);
                resultObj.put("token_expires_timestamp", cal.getTimeInMillis());
                // （若有其他登入后需要返回前端的数据，可在这里添加）
            }
            return new Message(Message.Status.SUCCESS, resultObj, null);
        } catch (final MessageParameterException e) {
            return e.getExceptionMessage();
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }
}