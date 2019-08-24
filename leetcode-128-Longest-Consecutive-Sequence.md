# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/128.jpg)

给一个数组，求出连续的数字最多有多少个，时间复杂度要求是 `O(n)`。

# 解法一

首先想一下最直接的暴力破解。我们可以用一个 `HashSet` 把给的数组保存起来。然后再考虑数组的每个数，比如这个数是 `n`，然后看 `n + 1` 在不在 `HashSet` 中，然后再看 `n + 2` 在不在，接下来 `n + 3`、`n + 4` 直到在 `HashSet` 中找不到，记录当前的长度。然后继续考虑下一个数，并且更新最长的长度。

```java
public int longestConsecutive(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        set.add(nums[i]);
    }
    int max = 0;
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];
        int count = 0;
        while (set.contains(num)) {
            count++;
            num += 1;
        }
        max = Math.max(max, count);
    }
    return max;
}
```

当然时间复杂度不符合题意了，我们想一下优化方案。

上边的暴力破解有一个问题就是做了很多没必要的计算，因为我们要找最长的连续数字。所以如果是数组 `54367`，当我们遇到 `5` 的时候计算一遍 `567`。遇到 `4` 又计算一遍 `4567`。遇到 `3` 又计算一遍 `34567`。很明显从 `3` 开始才是我们想要的序列。

换句话讲，我们只考虑从序列最小的数开始即可。实现的话，当考虑 `n` 的时候，我们先看一看 `n - 1` 是否存在，如果不存在，那么从 `n` 开始就是我们需要考虑的序列了。否则的话，直接跳过。

```java
public int longestConsecutive(int[] nums) {
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        set.add(nums[i]);
    }
    int max = 0;
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];
        //n - 1 是否存在
        if (!set.contains(num - 1)) {
            int count = 0;
            while (set.contains(num)) {
                count++;
                num += 1;
            }
            max = Math.max(max, count);
        }
    }
    return max;
}
```

这个时间复杂度的话就是 `O(n)` 了。虽然 `for` 循环里套了 `while` 循环，但每个元素其实最多也就是被访问两次。比如极端情况 `987654` ，`98765` 循环的时候都不会进入 `while` 循环，只有到 `4` 的时候才进入了 `while` 循环。所以总共的话， `98765` 也只会被访问两次，所以时间复杂度就是 `O(n)` 了。

# 解法二

参考 [这里](<https://leetcode.com/problems/longest-consecutive-sequence/discuss/41055/My-really-simple-Java-O(n)-solution-Accepted>) ，虽然不容易直接想到，但还是有迹可循的。

本质上就是把连续的序列进行合并，思路就是考虑我们先解决了小问题，然后大问题怎么解决。

```java
假如我们已经了有连续的序列，123 和 56，并且序列的边界保存了当前序列的长度。
1  2  3
3     3  <- 序列长度

5  6
2  2  <- 序列长度

此时来了一个数字 4
我们只需要考虑 4 - 1 = 3,以 3 结尾的序列的长度
以及 4 + 1 = 5,以 5 开头的序列的长度
所以当前就会得到一个包含 4 的，长度为 3 + 1 + 2 = 6 的序列
1  2  3  4  5  6
3     3     2  2   <- 序列长度  

此时把两个边界的长度进行更新
1  2  3  4  5  6
6     3     2  6   <- 序列长度  

此时如果又来了 7
我们只需要考虑 7 - 1 = 6,以 6 结尾的序列的长度
以及 7 + 1 = 8,以 8 开头的序列的长度，但是不存在以 8 开头的序列，所以这个长度是 0
所以当前就会得到一个包含 7 的，长度为 6 + 1 + 0 = 7 的序列    
1  2  3  4  5  6  7
6     3     2  6     <- 序列长度  

此时把两个边界的长度进行更新
1  2  3  4  5  6 7
7     3     2  6 7  <- 序列长度  
```

实现的话，我们可以用一个 `HashMap` ，存储以当前 `key` 为边界的连续序列的长度。可以再结合代码理解一下。

```java
public int longestConsecutive(int[] nums) {
    HashMap<Integer, Integer> map = new HashMap<>();
    int max = 0;
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];
        //已经考虑过的数字就跳过，必须跳过，不然会出错
        //比如 [1 2 1]
        //最后的 1 如果不跳过，因为之前的 2 的最长长度已经更新成 2 了，所以会出错
        if(map.containsKey(num)) {
            continue;
        }
        //找到以左边数字结尾的最长序列，默认为 0
        int left = map.getOrDefault(num - 1, 0);
        //找到以右边数开头的最长序列，默认为 0
        int right = map.getOrDefault(num + 1, 0);
        int sum = left + 1 + right;
        max = Math.max(max, sum);
        
        //将当前数字放到 map 中，防止重复考虑数字，value 可以随便给一个值
        map.put(num, -1);
        //更新左边界长度
        map.put(num - left, sum);
        //更新右边界长度
        map.put(num + right, sum);
    }
    return max;
}
```

# 总

两种思路其实都是正常的操作，仔细想的话还是可以想出来的。

