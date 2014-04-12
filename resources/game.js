/**
 * Created by paul on 3/30/2014.
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
    return {
        "getplayer": function (p) {
            return roster[p];
        },
        "getexchange": function() {
            return xchg;
        },
        "getcurplayer": function () {
            return curplayer;
        },
        "getmarket": function() {
            return mkt;
        }
    }
}