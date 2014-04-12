/**
 * Created by paul on 3/18/14.
 */

function Card (value, color) {
    var mval = 0;
    var mcol = "";
    if (typeof value === "number") {
        mval = ""+value;
        mcol = color;
    } else if (typeof value === "object") {
        mval = value.value;
        mcol = value.color;
    } else if (typeof value === "string") {
        mval = value;
        mcol = color;
    }
    var zerofill = "00"+mval;
    var mid = mcol + "_" + zerofill.substr(zerofill.length - 2);
    return {
        get img()   { return "resources/images/"+mid+".png"; },
        get id()    { return mid;},
        get value() { return mval;},
        get color() { return mcol;},
        "eq": function (o) {
            if (o instanceof Card) {
                if (o.value == mval && o.color == mcol)
                    return true;
            }
            return false;
        }

    };
}