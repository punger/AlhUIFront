/**
 * Created by paul on 3/30/2014.
 *
 * This class directly manages its reserve tileSet.  It can add cards and
 * reset the hand.  Since the hand is actually just a cardSet, it doesn't
 * refresh itself from the server.  The board manages its own state with
 * the server.
 */

function Player(pcolor, g, cb) {
    var game = g;
    var mycolor = pcolor;
    var hand;
    var reserve = [];
    var temp = [];
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
        "addToReserve": function(tile) {
            reserve.push(tile);
        },
        "removeFromReserve": function(tile) {
            if (!reserve) return reserve;
            for (var i = 0; i < reserve.length; i++) {
                if (reserve[i].id === tile.id) {
                    console.log("Removing tile "+tile.id+" from reserve at index "+i);
                    reserve.splice(i,1);
                    break;
                }
            }
            return reserve;
        },
        get temp() { return temp; },
        get tempAsTileset() { return { "tiles": temp}; },
        "addToTemp": function(tile) {
            temp.push(tile);
        },
        "removeFromTemp": function(tile) {
            if (temp) {
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].id === tile.id) {
                        console.log("Removing tile "+tile.id+" from temp at index "+i);
                        temp.splice(i,1);
                        break;
                    }
                }
            }
            return temp;
        },
        "addcards": function(cards) {
            hand.add(cards);
        },
        "resetHand": function(cb) {
            resetHand(cb);
        },
        "refresh": function(cb) {
            async.parallel({
                "hand": resetHand,
                "board": board.refresh
            },
            function(err, res){
                console.log ("player "+mycolor+" refresh all returned "+JSON.stringify(res, null, 2));
                if (cb) cb(err, res);
            });
        }
    };
}