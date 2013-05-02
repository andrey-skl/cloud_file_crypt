
var Filelist = {

    loadList : function($toElem){
        $.post('/list-files', function(data){
            $toElem.html(data);
        })
    }
}
