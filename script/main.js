/*
 File: main.js
GUI Assignment: HW 5-Scrabble
Victoria Munroe victoria_munroe@student.uml.edu
Description: 1 row legnth scrabble
This page holds programming

Copyright (c) 2023 by VMunroe. All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.
created by VM 6/23/23

Sources:
load tile bag & loading JSON:
https://github.com/ykanane/Scrabble/blob/master/js/add-content.js
*/
$(function() {

  var tilePool = [];
  var tileRack =[];
  var score=0;
  var currentScore=0;
  var counter=0;

  //Functions to get ready for game play
 
  //Ajax to get json containing info about tiles and their distribution
  $.get("https://ykanane.github.io/Scrabble/pieces.json")
  .done(function(response) {
    tileJSON = response.pieces;
    initializeGame();
  });

  function initializeGame(){
    prepareBoard();
    fillTilePool();
    loadRack()
  }


  // Sources:
// https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
// https://stackoverflow.com/questions/42436857/how-to-get-id-of-a-dropped-element-jquery-ui



//function called when tile is set into place
function tileMovedtoBoard(id,value,letter,bonus){
  currentScore+=value;
  // currentScore*=bonus;
  
  
}
  
/*
Making board 
Sources:
 https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
 https://stackoverflow.com/questions/42436857/how-to-get-id-of-a-dropped-element-jquery-ui
 https://www.tutorialspoint.com/jqueryui/jqueryui_droppable.htm#
 */
  function prepareBoard(){
    for(let i=0;i<15; i++){
      var id="droppable-"+counter;
      var bonus="1";
      var boardText=""
      if ((counter%5)==0 && counter!=0){
        bonus="2";
        boardText="Double Word Score"
      }
      counter++;
      var boardClass="board"
      

      $("#board").append("<div id=\""+id+ "\""+
      "class=\""+boardClass+ "\""+
      "bonus=\""+bonus+ "\""+
      "\">"+
      boardText+
      "</div>")

      $( "#"+id ).droppable({
        // tolerance: 'fit',
        drop: function( event, ui ) {
          var bonus = $("#"+id ).attr("bonus")
          var id=ui.draggable.attr("id");
          var value=ui.draggable.attr("value")
          var letter=ui.draggable.attr("letter")
          console.log("Value "+value+ " Letter "+letter +" Bonus" +bonus )
          tileMovedtoBoard(id,value,letter,bonus);
           $( this )
           .addClass( "ui-state-highlight" );
        }
      });
      
}
  }




  

  //initialize the pool of tile with all duplicates included
  function fillTilePool(){
    counter=0;
    console.log("intialize")
    for(i = 0; i < 27; i++){
      var currentTile = tileJSON[i];
      for(k = 0; k < currentTile.amount; k++){
        tilePool.push(currentTile);
      }
    }
  }

  function loadRack(){
    var randTile;
    if(tilePool.length<=0){
      console.log("Empty")
      $(msg).text("Bag is empty");
      return;
    }
    while(tileRack.length<7 && tilePool.length>0){
      randTile=Math.floor(Math.random() * tilePool.length);
      tileRack.push(tilePool[randTile]);
      delete tilePool[randTile];
    }
    for (let i = 0; i < tileRack.length; i++) {
      loadTileGUI(tileRack[i],i)
    }
   
}
  
 
  
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
    console.log("Created tile "+letter)
    //https://www.tutorialspoint.com/jqueryui/jqueryui_draggable.htm
    $("#"+id).draggable({
      cursor: "move",
      stop: function(event, ui) {
        // Write the Code 
        return;
      }

  });

  }

 

 

  function tileImg(tile){
    var baseURL="images/Scrabble_Tiles/Scrabble_Tile_"
    if (tile=="_"){return ""+ baseURL+ "Blank.jpg"}
    else {return ""+ baseURL+tile+".jpg"}
  }
 

  //game play


  function tileMovedtoBoard(id,value,letter,bonus){
    currentScore+=value;
    currentScore*=bonus;
    console.log("Current Score"+currentScore);
    
  
  }


  
});