import { PrismaClient } from "@prisma/client";
import cron from 'node-cron'

const Prisma = new PrismaClient

// clean up the database from unverified users
export const deleteUnverifiedUsersJob = cron.schedule('* * * * *', async()=>{
    console.log("Deleting unverified users...")

    try {
        const unverifiedUsers= await Prisma.user.findMany({
            where :{
                hashedRandomToken:{
                    not:null
                },
                emailTokenExpiresAt:{
                    lt: new Date()
                }
            }
        })

        if(unverifiedUsers.length === 0){
            console.log("No unverified users to delete...");
            return;
        }

        // delete the unverified users
        const deleteUnverifiedUser= await Prisma.user.deleteMany({
            where:{
                hashedRandomToken:{
                    not:null
                },
                emailTokenExpiresAt:{
                    lt: new Date()
                }
            }
        })

        console.log(`Deleted ${deleteUnverifiedUser.count} unverified user(s).`)
    } catch (error:any) {
        console.log("Error deleting unverified users...", error.message)
    }

})