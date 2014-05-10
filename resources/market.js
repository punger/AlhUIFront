/**
 * Created by paul on 4/1/2014.
 *
 * Maintains current state for the market against the server
 */

function Market() {
    var slotMap = ["blue", "yellow", "orange", "green"];
    var m;
    var refreshMkt =  function(cb) {
        $.getJSON("currentmarket", function(min) {
            m = {};
            for (var i = 0; i < slotMap.length; i++) {
                var slot = slotMap[i];
                m[slot] = new Tile(min[slot]);
            }
            if (cb)
                cb(null, m);
        });
    };
    return {
        "refresh": function (cb) {
            refreshMkt(cb);
        },
        "getatslot": function(slot) {
            return m[slot];
        },
        get m() { return m; },
//        "buy": function( ) { alert("Error: Market.buy should not be called");}

    };
}