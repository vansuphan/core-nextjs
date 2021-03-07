
var _requestedDeviceOrientation = false
var _isDeviceOrientationSupport = false

export default {
  get isPotrait() {
    if (window && !window.orientation) return window.matchMedia("(orientation: portrait)").matches;
    return !((window && window.orientation === 90) || (window && window.orientation === -90));
  },

  get isLandscape() {
    return !this.isPotrait;
  },

  get isDeviceOrientationSupport() {
    // if (!_requestedDeviceOrientation) {
    //   await this.requestDeviceOrientationData()
    // }
    return _isDeviceOrientationSupport
  },

  async requestDeviceOrientationData() {
    if (!window) {
      // not supported
      console.warn("`window` not found")
      _isDeviceOrientationSupport = false
      return;
    }

    // console.log(window)
    if (window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      console.log("This browser can be requested for `DeviceOrientationEvent` permission")
      try {
        const response = await window.DeviceOrientationEvent.requestPermission()
        // console.log(response)
        if (response == 'granted') {
          console.log("`DeviceOrientationEvent` permission -> granted!")
          _isDeviceOrientationSupport = true
        } else {
          // rejected
          console.log("`DeviceOrientationEvent` permission ->", response)
          _isDeviceOrientationSupport = false
        }
      } catch (error) {
        // not supported
        console.log(error)
        _isDeviceOrientationSupport = false
      }
    } else {
      // not supported
      console.warn("`window.DeviceOrientationEvent` not found")
      _isDeviceOrientationSupport = false
    }

    return _isDeviceOrientationSupport;
  }
}