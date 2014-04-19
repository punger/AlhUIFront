/**
 * Created by paul on 4/14/2014.
 */

function HandJQ(player, parent, cb) {
    var p = player;

    var csjq = new CardsetJQ(p.hand, parent, 'card-'+ p.color, cb);
    return {
        "show": function() {
            return csjq.show();
        },
        "reset": function(cb) {
            csjq.reset(p.hand, cb);
        },
        get selectedCards() {
            return csjq.selectedCards();
        }
    };
}