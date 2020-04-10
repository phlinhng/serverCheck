const TG_BOT_TOKEN="your token";
const TG_ID = "your chat id";

// [domain or ip]:[hostname]
const targets = {"www.gov.tw": "🇦🇶台灣",
"tw.yahoo.com": "🐯台灣Yahoo",
"www.google.com": "🔍Google",
"95.163.200.115": "🅱️搬瓦工DC3",
"www.cloudflare.com": "☁️Cloudflare",
"1.1.1.1": "📡Cloudflare"}

const except = ["☁️Cloudflare","📡Cloudflare"];

module.exports = { TG_BOT_TOKEN, TG_ID, targets, except };


