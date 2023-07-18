package security;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.Session;
import com.palestink.server.sdk.Framework;
import com.palestink.server.sdk.module.AbstractWebsocket;
import com.palestink.server.sdk.module.annotation.Frequency;
import com.palestink.server.sdk.module.annotation.Method;
import com.palestink.server.sdk.module.annotation.Parameter;
import com.palestink.server.sdk.module.annotation.Returns;
import com.palestink.server.sdk.msg.Message;
import com.palestink.utils.string.StringKit;

public class WsTest extends AbstractWebsocket {
    // 会话map
    public static final ConcurrentHashMap<String, Session> SESSION_MAP = new ConcurrentHashMap<>();
    static {
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (;;) {
                    try {
                        final Iterator<Entry<String, Session>> iter = WsTest.SESSION_MAP.entrySet().iterator();
                        while (iter.hasNext()) {
                            final Entry<String, Session> e = iter.next();
                            final Session session = e.getValue();
                            if (session.isOpen()) {
                                session.getAsyncRemote().sendText("Sailing: " + StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss"));
                            } else {
                                Framework.Log.info(String.format("%s 已离线", session.getId()));
                                WsTest.SESSION_MAP.remove(session.getId());
                            }
                        }
                        Thread.sleep(1000 * 3);
                    } catch (final InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }
    private HashMap<String, Object> parameter;

    public WsTest() {
    }

    public WsTest(final Session session, final HashMap<String, Object> parameter) {
        super(session, parameter);
        this.parameter = parameter;
    }

    @Override
    @Method(description = "连接", anonymousAccess = false, frequencys = {
        @Frequency(source = Frequency.Source.ACCOUNT, count = 100, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.WEBSOCKET, parameters = {
            @Parameter(name = "name", text = "名称", type = Parameter.Type.STRING, allowNull = false, format = "^[0-9a-zA-Z_-]{4,16}$", formatPrompt = "1-16位的任意字符", remark = "") }, returns = @Returns())
    public final Message connect() {
        final Session session = (Session) this.getParameter(this.parameter, Framework.WEBSOCKET_CLIENT_SESSION);
        session.setMaxIdleTimeout(0);
        final String name = (String) this.getParameter(this.parameter, "name");
        if (name.equalsIgnoreCase("weishan")) {
            SESSION_MAP.put(session.getId(), session);
            return new Message(Message.Status.SUCCESS, "聪明人", null);
        }
        return new Message(Message.Status.SUCCESS, "傻子", null);
    }

    @Method(description = "刷新管理员令牌", anonymousAccess = true, frequencys = {
        @Frequency(source = Frequency.Source.IP, count = 100, unit = Frequency.Unit.SECOND) }, methodType = Method.Type.WEBSOCKET, parameters = {}, returns = @Returns())
    public final Message get() {
        return new Message(Message.Status.SUCCESS, "content_str", "attach_str");
    }
}