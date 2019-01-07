/*
 * Async Hooks Example
 *
 *
 */

 // Dependencies
 const async_hooks = require('async_hooks');
 const fs = require('fs');

 // Target execution context
 let targetExecutionContext = false;

 // Write an arbitrary async function

 let whatTimeIsIt = callback=>{
   setInterval(()=>{
     fs.writeSync(1, 'When the setInterval runs, the execution context is '+async_hooks.executionAsyncId()+'\n' );
     callback(Date.now());
   },1000);
 };


 // Call that function
 whatTimeIsIt(time=>{
   fs.writeSync(1, "the time is "+time+"\n");
 });

 // Hooks
 let hooks = {
   init(asyncId,type,triggerAsyncId,resource){
      fs.writeSync(1,"hook init "+asyncId+"\n");
    },
    before(asyncId){
      fs.writeSync(1, "hook before "+asyncId+"\n");
    },
    after(asyncId){
      fs.writeSync(1, "hook after "+asyncId+"\n");
    },
    destroy(asyncId){
      fs.writeSync(1, "hook destroy "+asyncId+"\n");
    },
    promiseResolve(asyncId){
      fs.writeSync(1, "hook promiseResolve "+asyncId+"\n");
    }
 };

// Create new AsyncHooks instance

let asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();
