package env.config.obj;

public final class Database {
    private String type;
    private String driver;
    private String ip;
    private Integer port;
    private String databaseName;
    private String userName;
    private String userPassword;
    private String characterEncoding;
    private Boolean useSsl;
    private Boolean allowPublicKeyRetrieval;
    private String serverTimezone;
    private Integer initialSize;
    private Integer minIdle;
    private Integer maxActive;
    private Boolean testOnBorrow;
    private Boolean testWhileIdle;
    private Long timeBetweenEvictionRunsMillis;
    private Long minEvictableIdleTimeMillis;
    private Long maxEvictableIdleTimeMillis;
    private Long phyTimeoutMillis;
    private String validationQuery;
    private Boolean poolPreparedStatements;
    private Integer maxOpenPreparedStatements;
    private Boolean useGlobalDatasourceStat;
    private Boolean keepAlive;

    public Database() {
    }

    public Database(String type, String driver, String ip, Integer port, String databaseName, String userName, String userPassword, String characterEncoding, Boolean useSsl, Boolean allowPublicKeyRetrieval,
        String serverTimezone, Integer initialSize, Integer minIdle, Integer maxActive, Boolean testOnBorrow, Boolean testWhileIdle, Long timeBetweenEvictionRunsMillis, Long minEvictableIdleTimeMillis,
        Long maxEvictableIdleTimeMillis, Long phyTimeoutMillis, String validationQuery, Boolean poolPreparedStatements, Integer maxOpenPreparedStatements, Boolean useGlobalDatasourceStat, Boolean keepAlive) {
        this.type = type;
        this.driver = driver;
        this.ip = ip;
        this.port = port;
        this.databaseName = databaseName;
        this.userName = userName;
        this.userPassword = userPassword;
        this.characterEncoding = characterEncoding;
        this.useSsl = useSsl;
        this.allowPublicKeyRetrieval = allowPublicKeyRetrieval;
        this.serverTimezone = serverTimezone;
        this.initialSize = initialSize;
        this.minIdle = minIdle;
        this.maxActive = maxActive;
        this.testOnBorrow = testOnBorrow;
        this.testWhileIdle = testWhileIdle;
        this.timeBetweenEvictionRunsMillis = timeBetweenEvictionRunsMillis;
        this.minEvictableIdleTimeMillis = minEvictableIdleTimeMillis;
        this.maxEvictableIdleTimeMillis = maxEvictableIdleTimeMillis;
        this.phyTimeoutMillis = phyTimeoutMillis;
        this.validationQuery = validationQuery;
        this.poolPreparedStatements = poolPreparedStatements;
        this.maxOpenPreparedStatements = maxOpenPreparedStatements;
        this.useGlobalDatasourceStat = useGlobalDatasourceStat;
        this.keepAlive = keepAlive;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getCharacterEncoding() {
        return characterEncoding;
    }

    public void setCharacterEncoding(String characterEncoding) {
        this.characterEncoding = characterEncoding;
    }

    public Boolean getUseSsl() {
        return useSsl;
    }

    public void setUseSsl(Boolean useSsl) {
        this.useSsl = useSsl;
    }

    public Boolean getAllowPublicKeyRetrieval() {
        return allowPublicKeyRetrieval;
    }

    public void setAllowPublicKeyRetrieval(Boolean allowPublicKeyRetrieval) {
        this.allowPublicKeyRetrieval = allowPublicKeyRetrieval;
    }

    public String getServerTimezone() {
        return serverTimezone;
    }

    public void setServerTimezone(String serverTimezone) {
        this.serverTimezone = serverTimezone;
    }

    public Integer getInitialSize() {
        return initialSize;
    }

    public void setInitialSize(Integer initialSize) {
        this.initialSize = initialSize;
    }

    public Integer getMinIdle() {
        return minIdle;
    }

    public void setMinIdle(Integer minIdle) {
        this.minIdle = minIdle;
    }

    public Integer getMaxActive() {
        return maxActive;
    }

    public void setMaxActive(Integer maxActive) {
        this.maxActive = maxActive;
    }

    public Boolean getTestOnBorrow() {
        return testOnBorrow;
    }

    public void setTestOnBorrow(Boolean testOnBorrow) {
        this.testOnBorrow = testOnBorrow;
    }

    public Boolean getTestWhileIdle() {
        return testWhileIdle;
    }

    public void setTestWhileIdle(Boolean testWhileIdle) {
        this.testWhileIdle = testWhileIdle;
    }

    public Long getTimeBetweenEvictionRunsMillis() {
        return timeBetweenEvictionRunsMillis;
    }

    public void setTimeBetweenEvictionRunsMillis(Long timeBetweenEvictionRunsMillis) {
        this.timeBetweenEvictionRunsMillis = timeBetweenEvictionRunsMillis;
    }

    public Long getMinEvictableIdleTimeMillis() {
        return minEvictableIdleTimeMillis;
    }

    public void setMinEvictableIdleTimeMillis(Long minEvictableIdleTimeMillis) {
        this.minEvictableIdleTimeMillis = minEvictableIdleTimeMillis;
    }

    public Long getMaxEvictableIdleTimeMillis() {
        return maxEvictableIdleTimeMillis;
    }

    public void setMaxEvictableIdleTimeMillis(Long maxEvictableIdleTimeMillis) {
        this.maxEvictableIdleTimeMillis = maxEvictableIdleTimeMillis;
    }

    public Long getPhyTimeoutMillis() {
        return phyTimeoutMillis;
    }

    public void setPhyTimeoutMillis(Long phyTimeoutMillis) {
        this.phyTimeoutMillis = phyTimeoutMillis;
    }

    public String getValidationQuery() {
        return validationQuery;
    }

    public void setValidationQuery(String validationQuery) {
        this.validationQuery = validationQuery;
    }

    public Boolean getPoolPreparedStatements() {
        return poolPreparedStatements;
    }

    public void setPoolPreparedStatements(Boolean poolPreparedStatements) {
        this.poolPreparedStatements = poolPreparedStatements;
    }

    public Integer getMaxOpenPreparedStatements() {
        return maxOpenPreparedStatements;
    }

    public void setMaxOpenPreparedStatements(Integer maxOpenPreparedStatements) {
        this.maxOpenPreparedStatements = maxOpenPreparedStatements;
    }

    public Boolean getUseGlobalDatasourceStat() {
        return useGlobalDatasourceStat;
    }

    public void setUseGlobalDatasourceStat(Boolean useGlobalDatasourceStat) {
        this.useGlobalDatasourceStat = useGlobalDatasourceStat;
    }

    public Boolean getKeepAlive() {
        return keepAlive;
    }

    public void setKeepAlive(Boolean keepAlive) {
        this.keepAlive = keepAlive;
    }
}