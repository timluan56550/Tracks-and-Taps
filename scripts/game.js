const safe = [
    "CLEAR",
    "CLEAR",
    "SAFE",
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
const cities ={
    'LEFT': 'BOSTON',
    'MIDDLE': 'CHICAGO',
    'RIGHT': 'DALLAS'
}
let score=0;
const maxStrikes=3
let strikes=0;
let isGameover=false;
let currentRound=null;
let userInput=""
//picks a random item int he array
function getRandomMessage(array){
    const randomIndex=Math.floor(Math.random()*array.length)
    return array[randomIndex]
}

function generateMessage(){
    //% cahnce of picking an option form safe array
    const isSafe=Math.random()>0.4
    let status=null;
    let direction=null;

    if(isSafe){
        status=getRandomMessage(safe)
        direction=getRandomMessage(threeDirections)
    }else{
        status=getRandomMessage(hazard)
        direction=getRandomMessage(twoDirections)
    } 
    const message=status+" "+direction

    return{
        text:message,
        status:status,
        direction: direction,
        isSafe: isSafe,
        //if safe true then pick 3 paths otherwise 2
        paths: isSafe ? 3:2,
        morse: textToMorse(message)        
    }
}

function receiveCoworkerMessage(){
currentRound= generateMessage()

const morseDisplayElement = document.getElementById("morseDisplay")
displayMorseSlowly(currentRound.morse, morseDisplayElement)

const wordDisplay = document.getElementById("wordDisplay")
wordDisplay.textContent = currentRound.text
}
function evaluateMorse(){
    if(!currentRound||isGameover){
        return;
    }
    //removes whtiespace
    const playerTyped=currentMorseText.replace(/\s+/g," ").trim();
    const expectedMorse=currentRound.targerMorse.replace(/\s+/g," ").trim();
    console.log("Destination", currentRound.targetCity)
    console.log("Exspected Morse:", expectedMorse);
    console.log("Player Morse:", playerTyped)

    if(playerTyped===expectedMorse){
        score+=100;
        console.log("Correct. Score:",score)

        // updateUI()
        // advanceNext()
    }else{
        strikes+=1;
        console.log("wrong. Score:",score)
        console.log("      Strikes:",strikes)
        // updateUI()
        if(strikes>=maxStrikes){
            // gameover();
        } else{
            // advanceNext();
        }
    }
}