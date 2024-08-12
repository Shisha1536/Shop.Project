const { Client } = require("pg")
 
export const connectDb = async (PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT) => {
    try {
        const client = new Client({
            user: PGUSER,
            host: PGHOST,
            database: PGDATABASE,
            password: PGPASSWORD,
            port: PGPORT
        });
        await client.connect();
        return client
    } catch (error) {
        console.log(error)
        return null
    }
    
}