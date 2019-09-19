# Groot
Basic Electron building blocks to start any electron project   :grimacing:
![Application Demo](src/asset/app_dmo.gif)


### Installation  
Kindly install [node.js](https://nodejs.org/en/download/) before running this app and set the 
[path Variable](https://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8-and-10/27864331) Accordingly.

* Clone this repository or download it in local directory.
* open cmd, point to  project directory and  run **npm install** 
  ```bash
  $ npm install 
  ```
* once installation is finished, run **npm start** to launch the application.
  ```bash
  $ npm start
  ```

### Features
  * **Multi Window :**
    * Refer RendererProcess.js Line no 140 - 170 
  * **Single Instance App :**
    * Refer mainProcess.js Line no 27 - 34 
  * **Crash Handling :**
    * Refer mainProcess.js createWindow Method 