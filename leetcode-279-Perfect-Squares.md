# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/279.jpg)

把一个数分解成若干个平方数的和，可能有多种方案，找到所需平方数的最少的方案，将最少个数返回。

# 解法一 回溯法

相当于一种暴力的方法，去考虑所有的分解方案，找出最小的解，举个例子。

```java
n = 12
先把 n 减去一个平方数，然后求剩下的数分解成平方数和所需的最小个数

把 n 减去 1, 然后求出 11 分解成平方数和所需的最小个数,记做 n1
那么当前方案总共需要 n1 + 1 个平方数

把 n 减去 4, 然后求出 8 分解成平方数和所需的最小个数,记做 n2
那么当前方案总共需要 n2 + 1 个平方数

把 n 减去 9, 然后求出 3 分解成平方数和所需的最小个数,记做 n3
那么当前方案总共需要 n3 + 1 个平方数

下一个平方数是 16, 大于 12, 不能再分了。

接下来我们只需要从 (n1 + 1), (n2 + 1), (n3 + 1) 三种方案中选择最小的个数, 
此时就是 12 分解成平方数和所需的最小个数了

至于求 11、8、3 分解成最小平方数和所需的最小个数继续用上边的方法去求

直到如果求 0 分解成最小平方数的和的个数, 返回 0 即可
```

代码的话，就是回溯的写法，或者说是 `DFS`。

```java
public int numSquares(int n) {
    return numSquaresHelper(n);
}

private int numSquaresHelper(int n) {
    if (n == 0) {
        return 0;
    }
    int count = Integer.MAX_VALUE;
    //依次减去一个平方数
    for (int i = 1; i * i <= n; i++) {
        //选最小的
        count = Math.min(count, numSquaresHelper(n - i * i) + 1);
    }
    return count;
}
```

当然上边的会造成超时，很多解会重复的计算，之前也遇到很多这种情况了。我们需要 `memoization` 技术，也就是把过程中的解利用 `HashMap`  全部保存起来即可。

```java
public int numSquares(int n) {
    return numSquaresHelper(n, new HashMap<Integer, Integer>());
}

private int numSquaresHelper(int n, HashMap<Integer, Integer> map) {
    if (map.containsKey(n)) {
        return map.get(n);
    }
    if (n == 0) {
        return 0;
    }
    int count = Integer.MAX_VALUE;
    for (int i = 1; i * i <= n; i++) {
        count = Math.min(count, numSquaresHelper(n - i * i, map) + 1);
    }
    map.put(n, count);
    return count;
}
```

# 解法二 动态规划

理解了解法一的话，很容易改写成动态规划。递归相当于先压栈压栈然后出栈出栈，动态规划可以省去压栈的过程。

动态规划的转移方程就对应递归的过程，动态规划的初始条件就对应递归的出口。

```java
public int numSquares(int n) {
    int dp[] = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0; 
    //依次求出 1, 2... 直到 n 的解
    for (int i = 1; i <= n; i++) {
        //依次减去一个平方数
        for (int j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        }
    }
    return dp[n];
}
```

这里还提出来一种 `Static Dynamic Programming`，主要考虑到测试数据有多组，看一下 `leetcode` 全部代码的逻辑。

点击下图箭头的位置。

![](https://windliang.oss-cn-beijing.aliyuncs.com/279_2.jpg)

然后会看到下边的代码。

```java
class Solution {
    public int numSquares(int n) {
        int dp[] = new int[n + 1];
        Arrays.fill(dp,Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j * j <= i; j++) {
                dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
            }
        }
        return dp[n];
    }
}

public class MainClass {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String line;
        while ((line = in.readLine()) != null) {
            int n = Integer.parseInt(line);

            int ret = new Solution().numSquares(n);

            String out = String.valueOf(ret);

            System.out.print(out);
        }
    }
}
```

可以看到上边的逻辑，每次求 `n` 的时候都是创建新的对象然后调用方法。

这样会带来一个问题，假如第一次我们求了 `90` 的平方数和的最小个数，期间 `dp` 会求出 `1` 到 `89` 的所有的平方数和的最小个数。

第二次如果我们求 `50` 的平方数和的最小个数，其实第一次我们已经求过了，但实际上我们依旧会求一遍 `1` 到 `50` 的所有平方数和的最小个数。

我们可以通过声明 `dp` 是 `static` 变量，这样每次调用就不会重复计算了。所有对象将共享 `dp` 。

```java
static ArrayList<Integer> dp = new ArrayList<>();
public int numSquares(int n) {
    //第一次进入将 0 加入
    if(dp.size() == 0){
        dp.add(0);
    }
    //之前是否计算过 n
    if(dp.size() <= n){
        //接着之前最后一个值开始计算
        for (int i = dp.size(); i <= n; i++) {
            int min = Integer.MAX_VALUE;
            for (int j = 1; j * j <= i; j++) {
                min = Math.min(min, dp.get(i - j * j) + 1);
            }
            dp.add(min);
        }
    }
    return dp.get(n);
}
```

# 解法三 BFS

参考 [这里](https://leetcode.com/problems/perfect-squares/discuss/71488/Summary-of-4-different-solutions-(BFS-DP-static-DP-and-mathematics))。

相对于解法一的 `DFS` ，当然也可以使用 `BFS` 。

`DFS` 是一直做减法，然后一直减一直减，直到减到 `0` 算作找到一个解。属于一个解一个解的寻找。

`BFS` 的话，我们可以一层一层的算。第一层依次减去一个平方数得到第二层，第二层依次减去一个平方数得到第三层。直到某一层出现了 `0`，此时的层数就是我们要找到平方数和的最小个数。

举个例子，`n = 12`，每层的话每个节点依次减 `1, 4, 9...`。如下图，灰色表示当前层重复的节点，不需要处理。

![](https://windliang.oss-cn-beijing.aliyuncs.com/279_3.jpg)

如上图，当出现 `0` 的时候遍历就可以停止，此时是第 `3` 层（从 `0` 计数），所以最终答案就是 `3`。

实现的话当然离不开队列，此外我们需要一个 `set` 来记录重复的解。

```java
public int numSquares(int n) {
    Queue<Integer> queue = new LinkedList<>();
    HashSet<Integer> visited = new HashSet<>();
    int level = 0;
    queue.add(n);
    while (!queue.isEmpty()) {
        int size = queue.size();
        level++; // 开始生成下一层
        for (int i = 0; i < size; i++) {
            int cur = queue.poll();
            //依次减 1, 4, 9... 生成下一层的节点
            for (int j = 1; j * j <= cur; j++) {
                int next = cur - j * j;
                if (next == 0) {
                    return level;
                }
                if (!visited.contains(next)) {
                    queue.offer(next);
                    visited.add(next);
                }
            }
        }
    }
    return -1;
}
```

# 解法四 数学

参考 [这里](https://leetcode.com/problems/perfect-squares/discuss/71488/Summary-of-4-different-solutions-(BFS-DP-static-DP-and-mathematics))。

这个解法就不是编程的思想了，需要一些预备的数学知识。

[四平方和定理]([https://zh.wikipedia.org/wiki/%E5%9B%9B%E5%B9%B3%E6%96%B9%E5%92%8C%E5%AE%9A%E7%90%86](https://zh.wikipedia.org/wiki/四平方和定理))，意思是任何正整数都能表示成四个平方数的和。少于四个平方数的，像 `12` 这种，可以补一个 `0` 也可以看成四个平方数，`12 = 4 + 4 + 4 + 0`。知道了这个定理，对于题目要找的解，其实只可能是 `1, 2, 3, 4` 其中某个数。

[Legendre's three-square theorem](https://en.wikipedia.org/wiki/Legendre's_three-square_theorem) ，这个定理表明，如果正整数 `n` 被表示为三个平方数的和，那么 `n` 不等于  $$ 4^a*(8b+7)$$，`a` 和 `b` 都是非负整数。

换言之，如果 $$n == 4^a*(8b+7)$$，那么他一定不能表示为三个平方数的和，同时也说明不能表示为一个、两个平方数的和，因为如果能表示为两个平方数的和，那么补个  `0`，就能凑成三个平方数的和了。

一个、两个、三个都排除了，所以如果 $$n == 4^a*(8b+7)$$，那么 `n` 只能表示成四个平方数的和了。

所以代码的话，我们采取排除的方法。

首先考虑答案是不是 `1`，也就是判断当前数是不是一个平方数。

然后考虑答案是不是 `4`，也就是判断 `n` 是不是等于  $$ 4^a*(8b+7)$$。

然后考虑答案是不是 `2`，当前数依次减去一个平方数，判断得到的差是不是平方数。

以上情况都排除的话，答案就是 `3`。

```java
public int numSquares(int n) {
    //判断是否是 1
    if (isSquare(n)) {
        return 1;
    }
    
    //判断是否是 4
    int temp = n;
    while (temp % 4 == 0) {
        temp /= 4;
    }
    if (temp % 8 == 7) {
        return 4;
    }

    //判断是否是 2
    for (int i = 1; i * i < n; i++) {
        if (isSquare(n - i * i)) {
            return 2;
        }
    }

    return 3;
}

//判断是否是平方数
private boolean isSquare(int n) {
    int sqrt = (int) Math.sqrt(n);
    return sqrt * sqrt == n;
}
```

# 总

解法一和解法二的话算比较常规的思想，我觉得可以看做暴力的思想，是最直接的思路。

解法三的话，只是改变了遍历的方式，本质上和解法一还是一致的。

解法四就需要数学功底了，这里仅做了解，记住结论就可以了。