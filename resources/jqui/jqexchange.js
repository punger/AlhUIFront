/**
 * Created by paul on 4/12/2014.
 */

function ExchangeJQ(g, parent, cb) {
    var csjq;
    var reset = function(cbo) {
        csjq = new CardsetJQ(g.exchange, parent, 'xchg', cbo);
    };
    reset(cb);
    return {
        "show": function() {
            return csjq.show();
        },
        "reset": function(cs, cb) {
            csjq.reset(cs, cb);
        },
        /**
         *
         * @returns {*} an array of selected cards
         */
        get selectedCards() {
            return csjq.selectedCards;
        }
    };
}