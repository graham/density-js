var Density = (function() {
    var DensityResponse = function(api, response_obj) {
        this.api = api;
        this.response_obj = response_obj;
        this.content = null;
    };

    DensityResponse.prototype.done = function(callback) {
        var _this = this;
        this.response_obj.done(function(thedata) {
            this.content = thedata;
            callback(_this, thedata);
        });
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
        this.server = 'https://sandbox.density.io';
        this.api_token = options['token'] || '86f319e3c566f2db32d77f00f89dc1f4fe91926d';
    };

    DensityAPI.prototype._fetch_url = function(url, data) {
        var target_url = this.server + url;

        if (url.slice(7) == 'http://') {
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

    return {'DensityAPI':DensityAPI};
})();
