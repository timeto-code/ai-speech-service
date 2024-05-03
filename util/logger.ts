import path from "path";
import { createLogger, format, transports } from "winston";
import { rootDir } from "./config";

const logger = createLogger({
  // 设置日志的最低级别为"debug"，即只记录"info"级别以上的日志。
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  // 使用format.combine结合多个日志格式化选项。
  format: format.combine(
    // 添加时间戳，格式为"YYYY-MM-DD HH:mm:ss"。
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    // 当记录错误时，包含错误堆栈。
    format.errors({ stack: true }),
    // 支持日志字符串插值。
    format.splat(),
    // 设置日志格式为JSON。
    format.json(),
    // 自定义日志格式。
    format.printf(({ level, message, timestamp, service }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),

  // 设置默认元数据，这些元数据将被添加到每条日志中。
  // defaultMeta: { service: "node-ddns-server" },

  // 设置日志的输出目标。
  transports: [
    // 非生产环境时日志将在控制台上以彩色文本形式显示。
    ...(process.env.NODE_ENV === "production"
      ? []
      : [
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.simple(),
              format.printf(
                ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
              )
            ),
          }),
        ]),
    // 打印debug级别以上的所有日志
    new transports.File({
      filename: "combined.log",
      level: "debug",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(rootDir, "logs"),
    }),

    // 打印info级别以上的所有日志
    new transports.File({
      filename: "info.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(rootDir, "logs"),
    }),

    // 打印warn级别以上的所有日志
    new transports.File({
      filename: "warn.log",
      level: "warn",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(rootDir, "logs"),
    }),

    // 打印error级别以上的所有日志
    new transports.File({
      filename: "errors.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      dirname: path.join(rootDir, "logs"),
    }),
  ],
});

export default logger;
