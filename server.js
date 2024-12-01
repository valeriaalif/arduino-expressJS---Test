const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors');
const cron = require('node-cron'); // For scheduling alarms

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (if needed for future use)
app.use(express.static('public'));

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Configure SerialPort
const port = new SerialPort({
  path: 'COM4', // Replace with your Arduino port
  baudRate: 9600,
});

// Use a parser to handle incoming data
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Log data received from Arduino
parser.on('data', (data) => {
  console.log('Data from Arduino:', data);
  io.emit('arduinoData', data);
});

// In-memory storage for alarms
const alarms = [];

// Helper to convert 12-hour format to 24-hour format
const convertTo24Hour = (time) => {
  const [hours, minutes] = time.split(/[: ]/).map(Number);
  const period = time.includes('PM') ? 'PM' : 'AM';
  return `${(period === 'PM' && hours !== 12 ? hours + 12 : hours % 12)}:${minutes}`;
};

// Helper to convert day names to cron format
const dayToCron = (day) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(day);
};

// Schedule alarms for each repeating alarm
const scheduleAlarm = (alarm) => {
  alarm.days.forEach((day) => {
    const [hour, minute] = convertTo24Hour(alarm.time).split(':');
    const cronExpression = `0 ${minute} ${hour} * * ${dayToCron(day)}`;

    cron.schedule(cronExpression, () => {
      console.log(`Triggering alarm for ${alarm.time} on ${day}`);
      port.write(`TRIGGER:${alarm.time}\n`);
    });
  });
};

// API route to set the alarm
app.post('/api/set-alarm', (req, res) => {
  const { hour, minute, amPm, days, repeating } = req.body;
  if (!hour || !minute || !amPm || !days || days.length === 0) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const alarmTime = `${hour}:${minute} ${amPm}`;
  const newAlarm = { time: alarmTime, days, repeating };

  // Add to alarms array
  alarms.push(newAlarm);

  // Schedule the alarm
  if (repeating) {
    scheduleAlarm(newAlarm);
  }

  console.log('Setting alarm:', newAlarm);
  port.write(`SET:${alarmTime}\n`); // Send to Arduino (optional)

  res.json({ message: `Alarm set for ${alarmTime} on ${days.join(', ')}`, alarm: newAlarm });
});

// API route to activate the servo
app.post('/api/activate-servo', (req, res) => {
  console.log('Manual servo activation triggered.');
  port.write('ACTIVATE\n');
  res.json({ message: 'Servo activated successfully' });
});

// API to get all alarms
app.get('/api/get-alarms', (req, res) => {
  res.status(200).json(alarms);
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('sendToArduino', (message) => {
    console.log('Message from client:', message);
    port.write(message + '\n');
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
