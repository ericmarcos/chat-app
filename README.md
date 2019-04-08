&nbsp;

Instantly deploy a zero configuration serverless chat application to AWS in under a minute using [Serverless Components](https://github.com/serverless/components).

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)

&nbsp;


### 1. Install

```
$ npm install -g @serverless/components
```

### 2. Create

Just create a `serverless.yml` file.

```console
$ touch serverless.yml
```

### 3. Configure

```yml
# serverless.yml

name: my-chat-app
stage: dev

myChatApp:
  component: "@serverless/chat-app"
  inputs: # all inputs are optional :)
    colorBackground: #000000
    colorInputText: #FFFFFF
    logoUrl: null
```

### 4. Deploy

```
$ components
```

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
