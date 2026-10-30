const morseBank ={
    'A': '·-', 'B': '-···', 'C': '-·-·',
  'D': '-··', 'E': '·', 'F': '··-·',
  'G': '--·', 'H': '····', 'I': '··',
  'J': '·---', 'K': '-·-', 'L': '·-··', 
  'M': '--', 'N': '-·', 'O': '---',
  'P': '·--·', 'Q': '--·-', 'R': '·-·',
  'S': '···', 'T': '-', 'U': '··-',
  'V': '···-', 'W': '·--', 'X': '-··-', 
  'Y': '-·--', 'Z': '--··', ' ': '/', 
  '1': '·----',  '2': '··---', '3': '···--', '4': '····-', '5': '·····',
  '6': '-····',  '7': '--···', '8': '---··', '9': '----·', '0': '-----'
}
//my songs BPM (128)
const BPM=(60/128)*1000;
let currentMorseLoop=0;

//change later


function textToMorse(text){
    //clear old and clean text
    let result = ""
    let upperText = text.toUpperCase();

    //for each character
    for(let x=0; x<upperText.length; x++){
        let char=upperText[x]
        result += morseBank[char] + " "
    }
    //removes extra spaces it finds white space \s and look for all of them /g a replace thme with 1 space, also trim the star and end
    return result.replace(/\s+/g, ' ').trim()
}

//I can run this function on a await to make it delay the next code
function delay(ms){
    //creates a promise that makes sure teh code will finish
    return new Promise(resolve => 
        //will call resolve when the amount of time is up
        setTimeout(resolve, ms)
    )
}
function stopMorseDisplay(){
    currentMorseLoop++
}
async function displayMorseSlowly(morseString, displayElement) {
    //clears old text
    stopMorseDisplay()
    const thisLoop=currentMorseLoop;
    displayElement.textContent= ""

    for (let x=0; x< morseString.length; x++){
        //stops a bug to prevent two displaymorseslowly from happening
        if(thisLoop!==currentMorseLoop){
            return
        }
        //find the character
        const char =morseString[x]
        //puts it in the display
        //DOT in ms - these time are becase i wanted to match my beat

        let pauseTime=BPM

        if (char==="/"){
            // DASHES
            pauseTime=BPM*2
        }  
        //runs teh function and waits until its done
        await delay(pauseTime)
                displayElement.textContent+=char;

    }
}
