# 题目描述（中等难度）

306、Additive Number

Additive number is a string whose digits can form additive sequence.

A valid additive sequence should contain **at least** three numbers. Except for the first two numbers, each subsequent number in the sequence must be the sum of the preceding two.

Given a string containing only digits `'0'-'9'`, write a function to determine if it's an additive number.

**Note:** Numbers in the additive sequence **cannot** have leading zeros, so sequence `1, 2, 03` or `1, 02, 3` is invalid.

 

**Example 1:**

```
Input: "112358"
Output: true
Explanation: The digits can form an additive sequence: 1, 1, 2, 3, 5, 8. 
             1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8
```

**Example 2:**

```
Input: "199100199"
Output: true
Explanation: The additive sequence is: 1, 99, 100, 199. 
             1 + 99 = 100, 99 + 100 = 199
```

 

**Constraints:**

- `num` consists only of digits `'0'-'9'`.
- `1 <= num.length <= 35`

**Follow up:**
How would you handle overflow for very large input integers?

给一个字符串，判断字符串符不符合某种形式。就是从开头选两个数，它俩的和刚好是下一个数，然后第 `2` 个数和第 `3` 数字的和又是下一个数字，以此类推。

# 解法一

理解了题意的话很简单，可以勉强的归到回溯法的问题中，我们从暴力求解的角度考虑。

首先需要两个数，我们可以用两层 `for` 循环依次列举。

```javascript
//i 表示第一个数字的结尾(不包括 i)
for (let i = 1; i < num.length; i++) {
    //j 表示从 i 开始第二个数字的结尾(不包括 j)
    for (let j = i + 1; j < num.length; j++) {
        let num1 = Number(num.substring(0, i));
        let num2 = Number(num.substring(i, j));
    }
}
```

然后需要处理下特殊情况，将以 `0` 开头但不是`0`的数字去掉，比如 `023` 这种是不合法的，

```java
//i 表示第一个数字的结尾(不包括 i) 
for (let i = 1; i < num.length; i++) {
    // 0 开头, 并且当前数字不是 0
    if (num[0] === '0' && i > 1) {
        return false;
    }
    //j 表示从 i 开始第二个数字的结尾(不包括 j)
    for (let j = i + 1; j < num.length; j++) {
        // 0 开头, 并且当前数字不是 0  
        if (num[i] === '0' && j - i > 1) {
            break;
        }
        let num1 = Number(num.substring(0, i));
        let num2 = Number(num.substring(i, j));
    }
}
```

有了这两个数字，下边的就好说了。

只需要计算 `sum = num1 + num2` ，然后看 `sum` 在不在接下来的字符串中。

如果不在，那么就考虑下一个 `num1` 和 `num2` 。

如果在的话，`num1` 就更新为 `num2`，`num2` 更新为 `sum` ，有了新的 `num1`和 `num2` ，然后继续按照上边的步骤考虑。

举个例子，

```java
1 2 2 1 4 16
    ^ ^
    i j
  
num1 = 12
num2 = 2
sum = num1 + num2 = 14

接下来的数字刚好是 14, 那么就更新 num1 和 num2

num1 = num2 = 2
num2 = sum = 14
    
然后继续判断即可。
```

代码的话，我们可以写成递归的形式。

```javascript
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function (num) {
    if (num.length === 0) {
        return true;
    }
    for (let i = 1; i < num.length; i++) {
        if (num[0] === '0' && i > 1) {
            return false;
        }
        for (let j = i + 1; j < num.length; j++) {
            if (num[i] === '0' && j - i > 1) {
                break;
            }
            let num1 = Number(num.substring(0, i));
            let num2 = Number(num.substring(i, j));
            if (isAdditiveNumberHelper(num.substring(j), num1, num2)) {
                return true;
            }
        }
    }
    return false;
};

function isAdditiveNumberHelper(num, num1, num2) {
    if (num.length === 0) {
        return true;
    }
    //依次列举数字，判断是否等于 num1 + num2
    for (let i = 1; i <= num.length; i++) {
        //不考虑以 0 开头的数字
        if (num[0] === '0' && i > 1) {
            return false;
        }
        let sum = Number(num.substring(0, i));
        if (num1 + num2 === sum) {
            //传递剩下的字符串以及新的 num1 和 num2
            return isAdditiveNumberHelper(num.substring(i), num2, sum);
            //此时大于了 num1 + num2, 再往后遍历只会更大, 所以直接结束
        } else if (num1 + num2 < sum) {
            break;
        }
    }
    return false;
}
```

主要思想就是上边的了，看了 [这里](https://leetcode.com/problems/additive-number/discuss/75567/Java-Recursive-and-Iterative-Solutions) 的分析，代码的话，可以简单的优化下。

第一点，如果两个数的位数分别是 `a` 位和 `b` 位，`a >= b`，那么它俩相加得到的和至少是 `a` 位。比如 `100 + 99` 得到 `199`，依旧是三位数。

所以我们的 `num1` 和 `num2` 其中的一个数的位数一定不能大于等于字符串总长度的一半，不然的话剩下的字符串一定不等于 `num1` 和 `num2` 的和，因为剩下的长度不够了。

第二点，上边的代码中 `isAdditiveNumberHelper` 函数，略微写的复杂了些，我们可以直接利用 `String` 的 `startsWith` 函数，判断 `num1 + num2 ` 是不是字符串的开头即可。

基于上边两点，优化后的代码如下。

```javascript
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function (num) {
    if (num.length === 0) {
        return true;
    }
    //这里取了等号，是因为长度是奇数的时候，除以二是向下取整
    for (let i = 1; i <= num.length / 2; i++) {
        if (num[0] === '0' && i > 1) {
            return false;
        }
        for (let j = i + 1; j < num.length; j++) {
            if (num[i] === '0' && j - i > 1 || (j - i) > num.length / 2) {
                break;
            }
            let num1 = Number(num.substring(0, i));
            let num2 = Number(num.substring(i, j));
            if (isAdditiveNumberHelper(num.substring(j), num1, num2)) {
                return true;
            }
        }
    }
    return false;
};

function isAdditiveNumberHelper(num, num1, num2) {
    if (num.length === 0) {
        return true;
    }
    return num.startsWith(num1 + num2) && isAdditiveNumberHelper(num.substring((num1+num2+'').length), num2, num1 + num2);
}
```

当然，我们最初的分析很明显是迭代的形式，我们内层也可以直接写成循环，不需要递归函数。

```javascript
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function (num) {
    if (num.length === 0) {
        return true;
    }
    for (let i = 1; i <= num.length / 2; i++) {
        if (num[0] === '0' && i > 1) {
            return false;
        }
        for (let j = i + 1; j < num.length; j++) {
            if (num[i] === '0' && j - i > 1 || (j - i) > num.length / 2) {
                break;
            }
            let num1 = Number(num.substring(0, i));
            let num2 = Number(num.substring(i, j));
            let temp = num.substring(j);
            while(temp.startsWith(num1 + num2)) {
                let n = num1;
                num1 = num2;
                num2 = num1 + n;
                temp = temp.substring((num2 + '').length);
                if (temp.length === 0) {
                    return true;
                }
            } 
        }
    }
    return false;
}; 
```

还有一个扩展，`How would you handle overflow for very large input integers?`

让我们考虑数字太大了怎么办，此时解决大数相加的问题即可，所有的操作在字符串层面上进行。参考 [第 2 题](https://leetcode.wang/leetCode-2-Add-Two-Numbers.html)。

# 总

这道题主要的想法就是列举所有情况，但总觉得先单独列举两个数字不够优雅，思考了下怎么把它合并到递归中，无果，悲伤。

上边其实是一种思路，只是在写法上可能有所不同，唯一的优化就是列举数字的时候考虑一半即可，但时间复杂度不会变化。

之所以说勉强归到回溯法，是因为遍历路径的感觉是，先选两个数，然后一路到底，失败的话不是回到上一层，而是直接回到开头，然后重新选取两个数，继续一路到底，不是典型的回溯。