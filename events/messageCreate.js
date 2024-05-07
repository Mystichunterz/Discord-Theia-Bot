/* -------------------------
[File Information]
Author: Mystichunterz#1922
------------------------- */

console.log("----------------------");
console.log("events > messageCreate.js");
console.log("----------------------");

//----------------------
//  imports
//----------------------
import Event from "../classes/Event.js";
import permissionLevels from "../config/permission_config.js";

//----------------------
//  config
//----------------------
const ownerConfig = permissionLevels.permissionLevels.find(level => level.name === "Owner");
const ownerIds = ownerConfig ? ownerConfig.user_ids : [];

//----------------------
//  main
//----------------------
class MessageCreate extends Event {
  userHasPermission(user, command) {
    const userRoles = user.roles.cache.map(role => role.id);

    const accessLevel = command.accessLevel || 7;
    // console.log(`Access level for command '${command.name}': ${command.accessLevel}`);
    // console.log(`Final access level for command '${command.name}': ${accessLevel}`)

    if (typeof accessLevel !== 'number') {
        console.error(`Invalid access level type for command '${command.name}': ${accessLevel}`);
        return false;
    }

    const commandPermission = permissionLevels.permissionLevels[accessLevel];
    if (!commandPermission) {
        console.error(`No permission level defined for command at index: ${accessLevel}`);
        return false;
    }

    // Find the highest level of permission the user has
    const userLevel = permissionLevels.permissionLevels.reduce((acc, level, index) => {
        if (level && (level.user_ids.includes(user.id) || level.role_ids.some(roleId => userRoles.includes(roleId)))) {
            return (acc === null || index < acc.index) ? { level, index } : acc;
        }
        return acc;
    }, null);

    // If user has no matching permission levels, deny access
    if (!userLevel) {
        // console.log(`User ${user.id} has no matching permission level.`);
        return false;
    }

    // console.log(`User ${user.id} has permission level ${userLevel.level.level}. Command requires ${accessLevel}.`);
    return userLevel.level.level <= accessLevel;
  }

  //----------------------
  //  Check if message is a command
  //----------------------
  async run(message) {
    if (message.content.startsWith(this.client.prefix) && !message.author.bot) {
      // Extract the command name and arguments from the message
      const args = message.content.slice(this.client.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Retrieve the command from the client's command collection
      const command = this.client.getCommand(commandName);

      // Check if the command exists
      if (!command) return message.reply("Command does not exist.");

      if (!this.userHasPermission(message.member, command)) {
        return message.reply("You do not have permission to use this command.");
      }

      // Check for cooldowns
      if (command.cooldown) {
          const key = `${command.name}-${message.author.id}`;
          const cooldownUntil = this.client.cooldowns.get(key);

          if (cooldownUntil && cooldownUntil > Date.now()) {
              return message.reply(
                  `Command is still on cooldown for ${Math.ceil((cooldownUntil - Date.now()) / 1000)} more seconds.`
              );
          }

          // Set the new cooldown
          this.client.cooldowns.set(key, Date.now() + command.cooldown);
      }

      // Run the command and pass in message and args
      await command.run(message, args);
  } else {
      //----------------------
      //  Check if message is a response
      //----------------------
      let response = this.client.getResponse(message.content.toLowerCase());
      if (!response) return;

      //----------------------
      //  Check for owner permissions
      //----------------------
      if (!this.userHasPermission(message.member, response)) {
        return message.reply("You do not have permission to use this response.");
      }

      // Check if message has a cooldown
      if (response.cooldown) {
        let cooldownUntil = this.client.cooldowns.get(
          `${response.name}-${message.author.id}`
        );
        if (cooldownUntil && cooldownUntil > Date.now())
          return message.reply(
            `Response is still on cooldown for ${Math.ceil(
              (cooldownUntil - Date.now()) / 1000
            )} more seconds`
          );

        // Sets the cooldown for the user by adding the current time plus the command's cooldown time to the cooldowns collection.
        this.client.cooldowns.set(
          `${response.name}-${message.author.id}`,
          new Date().valueOf() + response.cooldown
        );
      }

      try {
        await response.run(message);
      } catch (error) {
        console.error(error);
      }

    }
  }
}

export default MessageCreate;
