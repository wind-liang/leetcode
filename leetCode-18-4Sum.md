# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/18.jpg)

和[3Sum](https://leetcode.windliang.cc/leetCode-15-3Sum.html)类似，只不过是找四个数，使得和为 target，并且不能有重复的序列。

如果之前没有做过[3Sum](https://leetcode.windliang.cc/leetCode-15-3Sum.html)可以先看看，自己再上边的基础上加了一个循环而已。

```java
public List<List<Integer>> fourSum(int[] num, int target) {
    Arrays.sort(num);
    List<List<Integer>> res = new LinkedList<>();
    //多加了层循环
    for (int j = 0; j < num.length - 3; j++) {
        //防止重复的
        if (j == 0 || (j > 0 && num[j] != num[j - 1]))
            for (int i = j + 1; i < num.length - 2; i++) {
                //防止重复的，不再是 i == 0 ，因为 i 从 j + 1 开始
                if (i == j + 1 || num[i] != num[i - 1]) {
                    int lo = i + 1, hi = num.length - 1, sum = target - num[j] - num[i];
                    while (lo < hi) {
                        if (num[lo] + num[hi] == sum) {
                            res.add(Arrays.asList(num[j], num[i], num[lo], num[hi]));
                            while (lo < hi && num[lo] == num[lo + 1])
                                lo++;
                            while (lo < hi && num[hi] == num[hi - 1])
                                hi--;
                            lo++;
                            hi--;
                        } else if (num[lo] + num[hi] < sum)
                            lo++;
                        else
                            hi--;
                    }
                }
            }
    }
    return res;
}
```

时间复杂度：O（n³）。

空间复杂度：O（N），最坏情况，即 N 是指 n 个元素的排列组合个数，即  $$N=C^4_n$$，用来保存结果。

# 总

完全是按照 3Sum 的思路写的，比较好理解。