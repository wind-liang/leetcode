# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/132.jpg)

和 [131 题](<https://leetcode.wang/leetcode-131-Palindrome-Partitioning.html>) 一样，可以在任意位置切割字符串，需要保证切割后的每个子串都是回文串。问最少需要切割几次。

和 [131 题](<https://leetcode.wang/leetcode-131-Palindrome-Partitioning.html>)  用相同的分析方法即可。

# 解法一 分治

大问题化小问题，利用小问题的结果，解决当前大问题。

举个例子。

```java
aabb
先考虑在第 1 个位置切割，a | abb
这样我们只需要知道 abb 的最小切割次数，然后加 1，记为 m1

aabb
再考虑在第 2 个位置切割，aa | bb
这样我们只需要知道 bb 的所有结果，然后加 1，记为 m2


aabb
再考虑在第 3 个位置切割，aab|b
因为 aab 不是回文串，所有直接跳过

aabb
再考虑在第 4 个位置切割，aabb |
因为 aabb 不是回文串，所有直接跳过

此时只需要比较 m1 和 m2 的大小，选一个较小的即可。
```

然后中间的过程求 `abb` 的最小切割次数，求 `aab` 的最小切割次数等等，就可以递归的去求。递归出口的话，如果字符串的长度为 `1`,那么它就是回文串了，最小切割次数就是 `0` 。

此外，和 [131 题](<https://leetcode.wang/leetcode-131-Palindrome-Partitioning.html>) 一样，我们用一个 `dp` 把每个子串是否是回文串，提前存起来。

```java
public int minCut(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();
    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
        }
    }
    return minCutHelper(s, 0, dp);

}

private int minCutHelper(String s, int start, boolean[][] dp) {
    //长度是 1 ，最小切割次数就是 0
    if (dp[start][s.length() - 1]) {
        return 0;
    }
    int min = Integer.MAX_VALUE;
    for (int i = start; i < s.length(); i++) {
        //只考虑回文串
        if (dp[start][i]) {
            //和之前的值比较选一个较小的
            min = Math.min(min, 1 + minCutHelper(s, i + 1, dp));
        }
    }
    return min;
}
```

意料之中，超时了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/132_2.jpg)

优化方法的话，`memoization` 技术，前边很多题都用到了，比如 [87 题](<https://leetcode.wang/leetCode-87-Scramble-String.html?h=memoization>)，[91 题](<https://leetcode.wang/leetcode-91-Decode-Ways.html?h=memoization>) 等等。就是为了解决递归过程中重复解的计算，典型例子比如斐波那契数列。用一个 `map` ，把递归过程中的结果存储起来。

```java
public int minCut(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();
    HashMap<Integer, Integer> map = new HashMap<>();
    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
        }
    }
    return minCutHelper(s, 0, dp, map);

}

private int minCutHelper(String s, int start, boolean[][] dp, HashMap<Integer, Integer> map) {

    if (map.containsKey(start)) {
        return map.get(start);
    }
    if (dp[start][s.length() - 1]) {
        return 0;
    }
    int min = Integer.MAX_VALUE;
    for (int i = start; i < s.length(); i++) {
        if (dp[start][i]) {
            min = Math.min(min, 1 + minCutHelper(s, i + 1, dp, map));
        }
    }
    map.put(start, min);
    return min;
}
```

接下来还是一样的讨论，既然用到了 `memoization` 技术，一定就可以把它改写为动态规划，让我们理一下递归的思路。

![](https://windliang.oss-cn-beijing.aliyuncs.com/132_3.jpg)

如上图，图中 `a,b,c,d` 表示括起来的字符串的最小切割次数。此时需要求问号处括起来的字符串的最小切割次数。

对应于代码中的下边这一部分了。

```java
int min = Integer.MAX_VALUE;
for (int i = start; i < s.length(); i++) {
    if (dp[start][i]) {
        min = Math.min(min, 1 + minCutHelper(s, i + 1, dp, map));
    }
}
```

如下图，先判断 `start` 到 `i` 是否是回文串，如果是的话，就用 `1 + d` 和之前的 `min` 比较。

![](https://windliang.oss-cn-beijing.aliyuncs.com/132_4.jpg)

如下图，`i` 后移，继续判断 `start` 到 `i` 是否是回文串，如果是的话，就用 `1 + c` 和之前的 `min` 比较。

![](https://windliang.oss-cn-beijing.aliyuncs.com/132_5.jpg)

然后 `i` 继续后移重复上边的过程。每次选一个较小的切割次数，最后问号处就求出来了。

接着 `start` 继续前移，重复上边的过程，直到求出 `start` 等于 `0` 的最小切割次数就是我们要找的了。

仔细考虑下上边的状态，其实状态转移方程也就出来了。

用 `dp[i]` 表示字符串 `s[i,s.lenght-1]`，也就是从 `i` 开始到末尾的字符串的最小切割次数。

求 `dp[i]` 的话，假设 `s[i,j]` 是回文串。

那么 `dp[i] = Min(min,dp[j + 1])`.

然后考虑所有的 `j`，其中 `j > i` ，找出最小的即可。

当然上边的动态规划和递归的方向是一样的，也没什么毛病。不过我们也可以逆过来，从左往右求。

![](https://windliang.oss-cn-beijing.aliyuncs.com/132_6.jpg)

这样的话，用 `dp[i]` 表示字符串 `s[0,i]`，也就是从开头到 `i` 的字符串的最小切割次数。

求 `dp[i]` 的话，假设 `s[j,i]` 是回文串。

那么 `dp[i] = Min(min,dp[j - 1])`.

然后考虑所有的 `j`，也就是 `j = i, j = i - 1, j =  i - 2, j = i - 3....` ，其中 `j < i` ，找出最小的即可。

之前代码用过 `dp` 变量了，所以用 `min` 变量表示上边的 `dp`。

```java
public int minCut(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();
    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
        }
    }
    int[] min = new int[s.length()];
    min[0] = 0;
    for (int i = 1; i < s.length(); i++) {
        int temp = Integer.MAX_VALUE; //找出最小的
        for (int j = 0; j <= i; j++) {
            if (dp[j][i]) {
                //从开头就匹配，不需要切割
                if (j == 0) {
                    temp = 0;
                    break;
                //正常的情况
                } else {
                    temp = Math.min(temp, min[j - 1] + 1);
                }
            }
        }
        min[i] = temp;

    }
    return min[s.length() - 1];
}
```

当然我们可以优化一下，注意到求 `dp` 和 求 `min` 的时候都用到了两个 `for` 循环，同样都是根据前边的状态更新当前的状态，所以我们可以把他们糅合在一起。

```java
public int minCut(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int[] min = new int[s.length()];
    min[0] = 0;
    for (int i = 1; i < s.length(); i++) {
        int temp = Integer.MAX_VALUE;
        for (int j = 0; j <= i; j++) {
            if (s.charAt(j) == s.charAt(i) && (j + 1 > i - 1 || dp[j + 1][i - 1])) {
                dp[j][i] = true;
                if (j == 0) {
                    temp = 0;
                } else {
                    temp = Math.min(temp, min[j - 1] + 1);
                }
            }
        }
        min[i] = temp;

    }
    return min[s.length() - 1];

}
```

# 解法二 回溯

回溯法其实就是一个 `dfs` 的过程。在当前字符串找到第一个回文串的位置，然后切割。剩余的字符串进入递归，继续找回文串的位置，然后切割。直到剩余的字符串本身已经是一个回文串了，就记录已经切过的次数。

可以用一个全局变量，保存已经切过的次数，然后到最后更新。

```java
public int minCut(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();

    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
        }
    }
    minCutHelper(s, 0, dp, 0);
    return min;

}

int min = Integer.MAX_VALUE;
//num 记录已经切割的次数
private void minCutHelper(String s, int start, boolean[][] dp, int num) {
    if (dp[start][s.length() - 1]) {
        min = Math.min(min, num);
        return;
    }
    //尝试当前字符串所有的切割位置
    for (int i = start; i < s.length() - 1; i++) {
        if (dp[start][i]) {
            minCutHelper(s, i + 1, dp, num + 1);
        }
    }
}

```

同样出现了超时的问题。

![](https://windliang.oss-cn-beijing.aliyuncs.com/132_2.jpg)

我们可以像解法一一样优化一下，用一个 `map` 存一下递归过程的中的解。那么问题来了，解法一是把返回值存了起来，但是这个解法并没有返回值，那么我们存什么呢？和 [115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 一样，存增量。什么意思呢？

我们知道 `minCutHelper`函数是计算了从 `start` 开始的字符串，全部切割完成后还需要切割的次数，并且当前已经切割了 `num` 次。也就是执行完下边的 `for` 循环后，如果全局变量`min` 更新了，那么多切割的次数就是 `min - num`，我们把它存起来就可以了。如果 `min` 没更新，那就不用管了。

```java
for (int i = start; i < s.length() - 1; i++) {
    if (dp[start][i]) {
        minCutHelper(s, i + 1, dp, num + 1);
    }
}
```

这样只需要在进入递归前，判断之前有没有算过从 `start` 开始的字符串所带来的增量即可。

```java
public int minCut(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();

    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
        }
    }
    HashMap<Integer, Integer> map = new HashMap<>();
    minCutHelper(s, 0, dp, 0, map);
    return min;

}

int min = Integer.MAX_VALUE;

private void minCutHelper(String s, int start, boolean[][] dp, int num, HashMap<Integer, Integer> map) {
    //直接利用之前存的增量
    if (map.containsKey(start)) {
        min = Math.min(min, num + map.get(start));
        return;
    }
    
    if (dp[start][s.length() - 1]) {
        min = Math.min(min, num);
        return;
    }
    for (int i = start; i < s.length() - 1; i++) {
        if (dp[start][i]) {
            minCutHelper(s, i + 1, dp, num + 1, map);

        }
    }
    // min 是否更新了
    if (min > num) {
        map.put(start, min - num);
    }
}
```

# 解法三

上边的解法是一些通用的思考方式，针对这道题还有一种解法，在 [这里](<https://leetcode.com/problems/palindrome-partitioning-ii/discuss/42198/My-solution-does-not-need-a-table-for-palindrome-is-it-right-It-uses-only-O(n)-space.>) 看到的，也分享一下吧。

同样也是动态规划的思路，用 `dp[i]` 表示字符串 `s[0,i]`，也就是从开头到 `i` 的字符串的最小切割次数。相比于之前更新 `dp` 的方式，这里的话把之前存储每个子串是否是回文串的空间省去了。

基本思想就是遍历每个字符，以当前字符为中心向两边扩展，判断扩展出来的是否回文串，比如下边的例子。

```java
0 1 2 3 4 5 6
c f d a d f e
      ^
      c
现在以 a 为中心向两边扩展，此时第 2 个和第 4 个字符相等，我们就可以更新
dp[4] = Min(dp[4],dp[1] + 1);
也就是在当前回文串前边切一刀

然后以 a 为中心继续向两边扩展，此时第 1 个和第 5 个字符相等，我们就可以更新
dp[5] = Min(dp[5],dp[0] + 1);
也就是在当前回文串前边切一刀

然后继续扩展，直到当前不再是回文串，把中心往后移动，考虑以 d 为中心，继续更新 dp
```

当然上边是回文串为奇数的情况，我们还需要考虑以当前字符为中心的偶数的情况，是一样的道理。

可以参考下边的代码。

```java
public int minCut(String s) {
    int[] dp = new int[s.length()];
    int n = s.length();
    //假设没有任何的回文串，初始化 dp
    for (int i = 0; i < n; i++) {
        dp[i] = i;
    }

    // 考虑每个中心
    for (int i = 0; i < s.length(); i++) {
        // j 表示某一个方向扩展的个数
        int j = 0;
        // 考虑奇数的情况
        while (true) {
            if (i - j < 0 || i + j > n - 1) {
                break;
            }
            if (s.charAt(i - j) == s.charAt(i + j)) {
                if (i - j == 0) {
                    dp[i + j] = 0;
                } else {
                    dp[i + j] = Math.min(dp[i + j], dp[i - j - 1] + 1);
                }

            } else {
                break;
            }
            j++;
        }

        // j 表示某一个方向扩展的个数
        j = 1;
        // 考虑偶数的情况
        while (true) {
            if (i - j + 1 < 0 || i + j > n - 1) {
                break;
            }
            if (s.charAt(i - j + 1) == s.charAt(i + j)) {
                if (i - j + 1 == 0) {
                    dp[i + j] = 0;
                } else {
                    dp[i + j] = Math.min(dp[i + j], dp[i - j + 1 - 1] + 1);
                }

            } else {
                break;
            }
            j++;
        }

    }
    return dp[n - 1];
}
```

# 总

前边的解法还是很常规，从递归到动态规划，利用分治或者回溯，以及 `memoization` 技术，经常用到了。最后一个解法，边找回文串边更新 `dp` ，从而降低了空间复杂度，也是很妙了。

