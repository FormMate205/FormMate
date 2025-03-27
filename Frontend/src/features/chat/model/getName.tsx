import { Writer } from '@/entities/chat/model/types';

const getName = (writers: Writer[], writerId: string) => {
    const writer = writers.find((w) => w.writerId === writerId);
    return writer?.name;
};

export default getName;
