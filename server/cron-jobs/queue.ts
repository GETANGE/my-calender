import Bull from 'bull';

// This queue instance can be used for three roles
// 1. Producer, 2. Consumer or an 3.Event Listener

// As a JOB PRODUCER
const myFirstQueue = new Bull('my-first-queue');

// just a javascript object which needs to be serialized and stringified inOrder to be stored in redis
const job= myFirstQueue.add({
    foo: 'bar'
})

// As a CONSUMER or WORKER
function doSomething(data: any){
    const job = {
        role:'Junior Developer',
        company: 'Triply.co',
        data: function work(){
            return `Am a ${job.role} currently working at ${job.company}`
        }
    }
    return job
}
myFirstQueue.process(async ()=>{
    return doSomething((await job).data)
})