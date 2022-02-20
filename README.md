# game-of-three

An application that provides a server side for a game (description below) with socket connection.

### Description
​
When a player starts, they incept a random (whole) number and send it to the second player as an approach of starting the game. The receiving player can then choose between adding one of {-1,0,1} in order to get to a number that is divisible by 3. The resulting whole number is then sent back to the original sender.
​The same rules are applied until one player reaches the number 1 (after the division).

### Technical Diagram
https://drive.google.com/file/d/16yjUgcy1Wl4HrUtj3yfQocwVBUEuxV7J/view?usp=sharing

## Built With

- Node.js
- Git
- Express
- Socket.io
- Postman
- Json server
## Getting Started

Clone the repository in your local machine. 
In your root folder where the repository is cloned, run the following commands:
 - Rename `.env.example` to `.env` 
 - `npm install`
 - Starting the temp DB JsonServer: `npm run start:server` 
 - Open a new terminal and type: `npm run dev`. This will establish the socket connection 

## Broadcast Events from Server
 -  **`randomNumber`**
 -  **`YourTurn`**
 -  **`gameOver`**
 -  **`fail`**
 - **`message`**

## Listened events on the Server
- **`connection`**
- **`login`** (required data: username)
- **`joinRoom`** (required data: username, room, roomType)
- **`sendNumber`** (required data: number, newNumber)
- **`leaveRoom`**
- **`startGame`**

### **connection**
When the connection is established via socket.

### **login**
When the user is logged in, it saves the user details on the tempDb and emits a `message` event after the promise is resolved.

### **joinRoom**
When the user joins the room, it assigns the user to the room, broadcasts a `message` event after the promise is resolved. it will then be waiting for the second player to join.

### **startGame**
After the event is triggered, it sends a request to tempDb to get the user details. After success, it broadcasts the `randomNumber` event to the room, that will be visible for all opponents. Finally, it broadcasts `activateYourTurn` and the first connected user starts to play.

### **sendNumber**
It sends the number back to the client with the selected move choice ( 1, 0 or -1). It broadcasts the `randomNumber` event with the calculated result back and activates the opponent turn with the `activateYourTurn` event.

### Entities
Fetch all users - `{{JsonServer_URL}}/users` [GET] <br>
Fetch all rooms - `{{JsonServer_URL}}/rooms` [GET]

## Show your support
Give a ⭐️ &nbsp;if you like this project!
