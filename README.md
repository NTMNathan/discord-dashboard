# Discord Dashboard Example
A simple Discord Bot Dashboard i've made. Coded with Express, Enmap and Discord.js.

## Setup 
1. Create a folder on your computer, then type the following console command to clone this repository.
```bash
git clone https://github.com/NTMNathan/discord-dashboard
```

2. Create a Discord Application and name it.

![alt text](https://i.imgur.com/luHPTGL.png "Step 2")


3. Rename `example.env` to `.env` and fill the required values from the Discord **OAuth2** and **Bot** Page. **Do not show anyone these!**

4. Install all of the required NPM modules with the following command...
```bash
npm install --save
```

5. Add the callback URL to the Bot's **OAuth2** Page. Click the save button after that.

![alt text](https://i.imgur.com/9EWhEnE.png "Step 3")


6. Start the dashboard.
```bash
node bot
```

> Note: You do not need to enable and specify any gateway intents.

## Support and Feedback
 I will try to maintain this as much as possible. Feel free to join my [Discord Server](https://natebot.xyz/discord) and ask for help in the `#support` and `#bugs` channels. If you have any changes that you like to propose to this repo, make a Pull Request and i'll review it.