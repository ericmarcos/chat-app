/*
 * Component – ChatApp
 */

const path = require('path')
const { Component } = require('@serverless/components')

/*
 * Class – ChatApp
 */

class ChatApp extends Component {
  /*
   * Default
   */

  async default(inputs = {}) {
    this.cli.status(`Deploying`)

    // Merge inputs with defaults
    const defaults = {
      colorBackground: '#000000',
      colorInputText: '#FFFFFF',
      logoUrl: null
    }
    inputs = Object.assign(defaults, inputs)

    const dbConnectionsName = `chatapp-${this.context.stage}-connections`

    // Deploy the DynamoDB table...
    const dbConnections = await this.load('@serverless/aws-dynamodb', 'connections')
    const dbConnectionsOutputs = await dbConnections({
      name: dbConnectionsName,
      attributeDefinitions: [{
        AttributeName: 'connectionId',
        AttributeType: 'S'
      }],
      keySchema: [{
        AttributeName: 'connectionId',
        KeyType: 'HASH'
      }],
      provisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3
      }
    })

    this.state.dbConnectionsName = dbConnectionsName
    await this.save()

    // Deploy the RealtimeApp...
    const realtimeApp = await this.load('@serverless/realtime-app')
    let outputs = await realtimeApp({
      name: this.constructor.name,
      description: 'A real-time chat application.',
      frontend: {
        path: path.join(__dirname, 'frontend'),
        assets: path.join(__dirname, 'frontend', 'build'),
        envFile: path.join(__dirname, 'frontend', 'src', 'env.js'),
        buildCmd: 'npm run build',
        localCmd: 'npm run start',
        env: {
          colorBackground: inputs.colorBackground,
          colorInputText: inputs.colorInputText,
          logoUrl: inputs.logoUrl
        }
      },
      backend: {
        code: path.join(__dirname, 'backend'),
        env: {
          dbConnectionsName: dbConnectionsOutputs.name
        }
      }
    })

    // Save state
    this.state.url = outputs.frontend.url
    await this.save()

    this.cli.outputs({
      url: this.state.url
    })
    return outputs
  }

  /*
   * Remove
   */

  async remove() {
    this.cli.status('Removing')

    // Deploy the DynamoDB table...
    const dbConnections = await this.load('@serverless/aws-dynamodb', 'connections')
    const dbConnectionsOutputs = await dbConnections.remove()

    const realtimeApp = await this.load('@serverless/realtime-app')
    const outputs = await realtimeApp.remove()

    this.state = {}
    await this.save()
    return {}
  }

  async connect(inputs = {}) {
    const realtimeApp = await this.load('@serverless/realtime-app')
    return realtimeApp.connect({ code: './backend', ...inputs })
  }
}

module.exports = ChatApp
