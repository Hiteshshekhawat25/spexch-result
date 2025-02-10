import { connect, io } from 'socket.io-client';

// export const socket = io('http://192.168.21.123:2526')
export const socket = connect('http://165.22.212.175:2526')
// export const socket = io('http://165.22.212.175:2526')



// console.log('socket', socket)