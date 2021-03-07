
var logFile = "[FileUpload.js] ";

export default {
  uploadBlob({blob, url, params, onComplete, onError}){
    var formData = new FormData();
      formData.append('upload', blob, "img_" + (+new Date()) + '.jpg');
      
      if(params){
        Object.keys(params).forEach(key => {
          var val =  obj[key]
          formData.append(key, val);
        });
      }

      var request = new XMLHttpRequest();
      request.open("POST", url);
      request.send(formData);

      request.onreadystatechange = function () {
        if (this.readyState == 4) {
          // Typical action to be performed when the document is ready:
          if (this.status == 200) {
            // var response = JSON.parse(request.response) || "";
            var response = {};
            try {
              response = JSON.parse(request.response) || "";
            } catch (error) {
              console.error(logFile, "Can't part JSON of the response")
            }
            var statusOfSafety = response.status || 0;

            if (statusOfSafety == 1) {
              console.log(logFile, "request: ", request);
              var data = response.data || {};
              console.log(logFile, data);

              var url = data['url'];

              if (onComplete) onComplete(url);
            } else {
              var errMsg = "Ảnh có nội dung không phù hợp.";
              console.error(logFile, errMsg);
              if (onError) onError(errMsg)
            }

          } else {
            var errMsg = "Upload ảnh không thành công!"
            console.error(logFile, errMsg);
            if (onError) onError(errMsg)
          }
        }
      };

      request.onerror = function (res) {
        var errMsg = "Upload ảnh không thành công!"
        console.error(logFile, errMsg, "=>", res);
        if (onError) onError(errMsg)
      }
  }
}