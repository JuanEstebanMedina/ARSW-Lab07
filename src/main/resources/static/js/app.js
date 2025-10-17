var app = (function () {

    // var api = apimock;
    var api = apiclient;

    var currentAuthor = null;
    var currentBlueprints = [];
    var currentBlueprint = null;
    var isNewBlueprint = false;

    var setAuthor = function (authorName) { currentAuthor = authorName; };
    var getAuthor = function () { return currentAuthor; };

    var updateBlueprintsByAuthor = function (author) {
        setAuthor(author);
        return api.getBlueprintsByAuthor(author).then(function (data) {
            if (!data || data.length === 0) {
                alert('Author not found');
                return;
            }

            currentBlueprints = data.map(function (blueprint) {
                return {
                    name: blueprint.name,
                    points: blueprint.points.length
                };
            });

            $('#authorName').text(author);
            $('#authorInfo').addClass('show');
            $('#blueprintsTableBody').empty();


            currentBlueprints.map(function (blueprint) {
                var row = $('<tr>');
                row.append($('<td>').text(blueprint.name));
                row.append($('<td>').text(blueprint.points));

                var openButton = $('<button>')
                    .addClass('btn btn-sm btn-default')
                    .text('Open')
                    .click(function () {
                        canvasBlueprint(author, blueprint.name);
                    });

                row.append($('<td>').append(openButton));

                $('#blueprintsTableBody').append(row);
            });

            const totalPoints = currentBlueprints.reduce((acumulador, blueprint) => {
                return acumulador + blueprint.points;
            }, 0);

            $('#totalPoints').text(totalPoints);
            $('#tableWrapper').show();
            $('#emptyState').hide();

            return data;
        })
            .catch(function (err) {
                console.error('Error obtaining blueprints:', err);
                alert('Error obtaining blueprints for author: ' + author);
            });
    };

    var canvasBlueprint = function (author, blueprintName) {
        return api.getBlueprintsByNameAndAuthor(author, blueprintName)
            .then(function (data) {
                if (!data || !data.points || data.points.length === 0) {
                    alert('Blueprint not found or has no points');
                    return;
                }
                currentBlueprint = data;
                isNewBlueprint = false;
                repaintCanvas();
                return data;
            })
            .catch(function (err) {
                console.error('Error obtaining blueprint:', err);
                alert('Error obtaining blueprint: ' + blueprintName + ' for author: ' + author);
            });
    }

    var createNewBlueprint = function () {
        if (!currentAuthor) {
            alert('Please enter an author and load their blueprints first');
            return;
        }

        var name = prompt('Nombre del nuevo blueprint:');
        if (!name || !name.trim()) {
            return;
        }
        name = name.trim();

        currentBlueprint = {
            author: currentAuthor,
            name: name,
            points: [],
        };
        isNewBlueprint = true;

        repaintCanvas();
    };

    var saveBlueprint = function () {
        if (!currentAuthor || !currentBlueprint) {
            alert('No author or blueprint selected');
            return;
        }

        if (currentBlueprint.points.length === 0) {
            alert('Cannot save a blueprint with no points');
            return;
        }

        $('#saveBtn').prop('disabled', true);

        var op = isNewBlueprint
            ? api.createBlueprint(currentBlueprint) // POST if new
            : api.updateBlueprintByNameAndAuthor(currentBlueprint); // PUT if exists

        return op
            .then(function () {
                alert(isNewBlueprint ? 'Blueprint created successfully' : 'Blueprint updated successfully');
                isNewBlueprint = false;
                updateBlueprintsByAuthor(currentAuthor);
            })
            .catch(function (err) {
                console.error('Error updating blueprint:', err);
                var what = isNewBlueprint ? 'creating' : 'updating';
                alert('Error ' + what + ' blueprint: ' + currentBlueprint.name + ' for author: ' + currentAuthor);
            })
            .then(function () {
                $('#saveBtn').prop('disabled', false);
            });
    }

    var repaintCanvas = function () {
        var canvas = document.getElementById('blueprintCanvas');
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        $('#currentBlueprintName').text(currentBlueprint.name);
        $('#canvasContainer').show();

        var pts = currentBlueprint.points || [];

        if (pts.length === 0) {
            return;
        }

        ctx.strokeStyle = '#ffffffff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(currentBlueprint.points[0].x, currentBlueprint.points[0].y);
        for (var i = 1; i < currentBlueprint.points.length; i++) {
            ctx.lineTo(currentBlueprint.points[i].x, currentBlueprint.points[i].y);
        }
        ctx.stroke();

        ctx.fillStyle = '#2563EB';

        currentBlueprint.points.forEach(function (point) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    var _onCanvasPointer = function (type, x, y) {
        console.log('canvas pointer', type, x, y);
        if (!currentBlueprint) return;
        if (type === 'down' || type === 'move') {
            currentBlueprint.points.push({ x: x, y: y });
            repaintCanvas();
        }
    };

    return {
        setAuthor,
        getAuthor,
        createNewBlueprint,
        updateBlueprintsByAuthor,
        saveBlueprint,
        _onCanvasPointer
    };

})();

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

    $('#createBtn').click(function () {
        app.createNewBlueprint();
    });

    $('#saveBtn').click(function () {
        app.saveBlueprint();
    });
});