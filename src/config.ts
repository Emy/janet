import { KlasaClientOptions } from 'klasa';

/**
 * The following are all client options for Klasa/Discord.js.
 * Any option that you wish to use the default value can be removed from this file.
 * This file is init with defaults from both Klasa and Discord.js.
 */

export const config: KlasaClientOptions = {
    /**
     * General Options
     */
    // Disables/Enables a process.on('unhandledRejection'...) handler
    production: false,
    owners: process.env.OWNERS.split(','),
    // The default language that comes with klasa. More base languages can be found on Klasa-Pieces
    language: 'en-US',
    // The default configurable prefix for each guild
    prefix: '!',
    // If custom settings should be preserved when a guild removes your bot
    preserveSettings: true,
    // The time in ms to add to ratelimits, to ensure you wont hit a 429 response
    restTimeOffset: 500,
    // A presence to login with
    presence: {},

    /**
     * Caching Options
     */
    fetchAllMembers: true,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    commandMessageLifetime: 1800,
    // The above 2 options are ignored while the interval is 0
    messageSweepInterval: 0,

    /**
     * Command Handler Options
     */
    commandEditing: false,
    commandLogging: false,
    typing: false,

    /**
     * Database Options
     */
    providers: {
        postgresql: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            options: {},
        },

        default: 'postgresql',
    },

    /**
     * Custom Prompt Defaults
     */
    customPromptDefaults: {
        time: 30000,
        limit: Infinity,
        quotedStringSupport: false,
    },

    /**
     * Klasa Piece Defaults
     */
    pieceDefaults: {
        commands: {
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            description: '',
            enabled: true,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            promptLimit: 0,
            promptTime: 30000,
            requiredSettings: [],
            requiredPermissions: 0,
            runIn: ['text', 'dm'],
            subcommands: false,
            usage: '',
            quotedStringSupport: false,
            deletable: false,
        },
        events: {
            enabled: true,
            once: false,
        },
        extendables: {
            enabled: true,
            appliesTo: [],
        },
        finalizers: { enabled: true },
        inhibitors: {
            enabled: true,
            spamProtection: false,
        },
        languages: { enabled: true },
        monitors: {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: true,
            ignoreWebhooks: true,
            ignoreEdits: true,
        },
        providers: {
            enabled: true,
        },
        tasks: { enabled: true },
    },

    /**
     * Console Event Handlers (enabled/disabled)
     */
    consoleEvents: {
        debug: false,
        error: true,
        log: true,
        verbose: false,
        warn: true,
        wtf: true,
    },

    /**
     * Custom Setting Gateway Options
     */
    gateways: {
        guilds: {},
        users: {},
        clientStorage: {},
    },
};
export const token = process.env.DISCORD_TOKEN;
