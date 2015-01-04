var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
//var Vibe = require('ui/vibe');
var dev_key = 'wTHq2qKd';
var cinema_url = 'http://www.cineworld.co.uk/api/quickbook/cinemas?key='+dev_key+'&full=true';

//----------------- Cinema Data -----------------//

var parseCinema = function(cinema_data, quantity) {
  var items = [];
  console.log("Quanitity = " + quantity);
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var title = cinema_data.cinemas[i].name;
    title = title.charAt(0).toUpperCase() + title.substring(1);

    // Add to menu items array
    items.push({
      title:title
    });
  }

  // Finally return whole array  
  return items;
};

//----------------- Splash Screen -----------------//
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading Cindema data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

//----------------- Cinema Request -----------------//
ajax(
  {
    url: cinema_url,
    type:'json'
  },
  function(cinema_data) {
    // Create an array of Menu items
    var menuItems = parseCinema(cinema_data, 10);

    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Select a Cinema',
        items: menuItems
      }]
   });
    // Add an action for SELECT
    resultsMenu.on('select', function(e) {
      // Assemble body string
      var name = cinema_data.cinemas[e.itemIndex].name;
      var address = cinema_data.cinemas[e.itemIndex].address;
      var postcode = cinema_data.cinemas[e.itemIndex].postcode;
      var telephone = cinema_data.cinemas[e.itemIndex].telephone;
      
      // Create the Card for detailed view
      var detailCard = new UI.Card({
        title:'Contact Info',
        scrollable: true,
        body: '\n' + address + '\n' + postcode + '\n\nTel: ' + telephone
      });
      detailCard.show();
    });
    
    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();
  },
  function(error) {
    console.log("Download failed: " + error);
  }
);

// Prepare the accelerometer
Accel.init();