import { Client, Collection } from 'discord.js';
import CommandsHandler from './handlers/commands_handler.js';
import EventsHandler from './handlers/events_handler.js';
import ResponsesHandler from './handlers/responses_handler.js';
import ButtonsHandler from './handlers/buttons_handler.js';

class Bot extends Client {
    constructor(args) {
        super(args);

        this.prefix = args.prefix;
        this.commands = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
        this.events = new Collection();
        this.responses = new Collection();
        this.buttons = new Collection();

        this.commandsHandler = new CommandsHandler(this);
        this.eventsHandler = new EventsHandler(this);
        this.responsesHandler = new ResponsesHandler(this);
        this.buttonsHandler = new ButtonsHandler(this);
    }

    async start(token) {
        await this.commandsHandler.loadCommands();
        await this.eventsHandler.loadEvents();
        await this.responsesHandler.loadResponses();
        await this.buttonsHandler.loadButtons();
        console.log('\x1b[32m%s\x1b[0m', 'All components loaded, now logging in...');

        await super.login(token);
    }

    getCommand(commandName) {
      let command = this.commands.get(commandName);
      if (!command) command = this.commands.get(this.aliases.get(commandName));
      return command;
    }

    getResponse(responseName) {
      let response = this.responses.get(this.aliases.get(responseName));
      return response;
    }

    getButton(buttonName) {
      let button = this.buttons.get(buttonName);
      return button;
    }
}

export default Bot;
