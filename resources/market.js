/**
 * Created by paul on 4/1/2014.
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
        /**
         *
         * @param payment
         * @param slot
         * @return true if the payment is an exact payment for the tile
         */
        "isExact": function(payment, slot) {

        },
        /**
         * Buy a tile.
         * <p/>
         * Note that this only updates the market, not the player
         * @param price array of cards
         * @param slot market color
         * @returns a market tile
         */
        "buy":
            function( price, slot) {
            $.getJSON("", {
                "paySet": price,
                "slot": slot
            }, function(tile) {

            });
        }

    };
}