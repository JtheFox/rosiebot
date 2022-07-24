const { connect, connection } = require('mongoose');
// Wrap Mongoose around connection to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/discordbotDB';
connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;