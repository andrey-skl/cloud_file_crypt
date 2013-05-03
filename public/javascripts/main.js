

$(function() {

    Filelist.init( $("#filelisttable") );

    //загружаем список файлов
    Filelist.loadList( $("#filelisttable") );

    $('body').on("click", "#uploadfile", function(target){
        Filelist.showUploadFilePopup();
    });

});