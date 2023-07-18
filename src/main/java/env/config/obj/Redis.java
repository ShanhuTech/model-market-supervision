package env.config.obj;

public final class Redis {
    private String host;
    private Integer port;
    private Integer timeout;
    private String user;
    private String password;
    private Integer database;
    private Integer maxIdle;
    private Integer maxTotal;
    private Boolean testOnBorrow;
    private Boolean testWhileIdle;

    public Redis() {
    }

    public Redis(String host, Integer port, Integer timeout, String user, String password, Integer database, Integer maxIdle, Integer maxTotal, Boolean testOnBorrow, Boolean testWhileIdle) {
        this.host = host;
        this.port = port;
        this.timeout = timeout;
        this.user = user;
        this.password = password;
        this.database = database;
        this.maxIdle = maxIdle;
        this.maxTotal = maxTotal;
        this.testOnBorrow = testOnBorrow;
        this.testWhileIdle = testWhileIdle;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getDatabase() {
        return database;
    }

    public void setDatabase(Integer database) {
        this.database = database;
    }

    public Integer getMaxIdle() {
        return maxIdle;
    }

    public void setMaxIdle(Integer maxIdle) {
        this.maxIdle = maxIdle;
    }

    public Integer getMaxTotal() {
        return maxTotal;
    }

    public void setMaxTotal(Integer maxTotal) {
        this.maxTotal = maxTotal;
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
}