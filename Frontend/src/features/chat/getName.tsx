interface Writer {
    id: string;
    name: string;
}

const getName = (writers: Writer[]) => {
    return (writerId: string): string => {
        const writer = writers.find((w) => w.id === writerId);
        return writer ? writer.name : '';
    };
};

export default getName;
