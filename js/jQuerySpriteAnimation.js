/* JavaScript, JQuery Document

 -----------+ Comment Block +-------------------
File:			jQuerySpriteAnimation.js
Author:     	J. Apodaca
Date:       	August 12, 2014
Purpose:    	Work with jQuery to create Sprite Animation and read XML data
            	(No actual game -- just game-like stuff)
            	
Dependencies: 	jQuery libraries, placed in js folder, pulled online
              	jQuery UI Libraries 
              	
    Input:     	localStorage may be used for "game" settings
	Output:        

Example of Use: <script type="text/javascript" src="js/jQuerySpriteAnimation.js"> </script>

Special Thanks to: http://vaughnroyko.com/saving-and-loading-objects-or-arrays-in-localstorage/

Note: Unlike PHP scripts, we do NOT use <script> pairs with Javascript

****** Algorithm description ***** 

This program is to produce some moving, animated graphics using the "sprite" technique.
With this method of animation a single sheet or file contains all the still motion images
that may be accessed using coordinates sets.

As a proof of concept, this program will contain minimal user interaction to 
"blow something up" or trigger a different graphic.

Finally, some data will be given to localstorage like saved settings or similar  which may
be used between sessions.

*****************************************************************************************

****** TO DO *****
➣ Create moving, animated graphics (ideas: http://openclipart.org/)
➣ Create user interaction
➣ Save settings ✓
➣ Create Help Button ✓
➣ Show copyright ✓
➣ No Browser support for IE 8 and below jQuery 2.  ✓
➣ Add fallback jQuery loading options like Google, then Microsoft, and, finally, local file ✓
➣ Using Animation jQuery Library ✓
➣ Add "one arm bandit" rolling graphic for random music player (inspiration: http://odhyan.com/blog/2011/05/slot-machine-in-javascript/ or http://matthewlein.com/experiments/slots.html)
➣ Add audio player controls
➣ Add rudimentary error checking
➣ Consider saving data in XML file -- maybe defaults? (http://www.w3schools.com/json/)
➣ 

*****************************************************************************************

****** Various Notes ***** 
localstorage JSON variable hints: http://vaughnroyko.com/saving-and-loading-objects-or-arrays-in-localstorage/
Better Sprites: http://spritely.net/documentation/
Another Sprite jQuery Addition (good explanation): http://blaiprat.github.io/jquery.animateSprite/
Another useful tutorial: http://addyosmani.com/blog/jquery-sprite-animation/
Pick Sprite (on white background) http://www.spritecow.com/
HTML Sprites http://cssglobe.com/creating-easy-and-useful-css-sprites/

	//Google Chrome is locked tighter than a drum so this switch must be set when opening it.
	//open -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --args --allow-file-access-from-files &
	// This worked: open "Google Chrome.app" --args --allow-file-access-from-files &

*****************************************************************************************
*/

//Game Setting Variables
	//would get complicated with an array of sprite locations...
var johnsGameSettings = '{"Speed":"14","xCoord":"418","yCoord":"402"}';
var objSettings = JSON.parse(johnsGameSettings);

//Array declarations
var Spriteid = [];   //Each Sprite has a "saved" setting that will be populated via XML
var SpriteSpeed = [];
var SpritexCoord = [];
var SpriteyCoord = [];


function ReadSettings() {
	if (typeof(Storage) != "undefined") { //Check if LocalStorage is available.
		if (localStorage.getItem("jQuerySpriteAnimation.game.settings") !== null) { 
			//Make sure there IS a value to retrieve (like first time when this app is run).
			johnsGameSettings = localStorage.getItem("jQuerySpriteAnimation.game.settings");
		} else {
			johnsGameSettings = '{"Speed":"14","xCoord":"418","yCoord":"402"}'; //Default values.
		}
		objSettings = JSON.parse(johnsGameSettings);
				
		$("#SpriteSpeed").val(objSettings.Speed); //Change the value in the textboxes to saved values.
		$("#SpriteXCoord").val(objSettings.xCoord);
		$("#SpriteYCoord").val(objSettings.yCoord);
	} else {
		alert("No browser support for local storage. Cannot recover last session.");
	}
} //End ReadSettings

	/*
	The old fashioned way of setting a global variable that persist between pages 
	is to set the data in a Cookie. The modern way is to use Local Storage, which has 
	good browser support.  
	*/
	
function SaveSettings() {
	var Speed  = $("#SpriteSpeed").val();  //Grab textbox values and save them.
    var xCoord = $("#SpriteXCoord").val();
    var yCoord = $("#SpriteYCoord").val();
    
	johnsGameSettings = '{"Speed":"' + Speed + '","xCoord":"' + xCoord + '","yCoord":"' + yCoord + '"}'; 
	if (typeof(Storage) != "undefined") { //Check if LocalStorage is available.
		localStorage.setItem("jQuerySpriteAnimation.game.settings", johnsGameSettings);
		alert("Settings Saved" + "\nValue: " + johnsGameSettings);
	} else {
		alert("No browser support for local storage.Cannot save settings.");
	}	
} //End SaveSettings

function GenerateSprites() {
	//Take an "array" of settings from the XML file and make Sprites!

		$.ajax({  //Next 4 lines are essential for reading XML file. 
			type: "GET",
			url: "ManySprites.xml",
			dataType: "xml", 
			success: function(xml) { //Now that we're reading, find all Sprite data	
				var arrayIndex = 0;			
			
				$(xml).find('aSprite').each(function(){ 
				
					Spriteid[arrayIndex]     = $(this).attr('id');
					SpriteSpeed[arrayIndex]  = $(this).find('Speed').text();
					SpritexCoord[arrayIndex] = $(this).find('xCoord').text();
					SpriteyCoord[arrayIndex] = $(this).find('yCoord').text();
				
					arrayIndex ++; 
				});			
				}
			});
	//Now use the settings to make sprites.	

	for (var i = 0; i < Spriteid.length; i++ ) {
		//We cannot edit the .css file so the workaround was to change the html.
		var temp = "<div class=\"ship" + Spriteid[i] + "\"></div>";		
		$('#UFOS').append(temp); //Essential line. Add div ship classes.	
			
		$("head").append("<style> .ship" + Spriteid[i] + "{ top: " + SpriteyCoord[i] + "px; left: " + SpritexCoord[i] + "px; } </style>"); 
		$('.ship' + Spriteid[i]).addClass("anyship");
								
		$('.ship'+ Spriteid[i])
		  .sprite({fps: 5, no_of_frames: 5})
		  .isDraggable()
		  .spRandom({ //make the sprite move in a random way, within pixel constraints (speeds are in milliseconds)
			  top: 150,
              left: 65,
			  right:  200,
			  bottom: 340,
			  speed:  SpriteSpeed[i],
			  pause:  1000
		   });
	
	} //end for loop
	
} //End GenerateSprites

// \\\\\\\\\\\\\\\\\ Under Construction ///////////////////////////
$(document).ready(function(){ 

//This section features usage of the LocalStorage to save 3 settings for a single Sprite.
	//Recalling Settings from a LocalStorage file
	ReadSettings();
	
	//Use settings to place a graphic at the save position
	$('.character').css({ 'top': objSettings.yCoord + 'px','left':objSettings.xCoord + 'px' });

	//Saving settings
	$("#saveSettings").click(function(){  
		SaveSettings();	    
	});
  
	  /* When changes are made to these boxes, alert comes up, settings saved. Info on this at http://api.jquery.com/change/  */
	$("#SpriteSpeed").change(function() {
		SaveSettings();	
	});

	//Let's do a little XML. What if we want multiple Sprite settings to be saved?
	//Can we simply read an XML file for settings?
	// I started by reading: http://www.think2loud.com/224-reading-xml-with-jquery/
	$.ajax({  //Next 4 lines are essential for reading XML file. 
		type: "GET",
		url: "ManySprites.xml",
		dataType: "xml", //jsonp text xml 
		success: function(xml) { //Now that we're reading, find all Sprite data
			var rpt = "";
			
			$(xml).find('aSprite').each(function(){ //loop through all of the nodes in the XML with a jQuery each function
				
				var id = $(this).attr('id');
				var Speed = $(this).find('Speed').text();
				var xCoord = $(this).find('xCoord').text();
				var yCoord = $(this).find('yCoord').text();
				    rpt = rpt + "Sprite#: " + id + " Speed: " + Speed + " X: " + xCoord + " Y: " + yCoord + "\n";		
			});
			//Create a report -- in this case, toss the information into a text
			$('#details').text(rpt);
			
		},
        error: function (responseData, textStatus, errorThrown) {
            //handle error
            alert("XML access failed (JA): " + textStatus);
        }
	}); //End Ajax request.



  //User Help Button
  $("#help").click(function(){
/* Attempt to use jQuery UI to add information boxes
$(function() {
    $( "#dialog-message" ).dialog({
      autoOpen:false,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });
*/
var helpText = "Shoot something.\n"+
               "Do Something\n"+
               "Stop wasting my time.\n";
            
alert(helpText); //Cheap and dirty solution to help the user.

  });


//Shows a UFO, Beginning Sprite Animation
 //Ideas - Check out: view-source:http://tiger.towson.edu/~eowens1/##
	$('.ufo')
	  .sprite({fps: 5, no_of_frames: 5})
	  .isDraggable()
      .spRandom({ //make the sprite move in a random way, within pixel constraints (speeds are in milliseconds)
          top: 150,
          left: 65,
          right: 200,
          bottom: 340,
          speed: 3000,
          pause: 1000
      });
      //Note: An HTML <div> and a CSS file reference both need to match name i.e. in this case "character"
	$('.character')
		.click(function() {
		var p = $( '.character' ); //Since we want Sprite location (upper left corner)
		var position = p.position(); //We grab its position rather than mouse location
		$('.character').mousemove(function( event ) {
			$("#SpriteXCoord").val(position.left); //Change the value in the Coordinate boxes to the Sprite's location.
			$("#SpriteYCoord").val(position.top);
		});
		})
	  .sprite({fps: 6, no_of_frames: 6})
	  .isDraggable(); 
	$('.slotMachine')
	  .sprite({fps: 6, no_of_frames: 6})
	  .isDraggable();  
	  
	$("#WatchTheFilm").click(function(){  
		GenerateSprites();
	});
	  
});


//Play Music
 $(document).ready(function() {
 		var min = 1; //Randomly choose a track to play from this website (My favorite: 14 "Piece by Piece", 25)
 		var max = 31;
 		var trackNumber = Math.ceil(Math.random() * max) + min - 1; // 1 to 31
 		$('#track_Number').text("Track#: " + trackNumber); //report which track is playing
 		
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'http://moonlullaby.ru/mp3/' + trackNumber + '.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        //audioElement.load()
        $.get();
        audioElement.addEventListener("load", function() {
        	audioElement.play();
        	}, true);

        $('#mPlay').click(function() {
        	audioElement.play();
        });

        $('#mPause').click(function() {
        	audioElement.pause();
        });
        
        $('#mStop').click(function() {
        	audioElement.pause();
        });
        
        $('#mPTrack').click(function() {
        	if (trackNumber > 1) {
        	trackNumber--;
        	}
        	$('#track_Number').text("Track#: " + trackNumber);
			audioElement.setAttribute('src', 'http://moonlullaby.ru/mp3/' + trackNumber + '.mp3');
			audioElement.play();
        });
        
        $('#mNTrack').click(function() {
        	if (trackNumber < 31) {
        	trackNumber++;
        	}
        	$('#track_Number').text("Track#: " + trackNumber);
			audioElement.setAttribute('src', 'http://moonlullaby.ru/mp3/' + trackNumber + '.mp3');
			audioElement.play();
        });
        
        $('#mAnotherSelection').click(function() {
			trackNumber = Math.ceil(Math.random() * max) + min - 1;
			$('#track_Number').text("Track#: " + trackNumber);
			audioElement.setAttribute('src', 'http://moonlullaby.ru/mp3/' + trackNumber + '.mp3');
			audioElement.play();
		});
        
});

