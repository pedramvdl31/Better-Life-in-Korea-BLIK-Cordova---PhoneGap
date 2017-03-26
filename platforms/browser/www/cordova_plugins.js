cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-image-picker/www/imagepicker.js",
        "id": "cordova-plugin-image-picker.ImagePicker",
        "pluginId": "cordova-plugin-image-picker",
        "clobbers": [
            "plugins.imagePicker"
        ]
    },
    {
        "file": "plugins/uk.co.workingedge.phonegap.plugin.launchnavigator/www/common.js",
        "id": "uk.co.workingedge.phonegap.plugin.launchnavigator.Common",
        "pluginId": "uk.co.workingedge.phonegap.plugin.launchnavigator",
        "clobbers": [
            "launchnavigator"
        ]
    },
    {
        "file": "plugins/cordova-plugin-fastrde-checkgps/www/CheckGPS.js",
        "id": "cordova-plugin-fastrde-checkgps.CheckGPS",
        "pluginId": "cordova-plugin-fastrde-checkgps",
        "clobbers": [
            "CheckGPS"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appavailability/www/AppAvailability.js",
        "id": "cordova-plugin-appavailability.AppAvailability",
        "pluginId": "cordova-plugin-appavailability",
        "clobbers": [
            "appAvailability"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-image-picker": "1.1.1",
    "cordova-plugin-request-location-accuracy": "2.2.0",
    "cordova-plugin-queries-schemes": "0.1.1",
    "uk.co.workingedge.phonegap.plugin.launchnavigator": "3.2.1",
    "cordova-plugin-geolocation": "2.1.0",
    "cordova-plugin-fastrde-checkgps": "1.0.0",
    "cordova-plugin-appavailability": "0.4.2"
}
// BOTTOM OF METADATA
});