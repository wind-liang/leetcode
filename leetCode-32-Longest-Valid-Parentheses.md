# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/32.jpg)

给一个一堆括号的字符串，然后返回最长的合法的括号的长度。关于括号的问题，我们在 [20](https://leetcode.windliang.cc/leetCode-20-Valid%20Parentheses.html) 题和 [22](https://leetcode.windliang.cc/leetCode-22-Generate-Parentheses.html) 题也讨论过。

# 解法一 暴力解法

列举所有的字符串，然后判断每个字符串是不是符合。当然这里可以做个优化就是，因为合法字符串一定是偶数个，所以可以只列举偶数长度的字符串。列举从 0 开始的，长度是 2、4、6 ……的字符串，列举下标从 1 开始的，长度是 2、4、6 ……的字符串，然后循环下去。当然判断字符串是否符合，利用栈来实现，在[之前](https://leetcode.windliang.cc/leetCode-20-Valid%20Parentheses.html)已经讨论过了。

```java
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<Character>();
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            stack.push('(');
        } else if (!stack.empty() && stack.peek() == '(') {
            stack.pop();
        } else {
            return false;
        }
    }
    return stack.empty();
}
public int longestValidParentheses(String s) {
    int maxlen = 0;
    for (int i = 0; i < s.length(); i++) {
        for (int j = i + 2; j <= s.length(); j+=2) {
            if (isValid(s.substring(i, j))) {
                maxlen = Math.max(maxlen, j - i);
            }
        }
    }
    return maxlen;
}
```

时间复杂度: 列举字符串是 O（n²），判断是否是合法序列是 O（n），所以总共是 O（n³）。

空间复杂度：O（n），每次判断的时候，栈的大小。

这个算法，leetCode 会报时间超时。

# 解法二 暴力破解优化

解法一中，我们会做很多重复的判断，例如类似于这样的，（）（）（），从下标 0 开始，我们先判断长度为 2 的是否是合法序列。然后再判断长度是 4 的字符串是否符合，但会从下标 0 开始判断。判断长度为 6 的字符串的时候，依旧从 0 开始，但其实之前已经确认前 4 个已经组成了合法序列，所以我们其实从下标 4 开始判断就可以了。

基于此，我们可以换一个思路，我们判断从每个位置开始的最长合法子串是多长即可。而判断是否是合法子串，我们不用栈，而是用一个变量记录当前的括号情况，遇到左括号加 1，遇到右括号减 1，如果变成 0 ，我们就更新下最长合法子串。

```java
public int longestValidParentheses(String s) {
    int count = 0;
    int max = 0;
    for (int i = 0; i < s.length(); i++) {
        count = 0;
        for (int j = i; j < s.length(); j++) {
            if (s.charAt(j) == '(') {
                count++;
            } else {
                count--;
            }
            //count < 0 说明右括号多了，此时无论后边是什么，一定是非法字符串了，所以可以提前结束循环
            if (count < 0) {
                break;

            }
            //当前是合法序列，更新最长长度
            if (count == 0) {
                if (j - i + 1 > max) {
                    max = j - i + 1;
                }
            }
        }
    }
    return max;
}
```

时间复杂度：O（n²）。

空间复杂度：O（1）。

# 解法三 动态规划

首先定义动态规划的数组代表什么

dp [ i ] 代表以下标 i 结尾的合法序列的最长长度，例如下图

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_1.jpg)

下标 1 结尾的最长合法字符串长度是 2，下标 3 结尾的最长字符串是 str [ 0 , 3 ]，长度是 4 。

我们来分析下 dp 的规律。

首先我们初始化所有的 dp 都等于零。

以左括号结尾的字符串一定是非法序列，所以 dp 是零，不用更改。

以右括号结尾的字符串分两种情况。

* 右括号前边是 ( ，类似于 ……（）。

  dp [ i ] = dp [ i - 2] + 2 （前一个合法序列的长度，加上当前新增的长度 2）

  类似于上图中 index = 3 的时候的情况。

  dp [ 3 ] = dp [ 3 - 2 ] + 2 = dp [ 1 ] +  2 = 2 + 2 = 4

* 右括号前边是 )，类似于 ……））。

  此时我们需要判断 i - dp[i - 1] - 1 （前一个合法序列的前边一个位置） 是不是左括号。

  例如上图的 index = 7 的时候，此时 index - 1 也是右括号，我们需要知道 i - dp[i - 1] - 1 = 7 - dp [ 6 ] - 1 = 4 位置的括号的情况。

  而刚好 index = 4 的位置是左括号，此时 dp [ i ] =  dp [ i - 1 ] + dp [ i - dp [ i - 1] - 2 ] + 2 （当前位置的前一个合法序列的长度，加上匹配的左括号前边的合法序列的长度，加上新增的长度 2），也就是 dp [ 7 ] = dp [ 7 - 1 ] + dp [ 7 - dp [ 7 - 1] - 2 ] + 2 = dp [ 6 ] + dp [7 - 2 - 2] + 2 = 2 + 4 + 2 = 8。

  如果 index = 4 不是左括号，那么此时位置 7 的右括号没有匹配的左括号，所以 dp [ 7 ] = 0 ，不需要更新。

上边的分析可以结合图看一下，可以更好的理解，下边看下代码。

```java
public int longestValidParentheses(String s) {
    int maxans = 0;
    int dp[] = new int[s.length()];
    for (int i = 1; i < s.length(); i++) {
        if (s.charAt(i) == ')') {
            //右括号前边是左括号
            if (s.charAt(i - 1) == '(') {
                dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
            //右括号前边是右括号，并且除去前边的合法序列的前边是左括号
            } else if (i - dp[i - 1] > 0 && s.charAt(i - dp[i - 1] - 1) == '(') {
                dp[i] = dp[i - 1] + ((i - dp[i - 1]) >= 2 ? dp[i - dp[i - 1] - 2] : 0) + 2;
            }
            maxans = Math.max(maxans, dp[i]);
        }
    }
    return maxans;
}
```

时间复杂度：遍历了一次，O（n）。

空间复杂度：O（n）。

# 解法四 使用栈

从左到右扫描字符串，栈顶保存当前扫描的时候，合法序列前的一个位置位置下标是多少，啥意思嘞？

我们扫描到左括号，就将当前位置入栈。

扫描到右括号，就将栈顶出栈（代表栈顶的左括号匹配到了右括号），然后分两种情况。

* 栈不空，那么就用当前的位置减去栈顶的存的位置，然后就得到当前合法序列的长度，然后更新一下最长长度。

* 栈是空的，说明之前没有与之匹配的左括号，那么就将当前的位置入栈。

看下图示，更好的理解一下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_9.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_3.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_4.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_5.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_6.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_7.jpg)

![](https://windliang.oss-cn-beijing.aliyuncs.com/32_8.jpg)

再看下代码

```java
public int longestValidParentheses(String s) {
    int maxans = 0;
    Stack<Integer> stack = new Stack<>();
    stack.push(-1);
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.empty()) {
                stack.push(i);
            } else {
                maxans = Math.max(maxans, i - stack.peek());
            }
        }
    }
    return maxans;
}
```

时间复杂度： O（n）。

空间复杂度：O（n）。

# 解法五 神奇解法

保持时间复杂度是 O（n），将空间复杂度优化到了 O（1），它的动机是怎么想到的没有理出来，就介绍下它的想法吧。

从左到右扫描，用两个变量 left 和 right 保存的当前的左括号和右括号的个数，都初始化为 0 。

* 如果左括号个数等于右括号个数了，那么就更新合法序列的最长长度。
* 如果左括号个数大于右括号个数了，那么就接着向右边扫描。
* 如果左括号数目小于右括号个数了，那么后边无论是什么，此时都不可能是合法序列了，此时 left 和 right 归 0，然后接着扫描。

从左到右扫描完毕后，同样的方法从右到左再来一次，因为类似这样的情况 (  (   (   )  )  ，如果从左到右扫描到最后，left = 3，right = 2，期间不会出现 left == right。但是如果从右向左扫描，扫描到倒数第二个位置的时候，就会出现 left = 2，right = 2 ，就会得到一种合法序列。

```java
public int longestValidParentheses(String s) {
    int left = 0, right = 0, maxlength = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            left++;
        } else {
            right++;
        }
        if (left == right) {
            maxlength = Math.max(maxlength, 2 * right);
        } else if (right >= left) {
            left = right = 0;
        }
    }
    left = right = 0;
    for (int i = s.length() - 1; i >= 0; i--) {
        if (s.charAt(i) == '(') {
            left++;
        } else {
            right++;
        }
        if (left == right) {
            maxlength = Math.max(maxlength, 2 * left);
        } else if (left >= right) {
            left = right = 0;
        }
    }
    return maxlength;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

这几种算法，暴力破解和动态规划我觉得想的话，还是能分析出来的话，最后两种算法感觉是去挖掘题的本质得到的算法，普适性不是很强。但最后一种算法，从左到右，从右到左，是真的强。