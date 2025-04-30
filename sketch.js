let mappa = new Mappa('Leaflet'); // using Leaflet for map visuals via Mappa wrapper
let options = { // focal point coordinates set to NYU Tandon
  lat: 40.694389965537205, 
  lng: -73.98656859574896,
  zoom: 6,
  style: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

let state = 'start';
let myMap;
let canvas;
let photos = [];
let clusterIndex;

// Button specs
let bw = 180;
let bh = 50;
let gap = 20;
let totalW = bw * 2 + gap;
let startX;
let y;

let welcome;
let pw, ph, px, py;
let margin;
let cx, cy;


function preload(){
    welcome = loadImage("data/welcome.png");


}



function setup(){
    canvas = createCanvas(windowWidth, windowHeight);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);

    // button specs cont. since need width and height values
    startX = width/2 - totalW/2;
    y = height/2;
}


function draw(){
    if (state === 'start') {
        // welcome screen image
        image(welcome, 0, 0);

        // text background so can see text better
        fill(0, 0, 0, 200);
        noStroke();
        rect(width/2 - 250, height/2 - 150, 500, 250, 12);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        text('Maps & Memories', width/2, height/2 - 80);
        textSize(20);
        text('A Collection of 35mm Film, Shot by Farhan Kobir', width/2, height/2 - 30);
        
        
        // start button
        fill(0,150,255,220);
        rect(startX, y, bw, bh, 8);
        fill(255); textSize(24);
        text('Start', startX + bw/2, y + bh/2);

        // instructions button
        fill(0,200,150,220);
        rect(startX + bw + gap, y, bw, bh, 8);
        fill(255);
        text('Instructions', startX + bw + gap + bw/2, y + bh/2);

    } else if (state === 'instructions') {
        // background a little transparant
        fill(0, 0, 0, 180);
        rect(0, 0, width, height);

        // pop up window
        pw = width * 0.6;
        ph = height * 0.6;
        px = (width - pw)/2;
        py = (height - ph)/2;
        fill(255);
        rect(px, py, pw, ph, 12);

        // instructions
        fill(30);
        textAlign(LEFT, TOP);
        textSize(18);
        margin = 20;
        txt = 
        'Instructions:\n\n' +
        '• Click Start to load the map.\n' +
        '• Pan & zoom as usual to see photo clusters.\n' +
        '• Click on a cluster to zoom in.\n' +
        '• The more you zoom, the more individual photo thumbnails will appear.\n' +
        '• Click a thumbnail to view that photo.\n\n';
        text(txt, px + margin, py + margin, pw - margin*2, ph - margin*2 - 40);

        // Close button
        cx = px + pw - bw - margin;
        cy = py + ph - bh - margin;
        fill(0,150,255);
        rect(cx, cy, bw, bh, 6);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(18);
        text('Close', cx + bw/2, cy + bh/2);
    
      } else if (state === 'map') {
        // clear canvas to show map
        clear();

        // where i implement the photo clusters logic
      }
}

function mousePressed() {
    if (state === 'start') {
      // check which button was pressed
      // start 
      if (mouseX > startX && mouseX < startX + bw && mouseY > y && mouseY < y + bh) {
        state = 'map';
      }
      
      // instructions
      if (mouseX > startX + bw + gap && mouseX < startX + bw*2 + gap && mouseY > y && mouseY < y + bh) {
        state = 'instructions';
      }
  
    } else if (state === 'instructions') {
      // close
      if (mouseX > cx && mouseX < cx + bw &&
          mouseY > cy && mouseY < cy + bh) {
        state = 'start';
      }
    }

  }