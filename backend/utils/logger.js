const isProd = process.env.NODE_ENV === 'production';

const logger = {
  info:  (msg, ...args) => console.log(`[INFO]  ${msg}`, ...args),
  warn:  (msg, ...args) => console.warn(`[WARN]  ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  debug: (msg, ...args) => { if (!isProd) console.log(`[DEBUG] ${msg}`, ...args); },
  api:   (method, url, status) => console.log(`[API]   ${method} ${url} → ${status}`)
};

module.exports = logger;
