$screwHole = 1.33;
$padding = -0.25;
$fa = 1;
$fs = 0.01;
$height = 30;
$legThickness = (12 + $padding);

$cameraHolderForward = 16.75;
$cameraAngle = -70;
$cameraWidth = 30;
$cameraHeight = 25;
$cameraDepth = 3;

module holeFiller(){
  difference(){
    intersection(){
      cube([10 + $padding, 10 + $padding, 4], true);
      rotate([0,0,45])
        cube([9 + $padding, 9 + $padding, 4], true);
    }
    translate([0,0,-3])
      cylinder(10, $screwHole, $screwHole);
  }
}

module cameraLeg(){
  intersection(){
  difference(){
    translate([0,0,2])
      cylinder($height, $legThickness / 2, $legThickness / 2);
    translate([0,0,0])
      cylinder($height + 4, $screwHole * 2.1, $screwHole * 2.1);
   }
   rotate([0,15,0]){
     cube([$legThickness,$legThickness,$height * 2.5], true);
   }
   }
}

module cameraHolderCutouts(){
  translate([-25,-25,0]){
    holeFiller();
    cameraLeg();
  }
  translate([25,-25,0]){
    holeFiller();
    rotate([0,0,180]){
      cameraLeg();
    }
  }
  translate([-25,25,0]){
    holeFiller();
    cameraLeg();
  }
  translate([25,25,0]){
    holeFiller();
    rotate([0,0,180]){
      cameraLeg();
    }
  }
}

module cameraHolderAttachment(){
  translate([0, $cameraHolderForward, $height + 5]){
    cube([10, 2, 2], true);
    translate([0, -10, 5]){
      cube([10, 2, 2], true);
    }
  }
}

module joints(){
  $joinPosX = 22;
  $joinPosY = 24;
  $joinThick = $screwHole * 2.5;
  $joinScale = 1.8;
  for (x = [$joinPosX,-$joinPosX]) {
    for (y = [$joinPosY,-$joinPosY]) {
      $angle = atan2(0,0) - atan2(y,x);
      hull(){
        translate([x, y, $height - ($joinThick * $joinScale)]){
          scale([1, 1, $joinScale]){
          rotate([-90,0,$angle]){
            cylinder(0.1, $joinThick, $joinThick);
          }
          }
        }
      cameraHolderAttachment();
      }
    }
  }
}



module cameraHolder(fullDepth, withScrews){
  $screwDistanceY = 21.1;
  $screwDistanceX = 12.5;
  $cameraScrewHole = 1;
  $depth = fullDepth ? $cameraDepth : 0.1;
  $moveBack = fullDepth ? 0 : -($cameraDepth / 2);
  translate([0, $cameraHolderForward + 2, $height + 10]){
    rotate([$cameraAngle,0,0]){
      difference(){
        translate([0, 0, $moveBack]){
          cube([$cameraWidth, $cameraHeight, $depth], true);
        }
        
        if (withScrews){
          translate([0, $screwDistanceY / 2,0]){
            cylinder($cameraDepth * 10, $cameraScrewHole, $cameraScrewHole);
          }
         translate([0,-($screwDistanceY / 2),0]){
            cylinder($cameraDepth * 10, $cameraScrewHole, $cameraScrewHole);
          }
          translate([$screwDistanceX,-($screwDistanceY / 2),0]){
            cylinder($cameraDepth * 10, $cameraScrewHole, $cameraScrewHole);
          }
          translate([$screwDistanceX,$screwDistanceY / 2,0]){
            cylinder($cameraDepth * 10, $cameraScrewHole, $cameraScrewHole);
          }
        }
      }
    }
  }
  
}

module clearanceBlock(){
  translate([0,0,25/2])
    cube([30, 80, 25], true);
}

cameraHolderCutouts();
difference(){
  hull(){
    cameraHolderAttachment();
    cameraHolder(false, false);
  }
  cameraHolder(false, false);
}
cameraHolder(true, true);
difference(){
  joints();
  cameraHolder(true, false);
}

//clearanceBlock();