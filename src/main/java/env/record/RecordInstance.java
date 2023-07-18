package env.record;

import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import org.json.JSONObject;
import com.palestink.server.sdk.Framework;
import com.palestink.server.sdk.module.AbstractRecord;
import com.palestink.server.sdk.module.impl.Record;
import com.palestink.utils.string.StringKit;

public final class RecordInstance extends AbstractRecord {
    private static volatile RecordInstance INSTANCE = null;

    /**
     * 单例模式之私有构造函数
     */
    private RecordInstance() {
    }

    /**
     * 单例模式（线程安全）
     */
    public static final RecordInstance getInstance() {
        if (null == INSTANCE) {
            synchronized (RecordInstance.class) {
                if (null == INSTANCE) {
                    INSTANCE = new RecordInstance();
                }
            }
        }
        return INSTANCE;
    }

    @Override
    public void httpRequest(HttpServletRequest httpRequest) {
        if (null == httpRequest) {
            throw new IllegalArgumentException("HTTP_SERVLET_REQUEST_IS_EMPTY");
        }
        final String requestUuid = StringKit.getUuidStr(true);
        httpRequest.setAttribute("request_uuid", requestUuid);
        final JSONObject obj = Record.getHttpRequestInfo(httpRequest);
        obj.put("record_type", "http_request");
        Framework.Log.debug(String.format("[%s] [HttpRequest] %s", StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"), obj.toString()));
    }

    @Override
    public void httpResponse(HttpServletRequest httpRequest, String responseData) {
        if (null == httpRequest) {
            throw new IllegalArgumentException("HTTP_SERVLET_REQUEST_IS_EMPTY");
        }
        if (null == responseData) {
            throw new IllegalArgumentException("RESPONSE_DATA_IS_EMPTY");
        }
        final JSONObject obj = new JSONObject();
        final String requestUuid = (String) httpRequest.getAttribute("request_uuid");
        if (null != requestUuid) {
            obj.put("response_uuid", requestUuid);
            httpRequest.removeAttribute("request_uuid");
        } else {
            obj.put("response_uuid", "null");
        }
        obj.put("record_type", "http_response");
        obj.put("response_data", responseData);
        Framework.Log.debug(String.format("[%s] [HttpResponse] %s", StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"), obj.toString()));
    }

    @Override
    public void websocketRequest(Session session, String message) {
        if (null == session) {
            throw new IllegalArgumentException("SESSION_IS_EMPTY");
        }
        if (null == message) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        final JSONObject obj = new JSONObject();
        obj.put("session_id", session.getId());
        obj.put("record_type", "websocket_request");
        obj.put("message", message);
        Framework.Log.debug(String.format("[%s] [WebsocketRequest] %s", StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"), obj.toString()));
    }

    @Override
    public void websocketResponse(Session session, String message) {
        if (null == session) {
            throw new IllegalArgumentException("SESSION_IS_EMPTY");
        }
        if (null == message) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        final JSONObject obj = new JSONObject();
        obj.put("session_id", session.getId());
        obj.put("record_type", "websocket_response");
        obj.put("message", message);
        Framework.Log.debug(String.format("[%s] [WebsocketResponse] %s", StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"), obj.toString()));
    }
}