import 'module-alias/register'
import 'reflect-metadata'
import OliviaClient from './lib/structures/OliviaClient'

const client = new OliviaClient()

client.start()