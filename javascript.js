
let displayBarValue = '';
let operand = '';
let operators = [];
let operands = [];
let equalPressed = false;

const display = document.querySelector('.display');
const numInputs = document.getElementsByClassName('numButtons');
const nonNumberInputs = document.getElementsByClassName('actionButton');
const equal = document.getElementById('equal');
const addButton = document.getElementById('add');
const minusButton = document.getElementById('minus');
const multiplyButton = document.getElementById('multiply');
const divideButton = document.getElementById('divide');
const modulusButton = document.getElementById('modulus');
const allClearButton = document.getElementById('ac');
const clearButton = document.getElementById('clear');
const numberButtons = document.querySelectorAll('button');
const operations = [addButton, minusButton, multiplyButton, divideButton, modulusButton];

let operatorFunctions = {
  'add': function(a, b) { return parseFloat(a) + parseFloat(b) } ,
  'minus': function(a, b) { return parseFloat(a) - parseFloat(b) },
  'divide': function(a, b) { return parseFloat(a) / parseFloat(b) },
  'modulus': function(a, b) { return parseFloat(a) % parseFloat(b) },
  'multiply': function(a,b) { return parseFloat(a) * parseFloat(b) },
};

numberButtons.forEach(function(button) {
  if (isNaN(button.id)){
    button.classList.add('actionButton');
  } else {
    button.classList.add('numButtons');
  }
});
const notNumbers = Array.from(nonNumberInputs);
const numbers = Array.from(numInputs);

numbers.forEach((number) => number.addEventListener('click', addToDisplayBar)); 
operations.forEach((operation) =>  operation.addEventListener('click' , operatorClicked)); 
equal.addEventListener('click', equalClicked);
allClearButton.addEventListener('click', clearAll);
clearButton.addEventListener('click', singleClear);


function addToDisplayBar(e){
  if (equalPressed === true) {        //if number clicked after equal is clicked => new start so everything is cleared 
    displayBarValue = '';
    operand = '';
    operators = [];
    operands = [];
    equalPressed = false;
  }
  displayBarValue += e.target.id;
  updateDisplayBar(displayBarValue);
  return displayBarValue;
}
function operatorClicked(e){
  if (getDisplayBarValue() === ''){  //if display empty then operators dont do anything
    return;
  }
  if (operators.length !== 0) {      //if operators are clicked more than once update operators array to new operator clicked and do not change anything else
    operators[0] = e.target.id;
    return;
  }
  
  if (equalPressed === true){                       //if operator is used after equal , the operator uses the new value from equal
    operators.push(e.target.id);
    equalPressed = false;
    return;
  }
  // allows us to chain operations 9 + 3 + 2 + 5 while evaluating in pairs. takes [0,1] and [+] takes 
  //first two indexes and operates on them then pushes the answer back in to [0, 1, 1] and then cleans the arrays => [1] and []
  if (getDisplayBarValue() !== '' && equalPressed === false){  
    operand = displayBarValue;
    if (operands.length === 0) {
      operands.push(operand);
      operators.push(e.target.id);
    }
    else {
      operands.push(operand);
      operators.push(e.target.id);
      operands.push(operate(operands[0], operators[0], operands[1]));
      operands.splice(0,2);
      operators.splice(0,1);
      displayBarValue = `${operands[0]}`;
      updateDisplayBar(displayBarValue);
    }
    displayBarValue = '';
  }
}

function equalClicked() {
  if ((operands.length === 0 || operators.length === 0)){       // doesnt do anything if there are no operations or operators
    return;
  }
  
  operands.push(getDisplayBarValue());

  if (operands[1] === '0' && operators[0] === 'divide'){    //dividing by zero
    display.innerHTML= 'ERROR'
    displayBarValue = '';
    operand = '';
    operators = [];
    operands = [];
    equalPressed = false;;
    return;
  }

  operands.push(operate(operands[0], operators[0],operands[1]));
  operands.splice(0,2);
  operators.splice(0,1);
  displayBarValue = `${operands[0]}`;
  updateDisplayBar(displayBarValue);
  displayBarValue = '';
  return equalPressed = true;

}
function getDisplayBarValue() {
  return document.querySelector('.display').innerHTML;
}
function updateDisplayBar(displayBarValue) {
  display.innerHTML = displayBarValue.substring(0,9);
}


function operate(firstOperand, operator, secondOperand) {
  return operatorFunctions[operator](firstOperand,secondOperand);
}

function clearAll() {
  displayBarValue = '';
  operand = '';
  operators = [];
  operands = [];
  equalPressed = false;
  updateDisplayBar('');
}
function singleClear() {
  const stringArray = display.innerHTML.split('');
  stringArray.pop();
  displayBarValue = stringArray.join('')
  updateDisplayBar(displayBarValue);
}

/*
when number buttons are clicked => update display bar and display bar value
make display bar maximum 9 digits 
//first operation
when an operator is clicked and displayBarValue is not empty && firstOperand is  empty, it stores displayBarValue in firstOperand then empties displayBarValue. 


when equal is clicked it takes whatever is on the displaybar and stores it as second operand, then it operates, firstOperand (+/* %-) secondOperand, displays the result and then sets firstOperand to the displayBarValue.


*/

