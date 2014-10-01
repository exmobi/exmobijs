/*
*	ExMobi4.0 JS 框架之 数据库操作类db.js
*	Version	:	1.1.0
*/
function $db(dataName,isCreate,path,key){
	var db;
	var isConnected = false;//是否连接
	var isAppDb = true;//是否为应用数据库
		
	var obj = {};
		
	//打开数据路连接只有一个参数认为打开应用数据库，多个参数认为打开自定义数据库	
	obj.open = function(dn,ic,pt,ky){//dataName,isCreate,path,key
		obj.close();
		dataName = dn?dn:dataName;
		isCreate = ic?ic:isCreate;
		path = pt?pt:(path?path:"");
		key = ky?ky:(key?key:"");
		if(dataName&&(isCreate!=null)){//打开自定义数据库
			db = new DataBase();
			isConnected = db.db_open(dataName,isCreate,path,key);
			isAppDb = false;
		}else{//打开应用数据库，建议使用
		 	dataName = dataName?dataName:Util.getAppId();
			db = Util.getAppDb(dataName);
			isConnected = (db==null?false:true);
			isAppDb = true;
		}
			
		return isConnected;
	};
		
	//获取连接状态
	obj.isConnected = function(){
		if(isConnected) return isConnected;
		return obj.open();
	};
		
	//表格类
	obj.table = function(n){
		var t = {};
			
		//创建表，可以有多个参数，代表一个列信息,如
		/*
		 * 
			 学号varchar(14) IDENTITY(1,1) PRIMARY KEY,
			 姓名varchar(8) UNIQUE NOT NULL,
			 班级编号varchar(14) REFERENCES '班级信息',
			 年级int null,
			性别varchar(2) CHECK(性别in ('男’','女’)),
			 民族varchar(20) DEFAULT '未知该生民族',
			 籍贯varchar(50)
		 */
		t.create = function(){
			if(!obj.isConnected()) return -1;
			
			if(obj.isTable(n)) return t;
			
			var p = [];
			for(var i=0;i<arguments.length;i++){
				p.push(arguments[i]);
			}
			if(db.db_executeUpdate("Create TABLE "+n+" ("+p.join(",")+")")){
				return t;
			}else{
				return 0;
			}
		};
		
		//删除表
		t.drop = function(){
			if(!obj.isConnected()) return -1;				
			db.db_executeUpdate("drop table "+n);
			return t;
		};
			
		//为表增加列ALTER TABLE [表名] ADD [字段名] NVARCHAR (50) NULL
		t.addCol = function(cn,m,d){//cn:字段名,m:数据类型(含长度),d:默认值	
			if(!obj.isConnected()) return -1;	
			db.db_executeUpdate("ALTER TABLE "+n+" ADD "+cn+" "+m+" "+d);
			return t;
		};
			
		//删除表字段ALTER TABLE [表名] DROP COLUMN [字段名]
		t.delCol = function(cn){//cn:字段名	
			if(!obj.isConnected()) return -1;	
			db.db_executeUpdate("ALTER TABLE "+n+" DROP COLUMN "+cn);
			return t;
		};
			
		//修改表字段ALTER TABLE [表名] ALTER COLUMN [字段名] NVARCHAR (50) NULL
		t.mdfCol = function(cn,m,d){//cn:字段名,m:数据类型(含长度),d:默认值	
			if(!obj.isConnected()) return -1;	
			db.db_executeUpdate("ALTER TABLE "+n+" ALTER COLUMN "+cn+" "+m+" "+d);
			return t;
		};
			
		return t;
	};
		
	//查询SELECT [字段1],[字段1] FROM [表名] WHERE [字段三] = \'HAIWA\'
	obj.query = function(s,isOrg){//s为查询sql，isOrg为是否原样返回
		if(!obj.isConnected()) return -1;//没连接返回-1
		var rs = db.db_executeQuery(s);
		if(isOrg) return rs;
		if(rs.length==0) return []
		var r = [];
		for(var i=1;i<rs.length;i++){
			var cols = {};
			for(var j=0;j<rs[i].length;j++){
				cols[rs[0][j]] = rs[i][j];
			}						
			r.push(cols);
		}
		return r;
	};
	
	//增删改，可以传string和数组，string则不使用批处理，数组则使用
	/*
	 * 插入数据：
		INSERT INTO [表名] (字段1,字段2) VALUES (100,\'51WINDOWS.NET\')
		删除数据：
		DELETE FROM [表名] WHERE [字段名]>100
		更新数据：
		UPDATE [表名] SET [字段1] = 200,[字段2] = \'51WINDOWS.NET\' WHERE [字段三] = \'HAIWA\'
	 */
	obj.update = function(s){//支持string和数组传参
		if(!obj.isConnected()) return -1;	//没连接返回-1
		
		if((typeof s)=="string"){
			return db.db_executeUpdate(s);
		}
		var rs;
		rs = [];
		for(var i=0;i<s.length;i++){
			rs.push(db.db_executeUpdate(s[i]));
		}

		return rs;
	};
		
	//事务处理update
	obj.execute = function(){//支持数组或者多个string型参数
		if(!obj.isConnected()) return -1;	//没连接返回-1
		var rs;
		db.db_beginTransaction();
		for(var i=0;i<arguments.length;i++){
			if((typeof arguments[i])=="string"){
				db.db_executeUpdate(arguments[i]);
				continue;
			}			
			for(var j=0;j<arguments[i].length;j++){	
				db.db_executeUpdate(arguments[i][j]);
			}
		}
		rs = db.db_commitTransaction();			
		return rs;
	};
		
	//关闭数据库
	obj.close = function(){
		if(isConnected&&!isAppDb) db.db_close();
		isConnected = false;
	};
		
	//表格是否存在
	obj.isTable = function(t){
		if(!obj.isConnected()) return -1;	
		return  db.db_isTableExist(t);			
	};
		
	//设置数据库密码，不填或者值为""则无密码
	obj.setKey = function(n){
		if(!obj.isConnected()) return -1;	
		db.db_rekey(n|"");
	};
		
	//设置数据库操作超时时间
	obj.setTimeOut = function(t){
		if(!obj.isConnected()) return -1;	
		db.db_setTimeOut(t);
	};
		
	obj.open(dataName,isCreate,path,key);//默认打开数据库
		
	return obj;
}
	