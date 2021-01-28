import type { CommandOptions } from '@sapphire/framework'

export interface OliviaCommandOptions extends CommandOptions {
    examples?: string[]
    usage?: string
}