/**
 * Created by paul on 4/17/2014.
 */

function GameJQ(game, uis) {
    $(document).on('click', '.action-buy', function(e) {
        var $this = $(this);
        console.log("buy "+ $this.attr('id'));
        async.series([
                function (cb) {
                    game.buy(uis.p.offer, uis.m.selected, cb);
                },
                function (cb) {
                    async.parallel({
                            "x":function(cb1) {
                                async.series(
                                    [
                                        function(cb2) {
                                            uis.x.reset(game.exchange, cb2);
                                        },
                                        function(cb2) {
                                            uis.x.show();
                                            cb2(null)
                                        }
                                    ],
                                    function(err) {
                                        cb1(err, uis.x);
                                    }
                                );
                            },
                            "m": function(cb1) {
                                uis.m.show();
                                cb1();
                            },
                            "p": function(cb1) {
                                uis.p.resetAll(cb1);
                            }

                        },
                        function(err, resetObj) {
                            if (cb) cb();
                        });
                }
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
            function (cb) {
                async.parallel({
                    "x":function(cb1) {
                        async.series(
                            [
                                function(cb2) {
                                    uis.x.reset(game.exchange, cb2);
                                },
                                function(cb2) {
                                    uis.x.show();
                                    cb2(null)
                                }
                            ],
                            function(err) {
                                cb1(err, uis.x);
                            }
                        );
                    },
                    "m": function(cb1) {
                        uis.m.show();
                        cb1();
                    },
                    "p": function(cb1) {
                        uis.p.resetHand(cb1);
                    }

                },
                function(err, resetObj) {
                    if (cb) cb();
                });
            }
        ],
        function (err) {
            console.log("Take action result: "+ (err || "ok"));
        });
    });
    $(document).on('click', '.action-toReserve', function(e) {
        var $this = $(this);
        console.log("tor "+ $this.attr('id'));
    });
    $(document).on('click', '.action-fromReserve', function(e) {
        var $this = $(this);
        console.log("frr "+ $this.attr('id'));
    });

    $(document).on('click', '.marketTile', function(e) {
        var $this = $(this);
        var id = $this.attr('id');
        console.log("Market tile select "+ id);
        var slot = id.substr(id.lastIndexOf('-')+1);
        var selectedTile = game.market.getatslot(slot);
        async.waterfall([
            function(cb) {
                $.getJSON("possibleLocations",{
                    tile: selectedTile.id
                },
                function(res) {
                    if (res) {
                        console.log("Possible locations for tile " +
                            selectedTile.id + " are " + JSON.stringify(res));
                        cb(null, res);
                    } else {
                        cb("Got no possible locations for tile "+selectedTile.id);
                    }

                });
            },
            function (locArray, cb) {
                uis.p.showPossibleTileLocations(locArray);
                cb();
            }
        ],
        function(err, result) {
            if (err) alert(err);
        }
        );
    });


}