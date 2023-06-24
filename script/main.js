/*
 File: main.js
GUI Assignment: HW 5-Scrabble
Victoria Munroe victoria_munroe@student.uml.edu
Description: 1 row legnth scrabble
This page holds programming

Copyright (c) 2023 by VMunroe. All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.
created by VM 6/23/23

Sources:
load tile bag:
https://github.com/ykanane/Scrabble/blob/master/js/add-content.js
*/
$(function() {

  var tilePool = [];
  var tileRack =[];

  
  //Ajax to get json containing info about tiles and their distribution
  $.get("https://ykanane.github.io/Scrabble/pieces.json")
  .done(function(response) {
    tileJSON = response.pieces;
    initializeGame();
  });

  //initialize the pool of tile with all duplicates included
  function fillTilePool(){
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
    while(tileRack.length<7){
      randTile=Math.floor(Math.random() * tilePool.length);
      console.log("Randomnumber" + randTile)
      tileRack.push(tilePool[randTile]);
      delete tilePool[randTile];
    }
}
  
  function initializeGame(){
    fillTilePool();
    loadRack()
  }


  
});