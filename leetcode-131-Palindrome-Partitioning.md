# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/131.jpg)

给一个字符串，然后在任意位置切割若干次，保证切割后的每个字符串都是回文串。输出所有满足要求的切割结果。

# 解法一  分治

将大问题分解为小问题，利用小问题的结果，解决当前大问题。

这道题的话，举个例子。

```java
aabb
先考虑在第 1 个位置切割，a | abb
这样我们只需要知道 abb 的所有结果，然后在所有结果的头部把 a 加入
abb 的所有结果就是 [a b b] [a bb]
每个结果头部加入 a，就是 [a a b b] [a a bb]

aabb
再考虑在第 2 个位置切割，aa | bb
这样我们只需要知道 bb 的所有结果，然后在所有结果的头部把 aa 加入
bb 的所有结果就是 [b b] [bb]
每个结果头部加入 aa,就是 [aa b b] [aa bb]

aabb
再考虑在第 3 个位置切割，aab|b
因为 aab 不是回文串，所有直接跳过

aabb
再考虑在第 4 个位置切割，aabb |
因为 aabb 不是回文串，所有直接跳过

最后所有的结果就是所有的加起来
[a a b b] [a a bb] [aa b b] [aa bb]
```

然后中间的过程求 `abb` 的所有结果，求 `aab` 的所有结果等等，就可以递归的去求。递归出口的话，就是空串的所有子串就是一个空的`list` 即可。

```java
public List<List<String>> partition(String s) {
    return partitionHelper(s, 0);
}

private List<List<String>> partitionHelper(String s, int start) {
    //递归出口，空字符串
    if (start == s.length()) {
        List<String> list = new ArrayList<>();
        List<List<String>> ans = new ArrayList<>();
        ans.add(list);
        return ans;
    }
    List<List<String>> ans = new ArrayList<>();
    for (int i = start; i < s.length(); i++) {
        //当前切割后是回文串才考虑
        if (isPalindrome(s.substring(start, i + 1))) {
            String left = s.substring(start, i + 1);
            //遍历后边字符串的所有结果，将当前的字符串加到头部
            for (List<String> l : partitionHelper(s, i + 1)) {
                l.add(0, left);
                ans.add(l);
            }
        }

    }
    return ans;
}

private boolean isPalindrome(String s) {
    int i = 0;
    int j = s.length() - 1;
    while (i < j) {
        if (s.charAt(i) != s.charAt(j)) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}
```

分治的话，一般情况下都可以利用动态规划的思想改为迭代的形式。递归就是压栈压栈，然后到达出口就出栈出栈出栈。动态规划就可以把压栈的过程省去，直接从递归出口往回考虑。之前做过很多题了，可以参考 [77题](<https://leetcode.wang/leetCode-77-Combinations.html>)、[91 题](<https://leetcode.wang/leetcode-91-Decode-Ways.html>)、[115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 等等，都是一样的思想。这道题修改的话，看完解法二的优化后可以参考 [这里](<https://leetcode.com/problems/palindrome-partitioning/discuss/41974/My-Java-DP-only-solution-without-recursion.-O(n2)>) 的代码。

# 解法二 分治优化

每次判断一个字符串是否是回文串的时候，我们都会调用 `isPalindrome` 判断。这就会造成一个问题，比如字符串 `abbbba`，期间我们肯定会判断 `bbbb` 是不是回文串，也会判断 `abbbba` 是不是回文串。判断 `abbbba` 是不是回文串的时候，在 `isPalindrome`  中依旧会判断中间的 `bbbb`  部分。而其实如果我们已经知道了 `bbbb` 是回文串，只需要判断 `abbbba` 的开头和末尾字符是否相等即可。

所以我们为了避免一些重复判断，可以用动态规划的方法，把所有字符是否是回文串提前存起来。

对于字符串 `s`。

用 `dp[i][j]` 表示 `s[i，j]` 是否是回文串。

然后有 `dp[i][j] = s[i] == s[j] && dp[i+1][j-1]`  。

我们只需要两层 `for` 循环，从每个下标开始，考虑所有长度的子串即可。

```java
boolean[][] dp = new boolean[s.length()][s.length()];
int length = s.length();
//考虑所有长度的子串
for (int len = 1; len <= length; len++) {
    //从每个下标开始
    for (int i = 0; i <= s.length() - len; i++) {
        int j = i + len - 1;
        dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
    }
}
```

因为要保证 `dp[i + 1][j - 1]` 中 `i + 1 <= j - 1`，

```java
i + 1 <= j - 1
把 j = i + len - 1 代入上式
i + 1 <= i + len - 1 - 1
化简得
len >= 3
```

所以为了保证正确，多加了 `len < 3` 的条件。也就意味着长度是 `1` 和 `2` 的时候，我们只需要判断 `s[i] == s[j]`。

然后把 `dp` 传入到递归函数中即可。

```java
public List<List<String>> partition(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();
    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len < 3 || dp[i + 1][j - 1]);
        }
    }
    return partitionHelper(s, 0, dp);
}

private List<List<String>> partitionHelper(String s, int start, boolean[][] dp) {
    if (start == s.length()) {
        List<String> list = new ArrayList<>();
        List<List<String>> ans = new ArrayList<>();
        ans.add(list);
        return ans;
    }
    List<List<String>> ans = new ArrayList<>();
    for (int i = start; i < s.length(); i++) {
        if (dp[start][i]) {
            String left = s.substring(start, i + 1);
            for (List<String> l : partitionHelper(s, i + 1, dp)) {
                l.add(0, left);
                ans.add(l);
            }
        }

    }
    return ans;
}
```

# 解法三 回溯

[115 题](<https://leetcode.wang/leetcode-115-Distinct-Subsequences.html>) 中考虑了分治、回溯、动态规划，这道题同样可以用回溯法。

回溯法其实就是一个 `dfs` 的过程，同样举个例子。

```java
aabb
先考虑在第 1 个位置切割，a | abb
把 a 加入到结果中 [a]

然后考虑 abb
先考虑在第 1 个位置切割，a | bb
把 a  加入到结果中 [a a]

然后考虑 bb
先考虑在第 1 个位置切割，b | b
把 b 加入到结果中 [a a b] 

然后考虑 b
先考虑在第 1 个位置切割，b | 
把 b 加入到结果中 [a a b b] 

然后考虑空串
把结果加到最终结果中 [[a a b b]]

回溯到上一层 
考虑 bb
考虑在第 2 个位置切割，bb |
把 bb 加入到结果中 [a a bb] 

然后考虑 空串
把结果加到最终结果中 [[a a b b] [a a bb]]

然后继续回溯
```

可以看做下边的图做 `dfs` ，而每一层其实就是当前字符串所有可能的回文子串。

![](https://windliang.oss-cn-beijing.aliyuncs.com/131_2.jpg)

就是很经典的回溯法，一个 `for` 循环，添加元素，递归，删除元素。这里判断是否是回文串，我们就直接用 `dp` 数组。

```java
public List<List<String>> partition(String s) {
    boolean[][] dp = new boolean[s.length()][s.length()];
    int length = s.length();
    for (int len = 1; len <= length; len++) {
        for (int i = 0; i <= s.length() - len; i++) {
            dp[i][i + len - 1] = s.charAt(i) == s.charAt(i + len - 1) && (len < 3 || dp[i + 1][i + len - 2]);
        }
    }
    List<List<String>> ans = new ArrayList<>();
    partitionHelper(s, 0, dp, new ArrayList<>(), ans);
    return ans;
}

private void partitionHelper(String s, int start, boolean[][] dp, List<String> temp, List<List<String>> res) {
    //到了空串就加到最终的结果中
    if (start == s.length()) {
        res.add(new ArrayList<>(temp));
    }
    //在不同位置切割
    for (int i = start; i < s.length(); i++) {
        //如果是回文串就加到结果中
        if (dp[start][i]) {
            String left = s.substring(start, i + 1);
            temp.add(left);
            partitionHelper(s, i + 1, dp, temp, res);
            temp.remove(temp.size() - 1);
        }

    }
}

```

# 总

这道题没有什么新内容了，就是分治、回溯、动态规划，很常规的题目了。

