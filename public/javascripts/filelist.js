
var Filelist = {
    $tableContainer : null,

    init: function($_tableContainer){
        this.$tableContainer = $_tableContainer;

        $_tableContainer.on("click", "a.removefile", Filelist.removeFile);
    },

    loadList : function($toElem){
        $.post('/list-files', function(data){
            $("tbody", $toElem).html(data);
        })
            .fail(function(e) { $toElem.html("Не удалось загрузить список файлов"); console.log(e.responseText, e); })
    },

    appendToList : function($toElem, rowhtml){
        $($toElem).append(rowhtml);
    },

    showUploadFilePopup : function(target){
        $.get('/htmls/fileupload.html', function(data){
            $('body').append(data);
            $('#modalfileupload').modal({show:true});

            $('#fileupload').fileupload({
                url: 'uploadfile',
                done:function(e, data){
                    console.log(data.result);

                    Filelist.appendToList(Filelist.$tableContainer, data.result);

                    //скрываем модальное окно
                    $('#modalfileupload').modal('hide')
                    setTimeout(function(){
                        $('#modalfileupload').remove();
                    }, 1000);

                }
            });

        })
            .fail(function(e) { console.log(e.responseText, e); })
    },

    removeFile: function(){
        var $this = $(this);
        var url = $this.attr("href");

        $.get(url, function(data){
            if (data=="ok")
                $this.closest("tr").remove();

        }).fail(function(e) { console.log(e.responseText, e); })

        return false;
    }
}
