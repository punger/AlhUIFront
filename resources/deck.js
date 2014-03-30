/**
 * Created by paul on 3/18/14.
 */

function Deck() {

    var getCard = function (cb) {
        $.getJSON("deal", function(resp) {
            var card = new Card(resp.id, resp.value, resp.color);
            cb(card);
        });
    }
    return {
        deal: function(cb) {
            return getCard(cb);
        }
    }
}