package env.config;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import com.palestink.utils.io.IoKit;
import com.palestink.utils.string.StringKit;
import env.config.obj.Database;
import env.config.obj.Log;
import env.config.obj.Redis;
import env.config.obj.Tomcat;

public final class Resource {
    // 日志配置文件路径
    private static final String LOG_CONFIG_FILE_PATH = IoKit.regulatePath(System.getProperty("user.dir")) + "/res/config/log.xml";
    // 数据库配置文件路径
    private static final String DATABASE_CONFIG_FILE_PATH = IoKit.regulatePath(System.getProperty("user.dir")) + "/res/config/database.xml";
    // redis配置文件路径
    private static final String REDIS_CONFIG_FILE_PATH = IoKit.regulatePath(System.getProperty("user.dir")) + "/res/config/redis.xml";
    // tomcat配置文件路径
    private static final String TOMCAT_CONFIG_FILE_PATH = IoKit.regulatePath(System.getProperty("user.dir")) + "/res/config/tomcat.xml";
    // 日志对象私有实例
    private static volatile Log LogInstance = null;
    // 数据库对象私有实例
    private static volatile Database DatabaseInstance = null;
    // redis对象私有实例
    private static volatile Redis RedisInstance = null;
    // tomcat对象私有实例
    private static volatile Tomcat TomcatInstance = null;

    /**
     * 获取日志对象
     * 
     * @return 成功返回日志对象，失败终止程序。
     */
    public static Log getLog() {
        if (null == LogInstance) {
            synchronized (Resource.class) {
                if (null == LogInstance) {
                    try {
                        final File file = new File(LOG_CONFIG_FILE_PATH);
                        final SAXReader reader = new SAXReader();
                        final Document doc = reader.read(file);
                        final Element root = doc.getRootElement();
                        String path = root.elementTextTrim("path");
                        String userDir = IoKit.regulatePath(System.getProperty("user.dir"));
                        if (userDir.endsWith("/")) {
                            userDir = userDir.substring(0, userDir.length() - 1);
                        }
                        if (-1 != path.toUpperCase().indexOf("${PROJECT_HOME}")) {
                            path = StringKit.replaceAll(path, "${PROJECT_HOME}", userDir);
                        }
                        final File logDir = new File(path);
                        if (!logDir.exists()) {
                            if (!logDir.mkdirs()) {
                                throw new RuntimeException("Create Log Directory Error");
                            }
                        }
                        LogInstance = new Log(IoKit.regulatePath(path));
                    } catch (final Exception e) {
                        throw new RuntimeException(StringKit.getExceptionStackTrace(e));
                    }
                }
            }
        }
        return LogInstance;
    }

    /**
     * 获取数据库对象
     * 
     * @return 成功返回数据库对象，失败终止程序。
     */
    public static Database getDatabase() {
        if (null == DatabaseInstance) {
            synchronized (Resource.class) {
                if (null == DatabaseInstance) {
                    try {
                        final File file = new File(DATABASE_CONFIG_FILE_PATH);
                        final SAXReader reader = new SAXReader();
                        final Document doc = reader.read(file);
                        final Element root = doc.getRootElement();
                        final String type = root.elementTextTrim("type");
                        final String driver = root.elementTextTrim("driver");
                        final String ip = root.elementTextTrim("ip");
                        final String port = root.elementTextTrim("port");
                        final String databaseName = root.elementTextTrim("database_name");
                        final String userName = root.elementTextTrim("user_name");
                        final String userPassword = root.elementTextTrim("user_password");
                        final String characterEncoding = root.elementTextTrim("character_encoding");
                        final String useSsl = root.elementTextTrim("use_ssl");
                        final String allowPublicKeyRetrieval = root.elementTextTrim("allow_public_key_retrieval");
                        final String serverTimezone = root.elementTextTrim("server_timezone");
                        final String initialSize = root.elementTextTrim("initial_size");
                        final String minIdle = root.elementTextTrim("min_idle");
                        final String maxActive = root.elementTextTrim("max_active");
                        final String testOnBorrow = root.elementTextTrim("test_on_borrow");
                        final String testWhileIdle = root.elementTextTrim("test_while_idle");
                        final String timeBetweenEvictionRunsMillis = root.elementTextTrim("time_between_eviction_runs_millis");
                        final String minEvictableIdleTimeMillis = root.elementTextTrim("min_evictable_idle_time_millis");
                        final String maxEvictableIdleTimeMillis = root.elementTextTrim("max_evictable_idle_time_millis");
                        final String phyTimeoutMillis = root.elementTextTrim("phy_timeout_millis");
                        final String validationQuery = root.elementTextTrim("validation_query");
                        final String poolPreparedStatements = root.elementTextTrim("pool_prepared_statements");
                        final String maxOpenPreparedStatements = root.elementTextTrim("max_open_prepared_statements");
                        final String useGlobalDatasourceStat = root.elementTextTrim("use_global_datasource_stat");
                        final String keepAlive = root.elementTextTrim("keep_alive");
                        DatabaseInstance = new Database(type, driver, ip, Integer.valueOf(port), databaseName, userName, userPassword, characterEncoding, Boolean.valueOf(useSsl),
                            Boolean.valueOf(allowPublicKeyRetrieval), serverTimezone, Integer.valueOf(initialSize), Integer.valueOf(minIdle), Integer.valueOf(maxActive), Boolean.valueOf(testOnBorrow),
                            Boolean.valueOf(testWhileIdle), Long.valueOf(timeBetweenEvictionRunsMillis), Long.valueOf(minEvictableIdleTimeMillis), Long.valueOf(maxEvictableIdleTimeMillis),
                            Long.valueOf(phyTimeoutMillis), validationQuery, Boolean.valueOf(poolPreparedStatements), Integer.valueOf(maxOpenPreparedStatements), Boolean.valueOf(useGlobalDatasourceStat),
                            Boolean.valueOf(keepAlive));
                    } catch (final Exception e) {
                        throw new RuntimeException(StringKit.getExceptionStackTrace(e));
                    }
                }
            }
        }
        return DatabaseInstance;
    }

    /**
     * 获取redis对象
     *
     * @return 成功返回redis对象，失败终止程序。
     */
    public static Redis getRedis() {
        if (null == RedisInstance) {
            synchronized (Resource.class) {
                if (null == RedisInstance) {
                    try {
                        final File file = new File(REDIS_CONFIG_FILE_PATH);
                        final SAXReader reader = new SAXReader();
                        final Document doc = reader.read(file);
                        final Element root = doc.getRootElement();
                        final String host = root.elementTextTrim("host");
                        final String port = root.elementTextTrim("port");
                        final String timeout = root.elementTextTrim("timeout");
                        final String user = root.elementTextTrim("user");
                        final String password = root.elementTextTrim("password");
                        final String database = root.elementTextTrim("database");
                        final String maxIdle = root.elementTextTrim("max_idle");
                        final String maxTotal = root.elementTextTrim("max_total");
                        final String testOnBorrow = root.elementTextTrim("test_on_borrow");
                        final String testWhileIdle = root.elementTextTrim("test_while_idle");
                        RedisInstance = new Redis(host, Integer.valueOf(port), Integer.valueOf(timeout), user, password, Integer.valueOf(database), Integer.valueOf(maxIdle), Integer.valueOf(maxTotal),
                            Boolean.valueOf(testOnBorrow), Boolean.valueOf(testWhileIdle));
                    } catch (final Exception e) {
                        throw new RuntimeException(StringKit.getExceptionStackTrace(e));
                    }
                }
            }
        }
        return RedisInstance;
    }

    /**
     * 获取tomcat对象
     *
     * @return 成功返回tomcat对象，失败终止程序。
     */
    public static Tomcat getTomcat() {
        if (null == TomcatInstance) {
            synchronized (Resource.class) {
                if (null == TomcatInstance) {
                    try {
                        final File file = new File(TOMCAT_CONFIG_FILE_PATH);
                        final SAXReader reader = new SAXReader();
                        final Document doc = reader.read(file);
                        final Element root = doc.getRootElement();
                        final String baseDir = root.elementTextTrim("base_dir");
                        final String projectName = root.elementTextTrim("project_name");
                        final String port = root.elementTextTrim("port");
                        final String webappMappingName = root.elementTextTrim("webapp_mapping_name");
                        final Element webappErrorPage = root.element("webapp_error_page");
                        String webappPath = IoKit.regulatePath(root.elementTextTrim("webapp_path"));
                        final HashMap<Integer, String> webappErrorPageMap = new HashMap<>();
                        {
                            final List<Element> errorPageList = webappErrorPage.elements("error_page");
                            for (int i = 0; i < errorPageList.size(); i++) {
                                final Element errorPage = errorPageList.get(i);
                                final Integer code = Integer.valueOf(errorPage.elementTextTrim("code"));
                                final String location = errorPage.elementTextTrim("location");
                                webappErrorPageMap.put(code, location);
                            }
                        }
                        String userDir = IoKit.regulatePath(System.getProperty("user.dir"));
                        if (userDir.endsWith("/")) {
                            userDir = userDir.substring(0, userDir.length() - 1);
                        }
                        if (-1 != webappPath.toUpperCase().indexOf("${PROJECT_HOME}")) {
                            webappPath = StringKit.replaceAll(webappPath, "${PROJECT_HOME}", userDir);
                        }
                        final String maxConnections = root.elementTextTrim("max_connections");
                        final String connectionTimeout = root.elementTextTrim("connection_timeout");
                        final String minSpareThreads = root.elementTextTrim("min_spare_threads");
                        final String maxThreads = root.elementTextTrim("max_threads");
                        final String acceptCount = root.elementTextTrim("accept_count");
                        final String disableUploadTimeout = root.elementTextTrim("disable_upload_timeout");
                        final String connectionUploadTimeout = root.elementTextTrim("connection_upload_timeout");
                        final String keepAliveTimeout = root.elementTextTrim("keep_alive_timeout");
                        final String compression = root.elementTextTrim("compression");
                        final String compressionMinSize = root.elementTextTrim("compression_min_size");
                        final String compressibleMimeType = root.elementTextTrim("compressible_mime_type");
                        final String maxHttpHeaderSize = root.elementTextTrim("max_http_header_size");
                        final String maxSwallowSize = root.elementTextTrim("max_swallow_size");
                        final String maxSavePostSize = root.elementTextTrim("max_save_post_size");
                        TomcatInstance = new Tomcat(baseDir, projectName, Integer.valueOf(port), webappMappingName, webappPath, webappErrorPageMap, Integer.valueOf(maxConnections),
                            Integer.valueOf(connectionTimeout), Integer.valueOf(minSpareThreads), Integer.valueOf(maxThreads), Integer.valueOf(acceptCount), Boolean.valueOf(disableUploadTimeout),
                            Integer.valueOf(connectionUploadTimeout), Integer.valueOf(keepAliveTimeout), compression, Integer.valueOf(compressionMinSize), compressibleMimeType,
                            Integer.valueOf(maxHttpHeaderSize), Integer.valueOf(maxSwallowSize), Integer.valueOf(maxSavePostSize));
                    } catch (final Exception e) {
                        throw new RuntimeException(StringKit.getExceptionStackTrace(e));
                    }
                }
            }
        }
        return TomcatInstance;
    }
}