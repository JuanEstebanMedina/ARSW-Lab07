var apiclient = (function () {


    var baseUrl = 'http://localhost:8080/blueprints';


    var getBlueprintsByAuthor = function (author, callback) {

        $.ajax({
            url: baseUrl + '/' + author,
            method: 'GET',
            success: function (data) {
                console.log('Obtained blueprints:', data);
                callback(data);
            },
            error: function (xhr, status, error) {
                console.error('Error obtaining blueprints:', error);
                console.error('Status:', status);
                console.error('Response:', xhr.responseText);
                callback(null);
            }
        });
    };

    var getBlueprintsByNameAndAuthor = function (author, bpname, callback) {
        $.ajax({
            url: baseUrl + '/' + author + '/' + bpname,
            method: 'GET',
            success: function (data) {
                console.log('Obtained blueprint:', data);
                callback(data);
            },
            error: function (xhr, status, error) {
                console.error('Error obtaining blueprint:', error);
                console.error('Status:', xhr.status);
                console.error('Response:', xhr.responseText);
                callback(null);
            }
        });
    };

    var updateBlueprintByNameAndAuthor = function (author, bpname, blueprint, callback) {
        $.ajax({
            url: baseUrl + '/' + author + '/' + bpname,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(blueprint),
            success: function (data) {
                console.log('Updated blueprint:', data);
                callback(data);
            },
            error: function (xhr, status, error) {
                console.error('Error updating blueprint:', error);
                console.error('Status:', status);
                console.error('Response:', xhr.responseText);
                callback(null);
            }
        });
    };

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor,
        updateBlueprintByNameAndAuthor: updateBlueprintByNameAndAuthor
    };

})();