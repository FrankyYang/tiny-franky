$(function () {
    $(".delete-apiurl").bind("click", function (event) {
        $.post("operation", {
            urlvalue: this.id,
            operation: "delete"
        }, function(data){
            location.reload();
        });
    });

    $(".delete-usertable").bind("click", function (event) {
        var link = this.id;
        console.log("Try to delete user table, link is: " + link);
        // We could only delete the post at tab page, so here we link will start with '/'
        $.post("/tab", {
                link: link,
                del: true
            }, function(data){
                location.reload();
            });
        });
});
