const hiragana = [
    // 食べ物
    "ごはん", "ぱん", "みず", "おちゃ", "ぎゅうにゅう", "りんご", "みかん", "ぶどう", "いちご", "なし",
    "もも", "さくらんぼ", "すいか", "めろん", "ばなな", "にんじん", "たまねぎ", "じゃがいも", "だいこん", "きゃべつ",
    "とまと", "きゅうり", "なす", "ぴーまん", "れたす", "こめ", "さかな", "にく", "たまご", "とうふ", "みそしる",

    // 動物
    "いぬ", "ねこ", "うさぎ", "とり", "ぞう", "きりん", "くま", "さる", "らいおん", "とら",
    "うま", "しか", "かめ", "へび", "さかな", "いるか", "ぺんぎん", "こあら", "かば", "わに",
    "ねずみ", "ひつじ", "ぶた", "にわとり", "あひる", "うし", "やぎ", "たぬき", "おおかみ", "ふくろう",

    // 乗り物
    "くるま", "でんしゃ", "ばす", "じてんしゃ", "ひこうき", "ふね", "しんかんせん", "たくしー", "とらっく", "ばいく",
    "きゅうきゅうしゃ", "しょうぼうしゃ", "ぱとかー", "ぶるどーざー", "ふぉーくりふと", "ろけっと", "えすかれーたー", "えれべーたー", "けーぶるかー", "すくーたー",

    // 自然
    "そら", "くも", "たいよう", "つき", "ほし", "やま", "かわ", "うみ", "もり", "はな",
    "くさ", "き", "みず", "いし", "すな", "かぜ", "ゆき", "あめ", "かみなり", "にじ",

    // 色
    "あか", "あお", "きいろ", "みどり", "しろ", "くろ", "ちゃいろ", "むらさき", "ぴんく", "おれんじ",

    // 体
    "あたま", "かお", "みみ", "め", "はな", "くち", "は", "て", "ゆび", "うで",
    "あし", "おなか", "せなか", "ひざ", "あしのうら", "つめ", "かみのけ", "こし", "ほっぺ", "した",

    // 家の中
    "いえ", "へや", "まど", "どあ", "かべ", "てーぶる", "いす", "ほん", "えほん", "つくえ",
    "でんき", "べっど", "まくら", "ふとん", "とけい", "かがみ", "てれび", "れいぞうこ", "でんわ", "そうじき",

    // 日常
    "おはよう", "こんにちは", "こんばんは", "おやすみ", "ありがとう", "ごめんね", "いってきます", "いってらっしゃい", "ただいま", "おかえり",
    "たべる", "のむ", "ねる", "あそぶ", "よむ", "かく", "きく", "みる", "あるく", "はしる",
    "わらう", "なく", "およぐ", "あける", "しめる", "はいる", "でる", "のぼる", "おりる", "まつ",

    // 遊び
    "おもちゃ", "ぬいぐるみ", "つみき", "しゃぼんだま", "すべりだい", "ぶらんこ", "すなば", "じむ", "けんけんぱ", "おにごっこ",

    // 服
    "ふく", "ぼうし", "くつ", "くつした", "てぶくろ", "ぱじゃま", "ずぼん", "すかーと", "しゃつ", "こーと",

    // 季節
    "はる", "なつ", "あき", "ふゆ", "さくら", "ひまわり", "もみじ", "こおり", "ゆきだるま", "かきごおり",

    // 家族
    "おとうさん", "おかあさん", "おにいちゃん", "おねえちゃん", "おとうと", "いもうと", "おじいちゃん", "おばあちゃん", "かぞく", "じぶん",

    // 学び
    "あいうえお", "かず", "いち", "に", "さん", "し", "ご", "ろく", "なな", "はち",
    "きゅう", "じゅう", "ひらがな", "えいご", "ず", "かたち", "まる", "しかく", "さんかく", "ほしがた",

    // 生活
    "かさ", "はし", "さら", "こっぷ", "すぷーん", "ふぉーく", "なべ", "やかん", "はぶらし", "せっけん"
]


let isLocked = false;
let nextButton = false;

function getRandomIndex() {
    return Math.floor(Math.random() * hiragana.length);
}

function updateHiragana() {
    const display = document.getElementById("hiragana-display");
    display.innerHTML = "";

    let index = getRandomIndex();

    const current = document.createElement("div");
    current.className = "char";
    current.textContent = hiragana[index];

    display.appendChild(current);
}

function playSound() {

    const display = document.querySelector(".char");
    display.classList.add("active");
    if (display) {
        const speech = new SpeechSynthesisUtterance(display.textContent);
        speech.lang = "ja-JP";
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1.0;

        // 日本語の音声リストを取得して適用
        const voices = speechSynthesis.getVoices();
        const jpVoice = voices.find(voice => voice.lang === "ja-JP" && voice.name.includes("Google"));
        if (jpVoice) {
            speech.voice = jpVoice;
        }

        speechSynthesis.speak(speech);
    }
}

// 音声データのロードを確実にする
speechSynthesis.onvoiceschanged = () => {
    console.log(speechSynthesis.getVoices());
};

function startCountdown() {
    isLocked = true;


    let mouth = document.querySelectorAll(".mouth");

    mouth.forEach(mouth => mouth.classList.remove("active"));
    mouth.forEach(m => m.classList.add("move"));

    setTimeout(() => {

        mouth.forEach(m => m.classList.remove("move"));
        mouth.forEach(m => m.classList.add("active"));
    }, 1000);



    setTimeout(() => {

        isLocked = false;
        nextButton = true;
    }, 1000);
}


document.addEventListener("keydown", (event) => {
    if (!isLocked & !nextButton) {
        if (event.code === "Space") {
            event.preventDefault();
        }
        playSound();
        startCountdown();




    }
    if (nextButton) {
        if (event.code === "Space") {
            event.preventDefault();
        }
        updateHiragana();
        nextButton = false;

    }
});

document.addEventListener("click", (event) => {
    if (!isLocked & !nextButton) {
        if (event.code === "Space") {
            event.preventDefault();
        }
        playSound();
        startCountdown();





    }
    if (nextButton) {
        if (event.code === "Space") {
            event.preventDefault();
        }
        updateHiragana();
        nextButton = false;

    }
});

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



window.addEventListener('load', updateHiragana);
window.addEventListener('load', wincol);
