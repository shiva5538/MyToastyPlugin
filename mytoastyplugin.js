function MyToastyPlugin() {

}

MyToastyPlugin.prototype.show = function(message,
duration,
successCallback,
errorCallback) {
    var options = {};
    options.message = message;
    options.duration = duration;

    cordova.exec(successCallback,
         errorCallback, 'MyToastyPlugin',
        'show', [options]);

}

MyToastyPlugin.install = function() {
    if(!window.plugins) {
        window.plugins = {};
    }
    window.plugins.myToastyPlugin = new MyToastyPlugin();
    return window.plugins.myToastyPlugin;
};

cordova.addConstructor(MyToastyPlugin.install);