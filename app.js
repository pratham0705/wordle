let gameBtns = document.querySelectorAll(".gameBtn");
let submit = document.querySelector(".submit");
let main = document.querySelector(".main");
let body = document.querySelector("*");
let keys = document.querySelectorAll(".key");
let guessText = document.querySelector("#guess");
let winText = document.querySelector("#win");
let winContainer = document.querySelector(".win");
let keyboard = document.querySelector(".keyboard");
let next = document.querySelector(".next");
let retry = document.querySelector(".retry");
let first = document.querySelector(".first");
let start = document.querySelector(".start");
let change = document.querySelector(".change");
let hint = document.querySelector(".hintI");
let hintLetter = document.querySelector(".letter");
let hintMain = document.querySelector(".hint");
let dlt = document.querySelector(".delete");

let gameStarted = false;
submit.disabled = true;

let guessCount = 6;
let word = "";
let meaning = "";
let guess = "";
let currentIdx = 0;
let hintUsed = false;
let score = 0;

body.classList.add("bgColor");
submit.classList.add("grey");
next.classList.add("hide");
retry.classList.add("hide");
change.classList.add("hide");
keyboard.classList.add("hide");
main.classList.add("mainPosition");
hintLetter.classList.add("hide");


let url2 = "https://api.dictionaryapi.dev/api/v2/entries/en/";
async function getMeaning() {
    setTimeout(async () => {
        try {
            let res = await axios.get(url2 + `${word}`);
            meaning = res.data[0].meanings[0].definitions[0].definition;
            change.classList.add("hide");
        } catch (e) {
            console.log("Meaning not found");
            change.click();
        }
    }, 100);
}

let url = "https://api.datamuse.com/words?sp=?????&max=1000"
async function getWord() {
    try{
        let words = await axios.get(url);
        let idx = Math.floor(Math.random()*1000);
        let temp = words.data[idx].word.toUpperCase();
        word = temp.split(" ").join("");
        console.log(word);
        keyboard.classList.remove("hide");
        start.classList.add("hide");
        main.classList.remove("mainPosition");
    } catch(e){
        console.log("error-" , e)
    }
}

let hintFunc = ()=>{
    hint.removeEventListener("click", handleHintFunc);
    hint.addEventListener("click", handleHintFunc);
}


let handleHintFunc =()=>{
    if (hintUsed) return;
    let randIdx = Math.floor(Math.random()*5)+1;
    while( (currentIdx + (randIdx - 1) - 5) >= 0 && (gameBtns[(currentIdx+(randIdx-1)-5)]?.classList.contains("green"))){
        randIdx = Math.floor(Math.random()*5)+1;
    }
    gameBtns[currentIdx+(randIdx-1)].innerText = word[randIdx-1];
    gameBtns[currentIdx+(randIdx-1)].classList.add("green");
    console.log(randIdx);
    if(hint.disabled){
        hintLetter.innerText = "You Used your hint";
    }
    setTimeout(()=>{
        hint.disabled = true;
    },3000);
    gameBtns[currentIdx + (randIdx - 1)].addEventListener("keydown", (e) => {
        if (e.key === 'Backspace') {
            gameBtns[currentIdx + (randIdx - 1)].innerText = `${word[randIdx - 1]}`;
            e.preventDefault();
        }
});
hintUsed = true;
}

start.addEventListener("click" , ()=>{
    hint.disabled = false;
    getMeaning();
    getWord();
    hintFunc();
});

change.addEventListener("click" , ()=>{
    getWord();
    getMeaning();
});

for (let i=0 ; i<gameBtns.length ; i++){
    gameBtns[i].addEventListener("keydown" , (e)=>{
        if (/^[a-zA-Z]$/.test(e.key) && guess.length<5){
            gameBtns[currentIdx].innerText = e.key;
            currentIdx++;
            guess += e.key.toUpperCase();
            if(guess.length === 5 ){
                submit.classList.add("green");
                submit.disabled = false;
            }
            if (currentIdx < gameBtns.length) {
                gameBtns[currentIdx].focus(); 
            }
        } if(e.key === 'Backspace' && currentIdx>=0){
            const focusedBtn = document.activeElement;
            if (gameBtns[currentIdx-1].disabled && focusedBtn){
                gameBtns[currentIdx].innerText = gameBtns[i].innerText;
                e.preventDefault();
            }else{
                gameBtns[currentIdx].innerText = "";
                gameBtns[currentIdx].focus();
                currentIdx--;
                guess = guess.slice(0,-1).toUpperCase();
            }
            if(guess.length<=4){
                submit.classList.remove("green");
                submit.disabled = true; 
            }
        } if (!/^[a-zA-Z]$/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    })
}

submit.addEventListener("click", ()=>{
    if(guess.trim() === word){
        score++;
        body.classList.add("green");
        submit.classList.add("green");
        winText.innerHTML = `Congractulations you win <br> Word : ${word} <br> Meaning : ${meaning} <br> <br> Score :  ${score}` ;
        guessText.classList.add("hide");
        keyboard.classList.add("hide");
        winText.classList.remove("hide");
        next.classList.remove("hide");
        nextRound();
        retry.classList.add("hide");
        hintMain.classList.add("hide");
    } else{
        guessCount--;
        winText.classList.add("hide");
        next.classList.add("hide");
        guessText.classList.remove("hide");
        keyboard.classList.remove("hide");
        keyboard.classList.remove("keyboardPosition");
        if(guessCount === 0){
            gameBtns.forEach(btn=>{
                btn.disabled = true;
                guessText.innerHTML = `You Lose <br> Out of Chances <br> <br>
                Score : ${score}`;
            })
            body.classList.add("red");
        } else {
            retry.classList.remove("hide");
            retryBtn();
            guessText.innerHTML = `Wrong Guess <br> ${guessCount} Guesses left`;
        }
        setTimeout(()=>{
            guess = "";
        },100);
        submit.disabled = true;
        submit.classList.remove("green");
        submit.classList.add("grey");
        letterCheck();
        gameBtnCheck();
        disable();
        hintFunc();
    }
});

keys.forEach(key=>{
    key.addEventListener("click" , ()=>{
        gameBtns[currentIdx].innerText = key.innerText;
        currentIdx++;
        guess += key.innerText;
        if(guess.length === 5 ){
            submit.classList.add("green");
            submit.disabled = false;
        }
    })
})

dlt.addEventListener("click" ,()=>{
    const focusedBtn = document.activeElement;
            if (gameBtns[currentIdx-1].disabled && focusedBtn){
                gameBtns[currentIdx].innerText = gameBtns[i].innerText;
                e.preventDefault();
            }else{
                gameBtns[currentIdx].innerText = "";
                gameBtns[currentIdx].focus();
                currentIdx--;
                guess = guess.slice(0,-1).toUpperCase();
            }
            if(guess.length<=4){
                submit.classList.remove("green");
                submit.disabled = true; 
            }
})

let disable = () => {
    for (let i = currentIdx - 5; i < currentIdx; i++) {
        if (i < 0) continue;
        const btn = gameBtns[i];
        btn.disabled = true;
    }
};

let enaable = ()=>{
    gameBtns.forEach(btn=>{
        if(btn.innerText !== ""){
            btn.disabled = false;
        }
    })
}

let nextRound = ()=>{
    next.removeEventListener("click", startNewRound);
    next.addEventListener("click", startNewRound);
}

let retryBtn =()=>{
    score = 0;
    retry.removeEventListener("click", gameReset);
    retry.addEventListener("click", gameReset);
}

let startNewRound = ()=>{
    gameReset();  
    getWord(); 
    getMeaning();
    hint.disabled = false;
    hintFunc();
    hintUsed = false;
    resetBtns();
    hintMain.classList.remove("hide");
}

let gameBtnCheck = () => {
    for (let i = currentIdx - 5; i < currentIdx; i++) {
        if (i < 0) continue;
        
        const btn = gameBtns[i];
        const letter = btn.innerText;
        const positionInWord = i % 5;
        
        if (letter === word[positionInWord]) {
            btn.classList.add("green");
            btn.disabled = true;
        } 
        else if (word.includes(letter)) {
            if (!btn.classList.contains("green")) {
                btn.classList.add("orange");
            }
        } 
        else {
            btn.classList.add("black");
            btn.disabled = true;
        }
    }
};

let letterCheck = ()=>{
    for (let i = 0; i < word.length; i++) {
        if (guess[i] !== word[i] && word.indexOf(guess[i]) === -1) {
            keys.forEach(key => {
                if(key.innerText == `${guess[i]}`){
                    key.classList.add("black");
                    key.disabled = true;
                }
            })
        } else {
            keys.forEach(key=>{
                if(key.innerText == `${guess[i]}` && word[i] === guess[i]){
                    key.classList.add("green");
                } if (word.indexOf(key.innerText) !== -1 && key.innerText !== "" &&
                     guess.indexOf(key.innerText) !== -1){
                    key.classList.add("orange");
                }
            })
        }
    }
}

let resetBtns = ()=>{
    gameBtns.forEach(btn=>{
        btn.classList.remove("orange");
    })
    keys.forEach(key=>{
        key.classList.remove("orange");
    })
}

let resetIndex = ()=>{
    currentIdx = 0;
    gameBtns[0].focus();
}

let gameReset = ()=>{
    gameStarted = true;
    submit.disabled = true;
    submit.classList.add("grey");
    submit.classList.remove("green");
    gameBtns.disabled = false;
    guess = "";
    guessCount = 6;
    body.classList.remove("green");
    body.classList.remove("red");
    currentIdx = 0;
    gameBtns.forEach(btn=>{
        btn.innerText = "";
        btn.disabled = false;
        btn.classList.remove("green");
        btn.classList.remove("black");
        btn.classList.remove("black" , "orange" , "green");
        btn.autofocus = true;
    })
    keys.forEach(key=>{
        key.classList.remove("green");
        key.classList.remove("black");
        key.disabled = false;
    })
    winText.classList.add("hide");
    next.classList.add("hide");
    retry.classList.add("hide");
    guessText.classList.add("hide");
    keyboard.classList.remove("hide");
    keyboard.classList.add("keyboardPosition");
    enaable();
    resetIndex();
    resetBtns();
}