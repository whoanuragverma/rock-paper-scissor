console.clear();
var model, modelLite;
document.querySelector("#help").addEventListener("click", () => {
    var i = -100;
    let animate = setInterval(() => {
        if (i == 0) clearInterval(animate);
        document.querySelector("#help-modal").style =
            "top:" + i.toString() + "vh;";
        i++;
    }, 3);
});

document.querySelector("#close").addEventListener("click", () => {
    var i = 0;
    let animate = setInterval(() => {
        if (i == -100) {
            clearInterval(animate);
            document.querySelector("#help-modal").style = "top:-500vh;";
        }
        document.querySelector("#help-modal").style =
            "top:" + i.toString() + "vh;";
        i--;
    }, 3);
});

document.querySelector("#play").addEventListener("click", () => {
    var i = -100;
    let animate = setInterval(() => {
        if (i == 0) {
            clearInterval(animate);
            checkCameraAccess();
        }
        document.querySelector("#play-modal").style =
            "top:" + i.toString() + "vh;";
        i++;
    }, 3);
});

function closeModal() {
    var i = 0;
    document.querySelector("#home").style = "display:none";
    let animate = setInterval(() => {
        if (i == -100) {
            clearInterval(animate);
            document.querySelector("#play-modal").style = "top:-500vh;";
        }
        document.querySelector("#play-modal").style =
            "top:" + i.toString() + "vh;";
        i -= 10;
    }, 10);
    document.querySelector("#game").style = "display:inline;";
}
function checkCameraAccess() {
    navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then(async (stream) => {
            document.querySelector("#camera").style = "color:#ffd700";
            model = await handpose.load();
            modelLite = await tf.loadLayersModel("../model/model.json");
            closeModal();
            const video = document.querySelector("video");
            video.srcObject = stream;
            video.onloadedmetadata = function () {
                video.play();
                setInterval(() => getCoordinates(), 100);
            };
        })
        .catch(() => {
            document.querySelector("#load-block").style = "display:none";
        });
}

async function getCoordinates() {
    const predictions = await model.estimateHands(
        document.querySelector("video")
    );
    if (predictions.length > 0) {
        renderPoints(predictions[0].landmarks);
        getOutcome(predictions[0].landmarks);
    } else {
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 300, 300);
        document.querySelector("#predction").innerText = "\u00A0";
        document.querySelector("#computer").innerText = "\u00A0";
        document.querySelector("#computer_res").innerText = "\u00A0";
    }
}

function renderPoints(landmarks) {
    const canvas = document.querySelector("canvas");
    canvas.height = window.innerHeight * 0.4;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    for (var i = 0; i < landmarks.length; i++) {
        ctx.fillRect(
            (landmarks[i][0] / 640) * 300,
            (landmarks[i][1] / 480) * 300,
            3,
            3
        );
    }
}

function getOutcome(landmarks) {
    var temp = [];
    for (var i = 0; i < landmarks.length; i++) {
        temp.push([landmarks[i][0] / 640, landmarks[i][1] / 480]);
    }
    const res = modelLite
        .predict(tf.tensor(temp, [21, 2]).expandDims((axis = 0)))
        .arraySync();
    const t = res[0].indexOf(Math.max(...res[0]));
    const user = ["Paper", "Rock", "Scissors"];
    document.querySelector("#predction").innerText = user[t];
    const emojis = ["✌", "✋", "✊"];
    const text = ["Scissors", "Paper", "Rock"];
    document.querySelector("#computer").innerText = emojis[t];
    document.querySelector("#computer_res").innerText = text[t];
}
