// const host = 'https://dev.unifyestate.com/_api/'
const host = 'https://console.unifyestate.com/_api/'
const getTokenApi = host + 'thirdparty/getToken';
const signUp = host + 'userinfo/register';
const getCountries = host+ "userinfo/countries";
const reqeustVerifyCode = host + "universal/sendsms";
const secondcreate = host + "userinfo/secondcreate";
const getSystemBottom = host + "thirdparty/systemBottom";
const v2_getPropertyList = host + "v2/properties/list";

const getPropertyDetail = host + "properties/detail";
const v2_getPropertyDetail = host + "v2/properties/detail";

const getArticlelist = host + "tpr/list";
const login = host + "v2/login/index";
const getUserInfo = host + "userinfo/getuserinfo"
const v2_getUserInfo = host + "v2/userinfo/getuserinfo"

const updateUserInfo = host + "userinfo/edituserinfo"
const getArticleDetail = host + "tpr/info"
const uploadImage = host + "universal/uploadphoto"
const saveProperty = host + "userinfo/addCollect"
const getSaveList = host + "userinfo/getCollect"
const getUnitList = host + "properties/units"
const v2_getUnitList = host + "v2/unit/list"
const getUnitDetail = host + "properties/unit"
const orderCreate = host + "order/create"
const orderDetail = host + "order/detail"
const orderList = host + "order/list"
const deepAnalysis = host + "properties/deepanalysis"
const customerCreate = host + "customer/create"
const promoList = host + "promo/list"
const getUserCard = host + "universal/getuserinfocard"
const updateClientId = host + "userinfo/updateClientId"
const getPushList = host + "push/list"
const getPushDetail = host + "push/detail"
const getTranslate = host + "longrental/descriptionCnTranslate"
const getNoReadPush = host + "v2/push/unread"
const setReadAllPush = host + "v2/push/editstatus"
const getLocationInfo = host + "v2/location/info"
const getEducationInfo = host + "v2/education/info"
const getAgentInfo = host + "v2/properties/agentpackage"

export default {
	getTokenApi,
	signUp,
	getCountries,
	reqeustVerifyCode,
	secondcreate,
	getSystemBottom,
	getPropertyDetail,
	login,
	getUserInfo,
	v2_getUserInfo,
	updateUserInfo,
	getArticlelist,
	getArticleDetail,
	uploadImage,
	saveProperty,
	getSaveList,
	getUnitList,
	getUnitDetail,
	orderCreate,
	orderDetail,
	orderList,
	deepAnalysis,
	customerCreate,
	promoList,
	getUserCard,
	updateClientId,
	getPushList,
	getPushDetail,
	getTranslate,
	getNoReadPush,
	setReadAllPush,
	getLocationInfo,
	v2_getPropertyDetail,
	v2_getPropertyList,
	getEducationInfo,
	getAgentInfo,
	v2_getUnitList
}
