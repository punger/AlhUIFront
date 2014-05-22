/**
 * Created by paul on 4/16/2014.
 */

/**
 * Set up all the available actions
 * @param {object} player
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
            {"b": "fromReserve", "d":"Move to Board"},
            {"b": "forceEndTurn", "d":"Force end turn", "noDisplay": true}
        ],
        "color": player.color
    };

    var actionDirective = {
        ".actionset": {
            "btn<-buttons": {
                "button": "btn.d",
                "button@class+": function() {
                    var c = " action-"+this.b;
                    if (this.noDisplay)
                        c += " action-hidden";
                    return c;
                },
                "button@id": function() {
                    return "actionid-"+player.color+"-"+this.b;
                }
            }
        },
        ".playername": "color",
        ".playermeeple@style+": "; background: #{color}"
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

    return {
        "hasTemps": function(yesno) {
            $me = $(parent);
            if (yesno) {
                $me.find(".action-forceEndTurn").removeClass("action-hidden");
            } else {
                $me.find(".action-forceEndTurn").addClass("action-hidden");
            }
        },
        "reset": function(cb) {
            $me = $(parent);
            this.hasTemps(player.temp && player.temp.length > 0);
            $me.find(".playerturns").text(player.numTurns);
            if (player.hasActions) {
                $me.find(".playerhasactions").show();
            } else {
                $me.find(".playerhasactions").hide();
            }
            cb();
        },
        get target() {
            return {
                "temp": player.temp
            }
        }
    }

}