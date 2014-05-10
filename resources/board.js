/**
 * Created by paul on 3/19/14.
 */

function Board (pcolor, cb) {
    var mycolor = pcolor;
    var board;
    var garden;

    var refreshBrd =  function(cb0) {
        $.getJSON("playerboard", {
                player: mycolor
            },
        function(bin) {
            console.log("Board for player "+mycolor+" is "+
                JSON.stringify(bin,null,2));
            board = bin;
            if (cb0)
                cb0(null, board);
        });
    };
    refreshBrd(cb);

    return {
        "refresh": function (cb) {
            refreshBrd(cb);
        },
        get color() { return mycolor; },
        get minX() { return board.minX; },
        get minY() { return board.minY; },
        get maxX() { return board.maxX; },
        get maxY() { return board.maxY; },
        get mat() { return board.board; },
        /**
         * Get a list of possible locations to place the specified tile
         * @param tile tile id
         * @param cb callback to send the locations to
         */
        "getpossible": function(tile, cb) {
            $.getJSON("possibleLocations", {
                "tile": tile
            }, function(listofloc) {
                cb(null, listofloc);
            });
        }
    };
}