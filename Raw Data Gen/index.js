/*
    author: Anurag Verma
    license: MIT
    repository: https://github.com/whoanuragverma/rock-paper-scissor.git
*/
console.clear();
//Set file as respective folder
var i = 1,
    data = [],
    model,
    flipped = false,
    file = "paper";
function newFile() {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "text/plain" });
    const a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", file + ".txt");
    a.innerText = "Save Raw Dataset";
    document.querySelector("body").appendChild(a);
    document.querySelector("a").click();
}
(async () => {
    model = await handpose.load();
})().then(() => {
    async function setImage() {
        document.querySelector("img").src =
            "rps-test-set/" + file + "/" + (i % 124).toString() + ".png";
        setTimeout(async () => {
            const prediction = await model.estimateHands(
                document.querySelector("img"),
                (flipHorizontal = flipped)
            );
            getCoordinates(prediction);
        }, 50);
    }
    setInterval(() => {
        setImage();
        if (i == 124) {
            document.querySelector("img").style = "transform: scaleX(-1)";
            flipped = true;
        }
        if (i == 248) newFile();
        i += 1;
    }, 500);
    async function getCoordinates(prediction) {
        const canvas = document.querySelector("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
        if (prediction.length > 0) {
            const landmarks = prediction[0].landmarks;
            data.push(landmarks);
            for (var i = 0; i < landmarks.length; i++) {
                ctx.fillRect(landmarks[i][0], landmarks[i][1], 5, 5);
            }
        }
    }
});
