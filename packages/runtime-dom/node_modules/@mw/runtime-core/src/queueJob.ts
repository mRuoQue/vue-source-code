const queue = [];
let promiseResolve = Promise.resolve();
let isFlashing = false;

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  if (!isFlashing) {
    isFlashing = true;

    promiseResolve.then(() => {
      isFlashing = false;
      const newQueue = queue.slice();
      queue.length = 0;
      for (let i = 0; i < newQueue.length; i++) {
        newQueue[i]();
        newQueue.length = 0;
      }
    });
  }
}
