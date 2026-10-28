// const tutorialAudio =document.getElementById("tutorialAudio")
const gameAudio = document.getElementById("gameAudio")
const tutorialOverlay=document.getElementById("tutorial")
let gameStart=false;
//loop
// tutorialAudio.loop=true;
gameAudio.loop=true


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
    }, 500);
    
}

tutorialOverlay.addEventListener("click",()=>{
    if(gameStart){
        return
    }
    gameStart=true;
    tutorialOverlay.classList.add("hidden")
    fadeAudio(gameAudio);
    receiveCoworkerTransmission()
})
