package env.db;

import java.sql.Connection;
import com.alibaba.druid.pool.DruidDataSource;
import com.palestink.utils.string.StringKit;
import env.config.Resource;

public final class DruidInstance {
    private volatile static DruidInstance INSTANCE = null;
    private DruidDataSource dataSource;

    /**
     * 单例模式
     */
    private DruidInstance() {
        try {
            // 初始化测试数据库连接信息
            final String Driver = Resource.getDatabase().getDriver();
            final String Url = String.format("jdbc:%s://%s:%d/%s?characterEncoding=%s&useSSL=%b&allowPublicKeyRetrieval=%b&serverTimezone=%s", Resource.getDatabase().getType(), Resource.getDatabase().getIp(),
                Resource.getDatabase().getPort(), Resource.getDatabase().getDatabaseName(), Resource.getDatabase().getCharacterEncoding(), Resource.getDatabase().getUseSsl(),
                Resource.getDatabase().getAllowPublicKeyRetrieval(), Resource.getDatabase().getServerTimezone());
            // 寻找类
            Class.forName(Driver);
            // 设置Druid的日志类型，默认是用log4j2，但这种方式会与日志Log4j2模块冲突，会导致无法输出日志，所以这里选择slf4j的方式。
            System.setProperty("druid.logType", "slf4j");
            // 初始化数据库连接池
            this.dataSource = new DruidDataSource();
            // 设置连接池的基本属性
            this.dataSource.setDriverClassName(Driver);
            this.dataSource.setUrl(Url);
            this.dataSource.setUsername(Resource.getDatabase().getUserName());
            this.dataSource.setPassword(Resource.getDatabase().getUserPassword());
            this.dataSource.setInitialSize(Resource.getDatabase().getInitialSize().intValue());
            this.dataSource.setMinIdle(Resource.getDatabase().getMinIdle().intValue());
            this.dataSource.setMaxActive(Resource.getDatabase().getMaxActive().intValue());
            this.dataSource.setTestOnBorrow(Resource.getDatabase().getTestOnBorrow().booleanValue());
            this.dataSource.setTestWhileIdle(Resource.getDatabase().getTestWhileIdle().booleanValue());
            this.dataSource.setTimeBetweenEvictionRunsMillis(Resource.getDatabase().getTimeBetweenEvictionRunsMillis().longValue());
            this.dataSource.setMinEvictableIdleTimeMillis(Resource.getDatabase().getMinEvictableIdleTimeMillis().longValue());
            this.dataSource.setMaxEvictableIdleTimeMillis(Resource.getDatabase().getMaxEvictableIdleTimeMillis().longValue());
            this.dataSource.setPhyTimeoutMillis(Resource.getDatabase().getPhyTimeoutMillis().longValue());
            this.dataSource.setValidationQuery(Resource.getDatabase().getValidationQuery());
            this.dataSource.setPoolPreparedStatements(Resource.getDatabase().getPoolPreparedStatements().booleanValue());
            this.dataSource.setMaxOpenPreparedStatements(Resource.getDatabase().getMaxOpenPreparedStatements().intValue());
            this.dataSource.setUseGlobalDataSourceStat(Resource.getDatabase().getUseGlobalDatasourceStat().booleanValue());
            this.dataSource.setKeepAlive(Resource.getDatabase().getKeepAlive().booleanValue());
        } catch (final Exception e) {
            throw new RuntimeException(StringKit.getExceptionStackTrace(e));
        }
    }

    /**
     * 单例模式（线程安全）
     * 
     * @return 单例对象
     */
    public static final DruidInstance getInstance() {
        if (null == INSTANCE) {
            synchronized (DruidInstance.class) {
                if (null == INSTANCE) {
                    INSTANCE = new DruidInstance();
                }
            }
        }
        return INSTANCE;
    }

    /**
     * 释放资源
     */
    public final void release() throws Exception {
        this.dataSource.close();
    }

    /**
     * 获取事务连接
     * 
     * @return 事务连接
     */
    public final Connection getTransConnection() throws Exception {
        final Connection connection = this.dataSource.getConnection();
        connection.setAutoCommit(false);
        return connection;
    }
}