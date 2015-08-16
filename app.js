var api = null;
var locations = {};
var env = null;

$(document).ready(function() {
    Chart.defaults.global['animation'] = false;
    Chart.defaults.global['showScale'] = false;
    
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
    env.create_template('business_card', $("#business_show_card_2").text());
    
    $("#home").html("Ready!");
});

var update_list = function() {
    $("#list").html('');
    for(var key in locations) {
        var obj = locations[key];
        
        var d = document.createElement('div');
        d.innerHTML = env.get_template('business_card').render({'obj':obj});
        
        $("#list").append(d);

        (function(obj, d) {
            api.events(obj.id, {'start_time':'2015-05-23T10:10:00'}).done(function(api, result_data) {
                var ctx = $(d).find('canvas').get(0).getContext("2d");
                // This will get the first returned node in the jQuery collection.
                var myNewChart = new Chart(ctx);
                
                var the_data = [];
                var the_labels = [];
                
                for(var i = 0; i < 10; i++) {
                    var inside_obj = result_data.results[i];
                    the_data.push(inside_obj.current_count);
                    the_labels.push("");
                }
                
                console.log(the_data);
                console.log(the_labels);
                
                var data = {
                    labels: the_labels,
                    datasets: [
                        {
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: the_data
                        }
                    ]
                };

                var options = {
                    scaleOverride: true,
                    scaleSteps: 20,
                    scaleStepWidth: 1,
                    scaleStartValue: 0
                };
                
                var myLineChart = new Chart(ctx).Line(data, options);
            });
        })(obj, d);
    }
};

var onclick = function() {
    
};
