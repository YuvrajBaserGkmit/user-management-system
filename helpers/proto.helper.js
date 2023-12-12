const fs = require('fs');
const path = require('path');

// Function to create a local proto file from a given proto URL
const createProtoFile = async (protoUrl) => {
  // Fetch the content of the proto file from the specified URL
  const protoResponse = await fetch(protoUrl);
  const protoContent = await protoResponse.text();

  // Check if the 'protos' directory exists, create it if not
  if (!fs.existsSync(path.join(__dirname, '..', 'protos')))
    fs.mkdirSync(path.join(__dirname, '..', 'protos'));

  // Extract the file name from the URL and create the local proto file path
  const protoFileName = protoUrl.substring(protoUrl.lastIndexOf('/') + 1);
  const protoFilePath = path.join(__dirname, '..', 'protos', protoFileName);

  fs.writeFileSync(protoFilePath, protoContent);

  return protoFilePath;
};

module.exports = {
  createProtoFile,
};
