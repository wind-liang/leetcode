# 题目描述（简单难度）

292、Nim Game

You are playing the following Nim Game with your friend: There is a heap of stones on the table, each time one of you take turns to remove 1 to 3 stones. The one who removes the last stone will be the winner. You will take the first turn to remove the stones.

Both of you are very clever and have optimal strategies for the game. Write a function to determine whether you can win the game given the number of stones in the heap.

**Example:**

```
Input: 4
Output: false 
Explanation: If there are 4 stones in the heap, then you will never win the game;
             No matter 1, 2, or 3 stones you remove, the last stone will always be 
             removed by your friend.
```

有一堆石子，你和另一个人在玩游戏，每人轮流拿走 `1, 2` 或者 `3` 个石子，最后的石子被谁拿走，谁就是赢家。从你开始拿石子。

# 解法一

遇到这种题，想想就很复杂，直接递归来解。

只需要模拟拿石子过程，首先定义一些初始情况。

当没有石子的话，也就意味着最后的石子被对方拿走了，也就是你输了。

当石子数剩下 `1, 2, 3` 个的时候，你可以一次性都拿走，也就是你赢了。

```java
if (n == 0) {
    return false;
}
if (n < 4) {
    return true;
}
```

然后我们考虑所有的情况。

你拿走 `1` 个石子，然后不论对方从剩下的石子中拿走 `1` 个，`2` 个，还是 `3` 个，判断一下剩下的石子你是不是有稳赢的策略。

如果上边不行的话，你就拿走 `2` 个石子，然后再判断不论对方从剩下的石子拿走 `1` 个，`2` 个，还是`3` 个，剩下的石子你是不是都有稳赢的策略。

如果上边还不行的话，你就拿走 `3` 个石子，然后再判断不论对方从剩下的石子拿走 `1` 个，`2` 个，还是`3` 个，剩下的石子你是不是都有稳赢的策略。

如果上边通通不行，那就是你输了。

```java
public boolean canWinNim1(int n) {
    if (n == 0) {
        return false;
    }
    if (n < 4) {
        return true;
    }
    //依次尝试拿走 1,2,3 个
    for (int i = 1; i <= 3; i++) {
        //对方拿走 1 个，2 个，3 个, 你都有稳赢的策略
        if (canWinNim(n - i - 1) && canWinNim(n - i - 2) && canWinNim(n - i - 3)) {
            return true;
        }
    }
    //否则的话就是你输了
    return false;
}
```

但会发现超时了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/292.jpg)

但是问题不大，之前的题已经遇到过无数次这种情况了，只需要通过 `memoization` 技术，利用 `map` 把过程中的解保存起来就可以了。

```java
HashMap<Integer, Boolean> map = new HashMap<>();
public boolean canWinNim(int n) {
    if (map.containsKey(n)) {
        return map.get(n);
    }
    if (n <= 0) {
        return false;
    }
    if (n < 4) {
        return true;
    }
    for (int i = 1; i <= 3; i++) {
        if (canWinNim(n - i - 1) && canWinNim(n - i - 2) && canWinNim(n - i - 3)) {
            map.put(n, true);
            return true;
        }
    }
    map.put(n, false);
    return false;
}
```

然后竟然遇到了 `Runtime Error`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/292_2.jpg)

虽然这个问题不常见，但依旧是问题不大，无非就是因为递归需要压栈，然后压的太多了，造成了栈溢出。那我们用动态规划呀，初始条件和状态转移方程都是现成的，和递归简直一模一样，不信你看下边的代码。

```java
public boolean canWinNim(int n) {
    if(n == 0){
        return false;
    }
    if(n < 4){
        return true;
    }
    boolean[] dp = new boolean[n + 1];
    dp[0] = false;
    dp[1] = true;
    dp[2] = true;
    dp[3] = true;
    //从下往上走
    for (int num = 4; num <= n; num++) {
        for (int i = 1; i <= 3; i++) {
            if (dp[num - i - 1] && dp[num - i - 2] && dp[num - i - 3]) {
                dp[num] = true;
                break;
            }
        } 
    }
    return dp[n];
} 
```

上边值得注意的地方是，我们给 `dp[num]` 只赋过 `true`。因为 `dp` 数组的默认值是 `false` ，所以如果它是 `false` 就不用管了。

但是竟然还是报错了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/292_3.jpg)

超出内存限制？？？我觉得它在耍我，但事实确实如此。因为当 `n` 太大的时候，`dp` 一次性不能申请这么大的空间。

但是不要慌张，如果前边的题中动态规划做的很多的话，应该还记得动态规划的最后一步，空间复杂度的优化。

因为我们注意到，当求 `dp[n]` 的时候，我们最远也就用到 `dp[n - 6]`，换言之，我们只需要 `dp[n - 6]`， `dp[n - 5]`， `dp[n - 4]`， `dp[n - 3]`， `dp[n - 2]`， `dp[n - 1]`这 `6` 个数，再往前我们就不需要了。

所以我们并不需要大小为 `n` 的数组，大小为 `6` 的数组就足够了。此时数组的下标就是 `0` 到 `5` ，所以给数组更新的时候，我们只需要对 `6` 取余即可。

```java
public boolean canWinNim(int n) {
    if (n == 0) {
        return false;
    }
    if (n < 4) {
        return true;
    }
    boolean[] dp = new boolean[6];
    dp[0] = false;
    dp[1] = true;
    dp[2] = true;
    dp[3] = true;
    for (int num = 4; num <= n; num++) {
        int i = 1;
        for (; i <= 3; i++) {
            if (dp[(num - i - 1) % 6] && dp[(num - i - 2) % 6] && dp[(num - i - 3) % 6]){
                dp[num % 6] = true;
                break;
            }
        }
        if(i == 4){
            dp[num % 6] = false;
        }
    }
    return dp[n % 6];
}
```

有一点需要注意，之前提到「因为 `dp` 数组的默认值是 `false` ，所以如果它是 `false` 就不用管了」。但这里因为数组在循环使用，所以如果内层的 `for` 循环尝试了所有情况都不行的话，我们要将当前值置为 `false` ，因为它之前可能是 `true`。

当我准备收工的时候。

![](https://windliang.oss-cn-beijing.aliyuncs.com/292_4.jpg)

又看到了这个熟悉的错误，此时我想到了一首诗。

假如生活欺骗了你，

不要悲伤，不要心急！

忧郁的日子里须要镇静：

相信吧，快乐的日子将会来临！

心儿永远向往着未来；

现在却常是忧郁。

一切都是瞬息，一切都将会过去；

而那过去了的，就会成为亲切的怀恋。

# 解法二

上边优化的已经到头了，但我们不能放弃。经过前边题的锤炼，直觉告诉我，最后的答案一定是有规律的，先输它 `100` 个试试。

```java
for (int i = 1; i <= 100; i++) {
    System.out.print(canWinNim(i) + " ");
}
```

看一下结果。

```java
true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false true true true false
```

惊不惊喜，意不意外。果然是周期性的，`3` 个 `true` ，`1` 个 `false` ，由此往复。

代码就很好写了，如果是 `4` 的倍数就是 `false` ，否则就是 `true` 。

```java
public boolean canWinNim(int n) {
    if (n % 4 == 0) {
        return false;
    } else {
        return true;
    }
}
```

或者更简洁些。

```java
public boolean canWinNim(int n) {
    return n % 4 != 0;
}
```

或者利用二进制判断是不是 `4` 的倍数，只需要通过和 `3` （二进制 `11`）进行相与，如果是 `4` 的倍数，那么结果一定是 `0`。

为什么呢？[这里](https://www.cnblogs.com/superbi/archive/2013/02/28/2936334.html) 有个解释。

```java
算法如下：
　　x&3==0，则是4的倍数。
原理：
先来看一组数字的二进制表示
　　4　　　　0100
　　8　　　　1000
   12      1100
　　16     10000
　　20     10100
```


由此可见 `4` 的倍数的二进制表示的后 `2` 为一定为 `0`。

从另外一个角度来看，`4` 的二进制表示是 `0100`，任何 `4` 的倍数一定是在此基础上增加 `n` 个 `0100` 
由此也可得 `4` 的倍数的二进制表示的后 `2` 为一定为 `0`。

所以代码也可以这样写。

```java
public boolean canWinNim(int n) {
    return (n & 3) != 0;
}
```

上边有很多写法，但我看到下边的输出时，第一反应并不是判断 `4` 的倍数。

```java
true true true false true true true false true true true false
```

当时我的第一反应是，肯定需要把 `n`对 `4` 求余。结果的话对应如下

```java
n    1    2    3     4    5    6    7     8    ...
    true true true false true true true false  ...
n%4  1    2    3     0    1    2    3     0    ...  
```

此时余数如果是 `1` 到 `3`  那么结果就是 `true` 。为了方便，我先把 `n` 减  `1`，然后才求余。这样的话只要余数小于 `3` ，那么就是 `true`。

```java
n        1    2    3    4     5    6    7    8     ...
n-1      0    1    2    3     4    5    6    7     ...
        true true true false true true true false  ...
(n-1)%4  0    1    2    3     0    1    2    3     ...  
```

代码的话就可以写成下边的样子。

```java
public boolean canWinNim(int n) {
    if ((n - 1) % 4 < 3) {
        return true;
    } else {
        return false;
    }
}
```

看起来有点多余，我也不知道为什么第一反应是这个，可能受前边题的影响，对这个减 `1` 再求余的技巧记忆太深刻了吧，哈哈。

题目 `AC` 了，但是是为什么呢？为什么会有这个规律。

其实也不难理解，因为如果是 `4` 个石子，谁先手就谁输。因为你一次性最多拿 `3` 个，最后一个石子一定被对方拿走。

然后我们可以把石子，`4` 个，`4` 个分成一个个小堆。然后有 `4` 种情况。

全是 `4` 个一小堆。

```java
X X     X X     X X     X X
X X     X X     X X     X X 
```

余下 `1` 个。

```java
X X     X X     X X     X X     X 
X X     X X     X X     X X     
```

余下 `2` 个。

```java
X X     X X     X X     X X     X X         
X X     X X     X X     X X      
```

余下 `3` 个。

```java
X X     X X     X X     X X     X X         
X X     X X     X X     X X     X 
```

只要有余下的，因为是你先手，你只需要把余下的全拿走。然后对方从每个小堆里拿石子，你只需要把每个小堆里剩下的拿走即可。最后一定是你拿走最后一个石子。

如果非要说，如果对方从多个小堆里拿石子呢？他拿完以后我们就把每个小堆再还原成 `4` 个，`4` 个的，然后把不是 `4` 个的那堆拿走。

其实上边只是一个抽象出的模型，实际上，当第一步我们把余下的拿走以后。之后如果对方拿 `x` 个，我们只需要拿 `4 - x` 个即可。

而如果没有余下的，那如果对方知道这个技巧的话，一定是对方赢了。



# 总

这个题，emm，有点意思。

解法一真的是把我的毕生所学都用上了，竟然没有 `AC`。

解法二的话，如果不把结果都输出然后找规律，其实也可能想到。关键点就是分堆，想到这个点，很快就能找到答案。为什么这么说呢？

因为解法一尝试完所有可能后，备受打击，我就去睡觉了，醒来的时候又想了想，突然就想到了分堆。开始想了每堆分 `5` 个，发现不行，`3` 个呢？为什么不是 `2` 个呢，最后也大致推出了是 `4`个，然后起来就把结果输出来，验证了一下自己的想法。

总之，当正常的编程思路解不了的问题的时候，找找规律也算是一条路，哈哈。



