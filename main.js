const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth - 60;
canvas.height = window.innerHeight - 120;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

const rangeInputElement = document.getElementById("range-input");
const startBackgroundColor = "white";

let restoreArray = [];
let restoreIndex = -1;
let drawColor = "black";
let drawWidth = rangeInputElement.value;
let isDrawing = false;

const context = canvas.getContext("2d");
context.fillStyle = startBackgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);

function start(event) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function draw(event) {
    if(isDrawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }

    event.preventDefault();
}

function stop(event) {
    if(isDrawing) {
        context.stroke();
        context.closePath();
        isDrawing = false;
    }

    if(event.type !== "mouseout") {
        restoreArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
        restoreIndex++;
    }

    event.preventDefault();
}

function clearCanvas() {
    context.fillStyle = startBackgroundColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restoreArray = [];
    restoreIndex = -1;
}

function undoLast() {
    if(restoreIndex <= 0) {
        clearCanvas();
        return;
    }

    restoreIndex--;
    restoreArray.pop();
    context.putImageData(restoreArray[restoreIndex], 0, 0);
}

function changeColor(element) {
    drawColor = element.style.background;
}