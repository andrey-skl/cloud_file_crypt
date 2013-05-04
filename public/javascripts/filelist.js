
var Filelist = {
    $tableContainer : null,

    init: function($_tableContainer){
        this.$tableContainer = $_tableContainer;

        $("#uploadfile").on("click", Filelist.showUploadFilePopup );
        $_tableContainer.on("click", "a.removefile", Filelist.removeFile);
        $_tableContainer.on("click", "a.downloadfile", Filelist.downloadFile);
        $_tableContainer.on("click", "a.sendfile", Filelist.sendFile);
    },

    loadList : function(){
        $.post('/list-files', function(data){
            $("tbody", Filelist.$tableContainer).html(data);
            $("a#myfiles").parent().addClass("active");
            $("a#inbox").parent().removeClass("active");
        })
            .fail(function(e) { Filelist.$tableContainer.html("Не удалось загрузить список файлов"); console.log(e.responseText, e); })
    },

    loadIncomingList : function(){
        $.post('/list-incoming-files', function(data){
            $("tbody", Filelist.$tableContainer).html(data);
            $("a#myfiles").parent().removeClass("active");
            $("a#inbox").parent().addClass("active");
        })
            .fail(function(e) { Filelist.$tableContainer.html("Не удалось загрузить список файлов"); console.log(e.responseText, e); })
    },

    appendToList : function($toElem, rowhtml){
        $($toElem).append(rowhtml);
    },

    showUploadFilePopup : function(target){
        $.get('/htmls/fileupload.html', function(data){
            $('body').append(data);

            if (prettyFileInputs) prettyFileInputs();
            $("#secret").val( Math.random().toString(36).substr(2, 5) ).focus();

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
    },

    downloadFile: function(){
        var $this = $(this);
        var url = $this.attr("href");
        var fileid = $this.parents("tr").data("fileid");

        $.get('/htmls/filedownload.html', function(data){
            $('body').append(data);
            $('#modalfiledownload').modal({show:true});
            $("#secret").focus();


            $('#modalfiledownload').on("click", "#ok", function(e){
                var secret = $("#secret").val();


                $.get("/issecretok?secret="+secret+"&fileid="+fileid, function(data){
                    if (data=="ok")
                    {
                        url = url+"&secret="+secret;
                        window.location = url;

                        //скрываем модальное окно
                        $('#modalfiledownload').modal('hide')
                        setTimeout(function(){
                            $('#modalfiledownload').remove();
                        }, 1000);
                    } else {
                        console.log("wrong secret", secret);
                        alert("Неверное секретное слово")
                    }

                }).fail(function(e) { console.log(e.responseText, e); })
            });

        })
            .fail(function(e) { console.log(e.responseText, e); })

        return false;
    },

    sendFile : function(target){
        var $this = $(this);
        var fileid = $this.parents("tr").data("fileid");
        var olreadysendedemail = $this.parents("tr").find("a.mailto").text();

        $.get('/htmls/sendfile.html', function(data){
            $('body').append(data);
            var $modal = $('#modalfilesend');

            $("#email").focus().val(olreadysendedemail);

            $modal.modal({show:true});


            $modal.on("click", "#ok", function(e){
                var email = $("#email").val();
                $.post("/sendfile", {
                        email: email,
                        fileid:fileid
                    },
                    function(data){
                        if (data)
                        {
                            $this.parents("tr").replaceWith(data);
                            //скрываем модальное окно
                            $modal.modal('hide')
                            setTimeout(function(){
                                $modal.remove();
                            }, 1000);
                        } else {
                            console.log("send file error");
                        }

                    }).fail(function(e) { console.log(e.responseText, e); })
            });

        })
            .fail(function(e) { console.log(e.responseText, e); });

        return false;
    }
}
