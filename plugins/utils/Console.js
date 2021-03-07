import { cloneDeep } from "lodash"
var _console = cloneDeep(console)

export default {
  enable(params) {
    //<iframe> element
    // var iframe = document.createElement("iframe");
    // //Hide it somewhere
    // iframe.style.position = "fixed";
    // iframe.style.height = iframe.style.width = "1px";
    // iframe.style.top = iframe.style.left = "-5px";
    // iframe.style.display = "none";
    // //No src to prevent loading some data
    // iframe.src = "about: blank";
    // //Needs append to work
    // document.body.appendChild(iframe);
    // //Get the inner console
    // window.console = {};
    // window.console = iframe.contentWindow.console;
    return _console
    // delete iframe;
  },

  disable() {
    // console.clear()
    for (var i in console) {
      console[i] = function () { };
    }
  },

  showCredit () {
    console.log("Developed by Digitop | https://www.wearetopgroup.com/?utm_src=console");
  }
}