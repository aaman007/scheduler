import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

import { createQueue, getOrCreateRateLimitedQueue } from "./bullman/queues";
import { helloWorldProducer, progresserProducer } from "./bullman/producers";
import { helloWorldConsumer, progresserConsumer } from "./bullman/consumers";
import { dumbListener } from "./bullman/listeners";

const rateLimitedQueue = getOrCreateRateLimitedQueue("test-rate-limited");
const queue = createQueue("test-q");
const helloWorldQueue = createQueue("test-queue");
const progresserQueue = createQueue("text-queue-2");

// // Hello World
helloWorldConsumer(helloWorldQueue);
dumbListener(helloWorldQueue, "HelloWorld");

helloWorldProducer(helloWorldQueue, "First Job");
helloWorldProducer(helloWorldQueue, "Second Job");
helloWorldProducer(helloWorldQueue, "Third Job");
helloWorldProducer(helloWorldQueue, "Fourth Job");

// // Progresser
progresserConsumer(progresserQueue);
dumbListener(progresserQueue, "Progresser");

progresserProducer(progresserQueue, "First Progresser", 100);
progresserProducer(progresserQueue, "Second Progresser", 50);

// Rate Limited
helloWorldConsumer(rateLimitedQueue);

helloWorldProducer(rateLimitedQueue, "1");
helloWorldProducer(rateLimitedQueue, "2");
helloWorldProducer(rateLimitedQueue, "3");

// Named Job
rateLimitedQueue.process("category1", async (job) => {
    console.log("category1 job consumer with text ", job.data.text);
});
rateLimitedQueue.add("category1", { text: "Hello I am 1 from category1" });
rateLimitedQueue.add("category1", { text: "Hello I am 2 from category1" });

rateLimitedQueue.process("category2", async (job) => {
    console.log("category2 job consumer with text ", job.data.text);
});
rateLimitedQueue.add("category2", { text: "Hello I am 1 from category2" });
rateLimitedQueue.add("category2", { text: "Hello I am 2 from category2" });

// Job types
rateLimitedQueue.process("lifo", async (job) => {
    console.log("I am LIFO job ", job.data);
});
rateLimitedQueue.add("lifo", 1, { lifo: true });
rateLimitedQueue.add("lifo", 2, { lifo: true });
rateLimitedQueue.add("lifo", 3, { lifo: true });

// Delayed Job
rateLimitedQueue.process("delayed", async (job) => {
    console.log("I am delayed job", job.data);
});
rateLimitedQueue.add("delayed", "For 10 seconds", { delay: 10000 });

// Prioritized Jobs
rateLimitedQueue.process("prioritized", async (job) => {
    console.log("I am prioritized job", job.data);
});
rateLimitedQueue.add("prioritized", "Priority 3", { priority: 3 });
rateLimitedQueue.add("prioritized", "Priority 1", { priority: 1 });
rateLimitedQueue.add("prioritized", "Priority 2", { priority: 2 });

// job and done usage with separate processes (Concurrency)
queue.process("myJobs", 10, async (job, done) => {
    console.log("Processing", job.data);
    if (job.data === 1) {
        done();
    }
    done(new Error("Error"));
});
queue
    .on("completed", () => {
        console.log("Completed");
    })
    .on("failed", () => {
        console.log("Failed");
    });
queue.add("myJobs", 1);
queue.add("myJobs", 2);
queue.add("myJobs", 3);
queue.add("myJobs", 4);
queue.add("myJobs", 5);
queue.add("myJobs", 6);
queue.add("myJobs", 7);
queue.add("myJobs", 8);
queue.add("myJobs", 9);
queue.add("myJobs", 10);
queue.add("myJobs", 11);

// Dashboard
const serverAdapter = new ExpressAdapter();

const {
    addQueue, removeQueue, setQueues, replaceQueues,
} = createBullBoard({
    queues: [
        new BullAdapter(queue),
        new BullAdapter(rateLimitedQueue),
        new BullAdapter(helloWorldQueue),
        new BullAdapter(progresserQueue),
    ],
    serverAdapter,
});

const app = express();

serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(5000);
