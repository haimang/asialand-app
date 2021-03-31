
//赢家会
// const appId = 'AHE28QWRU257373';
// const appSecret = 'bsJmxqqMZ4wxRerYYhW3';

//睿频
// const appId = '7qk8qOFezLdpweyh';
// const appSecret = 'gRAcTqJXu6FT8lL4MpaS';

const appId = "K0pv4v09wNeuZ7pV"
const appSecret = "AP34LSuwdzmxlDlKjejD"

const scene = '92paah'
const basetext = 'tdT1IQw1VSLW9OQ1Y4dlpBU24mcD1IQ1BULWdTSHlXSzBkRXE='  //ndT1IQ51VSLW9OQ1Y4dlpBU24mcD1IQ1BULUpiNTc4dVo1bnQ=
const shareUrl = "https://portal.asialand.com.au/asialand/h5/"

export default {
	appId,
	appSecret,
	scene,
	basetext,
	shareUrl,
	isEmail(value) {
	  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9.]+\.[a-z]+$/;
	  if (value == '' || value == undefined || value == null) {
	    return false
	  } else {
	    if (!reg.test(value)) {
	      return false
	    } else {
	      return true
	    }
	  }
	 },
	 getCurrentTime(){
		var date = new Date()
		let y = date.getFullYear()
		let MM = date.getMonth() + 1
		MM = MM < 10 ? ('0' + MM) : MM
		let d = date.getDate()
		d = d < 10 ? ('0' + d) : d
		let h = date.getHours()
		h = h < 10 ? ('0' + h) : h
		let m = date.getMinutes()
		m = m < 10 ? ('0' + m) : m
		let s = date.getSeconds()
		s = s < 10 ? ('0' + s) : s
		return y + '-' + MM + '-' + d + ' ' + h + ":" + m + ":" + s 
	 },
	 timestampToTime (time) {
	 	var date = new Date(time * 1000) 
	 	let y = date.getFullYear()
	 	let MM = date.getMonth() + 1
	 	MM = MM < 10 ? ('0' + MM) : MM
	 	let d = date.getDate()
	 	d = d < 10 ? ('0' + d) : d
	 	let h = date.getHours()
	 	h = h < 10 ? ('0' + h) : h
	 	let m = date.getMinutes()
	 	m = m < 10 ? ('0' + m) : m
	 	let s = date.getSeconds()
	 	s = s < 10 ? ('0' + s) : s
	 	return y + '-' + MM + '-' + d 
	 },
	 
	 currency (value, currency, decimals) {
	   var digitsRE = /(\d{3})(?=\d)/g
	   value = parseFloat(value)
	   if (!isFinite(value) || (!value && value !== 0)) return ''
	   currency = currency != null ? currency : ''
	   decimals = decimals != null ? decimals : 0
	   var stringified = Math.abs(value).toFixed(decimals)
	   var _int = decimals
	     ? stringified.slice(0, -1 - decimals)
	     : stringified
	   var i = _int.length % 3
	   var head = i > 0
	     ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
	     : ''
	   var _float = decimals
	     ? stringified.slice(-1 - decimals)
	     : ''
	   var sign = value < 0 ? '-' : ''
	   return sign + currency + head +
	     _int.slice(i).replace(digitsRE, '$1,') +
	     _float
	 }
	 
}
