let currentMorseText=""
const morseInput=document.getElementById("morseInput")
const typingDisplay =document.getElementById("typingDisplay")
//i use to use c as my morse key but i change it to m and didnt change th variable names
let cPressStartTime=0;
let isCHeld=false;
const dashTime=150;

typingDisplay.addEventListener("click", ()=>{
    morseInput.focus()
})
//used part of my code from my previous week to maek this cursor
function moveCursor(){
const cursorElement =document.getElementById("cursorMove")
const letterSpans= typingDisplay.querySelectorAll(".letter");
if(letterSpans.length===0){
    cursorElement.style.left="1px";
    cursorElement.style.top="5px"
    return
}
const lastSpan=letterSpans[letterSpans.length-1];
const leftPosition=lastSpan.offsetLeft+lastSpan.offsetWidth;
cursorElement.style.left=leftPosition+"px";
cursorElement.style.top=lastSpan.offsetTop+"px"
}

//user part of my code from my previous week to make this input
function playerInputCheck(){
const cursorElement=document.getElementById("cursorMove")
//clear old text
typingDisplay.innerHTML=""
typingDisplay.appendChild(cursorElement)
for(let x=0; x<currentMorseText.length; x++){
    const charSpan =document.createElement("span")
    charSpan.innerText=currentMorseText[x]
    charSpan.classList.add("letter")
    typingDisplay.appendChild(charSpan)
}
moveCursor()
}

window.addEventListener("keydown", (e)=>{

    if(e.key==="Backspace"){
        if(currentMorseText.length>0){
            //this is so wehny ou press backsapce on a / it remove sthe spaces too
            if(currentMorseText.endsWith(" / ")){
                currentMorseText=currentMorseText.slice(0, -3)
            } else{
                currentMorseText=currentMorseText.slice(0, -1)
            }
            playerInputCheck();
            moveCursor()
        }
        return;
    }
//space bar hold start
    if(e.key==="m"){
        if(!isCHeld){
            isCHeld=true;
            cPressStartTime=performance.now()
            startTelegraph()
        }
        return;
    }
    if(e.key==="x"){
        currentMorseText+=" ";
        playerInputCheck();
        return
    }
    if(e.key==="z"){
        currentMorseText+=" / ";
        playerInputCheck();
        return
    }

//stops keys like shift or ctrl goint rhough
    if(e.key.length>1){
        return;
    }
    let typedChar=e.key
    if(typedChar==="."){
        typedChar="·"
        currentMorseText+=typedChar;
        beep(80)
    playerInputCheck();
        return;
    }
    if(typedChar==="-"){
        
        typedChar="-"
        currentMorseText+=typedChar;
        beep(240)
        playerInputCheck()
        return;
    }
    if(typedChar==="/"){
        typedChar =" / "
        currentMorseText+=typedChar;

        playerInputCheck()
        return;
    }
    currentMorseText+=typedChar;
    playerInputCheck();
})

window.addEventListener("keyup",(e)=>{
if(e.key==="m"){
        if(isCHeld){
            stopTelegraph()
            const holdDuration=performance.now()-cPressStartTime
            isCHeld=false;
            if(holdDuration>=dashTime){
                currentMorseText+="-"
            }else{
                currentMorseText+="·"
            }
            playerInputCheck();
        }
    }
})


window.addEventListener("resize", ()=>{
    moveCursor()
})