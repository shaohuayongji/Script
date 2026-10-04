/* 亚朵 App 手动签到诊断 · R6。
 * 仅临时记录 signIn 请求/响应元数据；不读正文，不请求网络，不保存凭据。
 * 将最多 40 条脱敏事件保存在本机；“亚朵 App 签到诊断日志”入口统一输出。
 */
(function () {
  "use strict";
  var VERSION = "2026.10.04.6";
  var KEY = "atour_loon_app_diagnostic_v1";
  var intercept = typeof $request !== "undefined";
  var QUERY_NAMES = ["token", "apptoken", "plattype", "appver", "channelid", "activitysource", "activityid", "activeid", "clientid", "r", "sign", "signature", "nonce", "timestamp", "ts"];
  var CAPTCHA_NAMES = ["lotnumber", "captchaoutput", "passtoken", "gentime", "lacktype"];
  function trace(stage, detail) {
    try { console.log("[ATOUR-APP " + VERSION + "] " + stage + (detail ? " " + detail : "")); } catch (_) {}
  }
  function header(headers, name) {
    var keys = Object.keys(headers || {});
    for (var i = 0; i < keys.length; i++) if (keys[i].toLowerCase() === name) return typeof headers[keys[i]] === "string" ? headers[keys[i]] : "";
    return "";
  }
  function names(values, allowed) {
    return Array.isArray(values) ? allowed.filter(function (n) { return values.indexOf(n) >= 0; }) : [];
  }
  function safeEvent(value) {
    if (!value || (value.phase !== "request" && value.phase !== "response")) return null;
    var event = { phase: value.phase, at: typeof value.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.at) ? value.at : "unknown" };
    if (value.phase === "request") {
      event.method = value.method === "GET" || value.method === "POST" ? value.method : "unknown";
      event.signHeader = value.signHeader === true;
      event.deviceHeader = value.deviceHeader === true;
      event.loginPresent = value.loginPresent === true;
      event.captchaFields = names(value.captchaFields, CAPTCHA_NAMES);
      event.queryFields = names(value.queryFields, QUERY_NAMES);
    } else {
      event.http = typeof value.http === "number" && value.http >= 100 && value.http <= 599 && value.http % 1 === 0 ? value.http : "unknown";
      event.encryption = ["none", "SM2", "AES"].indexOf(value.encryption) >= 0 ? value.encryption : "unknown";
    }
    return event;
  }
  function readEvents() {
    var raw = $persistentStore.read(KEY);
    if (!raw || typeof raw !== "string" || raw.length > 65536) return [];
    try {
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data.slice(-40).map(safeEvent).filter(function (event) { return !!event; }) : [];
    } catch (_) { return []; }
  }
  function eventLine(event) {
    var text = "at=" + event.at + " endpoint=signIn";
    if (event.phase === "request") return text + " method=" + event.method + " loginPresent=" + event.loginPresent + " signHeader=" + event.signHeader + " deviceHeader=" + event.deviceHeader + " captchaFields=" + (event.captchaFields.join(",") || "none") + " queryFields=" + (event.queryFields.join(",") || "none");
    return text + " HTTP=" + event.http + " encryption=" + event.encryption + " businessCode=not_read bodyRead=false";
  }
  try {
    if (!intercept) {
      trace("report.start", "bodyRead=false credentialsStored=false");
      var saved = readEvents();
      if (!saved.length) trace("report.empty", "请临时开启 App 手动签到诊断；在 App 点立即签到后关闭该开关，再运行本日志入口");
      saved.forEach(function (event) { trace("app." + event.phase, eventLine(event)); });
      trace("report.finish", "events=" + saved.length + " HTTP_200不代表业务成功；请结合App结果和只读状态查询");
      return;
    }
    if (typeof $argument === "undefined" || !$argument || typeof $argument !== "object" || ($argument.app_diagnostic !== true && $argument.app_diagnostic !== "true")) {
      trace("diagnostic.skip", "reason=disabled_or_invalid_argument"); return;
    }
    if (typeof $request.url !== "string" || !/^https:\/\/miniapp\.yaduo\.com\/atourlife\/signIn\/signIn(?:\?[^#]*)?$/.test($request.url)) return;
    var responseMode = typeof $response !== "undefined";
    var event = { phase: responseMode ? "response" : "request", at: new Date().toISOString() };
    if (responseMode) {
      event.http = Number($response.status || $response.statusCode);
      var encryption = header($response.headers, "x-encryption").trim();
      event.encryption = !encryption || encryption === "0" ? "none" : encryption === "1" ? "SM2" : encryption === "2" ? "AES" : "unknown";
    } else {
      event.method = String($request.method || "GET").toUpperCase();
      event.signHeader = !!header($request.headers, "at-client-sign");
      event.deviceHeader = !!header($request.headers, "at-client-code");
      event.captchaFields = CAPTCHA_NAMES.filter(function (name) { return !!header($request.headers, name); });
      var query = $request.url.split("?")[1] || "";
      var found = [];
      var loginInQuery = false;
      query.split("&").forEach(function (part) {
        try {
          var at = part.indexOf("=");
          var key = decodeURIComponent((at < 0 ? part : part.slice(0, at)).replace(/\+/g, " ")).toLowerCase();
          if (QUERY_NAMES.indexOf(key) >= 0) found.push(key);
          if ((key === "token" || key === "apptoken") && at >= 0 && part.length > at + 1) loginInQuery = true;
        } catch (_) {}
      });
      event.queryFields = names(found, QUERY_NAMES);
      event.loginPresent = loginInQuery || ["authorization", "cookie", "token", "apptoken"].some(function (name) { return !!header($request.headers, name); });
    }
    event = safeEvent(event);
    trace("app." + event.phase, eventLine(event));
    var events = readEvents();
    events.push(event);
    trace("diagnostic.store", "saved=" + !!$persistentStore.write(JSON.stringify(events.slice(-40)), KEY) + " credentialsStored=false");
  } catch (_) { trace("diagnostic.error", "reason=local_error trafficUnchanged=true"); }
  finally { if (intercept) $done({}); else $done(); }
})();
