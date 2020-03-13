$screwHole = 1.25;
$fa = 1;
$fs = 0.1;

$motorLength = 21.5;
$motorPadding = 0.25;
$bodyPadding = -0.3;

module motorAttachCutout(){

  hull(){
    cube([22 + $bodyPadding, 22 + $bodyPadding, 10 + $bodyPadding], true);
    cube([12 + $bodyPadding, 22 + $bodyPadding, 13 + $bodyPadding], true);
  }
}

module motorWirepath(){
  translate([0, -11, -2])
    cylinder(13,3,3.5);
}

module screwHoles(){
  translate([9, 0, -2])
    cylinder(10, $screwHole, $screwHole);
  translate([-9, 0, -2])
    cylinder(10, $screwHole, $screwHole);
}

module screwPaths(){
  translate([9, 0, -8])
    cylinder(10, $screwHole * 2, $screwHole * 2);
  translate([-9, 0, -8])
    cylinder(10, $screwHole * 2, $screwHole * 2);
}

module motorCutout(){
  rotate([90,0,0]){
  intersection(){
    cylinder($motorLength, 6.5 + ($motorPadding / 2), 6.5 + ($motorPadding / 2));
    translate([0,0, $motorLength / 2])
      cube([12.1 + $motorPadding, 10 + $motorPadding, $motorLength], true);
  }
  }
}

module airHoles(){
  hull(){
  translate([0,0,-10]){
    cylinder(20, 4, 4);
    translate([0, 6, 0])
      cylinder(20, 2.5, 2.5);
    translate([0, -3, 0])
      cylinder(20, 2, 2);
  }
}
}

difference(){
  motorAttachCutout();
  screwHoles();
  screwPaths();
  motorWirepath();
  translate([0, 12, 1.3])
    motorCutout();
  airHoles();
}


