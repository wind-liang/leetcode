# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/97.jpg)

在两个字符串 s1 和 s2 中依次取字母，问是否可以组成 S3。什么意思呢？比如 s1 = abc , s2 = de，s3 = abdce。

s1 取 1 个 字母得到 a，s1 再取个字母得到 ab，s2 取个字母得到 abd， s1 取 1 个 字母得到  abdc， s2 取 1 个 字母得到  abdce，然后就得到了 s3，所以返回 true。

# 解法一 回溯法

如果我们简化下问题，如果 s1 和 s2 中不含有重复的字母，比如 s1 = abc，s2 = de，s3 = abdce。

这样是不是就简单多了。我们只需要三个指针，依次遍历字符串。

```java
i 和 k 的指的字母相等，所以 i 后移，k 后移
a b c
^
i

d e
^
j

a b d c e
^
k

i 和 k 的指的字母相等，所以 i 后移，k 后移
a b c
  ^
  i

d e
^
j

a b d c e
  ^
  k
  
j 和 k 的指的字母相等，所以 j 后移，k 后移
a b c
    ^
    i

d e
^
j

a b d c e
    ^
    k

就这样比较下去，如果 i,j,k 都成功移动到了末尾即成功。
```

但是这道题 s1 和 s2 中会有重复的字符出现，比如下边的情况

```java
a d c
  ^
  i

d e
^
j

a d c e
  ^
  k
```

此时 i 和 j 指向的字母都和 k 相等，此时该怎么办呢？

回溯法！是的，我们先尝试 i 和 k 后移，然后看能不能成功。不行的话我们再回溯回来，把 j 和 k 后移。

```java
public boolean isInterleave(String s1, String s2, String s3) {
    return getAns(s1, 0, s2, 0, s3, 0);
}

private boolean getAns(String s1, int i, String s2, int j, String s3, int k) {
    //长度不匹配直接返回 false
    if (s1.length() + s2.length() != s3.length()) {
        return false;
    }
    // i、j、k 全部达到了末尾就返回 true
    if (i == s1.length() && j == s2.length() && k == s3.length()) {
        return true;
    }
    // i 到达了末尾，直接移动 j 和 k 不停比较
    if (i == s1.length()) {
        while (j < s2.length()) {
            if (s2.charAt(j) != s3.charAt(k)) {
                return false;
            }
            j++;
            k++;
        }
        return true;
    }
    // j 到达了末尾，直接移动 i 和 k 不停比较
    if (j == s2.length()) {
        while (i < s1.length()) {
            if (s1.charAt(i) != s3.charAt(k)) {
                return false;
            }
            i++;
            k++;
        }
        return true;
    }
    //判断 i 和 k 指向的字符是否相等
    if (s1.charAt(i) == s3.charAt(k)) {
        //后移 i 和 k 继续判断，如果成功了直接返回 true
        if (getAns(s1, i + 1, s2, j, s3, k + 1)) {
            return true;
        }
    }
    //移动 i 和 k 失败，尝试移动 j 和 k
    if (s2.charAt(j) == s3.charAt(k)) {
        if (getAns(s1, i, s2, j + 1, s3, k + 1)) {
            return true;
        }
    }
    //移动 i 和 j 都失败，返回 false
    return false;
}
```
让我们优化一下，由于递归的分支，所以会造成很多重复情况的判断，所以我们用 memoization 技术，把求出的结果用 hashmap 保存起来，第二次过来的时候直接返回结果以免再次进入递归。

用 1 表示 true，0 表示 false，-1 代表还未赋值。

hashmap key 的话用字符串 i + "@" + j ，之所以中间加 "@"，是为了防止 i = 1 和 j = 22。以及 i = 12，j = 2。这样的两种情况产生的就都是 122。加上 "@" 可以区分开来。

```java
public boolean isInterleave(String s1, String s2, String s3) {
    HashMap<String, Integer> memoization = new HashMap<>();
    return getAns(s1, 0, s2, 0, s3, 0, memoization);
}

private boolean getAns(String s1, int i, String s2, int j, String s3, int k, HashMap<String, Integer> memoization) {
    if (s1.length() + s2.length() != s3.length()) {
        return false;
    }
    String key = i + "@" + j;
    if (memoization.containsKey(key)) {
        return memoization.getOrDefault(key, -1) == 1;
    }
    if (i == s1.length() && j == s2.length() && k == s3.length()) {
        memoization.put(key, 1);
        return true;
    }
    if (i == s1.length()) {
        while (j < s2.length()) {
            if (s2.charAt(j) != s3.charAt(k)) {
                memoization.put(key, 0);
                return false;
            }
            j++;
            k++;
        }
        memoization.put(key, 1);
        return true;
    }

    if (j == s2.length()) {
        while (i < s1.length()) {
            if (s1.charAt(i) != s3.charAt(k)) {
                memoization.put(key, 0);
                return false;
            }
            i++;
            k++;
        }
        memoization.put(key, 1);
        return true;
    }
    if (s1.charAt(i) == s3.charAt(k)) {
        if (getAns(s1, i + 1, s2, j, s3, k + 1, memoization)) {
            memoization.put(key, 1);
            return true;
        }
    }
    if (s2.charAt(j) == s3.charAt(k)) {
        if (getAns(s1, i, s2, j + 1, s3, k + 1, memoization)) {
            memoization.put(key, 1);
            return true;
        }
    }
    memoization.put(key, 0);
    return false;
}
```

# 解法二 动态规划

参考[这里](<https://leetcode.com/problems/interleaving-string/discuss/31879/My-DP-solution-in-C%2B%2B>)。

其实和递归本质上是一样的，解法一中压栈到末尾最后一个字符的时候，再次压栈，就会进入  if (i == s1.length() && j == s2.length() && k == s3.length())  这里，然后就开始一系列的出栈过程。

而动态规划就是利用一个 dp 数组去省去压栈，所谓空间换时间。这里的话，我们也不模仿递归从尾部开始了，我们直接从开头开始，思想是一样的。

我们定义一个 boolean 二维数组 dp \[ i \] \[ j \] 来表示 s1[ 0, i ) 和 s2 [ 0, j ） 组合后能否构成 s3 [ 0, i + j )，注意不包括右边界，主要是为了考虑开始的时候如果只取 s1，那么 s2 就是空串，这样的话  dp \[ i \] \[ 0 \] 就能表示 s2 取空串。

状态转换方程也很好写了，如果要求 dp \[ i \] \[ j \] 。

如果 dp \[ i - 1 \] \[ j \] == true，并且 s1 [ i - 1 ] == s3 [ i + j - 1]， dp \[ i \] \[ j \] = true 。

如果 dp \[ i  \] \[ j  - 1 \] == true，并且 s2 [ j - 1 ] == s3 [ i + j - 1]， dp \[ i \] \[ j \] = true 。

否则的话，就更新为 dp \[ i \] \[ j \] = false。

如果 i 为 0，或者 j 为 0，那直接判断 s2 和 s3 对应的字母或者 s1 和 s3 对应的字母即可。

```java
public boolean isInterleave(String s1, String s2, String s3) {
    if (s1.length() + s2.length() != s3.length()) {
        return false;
    }
    boolean[][] dp = new boolean[s1.length() + 1][s2.length() + 1];
    for (int i = 0; i <= s1.length(); i++) {
        for (int j = 0; j <= s2.length(); j++) {
            if (i == 0 && j == 0) {
                dp[i][j] = true;
            } else if (i == 0) {
                dp[i][j] = dp[i][j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);
            } else if (j == 0) {
                dp[i][j] = dp[i - 1][j] && s1.charAt(i - 1) == s3.charAt(i - 1);
            } else {
                dp[i][j] = dp[i - 1][j] && s1.charAt(i - 1) == s3.charAt(i + j - 1)
                    || dp[i][j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1);
            }
        }
    }
    return dp[s1.length()][s2.length()];
}
```

然后就是老规矩了，空间复杂度的优化，例如[5题](<https://leetcode.windliang.cc/leetCode-5-Longest-Palindromic-Substring.html>)，[10题](<https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html>)，[53题](<https://leetcode.windliang.cc/leetCode-53-Maximum-Subarray.html?h=%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92>)，[72题](<https://leetcode.wang/leetCode-72-Edit-Distance.html>)等等都是同样的思路。都是注意到一个特点，当更新到 dp \[ i \] \[ j \]  的时候，我们只用到 dp \[ i - 1 \] \[ j \] ，即上一层的数据，再之前的数据就没有用了。所以我们不需要二维数组，只需要一个一维数组就够了。

```java
public boolean isInterleave(String s1, String s2, String s3) {
    if (s1.length() + s2.length() != s3.length()) {
        return false;
    }
    boolean[] dp = new boolean[s2.length() + 1];
    for (int i = 0; i <= s1.length(); i++) {
        for (int j = 0; j <= s2.length(); j++) {
            if (i == 0 && j == 0) {
                dp[j] = true;
            } else if (i == 0) {
                dp[j] = dp[j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);
            } else if (j == 0) {
                dp[j] = dp[j] && s1.charAt(i - 1) == s3.charAt(i - 1);
            } else {
                dp[j] = dp[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1)
                    || dp[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1);
            }
        }
    }
    return dp[s2.length()];
}
```

# 解法三 广度优先遍历 BFS

参考[这里](<https://leetcode.com/problems/interleaving-string/discuss/31948/8ms-C%2B%2B-solution-using-BFS-with-explanation>)。我们把问题抽象一下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/97_2.jpg)

从左上角到达右下角，遍历过程加上边对应的字符，最后就可以产生 S3 了。回想一下，解法一递归的遍历过程，其实就是图的深度遍历，从 0 位置出发，一致尝试向右，不行的话就回溯，再尝试向下，然后再开始尝试向右，直到右下角。像一只贪婪的蛇，认准目标直奔而去。

而解法一开始没有优化前讲到说会有很多重复的解，结合上边的图也刚好理解了。因为开始尝试了条路后，回退回退回退，然后再向前的时候就可能回到原来的路上了。

这里的话，既然都已经抽象出一个图了，所以除了 DFS，当然还有 BFS。尝试遍历整个图，如果到达了右下角就返回 true。

当然任意两个节点并不是都可以到达的，只有当前要遍历的 S1 或者 S2 对应的字母和 S3 相应的字母相等我们才可以遍历。

用一个队列保存可以遍历的节点，然后不停的从队列里取元素，然后把可以到达的新的节点加到队列中。

```java
class Point {
	int x;
	int y;

	Point(int x, int y) {
		this.x = x;
		this.y = y;
	}
}
class Solution {
	public boolean isInterleave(String s1, String s2, String s3) {
    if (s1.length() + s2.length() != s3.length()) {
        return false;
    }
    Queue<Point> queue = new LinkedList<Point>();
    queue.add(new Point(0, 0));
    //判断是否已经遍历过
    boolean[][] visited = new boolean[s1.length() + 1][s2.length() + 1];
    while (!queue.isEmpty()) {
        Point cur = queue.poll();
        //到达右下角就返回 true
        if (cur.x == s1.length() && cur.y == s2.length()) {
            return true;
        }
        // 尝试是否能向右走
        int right = cur.x + 1;
        if (right <= s1.length() && s1.charAt(right - 1) == s3.charAt(right + cur.y - 1)) {
            if (!visited[right][cur.y]) {
                visited[right][cur.y] = true;
                queue.offer(new Point(right, cur.y));
            }
        }

        // 尝试是否能向下走
        int down = cur.y + 1;
        if (down <= s2.length() && s2.charAt(down - 1) == s3.charAt(down + cur.x - 1)) {
            if (!visited[cur.x][down]) {
                visited[cur.x][down] = true;
                queue.offer(new Point(cur.x, down));
            }
        }

    }
    return false;
}
}
```

# 总

很经典的一道题了，第一次用到了 BFS，之前都是 DFS。最后的图，其实把所有的解法的本质都揭露了出来。