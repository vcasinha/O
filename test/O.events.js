(function(){
    var EventManager = function(){
        var channels = {};
        
        this.resetSubscriptions = function(){
            channels = {};
        };

        this.on = function(channel, callback, context){
            if(channels[channel] === undefined){
                channels[channel] = [];
            }
            
            var subscriber = callback.bind(context);

            channels[channel].push(subscriber);
            return this;
        };
        
        this.once = function(channel, callback){
            if(channels[channel] === undefined){
                channels[channel] = [];
            }
            
            var subscriber = function(){
                callback.call({});
                this.off(subscriber)
            }.bind(this);

            channels[channel].push(subscriber);
            return this;
        };
        
        this.off = function(channel_name, callback){
            var ix = channels[channel_name].indexOf(callback);
            if(ix >= 0){
                channels[channel_name].splice(ix, 1);
            }
            
            return this;
        };
        
        this.trigger = function(channel_name, args){
            //console.log("event.trigger", channel_name);
            var channel = channels[channel_name];
            if(channel !== undefined){
                for(var i in channel){
                    var subscriber = channel[i];
                    subscriber.apply(subscriber, args);
                }
            }
        }   
    };

    O.register('o.events', EventManager);
})();