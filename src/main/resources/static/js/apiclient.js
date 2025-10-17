// apiclient.js
var apiclient = (function () {

    var baseUrl = 'http://localhost:8080/blueprints';

    var getBlueprintsByAuthor = function (author) {
        return $.ajax({
            url: baseUrl + '/' + author,
            method: 'GET'
        });
    };

    var getBlueprintsByNameAndAuthor = function (author, bpname) {
        return $.ajax({
            url: baseUrl + '/' + author + '/' + bpname,
            method: 'GET'
        });
    };

    var updateBlueprintByNameAndAuthor = function (bp) {
        return $.ajax({
            url: baseUrl + '/' + bp.author + '/' + bp.name,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(bp)
        });
    };

    return {
        getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor,
        updateBlueprintByNameAndAuthor
    };
})();
