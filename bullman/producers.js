export const helloWorldProducer = async (queue, text) => {
    const job = await queue.add({
        text,
    });
    return job;
};

export const progresserProducer = async (queue, name, maxProgress) => {
    const job = await queue.add({
        name,
        maxProgress,
    });
    return job;
};

export default {};
