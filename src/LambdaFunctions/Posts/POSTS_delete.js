'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = '';
    let status_code = 0;

    const { id } = event.pathParameters;

    const params = {
        TableName: 'POSTS',
        Key: {
            id: id
        }
    };

    try {
        const data = await documentClient.delete(params).promise();
        responseBody = JSON.stringify(data);
        status_code = 204;
    }
    catch(err) {
        responseBody = `Unable to delete Post: ${err}`;
        status_code = 403;
    }

    let response = {
        statusCode: status_code,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET,PATCH,DELETE"
        },
        body: responseBody
    };

    return response;
};
