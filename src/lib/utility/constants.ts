import { GuildEmoji } from 'discord.js'
import { TextChannel } from 'discord.js'
import { join } from 'path'
import { ConnectionOptions } from 'typeorm'
import { PG_DB_HOST, PG_DB_NAME, PG_DB_PASS, PG_DB_PORT, PG_DB_USER, PRODUCTION } from '../../config'

export enum ERRORS {
    ERROR_403 = 'Forbidden',
    INVALID_TYPE = 'Invalid type',
    INVALID_URL = 'Invalid URL',
    TOO_BIG = 'File cannot be larger than 256.0 kb'    
}

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
        CHANNEL_REQUIRED: EMBEDS.INFO('If **adding** or **removing** a text channel, you must mention (a valid) one.'),
        DEFAULT_EMOJI: EMBEDS.INFO('Default emojis are already available for everyone.'),
        FILE_LIMIT: EMBEDS.INFO('This GIF or image is larger than the 256 KB size limit. Please compress this GIF or image and try again'),
        IMAGE: EMBEDS.INFO('Only **.gif**, **.jpg**, **.png**, and **.webp** image links are supported.'),
        NAME_LIMIT: EMBEDS.INFO('Provided emoji names must be between 2-32 characters.'),
        NO_CHANGE: (channel: TextChannel, verb: string) => EMBEDS.INFO(`${ channel } ${ verb } in the bot channel list.`),
        PREFIX: (currentPrefix: string) => EMBEDS.INFO(`Current bot prefix is \`${ currentPrefix }\`.`),
    },
    ERRORS: {
        ACTION: EMBEDS.ERROR('Valid actions are **add**, **remove**, or **replace**.'),
        EMOJI: EMBEDS.ERROR(`Unable to add custom emoji. Please check your server's emoji limits with the \`limits\` command. If within limits, DM Flare#2851 with the emote or image link.`),
        ERROR_403: EMBEDS.ERROR('Unable to retrieve image. If an image exists, please try uploading it to Discord and using that link.'),
        NAME: EMBEDS.ERROR('For image links, a name must be provided.'),
        NOT_FOUND: (type: string) => EMBEDS.ERROR(`No ${ type } found.`),
        URL: EMBEDS.ERROR('Invalid URL.'),
        PREFIX: EMBEDS.ERROR('Bot prefix must not contain spaces, not contain spaces, have at least one special character, and be a maximum of three characters.'),
    },
    STATES: {
        CHANNEL_ADDED: (channel: TextChannel) =>  EMBEDS.SUCCESS(`${ channel } was added to the bot channel list.`),
        CHANNEL_PURGE: EMBEDS.SUCCESS(`All channels have been removed from the bot channel list.`),
        CHANNEL_REMOVED: (channel: TextChannel) =>  EMBEDS.SUCCESS(`${ channel } was removed from the bot channel list.`),
        CHANNEL_REPLACED: (channel: TextChannel) =>  EMBEDS.SUCCESS(`${ channel } is now the only channel in the bot channel list.`),
        EMOJI_ADDED: (emoji: GuildEmoji, name: string) => EMBEDS.SUCCESS(`${ emoji } has been added with the name \`${ name }\`.`),
        PREFIX_CHANGED: (prefix: string) => EMBEDS.SUCCESS(`Bot prefix changed to \`${ prefix }\`.`),
    }
}