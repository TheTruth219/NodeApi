/*
 * Request Handlers
 *
 */

// Dependencies





// Define the handlers
let handlers = {};

// Users

handlers.users = (data,callback)=>{
  let acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  }
};

//Container for the users submethods
handlers._users ={};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data,callback)=>{
  //Check that all required feilds are filled out
  let firstName = typeof(data.payload.firstName)== 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName)== 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let phone = typeof(data.payload.phone)== 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password)== 'string' && data.payload.firstName.trim().length > 0 ? data.payload.password.trim() : false;
  let tosAgreement = typeof(data.payload.tosAgreement)== 'boolean' && data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && tosAgreement){
    // Make sure that the user doesn't already existing

  }else{
    callback(400,{'Error': 'Missing required fields'});
  }
};

// Users - get
handlers._users.get = (data,callback)=>{

};

// Users - put
handlers._users.put = (data,callback)=>{

};

// Users - delete
handlers._users.delete = (data,callback)=>{

};


// Ping handler
handlers.ping = (data,callback)=>{
  callback(200);
};

// Not found handler
handlers.notFound =(data, callback)=>{
  callback(404);
};

// Export the module

module.exports = handlers ;
