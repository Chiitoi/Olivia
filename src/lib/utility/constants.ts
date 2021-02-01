import { join } from 'path'
import { ConnectionOptions } from 'typeorm'
import { PG_DB_HOST, PG_DB_NAME, PG_DB_PASS, PG_DB_PORT, PG_DB_USER, PRODUCTION } from '../../config'

export enum SETTINGS {
    GUILD_ID = 'guildId',
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

const EMBEDS = {
    ERROR: (description: string) => ({ embed: { color: 'B00020', description } }),
    INFO: (description: string) => ({ embed: { color: 'F8F8FF', description } }),    
    SUCCESS: (description: string) => ({ embed: { color: '00B020', description } })
}

export const MESSAGES = {
    INFO: {
        PREFIX: (currentPrefix: string) => EMBEDS.INFO(`Current bot prefix is \`${ currentPrefix }\`.`),
    },
    ERRORS: {
        PREFIX: EMBEDS.ERROR('Bot prefix must not contain spaces, not contain spaces, have at least one special character, and be a maximum of three characters.'),
    },
    STATES: {
        PREFIX_CHANGED: (prefix: string) => EMBEDS.SUCCESS(`Bot prefix changed to \`${ prefix }\`.`),
    }
}