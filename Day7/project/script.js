const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

let image = new Image();
let draggingText = null;
let topTextPosition = { x: 250, y: 50 };
let bottomTextPosition = { x: 250, y: 450 };

imageInput.addEventListener('change', function() {
    debugger
    const reader = new FileReader();
    reader.onload = function() {
        image.src = reader.result;
    }
    reader.readAsDataURL(imageInput.files[0])
})

image.onload = function() {
    drawMeme();
}

const isNear = (x, y, textPosition) => {
    const dx = x - textPosition.x;
    const dy = y - textPosition.y;
    return dx * dx + dy * dy < 900;
}

canvas.addEventListener("mousedown", (e) => {
    const { offsetX, offsetY } = e;
    if (isNear(offsetX, offsetY, topTextPosition)) draggingText = 'top';
    else if (isNear(offsetX, offsetY, bottomTextPosition)) draggingText = 'bottom'; 

});

canvas.addEventListener("mousemove", (e) => {
    if (draggingText) {
        const { offsetX, offsetY } = e;
        if (draggingText == 'top') topTextPosition = { x : offsetX, y : offsetY};
        else bottomTextPosition = { x: offsetX, y: offsetY};
        drawMeme();
    }
})

canvas.addEventListener("mouseup", () => draggingText = null);

function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    const topText = document.getElementById('topText').value.toUpperCase();
    const bottomText = document.getElementById("bottomText").value.toUpperCase();
    const fontSize = document.getElementById("fontSize").value;
    const fontColor = document.getElementById("fontColor").value;
    const fontFamily = document.getElementById("fontFamily").value;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';


    ctx.fillText(topText, topTextPosition.x, topTextPosition.y);
    ctx.strokeText(topText, topTextPosition.x, topTextPosition.y);

    ctx.fillText(bottomText, bottomTextPosition.x, bottomTextPosition.y);
    ctx.strokeText(bottomText, bottomTextPosition.x, bottomTextPosition.y);
}

function downloadMeme() {
    const link = document.createElement('a');
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
}

document.getElementById("toggleDark").addEventListener("click", () => {
    document.body.classList.toggle("dark")
})