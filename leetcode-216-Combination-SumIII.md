# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/216.jpg)

返回所有目标和的组合。`k` 代表每个组合能选取的个数，`n` 代表目标和，可选取的数字是 `1` 到 `9`，每种组合中每个数字只能选择一次。

# 思路分析

很典型的回溯法应用了，或者说是 `DFS`。约等于暴力求解，去考虑所有情况，然后依次判断即可。之前也做过很多回溯的题了，这里不细讲了，如果对回溯法不熟悉，大家可以在 [https://leetcode.wang/](https://leetcode.wang/) 左上角搜索「回溯」，多做一些题就有感觉了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/216_2.jpg)

# 解法一 回溯法

回溯法完全可以看做一个模版，整体框架就是一个大的 for 循环，然后先 add，接着利用递归进行遍历，然后再 remove ，继续循环。

```java
public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> res = new ArrayList<>();
    getAnswer(res, new ArrayList<>(), k, n, 1);
    return res;
}

private void getAnswer(List<List<Integer>> res, ArrayList<Integer> temp, int k, int n, int start) {
    if (temp.size() == k) {
        if (n == 0) {
            res.add(new ArrayList<>(temp));
        }
        return;
    }
    for (int i = start; i < 10; i++) {
        temp.add(i);
        getAnswer(res, temp, k, n - i, i + 1);
        temp.remove(temp.size() - 1);
    }
}
```

# 总

这道题没什么难点，主要就是回溯法的应用。