

$(function() {

    Filelist.init( $("#filelisttable") );

    //загружаем список файлов
    Filelist.loadList( $("#filelisttable") );

    $('body').on("click", "#uploadfile", function(target){
        Filelist.showUploadFilePopup();
    });

    //удаление модальных окон после их скрытия
    $('body').on("click", "*[data-dismiss]", function(){
        setTimeout(function(){ $('.modal').remove(); }, 500);
    });

});