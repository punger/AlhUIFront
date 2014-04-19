/**
 * Created by paul on 4/16/2014.
 */

/**
 * Set up all the available actions
 * @param {string} player color
 * @param {string} parent selector
 * @param cb for completion
 * @constructor
 */
function ActionJQ(player, parent, cb) {
    var $me = $(parent);
    var buttonDescriptors = {
        "buttons": [
            {"b": "take", "d":"Take"},
            {"b": "buy", "d":"Buy"},
            {"b": "toReserve", "d":"Move to Reserve"},
            {"b": "fromReserve", "d":"Move to Board"}
        ]
    };

    var actionDirective = {
        ".actionset": {
            "btn<-buttons": {
                "button": "btn.d",
                "button@class+": " action-#{btn.b}",
                "button@id": function() {
                    return "actionid-"+player+"-"+this.b;
                }
            }
        }
    };
    $me.load("resources/htmlfrag/playeractions.html",
        function( response, status, xhr ) {
            if ( status === "error" ) {
                cb("Failure loading player actions " + xhr.status + " " + xhr.statusText);
            } else {
                $me.render(buttonDescriptors, actionDirective);
                cb();
            }
        }
    );

}