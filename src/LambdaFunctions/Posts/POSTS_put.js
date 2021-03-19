'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = '';
    let status_code = 0;

    const {id, postCreatorUsername, postBody, postTitle, postDateAndTimeCreated} = JSON.parse(event.body);

    const params = {
        TableName: 'POSTS',
        Item: {
            id: id,
            postCreatorUsername: postCreatorUsername,
            postTitle: postTitle,
            postBody: postBody,
            postDateAndTimeCreated: postDateAndTimeCreated
        }
    };

    try {
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data);
        status_code = 201;
    }
    catch(err) {
        responseBody = `Unable to add Post: ${err}`;
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

