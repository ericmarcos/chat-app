&nbsp;

Instantly deploy a zero configuration serverless chat app to AWS in seconds using [Serverless Components](https://github.com/serverless/components).

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
$ touch .env      # your development AWS api keys
$ touch .env.prod # your production AWS api keys
```

the `.env` files are not required if you have the aws keys set globally and you want to use a single stage, but they should look like this.

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

### 3. Configure

```yml
# serverless.yml

name: my-chat-app
stage: dev

myChatApp:
  component: "@serverless/chat-app"
  inputs: # all inputs are optional :)
    colorBackground: white
    colorInputText: black
    logoUrl: null
```

### 4. Deploy

```console
ChatApp (master)$ components

  ChatApp › outputs:
  url:  'http://chatapp-aegay7.s3-website-us-east-1.amazonaws.com'


  56s › dev › ChatApp › done

ChatApp (master)$
```

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
