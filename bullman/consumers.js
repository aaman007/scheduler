export const helloWorldConsumer = (queue) => {
    queue.process(async (job) => {
        console.log("Hello World");
        console.log(job.data);
        return job.data.text;
    });
};

export const progresserConsumer = (queue) => {
    queue.process(async (job) => {
        const { name, maxProgress } = job.data;
        for (let i = 0; i < maxProgress; i += 1) {
            job.progress(i + 1);
        }
        console.log("Progresser job with name " + name);
        return name;
    });
};

export default {};
