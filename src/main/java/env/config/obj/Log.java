package env.config.obj;

public final class Log {
    private String path;

    public Log() {
    }

    public Log(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}