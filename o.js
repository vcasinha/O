(function(window){
	var O = function(items){
		this.copy(items, this.items);
	};
	
	O.prototype.createClass = function(Constructor, prototype, mixins){
		if(typeof mixins === 'function' || typeof mixins === 'string'){
			mixins = [mixins];
		}
		else if(mixins === undefined){
			mixins = [];
		}

		if(prototype === undefined){
			prototype = {};
		}

		if(Constructor === null){
			Constructor = function(){};
		}

		//console.log("CreateClass", mixins, typeof mixins);

		var VanillaConstructor = function(){
			var args = arguments;
			this.__classes = [];
			//console.log("VanillaConstructor.construct", args);
			var that = this;
			mixins.forEach(function(Parent){
				this.__classes.push(Parent);
				if(typeof Parent === "string"){
					Parent = O.get(Parent);
				}
				//console.log("VanillaConstructor.construct.extend", Parent, args);
				Parent.apply(that, args);
			}.bind(this));

			Constructor.apply(that, args);
		};

		var parent_prototype = {};

		prototype.constructor = Constructor;
		if(mixins.length > 0){
			var Parent = mixins[0];

			//console.log("parent", Parent, Constructor);
			if(typeof Parent === "string"){
				p = O.get(Parent);
				if(p === undefined){
					throw "undefined parent";
				}
				
				Parent = p;
			}
			//console.log("parent", Parent, Constructor);
			parent_prototype = Object.create(Parent.prototype);
		}
		
		VanillaConstructor.prototype = $.extend({}, prototype, parent_prototype);

		return VanillaConstructor;
	}

	O.prototype.extend = function(){
		$.extend.apply($, arguments);		
		return this;
	};
	
	O.prototype.clone = function(obj){
	    if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
	}
	
	O.prototype.copy = function(obj, copy){
	    if (null == obj || "object" != typeof obj) return obj;
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return this;
	}
	
	O.prototype.fill = function(items){
		this.copy(items, this.__items);
	}
	
	O.prototype.set = function(index, item){
		//console.log('oo.set', index, item);
		this.__items[index] = item;
		return this;
	};
	
	O.prototype.get = function(index, def){
		var value = def;
		
		if(this.__items[index] !== undefined){
			value = this.__items[index];
		}
		
		//console.log('oo.get', index, value);
		return value;
	};
	
	O.prototype.dump = function(){
		return this.__items;
	}
	
	O.prototype.forEach = function(callback){
		for(var i = 0;i < this.__items.length;i++){
			callback(this.__items[i], i);
		}
		
		return this;
	}
	
	O.prototype.__items = {};
	
	O.prototype.constructor = O;
	
	(new O()).extend(O, new O());
	
	window.OO = O;
	window.Oo = O;
	window.O = O;
	window.Oo.set('oo', O);
})(window);