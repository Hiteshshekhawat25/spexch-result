import { connect, io } from 'socket.io-client';

// export const socket = io('http://192.168.0.43:2526')
// export const socket = connect('http://165.22.212.175:2526')
export const socket = connect('https://user-api.spexch247.com/')
// export const socket = io('http://165.22.212.175:2526')



// console.log('socket', socket)