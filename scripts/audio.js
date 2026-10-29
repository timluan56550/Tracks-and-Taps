// const tutorialAudio =document.getElementById("tutorialAudio")
const gameAudio = document.getElementById("gameAudio")
const morseAudio=new Audio("audio/1000.wav")
const tutorialOverlay=document.getElementById("tutorial")
let gameStart=false;
//loop
// tutorialAudio.loop=true;
gameAudio.loop=true
morseAudio.loop=true;
morseAudio.volume=0.2
const manualMorseAudio=new Audio("audio/1000.wav")
manualMorseAudio.volume=0.2
let beepTimer=null;
let minSound=30
let soundStartTime=0;
function startTelegraph(){
    morseAudio.currentTime=0;
   soundStartTime=performance.now()
    morseAudio.play()
}
function stopTelegraph(){
    const elapsedTime=performance.now()-soundStartTime
    const remainingTime=minSound-elapsedTime
    if(remainingTime>0){
        setTimeout(()=>{
            morseAudio.pause();
            morseAudio.currentTime=0;
        }, remainingTime);
    }else{
        morseAudio.pause();
    morseAudio.currentTime = 0;
    }
}
function beep(duration){
    if(beepTimer){
        clearTimeout(beepTimer)
    }
    manualMorseAudio.volume=0.2
    manualMorseAudio.currentTime=0
    //plays and if fails continute
    manualMorseAudio.play().catch(()=>{})
    beepTimer=setTimeout(()=>{
        manualMorseAudio.pause();
        manualMorseAudio.currentTime=0
    }, duration)
}
//fade the audio out and in
function fadeAudio(fadeIn){
    fadeIn.volume=0
    fadeIn.play()
    const fadeInterval = setInterval(()=>{
        //keep decreaseing by 0.1 until it is less
        if(fadeIn.volume<0.049){
            fadeIn.volume+=0.001;
        }else{
            fadeIn.volume=0.05;
            clearInterval(fadeInterval)
        }
    //change this to change the duration of the fade
    }, 400);
    
}

tutorialOverlay.addEventListener("click",()=>{
    if(gameStart){
        return
    }
    gameStart=true;
    tutorialOverlay.classList.add("hidden")
    fadeAudio(gameAudio);
    receiveCoworkerMessage()
})
