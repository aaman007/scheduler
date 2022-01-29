import Bull from "bull";

import { QueueNotFound } from "./exceptions";

const queues = {};

export const createQueue = (name = "bull-queue") => {
    if (!queues[name]) {
        queues[name] = new Bull(name);
    }
    return queues[name];
};

export const getOrCreateRateLimitedQueue = (name = "bull-queue") => {
    if (!queues[name]) {
        queues[name] = new Bull(name, {
            // 1 Job every 5 secs
            limiter: {
                max: 1,
                duration: 5000,
            },
            // queue keys prefix
            prefix: "ratelimited",
            // Redis config
            redis: {
                port: 6379,
                host: "localhost",
                db: 0,
            },
        });
    }
    return queues[name];
};

export const getQueue = (name = "bull-queue") => {
    if (!queues[name]) {
        throw QueueNotFound;
    }
    return queues[name];
};

export default queues;
