<a href="https://klave.com/">
  <img alt="Klave - Chat room" src="https://klave.com/images/marketplace/klave-chat-room.svg">
  <h1 align="center">Chat room - Privacy and Programmability.</h1>
</a>

<p align="center">
  An implementation on Klave of a chat room concept which provides full privacy and integrity by design, while allowing programmers to build chat bots to provide new business functionalities.
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

This chat room template provides an app which will allow the basic functionalities of a chat room while preserving the privacy and integrity through Klave capabilities:

-   Register your users and idenfy them
-   Create a chat room and manage its users
-   Discuss through multiple chat rooms with live notifications

On top of these basic functionalities, it also showcases the use of bots that can enable another level of business capabilities, to provide a "chat with a brain" while preserving the same level of privacy and integrity.

## Features

-   **Register your user:**
-   **Create chat room:**
-   **Manage users of chat rooms:**
-   **Discuss:**
-   **Create new business functionalities through your own Chat bots:**

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

Alongside the Klave Chat Room app, there is a simple UI app showcasing its usage. The UI is written with [React](https://react.dev/), [React Router](https://reactrouter.com/en/main) and [TypeScript](https://www.typescriptlang.org/docs/). To run the app, follow the steps:

-   Clone this repo
-   Navigate to the UI app folder `cd /apps/ui`
-   Run `npm i` to install all the dependancies
-   Change the variables `VITE_APP_KLAVE_CONTRACT` in the .env.local file of chat room app with the address of your honest application
-   Run `npm run dev` to spin up a dev server

## Authors

This library is created by [Klave](https://klave.com) and [Secretarium](https://secretarium.com) team members, with contributions from:

-   Damian Tziamtzis ([@damtzi](https://github.com/damtzi)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
-   Nicolas Marie ([@Akhilleus20](https://github.com/Akhilleus20)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
-   Etienne Bosse ([@Gosu14](https://github.com/Gosu14)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
