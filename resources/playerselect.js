/**
 * Created by paul on 3/13/14.
 */

var getplayerlist = function(parent, players, cb) {
    var pldlgdirective = {
        '.pldlgitem' : {
            "plcolor<-plcolors": {
                "span, input@value": "plcolor.color"
            }
        }
    };
    var plselectcb = cb;
    $(document).on('click', "#confirmplayers", function() {
        var selectedplayers =
            $("#playerdialog").find(":checked").map(function () {
                return this.value;
            }).get();
        plselectcb(selectedplayers);
    });
    $.get('resources/htmlfrag/playerdialog.html', function(resp) {
        var $p = $(parent);
        $p.append(resp);
        var $players = $p.find('.divDialogElements');
        $players.render({"plcolors":players}, pldlgdirective);
        $p.find("#playerdialog").modal('show');
    }, 'html');
};