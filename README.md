# breakfast-line-bot-typescript

## Overview 
This is a repository of breakfast-line-bot-typescript.

## Installation 
__Line Bot Server_ requires [Node.js](https://nodejs.org/) v16.14+ to run, [express.js](https://expressjs.com/) to run ,and [Line bot SDK](https://developers.line.biz/en/services/messaging-api/) to run.

Clone the repository and install the dependencies

```sh
git clone https://github.com/Karn-P/breakfast-line-bot-typescript.git
cd breakfast-line-bot-typescript
```
```sh
npm install
yarn install
```

Create .env file

```sh
PORT = 4000
CHANNEL_ACCESS_TOKEN = {YOUR_LINE_CHANNEL_ACCESS_TOKEN}
CHANNEL_SECRET = {YOUR_LINE_CHANNEL_SECRET}
SPREADSHEET_ID = {YOUR_SPREADSHEET_ID}
BOTCOMMANDS_PHOTO = {BOT_COMMAND_PHOTO}
```

## Running the project
To run this software, you need to follow severals step to configure the behavior of the software. 
The software will listen on port 3001 by default, which can be run by execute
  
   ```sh
   npm start
   ```
   ```sh
   yarn start
   ```
   or execute in dev mode using
   ```sh
   npm run dev
   ```
   ```sh
   yarn dev
   ```
   
## Dependencies
_Line Bot Server_ uses a number of open source projects to work properly:

- [node.js] - Asynchronous event-driven JavaScript runtime environment, suitable for non-blocking I/O needed application.
- [express] - Node.js web application framework, serving RESTful API.
- [typescript] - TypeScript compiles to readable, standards-based JavaScript.
- [line-bot-sdk] - The LINE Messaging API SDK for nodejs makes it easy to develop bots using LINE Messaging API.
