'use strict'

const Test = require('ava')
const Sinon = require('sinon')
const eventHandler = require('../../../../src/domain/event/handler')
const KafkaUtil = require('../../../../src/lib/kafka/util')

let payload = {
  'from': 'noresponsepayeefsp',
  'to': 'payerfsp',
  'id': 'aa398930-f210-4dcd-8af0-7c769cea1660',
  'content': {
    'headers': {
      'content-type': 'application/vnd.interoperability.transfers+json;version=1.0',
      'date': '2019-05-28T16:34:41.000Z',
      'fspiop-source': 'noresponsepayeefsp',
      'fspiop-destination': 'payerfsp'
    },
    'payload': 'data:application/vnd.interoperability.transfers+json;version=1.0;base64,ewogICJmdWxmaWxtZW50IjogIlVObEo5OGhaVFlfZHN3MGNBcXc0aV9VTjN2NHV0dDdDWkZCNHlmTGJWRkEiLAogICJjb21wbGV0ZWRUaW1lc3RhbXAiOiAiMjAxOS0wNS0yOVQyMzoxODozMi44NTZaIiwKICAidHJhbnNmZXJTdGF0ZSI6ICJDT01NSVRURUQiCn0'
  },
  'type': 'application/json',
  'metadata': {
    'event': {
      'id': '3920382d-f78c-4023-adf9-0d7a4a2a3a2f',
      'type': 'position',
      'action': 'commit',
      'createdAt': '2019-05-29T23:18:32.935Z',
      'state': {
        'status': 'success',
        'code': 0,
        'description': 'action successful'
      },
      'responseTo': '1a396c07-47ab-4d68-a7a0-7a1ea36f0012'
    },
    'trace': {
      'traceId': 'bbd7b2c7-3978-408e-ae2e-a13012c47739',
      'parentId': '4e3ce424-d611-417b-a7b3-44ba9bbc5840',
      'spanId': 'efeb5c22-689b-4d04-ac5a-2aa9cd0a7e87'
    }
  }
}

let request = {
  payload
}

let sandbox

Test.beforeEach(() => {
  sandbox = Sinon.createSandbox()
  sandbox.stub(KafkaUtil, 'produceGeneralMessage').returns(Promise.resolve(true))
})

Test.afterEach(() => {
  sandbox.restore()
})

Test('Event handler should produce event message', async (test) => {
  let response = await eventHandler.handleRestRequest(request)
  test.true(response)
})