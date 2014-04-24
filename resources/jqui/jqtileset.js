/**
 * Created by paul on 4/19/2014.
 */


function TilesetJQ(ts, parent, idClass, cb) {
    var tileset = ts;
    var p = parent;
    var $me;
    var TILEWID = 264;
    var TILEHGT = 264;
    var SELDELTA = 20;
    var BUFFER = 8;

    var shifter = new Selectable('.'+idClass+'Tile', 0, -SELDELTA);


    var reset = function(cbo) {
        shifter.clear();
        if ($me)
            $me.empty();
        $me = $(p);
        $me.load("resources/htmlfrag/tileset-template.html", function() {
            $me.find('.tileDiv').attr('id',idClass+"Div");
            $me.find('.tile').addClass(idClass+'Tile');
            if (cbo) cbo();
        });
    };
    reset(cb);

    return {
        "show": function() {
            var tiles = tileset.tiles;
            var numtiles = tiles.length;
            var h = $me.height();
            var w = $me.width();

            /*
             * Standard layout is at original height and width with 8 pixel
             * spacing between tiles.  If the height is inadequate, get a
             * scale that makes the height fit with spacing.  Look at the
             * width scaled with the same scale (to maintain aspect ratio)
             * and see if the tiles fit all in a row with spacing.  If not,
             * then determine how far apart each tile should be from its
             * sibling, permitting overlap.
             */
            var vScale = 1;
            if (h < (TILEHGT + 2 * BUFFER - SELDELTA)) {
                vScale = (h - 2 * BUFFER - SELDELTA) / TILEHGT;
            }
            var scaledWid = TILEWID * vScale;
            var leftDelta = scaledWid + BUFFER;
            if (numtiles * scaledWid + (numtiles + 1) * BUFFER > w) {
                leftDelta = (w - 2 * BUFFER - scaledWid) / (numtiles - 1);
            }
            var scaledHgt = vScale * TILEHGT;

            var tileDirective = {
                ".tile": {
                    "tile<-tiles": {
                        "@id": function(c) {
                            return idClass+ '-' + c.pos;
                        },
                        "img@src": function(c) {
                            return c.item.img;
                        },
                        "@style": function(c) {
                            return "height: "+scaledHgt+
                                "px;width: "+scaledWid+
                                "px;top: "+(BUFFER +SELDELTA)+
                                "px;left: "+(BUFFER + leftDelta * c.pos)+
                                "px;z-index: "+ (numtiles - c.pos);
                        }
                    }
                }
            };

            try {
                $me.render(tileset, tileDirective);
            } catch (e) {
                alert ("tile rendering failed: "+e);
            }

        },
        "reset": function(ts, cb) {
            tileset = ts;
            reset(cb);
        },
        /**
         *
         * @returns {*} an array of indexes of selected items in the tileset
         */
        get selected() {
            var selectedIds = shifter.item;
            return $.map(selectedIds, function(id) {
                return parseInt(id.substr(id.lastIndexOf('-')+1));
            });
        },
        /**
         *
         * @returns {*} an array of selected tiles
         */
        get selectedTiles() {
            var indexList = this.selected;
            return $.map(indexList, function(index) {
                return tileset.tiles[index];
            });
        }
    };
}