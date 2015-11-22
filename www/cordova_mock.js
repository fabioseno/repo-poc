/*global alert, confirm, console*/

/**
 * @ngdoc property
 * @name navigator.notification
 * @module org.apache.cordova.dialogs
 *
 * @description Cordova Notification API mockup.
 */
navigator.notification = {
    
    alert : function (msg) {
        'use strict';
        
        alert(msg);
        
        //console.log('[CORDOVA MOCK] ALERT');
    },
    
    confirm : function (msg, cb, title, buttons) {
        'use strict';
        
        var result = confirm(msg);

        if (result) {
            cb(1);
        } else {
            cb(2);
        }
        
        //console.log('[CORDOVA MOCK] CONFIRM');

        return result;
    },
    
    beep : function () {
        'use strict';
        
        console.log('[CORDOVA MOCK] BEEP');
    },
    
    vibrate : function () {
        'use strict';
        
        console.log('[CORDOVA MOCK] VIBRATE');
    }
};

window.cordova = window.cordova || {
    plugins: {}
};

window.cordova.plugins.barcodeScanner = {
    scan: function (success, error) {
        var value = prompt("Enter a barcode value");
        
        success({ text: value});
    }
};