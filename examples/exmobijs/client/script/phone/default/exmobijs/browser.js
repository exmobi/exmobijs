/*
*	ExMobi4.0 JS 框架之 webview桥接类browser.js
*	Version	:	1.1.0
*/
$browser = {};
$browser.cacheMap = {};

$browser.bridgeLoad = function(url){
	var ps = $browser._handleParameter(arguments);	
	var funcStr = '$native._bridgeActivity("exmobiload","'+ps+'")';
	setTimeout("$browser._executeScript('"+funcStr+"');",500);
	
};
$browser.bridgeStart = function(){
	var ps = $browser._handleParameter(arguments);	
	var funcStr = '$native._bridgeActivity("exmobistart","'+ps+'")';
	setTimeout("$browser._executeScript('"+funcStr+"');",500);
	
};
$browser.bridgeStop = function(){
	var ps = $browser._handleParameter(arguments);	
	var funcStr = '$native._bridgeActivity("exmobistop","'+ps+'")';
	$browser._executeScript(funcStr);
	
};
$browser.bridgeDestroy = function(){
	var ps = $browser._handleParameter(arguments);	
	var funcStr = '$native._bridgeActivity("exmobidestroy","'+ps+'")';
	$browser._executeScript(funcStr);
	
};

$browser._executeScript = function(funcStr){
	var browser = $('browser');
	if(!browser) return;
	browser.executeScript(funcStr);
};


$browser._handleParameter = function(ars){
	var ps = [];
	for(var i=0;i<ars.length;i++){
		ps.push(ars[i]);
	}
	return EncryptionUtil.base64Encode($u.transObj(ps));
};

$browser.open = function(url){	
	var opt = $util.parseResURL(url);
	opt.isNew = false;
	opt.transition = 'none';
	
	var html = $util.htmlTemplate(opt);
	
	window.openData(html, opt.isNew,false,'',opt.query);
};

$browser.cacheMap._OPEN_DATA_TIME_SELECTOR_ = {
		timeWindow : null,
		callback : function(){
			var timeWindow = $browser.cacheMap._OPEN_DATA_TIME_SELECTOR_.timeWindow;
			var rs = timeWindow.isSuccess()?timeWindow.result:'';
			var funcStr = "$native.cacheMap._OPEN_DATE_TIME_SELECTOR_.handle('"+rs+"')";
			$('browser').executeScript(funcStr);
		}
};

$browser.openDateTimeSelector = function(mode,initialvalue){
	var timeWindow = $browser.cacheMap._OPEN_DATA_TIME_SELECTOR_.timeWindow = $browser.cacheMap._OPEN_DATA_TIME_SELECTOR_.timeWindow||new TimeWindow();	
	timeWindow.mode = mode?mode:'date';
	timeWindow.initialvalue = initialvalue?initialvalue:'';
	timeWindow.onCallback = $browser.cacheMap._OPEN_DATA_TIME_SELECTOR_.callback;
	timeWindow.startWindow();
};

$browser.cacheMap._OPEN_CAMERA_WINDOW_ = {
		cameraWindow : null,
		callback : function(){
			var cameraWindow = $browser.cacheMap._OPEN_CAMERA_WINDOW_.cameraWindow;
			var rs = cameraWindow.isSuccess()?cameraWindow.value:'';
			var funcStr = "$native.cacheMap._OPEN_FILE_SELECTOR_.handle('"+rs+"')";
			$('browser').executeScript(funcStr);
		}
};
$browser.openCameraWindow = function(mode){
	var cameraWindow = $browser.cacheMap._OPEN_CAMERA_WINDOW_.cameraWindow = $browser.cacheMap._OPEN_CAMERA_WINDOW_.cameraWindow||new CameraWindow();
	cameraWindow.mode = mode?mode:'still';
	cameraWindow.onCallback = $browser.cacheMap._OPEN_CAMERA_WINDOW_.callback;
	//cameraWindow.pwidth = 800;
	cameraWindow.startCamera();
};
