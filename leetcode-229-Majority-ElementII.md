# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/229.jpg)

找出数组中数量超过 `n/3` 的数字，`n` 是数组的长度。

# 解法一

题目要求是 `O(1)` 的空间复杂度，我们先用 `map` 写一下，看看对题意的理解对不对。

`map` 的话 `key` 存数字，`value` 存数字出现的个数。如果数字出现的次数等于了 `n/3 + 1` 就把它加到结果中。

```java
public List<Integer> majorityElement(int[] nums) {
    int n = nums.length;
    HashMap<Integer, Integer> map = new HashMap<>();
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        int count = map.getOrDefault(nums[i], 0);
        //之前的数量已经是 n/3, 当前数量就是 n/3 + 1 了
        if (count == n / 3) {
            res.add(nums[i]);
        }
        //可以提前结束
        if (count == 2 * n / 3 || res.size() == 2) {
            return res;
        }
        map.put(nums[i], count + 1);

    }
    return res;
}
```

# 解法二

[169 题](https://leetcode.wang/leetcode-169-Majority-Element.html) 我们做过找出数组的中超过 `n/2` 数量的数字，其中介绍了摩尔投票法，这里的话可以改写一下，参考 [这里](https://leetcode.com/problems/majority-element-ii/discuss/63520/Boyer-Moore-Majority-Vote-algorithm-and-my-elaboration)。

首先看一下 [169 题](https://leetcode.wang/leetcode-169-Majority-Element.html) 我们是怎么做的。

> 我们假设这样一个场景，在一个游戏中，分了若干个队伍，有一个队伍的人数超过了半数。所有人的战力都相同，不同队伍的两个人遇到就是同归于尽，同一个队伍的人遇到当然互不伤害。
>
> 这样经过充分时间的游戏后，最后的结果是确定的，一定是超过半数的那个队伍留在了最后。
>
> 而对于这道题，我们只需要利用上边的思想，把数组的每个数都看做队伍编号，然后模拟游戏过程即可。
>
> `group` 记录当前队伍的人数，`count` 记录当前队伍剩余的人数。如果当前队伍剩余人数为 `0`，记录下次遇到的人的所在队伍号。

对于这道题的话，超过 `n/3` 的队伍可能有两个，首先我们用 `group1` 和 `group2` 记录这两个队伍，`count1` 和 `count2` 分别记录两个队伍的数量，然后遵循下边的游戏规则。

将数组中的每一个数字看成队伍编号。

`group1`  和 `group2`  首先初始化为不可能和当前数字相等的两个数，将这两个队伍看成同盟，它俩不互相伤害。

然后遍历数组中的其他数字，如果遇到的数字属于其中的一个队伍，就将当前队伍的数量加 `1`。

如果某个队伍的数量变成了 `0`，就把这个队伍编号更新为当前的数字。

否则的话，将两个队伍的数量都减 `1`。

```java
public List<Integer> majorityElement(int[] nums) {
    int n = nums.length;
    long group1 = (long)Integer.MAX_VALUE + 1;
    int count1 = 0;
    long group2 = (long)Integer.MAX_VALUE + 1;
    int count2 = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] == group1) {
            count1++;
        } else if (nums[i] == group2) {
            count2++;
        } else if (count1 == 0) {
            group1 = nums[i];
            count1 = 1;
        } else if (count2 == 0) {
            group2 = nums[i];
            count2 = 1;
        } else {
            count1--;
            count2--;
        }
    }

    //计算两个队伍的数量,因为可能只存在一个数字的数量超过了 n/3
    count1 = 0;
    count2 = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] == group1) {
            count1++;
        }
        if (nums[i] == group2) {
            count2++;
        }
    }
    //只保存数量大于 n/3 的队伍
    List<Integer> res = new ArrayList<>();
    if (count1 > n / 3) {
        res.add((int) group1);
    }

    if (count2 > n / 3) {
        res.add((int) group2);
    }
    return res;
}
```

上边有个技巧就是先将 `group` 初始化为一个大于 `int` 最大值的 `long` 值，这样可以保证后边的 `if` 条件判断中，数组中一定不会有数字和 `group`相等，从而进入后边的更新队伍编号的分支中。除了用 `long` 值，我们还可以用包装对象 `Integer`，将 `group` 初始化为 `null` 可以达到同样的效果。

当然，不用上边的技巧也是可以的，我们可以先在 `nums` 里找到两个不同的值分别赋值给 `group1` 和 `group2` 中即可，只不过代码上不会有上边的简洁。

`2020.5.27` 更新，[@Frankie](http://yaoyichen.cn/algorithm/2020/05/27/leetcode-229.html) 提醒，其实不用上边分析的那么麻烦，只需要给 `group1` 和 `group2` 随便赋两个不相等的值即可。

因为如果数组中前两个数有和 `group1` 或者 `group2` 相等的元素，就进入前两个 `if` 语句中的某一个，逻辑上也没问题。

如果数组中前两个数没有和 `group1` 或者 `group2` 相等的元素，那么就和使用 `long` 一个性质了。

```java
public List<Integer> majorityElement(int[] nums) {
    int n = nums.length;
    int group1 = 0;
    int count1 = 0;
    int group2 = 1;
    int count2 = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] == group1) {
            count1++;
        } else if (nums[i] == group2) {
            count2++;
        } else if (count1 == 0) {
            group1 = nums[i];
            count1 = 1;
        } else if (count2 == 0) {
            group2 = nums[i];
            count2 = 1;
        } else {
            count1--;
            count2--;
        }
    }

    //计算两个队伍的数量,因为可能只存在一个数字的数量超过了 n/3
    count1 = 0;
    count2 = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] == group1) {
            count1++;
        }
        if (nums[i] == group2) {
            count2++;
        }
    }
    //只保存数量大于 n/3 的队伍
    List<Integer> res = new ArrayList<>();
    if (count1 > n / 3) {
        res.add( group1);
    }

    if (count2 > n / 3) {
        res.add(group2);
    }
    return res;
}
```

# 总

解法一算是通用的解法，解法二的话看起来比较容易，但如果只看上边的解析，然后自己写代码的话还是会遇到很多问题的，其中 `if` 分支的顺序很重要。