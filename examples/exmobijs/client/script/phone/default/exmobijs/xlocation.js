/*
*	ExMobi4.0 JS 框架之 控件对象类xlocation.js
*	Version	:	1.1.2
*/

/*
 * $xlocation.getLocationByAddress('百度大厦', '北京市', function(data){
		alert(data.lng);
	});

	$xlocation.getAddressByLocation(118.803, 32.0487, function(data){
		alert(data.business);
	});
 * 
 * */
var $xlocation = {
		_index : 0,
		_baiduLocationPool : {},
		_gpsPool : {},
		_locationPool : {},
		_baiduLocationCallbackPool : {},
		_gpsCallbackPool : {},
		_locationCallbackPool : {},
		_customCallback 　: {},
		_locationModal : {
			lat:'',latitude:'',lng:'',longitude:'',location:'',locationtime:'',province:'',city:'',district:'',street:'',streetNumber:''
		}
};

$xlocation.get = function(cb){
	var options = {
			timeout : 2000
	};
	var os = DeviceUtil.getOs().toLowerCase();
	var identify = $xlocation._index = $xlocation._index++;
	if(os=='android'){
		if(!$xlocation._baiduLocationPool[identify]) $xlocation._baiduLocationPool[identify] = new BaiduLocation();
		
		var baiduLocation = $xlocation._baiduLocationPool[identify];
		
		$xlocation._baiduLocationCallbackPool[identify] = function(){
			var rs = $u.extend($xlocation._locationModal, baiduLocation.isSuccess()?baiduLocation:null);
			rs.lng = rs.longitude;
			rs.lat = rs.latitude;
			cb&&cb(rs);
			delete $xlocation._baiduLocationPool[identify];
			delete $xlocation._baiduLocationCallbackPool[identify];
		};
		baiduLocation.setCoorType('gcj02');
		baiduLocation.setLocationMode('Hight_Accuracy');
		baiduLocation.setOpenGps(true);
		baiduLocation.setTimeout(options.timeout);
		baiduLocation.onCallback = $xlocation._baiduLocationCallbackPool[identify];
		baiduLocation.startPosition();
	}else if(os=='ios'){
		if(!$xlocation._gpsPool[identify]) $xlocation._gpsPool[identify] = new Gps();
		var position = $xlocation._gpsPool[identify];
		
		$xlocation._gpsCallbackPool[identify] = function(){
			var positionRs = $u.extend($xlocation._locationModal, position.isSuccess()?position:null);
			positionRs.lng = positionRs.longitude;
			positionRs.lat = positionRs.latitude;
			
			
			if(!$xlocation._locationPool[identify]) $xlocation._locationPool[identify] = new Location();
			var location = $xlocation._locationPool[identify];
			
			$xlocation._locationCallbackPool[identify] = function(){
				var locationRs = $u.extend($xlocation._locationModal, location.isSuccess()?location:null);
				locationRs.lng = locationRs.longitude;
				locationRs.lat = locationRs.latitude;
				
				cb&&cb(location.isSuccess()?$u.extend(positionRs, locationRs):positionRs);
				
				delete $xlocation._locationPool[identify];
				delete $xlocation._locationCallbackPool[identify];
			};
			
			location.onCallback = $xlocation._locationCallbackPool[identify];
			location.setTimeout(options.timeout);			
			position.isSuccess()?(location.startGetLocationInfo(positionRs.lat,positionRs.lng)):(location.startGetLocationInfobyCellId(Util.getCellIdInfo()));
			
			delete $xlocation._gpsPool[identify];
			delete $xlocation._gpsCallbackPool[identify];
		};
		
		position.onCallback = $xlocation._gpsCallbackPool[identify];
	    position.setTimeout(options.timeout);
	    position.startPosition();

	}
};
//http://developer.baidu.com/map/index.php?title=webapi/guide/webservice-geocoding
$xlocation.baiduGeocoding = function(options, path){
	path = path?path:'http://api.map.baidu.com/geocoder/v2/';
	var param = {
			output : "json",
			ak : "D6f320a027a612f55050cba5855f64de"
	};
	for(var k in options){
		if(k=='callback'||options[k]=='') continue;
		param[k] = options[k];
	}
	var url = path+"?";
	var paramArr = [];
	for(var k in param){
		paramArr.push(k+"="+param[k]);
	}
	url += paramArr.join("&");
	var ajaxData = {};       
    ajaxData.isBlock = false; 
    ajaxData.method = "GET";       
    ajaxData.url = url;
    ajaxData.reqCharset = "UTF-8";
    var identify = $xlocation._index = $xlocation._index++;
    ajaxData.successFunction = "$xlocation_baiduGeocodingSuccessCallback";
    ajaxData.failFunction = "$xlocation_baiduGeocodingFailCallback";
    var ajax = new DirectAjax(ajaxData);
    //var ajax = new Ajax(ajaxData);
    $xlocation._customCallback[identify] = options.callback;
    ajax.setStringData('identify', identify);
    ajax.send();
};
var $xlocation_baiduGeocodingSuccessCallback = function(ajax){
	var callback = $xlocation._customCallback[ajax.getStringData('identify')];	
	try{
		callback&&callback(eval('('+ajax.responseText+')'));
	}catch(e){
		$xlocation_baiduGeocodingFailCallback(ajax);
	}
	
};
var $xlocation_baiduGeocodingFailCallback = function(ajax){
	var callback = $xlocation._customCallback[ajax.getStringData('identify')];
	callback&&callback(null);
};
//{"status":0,"result":{"location":{"lng":116.30814954222,"lat":40.056885091681},"precise":1,"confidence":80,"level":"\u5546\u52a1\u5927\u53a6"}}
$xlocation.getLocationByAddress = function(address, city, cb){
	if(typeof city=="function"){
		cb = city;
		city = "";
	}
	$xlocation.baiduGeocoding({
		address : address,
		city : city,
		callback : function(data){
			data = (data&&data.status==0)?data.result.location:null;
			cb&&cb(data);
		}
	});
};
//{"status":0,"result":{"location":{"lng":118.8029999605,"lat":32.048700046497},"formatted_address":"江苏省南京市玄武区中山东路189-东门","business":"珠江路,长白街,常府街","addressComponent":{"city":"南京市","district":"玄武区","province":"江苏省","street":"中山东路","street_number":"189-东门"},"cityCode":315}}
$xlocation.getAddressByLocation = function(lng, lat, cb){
	$xlocation.baiduGeocoding({
		location : lat+","+lng,
		pois : 0,
		callback : function(data){
			data = (data&&data.status==0)?data.result:null;
			cb&&cb(data);
		}
	});
};
//{"status":0,"result":[{"x":114.2307546571,"y":29.579085408827}]}
$xlocation.transToBaiduLocation = function(lng, lat, cb){
	$xlocation.baiduGeocoding({
		coords : lng+","+lat,
		from : 1,
		to : 5,
		callback : function(data){
			data = (data&&data.status==0)?{lng:data.result[0].x, lat:data.result[0].y}:null;
			cb&&cb(data);
		}
	}, 'http://api.map.baidu.com/geoconv/v1/');
};