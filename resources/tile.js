/**
 * Created by paul on 3/19/14.
 */

function Tile(color, value, id) {
    var mcol, mval, mid;
    if (typeof color === "object") {
        mcol = color.color;
        mval = color.value;
        mid = color.id;
    } else {
        mcol = color;
        mval = value;
        mid = id;
    }
    return {
        get img() { return "resources/images/"+mid+".png"; },
        get id() { return mid; },
        get value() { return mval; },
        get color() { return mcol; }
    }
}
