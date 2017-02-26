//basically building an api


//building 2 constructors that the user can use to make flash cards


//store the flash cards somewhere


//constructor called BasicCard


//constructor called ClozeCard\


//node application with commands


//Menu screen

//use inquirer

//Create a Basic Card
//Create a Cloze card
//Study flash cards
//exit program




//create a basic card selection

//use inquirer
//program will ask for front of card (question)
//program will ask for back of card (answer)
//program will ask for variablename?????

//runs basiccard constructor, pushes new object to basic array
//logs ("basic card created");
//prompts user to return to menu or exit program




//create a cloze card selection

//use inquirer


//program will ask for complete answer sentence
//program will ask for the part of the answer sentence to omit
//program will ask for variablename???

//runs clozecard constructor, pushes new object to cloze array
//logs (cloze card created);
//prompts user to return to menu or exit program


//study flash cards selection

//use inqurirer

//loop through basic flash card array, if finished or empty, loop through clozure array, if finished or empty, display score, prompt user to return to menu or exit program













//below code works so far needs additional logic, see above note//




var inquirer = require("inquirer");


var objectArray = [];


var question1 = {
	message: "What the color of a banana?",
	answer: "yellow"
}


objectArray.push(question1);
console.log(objectArray);
console.log(objectArray[0].message)
console.log(objectArray[0].answer);

//above works so far


runPrompt(objectArray.length)


  function runPrompt(timesToRun){
  var questionIndex = 0;
  var currentQuestion = objectArray[questionIndex].message;
  var currentAnswer = objectArray[questionIndex].answer
  if(timesToRun === 0){
    return;
  }
  
      inquirer.prompt([
        {
	          type: "input",
	          name: "option",
	          message: currentQuestion
	    }]).then(function (answers) {
	    	if(answers.option === currentAnswer){
	    		console.log("correct!!");
	    	}else{
	    		console.log("Incorrect! Answer was: " + currentAnswer)
	    	}
	    question++	
	    runPrompt(timesToRun-1);
	      
       });
    
  }
