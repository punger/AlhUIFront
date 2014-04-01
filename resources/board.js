/**
 * Created by paul on 3/19/14.
 */

function Board (pcolor) {
    var mycolor = pcolor;
    var board = [];
    var garden;
    $.getJSON("garden", function(g) {
        garden = new Tile(g);
        board[[0,0]] = garden;
    });

    return {
        get color() { return mycolor; },
        "getpossible": function(tile, cb) {
            $.getJSON("", {
                "tile": tile
            }, function(listofloc) {
                cb(listofloc);
            });
        }

    }
}