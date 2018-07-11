# MyToastyPlugin

# 6 STEPS TO CREATE CORDOVA PLUGIN?
*=*=*=*
You’ve browsed Cordova’s 2,880 plugins and you couldn’t quite find the one that you were looking for. You’ve scratched your head, you’ve scratched your chin, and you’ve even scratched your back only to learn that no amount of scratching will help you acquire the native functionality you’re looking for. You have to build the plugin from… scratch.
In this tutorial, we’ll show you how to do that step-by-step. You’ll go from nothing to a fully-integrated Cordova plugin that you can use in your mobile projects.

#Prerequisites:

Native Android development

Android SDK

Node.js

Apache Cordova

Because it’s not possible to personalize blog articles (yet), this tutorial will go through the steps for building and integrating a plugin that already exists. It’s an Android Cordova plugin that grants your application the ability to display Android’s Toasts. Toasts are the text messages that pop up at the bottom of the screen and then disappear.

# 1. CREATE A CORDOVA TEST PROJECT
To begin, you need a Cordova project that you will use as a base for testing your plugin.
Assuming you’ve installed Node and the Cordova CLI, navigate to a work directory in the command line.
My test project is called Toasty Plugin Test and this is how to set it up:

$ cordova create toasty-plugin-test com.shiva.toastyplugintest ToastyPluginTest

(Change the package name, if you like. Or boost my ego by giving me all the credit!)

Navigate into the project directory to add an Android dependency:

$ cd toasty-plugin-test

$ cordova platforms add android

This will install any prerequisites required to run your Android-facing Cordova application. Before you can test the application, you need to verify that all requirements are met. Do so by executing the following command in the toasty-plugin-test directory:

$ cordova requirements

During my attempt, my path variable was missing the location of javac and I hadn’t installed the latest Android SDK platform: 26. I added Android Studio’s built-in JRE to my PATH variable and installed version 26 of the Android SDK using the SDK manager. Downloading required SDKs and system images can take a little while, so return to this tutorial after they’ve installed, and you’ll be read for step 2.

# 2. TEST YOUR EMPTY CORDOVA PROJECT
To guarantee that you’ve set up your project and dependencies properly, let’s run your empty project in an Android emulator. Before proceeding, verify that you have an AVD (Android Virtual Device) installed and running. If you’ve never created an AVD before, follow this handy guide from Google, Create and Manage Virtual Devices. I used a Pixel with API version 25 as my base device configuration and left the remaining parameters untouched — you can do the same.
Tip: install Intel HAXM through the Android SDK manager to guarantee best performance during X86 emulation.
After you establish your AVD and launch it through Android Studio, you should see a window similar to this:

Emulator was set up properly!
This confirms that your emulator is set up properly and is ready to run your empty Cordova application. To run your Cordova app, you must first build it with the following command:

# Run all commands in your toasty-plugin-test project directory

$ cordova build android

After a little bit of waiting, the build should finish and you can run the app on your emulator with the following command:

$ cordova emulate android

If you accidentally closed your emulator, don’t worry; Cordova will use the Android SDK’s command-line tools to start up a new one. After a bit of patience, you should see the following screen:

And that’s it! Your project is ready!

Now you can continue to the next step.

# 3. CREATE A PLUGIN PROJECT

From Github or any other favorite source code repository, create an empty public project for your plugin. I named mine ToastyPlugin and assigned an MIT license. Pull the empty repository down to your machine and create a plugin.xml file at the root directory. Copy the following contents to your plugin.xml file:

<?xml version="1.0" encoding="UTF-8"?>

<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
        xmlns:android="http://schemas.android.com/apk/res/android"
        id="cordova-plugin-toastyplugin" version="0.0.1">
    <name>ToastyPlugin</name>

    <description>An Android Cordova plugin that allows users to display simple Toast messages at the bottom of the screen.</description>
    <license>MIT</license>

    <keywords>cordova,android,toast,message,alert</keywords>
    <repo>https://github.com/shiva5538/MyToastyPlugin.git</repo>
    <issue>https://github.com/shiva5538/MyToastyPlugin/issues</issue>
  
    <engines>
        <engine name="cordova" version=">=3.0.0"/>
    </engines>
  
    <js-module src="www/toastyplugin.js" name="toastyPlugin">
        <clobbers target="window.plugins.toastyPlugin" />
    </js-module>
    <platform name="android">
        <config-file target="res/xml/config.xml" parent="/*">
            <feature name="ToastyPlugin">
                <param name="android-package" value="com.shiva.cordova.plugin.ToastyPlugin"/>
            </feature>
        </config-file>

        <source-file src="src/android/ToastyPlugin.java" target-dir="src/com/shiva/cordova/plugin" />
    </platform>
</plugin>

Note: Change package names (optional) and repository URLs (mandatory).

The plugin.xml file provides the basis for your plugin and performs several functions. It names the plugin, points to the JavaScript source code that binds the plugin to the Cordova project, and assigns platform-specific source code and configurations to the project that includes it. To learn more about the plugin.xml file, check out Cordova’s plugin.xml documentation.

You need to create one more file before you can proceed to the next step: package.json. This is the npm registry file that combines standard npm attributes with Cordova specifics. You won’t need to publish your plugin to the registry before using it in your OutSystems project, but Cordova requires this file to install the plugin properly. Create an empty package.json file in your plugin directory and populate it with the following content:

{

  "name": "cordova-plugin-toastyplugin",
  
  "version": "0.0.1",
  
  "description": "An Android Cordova plugin that allows users to display simple Toast messages at the bottom of the screen.",
  
  "cordova": {
  
    "id": "cordova-plugin-toastyplugin",
    
    "platforms": [
    
      "android"
      
    ]
    
  },
  
  "repository": {
  
    "type": "git",
    
    "url": "git+https://github.com/shiva5538/MyToastyPlugin.git"
    
  },
  
  "keywords": [
  
    "Toast",
    
    "Notification",
    
    "Message",
    
    "Alert",
    
    "ecosystem:cordova",
    
    "cordova-android"
    
  ],
  
  "engines": [
  
    {
    
      "name": "cordova",
      
      "version": ">=3.0.0"
      
    }
    
  ],
  
  "author": "Shiva SS <shiva061395@gmail.com>",
  
  "license": "MIT",
  
  "bugs": {
  
    "url": "https://github.com/shiva5538/MyToastyPlugin/issues"
    
  },
  
  "homepage": "https://github.com/shiva5538/MyToastyPlugin/"
  
}



Note: Replace the repository URL, author, bugs URL, and homepage URL values with your own.

In this step, you’ve created a lot of placeholders for files that don’t yet exist, so let’s make them in the next one.

# 4. BUILD JAVASCRIPT BINDINGS

Create a directory inside of your ToastyPlugin repository named www. And in this directory, create an empty toastyplugin.js file. This file dictates the API by which a Cordova project may interact with this plugin. Generally, this means that the plugin binds to the window element and by doing so, grants access to its parent project through simple JavaScript references. Add the following to your toastyplugin.js file:
// Empty constructor
function ToastyPlugin() {}

// The function that passes work along to native shells
// Message is a string, duration may be 'long' or 'short'
ToastyPlugin.prototype.show = function(message, duration, successCallback, errorCallback) {
  var options = {};
  options.message = message;
  options.duration = duration;
  cordova.exec(successCallback, errorCallback, 'ToastyPlugin', 'show', [options]);
}

// Installation constructor that binds ToastyPlugin to window

ToastyPlugin.install = function() {
  if (!window.plugins) {
    window.plugins = {};
  }
  window.plugins.toastyPlugin = new ToastyPlugin();
  return window.plugins.toastyPlugin;
};

cordova.addConstructor(ToastyPlugin.install);


The original Toast plugin by Eddy Verbruggen adds a bit more functionality and supports custom positioning, but your plugin is going to remain simple by sticking to native Toast functionality found exclusively on the Android platform. In this case, you will support the show function that is capable of displaying a message for a period of time (either long or short). The cordova.exec function is what sends this simple command to the native platform code that you will create in the next step.

# 5. IMPLEMENT TOASTYPLUGIN FOR ANDROID

You’ve constructed a simple API that will allow your Cordova project to tap into your native Toast functionality, but now you actually need to implement that native code. There’s a lot to know about Android, iOS, and the other native platforms, but I’m going to assume that you know enough to venture down this rabbit hole of custom plugin development. So you won’t find any elaborate detail about how Android works in this post. However, if you’re interested in learning more, I recommend Udacity’s Android Nanodegree program.

In your plugin directory, create a src folder. In src, create an Android directory. And finally, create an empty ToastyPlugin.java file in the android directory. You can use commands similar to the following:

$ mkdir src
$ cd src
$ mkdir android
$ cd android
$ touch ToastyPlugin.java

And populate the contents of ToastyPlugin.java with the following source code:

package com.shiva.cordova.plugin;
// The native Toast API
import android.widget.Toast;
// Cordova-required packages
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
public class ToastyPlugin extends CordovaPlugin {
  private static final String DURATION_LONG = "long";
  @Override
  public boolean execute(String action, JSONArray args,
    final CallbackContext callbackContext) {
      // Verify that the user sent a 'show' action
      if (!action.equals("show")) {
        callbackContext.error("\"" + action + "\" is not a recognized action.");
        return false;
      }
      String message;
      String duration;
      try {
        JSONObject options = args.getJSONObject(0);
        message = options.getString("message");
        duration = options.getString("duration");
      } catch (JSONException e) {
        callbackContext.error("Error encountered: " + e.getMessage());
        return false;
      }
      // Create the toast
      Toast toast = Toast.makeText(cordova.getActivity(), message,
        DURATION_LONG.equals(duration) ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT);
      // Display toast
      toast.show();
      // Send a positive result to the callbackContext
      PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
      callbackContext.sendPluginResult(pluginResult);
      return true;
  }
}

Note: Again, make sure to use the package name you identified in plugin.xml.

If you’re unfamiliar with Android development, that’s okay. Most of the code is Cordova and JSON-focused. The only Android particulars we have here can be found between lines 40 and 43. The Toast API documentation explains the makeText and show methods, however, both of which are mostly self-explanatory. Ideally, if you’re building a native plugin, you’re familiar with Android (or you soon will be) and won’t require hand-holding to accomplish your task—just a little bit of help setting up!

# 6. TASTE THE TOAST

To verify that your plugin is ready to work as expected, you have to install it in your ToastyPluginTest project (the project you created way back in step 1). To do so, first navigate your shell to the test project directory:

$ cd toasty-plugin-test

In my setup, I placed this project directory and my plugin project in the same root folder. So, to install my plugin to the test project, I used the following command:

$ cordova plugin add ..\toastyplugin\

Just make sure that the final argument is the path to your plugin directory, and Cordova should have no problems installing the plugin to your local test project. After this process completes, you need to add code to test the plugin. Open the pre-generated index.js file found under the www > js directory (in your test project folder). Add the following lines immediately after alert('Received Event: ' + id); (line 42 in my setup):

// more code up here...
    alert('Received Event: ' + id);
    
    // Add the following 5 lines
    window.plugins.toastyPlugin.show('It feels toasty in here!', 'long', function() {
      console.log('success!');
    }, function(err) {
      console.log('Uh oh... ' + err);
    });
  }
};

This bit of code will invoke the show method of your ToastyPlugin with the message, “It feels toasty in here!” and displays it for a “long” duration. Save the file and then run the following command in your project directory:

$ cordova emulate android

This will rebuild the project and run it once more on the emulator. If everything goes smoothly, you should see the Toast message appear at the bottom of the app window after your application launches:

we did it successfully.. hurray !!
Your next step is to commit and push changes made to your plugin repository. Make sure the version found on the master branch is identical to the version you tested.


# - A Blog by Shiva SS, follow for more updates.. !!
