/**
 * Created by paul on 4/13/2014.
 */

function Selectable(selClass, deltax, deltay, multi) {
    var itemSelected = {};

    var shift = function($e, inout) {
        var dir = inout === "in" ? -1 : 1;
        $e.css("left", parseFloat($e.css("left")) + (deltax * dir));
        $e.css("top", parseFloat($e.css("top")) + (deltay * dir));
    };
    var clearItem = function(item) {
        if (itemSelected.hasOwnProperty(item)) {
            var $item = $("#"+item);
            shift($item, "in");
            $item.toggleClass("gamepiece-selected gamepiece-unselected");
            delete itemSelected[item];
        }
    };
    var select = function() {
        var $this = $(this);
        var id = $this.attr('id');
        if (itemSelected.hasOwnProperty(id)) {
            clearItem(id);
//            shift($this, "in");
//            $this.toggleClass("gamepiece-selected gamepiece-unselected");
//            delete itemSelected[id];
        }
        else {
            if (!multi) {
                var keys = Object.keys(itemSelected);
                if (keys.length > 0) {
                    clearItem(keys[0]);
//                    var $oldTile = $("#"+keys[0]);
//                    shift($oldTile, "in");
//                    $oldTile.toggleClass("gamepiece-selected gamepiece-unselected");
//                    delete itemSelected[keys[0]];
                }
            }
            shift($this, "out");
            $this.toggleClass("gamepiece-selected gamepiece-unselected");
            itemSelected[id] = id;
        }
    };

    $(document).off('click', selClass, select);
    $(document).on('click', selClass, select);

    return {
        get item() { return itemSelected; },
        "clear": function() {
            // Don't care to test for hasOwnProperty since clearItem already does
            for (item in itemSelected) clearItem(item);
        }
    }


}