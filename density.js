var Density = (function() {
    var DensityResponse = function(api, response_obj) {
        this.api = api;
        this.response_obj = response_obj;
        this.content = null;
    };

    DensityResponse.prototype.done = function(callback) {
        var _this = this;
        this.response_obj.done(function(thedata) {
            _this.content = thedata;
            callback(_this, thedata);
        });
        return this;
    };

    DensityResponse.prototype.next = function() {
        if (this.content) {
            return this.api._fetch_url(this.content.next);
        } else {
            return null;
        }
    };

    DensityResponse.prototype.previous = function() {
        if (this.content) {
            return this.api._fetch_url(this.content.previous);
        } else {
            return null;
        }
    };

    var DensityAPI = function(options) {
        if (options == undefined) {
            options = {};
        }
        this.server = 'https://sandbox.density.io';
        this.api_token = options['token'] || '86f319e3c566f2db32d77f00f89dc1f4fe91926d';
    };

    DensityAPI.prototype._fetch_url = function(url, data) {
        var target_url = this.server + url;

        if (url.slice(4) == 'http') {
            target_url = url;
        }

        var auth_string = "Token " + this.api_token;
        
        return new DensityResponse(this, $.ajax({
            type: "GET",
            url: target_url,
            headers: { "Authorization": auth_string },
            dataType: "json",
            data:data
        }));
    };

    DensityAPI.prototype.location = function(location_id, options) {
        return this._fetch_url('/v1/locations/' + location_id, options);
    };

    DensityAPI.prototype.locations = function() {
        return this._fetch_url('/v1/locations/', {});
    };

    DensityAPI.prototype.count = function(location_id, options) {
        return this._fetch_url('/v1/locations/' + location_id + '/count/', options);
    };

    DensityAPI.prototype.events = function(location_id, options) {
        return this._fetch_url('/v1/locations/' + location_id + '/events/', options);
    };

    /* Lets make things easier. */

    var LocationProxy = function(location_id, api) {
        this.location_id = location_id;
        this.api = api;
        
        this.data = {};
        this.data.count = 0;
        this.data.meta = {};
        this.data.events = {};

        this.listeners = [];
    };

    LocationProxy.prototype.on_update = function(cb) {
        this.listeners.push(cb);
    };

    LocationProxy.prototype.fire_update = function() {
        var new_listeners = [];
        
        for(var i = 0; i < this.listeners.length; i++) {
            cb = this.listeners[i];

            // If the result evals to true, lets keep it around.
            var result = null;

            try {
                result = cb(this);
            } catch (e) {
                result = false;
            }

            if (result) {
                new_listeners.push(cb);
            }
        }

        // replace old listener list with new one.
        this.listeners = new_listeners
    };

    // This should be replaced with some sort of poll/webhook at some point.
    LocationProxy.prototype.update = function() {
        var _this = this;
        this.api.count(this.location_id, {}).done(function(response_obj, data) {
            if (_this.data.count == data.count) {
                // no change so lets not do anything.
            } else {
                _this.data.count = data.count;
                _this.fire_update();
            }
        });
    }

    return {
        'DensityAPI':DensityAPI,
        'LocationProxy':LocationProxy
    };
})();
