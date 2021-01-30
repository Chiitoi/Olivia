import { join } from 'path'
import { ConnectionOptions } from 'typeorm'
import { PG_DB_HOST, PG_DB_NAME, PG_DB_PASS, PG_DB_PORT, PG_DB_USER, PRODUCTION } from '../../config'

export enum SETTINGS {
    PREFIX = 'prefix',
    BOT_CHANNEL_IDS = 'botChannelIds',
    IN_GUILD = 'inGuild'
}

export const ormconfig: ConnectionOptions = {
    type: 'postgres',
    host: PG_DB_HOST,
    port: PG_DB_PORT,
    username: PG_DB_USER,
    password: PG_DB_PASS,
    database: PG_DB_NAME,
    entities: [join(__dirname, '..', 'entities', '*.js')],
    logging: !PRODUCTION,
    synchronize: false
}