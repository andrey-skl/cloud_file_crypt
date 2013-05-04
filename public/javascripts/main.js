

$(function() {

    Filelist.init( $("#filelisttable") );

    //загружаем список файлов
    Filelist.loadList( $("#filelisttable") );

    $("body").on("click", "a#inbox", Filelist.loadIncomingList);
    $("body").on("click", "a#myfiles", Filelist.loadList);

    //удаление модальных окон после их скрытия
    $('body').on("click", "*[data-dismiss]", function(){
        setTimeout(function(){ $('.modal').remove(); }, 500);
    });

});