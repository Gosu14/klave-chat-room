<a href="https://klave.com/">
  <img alt="Klave - Chat room" src="https://klave.com/images/marketplace/chat-room.svg">
  <h1 align="center">Chat room - Discuss with full privacy while leveraging programmability through chatbots.</h1>
</a>

<p align="center">
  An implementation on Klave of a chat room concept which allows full privacy, while embedding chat bots.
</p>

<p align="center">
  <a href="#description"><strong>Description</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#build-locally"><strong>Build Locally</strong></a> ·
  <a href="#test-locally"><strong>Test Locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>

![Wasm](https://img.shields.io/badge/Webassembly-5E4EE3?style=for-the-badge&labelColor=white&logo=webassembly&logoColor=5E4EE3) ![AssemblyScript](https://img.shields.io/badge/Assemblyscript-3578C7?style=for-the-badge&labelColor=white&logo=assemblyscript&logoColor=3578C7)

## Description

Leverage Klave's privacy for a chat room implementation.

  
## Features

- **Discuss:**
- **Chat bots:**

## Deploy Your Own

You can deploy your own version of the Klave Chat room to Klave with one click:

[![Deploy on Klave](https://klave.com/images/deploy-on-klave.svg)](https://app.klave.com/template/github/secretarium/klave-chat-room)

## Build Locally

You can build your template into wasm locally, allowing you to validate the hash of the application deployed on Klave.

> Note: You should have node and yarn installed to be able to build locally.

```bash
yarn install
yarn build
```
This will create the .wasm file in the ./klave folder.

## Test Locally

You will find on Klave's github an example of a simple UI to target your chat room app deployed using this template:
- Clone this repo:
- Change the setting VITE_APP_KLAVE_CONTRACT in the .env file of chat room app with the address of your honest application
- Run `nx serve chat-room` for a dev server. Navigate to <http://localhost:4200/>.

## Authors

This library is created by [Klave](https://klave.com) and [Secretarium](https://secretarium.com) team members, with contributions from:

- Damian Tziamtzis
- Nicolas Marie ([@Akhilleus20](https://github.com/Akhilleus20)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
- Etienne Bosse ([@Gosu14](https://github.com/Gosu14)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
