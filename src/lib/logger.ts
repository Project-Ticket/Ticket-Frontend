import { headers } from "next/headers";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transport = new DailyRotateFile({
  filename: "logs/%DATE%.log", // folder logs/, nama file berdasarkan tanggal
  datePattern: "YYYY-MM-DD", // format tanggal
  zippedArchive: false, // true jika ingin di-zip
  maxSize: "20m", // maksimal ukuran file log
  maxFiles: "7d", // simpan log selama 7 hari
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [transport, new winston.transports.Console()],
});

export default logger;

export async function createLogger() {
  if (process.env.NODE_ENV === "development") {
    const headerList = await headers();

    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const method = headerList.get("x-method") || "get";
    const url = headerList.get("referer") || "unknown";

    return {
      info: (msg: string) =>
        logger.info(`[${ip}] [${method}] [${url}] - REQ ${msg}`),
      error: (msg: string) =>
        logger.error(`[${ip}] [${method}] [${url}] - RES ${msg}`),
      api: (msg: string, isError = false) =>
        isError
          ? logger.error(`[${ip}] - HIT API ${msg}`)
          : logger.info(`[${ip}] - HIT API ${msg}`),
    };
  }
}
