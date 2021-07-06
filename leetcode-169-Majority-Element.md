# 题目描述(简单难度)

![](https://windliang.oss-cn-beijing.aliyuncs.com/169.jpg)

给一个数组，存在一个数字超过了半数，找出这个数。

# 解法一

这种计数问题，直接就会想到 `HashMap`，遍历过程中统计每个数字出现的个数即可。可以确定的是，超过半数的数字一定有且只有一个。所以在计数过程中如果出现了超过半数的数字，我们可以立刻返回。

```java
public int majorityElement(int[] nums) {
    HashMap<Integer, Integer> map = new HashMap<>();
    int n = nums.length;
    for (int i = 0; i < nums.length; i++) {
        int before = map.getOrDefault(nums[i], 0);
        if (before == n / 2) {
            return nums[i];
        }
        map.put(nums[i], before + 1);
    }
    //随便返回一个
    return -1;
}
```

上边的解法时间复杂度是 `O(n)`，同时也需要 `O(n)` 的空间复杂度。所以下边讨论在保证时间复杂度不变的情况下，空间复杂度为 `O(1)` 的解法。

# 解法二 位运算

看到 [这里](https://leetcode.com/problems/majority-element/discuss/51612/C%2B%2B-6-Solutions) 介绍的。

[137 题](https://leetcode.wang/leetcode-137-Single-NumberII.html) 解法三中已经用过这个思想了，就是把数字放眼到二进制的形式，举个例子。

```java
5 5 2 1 2 2 2 都写成 2 进制
1 0 1
1 0 1
0 1 0
0 0 1 
0 1 0
0 1 0
0 1 0
```

由于 `2` 是超过半数的数，它的二进制是 `010`，所以对于从右边数第一列一定是 `0` 超过半数，从右边数第二列一定是 `1` 超过半数，从右边数第三列一定是 `0` 超过半数。然后每一列超过半数的 `0,1,0` 用 `10`进制表示就是 `2` 。

所以我们只需要统计每一列超过半数的数，`0` 或者 `1`，然后这些超过半数的二进制位组成一个数字，就是我们要找的数。

当然，我们可以只统计 `1` 的个数，让每一位开始默认为 `0`，如果发现某一列的 `1` 的个数超过半数，就将当前位改为 `1`。

具体算法通过按位与和按位或实现。

```java
public int majorityElement(int[] nums) {
    int majority = 0;
    int n = nums.length;
    //判断每一位
    for (int i = 0, mask = 1; i < 32; i++, mask <<= 1) {
        int bits = 0;
        //记录当前列 1 的个数
        for (int j = 0; j < n; j++) {
            if ((mask & nums[j]) == mask) {
                bits++;
            }
        }
        //当前列 1 的个数是否超过半数
        if (bits > n / 2) {
            majority |= mask;
        }
    }
    return majority;
}
```

# 解法三 摩尔投票法

1980 年由 Boyer 和 Moore 两个人提出来的算法，英文是 [Boyer-Moore Majority Vote Algorithm](http://www.cs.utexas.edu/~moore/best-ideas/mjrty/])。

算法思想很简单，但第一个想出来的人是真的强。

我们假设这样一个场景，在一个游戏中，分了若干个队伍，有一个队伍的人数超过了半数。所有人的战力都相同，不同队伍的两个人遇到就是同归于尽，同一个队伍的人遇到当然互不伤害。

这样经过充分时间的游戏后，最后的结果是确定的，一定是超过半数的那个队伍留在了最后。

而对于这道题，我们只需要利用上边的思想，把数组的每个数都看做队伍编号，然后模拟游戏过程即可。

`group` 记录当前队伍的人数，`count` 记录当前队伍剩余的人数。如果当前队伍剩余人数为 `0`，记录下次遇到的人的所在队伍号。

```java
public int majorityElement(int[] nums) {
		int count = 1;
		int group = nums[0];
		for (int i = 1; i < nums.length; i++) {
            //当前队伍人数为零，记录现在遇到的人的队伍号
			if (count == 0) {
				count = 1;
				group = nums[i];
				continue;
			}
            //现在遇到的人和当前队伍同组，人数加 1
			if (nums[i] == group) {
				count++;
            //遇到了其他队伍的人，人数减 1
			} else {
				count--;
			}
		}
		return group;
	}
```

# 总

解法一用 `HashMap` 计数的方法经常用到，很容易想到。解法二把数字放眼到二进制的世界，也算是经常用到了。解法三只能说 666 了，太强了，神仙操作。