
var Filelist = {

    loadList : function($toElem){
        $.post('/list-files', function(data){
            $toElem.html(data);
        })
            .fail(function(e) { $toElem.html("Не удалось загрузить список файлов"); console.log(e.responseText, e); })
    }
}
