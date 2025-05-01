// Photo class
// each photo has a latitude, longitude, path, and description associated with it
class Photo {
    constructor(lat, lng, imgPath, desc) {
      this.lat = lat;
      this.lng = lng;
      this.imgPath = imgPath;
      this.desc = desc;
    }

    preload() { // for preloading with loop in preload function
      this.pic = loadImage(this.imgPath);
    }
  }

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
let startY;

let welcome;
let pw, ph, px, py;
let margin;
let cx, cy;


function preload(){
    welcome = loadImage("data/welcome.png");
    photos = [
        new Photo(40.668766538024485, -73.96449548464334, 'data/bbg1.jpg', 'Brooklyn Botanic Garden, spring bloom'),
        new Photo(40.77960717917997, -73.9631581726974, 'data/met1.jpg', 'The Metropolitan Museum of Art entrance')
      ];

      for(let i = 0; i < photos.length; i++){ // preload each pic in the array
        photos[i].preload();
      }
}


function setup(){
    canvas = createCanvas(windowWidth, windowHeight);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);

    // button specs cont. since need width and height values
    startX = width/2 - totalW/2;
    startY = height/2;

    // learned this from watching https://www.youtube.com/watch?v=hmsV3iJloB0, 10:45
    // building the clustering index using photos
    let features = photos.map(p => ({ // uses the map method to transform each Photo into a GeoJSON Feature object to store in new geatures array
        type: 'Feature', // marks the object as a GeoJSON Feature
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, // assigns the lng and lat to the GeoJSON equivalent
        properties: { imgPath: p.imgPath, desc: p.desc } // non spatial data, so adds the path and description
      }));
      clusterIndex = new Supercluster({ radius: 60, maxZoom: 16 }).load(features); // creates a new Supercluster spatial index, allowing for clustering
      // if two points within 60 pixel, they will group together
      // beyond zoom 16, points will be individual and not in groups
      // .load loads the GeoJSON Feature array into the Supercluster so that it can cluster it
}


function draw(){
    clear();
    if (state == 'start') {
        // welcome screen image
        image(welcome, 0, 0);

        // text background so can see text better
        fill(0, 0, 0, 190);
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
        rect(startX, startY, bw, bh, 8);
        fill(255); 
        textSize(24);
        text('Start', startX + bw/2, startY + bh/2);

        // instructions button
        fill(0,200,150,220);
        rect(startX + bw + gap, startY, bw, bh, 8);
        fill(255);
        text('Instructions', startX + bw + gap + bw/2, startY + bh/2);

    } else if (state == 'instructions') { // instructions page
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
        '• Pan & zoom to see photo clusters.\n' +
        '• Zoom into a cluster for a more detailed look.\n' +
        '• The more you zoom, the more individual photo locations will appear.\n' +
        '• Click a marker to view that photo.\n\n';
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
    
      } else if (state == 'map') {
        // learned this from watching https://www.youtube.com/watch?v=hmsV3iJloB0, 12:40
        let zoom = myMap.zoom(); // current zoom level
        let bounds = myMap.map.getBounds().toBBoxString().split(',').map(parseFloat); // gets the current map window being displayed, so we know what is being clustered within
        let clusters = clusterIndex.getClusters(bounds, zoom); // returns clusters and points that are within the bounds
        clusters.forEach(c => { // loops through each cluster
            let [lng,lat] = c.geometry.coordinates; // turns GeoJSON Feature coordinates into lng and lat
            let pos = myMap.latLngToPixel(lat,lng); // turns geographic lng lat to x and y positions 
            if (c.properties.cluster) { // check to see if a cluster 
            fill(0, 150, 255, 200);
            noStroke();
            ellipse(pos.x, pos.y ,30); // marker where a cluster exists
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(14);
            text(c.properties.point_count, pos.x, pos.y); // says the number of photos in cluster
            } else {
            fill(255, 50, 50); 
            noStroke(); 
            ellipse(pos.x, pos.y, 12); // individual photo marker, red
            }
        });

      } else if (state == 'photo') { // photo pop up
            fill(0, 0, 0, 180); 
            rect(0, 0, width, height);
            ph = height * 0.65;
            fill(255); 
            rect(px, py, pw, ph, 12);
            let p;
            for (let i = 0; i < photos.length; i++) {
                if (photos[i].imgPath == selectedPhoto) { // get the photo that was selected
                    p = photos[i];
                    break;
                }
            }
            if (p && p.pic) {
              imageMode(CENTER);
              image(p.pic, width/2, height/2, pw, ph);
            }

            // Info button
            fill(0,200,150); 
            rect(px+20, py+ph-bh-20, bw, bh, 6);
            fill(255); 
            textAlign(CENTER, CENTER); 
            textSize(18);
            text('Info', px+20 + bw/2, py+ph-bh/2 -20);

            // Close button
            fill(200,50,50); 
            rect(px+pw-bw-20, py+ph-bh-20, bw, bh,6);
            fill(255); 
            text('Close', px+pw - bw -20 + bw/2, py+ph-bh/2 -20);

      

      }
}

function mousePressed() {
    if (state == 'start') {
      // check which button was pressed
      // start 
      if (mouseX > startX && mouseX < startX + bw && mouseY > startY && mouseY < startY + bh) {
        state = 'map';
      }
      // instructions
      if (mouseX > startX + bw + gap && mouseX < startX + bw*2 + gap && mouseY > startY && mouseY < startY + bh) {
        state = 'instructions';
      }
  
    } else if (state == 'instructions') {
      // close
      if (mouseX > cx && mouseX < cx + bw && mouseY > cy && mouseY < cy + bh) {
        state = 'start';
      }
    }

  }

