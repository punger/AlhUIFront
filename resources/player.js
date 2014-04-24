/**
 * Created by paul on 3/30/2014.
 */

function Player(pcolor, g, cb) {
    var game = g;
    var mycolor = pcolor;
    var hand;
    var reserve = [];
    var tempTiles = [];
    var board;

    var resetHand = function(cb0) {
        $.getJSON("playerhand", {
            player: mycolor
        }, function(h) {
            hand = new Cardset();
            console.log("player hand for player "+mycolor+" is "+JSON.stringify(h));
            $.each(h, function(i, c) {
                var cd = new Card(c);
                hand.add(cd);
            });
            if (cb0) cb0(null, hand);
        });
    };

    async.parallel({
        "board": function(cb1) {
            board = new Board(mycolor, cb1);
        },
        "hand":  function(cb1) {
            resetHand(cb1);
        }
    },
    function (err, res) {
        if (cb) cb(err, res);
    });


    return {
        get hand () { return hand; },
        get color() { return mycolor; },
        get board() { return board; },
        get reserve() { return reserve; },
        get reserveAsTileset() { return { "tiles": reserve}; },
        "startturn": function() {},
        "addtile": function(tile, position, cb) {
            $.get("")
        },
        "addtoreserve": function(tile) {
            reserve.push(tile);
        },
        "addcards": function(cards) {
            hand.add(cards);
        },
        "place": function(tile, position) {

        },
        "buy": function() {

        },
        "resetHand": function(cb) {
            resetHand(cb);
        }
    };
}