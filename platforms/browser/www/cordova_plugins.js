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
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-image-picker": "1.1.1",
    "cordova-plugin-request-location-accuracy": "2.2.0",
    "cordova-plugin-queries-schemes": "0.1.1",
    "uk.co.workingedge.phonegap.plugin.launchnavigator": "3.2.1"
}
// BOTTOM OF METADATA
});