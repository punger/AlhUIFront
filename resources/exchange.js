/**
 * Created by paul on 3/18/14.
 */

function Exchange() {
    var d = new Deck();
    var NUMSLOTS = 4;
    var slots = new Array(NUMSLOTS);
//    var slotMap = new Array("blue", "yellow", "orange", "green");
    return {
        fill: function() {
            for (var i = 0; i < NUMSLOTS; i++) {
                if (typeof slots[i] === "undefined") {
                    d.deal(function (card) {
                        slots[i] = card;
                    });
                }
            }

        },
        take: function(slot) {
            if (slot === null) return;
            if (typeof slot === "undefined") {
                return;
            } else if (typeof slot === "string") {

            } else if (typeof slot === "number") {

            } else {

            }

        },
        cards: function () { return slots; }
    }
}