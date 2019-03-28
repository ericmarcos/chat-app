# ChatApp

This Serverless Component is a full-stack chat application, with a real-time back-end built on AWS API Gateway’s websocket support.  

This Component seeks to provide everything you need to easily deploy and manage the lifecycle of a Chat Application.

## Usage

### Declarative

```yml

name: my-chat-app
stage: dev

ChatApp@0.1.4::my-chat-app:
  colorBackground: #000000
  colorInputText: #FFFFFF
  logoUrl: null

```

### Programatic

```
npm i --save @serverless/chat-app
```

```js

const chatApp = await this.load('@serverless/chat-app')

    const inputs = {
      colorBackground: '#000000',
      colorInputText: '#FFFFFF',
      logoUrl: null
    }

await chatApp(inputs)

```
