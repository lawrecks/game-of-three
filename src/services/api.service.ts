import axios from 'axios';
import envConfig from '../config';

const baseURL = `${envConfig.HOST}:${envConfig.PORT}`;

const getUsers = async () => {
  const response = await axios.get(`${baseURL}/users`);
  return response.data;
};

const getRooms = async () => {
  const response = await axios.get(`${baseURL}/rooms`);
  return response.data;
};

const userExists = async (username: string) => {
  const users = await getUsers();
  if (users?.length > 0) {
    const exists = users.find((user: any) => user.name === username);
    if (exists) return exists;
  }
  return false;
};

const roomExists = async (roomName: string) => {
  const rooms = await getRooms();
  if (rooms?.length > 0) {
    const exists = rooms.find((room: any) => room.name === roomName);
    if (exists) return exists;
  }
  return false;
};

export const findOrCreateUser = async (id: string, name: string, room: string = '') => {
  // Check if user exists
  const user = await userExists(name);
  if (!user) {
    // Create user
    const newUser = await axios.post(`${baseURL}/users`, {
      id,
      name,
      room,
    });
    return newUser.data;
  }
  return user;
};

export const assignRoomToUser = async (roomName: string, username: string) => {
  // Check if user exists
  const user = await userExists(username);
  const room = await roomExists(roomName);
  if (!user) {
    throw Error('User does not exist');
  }
  // Create room if it doesn't exist
  if (!room) {
    await axios.post(`${baseURL}/rooms`, {
      name: roomName,
    });
  }
  // Update user room details
  await axios.patch(`${baseURL}/users/${user.id}`, {
    room: roomName,
  });
  return user;
};

export const fetchSingleUser = async (id: string) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const generateRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const removeUserFromRoom = async (id: string) => {
  const removedRoom = await axios.patch(`/users/${id}`, {
    room: '',
  });
  return removedRoom;
};

export const deleteUser = async (id: string) => {
  const deletedUser = await axios.delete(`/users/${id}`);
  return deletedUser;
};
