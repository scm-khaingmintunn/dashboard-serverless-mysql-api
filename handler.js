'use strict'

const AbstractService = require('./service/abstract')
const UserService = require('./service/user')

const NoAuth = async (params) => {
  return params
}

const router = {
  '/user': {
    POST: {
      auth: NoAuth,
      main: UserService.create,
    },
  },
}
module.exports.call = async (event, context) => {
  let handler = null
  try {
    handler = router[event.resource][event.httpMethod]
  } catch (error) {
    return handleError(error, 'Rout Not Found', 404)
  }

  const params = getEventParams(event)

  let authedParam
  try {
    authedParam = await handler.auth(params)
  } catch (error) {
    return handleError(error, 'Auth Error')
  }

  let serviceResponse
  try {
    serviceResponse = await handler.main(authedParam)
  } catch (error) {
    return handleError(error, 'Servce Response Error')
  }

  if (!serviceResponse) {
    console.log('!!WARNING!! `serviceResponse` is empty.')
  }

  return apiGatewayResponse(null, serviceResponse)
}

const getEventParams = (event) => {
  const params = {
    headers: event.headers,
    path: event.pathParameters,
    query: event.queryStringParameters,
    body: event.body ? JSON.parse(event.body) : event.body,
  }

  return params
}

const apiGatewayResponse = (statusCode, serviceResponse) => {
  let headers = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  }
  if (serviceResponse) {
    if (
      serviceResponse.headers &&
      typeof serviceResponse.headers === 'object'
    ) {
      headers = { ...headers, ...serviceResponse.headers }
    }
  }

  const body =
    serviceResponse && serviceResponse.body ? serviceResponse.body : null

  let response
  let responseLog
  if (
    headers['Content-Type'] === 'application/octet-stream' ||
    headers['content-type'] === 'application/octet-stream'
  ) {
    // status code
    if (!statusCode) {
      statusCode = serviceResponse && serviceResponse.body ? 200 : 204
    }

    response = {
      statusCode,
      headers,
      body,
      isBase64Encoded: true,
    }

    responseLog = { ...response }
    responseLog.body = '[BASE_64_STRING]'
  } else {
    // JSON
    if (!statusCode) {
      statusCode =
        serviceResponse && serviceResponse.body
          ? serviceResponse.body.statusCode
          : 204
    }

    response = {
      statusCode,
      headers,
      body: JSON.stringify(body),
    }

    responseLog = { ...response }
  }

  console.log('RESPONSE:')
  console.log(responseLog)

  return response
}

const handleError = (error, message, statusCode, errors, headers) => {
  const response = AbstractService.failed(
    error,
    message,
    statusCode,
    errors,
    headers
  )
  return apiGatewayResponse(null, response)
}
