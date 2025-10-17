// punto 12
var apiclient = (function() {


    var baseUrl = 'http://localhost:8080/blueprints';


    var getBlueprintsByAuthor = function(author, callback) {

        $.ajax({
            url: baseUrl + '/' + author,
            method: 'GET',
            success: function(data) {
                console.log('Blueprints obtenidos:', data);
                callback(data);
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener blueprints:', error);
                console.error('Status:', xhr.status);
                console.error('Response:', xhr.responseText);
                callback(null);
            }
        });
    };

    var getBlueprintsByNameAndAuthor = function(author, bpname, callback) {
        $.ajax({
            url: baseUrl + '/' + author + '/' + bpname,
            method: 'GET',
            success: function(data) {
                console.log('Blueprint obtenido:', data);
                callback(data);
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener blueprint:', error);
                console.error('Status:', xhr.status);
                console.error('Response:', xhr.responseText);
                callback(null);
            }
        });
    };

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor
    };

})();