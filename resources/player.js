/**
 * Created by paul on 3/30/2014.
 */

function Player(pcolor, g) {
    var game = g;
    var mycolor = pcolor;
    var hand;
    var board = new Board(mycolor);

    $.getJSON("playerhand", {
        player: mycolor
    }, function(h) {
        hand = [];
        alert("player hand"+JSON.stringify(h));
        $.each(h, function(i, c) {
            var cd = new Card(c);
            hand.push(cd);
        });
    });
    return {
        "sethand": function (h) {
            hand = h;
        },
        "gethand": function () {
            return hand;
        },
        "addtile": function(tile, position, cb) {
            $.get("")
        },
        "addtoreserve": function(tile) {

        },
        "getcolor": function() { return mycolor; },
        "addcards": function(cards) {
            if (cards instanceof Card) {
                hand.push(cards);
                $.get("")
            }
        }
    }
}