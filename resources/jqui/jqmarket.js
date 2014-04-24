/**
 * Created by paul on 4/11/2014.
 */

function MarketJQ(g, parent, cb) {
    var game = g;
//    var pDiv = parent;
    var $me = $(parent);
    var TILEWID = 264;
    var TILEHGT = 264;
    var SELDELTAX = 8;
    var SELDELTAY = 8;
    var MARKETWID = 1415;
    var MARKETHGT = 945;
    var tileLocs = {
        "yellow":   [305, 85, 585, 365],
        "green":    [1055, 85, 1335, 365],
        "blue":     [90, 575, 370, 855],
        "orange":   [840, 575, 1120, 855]
    };

    $me.load("resources/htmlfrag/market.html", function() {
        if (cb) cb();
    });

    var shifter = new Selectable(".marketTile", SELDELTAX, SELDELTAY);

    return {
        "show": function() {
            shifter.clear();
            var slots = game.market.m;
            var h =  $me.height();
            var w = $me.width();
//            var $mktDiv = $me.find("#marketDiv");
//            $mktDiv.css('background-size', "100% 100%");
//            $mktDiv.css('background', "url(resources/images/Market.png)");
//            background: url("../images/Market.png") no-repeat;

            var vScale = h / MARKETHGT;
            var hScale = w / MARKETWID;
            console.log("h="+h+", w="+w+", hS="+hScale+", vS="+vScale);

            $.each(slots, function(slot, tile) {
                var $curTile = $me.find("#market-tile-"+slot);
                $curTile.height(TILEWID * vScale);
                $curTile.width(TILEHGT * hScale);
                var lft = tileLocs[slot][0] * hScale;
                var tp = tileLocs[slot][1] * vScale;
                console.log(slot+" ("+tile.id+"): left="+lft+", top="+tp);
                $curTile.css("left", lft);
                $curTile.css("top", tp);
//                $curTile.removeClass("gamepiece-selected");
//                $curTile.addClass("gamepiece-unselected");
                $curTile.find('img').attr("src", tile.img);
            });
        },
        get selectedId() {
            var items = shifter.item;
            if (items === null || items.length == 0) return null;
            for (tid in items)
                if (items.hasOwnProperty(tid)) return tid;
            return null;
        },
        get selected() {
            var s = this.selectedId;
            if (!s) return null;
            return s.substr(this.selectedId.lastIndexOf("-") + 1);
        },
        "remove": function(slot) {

        }
    };
}