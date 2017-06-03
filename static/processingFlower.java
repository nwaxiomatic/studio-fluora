int num = 60;
float cx = 0.0;
float cz = 0.0;
float cy = -20.0;
boolean dontdraw = false;
int flip = 100;

PVector[] endV = new PVector[60];
PVector[] hiC = new PVector[60];
PVector[] lowC = new PVector[60];


void setup() {
  size(500, 500, P3D);
  background(0);
  noFill();
  stroke(255);
  
    //fill endV
  for (int i = 0; i < 60; i++) {
    int a = i*6;
    float angle = radians(a);
    float x = cx + cos(angle) * 170;
    float y = -50.0;
    float z = cz + sin(angle) * 170;
    endV[i] = new PVector(x, y, z);
  }

  ////fill hiC
  for (int i = 0; i < 60; i++) {
    int a = i*6;
    float angle = radians(a);
    float x = cx + cos(angle) * 120;
    float y = -120.0;
    float z = cz + sin(angle) * 120;
    hiC[i] = new PVector(x, y, z);
  }

  //fill lowC
  for (int i = 0; i < 60; i++) {
    int a = i*6;
    float angle = radians(a);
    float x = cx + cos(angle) * 100;
    float y = 11.2;
    float z = cz + sin(angle) * 100;
    lowC[i] = new PVector(x, y, z);
  }
}

void draw() {
  //bullshit
  blendMode(ADD);
  background(0);
  translate (width/2, height/2);
  rotateY(frameCount / 100.0);
  rotateX(100);
  //box(300);

  stroke(150, 100);
  strokeWeight(2);

  //stem
  bezier(cx, cy, cz, 
    cx, cy+70, cz, 
    cx-30, cy+130, cz+40, 
    cx-60, cy+250, cz-40);


  //petals
  for (int i = 0; i < 60; i++) {
    int flip = (i+1) % 5;
    if (flip == 0) {
      dontdraw = !dontdraw;
    };

    if (!dontdraw) {
    //colorizer(flip);


      bezier(cx, cy, cz, 
        hiC[i].x, hiC[i].y, hiC[i].z, 
        lowC[i].x, lowC[i].y, lowC[i].z, 
        endV[i].x, endV[i].y, endV[i].z);
    }
  }
}


// Functions -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
void colorizer(int truth) {
      if (truth == 0 || truth == 4) {
        stroke(180, 50, 100, 100);
      } else {
        stroke(150, 100);
      }
}

int myRandom(int val1, int val2, int randoCount) {
  int rando = 0;

  for (int i=0; i<randoCount; i++) {
    rando += int(random(val1, val2));
  }

  rando = rando/randoCount;
  return rando;
}

//-------------------------------------------------------------------------------------------------

void drawSphere(float x, float y, float z) {
  pushMatrix();
  translate(x, y, z);
  sphere(5);
  popMatrix();
}