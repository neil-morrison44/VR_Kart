# VR_Kart

A 3D Printed Raspberry PI powered car with an a-frame VR interface

|                                             |                                             |                                             |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| ![Kart Image 1](/readme_images/kart_1.jpeg) | ![Kart Image 3](/readme_images/kart_3.jpeg) | ![Kart Image 2](/readme_images/kart_2.jpeg) |

## Part List

| part                           | notes                            | link                                                                        |
| ------------------------------ | -------------------------------- | --------------------------------------------------------------------------- |
| Pi Zero W                      | A bit underpowered for this      | https://thepihut.com/products/raspberry-pi-zero-w                           |
| MotoZero                       |                                  | https://thepihut.com/products/motozero                                      |
| ZeroCam FishEye                |                                  | https://thepihut.com/products/zerocam-fisheye-camera-for-raspberry-pi-zero  |
| N20 DC 6V 150RPM               |                                  | https://www.amazon.co.uk/gp/product/B07P55RLX5                              |
| Pi Wide Input Shim             |                                  | https://thepihut.com/products/wide-input-shim                               |
| 4 AAA Battery Holder           | Meant to buy a AA battery holder | https://www.amazon.co.uk/gp/product/B07KN2P7PD/                             |
| Camera Cable Joiner            | See notes                        | https://thepihut.com/products/camera-cable-joiner-extender-for-raspberry-pi |
| Camera Cable Adapter           | See notes                        | https://shop.pimoroni.com/products/camera-cable-adapter                     |
| Camera Cable - Pi Zero edition | See Notes                        | https://shop.pimoroni.com/products/camera-cable-raspberry-pi-zero-edition   |
| Misc 2.5mm / 3mm screws        |                                  |                                                                             |

## Software Setup

- Install uv4l
- Install `rng-tools` otherwise node won't start until the stored entropy is large enough (which is slow when headless & USB device-less)

## Notes

### Camera extension cables

It turned out that the Zero camera's cable is the other way up than I thought - so I needed to loop around taking it up over the kart then down into the camera port. This means the camera mounting bit is missing screw holes on the side where the camera sits, hence the tape in the images.

### AA batteries

I ordered an AAA battery holder instead of an AA holder accidentally, meaning the mAh are capped around 800 rather than the ~2000 mAh you could get from an AA battery. The design would need to be larger to allow for an AA holder.

### Cable connections

Cables from the batteries go into the MotoZero board, with other cables running from the same input screw terminals to the Pi Wide Input shim. Should mean the Pi powers up when the batteries are put in.
