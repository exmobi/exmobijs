var JSON = JSON||{};
if(!JSON.stringify){
	JSON.stringify = function(o){
		var r = [];   
		if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";   
		if(typeof o =="undefined") return "";
		if(typeof o != "object") return o.toString();
		if(o===null) return null;
		if(o instanceof Array){
			for(var i =0;i<o.length;i++){
				r.push(this.stringify(o[i]));
		    }
		    r="["+r.join()+"]"; 
		}else{              
			for(var i in o){
				r.push('"'+i+'":'+this.stringify(o[i]));
		    }
		    r="{"+r.join()+"}";
		}   
		return r; 
	};
}
	
if(!JSON.parse){
    JSON.parse = function(str){
    	try{
    		return eval('('+str+')');
    	}catch(e){
    		return null;
    	}
    };
}