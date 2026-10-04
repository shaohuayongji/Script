/* 亚朵获取登录信息 · R5。临时启用，获取后关闭获取开关。
 * 只读取 GET 状态请求的 URL/请求头。不读取正文、不解密、不发网络请求。
 * 保存候选信息，交给签到脚本验证；无论存储/通知是否失败，原样放行请求。
 */
(function () {
  "use strict";
  var VERSION = "2026.10.04.5";
  var KEY = "atour_loon_candidate_v1";
  var RUN_ID = Math.random().toString(16).slice(2, 10);
  var OMIT = /^(host|content-length|connection|accept-encoding|transfer-encoding|proxy-connection|at-client-sign|lotnumber|captchaoutput|passtoken|gentime|lacktype)$/i;
  var DYNAMIC = /^(sign|signature|nonce|timestamp|ts|lotnumber|captchaoutput|passtoken|gentime|lacktype)$/i;
  function trace(stage, detail) {
    try { console.log("[ATOUR " + VERSION + " " + RUN_ID + "] " + stage + (detail ? " " + detail : "")); } catch (_) {}
  }
  function notice(subtitle, message) {
    trace("notice", subtitle + "；" + message);
    try { $notification.post("亚朵获取登录信息", subtitle, message); } catch (_) {}
  }
  function header(headers, name) {
    var keys = Object.keys(headers || {});
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === name.toLowerCase() && typeof headers[keys[i]] === "string") return headers[keys[i]];
    }
    return "";
  }
  function parse(url) {
    if (typeof url !== "string" || url.length > 32768) return null;
    var m = /^https:\/\/miniapp\.yaduo\.com\/atourlife\/signIn\/indexInfoV2(?:\?([^#]*))?$/.exec(url);
    if (!m) return null;
    var params = Object.create(null);
    try {
      (m[1] || "").split("&").forEach(function (part) {
        if (!part) return;
        var p = part.indexOf("=");
        var k = decodeURIComponent((p < 0 ? part : part.slice(0, p)).replace(/\+/g, " "));
        var v = decodeURIComponent((p < 0 ? "" : part.slice(p + 1)).replace(/\+/g, " "));
        if (Object.prototype.hasOwnProperty.call(params, k)) throw new Error("duplicate");
        params[k] = v;
      });
    } catch (_) { return null; }
    return params;
  }
  function identity(url, headers) {
    var params = parse(url) || {};
    var values = {};
    Object.keys(params).sort().forEach(function (k) { if (/^(token|appToken)$/i.test(k)) values[k.toLowerCase()] = params[k]; });
    ["authorization", "cookie", "token", "appToken"].forEach(function (k) { if (header(headers, k)) values[k.toLowerCase()] = header(headers, k); });
    return JSON.stringify(values);
  }
  try {
    trace("start", "mode=capture_request bodyRead=false networkRequests=false");
    // 合并插件同时用 enable 和 argument 控制；关闭或异常参数时直接放行。
    // 未传参数时兼容旧的独立临时获取插件。
    if (typeof $argument !== "undefined" && $argument !== null) {
      if (typeof $argument !== "object" || ($argument.capture_enabled !== true && $argument.capture_enabled !== "true")) {
        trace("capture.skip", "reason=capture_disabled_or_invalid_argument"); return;
      }
    }
    if (typeof $request === "undefined" || String($request.method || "GET").toUpperCase() !== "GET") {
      trace("capture.skip", "reason=not_GET_request"); return;
    }
    var params = parse($request.url);
    if (!params) { trace("capture.skip", "reason=unsupported_url_or_query"); return; }
    var dynamic = Object.keys(params).filter(function (k) { return DYNAMIC.test(k); }).map(function (k) { return k.toLowerCase(); }).sort();
    if (dynamic.length) {
      trace("capture.skip", "reason=dynamic_query fields=" + dynamic.join(","));
      notice("需要参数适配 · R5", "未保存含时效字段的请求：" + dynamic.join("、") + "。请关闭获取功能后在 App 签到。"); return;
    }
    var headers = {};
    Object.keys($request.headers || {}).forEach(function (k) {
      if (!OMIT.test(k) && typeof $request.headers[k] === "string") headers[k] = $request.headers[k];
    });
    var login = Object.keys(params).some(function (k) { return /^(token|appToken)$/i.test(k) && !!params[k]; }) ||
      ["authorization", "cookie", "token", "appToken"].some(function (k) { return !!header(headers, k); });
    trace("capture.request", "endpoint=indexInfoV2 loginPresent=" + !!login + " signHeader=" + !!header($request.headers, "At-Client-Sign") + " deviceHeader=" + !!header(headers, "At-Client-Code"));
    if (!login) { trace("capture.skip", "reason=no_login_credential"); return; }
    var session = { url: $request.url, headers: headers, savedAt: Date.now(), capturedWithDynamicSign: !!header($request.headers, "At-Client-Sign") };
    var old;
    try { old = JSON.parse($persistentStore.read(KEY) || "null"); } catch (_) {}
    if (!$persistentStore.write(JSON.stringify(session), KEY)) {
      notice("保存失败 · R5", "候选信息未保存；请关闭获取功能，检查 Loon 本地存储。"); return;
    }
    trace("capture.store", "result=candidate_saved validated=false signHeaderStored=false captchaHeadersStored=false");
    if (!old || identity(old.url, old.headers) !== identity(session.url, session.headers)) {
      notice("候选登录信息已保存 · R5", "请关闭插件页面里的“获取登录信息”开关，再运行“亚朵签到（手动）”验证；独立获取插件请关闭整个插件。");
    }
  } catch (_) {
    trace("capture.error", "reason=local_error requestUnchanged=true");
  } finally {
    trace("finish", "mode=capture_request requestUnchanged=true");
    // 不返回 URL、请求头或正文；即使本地 API 抛错也放行原请求。
    if (typeof $request === "undefined") $done(); else $done({});
  }
})();
