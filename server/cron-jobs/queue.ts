import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config()

// Redis options
const redisOption = {
    port: 6380,
    host: '127.0.0.1',
    password: process.env.REDIS_PASSWORD,
    db: 0
}

// Define Queue(Producer)
const burgerQueue = new Bull("burger", {
    redis:redisOption
});

// Define the Consumer or Worker
burgerQueue.process((payload, done)=>{
    console.log("Preparing the burger...");
    setTimeout(()=>{
        console.log("Buger is ready...")
        done();
    },4000)
})

// adding first job to the queue
burgerQueue.add({
    bun: '🍔',
    cheese:'🧀',
    toppings:['🥑','🍅','🌶','🧁']
}).then(()=>{
    console.log("Burger added to the queue!...")
}).catch(()=>{
    console.log("Error adding the job to the queue!")
})

// // This queue instance can be used for three roles
// // 1. Producer, 2. Consumer or an 3.Event Listener

// // As a JOB PRODUCER
// const myFirstQueue = new Bull('my-first-queue');

// // just a javascript object which needs to be serialized and stringified inOrder to be stored in redis
// const job= myFirstQueue.add({
//     foo: 'bar'
// })

// // As a CONSUMER or WORKER
// function doSomething(data: any){
//     const job = {
//         role:'Junior Developer',
//         company: 'Triply.co',
//         data: function work(){
//             return `Am a ${job.role} currently working at ${job.company}`
//         }
//     }
//     return job
// }
// myFirstQueue.process(async ()=>{
//     return doSomething((await job).data)
// })