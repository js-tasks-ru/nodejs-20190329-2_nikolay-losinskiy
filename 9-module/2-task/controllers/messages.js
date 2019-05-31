const Message = require('../models/Message');

module.exports = async function messages(ctx, next) {
  let messages = await Message.find({}).populate('user');

  messages = messages.map((message) => {
    return {
      id: message._id,
      date: message.date,
      text: message.text,
      user: message.user.displayName,
    };
  });

  ctx.body = {messages};
};
