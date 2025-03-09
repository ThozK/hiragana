let isLocked = false;
let index = 0; // インデックスを0で初期化
let currentLang = "ja"; // 初期言語は日本語
let shuffledIndices = []; // シャッフルされたインデックスの配列

// 初期化関数
function initializeIndices() {
    // インデックスの配列を生成（0から配列の長さ-1まで）
    const indices = Array.from({ length: hiragana.length }, (_, i) => i);
    // シャッフル
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    shuffledIndices = indices;
    index = 0; //初期化時にindexを0に戻す。
}

function getRandomIndex() {
    return Math.floor(Math.random() * hiragana.length);
}

function drawPic(num) {
    const canvas = document.getElementById("canvasid");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
        // Canvasのサイズを画像のサイズに合わせる
        canvas.width = img.width;
        canvas.height = img.height;

        // 画像を描画
        ctx.drawImage(img, 0, 0);

        // 画像のピクセルデータ取得
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 透明でない部分のうち、白色も透明にする。つまり白色以外をantiquewhiteにする。
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) { // α値 (透明度) が 0 でない場合
                // 白色かどうかを判定 (RGBが全て255に近いかどうか)
                if (!(data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240)) {
                    // 白色でない場合のみ、antiquewhite にする
                    data[i] = 250;   // R
                    data[i + 1] = 235; // G
                    data[i + 2] = 215; // B (antiquewhiteのRGB)
                } else {
                    //白を透明にする
                    data[i + 3] = 0;
                }
            }
        }


        // 変更後のデータを反映
        ctx.putImageData(imageData, 0, 0);
    };

    img.src = "./pic/" + english[num] + ".PNG";
}

function updateHiragana() {
    const display = document.getElementById("hiragana-display");
    display.innerHTML = "";


    const current = document.createElement("div");
    current.className = "char";
    let currentWord;
    let currentIndexInList = shuffledIndices[index];

    if (currentLang === "ja") {
        currentWord = hiragana[currentIndexInList];
    } else if (currentLang === "en") {
        currentWord = english[currentIndexInList];
    } else if (currentLang === "es") {
        currentWord = espaniol[currentIndexInList];
    } else if (currentLang === "it") {
        currentWord = italy[currentIndexInList];
    } else if (currentLang === "fr") {
        currentWord = french[currentIndexInList];
    } else if (currentLang === "zh") {
        currentWord = chinese[currentIndexInList];
    } else if (currentLang === "ko") {
        currentWord = korean[currentIndexInList];
    } else if (currentLang === "pt") {
        currentWord = portuguesa[currentIndexInList];
    } else if (currentLang === "ru") {
        currentWord = russia[currentIndexInList];
    }

    current.textContent = currentWord;

    display.appendChild(current);
    drawPic(currentIndexInList);

    setTimeout(() => {
        playSound();
        const display = document.querySelector(".char");
        display.classList.add("active");
    }, 300);

}

function speakWord() {
    const display = document.querySelector(".char");
    if (display) {
        let wordToSpeak;
        let langCode;
        let currentIndexInList = shuffledIndices[index];

        if (currentLang === "ja") {
            wordToSpeak = hiragana[currentIndexInList];
            langCode = "ja-JP";
        } else if (currentLang === "en") {
            wordToSpeak = english[currentIndexInList];
            langCode = "en-US";
        } else if (currentLang === "es") {
            wordToSpeak = espaniol[currentIndexInList];
            langCode = "es-ES";
        } else if (currentLang === "it") {
            wordToSpeak = italy[currentIndexInList];
            langCode = "it-IT";
        } else if (currentLang === "fr") {
            wordToSpeak = french[currentIndexInList];
            langCode = "fr-FR";
        } else if (currentLang === "zh") {
            wordToSpeak = chinese[currentIndexInList];
            langCode = "zh-CN";
        } else if (currentLang === "ko") {
            wordToSpeak = korean[currentIndexInList];
            langCode = "ko-KR";
        } else if (currentLang === "pt") {
            wordToSpeak = portuguesa[currentIndexInList];
            langCode = "pt-PT";
        } else if (currentLang === "ru") {
            wordToSpeak = russia[currentIndexInList];
            langCode = "ru-RU";
        }

        const speech = new SpeechSynthesisUtterance(wordToSpeak);
        speech.lang = langCode;
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1.0;

        const voices = speechSynthesis.getVoices();
        const langVoice = voices.find(voice => voice.lang.startsWith(langCode)&& voice.name.includes("Google"));

        if (langVoice) {
            speech.voice = langVoice;
        }

        speechSynthesis.speak(speech);
    }
}

function playSound() {

    speakWord();
    moveMouth();
}

function moveMouth() {
    let mouth = document.querySelectorAll(".mouth");

    mouth.forEach(mouth => mouth.classList.remove("active"));
    mouth.forEach(m => m.classList.add("move"));

    setTimeout(() => {
        mouth.forEach(m => m.classList.remove("move"));
        mouth.forEach(m => m.classList.add("active"));
    }, 1000);

    setTimeout(() => {
        isLocked = false;

    }, 1000);
}
//言語ボタンクリックイベント
document.querySelectorAll(".lang-button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".lang-button").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentLang = button.dataset.lang;
        updateHiragana();

    });
});

document.addEventListener("keydown", (event) => {
    if (!isLocked) {
         if (event.key === "ArrowRight") {
            triggerNext();
        } else if (event.key === "ArrowLeft") {
            triggerPrevious();
        } else if (event.code === "Space") {
            triggerSpaceAction();
        }
    }
});

//mouthクリックイベント
document.querySelectorAll(".mouth").forEach(mouth => {
    mouth.addEventListener("click", () => {
        if (!isLocked) {
            triggerSpaceAction();
        }
    });
    mouth.addEventListener("mouseover", () => {
        mouth.classList.add("mouseon");
    })
    mouth.addEventListener("mouseout", () => {
        mouth.classList.remove("mouseon");
    })
});


function triggerSpaceAction() {
    isLocked = true;
    playSound(); // スペースキーの場合、再度発音
}

//nextbuttonクリックイベント
const nextButton = document.getElementById("nextButton");

nextButton.addEventListener("click", () => {
    if (!isLocked) {
        triggerNext();
    }
});

nextButton.addEventListener("mouseover", () => {
    nextButton.classList.add("mouseon");
});

nextButton.addEventListener("mouseout", () => {
    nextButton.classList.remove("mouseon");
});

nextButton.addEventListener("mousedown", () => {
    nextButton.classList.add("clicked");
});

nextButton.addEventListener("mouseup", () => {
    nextButton.classList.remove("clicked");
});

function triggerNext() {
    isLocked = true;
    index++;
    if (index >= shuffledIndices.length) {
        index = 0; // リストの終わりに達したら最初に戻る
    }
    updateHiragana();
}
//backボタン追加
// const backButton = document.createElement('div');
// backButton.textContent = '<'; // テキストを "<" に設定
// backButton.classList.add('nextButton');
// backButton.style.marginLeft="-50vh";
// document.querySelector('.indicator').appendChild(backButton);
backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
    if (!isLocked) {
        triggerPrevious();
    }
});

backButton.addEventListener("mouseover", () => {
    backButton.classList.add("mouseon");
});

backButton.addEventListener("mouseout", () => {
    backButton.classList.remove("mouseon");
});

backButton.addEventListener("mousedown", () => {
    backButton.classList.add("clicked");
});

backButton.addEventListener("mouseup", () => {
    backButton.classList.remove("clicked");
});

function triggerPrevious() {
    isLocked = true;
    index--;
    if (index < 0) {
        index = shuffledIndices.length - 1; // リストの最初から前に戻ったら最後に移動
    }
    updateHiragana();
}
// ランダムな色を生成して、背景色に設定する関数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wincol() {
    let values = [26, 96, getRandomInt(26, 96)];
    values.sort(() => Math.random() - 0.5);
    const [value1, value2, value3] = values;
    const color = `rgb(${value1}, ${value2}, ${value3})`;
    document.body.style.backgroundColor = color;
}

window.addEventListener('load', () => {
    initializeIndices();
    updateHiragana();
    wincol();
});
