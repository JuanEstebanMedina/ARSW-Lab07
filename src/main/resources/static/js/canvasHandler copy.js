// Módulo para manejar eventos Pointer en el canvas
(function (global) {
    'use strict';

    var canvas = null;
    var ctx = null;
    var pointerDown = false;
    var lastPointerId = null;

    function getCanvasPos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function drawMarker(x, y) {
        if (!ctx) return;
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    function onPointerDown(evt) {
        // soporta mouse/touch/pen
        canvas.setPointerCapture && canvas.setPointerCapture(evt.pointerId);
        pointerDown = true;
        lastPointerId = evt.pointerId;
        var pos = getCanvasPos(evt);
        drawMarker(pos.x, pos.y);
        // exponer coordenadas para el app
        if (global.app && typeof global.app._onCanvasPointer === 'function') {
            global.app._onCanvasPointer('down', pos.x, pos.y);
        }
        evt.preventDefault();
    }

    function onPointerMove(evt) {
        if (!pointerDown || evt.pointerId !== lastPointerId) return;
        var pos = getCanvasPos(evt);
        drawMarker(pos.x, pos.y);
        if (global.app && typeof global.app._onCanvasPointer === 'function') {
            global.app._onCanvasPointer('move', pos.x, pos.y);
        }
    }

    function onPointerUp(evt) {
        try {
            canvas.releasePointerCapture && canvas.releasePointerCapture(evt.pointerId);
        } catch (e) {
            // ignore
        }
        pointerDown = false;
        lastPointerId = null;
        var pos = getCanvasPos(evt);
        if (global.app && typeof global.app._onCanvasPointer === 'function') {
            global.app._onCanvasPointer('up', pos.x, pos.y);
        }
    }

    function init(selector) {
        canvas = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        // Registrar eventos pointer
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }

    function destroy() {
        if (!canvas) return;
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        canvas = null;
        ctx = null;
        pointerDown = false;
        lastPointerId = null;
    }

    // exportar
    global.canvasHandler = {
        init: init,
        destroy: destroy
    };

})(window);