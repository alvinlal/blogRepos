const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-south-1',
});

const stepFunctions = new AWS.StepFunctions();

const invokeStepFunction = (event, context, callback) => {
  const id = event.Records[0].s3.object.key; // event object contains payload from s3 trigger
  try {
    const stateMachineParams = {
      stateMachineArn: process.env.STEP_FUNCTION_ARN,
      input: JSON.stringify({ id }), // input to step function
    };
    stepFunctions.startExecution(stateMachineParams, (err, data) => {
      // starts step function execution
      if (err) {
        console.error(err);
        const response = {
          statusCode: 500,
          body: JSON.stringify({
            message: 'There was an error',
          }),
        };
        callback(null, response);
      } else {
        console.log(data);
        const response = {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Step function worked',
          }),
        };
        callback(null, response);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handler: invokeStepFunction,
};
