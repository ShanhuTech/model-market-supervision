package env.config.obj;

import java.util.HashMap;

public final class Tomcat {
    private String baseDir;
    private String projectName;
    private Integer port;
    private String webappMappingName;
    private String webappPath;
    private HashMap<Integer, String> webappErrorPage;
    private Integer maxConnections;
    private Integer connectionTimeout;
    private Integer minSpareThreads;
    private Integer maxThreads;
    private Integer acceptCount;
    private Boolean disableUploadTimeout;
    private Integer connectionUploadTimeout;
    private Integer keepAliveTimeout;
    private String compression;
    private Integer compressionMinSize;
    private String compressibleMimeType;
    private Integer maxHttpHeaderSize;
    private Integer maxSwallowSize;
    private Integer maxSavePostSize;

    public Tomcat() {
    }

    public Tomcat(String baseDir, String projectName, Integer port, String webappMappingName, String webappPath, HashMap<Integer, String> webappErrorPage, Integer maxConnections, Integer connectionTimeout,
        Integer minSpareThreads, Integer maxThreads, Integer acceptCount, Boolean disableUploadTimeout, Integer connectionUploadTimeout, Integer keepAliveTimeout, String compression, Integer compressionMinSize,
        String compressibleMimeType, Integer maxHttpHeaderSize, Integer maxSwallowSize, Integer maxSavePostSize) {
        this.baseDir = baseDir;
        this.projectName = projectName;
        this.port = port;
        this.webappMappingName = webappMappingName;
        this.webappPath = webappPath;
        this.webappErrorPage = webappErrorPage;
        this.maxConnections = maxConnections;
        this.connectionTimeout = connectionTimeout;
        this.minSpareThreads = minSpareThreads;
        this.maxThreads = maxThreads;
        this.acceptCount = acceptCount;
        this.disableUploadTimeout = disableUploadTimeout;
        this.connectionUploadTimeout = connectionUploadTimeout;
        this.keepAliveTimeout = keepAliveTimeout;
        this.compression = compression;
        this.compressionMinSize = compressionMinSize;
        this.compressibleMimeType = compressibleMimeType;
        this.maxHttpHeaderSize = maxHttpHeaderSize;
        this.maxSwallowSize = maxSwallowSize;
        this.maxSavePostSize = maxSavePostSize;
    }

    public String getBaseDir() {
        return baseDir;
    }

    public void setBaseDir(String baseDir) {
        this.baseDir = baseDir;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getWebappMappingName() {
        return webappMappingName;
    }

    public void setWebappMappingName(String webappMappingName) {
        this.webappMappingName = webappMappingName;
    }

    public String getWebappPath() {
        return webappPath;
    }

    public void setWebappPath(String webappPath) {
        this.webappPath = webappPath;
    }

    public HashMap<Integer, String> getWebappErrorPage() {
        return webappErrorPage;
    }

    public void setWebappErrorPage(HashMap<Integer, String> webappErrorPage) {
        this.webappErrorPage = webappErrorPage;
    }

    public Integer getMaxConnections() {
        return maxConnections;
    }

    public void setMaxConnections(Integer maxConnections) {
        this.maxConnections = maxConnections;
    }

    public Integer getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(Integer connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public Integer getMinSpareThreads() {
        return minSpareThreads;
    }

    public void setMinSpareThreads(Integer minSpareThreads) {
        this.minSpareThreads = minSpareThreads;
    }

    public Integer getMaxThreads() {
        return maxThreads;
    }

    public void setMaxThreads(Integer maxThreads) {
        this.maxThreads = maxThreads;
    }

    public Integer getAcceptCount() {
        return acceptCount;
    }

    public void setAcceptCount(Integer acceptCount) {
        this.acceptCount = acceptCount;
    }

    public Boolean getDisableUploadTimeout() {
        return disableUploadTimeout;
    }

    public void setDisableUploadTimeout(Boolean disableUploadTimeout) {
        this.disableUploadTimeout = disableUploadTimeout;
    }

    public Integer getConnectionUploadTimeout() {
        return connectionUploadTimeout;
    }

    public void setConnectionUploadTimeout(Integer connectionUploadTimeout) {
        this.connectionUploadTimeout = connectionUploadTimeout;
    }

    public Integer getKeepAliveTimeout() {
        return keepAliveTimeout;
    }

    public void setKeepAliveTimeout(Integer keepAliveTimeout) {
        this.keepAliveTimeout = keepAliveTimeout;
    }

    public String getCompression() {
        return compression;
    }

    public void setCompression(String compression) {
        this.compression = compression;
    }

    public Integer getCompressionMinSize() {
        return compressionMinSize;
    }

    public void setCompressionMinSize(Integer compressionMinSize) {
        this.compressionMinSize = compressionMinSize;
    }

    public String getCompressibleMimeType() {
        return compressibleMimeType;
    }

    public void setCompressibleMimeType(String compressibleMimeType) {
        this.compressibleMimeType = compressibleMimeType;
    }

    public Integer getMaxHttpHeaderSize() {
        return maxHttpHeaderSize;
    }

    public void setMaxHttpHeaderSize(Integer maxHttpHeaderSize) {
        this.maxHttpHeaderSize = maxHttpHeaderSize;
    }

    public Integer getMaxSwallowSize() {
        return maxSwallowSize;
    }

    public void setMaxSwallowSize(Integer maxSwallowSize) {
        this.maxSwallowSize = maxSwallowSize;
    }

    public Integer getMaxSavePostSize() {
        return maxSavePostSize;
    }

    public void setMaxSavePostSize(Integer maxSavePostSize) {
        this.maxSavePostSize = maxSavePostSize;
    }
}