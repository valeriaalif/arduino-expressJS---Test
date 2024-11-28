

const express = require('express');
//const { Server } = require('socket.io');
const http = require('http');
//const { SerialPort, ReadlineParser } = require('serialport'); // Updated import

const app = express();
const server = http.createServer(app);
//const io = new Server(server);

// Serve static files from the "public" folder
app.use(express.static('public'));


// Configure the SerialPort
//const port = new SerialPort({
  //path: 'COM4', // Replace 'COM3' with your Arduino port
 // baudRate: 9600,
//});

// Use a parser to handle incoming data
//const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Log data received from Arduino
//parser.on('data', (data) => {
  //console.log('Data from Arduino:', data);
  //io.emit('arduinoData', data);
//});


// Handle client connections
//io.on('connection', (socket) => {
 // console.log('A client connected');

  // Listen for messages from the client
  //socket.on('sendToArduino', (message) => {
 //   console.log('Message from client:', message);
 //   port.write(message + '\n'); // Send data to Arduino
 // });

  // Synchronize Arduino time with system time
  //const now = new Date();
  //const hours = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
 // const minutes = now.getMinutes().toString().padStart(2, '0');
 // const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
 // port.write(`TIME:${hours}:${minutes} ${ampm}\n`);
 // console.log(`Time synchronized: ${hours}:${minutes} ${ampm}`);

  // Listen for alarm time input from the client
 // socket.on('setAlarmTime', (alarmTime) => {
 //   console.log('Setting alarm time:', alarmTime);
  //  port.write(`SET:${alarmTime}\n`);
 // });

   // Listen for manual servo activation command
  // socket.on('activateServo', () => {
  //  console.log('Manual servo activation triggered by client.');
  //  port.write('ACTIVATE\n'); // Send ACTIVATE command to Arduino
 // });

 // socket.on('disconnect', () => {
 //   console.log('A client disconnected');
 // });
//});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
