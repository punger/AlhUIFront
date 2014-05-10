/**
 * Created by paul on 4/12/2014.
 */

function ExchangeJQ(g, parent, cb) {
    var csjq;
    var setup = function(cbo) {
        csjq = new CardsetJQ(g.exchange, parent, 'xchg', cbo);
    };
    setup(cb);
    return {
        "show": function() {
            return csjq.show();
        },
        "reset": function(cb) {
            csjq.reset(g.exchange, cb);
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