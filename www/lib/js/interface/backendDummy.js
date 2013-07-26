//Backend-Dummy
var backendDummy = function () {
   this.implements = ["Backend"];

   this.doInit = function (obj) {
       InterfaceHelper.ensureImplements(this, Backend);

       console.log("Backend-Interface: Dummy-Implementierung");

       return true;
   };

   this.debug = function (msg) {
       // Debug-Meldung ausgeben, falls im Debug-Modus
       if (typeof this.config.debug !== 'undefined' && this.config.debug === true) {
           console.log(msg.toString());
       }
   }

   this.hasFunctionality = function (key) {
       console.log("Backend-Funktion hasFunctionality");

       return true;
   }

   this.setBackend = function (obj) {
       console.log("Backend-Funktion setBackend");

       return true;
   }

   this.doAuthentication = function (obj, loginSuccess, loginError) {
       console.log("Backend-Funktion doAuthentication");

       loginSuccess();
   }

   this.doReAuthentication = function () {
       console.log("Backend-Funktion doReAuthentication");

       return true;
   }

   this.isLoggedIn = function () {
       console.log("Backend-Funktion isLoggedIn");

       return true;
   };

   this.getDirectoryContent = function (obj) {
       console.log("Backend-Funktion getDirectoryContent");

       var obj = new Array();
       obj.push({
           path: "/test.txt",
           isDir: false,
           filesize: 123456
       }, {
           path: "/datei2.pdf",
           isDir: false,
           filesize: 2345678
       }, {
           path: "/ordner1",
           isDir: true,
           filesize: 0
       });

       return obj;
   }
};