// 通过「数组来模拟队列」： 
class  Queue  {    
    constructor()  {       this._queue  =   [];     }    
    push(value)  {       return  this._queue.push(value);     }    
    shift()  {       return  this._queue.shift();     }    
    isEmpty()  {       return  this._queue.length  ===  0;     }  
}

// 管理其执行函数和参数：
class  DelayedTask  {    
    constructor(resolve,  fn,  args)  {      
        this.resolve  =  resolve;      
        this.fn  =  fn;      
        this.args  =  args;    
    }  
}

// 实现核心的 TaskPool 类，该类主要用来控制任务的执行：

/**
 * TaskPool 包含三个关键方法：

addTask: 将新的任务放入队列当中，并触发任务池状态检测，如果当前任务池非满载状态，则从队列中取出任务放入任务池中执行。
runTask: 执行当前任务，任务执行完成之后，更新任务池状态，此时触发主动拉取新任务的机制。
pullTask: 如果当前队列不为空，且任务池不满载，则主动取出队列中的任务执行。
 * */
class  TaskPool  {    
    constructor(size)  {      
        this.size  =  size;      
        this.queue  =  new  Queue();    
    }    
    addTask(fn,  args)  {      
        return  new  Promise((resolve)  =>  {        
            this.queue.push(new  DelayedTask(resolve,  fn,  args));        
            if  (this.size)  {          
                this.size--;          
                const  {  resolve:  taskResole,  fn,  args  }  =  this.queue.shift();          
                taskResole(this.runTask(fn,  args));        
            }      
        })    
    }    
    pullTask()  {      
        if  (this.queue.isEmpty())  {         return;       }      
        if  (this.size  ===  0)  {         return;       }      
        this.size++;      
        const  {  resolve,  fn,  args  }  =  this.queue.shift();      
        resolve(this.runTask(fn,  args));    
    }    
    runTask(fn,  args)  {      
        const  result  =  Promise.resolve(fn(...args));      
        result.then(()  =>  {        
            this.size--;        
            this.pullTask();      
        }).catch(()  =>  {        
            this.size--;        
            this.pullTask();      
        })      
        return  result;    
    }  
}

  
const  cc  =  new  ConcurrentControl(2);  
async  function  startConcurrentControl()  {    
    console.time();    
    await  Promise.all(taskList.map(item  =>  cc.addTask(task,   [item])))    
    console.timeEnd();  
}  
startConcurrentControl();