/**
 * Created by paul on 3/30/2014.
 */

function Game(plin, startplayer) {
    var players = plin;
    var curplayer = startplayer;
    var roster = [];
    var xchg;
    $.each(players, function(i, p) {
        roster[p] = new Player(p, this);
    });
    $.getJSON("exchange", function(x) {
        xchg = [];
        alert("exchange "+JSON.stringify(x));
        $.each(x, function(i, c) {
            var cd = new Card(c);
            xchg.push(cd);
        });
    });


    return {
        "getplayer": function (p) {
            return roster[p];
        },
        "getexchange": function() {
            return xchg;
        },
        "getcurplayer": function () {
            return curplayer;
        }
    }
}