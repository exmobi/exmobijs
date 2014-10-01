/*
*	ExMobi4.0 JS 框架之 动态树类tree.js(依赖base.js)
*	Version	:	1.1.0
*/
//两个参数，第一个是初始化数据为json格式，第二个为源数据，当为json格式的时候认为是ptree，当为xml的时候认为是xtree
function $tree(treeId,isExpandAll){
	var tree = document.getElementById(treeId);
	if(!tree) return null;
	//初始化树节点的属性，用json对象是为了后续可以扩充
	tree.init = {
					target:"_blank",
					collapsetarget:"_self",
					checkbox:tree.checkbox?true:false
				};
	//缓存append的数据
	var cacheData = [];
	
	var noIdData = [];
	
	//提供直接返回json对象或者数组直接写树
	tree.load = function(data){
		data = (typeof data)=="string"?data.toJSON():data;
		data = (data instanceof Array)?data:[data];
		/*
		data = data.sort(function(x,y){			
			if(x.pId==y.id) return 1; //升序			
		});		
		*/
		beignPreferenceChange();
		
		var rs = tree.eachLoad(data);
		
		endPreferenceChange();
		
		return rs;
	};
	//循环添加子节点
	tree.eachLoad = function(data){
		
		var rs = [];
		
		var noIdDataTemp = [];
		
		for(var i=0;i<data.length;i++){
			if(!data[i]) continue;
			var myTreeItem = tree.add(data[i]);
			if(myTreeItem==null){
				noIdDataTemp.push(data[i]);
			}else{
				rs.push(myTreeItem);
			}
		}
		
		if(noIdDataTemp.length!=0&&noIdDataTemp.length!=noIdData.length){
			noIdData = noIdDataTemp;
			rs.concat(tree.eachLoad(noIdData));
		}
		
		return rs;
	}
	//该方法不暴露，为树添加节点
	tree.add = function(json){
		
		json.id = json.id?json.id:tree.encryption();
		json.pId = json.pId?json.pId:treeId;
		
		var parentItem = tree.getTreeItemById(json.pId);
		if(!parentItem) return null;
		var newItem = tree.getTreeItemById(json.id)?tree.getTreeItemById(json.id):new TreeItem();
		
		for(var key in json){
			newItem[key] = json[key];
		}

		if(json.target==null){
			newItem.target = tree.init.target;
		}
		if(json.collapsetarget==null){
			newItem.collapsetarget = tree.init.collapsetarget;
		}
		
		if(json.checkbox==null){			
			newItem.checkbox = tree.init.checkbox;
		}
		
		if(!tree.getTreeItemById(json.id)) parentItem.addTreeItem(newItem);
		newItem.child = function(){//itemId, itemText, itemValue, itemHref, itemCollapsehref
			var cJson = arguments[0];
			if(arguments.length>1){
				cJson = {};
				cJson.id = arguments[0];				
				cJson.text = arguments[1];
				cJson.value = arguments[2];
				cJson.href = arguments[3];
				cJson.collapsehref = arguments[4];
			}	
			cJson.pId = newItem.id;
			return tree.add(cJson);
		};
		return newItem;
	};
	//为树追加节点
	tree.append = function(){//id, pId, text, value, href, collapsehref
		var json = arguments[0];
		if(arguments.length>1){
			json = {"id":arguments[0],"pId":arguments[1],"text":arguments[2],"value":arguments[3],"href":arguments[4],"collapsehref":arguments[5]};
		}
		json.id = json.id?json.id:tree.encryption();
		json.pId = json.pId?json.pId:treeId;		
		cacheData.push(json);
		return json;
	};
	//当使用append追加节点的时候必须通过该方法写树
	tree.show = function(){
		tree.load(cacheData);
		cacheData = [];
	};
	//根据id获取树节点
	tree.get = function(){
		var treeItem = (typeof arguments[0])=="object"?arguments[0]:tree.getTreeItemById(arguments[0]);
		if(!treeItem) return null;
		treeItem.id = treeItem.id?treeItem.id:tree.encryption();
		//给某个节点添加子节点
		treeItem.child = function(){//itemId, itemText, itemValue, itemHref, itemCollapsehref
			var json = arguments[0];
			if(arguments.length>1){
				json = {};
				json.id = arguments[0];				
				json.text = arguments[1];
				json.value = arguments[2];
				json.href = arguments[3];
				json.collapsehref = arguments[4];			
			}
			json.pId = treeItem.id;
			return tree.add(json);
		};
		//将某个节点从树节点中删除
		treeItem.remove = function(){
			tree.removeItemById(treeItem.id);
		};
		treeItem.clear = function(){
			for(var i=treeItem.childNodes.length-1;i>-1;i--){
				tree.remove(treeItem.childNodes[i]);
			}
		};
		//树是否有子节点
		treeItem.hasChild = function(id){
			return treeItem.childNodes.length==0?false:true;
		}
		return treeItem;
	};
	//给某个节点添加节点
	tree.child = function(){//id, text, value, href, collapsehref
		if(arguments.length==1){
			return tree.add(arguments[0]);
		}

		return tree.add(arguments[0], treeId, arguments[1], arguments[2], arguments[3], arguments[4]);
	};
	//移除树节点
	tree.remove = function(){
		var id = (typeof arguments[0])=="string"?arguments[0]:arguments[0].id;
		if(id) tree.removeItemById(id);
	}
	//获取随机id
	tree.encryption = function(){
	    var date = new Date();
	    var times1970 = date.getTime();
	    var times = date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
	    var encrypt = times * times1970;
	    if(arguments.length == 1){
	        return arguments[0] + encrypt;
	    }else{
	        return encrypt;
	    }
	}
	
	//返回的是树对象，可以对该对象操作标准树对象的所有JS，比如打开关闭节点
	return tree;
}
