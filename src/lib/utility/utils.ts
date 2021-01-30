import { createConnection } from 'typeorm'
import { ormconfig } from './constants'

export const format = (x: number) => x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

export const connect = async () => {
    try {
        const dbStart = process.hrtime()
        const connection = await createConnection(ormconfig)
        const dbExec = process.hrtime(dbStart)

        console.log(`Connected to ${ ormconfig.database } in ${ dbExec[1] / 1000000 } ms.`)

        const tableStart = process.hrtime()
        const tables = await connection.query('SELECT * FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'settings\'')

        if (!tables.length) {      
            await connection.synchronize()
            console.log('Created "settings" entity.')
        }

        const tableExec = process.hrtime(tableStart)
        console.log(`Tables checked in ${ tableExec[1] / 1000000 } ms.`)
    } catch (error) {
        console.log('Could not connect to PostgreSQL database. Please check your connection options in your ".env" file.')
        console.log(error)
        process.exit(1)  
    }
}