import schedule from "node-schedule";

// Doc: https://github.com/node-schedule/node-schedule#readme

/**
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
 */


// Every X second
const secondlyJob = schedule.scheduleJob("*/5 * * * * *", (fireDate) => {
    console.log("FireDate: " + fireDate + " ActualDate: " + new Date());
    console.log("Scheduled job for every 5 second");
    console.log("----------------\n");
});

// Every X minute
const minutelyJob = schedule.scheduleJob("*/1 * * * *", (fireDate) => {
    console.log("FireDate: " + fireDate + " ActualDate: " + new Date());
    console.log("Scheduled job for every 1 minute");
    console.log("----------------\n");
});

// On Specific Date
const endOfTheWorld = new Date(2022, 0, 29, 0, 5, 0); // Jan 29, 2022 00:05:00am GMT+6
const specificDateJob = schedule.scheduleJob(endOfTheWorld, (fireDate) => {
    console.log("FireDate: " + fireDate + " ActualDate: " + new Date());
    console.log("Scheduled job for " + endOfTheWorld);
    console.log("----------------\n");
});


// Data Binding for future
let name = "Amanur Rahman";
const dataBindedJob = schedule.scheduleJob("*/5 * * * * *", function(name, fireDate) {
    console.log("FireDate: " + fireDate + " ActualDate: " + new Date());
    console.log("Scheduled job for every 5 second with binded data from past");
    console.log("Data name = " + name);
    console.log("----------------\n");
}.bind(null, name));
name = "Aaman Rahman";


// Recurrence Rule
const rule1 = new schedule.RecurrenceRule();
rule1.minute = 16;
const every16MinuteOfHour = schedule.scheduleJob(rule1, () => {
    console.log("Hey, its 16 minute of current hour");
});


// Recurrence Rule extension
const rule2 = new schedule.RecurrenceRule();
rule2.minute = [16, 19, 20, 22, 30]; // Same goes for hour/dayOfWeek etc
const everyNMinuteOfHour = schedule.scheduleJob(rule2, () => {
    console.log("Hey, its either [16 or 19 or 20 or 22 or 30] minute of current hour");
});
/* We can use rule.tz to specify which timezone the rule should apply for */
/**
RecurrenceRule properties
    second (0-59)
    minute (0-59)
    hour (0-23)
    date (1-31)
    month (0-11)
    year
    dayOfWeek (0-6) Starting with Sunday
    tz
 */


// Object Literal Syntax
const specifiedJob = schedule.scheduleJob({hour: 0, minute: 26, dayOfWeek: 6}, function(){
    console.log('Time for tea!');
});


// With StartTime and Every
const startTime = new Date(Date.now());
const endTime = new Date(startTime.getTime() + 5000);
const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
  console.log('Time for tea for every 1 second in a window of 5 seconds! (non-recurring)');
});


// Graceful Shutdown
const shutdowner = schedule.scheduleJob("*/2 * * * * *", () => {
    for (let i=0;i<1000000000;i++);
    console.log("Run every 2 second");
})
.on("scheduled", () => {
    console.log("Job Scheduled");
})
.on("success", () => {
    console.log("Successful!!\n");
})
.on("canceled", () => {
    console.log("Canceled!!\n");
});

process.on('SIGINT', () => {
    console.log("Process interrupted. Graceful shutdown in progress");

    schedule.gracefulShutdown()
    .then(() => process.exit(0));
});


// Canceling jobs
const gonnaCancel = schedule.scheduleJob('*/2 * * * * *', () => {
    console.log("Job every 2 second, gonna be canceled after 10 seconds");
})
.on('canceled', () => {
    console.log("I am canceled");
});
setTimeout(() => gonnaCancel.cancel(), 10000);
