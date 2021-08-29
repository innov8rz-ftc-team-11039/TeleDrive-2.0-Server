![TeleDrive 2.0 Server](https://user-images.githubusercontent.com/39073758/112276623-303b8480-8c3e-11eb-85b7-c548d91da225.png)
## TeleDrive 1.0's Sequel. Simpler, Faster, Easier.

This all-in-one app that not only allows you to drive your robot remotely but also includes the capability for low latency video feed with group audio call. All of this with end-to-end encryption! If you used TeleDrive 1.0 then you may remember having to use Parsec for video, Discord for audio, and the TeleDrive executables for gamepad. This version simplifies the setup with ease of use. Also, no need to set up port forwarding on your router anymore!

# Server Side Usage and Setup

To clone and run this repository you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Go into the repository directory
cd TeleDrive-2.0-Server
# Install dependencies
npm install
# Run the server
npm start
```

Please note that you must also change the code in the TeleDrive App Side as it is defaulting to the signalling server provided by us (which is currently down). To do so, please replace line 399 in `index.html` with the public IP address of the server computer.
