package env.log;

import java.nio.charset.StandardCharsets;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.appender.ConsoleAppender;
import org.apache.logging.log4j.core.config.Configurator;
import org.apache.logging.log4j.core.config.builder.api.AppenderComponentBuilder;
import org.apache.logging.log4j.core.config.builder.api.ConfigurationBuilder;
import org.apache.logging.log4j.core.config.builder.api.ConfigurationBuilderFactory;
import org.apache.logging.log4j.core.config.builder.api.RootLoggerComponentBuilder;
import org.apache.logging.log4j.core.config.builder.impl.BuiltConfiguration;
import com.palestink.server.sdk.module.AbstractLog;
import com.palestink.utils.string.StringKit;
import com.palestink.utils.system.SystemKit;

public final class LogInstance extends AbstractLog {
    private volatile static LogInstance INSTANCE = null;
    private boolean isUseLogFile;
    private LoggerContext loggerContext;
    private Logger logger;

    /**
     * 单例模式
     * 
     * @param logOutputDirPath 日志输出路径
     */
    private LogInstance(final String logOutputDirPath) {
        try {
            if (null != logOutputDirPath) {
                this.isUseLogFile = true;
                final ConfigurationBuilder<BuiltConfiguration> builder = ConfigurationBuilderFactory.newConfigurationBuilder();
                // 日志文件输出
                final AppenderComponentBuilder rollingFileACB = builder.newAppender("logfile", "RollingFile").addAttribute("fileName", logOutputDirPath + "record.log").addAttribute("filePattern",
                    logOutputDirPath + "%d{yyyy_MM_dd_HH_mm_ss}.log.gz");
                rollingFileACB.add(builder.newLayout("PatternLayout").addAttribute("Charset", StandardCharsets.UTF_8.toString()).addAttribute("Pattern", "%m%n"/* 由于封装了日志类, 所以日志格式在编码中定义 */));
                rollingFileACB.addComponent(builder.newComponent("SizeBasedTriggeringPolicy").addAttribute("size", "100MB"/* 日志文件达到100MB时, 自动生成新文件进行记录 */));
                builder.add(rollingFileACB);
                // 控制台输出
                final AppenderComponentBuilder consoleACB = builder.newAppender("stdout", "Console").addAttribute("target", ConsoleAppender.Target.SYSTEM_OUT);
                if (SystemKit.isWindows()) {
                    consoleACB.add(builder.newLayout("PatternLayout").addAttribute("Charset", "gbk").addAttribute("Pattern", "%m%n"/* 由于封装了日志类, 所以日志格式在编码中定义 */));
                } else {
                    consoleACB.add(builder.newLayout("PatternLayout").addAttribute("Charset", StandardCharsets.UTF_8.toString()).addAttribute("Pattern", "%m%n"/* 由于封装了日志类, 所以日志格式在编码中定义 */));
                }
                builder.add(consoleACB);
                // 关联RootLogger
                final RootLoggerComponentBuilder rlcb = builder.newRootLogger(Level.DEBUG/* 如果level设置为debug级别, 输出级别分别是: debug, info, warn, error, fatal */).add(builder.newAppenderRef("logfile"/* 定义输出到文件 */))
                    .add(builder.newAppenderRef("stdout"/*
                                                         * 定义输出到控制台
                                                         */));
                builder.add(rlcb);
                Configurator.initialize(builder.build());
                this.logger = LogManager.getLogger(LogManager.ROOT_LOGGER_NAME);
            } else {
                this.isUseLogFile = false;
            }
        } catch (final Exception e) {
            System.err.println(StringKit.getExceptionStackTrace(e));
        }
    }

    /**
     * 单例模式（线程安全）
     * 
     * @param logOutputDirPath 日志输出路径
     * @return 单例对象
     */
    public static final LogInstance getInstance(final String logOutputDirPath) {
        if (null == INSTANCE) {
            synchronized (LogInstance.class) {
                if (null == INSTANCE) {
                    INSTANCE = new LogInstance(logOutputDirPath);
                }
            }
        }
        return INSTANCE;
    }

    /**
     * 格式化日志消息 格式为: [时间][日志级别][线程ID]: 执行方法(执行文件:所在行号) 日志内容
     * 
     * @param level 级别
     * @param msg 消息
     * @return 格式化后的日志消息
     */
    public String formatLogMessage(final String level, final String msg) {
        if (null == level) {
            throw new IllegalArgumentException("LEVEL_IS_EMPTY");
        }
        if (null == msg) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        final String fmt = "[%s][%s]: %s (%s:%s) %s";
        final StackTraceElement[] stes = new Throwable().getStackTrace();
        final StackTraceElement ste = stes[2];
        return String.format(fmt, StringKit.getCurrentFormatDateTime("yyyy-MM-dd HH:mm:ss:SSS"), level, ste.getMethodName(), ste.getFileName(), Integer.valueOf(ste.getLineNumber()), msg);
    }

    @Override
    public final boolean init() {
        return true;
    }

    @Override
    public final void release() {
        Configurator.shutdown(this.loggerContext);
    }

    @Override
    public final void debug(final String msg) {
        if (null == msg) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        // this.logger.debug(this.formatLogMessage("debug", msg));
        // debug信息用于输出http请求和发送的数据，数据格式已经做好编码，这里只需要按照原有数据格式输出即可。
        if (this.isUseLogFile) {
            this.logger.debug(msg);
        } else {
            System.out.println(msg);
        }
    }

    @Override
    public final void info(final String msg) {
        if (null == msg) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        if (this.isUseLogFile) {
            this.logger.info(this.formatLogMessage("info", msg));
        } else {
            System.out.println(this.formatLogMessage("info", msg));
        }
    }

    @Override
    public final void warn(final String msg) {
        if (null == msg) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        if (this.isUseLogFile) {
            this.logger.warn(this.formatLogMessage("warn", msg));
        } else {
            System.err.println(this.formatLogMessage("error", msg));
        }
    }

    @Override
    public final void error(final String msg) {
        if (null == msg) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        if (this.isUseLogFile) {
            this.logger.error(this.formatLogMessage("error", msg));
        } else {
            System.err.println(this.formatLogMessage("error", msg));
        }
    }

    @Override
    public final void fatal(final String msg) {
        if (null == msg) {
            throw new IllegalArgumentException("MESSAGE_IS_EMPTY");
        }
        if (this.isUseLogFile) {
            this.logger.fatal(this.formatLogMessage("fatal", msg));
        } else {
            System.err.println(this.formatLogMessage("error", msg));
        }
    }
}