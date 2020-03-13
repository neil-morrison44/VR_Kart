$fs = 0.01;
$fa = 1;

$wheelDepth = 5.5;
$bodyLength = 100;
$bodyWidth = 75;
$bodyDepth = 10;
$screwHole = 1.25;

module mainBody(){
  cube([$bodyLength,$bodyWidth,$bodyDepth], true);
}

module batteryCutout(){
  translate([0,0,-5])
    cube([50,52,5], true);
  translate([15,-30,-5])
    cube([10, 20, 5], true);
  translate([18, 0, -10])
    cylinder(10,$screwHole,$screwHole);
  translate([-18, 0, -10])
    cylinder(10,$screwHole,$screwHole);
}



module motorAttachCutout(){
  translate([9, 0, -2])
    cylinder(10,$screwHole,$screwHole);
  translate([-9, 0, -2])
    cylinder(10,$screwHole,$screwHole);
  hull(){
    cube([22, 22, 10], true);
    cube([12, 22, 13], true);
  }
  translate([0, -11, -2])
    cylinder(13,3,3.5);
}

module motorOne(){
  translate([37, 30, -$wheelDepth])
    motorAttachCutout();
}

module motorTwo(){
  translate([37, -30, -$wheelDepth])
    rotate([0,0,-180])
      motorAttachCutout();
}

module motorThree(){
  translate([-38, 30, -$wheelDepth])
    motorAttachCutout();
}

module motorFour(){
  translate([-38, -30, -$wheelDepth])
    rotate([0,0,-180])
      motorAttachCutout();
}

module piCutout(){
  translate([0,0,5])
    cube([70, 32, 8], true);
  translate([0,12,5])
    cube([55, 8, 12], true);
  //improve these
  translate([29, 11.5, -2])
    cylinder(10,$screwHole,$screwHole);
  translate([29, -11.5, -2])
    cylinder(10,$screwHole, $screwHole);
  translate([-29, 11.5, -2])
    cylinder(10,$screwHole, $screwHole);
  translate([-29, -11.5, -2])
    cylinder(10,$screwHole, $screwHole);
}

module cameraHolderCutout(){
  translate([0,0,5])
    cube([10, 10, 4], true);
    translate([0,0,0])
      cylinder(5,$screwHole,$screwHole);
}

module cameraHolderCutouts(){
  translate([-25,-25,0])
    cameraHolderCutout();
  translate([25,-25,0])
    cameraHolderCutout();
  translate([-25,25,0])
    cameraHolderCutout();
  translate([25,25,0])
    cameraHolderCutout();

}

module wheelRodCutout(){
  translate([-38, 76 / 2, 0])
  rotate([90, 0, 0]){
    cylinder($bodyWidth + 1,3,3);
  }
}

module circleCutouts(){
  translate([0,$bodyWidth / 2,-10])
    cylinder(50,20,20);
   translate([0,-$bodyWidth / 2,-10])
    cylinder(50,20,20);
  translate([$bodyLength / 2,0,-10])
    cylinder(50,18,18);
  translate([-$bodyLength / 2,0,-10])
    cylinder(50,14,14);
}

module speedHoles(){
  hull(){
  translate([0,0,-5]){
    cylinder(10,4,8);
    translate([10,0,0])
      cylinder(10,4,8);
    translate([-10,0,0])
      cylinder(10,4,8);
  }}
}

difference(){
  mainBody();
  batteryCutout();
  motorOne();
  motorTwo();
  motorThree();
  motorFour();
  piCutout();
  cameraHolderCutouts();
  wheelRodCutout();
  circleCutouts();
  speedHoles();
}




