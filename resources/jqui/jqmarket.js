/**
 * Created by paul on 4/11/2014.
 */

function MarketJQ(g, parent, cb) {
    var game = g;
//    var pDiv = parent;
    var $me = $(parent);
    var tileLocs = {
        "yellow":   [305, 85, 585, 365],
        "green":    [1055, 85, 1335, 365],
        "blue":     [90, 575, 370, 855],
        "orange":   [840, 575, 1120, 855]
    };

    $me.load("resources/htmlfrag/market.html", function() {
        if (cb) cb();
    });

    var shifter = new Selectable(".marketTile", 8, 8);

    return {
        "show": function() {
            var slots = game.market.m;
            var h =  $me.height();
            var w = $me.width();
//            var $mktDiv = $me.find("#marketDiv");
//            $mktDiv.css('background-size', "100% 100%");
//            $mktDiv.css('background', "url(resources/images/Market.png)");
//            background: url("../images/Market.png") no-repeat;

            var vScale = h / 945;
            var hScale = w / 1415;
            console.log("h="+h+", w="+w+", hS="+hScale+", vS="+vScale);

            $.each(slots, function(slot, tile) {
                var $curTile = $me.find("#market-tile-"+slot);
                $curTile.height(264 * vScale);
                $curTile.width(264 * hScale);
                var lft = tileLocs[slot][0] * hScale;
                var tp = tileLocs[slot][1] * vScale;
                console.log(slot+" ("+tile.id+"): left="+lft+", top="+tp);
                $curTile.css("left", lft);
                $curTile.css("top", tp);
                $curTile.removeClass("gamepiece-selected");
                $curTile.addClass("gamepiece-unselected");
                $curTile.find('img').attr("src", tile.img);
            });
        },
        get selectedId() {
            var items = shifter.item;
            if (items === null || items.length == 0) return null;
            return items[0];
        },
        get selected() {
            return this.selectedId.substr(this.selectedId.lastIndexOf("-") + 1);
        },
        "remove": function(slot) {

        }
    };
}