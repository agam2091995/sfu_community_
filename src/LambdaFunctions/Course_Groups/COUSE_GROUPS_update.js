'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = '';
    let status_code = 0;

    const {username, courses} = event;

    try {
        for (let course of courses){
            console.log("ADDING COURSE", course);
            let params = {
                TableName: 'COURSE_GROUPS',
                Key: {
                    id: course,
                },
                UpdateExpression: "set #members = list_append(if_not_exists(#members, :empty_list), :i)",
                ConditionExpression: "not contains (#members, :i)",
                ExpressionAttributeNames: {
                    '#members': "members",
                },
                ExpressionAttributeValues: {
                    ':i': [username],
                    ':empty_list': []
                },
                ReturnValues: 'UPDATED_NEW'
            };
            await documentClient.update(params).promise();
        }
        status_code = 200;
        responseBody = "all course groups added";
    }
    catch(err) {
        responseBody = `Unable to add Course Group: ${err}`;
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