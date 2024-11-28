const socket = io();

// Function to send alarm time to the server
function setAlarmTime() {
  const hour = document.getElementById('hour').value;
  const minute = document.getElementById('minute').value;
  const amPm = document.getElementById('amPm').value;

  if (!hour || !minute || !amPm) {
    alert('Please fill all fields!');
    return;
  }

  // Format the alarm time
  const alarmTime = `${hour}:${minute} ${amPm}`;

  console.log('Sending alarm time:', alarmTime);

  // Emit the alarm time to the server
  socket.emit('setAlarmTime', alarmTime);
}

// New function to activate the servo
function activateServo() {
    const command = "ACTIVATE"; // Command for manual servo activation
    socket.emit('sendCommand', command); // Send command to server
    console.log('Manual servo activation command sent.');
  }
  
 
 // Check if the button click triggers the function
document.getElementById('activateServo').addEventListener('click', () => {
    console.log('Button clicked'); // This will log when the button is clicked
    socket.emit('activateServo'); // Notify the server to activate the servo
  });
  
 
 

// Listen for real-time Arduino data
socket.on('arduinoData', (data) => {
  console.log('Data from Arduino:', data);
});
