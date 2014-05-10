/**
 * Created by paul on 3/18/14.
 *
 * Wraps a cardSet.  Refreshes itself from server state.
 */

function Exchange() {
    var xchg = new Cardset();
    var refresh = function (cb) {
        $.getJSON("exchange", function(x) {
            xchg = new Cardset();
            console.log("exchange "+JSON.stringify(x));
            $.each(x, function(i, c) {
                var cd = new Card(c);
                xchg.add(cd);
            });
            if (cb)
                cb(null, xchg);
        });
    };
    return {
        "fill": function(cb) {
            refresh(cb);
        },
//        "select": function(index) {
//            xchg.select(index);
//        },
//        "take": function() {
//            if (!selectMap ) return;
//            var claim = this.selected();
//            if (claim.length > 1) {
//                var sum = 0;
//                for (var i = o; i < claim.length; i++) {
//                    sum += claim[i].value;
//                }
//                if (sum > 5) {
//                    alert("Selected too many cards ");
//                    return;
//                }
//            }
//            $.getJSON("takecards", {
//                "cards": claim
//            }, function(resp) {
//
//            });
//        },
        get cards() { return xchg.cards; }
//        ,
//        get selected() { return xchg.selected(); },
//        get selmap() { return xchg.selmap;},
//        "isselected": function(slot) { return xchg.isselected(slot); }
    };
}