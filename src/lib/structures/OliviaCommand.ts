import { Command, CommandOptions, PieceContext } from '@sapphire/framework'
import path from 'path'

export interface OliviaCommandOptions extends CommandOptions {
    examples?: string[]
    usage?: string
}

export abstract class OliviaCommand extends Command {
    public examples: string[]
    public usage: string

    protected constructor(context: PieceContext, options: OliviaCommandOptions) {
        super(context, options)

        this.examples = options.examples ?? []
        this.usage = options.usage ?? ''
    }

    public get category(): string {
        const parts = this.path.split(path.sep)
        const category = parts[parts.length - 2]
        return category.toLowerCase()
    }

    public toJSON(): Record<string, any> {
        return { ...super.toJSON(), examples: this.examples, usage: this.usage }
    }
}