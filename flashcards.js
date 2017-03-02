'use strict'


var inquirer = require("inquirer");




//program contained in single object
var flashCardObject = {



	ClozeCard : function (fullText, clozeDel){

		//Cloze constructor, only takes 2 arguments (per homework) NOTE** Prototype error checking method is at the bottom of this document!!!!
		  	this.fullText = fullText;
		  	this.cardBack = clozeDel;
		  	this.cardFront = function () {
		  		return this.fullText.replace(this.cardBack, " ________ ") //simply gives us a blank where we removed the answer	  		
	  		}

	},


	BasicCard : function(front, back)  { //basic card constructor

				this.cardFront = function(){ //set a method here to match Cloze constructor syntax
					return front;
				}
				this.cardBack = back;
	},
	


	
	mainMenu : function (){ //Main screen where user selects next actions

		var that = this; //saving scope

			inquirer.prompt([
				{
					type: "list",
					name: "menu",
					message: "What would you like to do?",
					choices: ["Create a Basic Card", "Create a Cloze Card", "Study Flash Cards", "Exit Program"]				

				}]).then(function (answers) {
			    
					switch(answers.menu) {
						case "Create a Basic Card":
							that.menuBasicCard();
							break;
						case "Create a Cloze Card":
							that.menuClozeCard();
							break;
						case "Study Flash Cards":
							if(that.flashCardArray.length === 0){ //first checks if any flash cards exist
								console.log("\n\nYou have to add some flash cards!\n\n");
								that.mainMenu();
								return;
							}
							that.menuFlashCard(that.flashCardArray.length, 0);
							break;
						case "Exit Program":
							console.log ("You have left the program\n\nHave a nice day!");
							break;
						//switch default not added as a choice outside of this list is not possible!
					}
				});
		},


	menuBasicCard : function (){
		var that = this;

		
		inquirer.prompt([
		{
			type: "input",
			name: "cardFront",
			message: "What would you like the question to be? [FLASHCARD FRONT]"

		},
		{
			type: "input",
			name: "cardBack",
			message: "What is the answer to your question? [FLASHCARD BACK]"
		}


		]).then(function (answers) {    	
			
			var basicCard = new that.BasicCard(answers.cardFront, answers.cardBack);
			that.flashCardArray.push(basicCard);
			console.log("-\n\n~~~~~Your basic flashcard card was saved to your study materials~~~~~~~\n\n-");
			that.mainMenu();

		});
		

	},


	menuClozeCard : function (){
		var that = this;

		

  		inquirer.prompt([
		{
			type: "input",
			name: "cardFront",
			message: "What would you like the full text of your flash card to be? (Next you will select which part to omit)"

		},
		{
			type: "input",
			name: "cardBack",
			message: "What is the part of the full text in your question you would like to omit?"
		}


		]).then(function (answers) {
			var check = answers.cardFront.toLowerCase().indexOf(answers.cardBack.toLowerCase())			
			
			var clozeCard = new that.ClozeCard(answers.cardFront, answers.cardBack); //Cloze inputs are good, creates flash card
			

			clozeCard.dataChecker(check, clozeCard); //see Protype that was created at bottom of document

			
			
		});

	},




	menuFlashCard : function (timesToRun, questionIndex){
		
		if(!timesToRun){ //if times to run is zero or undefined
			console.log("\nAll flash cards complete!\n");
				console.log("Final Score: " + this.userScore + " out of " + this.flashCardArray.length);
				console.log(((this.userScore / this.flashCardArray.length) * 100) + " % correct\n\n"); //computes and displays score as percentage correct
				this.mainMenu();
				return;
		}
		

		var that = this;

		var cardFront = this.flashCardArray[questionIndex].cardFront();
		var cardBack = this.flashCardArray[questionIndex].cardBack;



		inquirer.prompt([
		    {
		          type: "input",
		          name: "userInput",
		          message: cardFront
		    }]).then(function (answers) {
		    	if(answers.userInput.toLowerCase() === cardBack.toLowerCase()){
		    		console.log("You were correct!");
		    		that.userScore++;
		    	}else{
		    		console.log("Incorrect! The answer was: " + cardBack)
		    	}

		    	timesToRun--;
		    	questionIndex++;
			    
			    that.menuFlashCard(timesToRun, questionIndex); //some recursion, to loop the program until all the flash cards have been displayed;
			      
		   });



	},



	flashCardArray : [], //starts empty

	userScore: 0



} //end object declaration




flashCardObject.ClozeCard.prototype.dataChecker = function(data, object) {
	    if(data === -1){
		    	console.log("The text you chose to omit must also appear in the full text. Please try Again");
		    	flashCardObject.menuClozeCard();
		 }else{
	    	flashCardObject.flashCardArray.push(object);
			console.log("-\n\n~~~~~Your Cloze flashcard card was saved to your study materials~~~~~~~\n\n-");
			flashCardObject.mainMenu();

		   }
	};



flashCardObject.mainMenu(); //initial load







