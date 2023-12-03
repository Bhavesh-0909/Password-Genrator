const strengthText = document.querySelector('.strengthText');
const copyButton = document.querySelector('.copyButton');
const passwordDisplay = document.querySelector('#password-display');
const passLength = document.querySelector(".passLength");
const passLengthSlider = document.querySelector(".passLengthSlider");
const copymsg = document.querySelector(".copymsg");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const strengthGlow = document.querySelector(".strengthGlow");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const generatButton = document.querySelector(".generatButton");

let password = "";
let checkcount = 0;
let passwordLength = 10;
let symbolsChar = '~!@#$%^&*()-_=+;[],./<>?:"{}\|"';
handlesilder();

function handlesilder(){
    passLengthSlider.value = passwordLength;
    passLength.innerText = passwordLength;
    const min = passLengthSlider.min;
    const max = passLengthSlider.max;
    passLengthSlider.style.backgroundSize =( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function indicator(color){
    strengthText.innerText = "Strength";
    strengthGlow.style.backgroundColor = color;
    strengthGlow.style.boxShadow = `0px 0px 12px 1px ${color}`;
    
}
function getRndNo(max, min){
    return Math.floor(Math.random()*(max-min)+min);
}

function getNumber(){
    return getRndNo(0,9);
}
function getLowercase(){
    return String.fromCharCode(getRndNo(97,123));
}
function getUppercase(){
    return String.fromCharCode(getRndNo(65,91));
}
function getSymbols(){
    return symbolsChar.charAt(getRndNo(0,31));
}
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNum = true;
    if (symbols.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        indicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        indicator("#ff0");
    } 
    else {
        indicator("#f00");
    }
}

async function copiedfun(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Copied";
    }
    catch(e){
        copymsg.innerText = "failed";
    }
    copymsg.classList.add("copiedmsg");

    setTimeout(()=>{
        copymsg.classList.remove("copiedmsg");
        copymsg.innerText = "";
    },2000);
}

passLengthSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handlesilder();
});

copyButton.addEventListener('click', ()=>{
    if(passwordDisplay.value)
        copiedfun();
});

function checkboxcount() {
    checkcount = 0; 
    allcheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkcount++;
        }
    });    
}

allcheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', checkboxcount);
})


generatButton.addEventListener('click',()=>{
    
    if(checkcount == 0) 
        return;

    
    if(passwordLength<checkcount){
        passwordLength = checkcount;
        handlesilder();
    }
    password = "";

    let arrayOfFunction = [];
    if(uppercase.checked) arrayOfFunction.push(getUppercase);
    if(lowercase.checked) arrayOfFunction.push(getLowercase);
    if(numbers.checked) arrayOfFunction.push(getNumber);
    if(symbols.checked) arrayOfFunction.push(getSymbols);

    for(let i = 0; i<checkcount; i++){
        password += arrayOfFunction[i]();
    }

    for(let i = 0; i<passwordLength-arrayOfFunction.length;i++){
        let randIndex = getRndNo(0 , arrayOfFunction.length);
        password += arrayOfFunction[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
})