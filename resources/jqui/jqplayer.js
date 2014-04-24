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
                            "#"+"player-reserve-"+ p.color, 'tile-'+ p.color, cb3);
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
        var aui = new ActionJQ(p.color, "#player-actions-"+ p.color, function(status) {
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

    return {
        get offer() {
            return handui.selectedCards;
        },
        "resetHand": function(cb) {
            async.series(
                [
                    function(cb2) {
                        handui.reset(cb2);
                    },
                    function(cb2) {
                        handui.show();
                        cb2(null)
                    }
                ],
                function(err) {
                    cb(err, handui);
                }
            );
        },
        "resetBoard": function(cb) {
            async.series(
                [
                    function(cb2) {
                        boardui.reset(cb2);
                    },
                    function(cb2) {
                        boardui.show();
                        cb2(null)
                    }
                ],
                function(err) {
                    cb(err, boardui);
                }
            );
        },
        "resetReserve": function(cb) {
            async.series(
                [
                    function(cb2) {
                        resui.reset(p.reserveAsTileset, cb2);
                    },
                    function(cb2) {
                        resui.show();
                        cb2(null)
                    }
                ],
                function(err) {
                    cb(err, resui);
                });

        },
        "resetAll": function(cb) {
            async.parallel({
                "h": this.resetHand,
                "r": this.resetReserve,
                "b": this.resetBoard
//                    ,
//                "a": this.resetAction
            },
            function(err, res) {
                console.log("Player reset all: stat="+(err || "ok")+
                    ", val="+JSON.stringify(res));
                cb(err);
            });
        },
        "showPossibleTileLocations": function(possibleLoc) {
            boardui.clearPossible();
//            boardui.show();
            boardui.showPossible(possibleLoc);
        }
    }


}