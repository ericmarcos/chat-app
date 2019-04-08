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
      ],
      provisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3
      }
    })

    this.state.dbConnectionsName = dbConnectionsName
    await this.save()

    // Deploy the RealtimeApp...
    const realtimeApp = await this.load('@serverless/realtime-app')
    const realtimeAppOutputs = await realtimeApp({
      name: this.constructor.name,
      description: 'A real-time chat application.',
      frontend: {
        build: {
          dir: 'build',
          command: 'npm run build',
          localCmd: 'npm run start',
          envFile: './src/env.js',
          env: {
            colorBackground: inputs.colorBackground,
            colorInputText: inputs.colorInputText,
            logoUrl: inputs.logoUrl
          }
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

    this.cli.outputs(outputs)
    return outputs
  }

  /*
   * Remove
   */

  async remove() {
    this.cli.status('Removing')

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
