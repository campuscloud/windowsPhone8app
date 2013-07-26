//Konfigurationsdaten (Frontend-unabhängig!)
var appconfig = {
    // Standardsprache festlegen
    "standardLanguage": "de-de",

    // Vorkonfigurierte Serveradressen (über "name" identifiziert)
    "servers": {
        "uni-muenster": {
            "type": "owncloud",
            "name": "uni-muenster",
            "host": "http://pscloud.uni-muenster.de/owncloud",
            "webdav": "/files/webdav.php",
            "port": "80",
            "title": "Universität Münster",
            "description": "Owncloud Instanz der Universität Münster",
            "iconPath": "images/homeListIcons/uni_muenster.jpg",
            "langKey": "SERVERMUENSTER",
            "langKeyDesc": "SERVERDESCRIPTIONMUENSTER"
        },

        "uni-muenchen": { // Sharepoint
            "type": "sharepoint",
            "name": "uni-muenchen",
            "host": "https://pscloudservices.sharepoint.com",
            "port": "",
            "title": "Universität München",
            "description": "Sharepoint Instanz der Universität München",
            "iconPath": "images/homeListIcons/lmu_muenchen.jpg",
            "langKey": "SERVERMUENCHEN",
            "langKeyDesc": "SERVERDESCRIPTIONMUENCHEN"
        },
    },

    // Debug-Modus
    "debug": true,

    // Style der Icons: "white" oder "black" oder "green"
    "theme": "green",

    // Dateitypen
    "fileTypesThemeRoot": "images/fileIcons/",
    "fileTypes": {
        "folder": {
            "icon": "folder.png"
        },
        ".pdf": {
            "icon": "pdf.png",
            "previewType": "reader",
        },
        /*".xps": {
            "icon": "xps.png",
        },
        ".oxps": {
            "icon": "oxps.png",
        },*/
        ".cbz": {
            "icon": "pdf.png",
            "previewType": "reader",
        },
        ".ppt": {
            "icon": "ppt.png"
        },
        ".pptx": {
            /*"icon": "pptx.png"*/
            "icon": "ppt.png"
        },
        ".keynote": {
            "icon": "ppt.png"
        },
        ".png": {
            "icon": "image.png",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".jpeg": {
            "icon": "image.png",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".jpg": {
            "icon": "image.png",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".gif": {
            "icon": "gif.png",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".bmp": {
            "icon": "image.png",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".txt": {
            "icon": "txt.png",
            "previewType": "code",
        },
         ".log": {
             "icon": "log.png",
             "previewType": "code",
         },
        ".png": {
            "icon": "image.png",
            "previewType": "image"
        },
        ".psd": {
            "icon": "image.png"
        },
        ".xlsx": {
            "icon": "excel.png"
        },
        ".xls": {
            "icon": "excel.png"
        },
        ".doc": {
            "icon": "doc.png"
        },
        ".docx": {
            "icon": "docx.png",
            "previewType": "word",
        },
        ".vsd": {
            "icon": "visio.png"
        },
        ".mp3": {
            "icon": "music.png",
            "previewType": "audio",
        },
        ".m4a": {
            "icon": "music.png"
        },
        ".wma": {
            "icon": "music.png"
        },
        ".rar": {
            "icon": "compressed_2.png"
        },
        ".zip": {
            "icon": "compressed_2.png"
        },
        ".7z": {
            "icon": "compressed_2.png"
        },
        ".gz": {
            "icon": "compressed_2.png"
        },
        ".tar": {
            "icon": "compressed_2.png"
        },
        ".java": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-java",
        },
        ".c": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-csrc",
        },
        ".cpp": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-c++src",
        },
        ".c#": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-csharp",
        },
        ".css": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/css",
        },
        ".diff": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-diff",
        },
        ".diff": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-diff",
        },
        ".hs": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-haskell",
        },
        ".html": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/html",
        },
        ".js": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/javascript",
        },
        ".lua": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-lua",
        },
        ".p": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-pascal",
        },
        ".perl": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-perl",
        },
        ".php": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-php",
        },
        ".py": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-python",
        },
        ".r": { //Copy Right
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-rsrc",
        },
        ".rb": { //Copy Right
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-ruby",
        },
        ".s": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-scheme",
        },
        ".sql": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-sql",
        },
        ".stex": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-stex",
        },
        ".tex": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-stex",
        },
        ".vb": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/x-vb",
        },
        ".vba": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/vbscript",
        },
        ".vbe": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/vbscript",
        },
        ".vbs": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "text/vbscript",
        },
        ".xml": {
            "icon": "code.png",
            "previewType": "code",
            "codeType": "application/xml",
        },
        ".mp4": {
            "icon": "video.png",
            "previewType": "video",
        },
        ".wmv": {
            "icon": "video.png",
            "previewType": "video",
        },
        ".m4v": {
            "icon": "video.png",
            "previewType": "video",
        },
        ".webm": {
            "icon": "video.png",
            "previewType": "video",
        },
        ".mpeg": {
            "icon": "video.png",
        },
        ".ogg": {
            "icon": "video.png",
        },
        ".mov": {
            "icon": "video.png",
        },
        ".flv": {
            "icon": "video.png",
        },
        ".mkv": {
            "icon": "video.png",
        },
        ".avi": {
            "icon": "video.png",
        },
        ".eml": {
            "icon": "mail.png"
        },
        ".msg": {
            "icon": "mail.png"
        },
        ".benni": {
            "icon": "benni.png"
        },
        ".christoph": {
            "icon": "christoph.png"
        },
        ".simon": {
            "icon": "simon.png"
        },
        ".jannik": {
            "icon": "jannik.png"
        },
        ".patrick": {
            "icon": "patrick.png"
        },
        ".arne": {
            "icon": "arne.png"
        },
        ".david": {
            "icon": "david.png"
        },
        ".tassilo": {
            "icon": "tassilo.png"
        },
        " ": {
            "icon": "unknown.png"
        },
        "": {
        }
    },

    // Tastaturbedienung (für alle Aktionen, die nativ nicht gegeben sind)
    "keyboardContexts": {
        // Spezielle Tastaturbefehle, die ÜBERALL möglich sind (kann nicht abgeschaltet werden)
        // Sehr vorsichtig nur verwenden, z.B. für Flyouts
        "superglobal":
            [{
                "key": "H",
                "altKey": true,
                "action": "showHelpSettings",
                "type": "superglobal",
                "descriptionKey": "HELP",
                "addClickhandler": true,
                "clickhandlerElement": "#helpButton"
            }],
        // Spezielle Tastaturbefehle, die global gelten, aber in einzelnen Kontexten wie Dialogen
        // deaktiviert werden können. Empfohlen für allgemein verfügbare Funktionen (z.B. Navigationsbar)
        "global":
            [
            {
                "key": "2",
                "action": "account",
                "type": "global",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonAccount"
            },
            {
                "key": "3",
                "action": "logout",
                "type": "global",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonLogout"
            },
            ],

        // alle normalen Kontexte sind hier als Array von Tastaturaktionen definiert, z.B. "login",...
        // zu beachten: Bennis neue implementierung mit mehreren Kontexten, in denen die seite geladen ist
        // außerdem sind wechselnde appbar-zustände jeweils neue kontexte (sonst wird die funktion trotz ausblendung ausgeführt)
        /*{ // Beispiel eines Befehls mit allen möglichen parametern, siehe zur Erklärung auch frontendInterface
                "key": "B",
                "action": "irgendwas",
                "type": "normal",
                "ctrlKey": true,
                "altKey": false,
                "shiftKey": true,
                "mode": "keydown",
                "descriptionKey": "SOMETHING",
                "target": "#textfield",
                "delegate": ".subelements",
                "addClickhandler": true,
                "clickhandlerElement": "#buttonid"
            } */
        "login":
            [{
                "key": "Enter",
                "action": "doLogin",
                "descriptionKey": "LOGIN",
                "addClickhandler": true,
                "clickhandlerElement": "#loginButton"
            }],
        "directoryStart":
            [{
                "key": "1",
                "action": "home",
                "type": "global",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            //KEINE AUSWAHL
            {
                "key": "E",
                "ctrlKey": true,
                "action": "refresh",
                "addClickhandler": true,
                "clickhandlerElement": "#refreshButton",
                "descriptionKey": "REFRESH"
            },
            {
                "key": "N",
                "ctrlKey": true,
                "action": "sortByName",
                "addClickhandler": true,
                "clickhandlerElement": "#sortByName",
                "descriptionKey": "SORTBYNAME"
            },
            {
                "key": "S",
                "ctrlKey": true,
                "action": "sortBySizeDesc",
                "addClickhandler": true,
                "clickhandlerElement": "#sortBySize",
                "descriptionKey": "SORTBYSIZE"
            },
            {
                "key": "C",
                "altKey": true,
                "action": "cameraUpload",
                "addClickhandler": true,
                "clickhandlerElement": "#cameraButton",
                "descriptionKey": "HELPCAMERAUPLOAD"
            },
            {
                "key": "U",
                "altKey": true,
                "action": "upload",
                "addClickhandler": true,
                "clickhandlerElement": "#uploadButton",
                "descriptionKey": "UPLOAD"
            },
            {
                "key": "F",
                "ctrlKey": true,
                "action": "createFolder",
                "descriptionKey": "CREATEFOLDER"
            },
            //IMMER BEI AUSWAHL
            {
                "key": "Entf",
                "action": "deleteFileButtonEvent",
                "descriptionKey": "DELETE"
            },
            {
                "key": "M",
                "ctrlKey": true,
                "action": "moveObject",
                "addClickhandler": true,
                "clickhandlerElement": "#moveFileButton",
                "descriptionKey": "HELPMOVEOBJECT"
            },
            //1 AUSGEWÄHLTES ELEMENT
            {
                "key": "O",
                "ctrlKey": true,
                "action": "openFile",
                "addClickhandler": true,
                "clickhandlerElement": "#openButton",
                "descriptionKey": "HELPOPENFILE"
            },
            {
                "key": "D",
                "ctrlKey": true,
                "action": "download",
                "addClickhandler": true,
                "clickhandlerElement": "#downloadButton",
                "descriptionKey": "DOWNLOAD"
            },
            {
                "key": "R",
                "ctrlKey": true,
                "action": "rename",
                "descriptionKey": "RENAME"
            },
            //1 "DATEI" AUSGEWÄHLT
            {
                "key": "H",
                "ctrlKey": true,
                "action": "share",
                "descriptionKey": "SHARE"
            },
            {
                "key": "I",
                "altKey": true,
                "action": "showFileInfo",
                "descriptionKey": "FILEINFO"
            }
                //SelectAll? Strg+A
                //...
            ],
        "directoryRename":
            [/*{
                "key": "Enter",
                "action": "renameConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#renameButton",
                "descriptionKey": "CONFIRMRENAME"
            }*/],
        "directoryDelete":
            [/*{
                "key": "Enter",
                "action": "deleteConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#confirmDeleteButton",
                "descriptionKey": "CONFIRMDELETEBUTTON"
            }*/],
        "directoryCreateFolder":
            [/*{
                "key": "Enter",
                "action": "folderCreateConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#createFolder",
                "descriptionKey": "CREATEFOLDER"
            }*/],
        "directoryShareLink":
            [/*{
                "key": "Enter",
                "action": "shareConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#sendShareLink",
                "descriptionKey": "SENDSHARELINK"
            }*/],
        "fileMover":
            [{
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            {
                "key": "v",
                "ctrlKey": true,
                "action": "paste",
                "addClickhandler": true,
                "clickhandlerElement": "#pasteFileButton",
                "descriptionKey": "PASTE"
            },
            {
                "key": "Esc",
                "action": "cancel",
                "addClickhandler": true,
                "clickhandlerElement": "#cancelButton",
                "descriptionKey": "CANCEL"
            }],
        "shareTarget":
            [{
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            {
                "key": "U",
                "altKey": true,
                "action": "upload",
                "addClickhandler": true,
                "clickhandlerElement": "#uploadButton",
                "descriptionKey": "UPLOAD"
            }],
        "savePicker":
            [{
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            }],
        "openPicker":
            [{
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            }],
    }
};