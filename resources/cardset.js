/**
 * Created by paul on 4/2/2014.
 */

function Cardset() {
    var cards = [];
    var selectMap = 0;
    return {
        "select": function(index) {
            var slot = -1;
            if (typeof index === "string") {
                slot = parseInt(index);
            } if (typeof index === "number") {
                slot = index;
            } else if (index instanceof Card) {
                for (var i = 0; i < cards.length; i++) {
                    if (index.eq(xchg[i])) {
                        slot = i;
                        break;
                    }
                }
                if (slot < 0) {
                    console.error("Card not found in cardset "+ JSON.stringify(index));
                    return;
                }
            } else {
                console.error("Invalid argument to cardset select "+ index);
                return;
            }
            if (slot < 0 || slot >= cards.length) return;
            var bit = Math.pow(2, slot);
            selectMap ^= bit;
        },
        get cards() { return cards; },
        "selected": function() {
            if (!selectMap) return [];
            var chosen = [];
            for (var i = 0; i < cards.length; i++) {
                if (selectMap & Math.pow(2, i))
                    chosen.push(xchg[i]);
            }
            return chosen;
        },
        get selmap() { return selectMap;},
        "isselected": function(slot) { return Math.pow(2, slot) & selectMap;},
        "add": function (card) {
            if (card instanceof  Card) {
                cards.push(card);
            } else if (card instanceof Array) {
                for (var i = 0; i < card.length; i++) {
                    this.add(card[i]);
                }
            } else if (card instanceof Cardset) {
                this.add(card.cards);
            } else {
                var oCard = new Card(card);
                cards.push(oCard);
            }
        },
        "remove": function() {
            var newcards = [];
            for (var i = 0; i < cards.length; i++) {
                if (!this.isselected(i)) {
                    newcards.push(cards[i]);
                }
            }
            selectMap = 0;
            cards = newcards;
        },
        "setset": function (cs) {
            if (cs instanceof Cardset) {
                cards = cs.cards;
            } else if (cs instanceof Array) {
                cards = cs;
            } else if (cs instanceof Card) {
                cards = new Array(cs);
            }
        }
    };
}