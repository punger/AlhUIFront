/**
 * Created by paul on 4/14/2014.
 */

function PlayerJQ(game, pCol, parent, cbPlayer) {
    var p = game.getplayer(pCol);
    var $me = $(parent);
    var handui;
    var boardui;
    var resui;
    var actui;
    var handId = "player-hand-"+ p.color;

    var load = function(cb1) {
        $me.load("resources/htmlfrag/playerarea.html",
            function( response, status, xhr ) {
                if ( status === "error" ) {
                    cb1("Failure loading player area " + xhr.status + " " + xhr.statusText);
                } else {
                    $me.find('.actions').attr('id', "player-actions-"+ p.color);
                    $me.find(".hand").attr('id', handId);
                    $me.find(".board").attr('id', "player-board-"+ p.color);
                    $me.find(".reserve").attr('id', "player-reserve-"+ p.color);
                    cb1();
                }
            }
        );
    };

    var handSetup = function(cb2) {
        var h;
        async.series([
            function(cb3) {
                h = new HandJQ(p, "#"+handId, cb3);
            },
            function(cb3) {
                h.show();
                cb3();
            }
        ],
        function(err) {
            cb2(err, h);
        });
    };

    var boardSetup = function(cb2) {
        var b;
        async.series([
                function(cb3) {
                    b = new BoardJQ(p,"#player-board-"+ p.color, cb3);
                },
                function(cb3) {
                    b.show();
                    cb3();
                }
            ],
            function(err) {
                cb2(err, b);
            });
    };

    var reserveSetup =  function (cb2) {
        var r;
        async.series([
                function(cb3) {
                    r = new TilesetJQ(p.reserveAsTileset,
                            "#"+"player-reserve-"+ p.color, 'reserveTile-'+ p.color, cb3);
                },
                function(cb3) {
                    r.show();
                    cb3();
                }
            ],
            function(err) {
                cb2(err, r);
            });
    };

    var actionsSetup = function(cb2) {
        var aui = new ActionJQ(p, "#player-actions-"+ p.color, function(status) {
            cb2(status, aui);
        });
    };

    async.series([
        // Load the template
        load,
        // Set up hand, board and reserve
        function(cb1) {
            async.parallel(
                {
                    "hand": handSetup,
                    "board": boardSetup,
                    "reserve": reserveSetup,
                    "actions": actionsSetup
                },
                function(err, res) {
                    handui = res.hand;
                    boardui = res.board;
                    resui = res.reserve;
                    actui = res.actions;
                    cb1(err);
                }
            );

        }
    ],
    function(err) {
        cbPlayer(err, "dummyobj");
    });

    var resetAny = function(componentUI, cb, content) {
        async.series(
            [
                function(cb2) {
                    if (content) {
                        componentUI.reset(content, cb2);
                    } else {
                        componentUI.reset(cb2);
                    }
                },
                function(cb2) {
                    if (componentUI.hasOwnProperty("show"))
                        componentUI.show();
                    cb2();
                }
            ],
            function(err) {
                cb(err, componentUI);
            }
        );
    };

    return {
        get offer() {
            return handui.selectedCards;
        },
        get selectedReserveTile() {
            var selTiles = resui.selectedTiles;
            if (selTiles === null || selTiles.length === 0) return null;
            return selTiles[0];
        },
        get selectedTempTile() {
            return boardui.selectedTempTile;
        },
        "resetHand": function(cb) {
            resetAny(handui, cb);
        },
        "resetBoard": function(cb) {
            resetAny(boardui, cb);
        },
        "resetReserve": function(cb) {
            resetAny(resui, cb, p.reserveAsTileset);
        },
        "resetAction": function(cb) {
            resetAny(actui, cb);
        },
        "resetAll": function(cb) {
            async.parallel({
                "h": this.resetHand,
                "r": this.resetReserve,
                "b": this.resetBoard,
                "a": this.resetAction
            },
            function(err, res) {
                console.log("Player reset all: stat="+(err || "ok")+
                    ", val="+JSON.stringify(res, null, 2));
                cb(err);
            });
        },
        "reset": function(cb) {
            this.resetAll(cb);
        },
        "showPossibleTileLocations": function(possibleLoc, source) {
            boardui.clearPossible();
//            boardui.show();
            boardui.showPossible(possibleLoc, source);
        },
        "clearPossibles": function() {
            boardui.clearPossible();
        },
        get target() {
            return p;
        }
    }


}