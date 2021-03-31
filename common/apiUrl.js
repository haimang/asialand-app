// const host = 'https://dev.unifyestate.com/_api/'
const host = 'https://console.unifyestate.com/_api/'
const getTokenApi = host + 'thirdparty/getToken';
const signUp = host + 'userinfo/register';
const getCountries = host+ "userinfo/countries";
const reqeustVerifyCode = host + "universal/sendsms";
const secondcreate = host + "userinfo/secondcreate";
const getSystemBottom = host + "thirdparty/systemBottom";
const getPropertyList = host + "properties/list";
const getPropertyDetail = host + "properties/detail";
const getArticlelist = host + "tpr/list";
const login = host + "userinfo/loginToWeb_t";
const getUserInfo = host + "userinfo/getuserinfo"
const updateUserInfo = host + "userinfo/edituserinfo"
const getArticleDetail = host + "tpr/info"
const uploadImage = host + "universal/uploadphoto"
const saveProperty = host + "userinfo/addCollect"
const getSaveList = host + "userinfo/getCollect"
const getUnitList = host + "properties/units"
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

export default {
	getTokenApi,
	signUp,
	getCountries,
	reqeustVerifyCode,
	secondcreate,
	getSystemBottom,
	getPropertyList,
	getPropertyDetail,
	login,
	getUserInfo,
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
	getPushDetail
}
