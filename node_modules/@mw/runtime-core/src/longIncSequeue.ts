export default function longIncSequeue(arr) {
  let start, end, middle;
  const result = [0];
  const diffLen = arr.length;
  const prevIndexArr = result.slice(0); // 记录子序列中当前元素的上一个索引

  for (let i = 0; i < diffLen; i++) {
    const cur = arr[i];
    // cur =0 意味着新节点是新增的，旧节点中不存在，跳过比较，做新增操作
    if (cur !== 0) {
      let resLastIndex = result[result.length - 1];
      if (cur > arr[resLastIndex]) {
        prevIndexArr[i] = result[result.length - 1];
        result.push(i);
        continue;
      }
    }
    start = 0;
    end = result.length - 1;
    while (start < end) {
      middle = ((start + end) / 2) | 0;
      if (cur > arr[result[middle]]) {
        start = middle + 1;
      } else {
        end = middle;
      }
      if (cur < arr[result[start]]) {
        prevIndexArr[i] = result[start - 1];
        // 替换之前的索引
        result[start] = i;
      }
    }
  }
  let resultLen = result.length;
  let lastResult = result[resultLen - 1];
  while (resultLen-- > 0) {
    result[resultLen] = lastResult;
    lastResult = prevIndexArr[lastResult];
  }
  return result;
}
