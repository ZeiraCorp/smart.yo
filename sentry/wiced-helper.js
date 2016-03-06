/**
 * Created by k33g_org on 15/03/15.
 */

var lastUpdate = 0
  , last_x = null
  , last_y = null
  , last_z = null
  , SHAKE_THRESHOLD = 20
  , DELAY_FOR_UPDATE = 100;

module.exports = {

  onAcceleration: function (params) {
    var xaccel = params.coords.Xaccel;
    var yaccel = params.coords.Yaccel;
    var zaccel = params.coords.Zaccel;

    var curTime = Date.now();

    if((curTime - lastUpdate) > DELAY_FOR_UPDATE) {

      var diffTime = (curTime - lastUpdate);
      lastUpdate = curTime;

      var speed = Math.floor(Math.abs(xaccel + yaccel + zaccel - last_x - last_y - last_z)/ diffTime * 100);

      var velocityX = Math.floor((xaccel - last_x)/ diffTime * 100);
      var velocityY = Math.floor((yaccel - last_y)/ diffTime * 100);
      var velocityZ = Math.floor((zaccel - last_z)/ diffTime * 100);

      var speedMove = Math.round(
        Math.max(
          Math.abs(velocityX)/6,
          Math.abs(velocityY)/6,
          Math.abs(velocityZ)/6
        )
      );

      var headingMove = Math.round(
        ((180.0 - (
        Math.atan2(velocityY, velocityX)
        * (180.0 / Math.PI))
        ))
      );

      if (speed > SHAKE_THRESHOLD) {
        if (params.onShake) params.onShake(speedMove, headingMove)
      }
      if (params.onSpeed) params.onSpeed(speedMove, headingMove)

      last_x = xaccel;
      last_y = yaccel;
      last_z = zaccel;

      //return speed;

    }
  }


}