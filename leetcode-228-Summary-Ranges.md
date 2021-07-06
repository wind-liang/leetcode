# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/228.jpg)

给一个数组，把连续的数字写成 `x->y` 的形式。

# 解法一

直接按照题目意思遍历一遍就可以。判断是否连续只需要判断当前数字和后一个数字是否相差 `1` 即可。发生不连续的时候，将当前范围保存起来。

```java
public List<String> summaryRanges(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return new ArrayList<>();
    }
    int start = nums[0];
    int end = nums[0];
    List<String> res = new ArrayList<>();
    for (int i = 0; i < n - 1; i++) {
        if (nums[i] + 1 != nums[i + 1]) {
            //发生了不连续，当前数字是范围的结束
            end = nums[i];
            if (start != end) {
                res.add(start + "->" + end);
            } else {
                res.add(start + "");
            }
            //下一个数字作为范围的开头
            start = nums[i + 1];
        }
    }
    //上边循环只遍历到了 n - 2, 所以最后一个数字单独考虑一下
    end = nums[n - 1];
    if (start != end) {
        res.add(start + "->" + end);
    } else {
        res.add(start + "");
    }
    return res;
}
```

# 解法二

上边解法不管最好还是最坏，时间复杂度都是 `O(n)`，分享 [这里](https://leetcode.com/problems/summary-ranges/discuss/63212/Using-binary-search-but-worst-case-O(n)) 的一个解法，可以对某些情况进行优化。

我们可以一半一半的考虑，比如 `1 2 3 4 5 7`。先考虑左半部 `1 2 3` 是否连续，只需要判断下标之差和数字之差是否相等。`  2 - 0 == 3 - 1`，所以左半部分是连续的数字，得到一个范围 `1 -> 3`，而不需要向解法一那样一个一个数字的遍历。

这里带来一个问题，判断右半部分的时候，我们知道 `4 -> 5`，但是它应该和左半部连接起来变成 `1 -> 5`。这里的话，我们需要定义一个 `Range` 类，当加入新的范围的时候，判断一下两个范围是否相连即可。

```java
class Range {
    int start;
    int end;

    Range(int s, int e) {
        start = s;
        end = e;
    }
}

public List<String> summaryRanges(int[] nums) {

    List<String> resStr = new ArrayList<>();

    if (nums.length == 0) {
        return resStr;
    }

    List<Range> res = new ArrayList<>();
    helper(nums, 0, nums.length - 1, res);

    for (Range r : res) {
        if (r.start == r.end) {
            resStr.add(Integer.toString(r.start));
        } else {
            resStr.add(r.start + "->" + r.end);
        }
    }

    return resStr;
}

private void helper(int[] nums, int i, int j, List<Range> res) {
    if (i == j || nums[j] - nums[i] == j - i) {
        add2res(nums[i], nums[j], res);
        return;
    }

    int m = (i + j) / 2;
    //一半一半的考虑
    helper(nums, i, m, res);
    helper(nums, m + 1, j, res);
}

private void add2res(int a, int b, List<Range> res) {
    //判断新加入的范围和之前最后一个范围是否相连
    if (res.isEmpty() || res.get(res.size() - 1).end + 1 != a) {
        res.add(new Range(a, b));
    } else {
        res.get(res.size() - 1).end = b;
    }
}
```

虽然最坏的时间复杂度依旧是 `O(n)`（比如所有的数字全部不相连），但对于某些情况带来了很大的提升。

# 总

解法一就是根据题意写出的一个解法，解法二的话通过二分的方式对解法带来了一定程度上的优化。