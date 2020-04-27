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

I have also added a voltmeter, so the Pi can close a relay when the battery is out.
* Relay
* Voltmeter
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

The user data file `wlan-portainer-user-data.yaml` is inspired from this [post](https://blog.hypriot.com/post/cloud-init-cloud-on-hypriot-x64/). Ultimately, I made a whole bunch of changes because the default version wasn't working:
* Simplified the content of wpa_supplicant.conf (ssid/psk)
* Wrote multiple attempts to pull the portainer image (somehow it works after a while?)
* Removed the docker swarm (mostly because I am not familiar with it and it throwing errors)
* Created a crontab that would start a Portainer container at reboot (it wasn't working to launch it right away?)

Note: you might need to reboot one more time to access Portainer, but otherwise open you browser at [http://portainer-pi64.local:9000](http://portainer-pi64.local:9000), and voila :smile:.

```yaml
#cloud-config
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
    plain_text_passwd: password
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
      ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
      update_config=1
      country=FR

      network={
          ssid="YOURS"
          psk="YOURS"
          key_mgmt=WPA-PSK
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
  - 'systemctl restart avahi-daemon'

  # Activate WiFi interface
  - 'ifup wlan0'

  # Pickup the daemon.json changes
  - 'echo Restart Docker'
  - 'systemctl restart docker'

  # Pull latest image
  - 'echo Try pulling image 1'
  - 'docker pull portainer/portainer:latest'
  - 'sleep 2'
  - 'echo Try pulling image 2'
  - 'docker pull portainer/portainer:latest'
  - 'sleep 2'
  - 'echo Try pulling image 3'
  - 'docker pull portainer/portainer:latest'
  - 'sleep 2'
  - 'echo Try pulling image 4'
  - 'docker pull portainer/portainer:latest'
  - 'sleep 2'
  - 'echo Try pulling image 5'
  - 'docker pull portainer/portainer:latest'

  # Create a volume for Portainer
  - 'echo Create a volume for Portainer'
  - 'docker volume create portainer_data'

  # # Run Portainer
  # - 'echo Starting Docker 1'
  # - [
  #    docker, run, "-d",
  #    "-p", "9000:9000", "-p", "8000:8000",
  #    "--name", "portainer",
  #    "--restart", "always",
  #    "-v", "/var/run/docker.sock:/var/run/docker.sock",
  #    "-v", "portainer_data:/data",
  #    "portainer/portainer"
  # ]
  # - 'sleep 15'

  # Create a Cron tab to launch Portainer at reboot
  - crontab -l > mycron
  - echo "@reboot sleep 20 && docker run -d -p 9000:9000 -p 8000:8000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer >> /tmp/job_check.log 2>&1" >> mycron
  - crontab mycron
  - rm mycron

  # Done
  - 'echo Done setting up system'

power_state:
  delay: "+1"
  mode: reboot
  timeout: 10
  condition: True
```

Flashing is actually pretty fast (around a minute or so). When finished, pull out that sweet SD card, and get ready to plug in.

```shell
flash --userdata wlan-portainer-user-data.yaml \
      --bootconf no-uart-config.txt \
      hypriotos-rpi-v1.12.0.img
```
Here for `no-uart-config.txt` (no changes).

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

Note, if you are tinkering with the cloud-config, and especially the runcmd part, you might find useful to access the logs: `vi /var/log/cloud-init-output.log`.

# Setting up the hardware
*[Work in progress]*

# Controlling the relay
*[Work in progress]*
