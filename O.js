(function(window){
	var O = function(items){
		this.__items = {};
		this.__onloadCallbacks = [];
		//this.extend(this.__items, items);
        //window.onload = this.__onloadCallback.bind(this);
	};
	
    O.prototype.__onloadCallback = function(){
        this.__onloadCallbacks.forEach(function(callback){
            callback();
        });
    };

    O.prototype.ready = function(callback){
        this.__onloadCallbacks.push(callback);
    };

    O.prototype.instance = function(name, args){
    	var Constructor = this.get(name);
    	if(typeof Constructor !== 'function'){
    		throw name + " is not a valid Constructor";
    	}
    	if(args.constructor !== Array){
    		var args = Array.prototype.slice.call(arguments);
    		args.shift();
    	}
    	//console.log("instance", Constructor);
		var wrapper = function(f, args) {
		    var params = [f].concat(args);
		    return f.bind.apply(f, params);
		};

    	return new (wrapper(Constructor, args));
    	//return new (Constructor.apply({}, args));
    	//return new Constructor(args[0]);
    };

    O.prototype.register = function(name, Constructor){
        this.set(name, this.createClass(Constructor, Constructor.prototype, Constructor.prototype.classes));
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
			//console.log("VanillaConstructor.construct", args);
			mixins.forEach(function(Parent){
				if(typeof Parent === "string"){
					Parent = O.get(Parent);
				}
				//console.log("VanillaConstructor.construct.extend", Parent, args);
				Parent.apply(this, args);
			}.bind(this));

			Constructor.apply(this, args);
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
		
		VanillaConstructor.prototype = this.extend({}, prototype, parent_prototype);

		return VanillaConstructor;
	}

	O.prototype.extend = function(){
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && typeof target !== 'function' ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( typeof copy === 'object' || (copyIsArray = copy.constructor === Array) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && src.constructor === Array ? src : [];

						} else {
							clone = src && typeof src === 'object' ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = this.extend(deep, clone, copy);
					// Don't bring in undefined values
					}
					else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	O.prototype.instanceOf = function(name){
		return name in this.__proto__;
	};

	O.prototype.clone = function(obj, copy){
		if (null == obj || "object" != typeof obj) return copy;
		for (var attr in obj){
			if (obj.hasOwnProperty(attr)){
				copy[attr] = obj[attr];
			}
		}

		return copy;
	};

	O.prototype.fill = function(items){
		if(typeof items.instanceOf === 'function'){
			items = items.dump();

		}
		console.log("fill", items);
		this.extend(this.__items, items);
	};
	
	O.prototype.set = function(index, item){
		//console.log('oo.set', index, item, this);
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
	
	O.prototype.constructor = O;

    var OO = new O();
    OO.extend(O, OO).set('o', O);

	window.O = O;
})(window);