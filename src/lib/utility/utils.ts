import { OliviaCommand } from '@lib/structures/OliviaCommand'
import { EmojiRegex, TwemojiRegex } from '@sapphire/discord-utilities'
import { Command, CommandStore } from '@sapphire/framework'
import axios, { AxiosError } from 'axios'
import { byteLength } from 'base64-js'
import { Collection } from 'discord.js'
import fs from 'fs/promises'
import { join } from 'path'
import { createConnection } from 'typeorm'
import { ormconfig, ERRORS } from './constants'

export const format = (x: number | string) => x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

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

export const formatChannels = (channelIds: string[]) => {
    const { length } = channelIds

    if (!length)
        return 'No channels in this list.'

    const text = channelIds.reduce((acc, channelId, index) => {
        if (index == length - 2)
            acc += `<#${ channelId }>${ length == 2 ? '' : ','} and `
        else if (index == length - 1)
            acc += `<#${ channelId }>`
        else
            acc += `<#${ channelId }>, `
        return acc
    }, '')

    return text
}

const isAxiosError = (error: any): error is AxiosError => (error as AxiosError).isAxiosError === true

export const parseEmojiURLOrBase64 = async (str: string) => {
    const twemoji = new RegExp(TwemojiRegex).exec(str)

    if (twemoji)
        return { base64String: null, defaultEmoji: true, givenName: null, url: null }

    const emoji = EmojiRegex.exec(str)

    if (emoji) {
        const { animated, id, name } = emoji.groups

        return { base64String: null, defaultEmoji: false, givenName: name, url: `https://cdn.discordapp.com/emojis/${ id }.${ !!animated ? 'gif' : 'png' }` }
    }

    try {
        const url = new URL(str)?.href.split(/[?#]/)[0]
        const response = await axios.get(url, { responseType: 'arraybuffer' })
        const { headers: { 'content-type': contentType } } = response
        
        if (!['image/gif', 'image/jpeg', 'image/png', 'image/webp'].includes(contentType))
            return { error: ERRORS.INVALID_TYPE }

        const base64String = Buffer.from(response.data, 'binary').toString('base64')
        const bytes = byteLength(base64String)

        if (bytes > 262144)
            return { error: ERRORS.TOO_BIG }

        return { defaultEmoji: false, givenName: null, url }
    } catch (error) {
        if (error instanceof TypeError)
            return { error: ERRORS.INVALID_URL }
        else if (isAxiosError(error)) {
            const status = error.response?.status
            
            if (status === 403)
                return { error: ERRORS.ERROR_403 }
            else if (status === 415)
                return { error: ERRORS.ERROR_415 }
            else
                return { error: ERRORS.UNKNOWN }
        }
    }
}

export const formatCategoryName = (categoryName: string) => categoryName.charAt(0).toUpperCase() + categoryName.slice(1)

export const formatCommands = async (commands: CommandStore) => {
    const commandDirectory = join(__dirname, '..', '..', 'commands')
    const categoryNames = await fs.readdir(commandDirectory)
    const categories = new Collection<string, Collection<string, Command>>()

    for (const categoryName of categoryNames)
        categories.set(categoryName, new Collection<string, Command>())

    for (const [_, command] of commands) {
        const categoryName = (command as OliviaCommand).category
        categories.get(categoryName).set(command.name, command)
    }

    for (const [_, category] of categories) {
        category.sort((a, b) => a.name.localeCompare(b.name))
    }

    return categories
}