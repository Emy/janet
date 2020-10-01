require('dotenv').config();
import { PermissionLevels } from 'klasa';
import { config, token } from './config';
import JanetClient from './lib/client';

config.permissionLevels = new PermissionLevels()
    // everyone can use these commands
    .add(0, () => true)
    .add(
        1,
        ({ guild, member }) =>
            guild &&
            guild.settings.get('roles.memberplus') &&
            member.roles.cache.has(guild.settings.get('roles.memberplus')),
    )
    .add(
        2,
        ({ guild, member }) =>
            guild &&
            guild.settings.get('roles.memberpro') &&
            member.roles.cache.has(guild.settings.get('roles.memberpro')),
    )
    .add(
        3,
        ({ guild, member }) =>
            guild &&
            guild.settings.get('roles.memberedition') &&
            member.roles.cache.has(guild.settings.get('roles.memberedition')),
    )
    .add(
        4,
        ({ guild, member }) =>
            guild && guild.settings.get('roles.genius') && member.roles.cache.has(guild.settings.get('roles.genius')),
    )
    .add(
        5,
        ({ guild, member }) =>
            guild &&
            guild.settings.get('roles.moderator') &&
            member.roles.cache.has(guild.settings.get('roles.moderator')),
    )
    // Members of guilds must have 'MANAGE_GUILD' permission
    .add(6, ({ guild, member }) => guild && member.permissions.has('MANAGE_GUILD'), { fetch: true })
    // The member using this command must be the guild owner
    .add(7, ({ guild, member }) => guild && member === guild.owner, { fetch: true })
    /*
     * Allows the Bot Owner to use any lower commands
     * and causes any command with a permission level 9 or lower to return an error if no check passes.
     */
    .add(9, ({ author, client }) => client.owners.has(author), { break: true })
    // Allows the bot owner to use Bot Owner only commands, which silently fail for other users.
    .add(10, ({ author, client }) => client.owners.has(author));

new JanetClient(config).login(token);
