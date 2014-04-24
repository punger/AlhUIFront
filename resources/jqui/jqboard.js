/**
 * Created by paul on 4/21/2014.
 */

function BoardJQ(player, parent, cb) {
    var p = player;
    var $me;
    var TILEWID = 264;
    var TILEHGT = 264;
    var SELDELTAX = 8;
    var SELDELTAY = -8;
    var BUFFER = 0;
    var SPACING = 2;
    var emptyTile = new Tile("blank", -1, "blanktile");
    var possTile = new Tile("possible", -1, "possible");

    var shifter = new Selectable('.possibleTile-'+ p.color, SELDELTAX, SELDELTAY);

    var reset = function(cbo) {
        if (shifter) shifter.clear();
        if ($me)
            $me.empty();
        $me = $(parent);
        $me.load("resources/htmlfrag/board-template.html", function() {
            if (cbo) cbo();
        });
    };
    reset(cb);

    /**
     * Provide a board representation that lends itself to manipulation using
     * pure js.
     * @returns {Array} of Tiles which is the rectangular mat rolled out
     * into a one dimensional array
     */
    var mungeBoardToLinearArray = function() {
        var b = p.board;
        var rowLength = (b.maxX - b.minX + 1);
        var tileArray = new Array(rowLength * (b.maxY - b.minY + 1));

        for (var i = 0; i < b.mat.length; i++) {
            var tilej = b.mat[i].t.gt;
            var t = new Tile(tilej.color, tilej.cost, tilej.resourceId);
            tileArray[(b.mat[i].y - b.minY) * rowLength + (b.mat[i].x - b.minX)] = t;
        }
        for (var j = 0; j < tileArray.length; j++) {
            tileArray[j] = tileArray[j] || emptyTile;
        }
        return tileArray;
    };

// {"minX":-1,"maxX":1,"minY":-1,"maxY":1,
// "board":[{"x":0,"y":0,"t":{"gt":{"color":"garden","cost":0,"walls":[],"resourceId":"garden"}}}]}

    return {
        "show": function() {
            var h = $me.height();
            var w = $me.width();

            var tiles = {
                "tiles": mungeBoardToLinearArray()
            };

            var b = p.board;
            var rowLength = (b.maxX - b.minX + 1);
            var numRows = b.maxY - b.minY + 1;
            var tileScaleY =
                h / ((numRows * (TILEHGT + 2 * BUFFER + SPACING) + SPACING) + SELDELTAY);
            var tileScaleX =
                w / ((rowLength * (TILEWID + 2 * BUFFER + SPACING) + SPACING) + SELDELTAX);
            if (tileScaleX > 1) tileScaleX = 1;
            if (tileScaleY > 1) tileScaleY = 1;

            // After this, tileScaleX is no bigger than tileScaleY
            if (tileScaleX > tileScaleY)  tileScaleX = tileScaleY;


            var boardDirective = {
                ".tileOnBoard": {
                    "tile<-tiles": {
                        "@id": function (c) {
                            // In mat coordinates
                            var rowPos = Math.floor(c.pos / rowLength) + b.minY;
                            var colPos = c.pos % rowLength + b.minX;
                            return "boardTile_"+ p.color+"_"+colPos+"_"+rowPos;
                        },
                        "@class+": function (c, x) {
                            if (c.item.value < 0) {
                                return " emptyCell";
                            } else {
                                return " tileCell";
                            }
                        },
                        "img@src": "tile.img",
                        "@style": function(c) {
                            // in
                            var rowNum = Math.floor(c.pos / rowLength);
                            var colNum = c.pos % rowLength;
                            return "height: "+(TILEHGT * tileScaleX)+
                            "px;width: "+(TILEWID * tileScaleX)+
                            "px;top: "+((SELDELTAY + SPACING + (2 * BUFFER + SPACING + TILEHGT) * rowNum) *tileScaleX)+
                            "px;left: "+((SELDELTAX + SPACING + (2 * BUFFER + SPACING + TILEWID) * colNum) * tileScaleX)+
                            "px";
                        }
                    }
                }
            };

            try {
                $me.render(tiles, boardDirective);
            } catch (e) {
                alert("Pure failure rendering board "+e);
            }


        },
        "reset": function(cb) {
            reset(cb);
        },
        "showPossible": function(pointArray) {
            if (!pointArray) return;
            $me = $(parent);
            for (var i = 0; i < pointArray.length; i++) {
                var x = parseInt(pointArray[i].x);
                var y = parseInt(pointArray[i].y);
//             "boardTile_"+ p.color+"_"+colPos+"_"+rowPos;
                var $possTile = $me.find("#boardTile_"+ p.color+"_"+x+"_"+y);
                $possTile.addClass("possibleTile-"+ p.color);
                $possTile.find("img").attr("src", possTile.img);
            }

        },
        "clearPossible": function() {
            $me = $(parent);
            var $possibles = $me.find('.possibleTile-'+ p.color);
            $possibles.find('img').attr('src', emptyTile.img);
            $possibles.removeClass('possibleTile-'+ p.color);
            if (shifter) shifter.clear();
        }
    };

}