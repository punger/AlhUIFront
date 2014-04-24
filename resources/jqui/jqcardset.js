/**
 * Created by paul on 4/14/2014.
 */

/**
 *
 * @param {Cardset} cs - set of cards to display
 * @param {string} parent - what to hang the display off of
 * @param {string} idClass - identifier that will differentiate the ids of
 * this card set from those of other card sets
 * @param cb
 * @returns {CardsetJQ} UI for displaying a cardset
 * @constructor
 */
function CardsetJQ(cs, parent, idClass, cb) {
    var cardset = cs;
    var p = parent;
    var $me;
    var CARDWID = 322;
    var CARDHGT = 503;
    var SELDELTA = 40;
    var BUFFER = 8;

    var shifter = new Selectable('.'+idClass+'Card', 0, -SELDELTA, true);


    var reset = function(cbo) {
        shifter.clear();
        if ($me)
            $me.empty();
        $me = $(p);
        $me.load("resources/htmlfrag/cardset-template.html", function() {
            $me.find('.cardDiv').attr('id',idClass+"Div");
            $me.find('.card').addClass(idClass+'Card');
            if (cbo) cbo();
        });
    };
    reset(cb);

    return {
        "show": function() {
            var cards = cardset.cards;
            var numCards = cards.length;
            var h = $me.height();
            var w = $me.width();

            /*
             * Standard layout is at original height and width with 8 pixel
             * spacing between cards.  If the height is inadequate, get a
             * scale that makes the height fit with spacing.  Look at the
             * width scaled with the same scale (to maintain aspect ratio)
             * and see if the cards fit all in a row with spacing.  If not,
             * then determine how far apart each card should be from its
             * sibling, permitting overlap.
             */
            var vScale = 1;
            if (h < (CARDHGT + 2 * BUFFER - SELDELTA)) {
                vScale = (h - 2 * BUFFER - SELDELTA) / CARDHGT;
            }
            var scaledWid = CARDWID * vScale;
            var leftDelta = scaledWid + BUFFER;
            if (numCards * scaledWid + (numCards + 1) * BUFFER > w) {
                leftDelta = (w - 2 * BUFFER - scaledWid) / (numCards - 1);
            }
            var scaledHgt = vScale * CARDHGT;

            var cardDirective = {
                ".card": {
                    "card<-cards": {
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
                                "px;z-index: "+ c.pos;
                        }
                    }
                }
            };

            try {
                $me.render(cardset, cardDirective);
            } catch (e) {
                alert ("card rendering failed: "+e);
            }

        },
        "reset": function(cs, cb) {
            cardset = cs;
            reset(cb);
        },
        /**
         *
         * @returns {*} an array of indexes of selected items in the cardset
         */
        get selected() {
            var selectedIds = shifter.item;
            return $.map(selectedIds, function(id) {
                return parseInt(id.substr(id.lastIndexOf('-')+1));
            });
        },
        /**
         *
         * @returns {*} an array of selected cards
         */
        get selectedCards() {
            var indexList = this.selected;
            return $.map(indexList, function(index) {
                return cardset.cards[index];
            });
        }
    };
}