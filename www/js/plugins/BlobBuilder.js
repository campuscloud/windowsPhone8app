﻿ /*******************************************************************************
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
/* BlobBuilder.js
 * A BlobBuilder implementation.
 * 2012-04-21
 * 
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self, unescape */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/BlobBuilder.js/blob/master/BlobBuilder.js */

// var BlobBuilder = BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder || (function (view) {
var BlobBuilder = (function (view) {
    "use strict";
    var
          get_class = function (object) {
              return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
          }
        , FakeBlobBuilder = function () {
            this.data = [];
        }
        , FakeBlob = function (data, type, encoding) {
            this.data = data;
            this.size = data.length;
            this.type = type;
            this.encoding = encoding;
        }
        , FBB_proto = FakeBlobBuilder.prototype
        , FB_proto = FakeBlob.prototype
        , FileReaderSync = view.FileReaderSync
        , FileException = function (type) {
            this.code = this[this.name = type];
        }
        , file_ex_codes = (
              "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
            + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
        ).split(" ")
        , file_ex_code = file_ex_codes.length
        , real_URL = view.URL || view.webkitURL || view
        , real_create_object_URL = real_URL.createObjectURL
        , real_revoke_object_URL = real_URL.revokeObjectURL
        , URL = real_URL
        , btoa = view.btoa
        , atob = view.atob
        , can_apply_typed_arrays = false
        , can_apply_typed_arrays_test = function (pass) {
            can_apply_typed_arrays = !pass;
        }

        , ArrayBuffer = view.ArrayBuffer
        , Uint8Array = view.Uint8Array
    ;
    FakeBlobBuilder.fake = FB_proto.fake = true;
    while (file_ex_code--) {
        FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
    }
    try {
        if (Uint8Array) {
            can_apply_typed_arrays_test.apply(0, new Uint8Array(1));
        }
    } catch (ex) { }
    if (!real_URL.createObjectURL) {
        URL = view.URL = {};
    }
    URL.createObjectURL = function (blob) {
        var
              type = blob.type
            , data_URI_header
        ;
        if (type === null) {
            type = "application/octet-stream";
        }
        if (blob instanceof FakeBlob) {
            data_URI_header = "data:" + type;
            if (blob.encoding === "base64") {
                return data_URI_header + ";base64," + blob.data;
            } else if (blob.encoding === "URI") {
                return data_URI_header + "," + decodeURIComponent(blob.data);
            } if (btoa) {
                return data_URI_header + ";base64," + btoa(blob.data);
            } else {
                return data_URI_header + "," + encodeURIComponent(blob.data);
            }
        } else if (real_create_object_URL) {
            return real_create_object_URL.call(real_URL, blob);
        }
    };
    URL.revokeObjectURL = function (object_URL) {
        if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
            real_revoke_object_URL.call(real_URL, object_URL);
        }
    };
    FBB_proto.append = function (data/*, endings*/) {
        var bb = this.data;
        // decode data to a binary string
        if (Uint8Array && data instanceof ArrayBuffer) {
            if (can_apply_typed_arrays) {
                var array = new Uint8Array(data);
                var string = '';
                var i = 64000;

                if (i < array.length) {
                    while (i < array.length) {
                        string += String.fromCharCode.apply(String, array.subarray(i - 64000, i));
                        i += 64000;
                    }
                    string += String.fromCharCode.apply(String, array.subarray(i-64000));
                } else {
                    string += String.fromCharCode.apply(String, array.subarray(0));
                }

                //bb.push(String.fromCharCode.apply(String, array));
                bb.push(string);
            } else {
                var
                      str = ""
                    , buf = new Uint8Array(data)
                    , i = 0
                    , buf_len = buf.length
                ;
                for (; i < buf_len; i++) {
                    str += String.fromCharCode(buf[i]);
                }
            }
        } else if (get_class(data) === "Blob" || get_class(data) === "File") {
            if (FileReaderSync) {
                var fr = new FileReaderSync;
                bb.push(fr.readAsBinaryString(data));
            } else {
                // async FileReader won't work as BlobBuilder is sync
                throw new FileException("NOT_READABLE_ERR");
            }
        } else if (data instanceof FakeBlob) {
            if (data.encoding === "base64" && atob) {
                bb.push(atob(data.data));
            } else if (data.encoding === "URI") {
                bb.push(decodeURIComponent(data.data));
            } else if (data.encoding === "raw") {
                bb.push(data.data);
            }
        } else {
            if (typeof data !== "string") {
                data += ""; // convert unsupported types to strings
            }
            // decode UTF-16 to binary string
            bb.push(unescape(encodeURIComponent(data)));
        }
    };
    FBB_proto.getBlob = function (type) {
        if (!arguments.length) {
            type = null;
        }
        return new FakeBlob(this.data.join(""), type, "raw");
    };
    FBB_proto.toString = function () {
        return "[object BlobBuilder]";
    };
    FB_proto.slice = function (start, end, type) {
        var args = arguments.length;
        if (args < 3) {
            type = null;
        }
        return new FakeBlob(
              this.data.slice(start, args > 1 ? end : this.data.length)
            , type
            , this.encoding
        );
    };
    FB_proto.toString = function () {
        return "[object Blob]";
    };
    return FakeBlobBuilder;
}(self));
