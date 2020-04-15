/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Georgi Georgiev <georgi.georgiev@modusbox.com>
 * Valentin Genev <valentin.genev@modusbox.com>
 --------------
 ******/

'use strict'

const setupTest = require('ava')
const Sinon = require('sinon')
const Logger = require('@mojaloop/central-services-logger')
const Proxyquire = require('proxyquire')
const Path = require('path')
const Config = require('../../src/lib/config')
const eventSDK = require('@mojaloop/event-sdk')
const eventHandler = require('../../src/domain/event/handler')

let sandbox
let serverStub
let HapiStub
let HapiOpenAPIStub
let PathStub
let ConfigStub
let SetupProxy
let eventSDKStub
process.env.LOG_ENABLED = true

setupTest.serial.beforeEach(() => {
  try {
    sandbox = Sinon.createSandbox()

    serverStub = {
      register: sandbox.stub(),
      method: sandbox.stub(),
      start: sandbox.stub(),
      log: sandbox.stub(),
      plugins: {
        openapi: {
          setHost: Sinon.spy()
        }
      },
      info: {
        port: Config.PORT
      },
      ext: Sinon.spy()
    }
    HapiStub = {
      Server: sandbox.stub().returns(serverStub)
    }
    HapiOpenAPIStub = sandbox.stub()
    PathStub = Path
    ConfigStub = Config

    eventSDKStub = {
      EventLoggingServiceServer: sandbox.stub(eventSDK.EventLoggingServiceServer)
    }

    SetupProxy = Proxyquire('../../src/server', {
      '@hapi/hapi': HapiStub,
      'hapi-openapi': HapiOpenAPIStub,
      path: PathStub,
      './lib/config': ConfigStub,
      '@mojaloop/event-sdk': eventSDKStub
    })
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`setupTest failed with error - ${err}`)
  }
})

setupTest.serial.afterEach(() => {
  sandbox.restore()
})

setupTest.serial('initialize ', async test => {
  try {
    const { server, grpcServer } = await SetupProxy.initialize()
    test.assert(server, 'return server object')
    test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
    // test.assert(serverStub.start.calledOnce, 'server.start called once')
    // test.assert(serverStub.plugins.openapi.setHost.calledOnce, 'server.plugins.openapi.setHost called once')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
})

setupTest.serial('initialize grpc server ', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        trace: {
          spanId: 'test',
          traceId: 'test',
          tags: {
            transactionAction: 'test',
            transactionType: 'test',
            tracestate: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server without tracestate', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        trace: {
          spanId: 'test',
          traceId: 'test',
          tags: {
            transactionAction: 'test',
            transactionType: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server with missing transactionType tag', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        trace: {
          spanId: 'test',
          traceId: 'test',
          tags: {
            transactionAction: 'test',
            tracestate: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server with missing transactionAction tag', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        trace: {
          spanId: 'test',
          traceId: 'test',
          tags: {
            transactionType: 'test',
            tracestate: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server with missing spanId', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        trace: {
          traceId: 'test',
          tags: {
            transactionType: 'test',
            transactionAction: 'test',
            tracestate: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server with missing traceId', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        trace: {
          spanId: 'test',
          tags: {
            transactionType: 'test',
            transactionAction: 'test',
            tracestate: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server with missing trace', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      metadata: {
        event: {
          test: 'test'
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})

setupTest.serial('initialize grpc server without metadata', async test => {
  const eventHandlerStub = sandbox.stub(eventHandler, 'logEvent')
  try {
    const { server, grpcServer } = await SetupProxy.initialize()

    grpcServer.emit(eventSDK.EVENT_RECEIVED, {
      content: {
        trace: {
          spanId: 'test',
          traceId: 'test',
          tags: {
            transactionAction: 'test',
            transactionType: 'test',
            tracestate: 'test'
          }
        }
      }
    })
    // test.assert(eventHandlerStub.calledOnce, 'return server object')
    grpcServer.emit('error')
    test.assert(server, 'return server object')
    // test.assert(HapiStub.Server.called, 'Hapi.Server called once')
    test.assert(grpcServer, 'return grpcServer')
  } catch (err) {
    Logger.isErrorEnabled && Logger.error(`init failed with error - ${err}`)
    test.fail()
  }
  eventHandlerStub.restore()
})
