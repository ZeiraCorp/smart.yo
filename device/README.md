# Smart.Yo Device



## Screen

### to try

Force the screen to stay on

    sudo nano /etc/lightdm/lightdm.conf

Add the following lines to the `[SeatDefaults]` section:

    # don't sleep the screen
    xserver-command=X -s 0 dpms

### or

- [https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=57552](https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=57552)
- [https://github.com/notro/fbtft/wiki/Boot-console#console-blanking](https://github.com/notro/fbtft/wiki/Boot-console#console-blanking)


## Remark

- device name: `bobnext.local`
- application directory: `smart.yo.device`
- run: ./bob.sh
