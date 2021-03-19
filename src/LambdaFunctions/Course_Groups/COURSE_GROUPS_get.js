'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = '';
    let status_code = 0;

    const { courses } = event.queryStringParameters;

    const params = {
        TableName: 'COURSE_GROUPS'
    };

    try {
        const res = await documentClient.scan(params).promise();
        let data = [];
        for(let course of res.Items){
            if(courses.includes(course.id)){
                data.push(course);
            }
        }

        responseBody = JSON.stringify(data);
        status_code = 200;
    }
    catch(err) {
        responseBody = `Unable to get Posts: ${err}`;
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
