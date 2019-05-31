const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;

    if (!token) return next(new Error('anonymous sessions are not allowed'));

    const session = await Session.findOne({token}).populate('user');

    if (!session) return next(new Error('wrong or expired session token'));

    socket.user = session.user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const message = {
        user: socket.user.displayName,
        text: msg,
        date: new Date(),
      };

      await Message.create({
        user: socket.user,
        text: msg,
        date: new Date(),
      });

      io.emit('user_message', message);
    });
  });

  return io;
}

module.exports = socket;
