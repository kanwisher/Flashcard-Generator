'use strict'


var inquirer = require("inquirer");

var fs = require("fs");




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
					choices: ["Create a Basic Card", "Create a Cloze Card", "Study Flash Cards", "Save Flash Cards to File", "Load Flash Cards from File", "Exit Program"]				

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
							that.menuFlashCard(that.flashCardArray.length, 0, 0);
							break;
						case "Save Flash Cards to File":
							that.menuSave();
							break;
						case "Load Flash Cards from File":
							that.menuLoad();
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
			that.basicCardsArray.push([answers.cardFront, answers.cardBack])
			var basicCard = new that.BasicCard(answers.cardFront, answers.cardBack);
			that.flashCardArray.push(basicCard);
			console.log("-\n\n~~~~~Your basic flashcard card was saved to your active study materials~~~~~~~\n\n-");
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
			
			var clozeCard = new that.ClozeCard(answers.cardFront, answers.cardBack); //creates flash card
			

			clozeCard.dataChecker(check, clozeCard); //see Protype that was created at bottom of document

			
			
		});

	},




	menuFlashCard : function (timesToRun, questionIndex, score){
		
		if(!timesToRun){ //if times to run is zero or undefined
			console.log("\nAll flash cards complete!\n");
				console.log("Final Score: " + score + " out of " + this.flashCardArray.length);
				console.log(((score / this.flashCardArray.length) * 100) + " % correct\n\n"); //computes and displays score as percentage correct
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
		    		score++;
		    	}else{
		    		console.log("Incorrect! The answer was: " + cardBack)
		    	}
			    
			    that.menuFlashCard(--timesToRun, ++questionIndex, score); //some recursion, to loop the program until all the flash cards have been displayed;
			      
		   });



	},


	menuSave : function (){
		var that = this;

		inquirer.prompt([
		    {
		          type: "input",
		          name: "fileName",
		          message: "What would you like to name your save file? (File extension added automatically)"
		    }]).then(function (answers) {

		    fs.appendFile("fileNames.txt", "," + answers.fileName + ".txt");


			fs.writeFile(answers.fileName + ".txt", "[" + JSON.stringify(that.basicCardsArray) + "," + JSON.stringify(that.clozeCardsArray) + "]", function(err) {

				  // If the code experiences any errors it will log the error to the console.
				  if (err) {
				    return console.log(err);
				  }

				  // Otherwise, it will print: "movies.txt was updated!"
				  console.log("Your flash cards were saved!");
				  that.mainMenu();

				});
			});
	},


	menuLoad : function (){ // felt there was probably a more sensible solution to this part of my problem, but I wanted it to be pretty flexible...

		var that = this;
		that.flashCardArray.length = 0; //clear flashCardArray on each load

		fs.readFile("fileNames.txt", "utf8", function(error, data) {

			  var dataArr = data.split(",");
			  runInquirer(dataArr);

		});

		function runInquirer(dataArr){
		inquirer.prompt([
				{
					type: "list",
					name: "fileName",
					message: "What would you like to do?",
					choices: dataArr
					

				}]).then(function (answers) {
					fs.readFile(answers.fileName, "utf8", function(error, data){
						var loadArray = JSON.parse(data);
						var loadBasic = loadArray[0] //array of basic constructor parts
						var loadCloze = loadArray[1] //array of cloze constructor parts

						for(var i = 0; i < loadBasic.length; i++){
							var basicCard = new that.BasicCard(loadBasic[i][0], loadBasic[i][1]);
							that.flashCardArray.push(basicCard);
						}
						console.log("Basic Cards loaded!");
						

						for(var j = 0; j < loadCloze.length; j ++){		
			
							var clozeCard = new that.ClozeCard(loadCloze[j][0], loadCloze[j][1]); //creates flash card			

							that.flashCardArray.push(clozeCard);
							console.log(that.flashCardArray);
						}
						console.log("Cloze Cards loaded!");
						that.mainMenu();
					})
				});
		}

	},

		


	basicCardsArray :  [], 

	clozeCardsArray: [],

	flashCardArray : [] //starts empty




} //end object declaration




flashCardObject.ClozeCard.prototype.dataChecker = function(data, object) {
	    if(data === -1){
		    	console.log("The text you chose to omit must also appear in the full text. Please try Again");
		    	flashCardObject.menuClozeCard();
		 }else{
	    	flashCardObject.flashCardArray.push(object);
	    	flashCardObject.clozeCardsArray.push([object.fullText, object.cardBack]);
			console.log("-\n\n~~~~~Your Cloze flashcard card was saved to your active study materials~~~~~~~\n\n-");
			flashCardObject.mainMenu();

		   }
	};



flashCardObject.mainMenu(); //initial load







