const cron = require('node-cron');

const scheduleExamStart = (examDate, callback) => {
  const date = new Date(examDate);
  const cronTime = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()+1} *`;
  cron.schedule(cronTime, callback);
};

module.exports = { scheduleExamStart };
