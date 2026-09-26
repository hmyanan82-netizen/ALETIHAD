(function(){
  var REDIRECT_TARGETS = {
    index: { ar: "index.html", en: "index-en.html" },
    order: { ar: "order.html", en: "order-en.html" },
    summary: { ar: "summary.html", en: "summary-en.html" }
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
  function ping(){
    if (document.hidden) return;
    try { fetch("/api/ping", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:id,page:page}), keepalive:true }); } catch (e) {}
  }
  ping();
  setInterval(ping, 3000);
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) ping(); });
  window.addEventListener("pagehide", function(){
    try { navigator.sendBeacon("/api/leave", new Blob([JSON.stringify({id:id})], {type:"application/json"})); } catch (e) {}
  });
})();
