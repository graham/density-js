var api = null;
var locations = {};
var env = null;

$(document).ready(function() {
    api = new Density();
    
    console.log("lets start by listing the locations.")
    api.locations().done(function(request) {
        for(var i = 0; i < request.content.length; i++) {
            var obj = request.content[i];
            locations[obj.name] = obj;
        }
        
        update_list();
    });

    env = genie.main_environment;
    env.create_template('business_card', document.getElementById('business_show_card_2').innerText);
    
    $("#home").html("Ready!");
});

var update_list = function() {
    $("#list").html('');
    for(var key in locations) {
        var obj = locations[key];
        
        var d = document.createElement('div');
        d.innerHTML = env.get_template('business_card').render({'obj':obj});
        
        $("#list").append(d);
    }
};
