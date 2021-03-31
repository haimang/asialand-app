
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/home","pages/login/login","pages/register/success","pages/unit/reserve_success","pages/unit/reserve","pages/unit/detail","pages/unit/index","pages/agent/index","pages/user/reservations","pages/user/properties","pages/user/privacy","pages/user/info","pages/user/index","pages/notification/detail","pages/notification/index","pages/promotion/index","pages/promotion/detail","pages/register/register_step1","pages/map/search_map","pages/search/result","pages/search/search","pages/map/map","pages/house/analysis","pages/house/detail","pages/news/detail","pages/register/register_step3","pages/register/register_step2","pages/user/contactus","pages/main/main","pages/user/user","pages/index/index"],"window":{"navigationBarTextStyle":"black","navigationBarBackgroundColor":"#f8f8f8","backgroundColor":"#f8f8f8"},"tabBar":{"color":"#7a7e83","selectedColor":"#D9C077","backgroundColor":"#ffffff","list":[{"pagePath":"pages/home/home","text":"Search","iconPath":"static/img/tab1-icon.png","selectedIconPath":"static/img/tab1-icon-selected.png"},{"pagePath":"pages/promotion/index","text":"Promotions","iconPath":"static/img/stLine-gift-l.png","selectedIconPath":"static/img/stLine-gift-l-selected.png"},{"pagePath":"pages/notification/index","text":"Notifications","iconPath":"static/img/fa-comment-dots.png","selectedIconPath":"static/img/fa-comment-dots-selected.png"},{"pagePath":"pages/user/index","text":"Member","iconPath":"static/img/antOutline-user.png","selectedIconPath":"static/img/antOutline-user-selected.png"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"Asialand","compilerVersion":"3.1.2","entryPagePath":"pages/home/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":true,"titleNView":false}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/register/success","meta":{},"window":{"titleNView":false}},{"path":"/pages/unit/reserve_success","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/unit/reserve","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/unit/detail","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/unit/index","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/agent/index","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/user/reservations","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/user/properties","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/user/privacy","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/user/info","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/user/index","meta":{"isQuit":true,"isTabBar":true},"window":{"titleNView":false}},{"path":"/pages/notification/detail","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/notification/index","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":true,"titleNView":false}},{"path":"/pages/promotion/index","meta":{"isQuit":true,"isTabBar":true},"window":{"titleNView":false}},{"path":"/pages/promotion/detail","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/register/register_step1","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/map/search_map","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/search/result","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":true}},{"path":"/pages/search/search","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/map/map","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/house/analysis","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/house/detail","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/news/detail","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/register/register_step3","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/register/register_step2","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/user/contactus","meta":{},"window":{"navigationBarTitleText":""}},{"path":"/pages/main/main","meta":{},"window":{"navigationBarTitleText":"登录模板"}},{"path":"/pages/user/user","meta":{},"window":{"navigationBarTitleText":"我的"}},{"path":"/pages/index/index","meta":{},"window":{"navigationBarTitleText":"uni-app"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});