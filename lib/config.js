/*
* Create and export configuration variables
*
*
*/

// Container for all the enviornments

let environments = {};

// Staging (default) environment

environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC6cfa325aab8ecf771e41012b01b6cb1e',
    'authToken' : 'b423b083a9761d710394c095b8bcfbb4',
    'fromPhone' : '+16024973861'
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'Cloud Powered Technologies, LLC',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:3000/'
  }
};
// Testing environment
environments.testing = {
  'httpPort' : 4000,
  'httpsPort' : 4001,
  'envName' : 'testing',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC6cfa325aab8ecf771e41012b01b6cb1e',
    'authToken' : 'b423b083a9761d710394c095b8bcfbb4',
    'fromPhone' : '+16024973861'
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'Cloud Powered Technologies, LLC',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:4000/'
  }
};

// Production environments
environments.production = {
  'httpPort' : 5000,
  'httpsPort' :5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC6cfa325aab8ecf771e41012b01b6cb1e',
    'authToken' : 'b423b083a9761d710394c095b8bcfbb4',
    'fromPhone' : '+16024973861'
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'Cloud Powered Technologies, LLC',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:5000'
  }
};

// Determine which environment was passed as a command-line argument

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging

let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module

module.exports = environmentToExport;
