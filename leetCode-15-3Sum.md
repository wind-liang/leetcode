# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/15_1.jpg)

# 解法一 暴力解法

无脑搜索，三层循环，遍历所有的情况。但需要注意的是，我们需要把重复的情况去除掉，就是 [1, -1 ,0] 和 [0, -1, 1] 是属于同一种情况的。

```java
public List<List<Integer>> threeSum(int[] nums) {
    List<List<Integer>> res = new ArrayList<List<Integer>>();
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++)
            for (int k = j + 1; k < nums.length; k++) {
                if (nums[i] + nums[j] + nums[k] == 0) {
                    List<Integer> temp = new ArrayList<Integer>();
                    temp.add(nums[i]);
                    temp.add(nums[j]);
                    temp.add(nums[k]); 
                    //判断结果中是否已经有 temp 。
                    if (isInList(res, temp)) {
                        continue;
                    }
                    res.add(temp);
                }
            }
    }
    return res;

}

public boolean isInList(List<List<Integer>> l, List<Integer> a) {
    for (int i = 0; i < l.size(); i++) {
        //判断两个 List 是否相同
        if (isSame(l.get(i), a)) {
            return true;
        }
    }
    return false;
}

public boolean isSame(List<Integer> a, List<Integer> b) {
    int count = 0;
    Collections.sort(a);
    Collections.sort(b);
    //排序后判断每个元素是否对应相等
    for (int i = 0; i < a.size(); i++) {
        if (a.get(i) != b.get(i)) {
            return false;
        }
    }
    return true;
}
```

时间复杂度：n 表示 num 的个数，三个循环 O（n³），而 isInList 也需要 O（n），总共就是 $$O(n^4)$$，leetCode 复杂度到了  $$O(n^3)$$  一般就报超时错误了，所以算法还得优化。

空间复杂度：最坏情况，即 O（N）, N 是指 n 个元素的排列组合个数，即  $$N=C^3_n$$，用来保存结果。

# 解法二

参考了[这里](https://leetcode.com/problems/3sum/discuss/7380/Concise-O(N2)-Java-solution)

主要思想是，遍历数组，用 0 减去当前的数，作为 sum ，然后再找两个数使得和为 sum。

这样看来遍历需要 O（n），再找两个数需要 O（n²）的复杂度，还是需要 O（n³）。

巧妙之处在于怎么找另外两个数。

最最优美的地方就是，首先将给定的 num 排序。

这样我们就可以用两个指针，一个指向头，一个指向尾，去找这两个数字，这样的话，找另外两个数时间复杂度就会从 O（n²），降到 O（n）。

而怎么保证不加入重复的 list 呢？

要记得我们的 nums 已经有序了，所以只需要找到一组之后，当前指针要移到和当前元素不同的地方。其次在遍历数组的时候，如果和上个数字相同，也要继续后移。文字表述比较困难，可以先看下代码。

```java
public List<List<Integer>> threeSum(int[] num) {
    Arrays.sort(num); //排序
    List<List<Integer>> res = new LinkedList<>(); 
    for (int i = 0; i < num.length-2; i++) {
        //为了保证不加入重复的 list,因为是有序的，所以如果和前一个元素相同，只需要继续后移就可以
        if (i == 0 || (i > 0 && num[i] != num[i-1])) {
            //两个指针,并且头指针从i + 1开始，防止加入重复的元素
            int lo = i+1, hi = num.length-1, sum = 0 - num[i];
            while (lo < hi) {
                if (num[lo] + num[hi] == sum) {
                    res.add(Arrays.asList(num[i], num[lo], num[hi]));
                    //元素相同要后移，防止加入重复的 list
                    while (lo < hi && num[lo] == num[lo+1]) lo++;
                    while (lo < hi && num[hi] == num[hi-1]) hi--;
                    lo++; hi--;
                } else if (num[lo] + num[hi] < sum) lo++;
                else hi--;
           }
        }
    }
    return res;
}
```

时间复杂度：O（n²），n 指的是 num

空间复杂度：O（N），最坏情况，即 N 是指 n 个元素的排列组合个数，即  $$N=C^3_n$$，用来保存结果。

# 总

对于遍历，这里用到了从两头同时遍历，从而降低了时间复杂度，很妙！