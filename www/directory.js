console.log("cloud.pages.directory.js loaded");

var Stack = function () {
    this.stack = new Array();
    this.pop = function () {
        return this.stack.pop();
    };
    this.last = function () {
        var result = this.stack.pop();
        this.stack.push(result);
        return result;
    };
    this.push = function (item) {
        this.stack.push(item);
    };
    this.isEmpty = function () {
        return this.stack.length == 0;
    };
    this.length = function () {
        return this.stack.length;
    };
};
var History = function () {
    this.stack = new Array();
    this.last = function () {
        var result = this.stack.pop();
        this.stack.push(result);
        return result;
    };
    this.push = function (item) {
        var last = this.last();
        this.stack.push(item);
    };
};

// Reference page in cloud object for initialisation
cloud.pages.directory = {};

cloud.pages.directory = {
    items: Array(),
    pathHistory: new Stack(),
    currentSortType: "name",
    moveSrc: new Array(),
    renameSrc: new Array(),
    deleteSrc: new Stack(),
    contextHistory: new History(),
    selectionCounter: 0,

    init: function () {

        cloud.pages.directory.contextHistory.push("contextNormal");
        //Set Event Handler

        $('.navbarLogout').on('click', cloud.pages.directory.logoutButtonClickedEvent);
        $('.navbarSelection').on('click', cloud.pages.directory.selectionButtonClickedEvent);
        $('.navbarClearSelection').on('click', cloud.pages.directory.clearSelection);

        cloud.pages.directory.pathHistory.push("/");
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.reloadDirectory();

        //Rename
        $('.navbarRename').on('click', cloud.pages.directory.renamePrepareEvent);
        //Delete
        $('.navbarDelete').on('click', cloud.pages.directory.deletePrepareEvent);
        //Move
        $('.navbarMove').on('click', cloud.pages.directory.movePrepareEvent);
        //Create Folder
        $('.navbarCreateFolder').on('click', cloud.pages.directory.createFolderPrepareEvent);

        $('.navbarMoveTarget').on('click', cloud.pages.directory.moveElement);
        $('.navbarCancel').on('click', cloud.pages.directory.resetContext);

        document.addEventListener("deviceready", onDeviceReady, false);

        //$('.navbarBack').on('click', cloud.pages.directory.backButtonClickedEvent);
    },

    onDeviceReady: function () {
        console.log("onDeviceReady");
    },

    resetContext: function () {
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.reloadDirectory();
    },

    setPreviousContext: function () {
        var actual = cloud.pages.directory.contextHistory.stack.pop();
        var previous = cloud.pages.directory.contextHistory.last();
        cloud.pages.directory.contextHistory.push(actual);
        cloud.pages.directory.setContext(previous);
    },

    setContext: function (newContext) {
        if (!newContext) { newContext = "contextNormal"; }
        if (newContext == "contextNormal") {
            newContext = "contextSelection";
        }
        var actualContext = cloud.pages.directory.contextHistory.last();
        if (newContext == "contextSelection") {
            if (("contextDeletion" + "contextRename" + "contextMovePickTarget").indexOf(actualContext) >= 0) {
                cloud.pages.directory.clearSelection();
            }
        }
        cloud.pages.directory.contextHistory.push(newContext);
        cloud.pages.directory.updateView();
    },

    clearSelection: function () {
        cloud.pages.directory.selectionCounter = 0;
        $("input[type='checkbox']").prop("checked", false).checkboxradio("refresh");

        cloud.pages.directory.resetContext();
    },

    updateHeader: function () {
        $('#headerTextDirectory').text(cloud.pages.directory.pathHistory.last());
    },

    // Update der ListView Inhalte abhängig vom Kontext
    updateView: function () {
        // Update Selection Context - MUST BE FIRST ENTRY!!!!
        if ("contextSelection" == cloud.pages.directory.contextHistory.last()) {
            //Set exact selection context, to get context sensitive bars a.s.o. later
            var newContext;
            if (cloud.pages.directory.selectionCounter == 1) {
                newContext = "contextSelectionSingle";
            } else if (cloud.pages.directory.selectionCounter > 1) {
                newContext = "contextSelectionMultiple";
            }
            if (newContext) {
                cloud.pages.directory.contextHistory.push(newContext);
            }
        } else {

        }
        //Update View
        $('.context').not('.' + cloud.pages.directory.contextHistory.last()).hide();
        $('.' + cloud.pages.directory.contextHistory.last()).show();
        //Workaround for app-bar to not show more than 1 title 
        $('.ui-app-bar-inside').each(
           function () {
               $(this).find('div.ui-app-bar-titles').not(':first').hide();
           });
        // Update Header
        cloud.pages.directory.updateHeader();
    },

    reloadDirectory: function () {
        // Update content List
        cloud.getDirectoryContent({
            path: cloud.pages.directory.pathHistory.last(),
            sortBy: cloud.pages.directory.currentSortType
        }, function (directoryContent) {
            cloud.pages.directory.insertElements(directoryContent);
            cloud.pages.directory.updateView();
        }, function () {
            cloud.debug("directory Load failed");
        });
    },

    // Initiiere die ListView
    initListView: function () {
        var listView = document.getElementById("directoryView");

    },

    insertElements: function (directoryContent) {
        cloud.pages.directory.items = Array();
        // Überführen der Verzeichnisinhalte in Listview
        for (var i in directoryContent) {
            // Wenn es ein Ordner ist
            if (directoryContent[i].isDir) {
                cloud.pages.directory.items[i] = {
                    title: directoryContent[i].fileName,
                    sizeText: "",
                    path: directoryContent[i].path,
                    filetype: "folder",
                    sizeNum: 0,
                    bNum: directoryContent[i].bNum,
                    picture: cloud.getFileIcon({
                        fileType: "folder"
                    }),
                    date: " - "
                };
            }
                // Andere Dateitypen
            else {
                // Im FileMover keine Dateien anzeigen
                if (cloud.pages.directory.contextHistory.last() !== "contextMovePickTarget") {
                    cloud.pages.directory.items[i] = {
                        title: directoryContent[i].fileName
                                + directoryContent[i].fileType,
                        sizeText: directoryContent[i].bestText,
                        path: directoryContent[i].path,
                        filetype: directoryContent[i].fileType,
                        sizeNum: directoryContent[i].bestNum,
                        bNum: directoryContent[i].bNum,
                        picture: cloud.getFileIcon({
                            fileType: directoryContent[i].fileType
                        }),
                        date: directoryContent[i].date
                    };
                }
            }
        }
        $('#directoryView').empty();

        // Generate ListView
        for (var i in cloud.pages.directory.items) {

            $('#directoryView').append(
                    '<li class="listElement showCheckbox" data-role="fieldcontain" data-filter="true" data-fileName="' + cloud.pages.directory.items[i].title + '">' +
                    '<div class="ui-grid-b">' +
                    '<div class="ui-block-a">' +
                    '<input type="checkbox" id="selectionCheckbox' + i + '" class="selectionCheckbox" data-mini="true" />' +
                    '<label for="selectionCheckbox' + i + '">&nbsp;<label/>' +
                    '</div>' +
                   // '<div class="ui-block-b">' +
                   //' <img class="fileIcon" src="' + cloud.pages.directory.items[i].picture + '" alt="Icon">' +
                    '<div class="ui-block-b" style="background-image:url(\'' + cloud.pages.directory.items[i].picture + '\')">' +
                    '</div>' +
                    '<div class="ui-block-c">' +
                    '<h3>' + cloud.pages.directory.items[i].title + '</h3>' +
                    '<p><strong>' + cloud.pages.directory.items[i].sizeText + '</strong></p>' +
            /*        '<p>Unteruntertitel</p>' +*/
                    '</div>' +
                    '</div>' +
                    '</li>');
            $('#selectionCheckbox' + i).on("change", cloud.pages.directory.selectionCheckboxClickedEvent);
        }
        $('.listElement').on('vclick', cloud.pages.directory.itemClickedEvent);
        $("#directoryView").trigger('create');
        $("#directoryView").listview('refresh');
    },

    // Event Handler
    itemClickedEvent: function (event) {
        $('body').addClass('ui-loading');
        event.preventDefault();
        var fileName = event.currentTarget.attributes["data-filename"].textContent;

        for (var i in cloud.pages.directory.items) {
            if (cloud.pages.directory.items[i].title == fileName) {
                // Check if it is a folder
                if (cloud.pages.directory.items[i].filetype == "folder") {
                    // Folder Handling
                    var folderPath = cloud.pages.directory.items[i].path;
                    cloud.pages.directory.pathHistory.push(folderPath);
                    cloud.pages.directory.reloadDirectory();
                    cloud.pages.directory.updateHeader();
                    cloud.pages.directory.updateView();
                } else {
                    // File Handling
                    if (cloud.config.fileTypes[cloud.pages.directory.items[i].filetype] && cloud.config.fileTypes[cloud.pages.directory.items[i].filetype].previewType == "image") {
                        cloud.pages.directory.openPicturePopup(fileName);
                    } else if (cloud.config.fileTypes[cloud.pages.directory.items[i].filetype] && cloud.config.fileTypes[cloud.pages.directory.items[i].filetype].previewType == "video") {
                        cloud.pages.directory.openVideoPopup(fileName);
                    } else if (cloud.pages.directory.items[i].filetype == ".pdf") {
                        cloud.pages.directory.openPdfPopup(fileName);
                    } else if (cloud.config.fileTypes[cloud.pages.directory.items[i].filetype] && cloud.config.fileTypes[cloud.pages.directory.items[i].filetype].previewType == "code") {
                        cloud.pages.directory.openTextPopup(fileName);
                    }
                }
                break;
            }
        }
    },

    openPdfPopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewPdfDownloadSuccess);
    },

    openVideoPopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewVideoDownloadSuccess);
    },

    openPicturePopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewPictureDownloadSuccess);
    },

    openTextPopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewTextDownloadSuccess);
    },

    selectionButtonClickedEvent: function (event) {
        if (cloud.pages.directory.contextHistory.last() == "contextSelection") {
            cloud.pages.directory.setContext("contextNormal");
        }
        else if (cloud.pages.directory.contextHistory.last() == "contextNormal") {
            cloud.pages.directory.setContext("contextSelection");
        }

    },

    selectionCheckboxClickedEvent: function (event) {
        if (event.currentTarget.checked) {
            cloud.pages.directory.selectionCounter = cloud.pages.directory.selectionCounter + 1;
        } else {
            cloud.pages.directory.selectionCounter = cloud.pages.directory.selectionCounter - 1;
        }
        cloud.pages.directory.setContext('contextSelection');
    },

    logoutButtonClickedEvent: function (event) {
        cloud.setLoggedIn({ loginStatus: false });
        cloud.storage.deleteItem(login.saveLoginKey);
        $.mobile.changePage("#loginPage", { transition: "slide" });
    },

    backButtonClickedEvent: function (event) {
        console.log("backButtonClickedEvent");
        if (cloud.pages.directory.pathHistory.last() != "/") {
            cloud.pages.directory.pathHistory.pop();
        }
        cloud.pages.directory.reloadDirectory();
    },


    movePrepareEvent: function () {
        // Remember selection
        for (var i in cloud.pages.directory.items) {
            $('.ui-icon-checkbox-on').each(function () {
                if (cloud.pages.directory.items[i].title == $(this).parents('li').find('.ui-li-heading').text()) { // Übereinstimmung
                    // Src-Daten festhalten
                    cloud.pages.directory.moveSrc.push({
                        path: cloud.pages.directory.items[i].path,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });
                }
            });
        }

        cloud.pages.directory.setContext("contextMovePickTarget");
        cloud.pages.directory.reloadDirectory();
    },

    moveElement: function (event) {
        if (cloud.pages.directory.contextHistory.last() == "contextMovePickTarget" && cloud.pages.directory.moveSrc.length > 0) {
            for (i in cloud.pages.directory.moveSrc) {

                var src = cloud.pages.directory.moveSrc.pop();
                // Get file name
                var splitPath = apphelper.convertPath({
                    path: src.path,
                    isDir: src.isDir
                });

                var targetPath;

                if (cloud.pages.directory.pathHistory.last() == "/") {
                    targetPath = cloud.pages.directory.pathHistory.last() + splitPath.fileFullName;
                } else {
                    targetPath = cloud.pages.directory.pathHistory.last() + "/" + splitPath.fileFullName;
                }
                console.log("Move it from: " + src.path + " to: " + targetPath);
                cloud.moveObject({
                    srcPath: src.path,
                    targetPath: targetPath,
                    isDir: src.isDir
                }, cloud.pages.directory.moveElementSuccess, cloud.pages.directory.moveElementError);
            }
        }

        // Kontext zurücksetzen
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.reloadDirectory();
    },

    moveElementSuccess: function (event) {
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.reloadDirectory();
        console.log("Moving successful");
    },

    moveElementError: function (event) {
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        console.log("Error while moving");

    },

    deletePrepareEvent: function () {
        cloud.pages.directory.setContext("deletion");
        var array = document.getElementsByClassName('ui-icon-checkbox-on');
        for (e in $('.ui-icon-checkbox-on')) {
            var fileName = $('.ui-icon-checkbox-on').parents('li').find('.ui-li-heading')[e].outerText;

            // Find correct element in list and remember selection
            for (var i in cloud.pages.directory.items) {
                if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                    // Get file name
                    var splitPath = apphelper.convertPath({
                        path: cloud.pages.directory.items[i].path,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });

                    cloud.pages.directory.deleteSrc.push({
                        path: cloud.pages.directory.items[i].path,
                        name: splitPath.fileFullName,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });
                    break;
                }
            }
        };
        $("#deletePopup").popup("open");
    },

    deleteFile: function () {
        while (!cloud.pages.directory.deleteSrc.isEmpty()) {
            var src = cloud.pages.directory.deleteSrc.pop();
            console.log("Delete: " + src.path);

            cloud.deleteObject({
                path: src.path
            },
                function () { /*success*/
                    console.log("Delete successful");
                },
                function () {
                    console.log("Error while deletion");
                }
            );
        }
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.reloadDirectory();
    },

    renamePrepareEvent: function () {
        cloud.pages.directory.setContext("rename");
        if ($('.ui-icon-checkbox-on').size() > 1) {
            // Too many items selected
            cloud.debug("Zu viele Items selektiert");
            // Kontext zurücksetzen
            cloud.pages.directory.setContext("normal");
            return;
        } else if ($('.ui-icon-checkbox-on').size() == 1) {
            var fileName = $('.ui-icon-checkbox-on').parents('li').find('.ui-li-heading')[0].outerText;

            // Remember selection
            for (var i in cloud.pages.directory.items) {
                if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                    // Get file name
                    var splitPath = apphelper.convertPath({
                        path: cloud.pages.directory.items[i].path,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });

                    cloud.pages.directory.renameSrc = {
                        path: cloud.pages.directory.items[i].path,
                        name: splitPath.fileFullName,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    };

                    // Rename dialog
                    $("#renamePopup").popup("open");
                    $("#renameTextfield").val(cloud.pages.directory.renameSrc.name);

                    break; // rest nicht mehr durchgehen, da nur einzelne elemente umbenannt werden dürfen
                }
            }
        }
        cloud.pages.directory.setContext("contextRenamePickName");
    },

    renameFile: function () {
        console.log("New Name:" + $('#renameTextfield').val());

        var src = cloud.pages.directory.renameSrc;
        cloud.renameObject({
            srcPath: src.path,
            targetName: $('#renameTextfield').val(),
            isDir: src.isDir
        },
            function () { /*success*/
                console.log("Renaming successful");
            },
            function () {
                console.log("Error while renaming");
            }
        );
        // Handle UI
        $(document).trigger('simpledialog', { 'method': 'close' });
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.reloadDirectory();
    },

    createFolderPrepareEvent: function () {
        // Create dialog
        $("#createFolderPopup").popup("open");

        // Kontext zurücksetzen
        cloud.pages.directory.setContext("contextCreatePickName");
    },

    createFolder: function () {
        console.log("New Folder:" + $('#createFolderTextfield').val());

        var targetPath;
        if (cloud.pages.directory.currentPath == "/") {
            targetPath = cloud.pages.directory.currentPath;
        } else {
            targetPath = cloud.pages.directory.currentPath + "/";
        }

        cloud.createFolder({
            path: targetPath,
            folderName: $('#createFolderTextfield').val()
        },
            function () { /*success*/
                console.log("Folder creation successful");
                cloud.pages.directory.updateView();
            },
            function () {
                console.log("Error while creating folder");
            }
        );

        cloud.pages.directory.setPreviousContext();
        cloud.pages.directory.reloadDirectory();
    },

    capturePicture: function () {
        navigator.device.capture.captureImage(cloud.pages.directory.captureSuccess, cloud.pages.directory.captureError, { limit: 1 });
    },
    captureVideo: function () {
        navigator.device.capture.captureVideo(cloud.pages.directory.captureSuccess, cloud.pages.directory.captureError, { limit: 1 });
    },
    captureAudio: function () {
        navigator.device.capture.captureAudio(cloud.pages.directory.captureSuccess, cloud.pages.directory.captureError, { limit: 1 });
    },

    uploadSucceed: function (r) {
        console.log("upload Succeed" + r);
        cloud.pages.directory.refreshDirectory();
    },

    uploadError: function (error) {
        console.log("uploadError: " + error);
    },
    previewPrepareEvent: function (fileName, successFunction) {
        for (var i in cloud.pages.directory.items) {
            if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                var param = [];
                param[0] = apphelper.convertPath({ path: cloud.pages.directory.items[i].path });
                cloud.downloadFile(param, successFunction, cloud.functions.downloadError, null);
                break;
            }
        }
    },

    previewPdfDownloadSuccess: function (blob, filename) {
        blob.type = 'application/pdf';

            window.open(window.URL.createObjectURL(blob), '_system', 'location=yes');
            //navigator.load.url(window.webkitURL.createObjectURL(blob))
            //$('#objectSource')[0].data = window.webkitURL.createObjectURL(blob);
            //$('#objectPopup').popup();
            //$('#objectPopup').popup("open");
        
        $('body').removeClass('ui-loading');
    },

    previewTextDownloadSuccess: function (blob, filename) {
        blob.type = 'text/txt';
            window.open(window.URL.createObjectURL(blob), '_blank', 'location=yes');
        $('body').removeClass('ui-loading');
    },

    previewVideoDownloadSuccess: function (blob, filename) {
        blob.type = 'video/mp4';

            window.open(window.URL.createObjectURL(blob), '_blank', 'location=yes');
            //navigator.load.url(window.webkitURL.createObjectURL(blob))
            //$('#objectSource')[0].data = window.webkitURL.createObjectURL(blob);
            //$('#objectPopup').popup();
            //$('#objectPopup').popup("open");
      
        $('body').removeClass('ui-loading');
    },

    previewPictureDownloadSuccess: function (blob, filename) {
        //$('#imagePopupImg')[0].src = window.URL.createObjectURL(blob);
        //$('#imagePopup').popup();
        //$('#imagePopup').popup("open");
        window.open(window.URL.createObjectURL(blob), '_blank', 'location=yes');
        $('body').removeClass('ui-loading');
    },

    downloadPrepareEvent: function () {
        var headings = $('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading');
        for (h in headings) {
            var fileName = headings[h].outerText;
            for (var i in cloud.pages.directory.items) {
                if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                    var param = [];
                    param[0] = apphelper.convertPath({ path: cloud.pages.directory.items[i].path });
                    cloud.downloadFile(param, cloud.functions.downloadSuccess, cloud.functions.downloadError, null);
                    break;
                }
            }
        }
    },
    fileSystemReadSucceed: function (fileEntry) {
        console.log("Datei aufgenommen: " + fileEntry.fullPath);
        cloud.uploadFile({ targetPath: cloud.pages.directory.pathHistory.last() }, cloud.pages.directory.uploadSucceed, cloud.pages.directory.uploadError, fileEntry);
    },

    captureSuccess: function (mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function () { console.log("Got access to the filesystem!") }, cloud.pages.directory.filesystemError);
            window.resolveLocalFileSystemURI(path, cloud.pages.directory.fileSystemReadSucceed, cloud.pages.directory.filesystemReadError);
        }
    },

    fileSystemReadError: function (evt) {
        console.log("FileSystemErrror: " + evt.target.error.code);
    },

    captureError: function (error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    }


}