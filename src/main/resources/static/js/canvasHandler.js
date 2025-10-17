// Módulo para manejar eventos Pointer en el canvas
var canvasHandler = (function () {
    var canvas = document.getElementById("blueprintCanvas"),
        context = canvas.getContext("2d");

    function handlePointerOrMouse(event) {
        let coords = toCanvasCoords(event, canvas);
        // alert('Click en: ' + coords.x + ', ' + coords.y);
        app._onCanvasPointer("down", coords.x, coords.y);
    }

    function toCanvasCoords(ev, canvas) {
        var rect = canvas.getBoundingClientRect();
        var cx = ev.clientX;
        var cy = ev.clientY;

        var xCss = cx - rect.left;
        var yCss = cy - rect.top;

        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        return {
            x: xCss * scaleX,
            y: yCss * scaleY
        };
    }

    //returns an object with 'public' functions:
    return {

        //function to initialize application
        init: function () {

            console.info('initialized');

            //if PointerEvent is suppported by the browser:
            if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", handlePointerOrMouse);
            }
            else {
                canvas.addEventListener("mousedown", handlePointerOrMouse);
            }
        }
    };

})();