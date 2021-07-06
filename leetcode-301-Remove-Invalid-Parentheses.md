# 题目描述（困难难度）

301、Remove Invalid Parentheses

Remove the minimum number of invalid parentheses in order to make the input string valid. Return all possible results.

**Note:** The input string may contain letters other than the parentheses `(` and `)`.

**Example 1:**

```
Input: "()())()"
Output: ["()()()", "(())()"]
```

**Example 2:**

```
Input: "(a)())()"
Output: ["(a)()()", "(a())()"]
```

**Example 3:**

```
Input: ")("
Output: [""]
```

移除最少的括号，使得整个字符串合法，也就是左右括号匹配，返回所有可能的结果。

# 解法一 回溯法/DFS/暴力

需要解决几个关键点。

第一，怎么判断括号是否匹配？

[20 题](https://leetcode.wang/leetCode-20-Valid Parentheses.html) 的时候做过括号匹配的问题，除了使用栈，我们也可以用一个计数器 `count`，遇到左括号进行加 `1` ，遇到右括号进行减 `1`，如果最后计数器是 `0`，说明括号是匹配的。代码的话可以参考下边。

```javascript
function isVaild(s) {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      count++;
    } else if (s[i] === ')') {
      count--;
    }
    if (count < 0) {
      return false;
    }
  }
  return count === 0;
}
```

第二，如果用暴力的方法，怎么列举所有情况？

要列举所有的情况，每个括号无非是两种状态，在或者不在，字母的话就只有「在」一种情况。我们可以通过回溯法或者说是 `DFS` 。可以参考下边的图。

对于 `(a)())`， 如下图，蓝色表示在，橙色表示不在，下边是第一个字符在的情况。

![](https://windliang.oss-cn-beijing.aliyuncs.com/301_2.jpg)

下边是第一个字符不在的情况。

![](https://windliang.oss-cn-beijing.aliyuncs.com/301_3.jpg)

我们要做的就是从第一个字符开始，通过深度优先遍历的顺序，遍历到最后一个字符后判断当前路径上的字符串是否合法。

对于代码的话，我们可以一边遍历，一边记录当前 `count` 的情况，也就是左右括号的情况。到最后一个字符后，只需要判断 `count` 是否为 `0` 即可。

第三，怎么保证删掉最少的括号？

这个方法很多，说一下我的。假设我们用 `res` 数组保存最终的结果，当新的字符串要加入的时候，我们判断一下新加入的字符串的长度和数组中第一个元素长度的关系。

如果新加入的字符串的长度大于数组中第一个元素的长度，我们就清空数组，然后再将新字符串加入。

如果新加入的字符串的长度小于数组中第一个元素的长度，那么当前字符串抛弃掉。

如果新加入的字符串的长度等于数组中第一个元素的长度，将新字符串加入到 `res` 中。

第四，重复的情况怎么办？

简单粗暴一些，最后通过 `set` 去重即可。

上边四个问题解决后，就可以写代码了。

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function (s) {
  let res = [''];
  removeInvalidParenthesesHelper(s, 0, s.length, 0, '', res);
  //去重
  return [...new Set(res)];
};

/**
 * 
 * @param {string 原字符串} s 
 * @param {number 当前考虑的字符下标} start 
 * @param {number s 的长度} end 
 * @param {number 记录左括号和右括号的情况} count 
 * @param {string 遍历的路径字符串} temp 
 * @param {string[] 保存最终的结果} res 
 */
function removeInvalidParenthesesHelper(s, start, end, count, temp, res) {
  //当前右括号多了, 后边无论是什么都不可能是合法字符串了, 直接结束
  if (count < 0) {
    return;
  }
  //到达结尾
  if (start === end) {
    if (count === 0) {
      let max = res[0].length;
      if (temp.length > max) {
        //清空之前的
        res.length = 0;
        //将当前的加入
        res.push(temp);
      } else if (temp.length === max) {
        res.push(temp);
      }
    }
    return;
  }
  //添加当前字符
  if (s[start] === '(') {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count + 1,
      temp + '(',
      res
    );
  } else if (s[start] === ')') {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count - 1,
      temp + ')',
      res
    );
  } else {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count,
      temp + s.charAt(start),
      res
    );
  }

  //不添加当前字符
  if (s[start] === '(' || s[start] === ')') {
    removeInvalidParenthesesHelper(s, start + 1, end, count, temp, res);
  }
}
```

上边的代码，剪枝的话只有

```java
if (count < 0) {
    return;
}
```

我们可以通过记录更多的信息，来让更多的情况提前结束，参考 [这里](https://leetcode.com/problems/remove-invalid-parentheses/discuss/75038/Evolve-from-intuitive-solution-to-optimal-a-review-of-all-solutions)。

因为我们考虑的是删除最少的括号数，我们可以在深度优先遍历之前记录需要删除的左括号的个数和右括号的个数，遍历过程中如果删除的超过了需要删除的括号个数，就可以直接结束。

可以参考下边的代码，大部分代码没有改变，函数添加了两个参数来记录需要删除的左括号的个数和右括号的个数。

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function (s) {
  let res = [];
  let rmLeft = 0; //需要删除的左括号个数
  let rmRight = 0; //需要删除的右括号个数
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      rmLeft++;
    } else if (s[i] === ')') {
      if (rmLeft > 0) {
        rmLeft--;
      } else {
        rmRight++;
      }
    }
  }
  removeInvalidParenthesesHelper(s, 0, s.length, 0, '', res, rmLeft, rmRight);
  //去重
  return [...new Set(res)];
};

/**
 *
 * @param {string 原字符串} s
 * @param {number 当前考虑的字符} start
 * @param {number s 的长度} end
 * @param {number 记录左括号和右括号的情况} count
 * @param {string 遍历的路径字符串} temp
 * @param {string[] 保存最终的结果} res
 * @param {number 当前需要删除的左括号数量} rmLeft
 * @param {number 当前需要删除的右括号数量} rmRight
 */
function removeInvalidParenthesesHelper(
  s,
  start,
  end,
  count,
  temp,
  res,
  rmLeft,
  rmRight
) {
  if (count < 0 || rmLeft < 0 || rmRight < 0) {
    return;
  }
  //到达结尾
  if (start === end) {
    if (count === 0 && rmLeft === 0 && rmRight === 0) {
      res.push(temp);
    }
    return;
  }
  //添加当前字符
  if (s[start] === '(') {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count + 1,
      temp + '(',
      res,
      rmLeft,
      rmRight
    );
  } else if (s[start] === ')') {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count - 1,
      temp + ')',
      res,
      rmLeft,
      rmRight
    );
  } else {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count,
      temp + s.charAt(start),
      res,
      rmLeft,
      rmRight
    );
  }

  //删除当前字符, 更新 rmLeft 或者 rmRight
  if (s[start] === '(') {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count,
      temp,
      res,
      rmLeft - 1,
      rmRight
    );
  } else if (s[start] === ')') {
    removeInvalidParenthesesHelper(
      s,
      start + 1,
      end,
      count,
      temp,
      res,
      rmLeft,
      rmRight - 1
    );
  }
}
```

# 解法二 BFS

参考 [这里](https://leetcode.com/problems/remove-invalid-parentheses/discuss/75032/Share-my-Java-BFS-solution)。

解法一通过的是 `DFS`，我们也可以通过广度优先遍历。

思想很简单，先判断整个字符串是否合法， 如果合法的话就将其加入到结果中。否则的话，进行下一步。

只删掉 `1` 个括号，考虑所有的删除情况，然后判断剩下的字符串是否合法，如果合法的话就将其加入到结果中。否则的话，进行下一步。

只删掉 `2` 个括号，考虑所有的删除情况，然后判断剩下的字符串是否合法，如果合法的话就将其加入到结果中。否则的话，进行下一步。

只删掉 `3` 个括号，考虑所有的删除情况，然后判断剩下的字符串是否合法，如果合法的话就将其加入到结果中。否则的话，进行下一步。

...

因为我们考虑删除最少的括号数，如果上边某一步出现了合法情况，后边的步骤就不用进行了。

同样要解决重复的问题，除了解法一在最后返回前用 `set` 去重。这里我们也可以在过程中使用一个 `set` ，在加入队列之前判断一下是否重复。

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function (s) {
  let res = [];
  let queue = [];
  let visited = new Set();

  queue.push(s);

  while (true) {
    let size = queue.length;
    //考虑当前层
    for (let i = 0; i < size; i++) {
      s = queue.shift();
      if (isVaild(s)) {
        res.push(s);
      } else if (res.length == 0) {
        //生成下一层, 原来的基础上再多删除一个括号
        for (let removei = 0; removei < s.length; removei++) {
          if (s[removei] == '(' || s[removei] === ')') {
            let nexts = s.substring(0, removei) + s.substring(removei + 1);
            //防止重复
            if (!visited.has(nexts)) {
              queue.push(nexts);
              visited.add(nexts);
            }
          }
        }
      }
    }
    //出现了合法字符串，终止循环
    if (res.length > 0) {
      break;
    }
  }
  return res;
};

function isVaild(s) {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      count++;
    } else if (s[i] === ')') {
      count--;
    }
    if (count < 0) {
      return false;
    }
  }
  return count === 0;
}
```

上边使用了 `set` 来防止重复，下边考虑不用 `set` 怎么防止重复，参考 [这里](https://leetcode.com/problems/remove-invalid-parentheses/discuss/75038/Evolve-from-intuitive-solution-to-optimal-a-review-of-all-solutions)。

之所以产生重复，有两种情况。

第一种情况是有连续括号的时候，比如 `(()`，删除第一个括号和第二个括号都会产生 `()`。

解决方案的话，当出现连续括号的时候我们只删连续括号中的第一个。

第二种情况，当删除第 `i` 个括号后，假设后边删除了第 `j` 个括号。

也有可能开始的时候删了第 `j` 个括号，后边又去删了第 `i` 个括号。

举个例子 `(()(()`，删除路径可能是下边的两种情况。

`(()(()` -> `()(()` -> `()()` 

`(()(()` -> `(()()` -> `()()` 

两种删除路径出现了重复的情况，解法方案的话，我们可以规定删除括号的顺序。

我们记录一下删除括号的位置，第二次删除括号的位置必须是第一次删除括号的后边。

代码的话，只需要在加入队列中的元素中新增一个删除的位置。

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function (s) {
  let res = [];
  let queue = [];

  queue.push([s, 0]);
 
  while (queue.length > 0) {
    s = queue.shift();
    if (isVaild(s[0])) {
      res.push(s[0]);
    } else if (res.length == 0) {
      let removei = s[1];
      s = s[0];
      for (; removei < s.length; removei++) {
        if (
          //保证是连续括号的第一个
          (s[removei] == '(' || s[removei] === ')') &&
          (removei === 0 || s[removei - 1] != s[removei])
        ) {
          let nexts = s.substring(0, removei) + s.substring(removei + 1);
          //此时删除位置的下标 removei 就是下次删除位置的开始
          queue.push([nexts, removei]);
        }
      }
    }
  }
  return res;
};

function isVaild(s) {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      count++;
    } else if (s[i] === ')') {
      count--;
    }
    if (count < 0) {
      return false;
    }
  }
  return count === 0;
}
```

# 解法三

参考 [这里](https://leetcode.com/problems/remove-invalid-parentheses/discuss/75027/Easy-Short-Concise-and-Fast-Java-DFS-3-ms-solution)，这个解法不属于通用的解法，更像是对问题的分析，和 `DFS` 和 `BFS` 都有一些像。

我们可以从头开始遍历，用 `count` 记录括号的情况，遇到左括号加 `1` ，遇到右括号减 `1`。如果 `count` 小于 `0` 了，说明此时右括号多了，此时我们可以从前边删除一个右括号。

删除以后，剩下的字符串再进入递归按照上边的方式继续考虑。

为了避免重复，删除的时候我们需要向解法二一样，当出现连续括号的时候我们只删第一个，第二次删除括号的位置必须是第一次删除括号的后边。

举个例子。

```java
s = ()())())

( ) ( ) ) ( ) )
        ^

此时右括号多了, 从前边找右括号去删除, 两种情况

1.
(   ( ) ) ( ) )
        ^
然后上边的字符串继续遍历去删除

2.
( ) (   ) ( ) )
        ^
然后上边的字符串继续遍历去删除        
```

基于上边的想法，我们可以写出下边的代码，需要两个参数记录遍历的位置和删除的位置。

```javascript
var removeInvalidParentheses = function (s) {
  let res = [];
  removeInvalidParenthesesHelper(s, 0, 0, s.length, res);
  return res;
};

function removeInvalidParenthesesHelper(s, istart, jstart, end, res) {
  let count = 0;
  for (let i = istart; i < end; i++) {
    if (s[i] === '(') {
      count++;
    } else if (s[i] === ')') {
      count--;
    }
    if (count < 0) {
      //考虑前边所有可以删除的情况
      for (let j = jstart; j <= i; j++) {
        if (s[j] === ')' && (j === 0 || s[j - 1] !== ')')) {
          removeInvalidParenthesesHelper(
            s.substring(0, j) + s.substring(j + 1),
            i,
            j,
            end,
            res
          );
        }
      }
      //这里很重要, 考虑完所有删除的情况后结束即可
      return;
    }
  }
  res.push(s);
}
```

但上边我们只考虑了右括号多的时候，左括号多的时候并没有考虑。

很简单，我们只需要倒着遍历，然后按照上边的解法继续判断一次即可。变成遇到右括号加 `1` ，遇到左括号减 `1`。如果 `count` 小于 `0` 了，说明此时左括号多了，此时我们可以从前边删除一个左括号。

为了更少的改动上边的代码，我们可以把字符串倒转一下作为参数。

```java
/**
 * @param {string} s
 * @return {string[]}
 */ 
var removeInvalidParentheses = function (s) {
  let res = [];
  removeInvalidParenthesesHelper(s, 0, 0, s.length, res);
  return res;
};

function removeInvalidParenthesesHelper(s, istart, jstart, end, res) {
  let count = 0;
  for (let i = istart; i < end; i++) {
    if (s[i] === '(') {
      count++;
    } else if (s[i] === ')') {
      count--;
    }
    if (count < 0) {
      for (let j = jstart; j <= i; j++) {
        if (s[j] === ')' && (j === 0 || s[j - 1] !== ')')) {
          removeInvalidParenthesesHelper(
            s.substring(0, j) + s.substring(j + 1),
            i,
            j,
            end,
            res
          );
        }
      }
      return;
    }
  }
  s = s.split('').reverse().join('');
  //考虑删除左括号
  removeInvalidParenthesesHelper2(s, 0, 0, s.length, res);
}
function removeInvalidParenthesesHelper2(s, istart, jstart, end, res) {
  let count = 0;
  for (let i = istart; i < end; i++) {
    if (s[i] === ')') {
      count++;
    } else if (s[i] === '(') {
      count--;
    }
    if (count < 0) {
      for (let j = jstart; j <= i; j++) {
        if (s[j] === '(' && (j === 0 || s[j - 1] !== '(')) {
          removeInvalidParenthesesHelper2(
            s.substring(0, j) + s.substring(j + 1),
            i,
            j,
            end,
            res
          );
        }
      }
      return;
    }
  }
  //此时结果是倒着的, 逆转回来
  s = s.split('').reverse().join('');
  //加入到结果中
  res.push(s);
}
```

当然两个辅助函数非常像，只是判断左右括号那里不一样，完全可以合并起来，入口函数再添加两个参数即可。

```java
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function (s) {
  let res = [];
  removeInvalidParenthesesHelper(s, 0, 0, s.length, res, '(', ')');
  return res;
};

function removeInvalidParenthesesHelper(
  s,
  istart,
  jstart,
  end,
  res,
  left,
  right
) {
  let count = 0;
  for (let i = istart; i < end; i++) {
    if (s[i] === left) {
      count++;
    } else if (s[i] === right) {
      count--;
    }
    if (count < 0) {
      for (let j = jstart; j <= i; j++) {
        if (s[j] === right && (j === 0 || s[j - 1] !== right)) {
          removeInvalidParenthesesHelper(
            s.substring(0, j) + s.substring(j + 1),
            i,
            j,
            end,
            res,
            left,
            right
          );
        }
      }
      return;
    }
  }
  s = s.split('').reverse().join('');
  //此时多余的右括号去除结束, 还要去除多余的左括号
  if (left === '(') {
    removeInvalidParenthesesHelper(s, 0, 0, s.length, res, ')', '(');
  //此时多余的左右括号都去除结束, 添加当前结果
  } else {
    res.push(s);
  }
}
```

# 总

解法一的回溯法虽然有些暴力，但确实是有效的，写完以后可以考虑一些剪枝，优化速度。

解法二的话，`BFS` 往往和 `DFS` 共存，能 `DFS` 一般就可以通过 `BFS` 去解决。

解法三的话，就是直接从问题入手，哪个括号多了就去删哪个，多余的删除完后，就是一个合法字符串了。如果先看到的解法三，可能不是很好理解。





