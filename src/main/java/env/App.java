package env;

import java.util.Map;
import com.palestink.server.sdk.Framework;
import com.palestink.server.sdk.cache.CacheInstance;
import com.palestink.server.sdk.config.HttpConfig;
import com.palestink.server.sdk.config.RedisConfig;
import com.palestink.server.sdk.config.TomcatConfig;
import env.config.Resource;
import env.db.DruidInstance;
import env.log.LogInstance;
import env.record.RecordInstance;

public class App extends Thread {
    public App() {
        Runtime.getRuntime().addShutdownHook(this);
    }

    /**
     * 运行服务
     */
    public final void runServer() throws Exception {
        // Framework初始化
        {
            // 开启debug模式
            Framework.DebugMode = true;
            // Token签发主体
            Framework.AccountTokenSubject = "SHAN_HU";
            // Token签发者
            Framework.AccountTokenIssuer = "ShanHuChong";
            // Token密钥
            Framework.AccountTokenSecret = "SHAN_HU_DU_CHA";
            // 初始化日志
            Framework.Log = LogInstance.getInstance(Resource.getLog().getPath());
            // 初始化记录
            Framework.record = RecordInstance.getInstance();
        }
        // Http配置初始化
        {
            // 允许header
            HttpConfig.HttpHeaderMap.put("Access-Control-Allow-Headers", "Content-Type");
            // 允许来源
            HttpConfig.HttpHeaderMap.put("Access-Control-Allow-Origin", "*");
        }
        // Redis配置初始化
        {
            RedisConfig.Host = Resource.getRedis().getHost();
            RedisConfig.Port = Resource.getRedis().getPort().intValue();
            RedisConfig.Timeout = Resource.getRedis().getTimeout().intValue();
            RedisConfig.User = Resource.getRedis().getUser();
            RedisConfig.Password = Resource.getRedis().getPassword();
            RedisConfig.Database = Resource.getRedis().getDatabase().intValue();
            RedisConfig.MaxIdle = Resource.getRedis().getMaxIdle().intValue();
            RedisConfig.MaxTotal = Resource.getRedis().getMaxTotal().intValue();
            RedisConfig.TestOnBorrow = Resource.getRedis().getTestOnBorrow().booleanValue();
            RedisConfig.TestWhileIdle = Resource.getRedis().getTestWhileIdle().booleanValue();
        }
        // Tomcat配置初始化
        {
            TomcatConfig.BaseDir = Resource.getTomcat().getBaseDir();
            TomcatConfig.ProjectName = Resource.getTomcat().getProjectName();
            TomcatConfig.Port = Resource.getTomcat().getPort().intValue();
            TomcatConfig.WebappMappingName = Resource.getTomcat().getWebappMappingName();
            TomcatConfig.WebappPath = Resource.getTomcat().getWebappPath();
            for (final Map.Entry<Integer, String> entry : Resource.getTomcat().getWebappErrorPage().entrySet()) {
                final Integer code = entry.getKey();
                final String location = entry.getValue();
                TomcatConfig.WebappErrorPage.put(code, location);
            }
            TomcatConfig.MaxConnections = Resource.getTomcat().getMaxConnections().intValue();
            TomcatConfig.ConnectionTimeout = Resource.getTomcat().getConnectionTimeout().intValue();
            TomcatConfig.MinSpareThreads = Resource.getTomcat().getMinSpareThreads().intValue();
            TomcatConfig.MaxThreads = Resource.getTomcat().getMaxThreads().intValue();
            TomcatConfig.AcceptCount = Resource.getTomcat().getAcceptCount().intValue();
            TomcatConfig.DisableUploadTimeout = Resource.getTomcat().getDisableUploadTimeout().booleanValue();
            TomcatConfig.ConnectionUploadTimeout = Resource.getTomcat().getConnectionUploadTimeout().intValue();
            TomcatConfig.KeepAliveTimeout = Resource.getTomcat().getKeepAliveTimeout().intValue();
            TomcatConfig.Compression = Resource.getTomcat().getCompression();
            TomcatConfig.CompressionMinSize = Resource.getTomcat().getCompressionMinSize().intValue();
            TomcatConfig.CompressibleMimeType = Resource.getTomcat().getCompressibleMimeType();
            TomcatConfig.MaxHttpHeaderSize = Resource.getTomcat().getMaxHttpHeaderSize().intValue();
            TomcatConfig.MaxSwallowSize = Resource.getTomcat().getMaxSwallowSize().intValue();
        }
        // 数据库初始化
        {
            DruidInstance.getInstance();
        }
        // 缓存初始化
        {
            CacheInstance.getInstance();
        }
        // 启动tomcat
        {
            final org.apache.catalina.startup.Tomcat tomcat = com.palestink.server.sdk.server.Server.getTomcat();
            tomcat.getServer().await();
        }
    }

    @Override
    public void run() {
        try {
            // 释放资源
            DruidInstance.getInstance().release();
            Framework.releaseResource();
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }

    public static final void main(final String[] args) {
        try {
            final App app = new App();
            app.runServer();
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }
}