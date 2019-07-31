/*
 * Component – ChatApp
 */

const path = require('path')
const { Component } = require('@serverless/core')

/*
 * Class – ChatApp
 */

class ChatApp extends Component {
  /*
   * Default
   */

  async default(inputs = {}) {
    this.context.status(`Deploying`)

    // Merge inputs with defaults
    const defaults = {
      colorBackground: '#000000',
      colorInputText: '#FFFFFF',
      logoUrl: null
    }
    inputs = Object.assign(defaults, inputs)

    // Deploy the DynamoDB table...
    const dbConnections = await this.load('@serverless/aws-dynamodb', 'connections')
    const dbConnectionsOutputs = await dbConnections({
      attributeDefinitions: [
        {
          AttributeName: 'connectionId',
          AttributeType: 'S'
        }
      ],
      keySchema: [
        {
          AttributeName: 'connectionId',
          KeyType: 'HASH'
        }
      ]
    })
    // Deploy the RealtimeApp...
    const realtimeApp = await this.load('@serverless/realtime-app')
    const realtimeAppOutputs = await realtimeApp({
      name: this.constructor.name,
      description: 'A real-time chat application.',
      frontend: {
        code: {
          src: 'build',
          root: path.join(__dirname, 'frontend'),
          hook: 'npm run build'
        },
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

    const outputs = {}
    outputs.url = realtimeAppOutputs.frontend.url

    // Save state
    this.state.url = outputs.url
    await this.save()

    return outputs
  }

  /*
   * Remove
   */

  async remove() {
    this.ui.status('Removing')

    // Deploy the DynamoDB table...
    const dbConnections = await this.load('@serverless/aws-dynamodb', 'connections')
    await dbConnections.remove()

    const realtimeApp = await this.load('@serverless/realtime-app')
    await realtimeApp.remove()

    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = ChatApp
