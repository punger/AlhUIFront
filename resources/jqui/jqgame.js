/**
 * Created by paul on 4/17/2014.
 */

function GameJQ(game, uis) {
    var resetAny = function(componentUI, cb, content) {
        async.series(
            [
                function(cb2) {
                    if(componentUI.hasOwnProperty("reset")){
                        if (content) {
                            componentUI.reset(content, cb2);
                        } else {
                            componentUI.reset(cb2);
                        }
                    } else cb2();
                },
                function(cb2) {
                    if (componentUI.hasOwnProperty("show")) {
                        componentUI.show();
                    }
                    cb2(null);
                }
            ],
            function(err) {
                cb(err, componentUI);
            }
        );
    };

    var reset = function(cb) {
        async.parallel({
                "x":function(cb1) {
                    resetAny(uis.x, cb1);
                },
                "m": function(cb1) {
                    resetAny(uis.m, cb1);
                },
                "p": function(cb1) {
                    resetAny(uis.p, cb1);
                }
            },
            function(err, resetObj) {
                console.log(
                        "Results from reset for player "+
                        game.curplayer+":\n"+
                        JSON.stringify(resetObj, null, 2)
                );
                if (cb) cb(err);
            });

    }

    $(document).on('click', '.action-buy', function(e) {
        var $this = $(this);
        console.log("buy "+ $this.attr('id'));
        async.series([
                function (cb) {
                    game.buy(uis.p.offer, uis.m.selected, cb);
                },
                reset
            ],
            function (err) {
                console.log("Buy action result: "+ (err || "ok"));
            });
    });

    $(document).on('click', '.action-take', function(e) {
        var $this = $(this);
        console.log("take "+ $this.attr('id'));
        async.series([
            function (cb) {
                game.take(uis.x.selectedCards, cb);
            },
            reset
        ],
        function (err) {
            console.log("Take action result: "+ (err || "ok"));
        });
    });
    $(document).on('click', '.action-toReserve', function(e) {
        var $this = $(this);
        console.log("tor "+ $this.attr('id'));
        var tileToMove = uis.p.selectedTempTile;
        if (!tileToMove) {
            console.log("To reserve called without any tile selected in the unattached tiles.");
            return;
        }
        async.series([
            function(cb) {
                game.toReserve(tileToMove, cb);
            },
            reset
        ]);

    });
    $(document).on('click', '.action-fromReserve', function(e) {
        var $this = $(this);
        console.log("frr "+ $this.attr('id'));
        var tileToMove = uis.p.selectedReserveTile;
        if (!tileToMove) {
            console.log("From reserve called without any tile selected in the reserve.");
            return;
        }

    });
    $(document).on('click', '.action-forceEndTurn', function(e) {
        var $this = $(this);
        console.log("feg "+ $this.attr('id'));
        // although this takes a cb, we don't need to do anything afterwards
        game.forceEndOfTurn(reset);
    });

    $(document).on('click', '[id|="reserveTile"], [id|="freeTile"]', function(e) {
        var $this = $(this);
        var id = $this.attr('id');
        var source = id.substr(0, id.indexOf("Tile"));
        console.log(source + "tile select "+ id);
        if (!$this.hasClass("gamepiece-selected")) {
            uis.p.clearPossibles();
            console.log("Clearing possible locations");
            return;
        }
        var selectedTile =
            source === "reserve" ?
                uis.p.selectedReserveTile :
                uis.p.selectedTempTile;
        if (selectedTile === null) {
            console.log("No tile selected in reserve");
            return;
        }
        game.getplayer(game.curplayer).board.getpossible(
            selectedTile.id,
            function(err, res){
                if (res) {
                    console.log("Possible locations for tile " +
                        selectedTile.id + " are " + JSON.stringify(res, null, 2));
                    uis.p.showPossibleTileLocations(res, source);
                } else {
                    console.error("Got no possible locations for tile "+selectedTile.id);
                }
            });
    });

    $(document).on('click', '[class*="possibleTile"]', function(e) {
        var $this = $(this);
        var id = $this.attr('id');
        console.log("Possible tile select "+ id);
        var source = $this.data("source");
        var selectedTile =
                source === "reserve" ?
            uis.p.selectedReserveTile :
            uis.p.selectedTempTile;
        if (selectedTile === null) {
            console.log("No tile selected in "+source);
            return;
        }
        var y = id.substr(id.lastIndexOf('_')+1);
        var idStub = id.substr(0, id.lastIndexOf('_'));
        var x = idStub.substr(idStub.lastIndexOf('_')+1);
        var p = game.getplayer(game.curplayer);
        async.series([
            function(cb) {
                game.place(source, selectedTile, x, y, cb);
            },
            reset
        ],
        function(err){
            if (err) {
                alert("Error placing tile: "+err);
                // TODO: need to put it back where it came from if there was a failure
            }
        });
    });


}