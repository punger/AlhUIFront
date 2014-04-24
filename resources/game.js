/**
 * Created by paul on 3/30/2014.
 */

/**
 * Game object holds other objects.  Constructs exchange, market and players
 * @param {array} plin array of participating player colors
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
            cb(err, res);
        }
    );

    var nextPlayer = function(pCol, cb) {

    };

    var endTurn = function(cb) {
        $.getJSON("endofturn", function(srvrStat) {
            if (!srvrStat.success) {
                //  problem or scoring
                cb("End turn server error: "+srvrStat.message);
            }
            // just go to next player
            async.parallel({
                "player": function(cb1) {
                    cb1(null, "ok");
                },
                "mkt": function(cb1) {
                    mkt.refresh(cb1);
                },
                "xchg": function(cb1) {
                    xchg.fill(cb1);
                }
            },
            function(err, res) {
                console.log("End turn status "+(err || "ok")+", val "+JSON.stringify(res));
                cb(err);
            });
//            nextPlayer(srvrStat.player, cb);
        });

    };
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
                cb(err);
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
                    console.log("About to call buy with card list arg  and vendor "+ buyarg);
                    $.ajax("buytile", {
                        "success": function(srvrStat) {
                            if (!srvrStat.success) {
                                cb1("Server error: "+srvrStat.message);
                                return;
                            }
                            var p = roster[curplayer];
                            var tile = mkt.getatslot(tilepos);
                            p.addtoreserve(tile);
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
                endTurn

            ],
            function (err) {
                if (err) {
                    alert(err);
                }
                cb(err);
            });

        }
    }
}

/**
 * @callback parallelCallback
 * @param {string} status
 * @param {object} value
 */

