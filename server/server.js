/* 
 * █████████████████████████████████████████████████████
 * █─▄─▄─█▄─▄▄─█▄─▄███▄─▄▄─█▄─▄▄▀█▄─▄▄▀█▄─▄█▄─█─▄█▄─▄▄─█
 * ███─████─▄█▀██─██▀██─▄█▀██─██─██─▄─▄██─███▄▀▄███─▄█▀█
 * ██▄▄▄██▄▄▄▄▄█▄▄▄▄▄█▄▄▄▄▄█▄▄▄▄██▄▄█▄▄█▄▄▄███▄███▄▄▄▄▄█
 * Copyright (c) 2021 Innov8rz FTC Team 11039, Mihir Chauhan
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted (subject to the limitations in the disclaimer below) provided that
 * the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list
 * of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this
 * list of conditions and the following disclaimer in the documentation and/or
 * other materials provided with the distribution.
 *
 * Neither the name of Innov8rz nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS
 * LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
const HTTPS_PORT = 443; //default port for https is 443
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

// based on examples at https://www.npmjs.com/package/ws 
const WebSocketServer = WebSocket.Server;

// If you want, please create your own certificates for TLS (not needed for server to work)
const serverConfig = {
  // key: fs.readFileSync('../key.pem'),
  // cert: fs.readFileSync('../cert.pem'),
};

const handleRequest = function (request, response) {
  // Not needed in this case. But would be used if you are serving a website to client.
};

const httpsServer = https.createServer(serverConfig, handleRequest);
httpsServer.listen(HTTPS_PORT);

// Create a server for handling websocket calls
const wss = new WebSocketServer({ server: httpsServer });

wss.on('connection', function (ws, req) {
  var isFirstMessageFromClient = true;
  ws.on('message', function (message) {
    // Broadcast any received message to all clients
    if (isFirstMessageFromClient) {
      // Check for special passcode/key for security purposes.
      if (message.includes("4C4C4544-0032-3610-8044-B5C04F305932")) {
        isFirstMessageFromClient = false;

        // Logging for debugging purposes (logs: time and IP address)
        let date_ob = new Date();
        const dateTime = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();
        const userName = message.replace('4C4C4544-0032-3610-8044-B5C04F305932-', '');

        // Create log entry
        const userDataJSON = { userName: userName, ipaddress: req.connection.remoteAddress, time: dateTime };
        fs.appendFile('TeleDrive_Log.txt', ", \n" + JSON.stringify(userDataJSON), function (err) {
          if (err) throw err;
          // Log Data also shows in console so it is easy to find them while server is running
          console.log(JSON.stringify(userDataJSON));
        });

      } else {
        // Client's messages do not contain passcode/key so the connection is closed.
        console.log("Incorrect Key Provided. Closing Connection");
        ws.terminate();
      }
    }

    if (!message.includes("4C4C4544-0032-3610-8044-B5C04F305932")) {
      wss.broadcast(message);
    }
  });

  ws.on('error', () => ws.close());
});

// Websocket broadcast function to send to all clients
wss.broadcast = function (data) {
  this.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

console.log('Server running successfully.');