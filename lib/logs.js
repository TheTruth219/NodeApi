/*
 * Library for storing and rotating logs
 *
 *
 */


 // Dependencies

 let fs = require('fs');
 let path = require('path');
 let zlib = require('zlib');

 // Container for the module
 let lib = {};

 // Base directory of the log folder

 lib.baseDir = path.join(__dirname,'/../.logs/');

// Append a string to a file. Create the file if it does not exist.
lib.append = (file,str,callback) => {
  // Open the file for appending
  fs.open(lib.baseDir+file+'.log','a', (err,fileDescriptor)=>{
    if(!err && fileDescriptor){
      // Append to the file and close it
      fs.appendFile(fileDescriptor,str+'\n', err =>{
        if(!err){
          fs.close(fileDescriptor,err =>{
            if(!err){
              callback(false);
            } else {
              callback('Error closing file that was being appended')
            }
          });

        } else {
          callback('Error appending to file');
        }
      });
    } else {
      callback('Could not open file for appending');
    }
  });
};

// List all the logs, and optionally include athe compressed logs
lib.list = (includeCompressedLogs, callback)=>{
  fs.readdir(lib.baseDir, (err,data)=>{
    if(!err && data && data.length > 0){
      let trimmedFileNames = [];
      data.forEach(fileName=>{
        // Add the .log files
        if(fileName.indexOf('.log') > -1){
          trimmedFileNames.push(fileName.replace('.log',''));
        }

        // Add on the .gz files
        if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64',''));
        }
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};

// Compress the contents of one .log file into a .gz.b64 file within the same directory
lib.compress =(logId, newFileId, callback)=>{
  let sourceFile = logId+'.log';
  let destFile = newFileId+'.gz.b64';

  // Read source file
  fs.readFile(lib.baseDir+sourceFile,'utf8',(err,inputString)=>{
    if(!err && inputString){
      // Compress the data using gzip
      zlib.gzip(inputString,(err,buffer)=>{
        if(!err && buffer){
          // Send the data to the destination file
          fs.open(lib.baseDir+destFile,'wx',(err,fileDescriptor)=>{
            if(!err && fileDescriptor){
            // write to destination file
            fs.writeFile(fileDescriptor,buffer.toString('base64'),err=>{
              if(!err){
                fs.close(fileDescriptor, err=>{
                  if(!err){
                    callback(false);
                  } else {
                    callback(err);
                  }
                });
              } else {
                callback(err);
              }
            });
          } else {
            callback(err);
          }
          });

        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = (fileId,callback)=>{
  let fileName = fileId+'.gz.b64';
  fs.readFile(lib.baseDir+fileName,'utf8',(err,str)=>{
    if(!err && str){
      // Decompress the data
      let inputBuffer = Buffer.from(str,'base64');
      zlib.unzip(inputBuffer,(err,outputBuffer)=>{
        if(!err && outputBuffer){
          // Callback
          let str = outputBuffer.toString();
          callback(false, str);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};
// truncate a log file
lib.truncate = (logId,callback)=>{
  fs.truncate(lib.baseDir+logId+'.log',0,err=>{
    if(!err){
      callback(false);
    } else {
      callback(err);
    }
  });
}

 // Export the module
 module.exports = lib;
