const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();
const passport = require('passport');
require('./config/passport');

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

const io = new Server(http, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('startExam', (data) => {
    io.emit('examStarted', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const examRoutes = require('./routes/examRoutes');
const userRoutes = require('./routes/userRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/user', userRoutes);

// const PORT = process.env.PORT || 5000;
// sequelize.sync({ force: false }).then(() => {
//   // sequelize.sync({ alter: true }).then(() => { 
//   http.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// });

const PORT = process.env.PORT || 5000;

// Only start the server if this module is the entry point
if (require.main === module) {
  sequelize.sync({ force: false }).then(() => {
    http.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error("Database sync error:", err);
  });
}

module.exports = { app, http,io };