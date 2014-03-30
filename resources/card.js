/**
 * Created by paul on 3/18/14.
 */

function Card (id, value, color) {
    var mid = id;
    var mval = value;
    var mcol = color;
    return {
        get img()   { return "resources/images/"+mid; },
        get id()    { return mid;},
        get value() { return mval;},
        get color() { return mcol;}
    };
}