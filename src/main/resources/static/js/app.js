var app = (function () {

    // punto 13
    // var api = apimock;
    var api = apiclient;

    // punto 4
    var currentAuthor = null;

    // punto 4
    var currentBlueprints = [];

    // punto 4
    var setAuthor = function (authorName) {
        currentAuthor = authorName;
    };

    // punto 4
    var getAuthor = function () {
        return currentAuthor;
    };

    // punto 5
    var updateBlueprintsByAuthor = function (author) {
        setAuthor(author);

        api.getBlueprintsByAuthor(author, function (data) {
            if (!data || data.length === 0) {
                alert('Author not found');
                return;
            }

            // punto 5.1
            currentBlueprints = data.map(function (blueprint) {
                return {
                    name: blueprint.name,
                    points: blueprint.points.length
                };
            });

            $('#authorName').text(author);
            $('#authorInfo').addClass('show');
            $('#blueprintsTableBody').empty();


            // punto 5.2
            currentBlueprints.map(function (blueprint) {
                var row = $('<tr>');
                row.append($('<td>').text(blueprint.name));
                row.append($('<td>').text(blueprint.points));

                // punto 10
                var openButton = $('<button>')
                    .addClass('btn btn-sm btn-default')
                    .text('Open')
                    .click(function () {
                        canvasBlueprint(author, blueprint.name);
                    });

                row.append($('<td>').append(openButton));

                $('#blueprintsTableBody').append(row);
            });

            // punto 5.3
            const totalPoints = currentBlueprints.reduce((acumulador, blueprint) => {
                return acumulador + blueprint.points;
            }, 0);

            $('#totalPoints').text(totalPoints);
            $('#tableWrapper').show();
            $('#emptyState').hide();
        });
    };

    // punto 9
    var canvasBlueprint = function (author, blueprintName) {
        api.getBlueprintsByNameAndAuthor(author, blueprintName, function (data) {
            if (!data || !data.points || data.points.length === 0) {
                alert('Blueprint not found or has no points');
                return;
            }

            var canvas = document.getElementById('blueprintCanvas');
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            $('#currentBlueprintName').text(blueprintName);

            $('#canvasContainer').show();

            ctx.strokeStyle = '#ffffffff';
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(data.points[0].x, data.points[0].y);
            for (var i = 1; i < data.points.length; i++) {
                ctx.lineTo(data.points[i].x, data.points[i].y);
            }
            ctx.stroke();

            ctx.fillStyle = '#2563EB';

            data.points.forEach(function (point) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        });
    }


    return {
        setAuthor: setAuthor,
        getAuthor: getAuthor,
        updateBlueprintsByAuthor: updateBlueprintsByAuthor
    };

})();

// punto 6
$(document).ready(function () {
    $('#getBlueprintsBtn').click(function () {
        var author = $('#authorInput').val().trim();
        if (author) {
            app.updateBlueprintsByAuthor(author);
        } else {
            alert('Please enter an author name');
        }
    });

    $('#authorInput').keypress(function (e) {
        if (e.which === 13) {
            $('#getBlueprintsBtn').click();
        }
    });
});