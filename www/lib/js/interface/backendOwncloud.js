 /*******************************************************************************
 The Campus Cloud software is available under a dual license of MIT or GPL v3.0
 Copyright (C) 2013
       Benjamin Barann, Arne Cvetkovic, Patrick Janning, Simon Lansmann,
       David Middelbeck, Christoph Rieger, Tassilo Tobollik, Jannik Weichert
 /********************************************************************************    
 MIT License:
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 See the MIT License for more details: http://opensource.org/licenses/MIT
 /*******************************************************************************
 GPL License:
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 /******************************************************************************/
//Backend-Owncloud
var backendOwncloud = function () {
    this.implements = ["Backend"];
    this.host = false;
    this.webdav = "/files/webdav.php";
    this.port = false;
    this.username = false;
    this.password = false;
    this.authToken = false;
    this.loginStatus = false;
    this.debugMode = false;
    this.downloadFunction = false;
    this.uploadFunction = false;
    this.requestToken = false;

    // Check functionality
    this.hasVersions = false;
    this.hasDeleted = false;
    this.hasSharelink = true;
    this.hasShare = true;

    this.doInit = function (obj) {
        //Auf Interface-Einhaltung prüfen, sonst wird Fehler generiert
        InterfaceHelper.ensureImplements(this, Backend);

        console.log("Backend-Interface: Owncloud");

        // Verbindunsdetails
        this.host = obj.host;
        this.port = obj.port;
        this.downloadFunction = obj.downloadFunction;
        this.uploadFunction = obj.uploadFunction;

        //Konfigurationsdaten
        this.debugMode = obj.debug;

        // Initialisierung erfolgreich
        return true;
    };

    this.debug = function (msg) {
        // Debug-Meldung ausgeben, falls im Debug-Modus
        if (typeof this.debugMode !== 'undefined' && this.debugMode === true) {
            console.log(msg.toString());
        }
    }

    this.hasFunctionality = function (obj) {
        this.debug("Backend-Funktion hasFunctionality");

        var result = false;
        switch (obj.functionkey) {
            case "getRemainingSpace": result = false; break;
            case "getDeletedFiles": result = this.requestToken && this.hasDeleted; break;
            case "getFileHistory":  result = this.requestToken && this.hasVersions; break;
            case "getPublicLink":   result = this.requestToken && this.hasSharelink; break;
            case "shareFile":       result = this.requestToken && this.hasShare; break;
            default:
                result = false;
        }

        return result;
    }

    this.doAuthentication = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion doAuthentication");

        var self = this;
        this.username = obj.username;
        this.password = obj.password;
        this.authToken = base64.encode(obj.username + ':' + obj.password);
        this.debug(obj.username + ':' + obj.password);
        this.debug("Path: " + this.host + this.webdav);
        this.debug("Token: " + this.authToken);

        // Dummy-Verbindung aufbauen, um Autorisierung zu bestätigen
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (e) {
            // Connection opened and empty result
            if (xhr.readyState == 1){// && xhr.status == 0) { //fails on mobile
                console.log("ASYNC authentication started");

                // Hack to check for unsuccessful authentication
                // There is no possibility to detect if the Windows Authentication Dialogue has popped up
                //xhr.loginTime = e.timeStamp;

            // Connection attempt successful
            } else if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("ASYNC authentication successful");

                var msg = "FULLSUCCESS";

               
                
                // Funktionalität prüfen, dazu zu erst ein Requesttoken erfragen
                self.getRequestToken(self, function () {
                    // Versions is standard feature if we have a token
                    self.hasVersions = true;

                    // Check the other plugins
                    // Deleted files
                    self.getDeletedFiles({ path: "/" }, [function () {
                        /* success */
                        self.hasDeleted = true;
                    }], function () { /* error, nothing to do */ });

                    // Sharelink
                    // Share
                    // TODO
                }, 
                function () { /* error, nothing to do */ });

                successCallback(msg);

            // Connection successful but status not OK
            } else {
                console.log("ASYNC authentication with unknown result");

                self.setLoggedIn(false);
                errorCallback();
            }
        };

        xhr.open('GET', this.host + this.webdav, false);
        xhr.setRequestHeader("Authorization", "Basic " + this.authToken);

        // Exception sofern keine Netzwerkverbindung besteht
        try {
            xhr.send(null);
        } catch (e) {
            errorCallback("NOCONNECTION");
        }
    }

    this.doReAuthentication = function (obj, successCallback, errorCallback) {
        // Get a current request token
        this.getRequestToken(this, successCallback, errorCallback);
    }

    /**
    The request token is needed to perform update or write ajax calls in owncloud 
    when using the internal APIs. It is meant to avoid cross-site request forgery

    The param is needed because "this"-context might not be the backend if called within a request
    @param  context  (object)    the backendOwncloud context
    */
    this.getRequestToken = function (context, successCallback, errorCallback) {
        this.debug("Backend-Funktion getRequestToken");

        var path = context.host + '/index.php/apps/requesttoken/ajax/requesttoken.php';

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (e) {
            // Connection attempt successful
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonBody = JSON.parse(xhr.responseText);
                if (jsonBody && jsonBody.token) {
                    console.log("Request token: " + context.requestToken);

                    context.requestToken = jsonBody.token;
                    successCallback(context);
                } else {
                    errorCallback("NOTOKEN");
                }
            }
        };

        xhr.open('GET', path, false);
        xhr.setRequestHeader("Authorization", "Basic " + this.authToken);

        // Exception sofern keine Netzwerkverbindung besteht
        try {
            xhr.send(null);
        } catch (e) {
            errorCallback("NOCONNECTION");
        }
    }

    this.isLoggedIn = function (obj) {
        return this.loginStatus;
    }

    this.setLoggedIn = function (obj) {
        if (obj && typeof obj.loginStatus != 'undefined') {
            this.loginStatus = obj.loginStatus;
        }
    }

    this.getDirectoryContent = function (obj, callbackList, errorCallback, frontendContext) {
        this.debug("Backend-Funktion getDirectoryContent");

        var fs = new WebDAV.Fs(this.host);

        var urlid = function (u) {
            return u.replace(/:/g, '_').replace(/\//g, '_');
        };

        callbackList.push(function (children, callbackList, errorCallback, context) {
            var elems = [];

            if (children === "ERROR") {
                errorCallback("no such element");
                return;
            }

            for (var c in children) {
                var child = {
                    isDir: false,
                    fileSize: children[c].fileSize,
                    path: children[c].path,
                    date: children[c].date,
                    deleted: false,
                    deletedId: false
                };

                if (typeof child.date !== "undefined") {
                    // Create Date from Object
                    child.date = apptranslator.formatDate(new Date(child.date));
                }

                if(children[c].type === "dir"){
                    child.isDir = true;
                };

                elems.push(child);
            }
           
            var callback = callbackList.pop();
            callback(elems, callbackList, errorCallback, context);
        });

        fs.dir(this.host + this.webdav + obj.path).children(this.authToken, callbackList, errorCallback, frontendContext);
    };
    //TODO
    this.getRemainingSpace = function () {
        this.debug("Backend-Funktion getRemainingSpace");

        return true;
    }

    this.deleteObject = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion deleteObject");
        console.log(this.host + this.webdav + obj.path);
        WebDAV.DELETE(this.host + this.webdav + obj.path, this.authToken, function (response) {
            var error = /<d:error/;
            if (error.test(response)) {
                errorCallback();
            } else {
                console.log("File successfully deleted");
                successCallback();
            }
        });
    }

    this.moveObject = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion moveObject");

        // Skip identical location
        if (obj.srcPath == obj.targetPath) {
            successCallback("IDENTICAL");
            return;
        }

        // Unendliche Rekursion vermeiden
        var splitPath = apphelper.convertPath({ path: obj.srcPath, isDir: obj.isDir });
        var find = obj.targetPath.indexOf(splitPath.dirName);
        if (find == 0 && obj.isDir == true) { // target folder starts with src directory path
            errorCallback("RECURSION");
            return;
        }

        WebDAV.MOVE(this.host + this.webdav + obj.srcPath, this.host + this.webdav + obj.targetPath, this.authToken, function(response){
            var error = /<d:error/;
            if (error.test(response)) {
                errorCallback();
            } else {
                console.log("File successfully moved/renamed");
                successCallback();
            }
        });
    }

    this.renameObject = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion renameObject");

        this.moveObject(obj, successCallback, errorCallback);
    }
    
    this.createFolder = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion createFolder");

        WebDAV.MKCOL(this.host + this.webdav + obj.path + obj.folderName, this.authToken, function (response) {
            var error = /<d:error/;
            if (error.test(response)) {
                errorCallback();
            } else {
                console.log("Folder created");
                successCallback();
            }
        });
    }

    this.uploadFile = function (obj, successCallback, errorCallback, file) {
        this.debug("Backend-Funktion uploadFile");

        // Fehler, wenn die Funktion nicht gesetzt wurde
        if (this.uploadFunction) {
            var param = {
                path: this.host + this.webdav + obj.targetPath,
                username: this.username,
                password: this.password,
                authToken:this.authToken
            };

            this.uploadFunction(param, successCallback, errorCallback, file);
        } else {
            errorCallback();
        }
    }

    this.downloadFile = function (obj, successCallback, errorCallback, targetFile) {
        this.debug("Backend-Funktion downloadFile");

        // Fehler, wenn die Funktion nicht gesetzt wurde
        if (this.downloadFunction) {
            var param = [];

            var totalSize = 0;
            //Mehrere Dateien gleichzeitig
            for (var i in obj) {
                param[i] = {
                    path: this.host + this.webdav + obj[i].dirName,
                    fileName: obj[i].fileName,
                    fileType: obj[i].fileType,
                    username: this.username,
                    password: this.password,
                    fileSize: obj[i].fileSize,
                    type: obj[i].type
                };

                if (obj[i].fileSize && obj[i].fileSize >= 0) {
                    totalSize += obj[i].fileSize;
                }
            }

            this.downloadFunction(param, successCallback, errorCallback, targetFile, totalSize);
        } else {
            errorCallback();
        }
    }

    this.getDeletedFiles = function (obj, callbackList, errorCallback, frontendContext) {
        this.debug("Backend-Funktion restoreVersion");

        // Wichtig: Success callback IMMER ausführen (ggf. leere Rückgabe), da getDirectory darauf wartet
        var callback = callbackList.pop();

        var result = [];

        // Fehler abfangen
        if (!obj || !obj.path) {
            errorCallback();
            callback(result, callbackList, errorCallback, frontendContext);
            return;
        }

        this.doReAuthentication({},
            function (context) {
                var xhr = new XMLHttpRequest();

                if (callback && errorCallback) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                if (xhr.responseText === "") {
                                    errorCallback("NORESPONSE");
                                } else {
                                    var children = JSON.parse(xhr.responseText);

                                    for (var c in children) {
                                        if (c == 0) {
                                            continue; // skip first (=the trash itself)
                                        }

                                        var child = {
                                            isDir: false,
                                            fileSize: false, // there is no filesize in the trash
                                            path: "",
                                            date: children[c].timestamp * 1000,
                                            deleted: true,
                                            deletedId: children[c].timestamp
                                        };

                                        // construct path
                                        if (children[c].path) {
                                            child.path = children[c].directory;
                                        }
                                        child.path = child.path + "/";
                                        if (children[c].name) {
                                            child.path = child.path + children[c].name;
                                        }

                                        if (typeof child.date !== "undefined") {
                                            // Create Date from Object
                                            child.date = apptranslator.formatDate(new Date(child.date));
                                        }

                                        if (children[c].type === "dir") {
                                            child.isDir = true;
                                        };

                                        // Nur Elemente anzeigen, die dem Pfad entsprechen
                                        var pathOnly = "/";
                                        if (children[c].directory) {
                                            pathOnly = children[c].directory + "/";
                                        }
                                        if (pathOnly == obj.path) {
                                            result.push(child);
                                        }
                                    }
                                }
                                // always trigger success
                                callback(result, callbackList, errorCallback, frontendContext);
                            }
                        }
                    };
                }

                var verb = "GET";
                var url = context.host + "/apps/trash_list/ajax/getList.php";

                xhr.open(verb, url, true);
                xhr.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
                xhr.setRequestHeader("Authorization", "Basic " + context.authToken);
                //xhr.responseType = "json";

                try {
                    xhr.send(null);
                } catch (e) {
                    errorCallback("NOCONNECTION");
                    callback(result, callbackList, errorCallback, frontendContext);
                }
            }, function () {
                errorCallback("AUTHENTICATIONERROR");
                callback(result, callbackList, errorCallback, frontendContext);
            });
    }

    this.restoreFile = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion restoreFile");

        // Fehler abfangen
        if (!obj || !obj.path || !obj.deletedId) {
            errorCallback();
            return;
        }

        this.doReAuthentication({},
            function (context) {
                var xhr = new XMLHttpRequest();

                if (successCallback && errorCallback) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                if (xhr.responseText === "") {
                                    errorCallback("NORESPONSE");
                                } else {
                                    var response = JSON.parse(xhr.responseText);
                                    if (response && response.status && response.status == "success") {
                                        successCallback();
                                    } else {
                                        errorCallback("ERROR");
                                    }
                                }
                            }
                        }
                    };
                }

                var ocPath = encodeURI('["' + obj.path.substring(1) + ".d" + obj.deletedId + '"]');

                var verb = "POST";
                var url = context.host + "/index.php/apps/files_trashbin/ajax/undelete.php";
                var params = "files=" + ocPath + "&dirlisting=0";

                xhr.open(verb, url, true);
                xhr.setRequestHeader("Authorization", "Basic " + context.authToken);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                xhr.setRequestHeader("Content-length", params.length);
                xhr.setRequestHeader("requesttoken", context.requestToken);
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                //xhr.setRequestHeader("Referer", context.host + "/index.php/apps/files_trashbin");
                xhr.responseType = "json";

                try {
                    xhr.send(params);
                } catch (e) {
                    errorCallback("NOCONNECTION");
                }
            }, function () {
                errorCallback("AUTHENTICATIONERROR");
            });
    }

    this.getVersions = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion getVersions");

        // Fehler abfangen
        if (!obj || !obj.path) {
            errorCallback();
            return;
        }

        var xhr = new XMLHttpRequest();

        if (successCallback && errorCallback) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        if (xhr.responseText === "") {
                            successCallback([]); // Leere Antwort
                        } else {
                            var response = JSON.parse(xhr.responseText);
                            var result = [];
                            for (i in response) {
                                result.push({
                                    path: obj.path,
                                    size: response[i].size,
                                    versionId: response[i].version,
                                    date: apptranslator.formatDate(new Date(response[i].version * 1000))
                                });
                            }
                            //successCallback(result.splice(0,1)); // skip first element (=current version)
                            successCallback(result);
                        }
                    } else {
                        errorCallback();
                    }
                }
            };
        }

        var verb = "GET";
        var url = this.host + "/apps/files_versions/ajax/getVersions.php?source=" + encodeURI(obj.path);

        xhr.open(verb, url, true);
        xhr.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Basic " + this.authToken);
        xhr.responseType = "json";

        try {
            xhr.send(null);
        } catch(e) {
            errorCallback();
        }
    }

    this.restoreVersion = function (obj, successCallback, errorCallback) {
        this.debug("Backend-Funktion restoreVersion");

        // Fehler abfangen
        if (!obj || !obj.path || !obj.versionId) {
            errorCallback();
            return;
        }

        this.doReAuthentication({},
            function(context){
                var xhr = new XMLHttpRequest();

                if (successCallback && errorCallback) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) { 
                            if (xhr.status >= 200 && xhr.status < 300) {
                                if (xhr.responseText === "") {
                                    errorCallback("NORESPONSE");
                                } else {
                                    var response = JSON.parse(xhr.responseText);
                                    if(response && response.status && response.status == "success"){
                                        successCallback();
                                    } else {
                                        errorCallback("ERROR");
                                    }
                                }
                            }
                        }
                    };
                }

                var verb = "GET";
                var url = context.host + "/apps/files_versions/ajax/rollbackVersion.php?"
                    + "file=" + encodeURI(obj.path)
                    + "&revision=" + encodeURI(obj.versionId)
                    + "&requesttoken=" + context.requestToken;

                xhr.open(verb, url, true);
                xhr.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
                xhr.setRequestHeader("Authorization", "Basic " + context.authToken);
                xhr.responseType = "json";

                try {
                    xhr.send(null);
                } catch(e) {
                    errorCallback("NOCONNECTION");
                }
            }, function(){
                errorCallback("AUTHENTICATIONERROR");
            });
    }

    this.shareObject = function (obj, successCallback, errorCallback) {
        var callbackList = [];

        // Rückgabe
        callbackList.push(successCallback);

        // Share durchführen
        callbackList.push(this.shareFromDataId);

        this.getDataId(obj, callbackList, errorCallback);
    }

    this.getDataId = function (obj, callbackList, errorCallback) {
        this.debug("Backend-Funktion getDataId");

        // Fehler abfangen
        if (!obj || !obj.path) {
            errorCallback();
            return;
        }

        var xhr = new XMLHttpRequest();

        if (callbackList.length > 0 && errorCallback) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        if (xhr.responseText === "") {
                            errorCallback(); // Leere Antwort
                        } else {
                            var response = JSON.parse(xhr.responseText);
                            obj.dataId = response["data-id"];
                            
                            var callback = callbackList.pop();
                            callback(result, callbackList, errorCallback, this);
                        }
                    } else {
                        errorCallback();
                    }
                }
            };
        }

        var verb = "POST";
        var url = this.host + "/index.php/apps/data_id/ajax/getId.php";
        var params = "path=" + encodeURI(obj.path) + "&requesttoken=" + this.requestToken;

        xhr.open(verb, url, true);
        xhr.setRequestHeader("Authorization", "Basic " + this.authToken);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("Content-length", params.length);
        xhr.setRequestHeader("requesttoken", this.requestToken);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.responseType = "json";

        try {
            xhr.send(params);
        } catch (e) {
            errorCallback();
        }
    }

    this.shareFromDataId = function (obj, callbackList, errorCallback, context) {
        if (!obj || !obj.path || !obj.dataId) {
            errorCallback();
            return;
        }
        successCallback();
    }

    this.getShareLink = function (obj, callbackList, errorCallback, context) {

    }
}
