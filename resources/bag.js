/**
 * Created by paul on 3/19/14.
 */

function Bag() {
    return {
        getTile: function (cb) {
            $.getJSON("nextile", function (resp) {
                cb(resp);
            });

        },
        getGarden: function (cb) {
            $.getJSON("garden", function (resp) {
                cb(resp);
            });
        }
    }
}