'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();
    const lambda = new AWS.Lambda({region: 'us-east-1'});

    let responseBody = '';
    let status_code = 0;

    const { id, fname, lname, courses } = JSON.parse(event.body);

    const params = {
        TableName: 'USERS',
        Key: {
            id: id
        },
        UpdateExpression: 'set fname = :n, lname = :m,  courses = :o',
        ExpressionAttributeValues: {
            ':n': fname,
            ':m': lname,
            ':o': courses,
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await documentClient.update(params).promise();
        responseBody = JSON.stringify(data);
        status_code = 204;
    }
    catch(err) {
        responseBody = `Unable to update User Info: ${err}`;
        status_code = 403;
    }

    let lambdaParams = {
        FunctionName: 'arn:aws:lambda:us-east-1:854656285549:function:sfu_community_course_groups_update',
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify({
            'username': id,
            'courses': courses
        })
    }
    try {
        let course_groups_res = await lambda.invoke(lambdaParams).promise();
        console.log(course_groups_res.Payload);
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
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET,PATCH,DELETE",
        },
        body: responseBody
    };

    return response;
};
