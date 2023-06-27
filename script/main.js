/*
 File: main.js
GUI Assignment: HW 5-Scrabble
Victoria Munroe victoria_munroe@student.uml.edu
Description: 1 row length scrabble
This page holds programming

Copyright (c) 2023 by VMunroe. All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.
created by VM 6/23/23

Sources:
https://api.jqueryui.com/
https://stackoverflow.com/questions/35367055/get-id-of-next-dom-element
https://stackoverflow.com/questions/3943868/jquery-drag-and-drop-find-the-id-of-the-target
https://sentry.io/answers/remove-specific-item-from-array/
 https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
 https://stackoverflow.com/questions/42436857/how-to-get-id-of-a-dropped-element-jquery-ui
 https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
load tile bag & loading JSON (also used one of their stackoverflow sources (-drop-find-the-id) for assistance see above for source)
https://github.com/ykanane/Scrabble/blob/master/js/add-content.js
*/
$( document ).ready(function() {

  var tilePool = [];
  var tileRack =[];
  var currentTilesPlayed=[]
  var score=0;
  var currentScore=0;
  var counter=0;
  var word="";
  var boardSize=15;
  var rightPlace=false;

  //Functions to get ready for game play
 
  //Ajax to get json containing info about tiles and their distribution
  $.get("https://ykanane.github.io/Scrabble/pieces.json")
  .done(function(response) {
    tileJSON = response.pieces;
    initializeGame();
  });

  function loadButtons(){
    $( "#submit" ).on( "click", function() {
        playRound();
    } );

    $( "#reset" ).on( "click", function() {
      reset();
    } );
  }


  function initializeGame(){
    prepareBoard();
    fillTilePool();
    loadRack()
  }

/*
Making board 
Sources:
 https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
 https://stackoverflow.com/questions/42436857/how-to-get-id-of-a-dropped-element-jquery-ui
 https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
 https://stackoverflow.com/questions/3943868/jquery-drag-and-drop-find-the-id-of-the-target
 */

 /*Sets up the board html & creates a droppable event which calls other classes to handle a dropped tile
 */
  function prepareBoard(){
    loadButtons();
    for(let i=0;i<boardSize; i++){
      var id="droppable-"+counter;
      var bonus="1";
      var bonusLetter="1";
      var boardText=""
      var boardClass="board"
      if ((counter%5)==0 && counter!=0){
        boardClass=boardClass+ " doubleWord"
        bonus="2";
        boardText="Double Word Score"
      }
      if ((counter==2 )|| (counter ==13)){
        boardClass=boardClass+ " doubleLetter"
        bonusLetter="2";
        boardText="Double Letter Score"
      }
      counter++;

      $("#board").append("<div id=\""+id+ "\""+
      "class=\""+boardClass+ "\""+
      "bonus=\""+bonus+ "\""+
      "bonusLetter=\""+bonusLetter+ "\""+
      "\">"+
      boardText+
      "</div>")

      $( "#"+id ).droppable({
        tolerance: 'fit',
        disabled: false,
        drop: function( event, ui ) {
          rightPlace=true;
		      var bonus = $(this).attr("bonus")
          var bonusLetter=$(this).attr("bonusLetter")
          var id=ui.draggable.attr("id");
          var value=ui.draggable.attr("value")
          var letter=ui.draggable.attr("letter")
          disableTile(id,letter)
          $(this).next().attr("id");
          tileMovedtoBoard(id,value,letter,bonus,bonusLetter,$(this).attr("id"),$(this).next().attr("id"));
           $( this )
           .addClass( "ui-state-highlight" );
        }
      });
      
  }
  }




  

  //initialize the pool of tile with all duplicates included
  function fillTilePool(){
    counter=0;
    for(i = 0; i < 27; i++){
      var currentTile = tileJSON[i];
      for(k = 0; k < currentTile.amount; k++){
        tilePool.push(currentTile);
      }
    }
  }

  //loads the rack with the necessary number of tiles
  function loadRack(){
	  $("#rack").empty(); //clears gui elements to make room for updated rack
    var randTile;
    if(tilePool.length<=0){
      $("#msg").text("Bag is empty");
    }
    while(tileRack.length<7 && tilePool.length>0){
      randTile=Math.floor(Math.random() * tilePool.length);
      tileRack.push(tilePool[randTile]);
      tilePool.splice(randTile,1);
      if(tilePool.length<=0){
        $("#msg").text("Bag is empty");
      }
	
    }
    for (let i = 0; i < tileRack.length; i++) {
      loadTileGUI(tileRack[i],i)
    }
   
}
  
 
 /* Creates GUI tile elements & makes them draggable 
 */ 
  function loadTileGUI(tile, pos){
    var letter=tile.letter
    var value=tile.value
    var imageSrc= tileImg(letter)
    var id="letter_"+letter+"_"+pos;
    var tileClass="tile";
    
    $("#rack").append("<img src=\""+imageSrc+ "\""+
    "draggable=\"true\""+
    "id=\""+id+ "\""+
    "class=\""+tileClass+ "\""+
    "value=\""+value+ "\""+
    "letter=\""+letter+ "\""+
    "\">")
    //https://www.tutorialspoint.com/jqueryui/jqueryui_draggable.htm
    $("#"+id).draggable({
      cursor: "move",
      revert:"invalid", //prevent moving tile to incorrect place

  });

  }


 

 

  
 

  //game play

  

  function tileMovedtoBoard(id,value,letter,bonus,bonusLetter,boardId,nextBoardID){
    currentScore+=(parseInt(value)*parseInt(bonusLetter));
    currentScore*=parseInt(bonus);
    console.log("Current Score: "+currentScore);
    word+=letter;
    $("#currWordString").text("Current Word played: "+word)
    $("#lastPlayedTile").text("The last played tile was #"+nextBoardID.substring(10))
    if (word.length==1){//disable all locations to prevent improper implacement
      for(let i=0;i<boardSize;i++){
        updateBoard(i,true)//disable all board locations
      }
    }
    $("#"+boardId).droppable({
      disabled: true,
    });
    $("#"+nextBoardID).droppable({
      disabled: false,
    });

  }

  //function to clear board & load tiles for new round
  function playRound(){
    console.log("Playing new round")
    score+=currentScore;
    $("#score").text("Current Score:" +score);
    $("#word").text("Last round played "+word + "For " +currentScore+" points!")
    word="";
    currentScore=0;
    resetBoard();
    loadRack();

  }

  function reset(){
    resetBoard();
    $("#rack").empty();
    word="";
    currentScore=0;
    score=0;
    $("#score").text("Current Score:" +score);
    $("#currWordString").text("");
    $("#lastPlayedTile").text("");
      tilePool = [];
      tileRack =[];
    fillTilePool();
    loadRack()
  }
  

//misc functions

//Returns specific URL for each tile 
function tileImg(tile){
  var baseURL="images/Scrabble_Tiles/Scrabble_Tile_"
  if (tile=="_"){return ""+ baseURL+ "Blank.jpg"}
  else {return ""+ baseURL+tile+".jpg"}
}

function updateBoard(location, disable){
  $( "#droppable-"+location ).droppable({
    disabled: disable,
  });
}


function disableTile(id,letter){

  $(id).draggable({ //prevent tile from being moved
    disabled: true,
  });

  currentTilesPlayed.push($(id))
  console.log("size "+tileRack.length)
  for(let i=0;i<tileRack.length;i++){
    console.log(tileRack[i].letter)
    console.log(letter)
    if (tileRack[i].letter == letter){
	tileRack.splice(i,1);//avoids error from using delete array[] function
	break; //prevent removal of more than one instance (if any) of the letter from rack
    }
  }
  console.log("size "+tileRack.length)
  console.log("deleted")
  for(let i=0;i<tileRack.length;i++){
    console.log(tileRack[i].letter)
  }
 
}

function resetBoard(){
  for(let i=0;i<boardSize;i++){
    updateBoard(i,false)//enable all board locations
  }
}



  
});