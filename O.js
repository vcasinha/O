/*! O v0.1 | (c) 2015 Vladimiro Casinha | miro.oorganica.com */
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
            throw "(O.instance) " + name + " is not loaded";
        }

        //Handle arguments as an ARRAY or load all arguments
        if(args === undefined || args.constructor !== Array){
           args = Array.prototype.slice.call(arguments);
           args.shift();
        }

        //console.log("instance", name);

        return new (function(f, args) {
            var params = [f].concat(args);
            return f.bind.apply(f, params);
        }(Constructor, args));
    };

    O.prototype.register = function(name, Constructor){
        //console.log('o.register', name);
        if(typeof Constructor !== 'function'){
            throw('Invalid constructor');
        }

        
        Constructor.prototype  = Constructor.prototype || {};
        Constructor.prototype.__name__ = Constructor.__name__ || name;
        Constructor.prototype.constructor = Constructor;
        Constructor.prototype.__classes__  = Constructor.prototype.classes || [];

        delete Constructor.prototype.classes;

        var classes = Constructor.prototype.__classes__;
        
        //console.dir(Constructor);

        //console.log("o.createClass", Constructor, prototype, classes);
        var VanillaConstructor = Constructor;

        Constructor = function(){
            var args = arguments;

            //console.log(Constructor.prototype.__name__ + '.Construct', this.__classes__);
            //console.log("VanillaConstructor.construct", args);
            classes.forEach(function(parent_name){
                var Parent;
                if(typeof Parent === "function"){
                    //Get parent Class
                    Parent = parent_name;
                }
                else{
                    Parent = O.get(parent_name);
                }

                Parent.apply(this, args);
            }.bind(this));

            VanillaConstructor.apply(this, args);
        };

        //Attach parent prototype
        var parent_prototype = {};
        //console.log('o.register', name, classes);
        if(classes[0]){
            var Parent = classes[0];

            //console.log("parent", Parent, Constructor);
            if(typeof Parent === "string"){
                var obj = O.get(Parent);
                if(obj === undefined){
                    throw "unknown object '" + Parent + "'";
                }
                Parent = obj;
            }
            
            //console.log("parent", Parent, Constructor);
            parent_prototype = Object.create(Parent.prototype);
        }
        //console.log("O.createClass", Constructor.__name__);
        Constructor.prototype = this.extend({}, parent_prototype, VanillaConstructor.prototype);

        //Register within O
        this.set(name, Constructor);
        
        return this;
        
    };

    O.prototype.createClass = function(Constructor){

        

        return Constructor;
    };

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