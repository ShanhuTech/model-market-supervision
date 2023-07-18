package security;

import java.sql.Connection;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.palestink.server.sdk.Framework;
import com.palestink.server.sdk.module.AbstractModule;
import com.palestink.server.sdk.module.annotation.Module;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.encrypt.Jwt;
import com.palestink.utils.string.StringKit;

@Module(description = "账户")
public final class Account extends AbstractModule {
    // 账号角色令牌的过期时间（默认值：3分钟）（单位：秒）
    public static final int TOKEN_EXPIRES_TIME_IN_SECOND = 1 * 60 * 3;
    @SuppressWarnings("unused")
    private HttpServlet httpServlet;
    private HttpServletRequest httpServletRequest;
    @SuppressWarnings("unused")
    private HttpServletResponse httpServletResponse;
    @SuppressWarnings("unused")
    private HashMap<String, Object> parameter;
    @SuppressWarnings("unused")
    private Connection connection;

    public Account() {
    }

    public Account(final HttpServlet httpServlet, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse, final HashMap<String, Object> parameter) {
        super(httpServlet, httpServletRequest, httpServletResponse, parameter);
        this.httpServlet = httpServlet;
        this.httpServletRequest = httpServletRequest;
        this.httpServletResponse = httpServletResponse;
        this.parameter = parameter;
    }

    /**
     * 获取Token数据
     * 
     * @param key 数据的key（key必须在登入中指定）
     * @return 消息对象
     */
    public final Message getTokenData(final String key) {
        try {
            final String accountToken = this.httpServletRequest.getParameter(Framework.ACCOUNT_TOKEN);
            final DecodedJWT dj = Jwt.getHmac256TokenClaim(Framework.AccountTokenSecret, accountToken);
            final String data = dj.getClaim(key).asString();
            if (null == data) {
                return new Message(Message.Status.ERROR, "ILLEGAL_TOKEN_PARAMETER", "非法令牌参数");
            }
            final JSONObject resultObj = new JSONObject();
            resultObj.put("data", data);
            return new Message(Message.Status.SUCCESS, resultObj, null);
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, "ANALYSIS_TOKEN_EXCEPTION", "解析令牌异常");
        }
    }

    /**
     * 生成Token
     * 
     * @param accountUuid 账户的uuid
     * @param accountPermissions 账户权限
     * @param keyArray key的数组（登入所填信息，格式：[{"name": "...", "value": "..."}]）
     * @return Token字符串
     */
    public final String generateToken(final String accountUuid, final String accountPermissions, final JSONArray keyArray) throws Exception {
        final Date issued = new Date(System.currentTimeMillis());
        final Calendar expires = Calendar.getInstance();
        expires.add(Calendar.SECOND, Account.TOKEN_EXPIRES_TIME_IN_SECOND);
        final HashMap<String, Object> hm = new HashMap<>();
        hm.put(Framework.ACCOUNT_TOKEN_UUID, accountUuid);
        hm.put(Framework.ACCOUNT_TOKEN_PERMISSION, accountPermissions);
        for (int i = 0; i < keyArray.length(); i++) {
            final JSONObject keyObj = keyArray.getJSONObject(i);
            final Iterator<String> iter = keyObj.keys();
            while (iter.hasNext()) {
                final String key = iter.next();
                hm.put(key, keyObj.getString(key));
            }
        }
        final String token = Jwt.createHmac256Token(Framework.AccountTokenSecret, Framework.AccountTokenIssuer, Framework.AccountTokenSubject, expires.getTime(), null, issued, hm);
        return token;
    }

    /**
     * 刷新Token
     * 
     * @param keyArray key的数组（登入所填信息，格式：[{"name": "..."}]）
     * @return 消息对象
     */
    public final Message refreshToken(final JSONArray keyArray) {
        try {
            final String accountToken = this.httpServletRequest.getParameter(Framework.ACCOUNT_TOKEN);
            String accountUuid = null; // 框架必填项
            String accountPermissions = null; // 框架必填项
            DecodedJWT dj = null;
            try {
                dj = Jwt.getHmac256TokenClaim(Framework.AccountTokenSecret, accountToken);
            } catch (final Exception e) {
                return new Message(Message.Status.ERROR, "ANALYSIS_TOKEN_EXCEPTION", "解析令牌异常");
            }
            accountUuid = dj.getClaim(Framework.ACCOUNT_TOKEN_UUID).asString();
            accountPermissions = dj.getClaim(Framework.ACCOUNT_TOKEN_PERMISSION).asString();
            if ((null == accountUuid) || (null == accountPermissions)) {
                return new Message(Message.Status.ERROR, "ILLEGAL_TOKEN_PARAMETER", "非法令牌参数");
            }
            for (int i = 0; i < keyArray.length(); i++) {
                final JSONObject keyObj = keyArray.getJSONObject(i);
                final String value = dj.getClaim(keyObj.getString("name")).asString();
                if (null != value) {
                    keyObj.put("value", value);
                }
            }
            final Date issued = new Date(System.currentTimeMillis());
            final Calendar cal = Calendar.getInstance();
            cal.add(Calendar.SECOND, Account.TOKEN_EXPIRES_TIME_IN_SECOND);
            final HashMap<String, Object> hm = new HashMap<>();
            hm.put(Framework.ACCOUNT_TOKEN_UUID, accountUuid);
            hm.put(Framework.ACCOUNT_TOKEN_PERMISSION, accountPermissions);
            for (int i = 0; i < keyArray.length(); i++) {
                final JSONObject keyObj = keyArray.getJSONObject(i);
                if (keyObj.has("value")) {
                    hm.put(keyObj.getString("name"), keyObj.getString("value"));
                }
            }
            String token = null;
            try {
                token = Jwt.createHmac256Token(Framework.AccountTokenSecret, Framework.AccountTokenIssuer, Framework.AccountTokenSubject, cal.getTime(), null, issued, hm);
            } catch (final Exception e) {
                return new Message(Message.Status.ERROR, "ENCRYPT_TOKEN_EXCEPTION", "加密令牌异常");
            }
            final JSONObject resultObj = new JSONObject();
            resultObj.put("token", token);
            resultObj.put("token_expires_timestamp", cal.getTimeInMillis());
            return new Message(Message.Status.SUCCESS, resultObj, null);
        } catch (final Exception e) {
            return new Message(Message.Status.EXCEPTION, StringKit.getExceptionStackTrace(e), null);
        }
    }
}