angular.module("replanAppTemplatesCaches", []).run(["$templateCache", function($templateCache) {$templateCache.put("views/home","null");
$templateCache.put("views/layout.haml","!!! %html{lang: \"en\"} %head %title WikiWash %body .header WikiWash .content = body");
$templateCache.put("views/partials","null");
$templateCache.put("views/home/index.haml","TEST");
$templateCache.put("views/partials/head.haml","%head %title WikiWash");
$templateCache.put("views/partials/test.haml","TEST PARTIAL");}]);