// Maps & Memories
// Creative Coding Final Project
// Author: Farhan Kobir

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
// I used leaflet instead of other maps like google maps because:
// 1. I don't need an API key, I can just add a link to the library in the html file, 
// 2. The other library, supercluster, is usually used with leaflet
let options = { // focal point coordinates set to Manhattan
  lat: 40.80072796749734, 
  lng: -73.95209804892733,
  zoom: 8,
  style: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

let state = 'start';
let myMap;
let canvas;
let photos = [];
let clusterIndex;

// Button specs
let bw = 180;
let bw2 = 150
let bh = 50;
let gap = 20;
let totalW = bw * 2 + gap;
let startX;
let startY;

let welcome;
let pw, ph, px, py;
let margin;
let cx, cy;

let infoX, infoY, closeX, closeY;


function preload(){
    welcome = loadImage("data/welcome.png");
    photos = [
        new Photo(40.77960717917997, -73.9631581726974, 'data/met1.jpg', 'The Metropolitan Museum of Art Entrance'),
        new Photo(39.98146253672869, -75.21233321843438, 'data/shofuso1.jpg', 'Shofuso Japanese Cultural Center'),
        new Photo(39.98126281685793, -75.21262316247274, 'data/shofuso2.jpg', 'Shofuso Japanese Cultural Center'),
        new Photo(39.98201229098589, -75.21305467980561, 'data/shofuso3.jpg', 'Shofuso Japanese Cultural Center'),
        new Photo(39.98121872988848, -75.21303310393895, 'data/shofuso4.jpg', 'Shofuso Japanese Cultural Center'),
        new Photo(39.94126544861629, -75.16140943329218, 'data/philly1.jpg', "Random alley way"),
        new Photo(39.94281802062295, -75.15929384232948, 'data/philly2.jpg', "Random alley way"),
        new Photo(39.953001351698404, -75.16348310411367, 'data/philly3.jpg', "Random alley way"),
        new Photo(39.95343372091981, -75.16496180029024, 'data/philly4.jpg', "Random alley way"),
        new Photo(39.954832103696575, -75.16617210949799, 'data/philly5.jpg', "Random alley way"),
        new Photo(40.66889459747276, -73.96268478613327, 'data/bbg1.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.67172232669605, -73.96326748628931, 'data/bbg2.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.6685280783178, -73.9625481876615, 'data/bbg3.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66907890489006, -73.96258853295755, 'data/bbg4.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66731420369955, -73.96258853295755, 'data/bbg6.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.667005902500335, -73.96206259249291, 'data/bbg8.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66701231306844, -73.96214710779735, 'data/bbg9.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66868146577889, -73.96271860124875, 'data/bbg11.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66888659849771, -73.96336091756248, 'data/bbg13.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66869001298809, -73.96310173729553, 'data/bbg14.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66939065030465, -73.96473925582538, 'data/bbg15.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66874298896396, -73.96443683764043, 'data/bbg16.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.66947835396096, -73.96497941144283, 'data/bbg17.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.669817307459034, -73.96581635860241, 'data/bbg18.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.670315505700984, -73.96579199242197, 'data/bbg19.jpg', 'Brooklyn Botanic Garden, White Blossom'),
        new Photo(40.75457504044422, -73.95670556177951, 'data/roosevelt1.jpg', 'Small picnic'),
        new Photo(40.69241174115637, -73.86017166644206, 'data/woodhaven1.jpg', 'Small picnic'),
        new Photo(40.685762257883674, -73.85696125087368, 'data/woodhaven2.jpg', 'Small picnic'),
        new Photo(40.656101573974745, -74.00664897181649, 'data/japvill1.jpg', 'Small picnic'),
        new Photo(40.656125483037286, -74.0065436951154, 'data/japvill2.jpg', 'Small picnic'),
        new Photo(40.65653757771871, -74.00682053484543, 'data/japvill3.jpg', 'Small picnic'),
        new Photo(40.65681156012807, -74.007387795925, 'data/japvill4.jpg', 'Small picnic'),
        new Photo(40.72820571082589, -73.59417713135096, 'data/nassau1.jpg', 'Small picnic'),
        new Photo(40.72765135713004, -73.59356424083306, 'data/nassau2.jpg', 'Small picnic'),
        new Photo(40.72809334220664, -73.59323802491225, 'data/nassau3.jpg', 'Small picnic'),
        new Photo(41.40725695609808, -75.67108960509398, 'data/scranton1.jpg', 'Small picnic'),
        new Photo(41.42386035559855, -75.78755327034591, 'data/scranton2.jpg', 'Small picnic'),
        new Photo(40.70399304204197, -73.99081312210409, 'data/dumbo1.jpg', 'dd'),
        new Photo(42.19361412308112, -74.06350751535146, 'data/kater1.jpg', 'dd'),
        new Photo(42.19359286910898, -74.06261820335592, 'data/kater2.jpg', 'dd'),
        new Photo(42.19419063434934, -74.06329235922351, 'data/kater3.jpg', 'dd'),
        new Photo(42.08103460777675, -74.3090860063107, 'data/kater4.jpg', 'dd'),
        new Photo(40.77521356866042, -73.91152044238768, 'data/qawah1.jpg', 'dd'),
        new Photo(40.77512065983469, -73.91141262580093, 'data/qawah2.jpg', 'dd'),
        new Photo(40.775086874774914, -73.91172120430778, 'data/qawah3.jpg', 'dd'),
        new Photo(41.227602993681245, -73.85682490115136, 'data/croton1.jpg', 'dd'),
        new Photo(41.225752735050534, -73.85710116866504, 'data/croton2.jpg', 'dd'),
        new Photo(40.97457074370155, -75.1349431064951, 'data/delwat1.jpg', 'dd'),
        new Photo(40.970260439676736, -75.13152848518826, 'data/delwat2.jpg', 'dd'),
        new Photo(40.86517109255241, -73.93159865694987, 'data/cloister1.jpg', 'dd'),
        new Photo(40.6868526341057, -74.02135750117873, 'data/gov1.jpg', 'dd'),
        new Photo(40.693065543766906, -74.01594873417739, 'data/gov2.jpg', 'dd'),
        new Photo(41.73056628468038, -74.23448810360006, 'data/gert1.jpg', 'dd'),
        new Photo(41.72772944232588, -74.23721882493446, 'data/gert2.jpg', 'dd'),
        new Photo(42.28111565696664, -73.02431908841518, 'data/becket1.jpg', 'dd'),
        new Photo(42.279268924525084, -73.02681513234174, 'data/becket2.jpg', 'dd'),
        new Photo(42.283203202378395, -73.02464465936211, 'data/becket3.jpg', 'dd'),
        new Photo(40.96525221734173, -73.8875813325899, 'data/unter1.jpg', 'dd'),
        new Photo(40.96658809576832, -73.8864364241435, 'data/unter2.jpg', 'dd'),
        new Photo(40.96799571922105, -73.88859669664063, 'data/unter3.jpg', 'dd'),
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
        '• Pan to see photo clusters.\n' +
        '• Zoom into a cluster for a more detailed look.\n' +
        '• The more you zoom, the more individual photo locations will appear.\n' +
        '• Click a marker to view that photo.\n\n' +
        '* When using the quick jump buttons, sometimes you need to drag the map to fix it.\n\n';
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
            } else { // if not cluster, then individual
            fill(255, 50, 50); 
            noStroke(); 
            ellipse(pos.x, pos.y, 12); // individual photo marker, red
            fill(235, 225, 52); // smaller yellow to make more noticeable
            ellipse(pos.x, pos.y, 5);
            }
        });

        // button quick jumps

        // reset back to default position button
        let rx = 10;
        let ry = 90;
        fill(200,50,50);
        rect(rx, ry, bw2, bh, 6);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(18);
        text('Reset', rx + bw2/2, ry + bh/2);

        // jump to city buttons
        // NYC
        let nyy = ry + bh + 10;
        fill(0,200,150,220);
        rect(rx, nyy, bw2, bh, 6);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(18);
        text('NYC', rx + bw2/2, nyy + bh/2);

        // Philadelphia
        let py = nyy + bh + 10;
        fill(0,200,150,220);
        rect(rx, py, bw2, bh, 6);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(18);
        text('Philadelphia', rx + bw2/2, py + bh/2);

        // BBG (brooklyn botanical garden)
        let bbgy = py + bh + 10;
        fill(0,200,150,220);
        rect(rx, bbgy, bw2, bh, 6);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(18);
        text('BBG', rx + bw2/2, bbgy + bh/2);

      } else if (state == 'photo') { // photo pop up
            fill(0, 0, 0, 180); 
            rect(0, 0, width, height);
            ph = height * 0.67;
            pw = width * 0.6;
            px = (width - pw)/2;
            py = (height - ph)/2;
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

        } else if (state == 'desc') { // description pop up
            fill(0, 0, 0, 180);
            rect(0, 0, width, height);
            pw = width*0.5
            ph = height*0.4;
            px = (width-pw)/2;
            py = (height-ph)/2;
            fill(255);
            rect(px, py, pw, ph, 12);
            fill(30);
            textAlign(LEFT, TOP);
            textSize(16);
            let p;
            for (let i = 0; i < photos.length; i++) {
                if (photos[i].imgPath == selectedPhoto) { // get the photo that was selected
                    p = photos[i];
                    break;
                }
            }
            text(p.desc, px+20, py+20, pw-40, ph-60);
            fill(0,150,255); rect(px+pw/2-bw/2, py+ph-bh-20, bw, bh, 6);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(18);
            text('Close', px+pw/2, py+ph-bh/2 - 20);

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
    } else if (state == 'map') { // checking if cluster or marker was selected
        // reset
        let rx = 10;
        let ry = 90;
        if (mouseX > rx && mouseX < rx + bw2 && mouseY > ry && mouseY < ry + bh) {
            myMap.map.setView([options.lat, options.lng], options.zoom);
            return;
        }

        // NYC
        let nyy = ry + bh + 10;
        if (mouseX > rx && mouseX < rx + bw2 && mouseY > nyy && mouseY < nyy + bh) {
            myMap.map.setView([40.78016930562363, -73.9066399500361], 11);
            return;
        }

        // Philadelphia
        let py = nyy + bh + 10;
        if (mouseX > rx && mouseX < rx + bw2 && mouseY > py && mouseY < py + bh) {
            myMap.map.setView([39.99462677422846, -75.21900166866507], 11);
            return;
        }

        // BBG (brooklyn botanical garden)
        let bbgy = py + bh + 10;
        if (mouseX > rx && mouseX < rx + bw2 && mouseY > bbgy && mouseY < bbgy + bh) {
            myMap.map.setView([40.66874907089139, -73.96425553421967], 17);
            return;
        }

        // from previously mentioned things I learned (line 150)
        let zoom=myMap.zoom();
        let bounds=myMap.map.getBounds().toBBoxString().split(',').map(parseFloat);
        let clusters=clusterIndex.getClusters(bounds,zoom);
        clusters.forEach(c => {
        let [lng,lat]=c.geometry.coordinates;
        let pos=myMap.latLngToPixel(lat,lng);
        if(dist(mouseX,mouseY,pos.x,pos.y)<20) {
            if(c.properties.cluster) {
            myMap.map.setView([lat,lng],zoom+2);
            } else {
            selectedPhoto = c.properties.imgPath;
            state = 'photo';
            }
        }
        });

    } else if (state == 'photo') { // photo pop up buttons
        pw = width*0.6;
        ph = height*0.6;
        px = (width-pw)/2;
        py = (height-ph)/2;
        infoX = px+20;
        infoY = py+ph-bh+10;
        closeX = px+pw-bw-20;
        closeY = infoY;
        if (mouseX > infoX && mouseX < infoX+bw && mouseY > infoY && mouseY < infoY+bh) {
            state='desc';
        }
        if (mouseX > closeX && mouseX < closeX+bw && mouseY > closeY && mouseY < closeY+bh) {
            state='map';
        }
    } else if (state == 'desc') { // Description pop up buttons
        pw = width*0.5;
        ph = height*0.4;
        px = (width-pw)/2;
        py = (height-ph)/2;
        cx = px+pw/2-bw/2;
        cy = py+ph-bh-20;
        if (mouseX>cx && mouseX<cx+bw && mouseY>cy && mouseY<cy+bh) {
            state='photo';
        }
    }
  }

