const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  apiVersions: {
    s3: '2006-03-01',
  },
})
const s = (obj) => JSON.stringify(obj, null, 2)

test.only("meh",  (done) => {
  const ebs = new AWS.ElasticBeanstalk()

  const params ={
    // ApplicationName: 'which-deliver',
    AttributeNames: [
      "All"
    ],
    EnvironmentName: 'test-which-deliver'
  };
  ebs.describeEnvironmentHealth(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(111, s(data));           // successful response

    return done()
  });
  expect(true).toEqual(true);
});
