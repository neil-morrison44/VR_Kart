$fa = 0.5;
$fs = 0.1;
$radius = 20;
$shaftRadius = 1.7;
$thickness = 2;
$gripCount = 24;
$rimHeight = 1;
$wheelHeight = 3;
$screwHole = 1.25;
$shaftHeight = 120;
$hubHeight = 5;
$gripThickness = 1.5;

module wheelBase(){
  cylinder($wheelHeight,$radius,$radius);
  cylinder($wheelHeight + $hubHeight,$shaftRadius + $thickness,$shaftRadius + $thickness);
}

module wheelGrips(){
  $fa = 12;
  for (i=[1:$gripCount]){
    rotate([0, 0, (360 / $gripCount) * i ]){
      translate([$radius - ($gripThickness / 2), 0, 0]){
        cylinder($wheelHeight + $rimHeight,$gripThickness,$gripThickness);
      }
    }
  }
}

module wheelRim(){
  difference(){
    union(){
      wheelGrips();
      cylinder($rimHeight + $wheelHeight,$radius,$radius);
    }
    cylinder(20,$radius - 1,$radius - 1);
  }
}

module shaft(){
  translate([0, 0, -1])
    cylinder($wheelHeight + $hubHeight + 2, $shaftRadius, $shaftRadius);
}

module wheelHoles(){
  for (i=[1:8]){
    hull(){
    rotate([0, 0, (360 / 8) * i ]){
      translate([$radius / 1.45, 0, -1]){
        cylinder($wheelHeight * 2,$radius / 5, $radius / 5);
      }
    }
    rotate([0, 0, (360 / 8) * i ]){
      translate([$radius / 2.5, 0, -1]){
        cylinder($wheelHeight * 2,$radius / 10, $radius / 10);
      }
    }
  }
  }
}


module screwHole(){
  translate([0,0,$wheelHeight + ($hubHeight / 2)]){
    rotate([0,90,0]){
      cylinder(10, $screwHole, $screwHole);
    }
  }
}

module block(){
  translate([-2.3,0,($hubHeight + $wheelHeight) / 2]){
    cube([2, 2.2, ($hubHeight  + $wheelHeight)], true);
  }
}


difference(){
  union(){
    wheelBase();
    wheelRim();
    
  }
  shaft();
  wheelHoles();
}

block();

