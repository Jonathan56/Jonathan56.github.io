---
title: Self-powered Raspberry PI
excerpt_separator: <!--more-->
---

The objective is to power a raspberry pi 24/7 using a solar panel, a battery, and, when the battery is empty power from the grid. This post is a condensed version of my personal notes (things I would like to remember for a next time). There is probably much room for improvement.

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
I am going use [flash](https://github.com/hypriot/flash)  which is a "command line script to flash SD card images of any kind". As discuss in the repo (thanks [hypriot](https://blog.hypriot.com/post/releasing-HypriotOS-1-11/) :ok_hand:):
> The strength of the flash tool is that it can insert some configuration files that gives you the best first boot experience to customize the hostname, WiFi and even user logins and SSH keys automatically.

```shell
curl -O https://raw.githubusercontent.com/hypriot/flash/2.3.0/flash
chmod +x flash
sudo mv flash /usr/local/bin/flash
```

There are [a bunch of images](https://www.raspberrypi.org/downloads/) we could flash, but since Docker support is made easy by [HypriotOS 1.11.0](https://github.com/hypriot/image-builder-rpi/releases/tag/v1.11.0), it was a no-brainer, (once again thanks [hypriot](https://blog.hypriot.com/post/releasing-HypriotOS-1-11/) :ok_hand:).

Flash let us specify `--userdata`, and provide a solution to enable WiFi right-away with `--bootconf`. For the moment, let's just have a nice image with our WiFi enabled, and a [Portainer](https://www.portainer.io/) instance to play with. Ultimately, we might want to move manual steps done in Portainer to `--userdata`, to be more robust at re-building from scratch in case of a power outage.

```shell
flash --userdata wlan-portainer-user-data.yaml \
      --bootconf no-uart-config.txt \
      hypriotos-rpi-v1.12.0.img.zip
```
Here is our user data file `wlan-portainer-user-data.yaml` inspired from this [post](https://blog.hypriot.com/post/cloud-init-cloud-on-hypriot-x64/).

```yaml
# cloud-config
# vim: syntax=yaml
#

hostname: portainer-pi64
manage_etc_hosts: true

# Resize File System (not needed)
resize_rootfs: true
growpart:
    mode: auto
    devices: ["/"]
    ignore_growroot_disabled: false

# User information
users:
  - name: Jonathan
    gecos: "Hypriot Pirate"
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    groups: users,docker,video
    plain_text_passwd: jonathan
    lock_passwd: false
    ssh_pwauth: true
    chpasswd: { expire: false }

# Update apt packages on first boot
package_update: true
package_upgrade: true
package_reboot_if_required: true
packages:
  - ntp

locale: "en_US.UTF-8"
timezone: "France/Paris"

# # WiFi connect to HotSpot
# To make wifi work with RPi3 and RPi0
# you also have to set "enable_uart=0" in config.txt
write_files:
  - content: |
      allow-hotplug wlan0
      iface wlan0 inet dhcp
      wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
      iface default inet dhcp
    path: /etc/network/interfaces.d/wlan0
  - content: |
      country=YourContryCode
      ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
      update_config=1
      network={
      ssid="themeows"
      psk="e2cda882b899a493ffd13d3d0a4fb98fb107e7561b7eaa5d4aa8b31ac11b095a"
      proto=RSN
      key_mgmt=WPA-PSK
      pairwise=CCMP
      auth_alg=OPEN
      }
    path: /etc/wpa_supplicant/wpa_supplicant.conf

  # Tell docker to tag this node appropriately
  # Currently we need the experimental?
  - content: |
      {
        "labels": [ "os=linux", "arch=arm64" ],
        "experimental": true
      }
    path: "/etc/docker/daemon.json"
    owner: "root:root"

# These commands will be ran once on first boot only
runcmd:
  # Pickup the hostname changes
  - [systemctl, restart, avahi-daemon]

  # Activate WiFi interface
  - [ifup, wlan0]

  # Pickup the daemon.json changes
  - [systemctl, restart, docker]

  # Init a swarm, because why not
  - [docker, swarm, init]

  # Run portainer, so we can control stuff from a UI
  - [
      docker, service, create,
      "--detach=false",
      "--name", "portainer",
      "--publish", "9000:9000",
      "--mount", "type=volume,src=portainer_data,dst=/data",
      "--mount",
      "type=bind,src=//var/run/docker.sock,dst=/var/run/docker.sock",
      "portainer/portainer", "-H", "unix:///var/run/docker.sock",
      "--no-auth"
    ]
```

Here for `no-uart-config.txt`.
```text
hdmi_force_hotplug=1
enable_uart=0

# camera settings, see http://elinux.org/RPiconfig#Camera
start_x=1
disable_camera_led=1
gpu_mem=128

# Enable audio (added by raspberrypi-sys-mods)
dtparam=audio=on
```
This step is actually pretty fast (around a minute or so). When finished, pull out that sweet SD card, and get ready to plug in.

* Problem keep Ethernet cable to remote into - Wifi connection didn't work.
* Look at the full booting ? plug a keyboard, not sure I can interact though (Docker is on log and attach?)

*[Work in progress]*

# Testing the system
*[Work in progress]*
