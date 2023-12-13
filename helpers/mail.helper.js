const nodemailer = require('nodemailer');

require('dotenv').config();

const { MAIL_SERVICE, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

// Create a nodemailer transporter with the specified email service and authentication
const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

// Generate and return html email template from the provided data
const generateMailBodyHtml = (data) => {
  let emailData = `
    <tr><th colspan=2 style="text-align: center;"><img src=${data.s3LinkThumbnail}></th></tr>
    <tr>
      <th colspan=2 style="text-align: center;">
        <button><h4><a style="text-decoration: none;" href="${data.s3Link720p}">Download movie in 720p quality</a></h4></button>
        <button><h4><a style="text-decoration: none;" href="${data.s3Link1080p}">Download movie in 1080p quality</a></h4></button>
      </th>
    </tr>
    `;

  // Add fields in the array which need to be removed from the data
  const itemsToBeRemoved = [
    'genres',
    'id',
    'uploadedBy',
    's3LinkThumbnail',
    's3Link720p',
    's3Link1080p',
  ];

  // Filter the data and set only required fields in the html body
  for (const item of itemsToBeRemoved) delete data[item];
  for (const key in data) {
    emailData += `
      <tr>
        <th>${key}</th>
        <td>${data[key].toString()}</td>
      </tr>
      `;
  }

  // Set email data in the html template
  const mailBodyHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
      </style>
    </head>
    <body>
      <table style="width:50%; margin: auto">${emailData}</table>
    </body>
  </html>
  `;
  return mailBodyHtml;
};

// Send email using the configured transporter
const sendMail = async (subject, recipient, mailBodyDataObject) => {
  const html = generateMailBodyHtml(mailBodyDataObject);

  var mailOptions = {
    from: MAIL_USERNAME,
    to: recipient,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);
    else console.log('Email sent: ' + info.response);
  });
};

module.exports = {
  sendMail,
};
