# nw-local-server

An example of using a local webserver in NW.js


## How to run

1. Install [Node.js](http://nodejs.org) & npm (comes with Node)
1. Download or clone the repo
1. `npm install`
1. `npm start`


## How this works

1. `npm install` will download NW.js and Express to the `node_modules` folder.
1. `npm start` will Launch NW.js from your project's root.
1. NW.js will look at the `package.json` and see the `"node-main"` set to `server.js`. This will be the first thing NW.js runs and it runs this script in the "Node context" before a window is loaded.
1. The `server.js` runs and starts up an Express server on port 3000.
1. Next NW.js will look at the `package.json` and see the `"main"` set to `http://localhost:3000`. The `main` is usually set to `index.html`, it tells NW.js what is the first page to load for your app's UI. Since the Express server is already running NW.js will go to that URL and Express will return the `index.html` file.
1. The last step that NW.js does is look at the `package.json` and see the `"node-remote"` set to `http://localhost:3000`. The `node-remote` tells NW.js what URL's are allowed to run Node.js commands. With it pointing to the server you just started, your app can now run properly, accessing Node directly from the DOM.
1. From this point on you can create your app like you would in a regular browser. You can create folders for you images, styles, and scripts and link to them from your `index.html`. You can also access any Node modules you've installed in the project.


* * *


For a more detailed step-by-step tutorial of using NW.js to create your first desktop app, click here:

* [Laptop Battery NW.js App Tutorial](https://gitlab.com/TheJaredWilcurt/battery-app-workshop)
