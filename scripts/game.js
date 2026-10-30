const safe = [
    "CLEAR",
    "SAFE",
    "VALID",
    "PROCEED",
    "NO THREAT",
    "OPEN"
]
const hazard = [
    "TREE FALLEN",
    "TRACK NOT CLEAR",
    "BLOCKED",
    "HAZARD",
    "FLOOD",
    "BROKEN",
    "CLOSED",
    "DANGER",
]
const threeDirections =[
    "LEFT",
    "RIGHT",
    "MIDDLE"
]
const twoDirections =[
    "LEFT",
    "RIGHT"
]
const cities =[
    "OAKRIDGE", "MILLVILLE", "FAIRVIEW", 
    "BLACKWOOD", "STONEFIELD", "OAKHAVEN",
    "PINEVILLE", "ROCKFORD", "COLDWATER", 
    "RIDGEBURY", "GREEN CREEK", 
    "CEDAR RIDGE", "MAPLE GROVE", 
    "PINE BLUFF", "SILVER CREEK", 
    "WILLOW CREEK", "FOX RUN",
    "BEAR CREEK", "MILL CREEK", 
    "SPRING VALLEY"
]
//temporary images
const scenes={
  paths2: "https://placehold.co/700x100/white/000000?text=TRACK+MAP:+2+PATHS",
  paths3: "https://placehold.co/700x100/white/000000?text=TRACK+MAP:+3+PATHS",
  trainMoving: "https://placehold.co/700x100/green/white?text=TRAIN+MOVING...",
  crash: "https://placehold.co/700x100/red/white?text=TRAIN+CRASHED!",
  win: "https://placehold.co/700x100/yellow/000000?text=SHIFT+COMPLETE!+YOU+WIN!"
}
const startTime=120;
const timeDecrease=5;
let currentRound=null;
let timer=null;
let timeleft=startTime
let isIntermission=false;
const maxStrikes=3
let strikes=0;
let isGameover=false;
let currentRoundNumber=0;
let userInput=""
const maxRounds=3


function sceneImage(image){
    const sceneImgElement=document.getElementById("sceneImg")
    sceneImgElement.src=scenes[image]
}


const submitBtn=document.getElementById("submitText")
submitBtn.addEventListener("click", async()=>{
if (submitBtn.disabled||isIntermission){
    return
}
stopMorseDisplay()
stopTimer()
narratorMessage("SENDING TRANSMISSION...")
submitBtn.disabled=true

const typingDisplay =document.getElementById("typingDisplay")
const animation=[
".","..", "...",
".","..", "...",
".","..", "..."
]

    //repeats the number of items in the array with each loop having dots= index of loop#
    for (let dots of animation){
        typingDisplay.textContent="SENDING TRANSMISSION"+dots;
        await delay(400);
    }
await evaluateMorse()
})






async function evaluateMorse(){
    if(!currentRound||isGameover){
        return;
    }
    stopTimer()
    //removes whtiespace
    const playerTyped=currentMorseText.replace(/\s+/g," ").trim();
    const expectedMorse=currentRound.targetMorse.replace(/\s+/g," ").trim();
    // console.log("Destination", currentRound.targetCity)
    // console.log("Exspected Morse:", expectedMorse);
    // console.log("Player Morse:", playerTyped)

    if(playerTyped===expectedMorse){
narratorMessage("TRANSMISSION SUCCESSFUL! Train routed to "+currentRound.targetCity)
        updateUI()
        //startIntermission ( crash, win)
        if(currentRoundNumber>=maxRounds){
            await startIntermission(false,true)
        }else{
            await startIntermission(false,false)
        }
    }else{
        strikes+=1;
        console.log("Wrong! Strikes:",strikes)
        updateUI()
        if(strikes>=maxStrikes){
            narratorMessage("SIGNAL MISMATCHED! Train crashed")
            await startIntermission(true, false)
        } else{
            narratorMessage("SIGNAL MISMATCHED! Coworker didn't understand what you were saying (+1 Strike)")

           await startIntermission(false, false);
        }
    }
}



async function startIntermission(crash, win){
    isIntermission=true;
    stopTimer()
    if(win){
        sceneImage("win")
        winGame()
        return;
    }
    if(crash){
        sceneImage("crash")
        gameover()
        return;
    }
    //for normal succesful switches
    sceneImage("trainMoving")
    //delay function is in morse.js
    await delay(4500)
    isIntermission=false;
    advanceNext()
}

function advanceNext(){
currentMorseText=""
playerInputCheck();
 if (currentRoundNumber>=maxRounds){
    winGame();
 }else{
    receiveCoworkerMessage()
    submitBtn.disabled=false

 }

}


 
function startTimer(){
    //calculate how much time for a round
    let timerMax = startTime-((currentRoundNumber-1)*timeDecrease);
    //set live timer to timermax
    timeleft=timerMax;

    const timerElement=document.getElementById("timerDisplay")
    timerElement.textContent="TIME: "+timeleft;
    
    timer=setInterval(()=>{
        timeleft-=1
        timerElement.textContent="TIME: "+timeleft;
    
if (timeleft<=0){
    stopTimer()
    handleTimeOut();
}
    }, 1000)

}
function stopTimer(){
    clearInterval(timer);
    timer=null;
}
function handleTimeOut(){
    if(isGameover) return;
    const chance=Math.random()<0.5;
    if(chance){
        narratorMessage("TIME EXPIRED! Your coworker made a blind 50/50 switch and... SUCCEEDED! You got lucky this time")
        advanceNext();
        
    }else{
        strikes+=1
        updateUI()
        if(strikes>=maxStrikes){
        narratorMessage("TIME EXPIRED! Your coworker made a blind 50/50 switch and... FAILED! Train crashed. ")
        gameover()
        }else{
        narratorMessage("TIME EXPIRED! Your coworker made a blind 50/50 switch and... FAILED! (+1 Strike). ")
        advanceNext()
        }
    }
}


function receiveCoworkerMessage(){
    if(isGameover){
        return;
    }
//increase round and generates a new message
    currentRoundNumber+=1
currentRound= generateMessage()
updateUI()
if(currentRound.paths===3){
    sceneImage("paths3")
}else{
    sceneImage("paths2")
}

startTimer();

const morseDisplayElement = document.getElementById("morseDisplay")
displayMorseSlowly(currentRound.morse, morseDisplayElement)
}

function narratorMessage(text){
    const narratorElement=document.getElementById("narratorText");
    narratorElement.textContent=text;
}

//picks a random item int he array
function getRandomMessage(array){
    const randomIndex=Math.floor(Math.random()*array.length)
    return array[randomIndex]
}

function getRandomCities(count){
    //this is so when we prevent duplciate city name it doesnt modify the original array
    const temporaryBank=[...cities]
    const selectedCities=[]
    for(let x=0; x<count;x++){
    const randomIndex =Math.floor(Math.random()*temporaryBank.length)
    //remove the chosen city and put it in the list
    //the [0] makes it so it comes out without teh [""]
    const chosenCity= temporaryBank.splice(randomIndex,1)[0]
    selectedCities.push(chosenCity)
}
return selectedCities;
}

function generateMessage(){
    //% cahnce of picking an option form safe array
    const isSafe=Math.random()>0.5
    let status=null;
    let direction=null;
    let targetDirection=null;
    let paths=0;
    let activeCities={}

    if(isSafe){
        status=getRandomMessage(safe)
        direction=getRandomMessage(threeDirections)
        targetDirection=direction
        paths=3;
        //gets 3 random cities
        const pickedCities=getRandomCities(3);
        activeCities={
            LEFT: pickedCities[0],
            MIDDLE: pickedCities[1],
            RIGHT: pickedCities[2]
        }
    }else{
        status=getRandomMessage(hazard)
        direction=getRandomMessage(twoDirections)
        paths=2;
        //gets 2 random cities
        const pickedCities=getRandomCities(2);
        activeCities={
            LEFT: pickedCities[0],
            RIGHT: pickedCities[1]
        }
        if(direction==="LEFT"){
            targetDirection="RIGHT"
        }else{
            targetDirection="LEFT"
        }
    } 
    const message=status+" "+direction
    const targetCity=activeCities[targetDirection]
console.log(textToMorse(targetCity))
    return{
        text:message,
        status:status,
        direction: direction,
        isSafe: isSafe,
        //if safe true then pick 3 paths otherwise 2
        paths: paths,
        morse: textToMorse(message) ,  
        targetCity: targetCity ,
        targetMorse:textToMorse(targetCity),
        targetDirection:targetDirection,
        cities:activeCities,
    }
}

















function gameover(){
    isGameover=true;
    stopTimer()
    narratorMessage("You have used up all your strikes and crashed! Refresh the page to play again.")

}
function winGame(){
    isGameover=true;
    stopTimer()
    narratorMessage("You have traveled 1000km! SHIFT COMPLETE! SUCCEFULLY REROUTED")
}

function updateUI(){
    const strikeElement=document.getElementById("strikeDisplay");
    const roundElement=document.getElementById("roundDisplay")
    const leftCityElement=document.getElementById("leftCity");
    const middleCityElement=document.getElementById("middleCity");
    const rightCityElement=document.getElementById("rightCity");
    const middleTrack=document.getElementById("middleTrack");

strikeElement.textContent="STRIKES: "+strikes+"/3"
roundElement.textContent="ROUND: "+currentRoundNumber+"/"+maxRounds
leftCityElement.textContent=currentRound.cities.LEFT
rightCityElement.textContent=currentRound.cities.RIGHT






    if(currentRound.paths===3){
        middleCityElement.textContent=currentRound.cities.MIDDLE;
        middleTrack.style.display="block";
    }else{
        middleTrack.style.display="none";
    }


}

