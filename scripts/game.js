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
const maxStrikes=3
let strikes=0;

let isGameover=false;
let currentRoundNumber=0;
let userInput=""

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
    const isSafe=Math.random()>0.4
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




function receiveCoworkerMessage(){
    if(isGameover){
        return;
    }
//increase round and generates a new message
    currentRoundNumber+=1
currentRound= generateMessage()
updateUI()

const morseDisplayElement = document.getElementById("morseDisplay")
displayMorseSlowly(currentRound.morse, morseDisplayElement)
}





function evaluateMorse(){
    if(!currentRound||isGameover){
        return;
    }
    //removes whtiespace
    const playerTyped=currentMorseText.replace(/\s+/g," ").trim();
    const expectedMorse=currentRound.targetMorse.replace(/\s+/g," ").trim();
    console.log("Destination", currentRound.targetCity)
    console.log("Exspected Morse:", expectedMorse);
    console.log("Player Morse:", playerTyped)

    if(playerTyped===expectedMorse){

        updateUI()
        advanceNext()
    }else{
        strikes+=1;
        console.log("Wrong! Strikes:",strikes)
        updateUI()
        if(strikes>=maxStrikes){
            gameover();
        } else{
            advanceNext();
        }
    }
}






const submitBtn=document.getElementById("submitText")
submitBtn.addEventListener("click",()=>{
if (submitBtn.disabled){
    return
}
narratorMessage("SENDING TRANSMISSION...")
    submitBtn.disabled=true
evaluateMorse()

})

function advanceNext(){
currentMorseText=""
playerInputCheck();
 if (currentRoundNumber>=10){
    winGame();
 }else{
    receiveCoworkerMessage()
 }

}
function gameover(){
    isGameover=true;
    const wordDisplay=document.getElementById("wordDisplay")
    wordDisplay.textContent="Uh oh! You went the wrong path and collided! GAME OVER"
}
function winGame(){
    isGameover=true;
        const wordDisplay=document.getElementById("wordDisplay")
     wordDisplay.textContent="You have traveled 1000km! SHIFT COMPLETE! SUCCEFULLY REROUTED"
}
function updateUI(){
    const strikeElement=document.getElementById("strikeDisplay");
    const roundElement=document.getElementById("roundDisplay")
    const leftCityElement=document.getElementById("leftCity");
    const middleCityElement=document.getElementById("middleCity");
    const rightCityElement=document.getElementById("rightCity");
    const middleTrack=document.getElementById("middleTrack");

strikeElement.textContent="STRIKES: "+strikes+"/3"
roundElement.textContent="ROUND: "+currentRoundNumber+"/10"
leftCityElement.textContent=currentRound.cities.LEFT
rightCityElement.textContent=currentRound.cities.RIGHT






    if(currentRound.paths===3){
        middleCityElement.textContent=currentRound.cities.MIDDLE;
        middleTrack.style.display="block";
    }else{
        middleTrack.style.display="none";
    }


}

