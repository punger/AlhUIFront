/**
 * Created by paul on 3/30/2014.
 */

/**
 * Game object holds other objects.  Constructs exchange, market and players
 * @param {Array.<string>} plin array of participating player colors
 * @param {string} startplayer the color of the start player
 * @param {parallelCallback} cb synchronization callback
 * @returns {object}
 * @constructor
 */
function Game(plin, startplayer, cb) {
    var players = plin;
    var curplayer = startplayer;
    var roster = {};
    var xchg;
    var mkt;
    var me = this;


    var nextPlayer = function(pCol, cb) {
        // TODO Support more than one player
    };

    var refreshAll = function(cb) {
        async.parallel({
            "player": function(cb1) {
                roster[curplayer].refresh(cb1);
            },
            "mkt": function(cb1) {
                mkt.refresh(cb1);
            },
            "xchg": function(cb1) {
                xchg.fill(cb1);
            }
        },
        function(err, res) {
            console.log("End turn status "+(err || "ok")+", val "+JSON.stringify(res, null, 2));
            if (cb) cb(err, res);
        });
    };

    var score = function(cb) {
        $.getJSON("score", function(scoreArray) {
            console.log("Scores:"+JSON.stringify(scoreArray, null, 2));
            if (cb) cb();
        });
    };

    var endTurn = function(cb) {
        var unattachedTiles = roster[curplayer].temp;
        if (unattachedTiles && unattachedTiles.length > 0) {
            console.log(
                    "Cannot end turn because player "+curplayer+
                    " still has to place tiles "+JSON.stringify(unattachedTiles, null, 2));
            if (cb) cb();
            return;
        }
        $.getJSON("endofturn", function(srvrStat) {
            if (srvrStat.success) {
                // just go to next player
                refreshAll(cb);
                console.log("End turn.  Next player is "+srvrStat.player);
                nextPlayer(srvrStat.player, cb);
                return;
            }
            //  problem, scoring, or player has more to do.
            console.log("End turn message: " + srvrStat.message);
            var curRound = 0;
            //noinspection FallThroughInSwitchStatementJS
            switch (srvrStat.message) {
                case "same player":
                    console.log("Next showed new player "+srvrStat.player+". Cur player "+curplayer);
                    cb();
                    return;
                case "Scoring round2":
                    curRound++;
                case "Scoring round1":
                    curRound++;
                    break;
                case "End of game":
                    alert("tada");
                    cb(srvrStat.message);
                    return;
            }
            // record where we are in the round somewhere
            async.series([
                function(cb1) {
                    score(cb1);
                },
                function(cb1) {
                    refreshAll(cb1);
                }
            ],function(err){
                if (cb) cb(err);
            });
        });

    };

    async.parallel(
        {
            "iXchg": function(cb2) {
                xchg = new Exchange();
                xchg.fill(cb2);
            },
            "iMkt": function(cb2) {
                mkt = new Market();
                mkt.refresh(cb2);
            },
            "iPlayers": function(cb2) {
                async.each(players,
                    function (p, cb3) {
                        roster[p] = new Player(p, me, cb3);
                    },
                    function(err) {
                        cb2(err, roster);
                    }
                );
            }
        },
        function(err, res) {
            if (cb) cb(err, res);
        }
    );


    return {
        /*
         *
         * @param {string} pColor - a player color
         * @returns {object} - the player object of that color
         */
        "getplayer": function (pColor) {
            return roster[pColor];
        },
        get exchange() {
            return xchg;
        },
        /**
         *
         * @returns {*} player color
         */
        get curplayer () {
            return curplayer;
        },
        get market() {
            return mkt;
        },
        "take": function(wanted, cb) {
            var xCardArray = $.map(wanted, function(c){
                return {
                    "color": c.color,
                    "value": c.value
                };
            });
            async.series([
                function(cb1) {
                    var cardarg = JSON.stringify(xCardArray);
//                    var cardarg = decodeURIComponent(JSON.stringify({ "cards": xCardArray}));
//                    var cardarg = decodeURIComponent($.param({ "cards": xCardArray}));
                    console.log("About to call take with card list arg "+ cardarg);
                    $.ajax("takecards", {
                        "success": function(srvrStat) {
                            if (!srvrStat.success) {
                                cb1("Server error: "+srvrStat.message);
                                return;
                            }
                            roster[curplayer].addcards(wanted);
                            cb1();
                        },
                        "headers": {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        "data": cardarg,
                        "dataType": "json",
//                        "traditional": true,
                        "type": "POST",
                        contentType: 'application/json',
                        mimeType: 'application/json'

                    });
                },
                endTurn

            ],
            function (err) {
                if (err) {
                    alert(err);
                }
                if (cb) cb(err);
            });
        },
        "buy": function(offer, tilepos, cb) {
            var xCardArray = $.map(offer, function(c){
                return {
                    "color": c.color,
                    "value": c.value
                };
            });
            var proffer = {
                "offer": xCardArray,
                "slot": tilepos
            };
            var buyarg = JSON.stringify(proffer);
            async.series([
                function(cb1) {
                    console.log("About to call buy with card list arg  and vendor "+
                        JSON.stringify(proffer, null, 2));
                    $.ajax("buytile", {
                        "success": function(srvrStat) {
                            if (!srvrStat.success) {
                                cb1("Server error: "+srvrStat.message);
                                return;
                            }
                            var p = roster[curplayer];
                            var tile = mkt.getatslot(tilepos);
                            p.addToTemp(tile);
                            p.resetHand(cb1);
                        },
                        "headers": {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        "data": buyarg,
                        "dataType": "json",
                        "type": "POST",
                        contentType: 'application/json',
                        mimeType: 'application/json'

                    });
                },
                mkt.refresh,
                endTurn

            ],
            function (err) {
                if (err) {
                    alert(err);
                }
                if (cb) cb(err);
            });

        },
        "place": function(source, tile, x, y, cb) {
            var p = roster[curplayer];
            async.series([
                function(cb1) {
                    console.log("About to place tile "+tile.id+" at ("+x+", "+y+")");
//                    $.getJSON("placetile", {
//                        "tileId": tile.id,
//                        "x": x,
//                        "y": y
//                    }, function(srvrStat) {
//                        if (!srvrStat.success) {
//                            cb1("Server error: "+srvrStat.message);
//                        } else cb1();
//                    });
                    $.ajax("placetile", {
                        "success": function(srvrStat) {
                            if (!srvrStat.success) {
                                cb1("Server error: "+srvrStat.message);
                            } else cb1();
                        },
                        "headers": {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        "data": JSON.stringify({
                            "tileId": tile.id,
                            "x": x,
                            "y": y
                        }),
                        "dataType": "json",
                        "type": "POST",
                        contentType: 'application/json',
                        mimeType: 'application/json'

                    });
                },
                function(cb1) {
                    if (source === "reserve")
                        p.removeFromReserve(tile);
                    else {
                        p.removeFromTemp(tile);
                    }
                    p.board.refresh(cb1);
                },
                endTurn
            ],
            function(err) {
                if (cb) cb(err);
            });
        },
        /**
         * Move selected unattached tile to reserve.
         * This doesn't cost an action
         * @param tile in unattached to move to reserve (not tile id)
         * @param cb for completion
         */
        "toReserve": function(tile, cb) {
            var p = roster[curplayer];
            async.series([
                    function(cb1) {
                        console.log("About to move tile "+tile.id+" to reserve");
                        $.getJSON("toreserve",
                            {"tile": tile.id},
                            function (status) {
                                if (!status.success) {
                                    cb1("Server error: "+status.message);
                                } else cb1();
                            }
                        );
                    },
                    function(cb1) {
                        p.removeFromTemp(tile);
                        p.addToReserve(tile);
                        p.board.refresh(cb1);
                    },
                    endTurn
                ],
                function(err) {
                    if (cb) cb(err);
                }
            );
        },
        "forceEndOfTurn": function (cb) {
            var p = roster[curplayer];
            while (p.temp && p.temp.length > 0) {
                var tile = p.temp[0];
                p.removeFromTemp(tile);
                p.addToReserve(tile);
            }
            endTurn(cb);
        }
    }
}

/**
 * @callback parallelCallback
 * @param {string} status
 * @param {object} value
 */

