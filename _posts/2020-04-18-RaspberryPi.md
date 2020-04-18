---
title: Self-powered Raspberry PI
excerpt_separator: <!--more-->
---

*[Work in progress]* the objective is to power a raspberry pi 24/7 from a solar panel, a battery, and a power alimentation for when the battery is empty. This post is a condensed version of my personal notes, and things I would like to remember for the next time. There is probably much room for improvement.

<!--more-->
# Proposed architecture (Hardware)
![v2](/assets/image/v2.png)

I ended up buying a slightly bigger solar panel, and battery, to keep using them even if this project fails. For the battery, it wasn't easy to find a commercial product with "pass-through" capabilities (so it can be charged by the solar panel while powering the Pi). I am thinking of adding a PiJuice to avoid interruption, but it might not be necessary ?

* Solar panel: [bigblue-28w](https://cachauffecachauffe.fr/bigblue-28w/)
* Battery: [Elecjet-powerpie](https://www.chargerlab.com/elecjet-powerpie-45w-power-bank-in-depth-review/)

I am also shopping for some current / tension meters to feed some of the data to the PI. For two reasons, first, I would like to visualise power from the solar panel, from the battery, and from the grid on different channels, but I also need to have an idea of the battery's state of charge to switch on the relay.

* Volt-meter: [Expensive options](http://www.yoctopuce.com/EN/products/usb-electrical-sensors/yocto-volt)
* *[Work in progress]*

# Flashing some stuff on the PI (Software)
*[Work in progress]*

# Testing the system
*[Work in progress]*
