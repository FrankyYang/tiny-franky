$(function () {
    var $formContainer = $('#NoteContainer');
    var $hiddenUpdate = $formContainer.find('input[name="update"]');
    var $dataTable = $('#DataList');

    $dataTable.find(".delete").bind("click", function (event) {
        $.post("operation", {
            urlvalue: this.id,
            operation: "delete"
        }, function(data){
            location.reload();
        });
    });

    $dataTable.find(".edit").bind("click", function (event) {
        var link = this.id;
        var $tr = $(this).parent().parent();
        var $title = $formContainer.find('#title');
        var $content = $formContainer.find('#content');
        var $hiddenUpdate = $formContainer.find('input[name="update"]');
        var title = $tr.find('td').eq(0).html();
        var content = $tr.find('td').eq(1).html();

        $title.val(title);
        $content.val(content);
        $hiddenUpdate.val(1);
    });
});
