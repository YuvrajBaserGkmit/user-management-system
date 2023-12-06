const fs = require('fs');
const path = require('path');

// Define the path to the routes folder
const routesFolder = path.resolve('./routes');

// Function to get all route paths
const getAllRoutesPath = function () {
  const allRoutesPath = [];

  // Read all files in the routes folder
  fs.readdirSync(routesFolder).forEach((file) => {
    const fullPath = `${routesFolder}/${file}`;

    // If the file exists and its name ends with '.route.js'
    if (fs.existsSync(fullPath) && fullPath.endsWith('.route.js')) {
      // Push the file name (without '.route.js') and the full path (without '.js') to the array
      allRoutesPath.push({
        fileName: file.replace('.route.js', ''),
        fullPath: fullPath.replace('.js', ''),
      });
    }
  });

  return allRoutesPath;
};

// Function to register routes
const registerRoutes = function (app) {
  const allRoutesPath = getAllRoutesPath();

  for (const routeFile of allRoutesPath) {
    // Require the router from the route file
    const router = require(routeFile.fullPath);

    // Use the router for the route
    app.use(`/api/${routeFile.fileName}`, router);
  }
};

module.exports = {
  registerRoutes,
};
