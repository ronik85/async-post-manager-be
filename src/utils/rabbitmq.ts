import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { Post } from '../models/post.model.js';

const queue = 'postQueue';
const maxRetries = 3;
const dlq = 'postQueueDLQ';


let connection: Connection | null = null;
let channel: Channel | null = null;

/**
 * Connect to RabbitMQ and create a channel.
 * @returns {Promise<Channel>} The RabbitMQ channel
 * @throws {Error} If unable to connect to RabbitMQ
 */
const connectRabbitMQ = async (): Promise<Channel> => {
    if (channel) {
        return channel;
    }
    try {
        connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        await channel.assertQueue(dlq, { durable: true });
        console.log(`Connected to RabbitMQ and asserted queues: ${queue}, ${dlq}`);
        return channel;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
};

/**
 * Enqueue a post object to the RabbitMQ queue.
 * @param post The post object to be enqueued
 * @throws {Error} If unable to send the message to the queue
 */
export const enqueuePost = async (post: any): Promise<void> => {
    try {
        const channel = await connectRabbitMQ();
        const headers = { 'x-retry-count': 0 }; // Initialize retry count
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(post)), { headers, persistent: true });
    } catch (error) {
        console.error('Error enqueuing post:', error);
        throw error;
    }
};


/**
 * Consume posts from the RabbitMQ queue and save them to the database.
 */
export const consumePosts = async (): Promise<void> => {
    try {
        const channel = await connectRabbitMQ();
        console.log('Consumer started, waiting for messages...');

        channel.consume(queue, async (msg: ConsumeMessage | null) => {
            if (msg) {
                console.log('Message received:', msg.content.toString());
                const post = JSON.parse(msg.content.toString());

                const headers = msg.properties?.headers || {};
                let retryCount = headers['x-retry-count'] || 0;
                retryCount = parseInt(retryCount, 10);

                try {
                    // Simulate delay
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    const newPost = new Post(post);
                    await newPost.save();
                    console.log('Post saved to the database:', newPost);

                    // Acknowledge the message after successful processing
                    channel.ack(msg as ConsumeMessage);
                    console.log('Message acknowledged');
                } catch (error) {
                    console.error('Error processing message:');
                    if (retryCount < maxRetries) {
                        const updatedHeaders = { ...headers, 'x-retry-count': retryCount + 1 };
                        channel.nack(msg, false, false); // Reject the message without requeueing
                        channel.sendToQueue(queue, msg.content, { headers: updatedHeaders, persistent: true });
                        console.log('Message requeued, retry count:', retryCount + 1);
                    } else {
                        channel.sendToQueue(dlq, msg.content, { persistent: true });
                        channel.nack(msg, false, false); // Reject the message and remove it from the queue
                        console.log('Message moved to DLQ');
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error starting consumer:', error);
        throw error;
    }
};



