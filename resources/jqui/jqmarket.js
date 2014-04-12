/**
 * Created by paul on 4/11/2014.
 */

function MarketJQ(g, parent, cb) {
    var game = g;
    var pDiv = parent;
    var $me = $(parent);
    var curTileSelected = null;
    var tileLocs = {
        "yellow":   [305, 85, 585, 365],
        "green":    [1055, 85, 1335, 365],
        "blue":     [90, 575, 370, 855],
        "orange":   [840, 575, 1120, 855]
    };


    $me.load("resources/htmlfrag/market.html", function() {
        if (cb) cb();
    });
    $(document).on('click', ".marketTile", function(evt) {
        var $this = $(this);
        var id = $this.attr('id');
        if (id === curTileSelected) curTileSelected = null;
        else {
            $("#"+curTileSelected).toggleClass("gamepiece-selected gamepiece-unselected");
            curTileSelected = id;
        }
        $("#"+id).toggleClass("gamepiece-selected gamepiece-unselected");
    });

    return {
        "show": function() {
            var slots = g.getmarket().m;
            var h =  $me.height();
            var v = $me.width();
            var hScale = $me.height() / 945;
            var vScale = $me.width() / 1415;

            $.each(slots, function(slot, tile) {
                var $curTile = $me.find("#market-tile-"+slot);
                $curTile.height(280 * hScale);
                $curTile.width(280 *vScale);
                $curTile.css("left", tileLocs[slot][0] * hScale);
                $curTile.css("top", tileLocs[slot][1] * vScale);
                $curTile.removeClass("gamepiece-selected");
                $curTile.addClass("gamepiece-unselected");
                $curTile.find('img').attr("src", tile.img);
            });
        },
        get selected() {
            return curTileSelected;
        },
        "remove": function(slot) {

        }
    };
}