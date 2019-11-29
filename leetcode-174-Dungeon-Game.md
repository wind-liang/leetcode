# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/174.png)

题目描述，任务是从左上角（K）走到右下角（P），初始的时候有一个生命值 `HP`。只能向右和向下走，格子上边的数值代表增加 `HP` 和减少 `HP`，一旦变为 `0`，就立刻结束，问初始的 `HP` 最小可以取多少，才能从 `K` 走到 `P`。注意如果 `P` 点是负值，也要保证到达 `P` 点后将 `P` 点的值减去后， `HP` 的值依旧大于 `0`。

# 解法一 回溯法

最直接暴力的方法就是做搜索了，在每个位置无非就是向右向下两种可能，然后去尝试所有的解，然后找到最小的即可，也就是做一个 `DFS` 或者说是回溯法。

```java
//全局变量去保存最小值
int minHealth = Integer.MAX_VALUE;

public int calculateMinimumHP(int[][] dungeon) {
    //calculateMinimumHPHelper 四个参数
    //int x, int y, int health, int addHealth, int[][] dungeon
    //x, y 代表要准备到的位置，x 代表是哪一列，y 代表是哪一行
    //health 代表当前的生命值
    //addHealth 代表当前已经增加的生命值
    //初始的时候给加 1 点血，addHealth 和 health 都是 1
    calculateMinimumHPHelper(0, 0, 1, 1, dungeon);
    return minHealth;
}

private void calculateMinimumHPHelper(int x, int y, int health, int addHealth, int[][] dungeon) {
    //加上当前位置的奖励或惩罚
    health = health + dungeon[y][x];
    //此时是否需要加血，加血的话就将 health 加到 1
    if (health <= 0) {
        addHealth = addHealth + Math.abs(health) + 1;
    }
    
    //是否到了终点
    if (x == dungeon[0].length - 1 && y == dungeon.length - 1) {
        minHealth = Math.min(addHealth, minHealth);
        return;
    }
    
    //是否加过血
    if (health <= 0) {
        //加过血的话，health 就变为 1
        if (x < dungeon[0].length - 1) {
            calculateMinimumHPHelper(x + 1, y, 1, addHealth, dungeon);
        }
        if (y < dungeon.length - 1) {
            calculateMinimumHPHelper(x, y + 1, 1, addHealth, dungeon);
        }
    } else {
        //没加过血的话，health 就是当前的 health
        if (x < dungeon[0].length - 1) {
            calculateMinimumHPHelper(x + 1, y, health, addHealth, dungeon);
        }
        if (y < dungeon.length - 1) {
            calculateMinimumHPHelper(x, y + 1, health, addHealth, dungeon);
        }
    }

}
```

然后结果是意料之中的，会超时。

![](https://windliang.oss-cn-beijing.aliyuncs.com/174_2.jpg)

然后我们就需要剪枝，将一些情况提前结束掉，最容易想到的就是，如果当前加的血已经超过了全局最小值，那就可以直接结束，不用进后边的递归。

```java
if (addHealth > minHealth) {
    return;
}
```

然后发现对于给定的 `test case` 并没有什么影响。

之所以超时，就是因为我们会经过很多重复的位置，比如

```java
0 1 2
3 4 5
6 7 8
如果按 DFS，第一条路径就是 0 -> 1 -> 2 -> 5 -> 8
然后通过回溯，第二次判断的路径就会是 0 -> 1 -> 4 -> 5 -> ...
我们会发现它又会来到 5 这个位置
其他的也类似，如果表格很大的话，不停的回溯，一些位置会经过很多次
```

接下来，就会想到用 `map` 去缓冲我们过程中求出的解，`key` 话当然是 `x` 和 `y` 了，`value` 呢？存当前的 `health` 和 `addhealth`？那第二次来到这个位置的时候，我们并不能做什么，比如举个例子。

第一次来到 `(3,5)` 的时候，`health` 是 `5`，`addhealth` 是 `6`。

第二次来到 `(3,5)` 的时候，`health` 是 `4`，`addhealth` 是 `7`，我们什么也做不了，我们并不知道未来它会走什么路。

因为走的路是由 `health` 和 `addhealth` 共同决定的，此时来到相同的位置，由于 `health`  和 `addhealth` 都不一样，所以未来的路也很有可能变化，所以我们并不能通过缓冲结果来剪枝。

我们最多能判断当 `x`、`y`、`health` 和 `addhealth` 全部相同的时候提前结束，但这种情况也很少，所以并不能有效的加快搜索速度。

这条路看起来到死路了，我们换个思路，去用动态规划。

动态规划的关键就是去定义我们的状态了，这里直接将要解决的问题定义为我们的状态。

用 `dp[i][j]` 存储从起点 `(0, 0)` 到达 `(i, j)` 时候所需要的最小初始生命值。

到达 `(i,j)` 有两个点，`(i-1, j)` 和 `(i, j-1)`。

接下来就需要去推导状态转移方程了。

```java
* * 8 * 
* 7 ! ?
? ? ? ?
```

假如我们要求上图中 `!` 位置的 `dp`，假设之前的 `dp` 已经都求出来了。

那么 `dp` 是等于感叹号上边的 `dp` 还是等于它左边的 `dp` 呢？选较小的吗？

但如果 `8` 对应的当时的 `health` 是 `100`，而 `7` 对应的是 `5`，此时更好的选择应该是 `8`。

那就选 `health` 大的呗，那 `dp` 不管了吗？极端的例子，假如此时的位置已经是终点了，很明显我们应该选择从左边过来，也就是 `7` 的位置过来，之前的 `health` 并不重要了。

所以推到这里会发现，因为我们有两个不确定的变量，一个是 `dp` ，也就是从起点 `(0, 0)` 到达 `(i, j)` 时候所需要的最小初始生命值，还有一个就是当时剩下的生命值。

当更新 `dp` 的时候我们并不知道它应该是从上边下来，还是从左边过来有利于到达终点的时候所需的初始生命值最小。

换句话讲，依赖过去的状态，并不能指导我们当前的选择，因为还需要未来的信息。

所以到这里，我再次走到了死胡同，就去看 `Discuss` 了，这里分享下别人的做法。

# 解法二 递归

看到 [这里](https://leetcode.com/problems/dungeon-game/discuss/52790/My-AC-Java-Version-Suggestions-are-welcome) 评论区的一个解法。

所需要做的就是将上边动态规划的思路逆转一下。

``` 
  ↓
→ *
```

之前我们考虑的是当前这个位置，它应该是从上边下来还是左边过来会更好些，然后发现并不能确定。

现在的话，看下边的图。

```java
* → x  
↓
y
```

我们现在考虑从当前位置，应该是向右走还是向下走，这样我们是可以确定的。

如果我们知道右边的位置到终点的需要的最小生命值是 `x`，下边位置到终点需要的最小生命值是 `y`。

很明显我们应该选择所需生命值较小的方向。

如果 `x < y`，我们就向右走。

如果 `x > y`，我们就向下走。

知道方向以后，当前位置到终点的最小生命值 `need` 就等于 `x` 和 `y` 中较小的值减去当前位置上边的值。

如果算出来 `need` 大于 `0`，那就说明我们需要 `need` 的生命值到达终点。

如果算出来 `need` 小于等于 `0`，那就说明当前位置增加的生命值很大，所以当前位置我们只需要给一个最小值 `1`，就足以走到终点。

举个具体的例子就明白了。

如果右边的位置到终点的需要的最小生命值是 `5`，下边位置到终点需要的最小生命值是 `8`。

所以我们选择向右走。

如果当前位置的值是 `2`，然后 `need = 5 - 2 = 3`，所以当前位置的初始值应该是 `3`。

如果当前位置的值是 `-3`，然后 `need = 5 - (-3) = 8`，所以当前位置的初始值应该是 `8`。

如果当前位置的值是 `10`，说明增加的生命值很多，`need = 5 - 10 = -5`，此时我们只需要将当前位置的生命值初始为 `1` 即可。

然后每个位置都这样考虑，递归也就出来了。

递归出口也很好考虑， 那就是最后求终点到终点需要的最小生命值。

如果终点位置的值是正的，那么所需要的最小生命值就是 `1`。

如果终点位置的值是负的，那么所需要的最小生命值就是负值的绝对值加 `1`。

```java
public int calculateMinimumHP(int[][] dungeon) {
    return calculateMinimumHPHelper(0, 0, dungeon);
}

private int calculateMinimumHPHelper(int i, int j, int[][] dungeon) {
    //是否到达终点
    if (i == dungeon.length - 1 && j == dungeon[0].length - 1) {
        if (dungeon[i][j] > 0) {
            return 1;
        } else {
            return -dungeon[i][j] + 1;
        }
    }
    //右边位置到达终点所需要的最小值，如果已经在右边界，不能往右走了，赋值为最大值
    int right = j < dungeon[0].length - 1 ? calculateMinimumHPHelper(i, j + 1, dungeon) : Integer.MAX_VALUE;
    //下边位置到达终点需要的最小值，如果已经在下边界，不能往下走了，赋值为最大值
    int down = i < dungeon.length - 1 ? calculateMinimumHPHelper(i + 1, j, dungeon) : Integer.MAX_VALUE;
    //当前位置到终点还需要的生命值
    int need = right < down ? right - dungeon[i][j] : down - dungeon[i][j];
    if (need <= 0) {
        return 1;
    } else {
        return need;
    }
}
```

当然还是意料之中的超时了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/174_2.jpg)

不过不要慌，还是之前的思想，我们利用 `map` 去缓冲中间过程的值，也就是 `memoization` 技术。

这个 `map` 的 `key` 和 `value` 就显而易见了，`key` 是坐标 `i,j`，`value` 的话就存当最后求出来的当前位置到终点所需的最小生命值，也就是 `return` 前同时存进 `map` 中。

```java
public int calculateMinimumHP(int[][] dungeon) {
    return calculateMinimumHPHelper(0, 0, dungeon, new HashMap<String, Integer>());
}

private int calculateMinimumHPHelper(int i, int j, int[][] dungeon, HashMap<String, Integer> map) {
    if (i == dungeon.length - 1 && j == dungeon[0].length - 1) {
        if (dungeon[i][j] > 0) {
            return 1;
        } else {
            return -dungeon[i][j] + 1;
        }
    }
    String key = i + "@" + j;
    if (map.containsKey(key)) {
        return map.get(key);
    }
    int right = j < dungeon[0].length - 1 ? calculateMinimumHPHelper(i, j + 1, dungeon, map) : Integer.MAX_VALUE;
    int down = i < dungeon.length - 1 ? calculateMinimumHPHelper(i + 1, j, dungeon, map) : Integer.MAX_VALUE;
    int need = right < down ? right - dungeon[i][j] : down - dungeon[i][j];
    if (need <= 0) {
        map.put(key, 1);
        return 1;
    } else {
        map.put(key, need);
        return need;
    }
}
```

# 解法三 动态规划

其实解法二递归写完以后，很快就能想到动态规划怎么去解了。虽然它俩本质是一样的，但用动态规划可以节省递归压栈的时间，直接从底部往上走。

我们的状态就定义成解法二递归中返回的值，用 `dp[i][j]` 表示从 `(i, j)` 到达终点所需要的最小生命值。

状态转移方程的话和递归也一模一样，只需要把函数调用改成取直接取数组的值。

因为对于边界的情况，我们需要赋值为最大值，所以数组的话我们也扩充一行一列将其初始化为最大值，比如

```java
奖惩数组
1   -3   3
0   -2   0
-3  -3   -3

dp 数组
终点位置就是递归出口时候返回的值，边界扩展一下
用 M 表示 Integer.MAXVALUE
0 0 0 M
0 0 0 M
0 0 4 M
M M M M

然后就可以一行一行或者一列一列的去更新 dp 数组，当然要倒着更新
因为更新 dp[i][j] 的时候我们需要 dp[i+1][j] 和 dp[i][j+1] 的值
```
然后代码就出来了，可以和递归代码做个对比。

```java
public int calculateMinimumHP(int[][] dungeon) {
    int row = dungeon.length;
    int col = dungeon[0].length;
    int[][] dp = new int[row + 1][col + 1];
    //终点所需要的值
    dp[row - 1][col - 1] = dungeon[row - 1][col - 1] > 0 ? 1 : -dungeon[row - 1][col - 1] + 1;
    //扩充的边界更新为最大值
    for (int i = 0; i <= col; i++) {
        dp[row][i] = Integer.MAX_VALUE;
    }
    for (int i = 0; i <= row; i++) {
        dp[i][col] = Integer.MAX_VALUE;
    }
    
    //逆过来更新
    for (int i = row - 1; i >= 0; i--) {
        for (int j = col - 1; j >= 0; j--) {
            if (i == row - 1 && j == col - 1) {
                continue;
            }
            //选择向右走还是向下走
            dp[i][j] = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
            if (dp[i][j] <= 0) {
                dp[i][j] = 1;
            }
        }
    }
    return dp[0][0];
}
```

如果动态规划做的多的话，必不可少的一步就是空间复杂度可以进行优化，比如 [5题](<https://leetcode.windliang.cc/leetCode-5-Longest-Palindromic-Substring.html>)，[10题](<https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html>)，[53题](<https://leetcode.windliang.cc/leetCode-53-Maximum-Subarray.html?h=%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92>)，[72题 ](<https://leetcode.wang/leetCode-72-Edit-Distance.html>)，[115 题](https://leetcode.wang/leetcode-115-Distinct-Subsequences.html) 等等都已经用过了。

因为我们的 `dp` 数组在更新第 `i` 行的时候，我们只需要第 `i+1` 行的信息，而 `i+2`，`i+3` 行的信息我们就不再需要了，我们我们其实不需要二维数组，只需要一个一维数组就足够了。

```java
public int calculateMinimumHP(int[][] dungeon) {
    int row = dungeon.length;
    int col = dungeon[0].length;
    int[] dp = new int[col + 1];

    for (int i = 0; i <= col; i++) {
        dp[i] = Integer.MAX_VALUE;
    }
    dp[col - 1] = dungeon[row - 1][col - 1] > 0 ? 1 : -dungeon[row - 1][col - 1] + 1;
    for (int i = row - 1; i >= 0; i--) {
        for (int j = col - 1; j >= 0; j--) {
            if (i == row - 1 && j == col - 1) {
                continue;
            }
            dp[j] = Math.min(dp[j], dp[j + 1]) - dungeon[i][j];
            if (dp[j] <= 0) {
                dp[j] = 1;
            }
        }
    }
    return dp[0];
}
```

# 总

回过来看这道题，其实有时候只是一个思维的逆转，就可以把问题解决了。

开始的时候，想求出从起点出发到任点的所需的最小生命值，然后发现走到了死胡同，因为根据当前的信息无法指导未来的方向。而思维逆转过来，从未来往回走，去求出任一点到终点所需要的最小生命值，问题瞬间得到了解决。

第一次遇到这样的动态规划题目，之前的动态规划无论从左上角到右下角，还是从右下角到左上角都是可以做的。而这个题由于有两个变量，所以只允许一个方向才能解题，很有意思。所以，最根本的原因就是终点到起点和起点到终点所需要的最小生命值并不一定是相同的。

遇到问题到了死胡同，不如逆过来去解决问题，太妙了！