export const dumbListener = (queue, name) => {
    queue
        .on("completed", (job, result) => {
            console.log(name + " job completed with result: " + result);
        });
};

export default {};
