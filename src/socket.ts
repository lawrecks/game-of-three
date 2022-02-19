import SocketIO from 'socket.io';
import * as apiService from './services/api.service';

export default (app: any) => {
  const io = SocketIO(app);

  io.on('connection', (socket) => {
    /* Login player */
    socket.on('login', async ({ username }) => {
      console.log('userId', socket.id);
      try {
        await apiService.findOrCreateUser(socket.id, username);
        socket.emit('message', {
          user: username,
          message: `Welcome ${username}`,
          socketId: socket.id,
        });
      } catch (error: any) {
        socket.emit('fail', {
          message: `Unable to login, ${error.message}`,
        });
      }
    });

    /* Create or join room for user*/
    socket.on('joinRoom', async ({ room, username }) => {
      try {
        console.log('userId', socket.id);

        await apiService.assignRoomToUser(room, username);
        socket.emit('message', {
          room,
          message: `Welcome to the room, ${room}`,
          socketId: socket.id,
        });
        socket.broadcast.to(room).emit('message', {
          user: username,
          message: `${username} has joined ${room}`,
          room: room,
        });
        const maxUsers = 2;

        socket.join(room, () => {
          if (io.nsps['/'].adapter.rooms[room]?.length === maxUsers) {
            io.to(room).emit('onReady', { state: true });
          }
        });
      } catch (error: any) {
        socket.emit('fail', {
          message: `Unable to join room, ${error.message}`,
        });
      }
    });

    /* Commence game and send the first random number */
    socket.on('startGame', async () => {
      console.log('userId', socket.id);
      try {
        const user = await apiService.fetchSingleUser(socket.id);
        io.to(user?.room).emit('randomNumber', {
          number: `${apiService.generateRandomNumber(1999, 9999)}`,
          isFirst: true,
        });

        socket.broadcast.emit('YourTurn', {
          state: 'PLAY',
          user: io.nsps['/'].adapter.rooms[user?.room]
            ? Object.keys(io.nsps['/'].adapter.rooms[user?.room].sockets)[0]
            : null,
        });
      } catch (error: any) {
        socket.emit('fail', {
          message: `Unable to start game, ${error.message}`,
        });
      }
    });

    /* send the new number */
    socket.on('sendNumber', async ({ number, newNumber }) => {
      console.log('userId', socket.id);
      try {
        const user = await apiService.fetchSingleUser(socket.id);
        const numbers = [newNumber, number];
        const sumNumbers = (num: number[]) => {
          return num.reduce((a: number, b: number) => {
            return a + b;
          });
        };

        const calculateFinalResult = (num: number[], numB: number): number => {
          const res = sumNumbers(num);
          if (res % 3 == 0) {
            return res / 3;
          } else {
            return numB;
          }
        };

        const finalResult = calculateFinalResult(numbers, number);

        io.to(user?.room).emit('randomNumber', {
          number: finalResult,
          user: user?.name,
          selectedNumber: newNumber,
          isFirst: false,
          isCorrectResult: finalResult == number ? false : true,
        });

        io.to(user?.room).emit('YourTurn', {
          user: socket.id,
          state: 'WAIT',
        });

        /* emit GameOver if 1 is reached*/
        if (finalResult == 1) {
          io.to(user?.room).emit('gameOver', {
            user: user?.name,
            isOver: true,
          });
        }
      } catch (error: any) {
        socket.emit('fail', {
          message: `Unable to send number, ${error.message}`,
        });
      }
    });

    socket.on('leaveRoom', async () => {
      try {
        const user = await apiService.fetchSingleUser(socket.id);
        await apiService.removeUserFromRoom(socket.id);
        socket.leave(user?.room);
      } catch (error: any) {
        socket.emit('fail', {
          message: `Unable to leave room, ${error.message}`,
        });
      }
    });

    socket.on('disconnect', async () => {
      try {
        const user = await apiService.fetchSingleUser(socket.id);
        await apiService.removeUserFromRoom(socket.id);
        socket.leave(user?.room);
        await apiService.deleteUser(socket.id);
        socket.broadcast.emit("listTrigger", `${true}`);
      } catch (error: any) {
        socket.emit('fail', {
          message: `Unable to disconnect, ${error.message}`,
        });
      }
    });
  });
};
