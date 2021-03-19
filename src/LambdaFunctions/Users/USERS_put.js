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
        Item: {
            id: id,
            fname: fname,
            lname: lname,
            courses: courses
        }
    };

    try {
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data);
        status_code = 201;
    }
    catch(err) {
        responseBody = `Unable to add User Info: ${err}`;
        status_code = 403;
    }

    let lambdaParams = {
        FunctionName: 'Your COURSE_GROUPS_update lambda function ARN',
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
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET,PATCH,DELETE"
        },
        body: responseBody
    };

    return response;
};

