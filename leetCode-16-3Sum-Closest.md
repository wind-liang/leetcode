# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/16_1.jpg)

和[上一道题](https://leetcode.windliang.cc/leetCode-15-3Sum.html)很类似，只不过这个是给一个目标值，找三个数，使得他们的和最接近目标值。

# 解法一 暴力解法

遍历所有的情况，然后求出三个数的和，和目标值进行比较，选取差值最小的即可。本以为时间复杂度太大了，神奇的是，竟然 AC 了。

```java
public int threeSumClosest(int[] nums, int target) {
    int sub = Integer.MAX_VALUE; //保存和 target 的差值
    int sum = 0; //保存当前最接近 target 的三个数的和
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++)
            for (int k = j + 1; k < nums.length; k++) {
                if (Math.abs((nums[i] + nums[j] + nums[k] - target)) < sub) {
                    sum = nums[i] + nums[j] + nums[k];
                    sub = Math.abs(sum - target);
                }
            }
    }
    return sum;
}
```

时间复杂度：O（n³），三层循环。

空间复杂度：O（1），常数个。

# 解法二

受到[上一题](https://leetcode.windliang.cc/leetCode-15-3Sum.html)的启发，没有看的，推荐大家可以看一下。我们完全可以先将数组排序，然后先固定一个数字，然后利用头尾两个指针进行遍历，降低一个 O（n）的时间复杂度。

如果 sum 大于 target 就减小右指针，反之，就增加左指针。

```java
public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int sub=Integer.MAX_VALUE;
    int sum=0;
    for(int i=0;i<nums.length;i++){ 
        int lo=i+1,hi=nums.length-1;
        while(lo<hi){
            if(Math.abs((nums[lo]+nums[hi]+nums[i]-target))<sub){
                sum=nums[lo]+nums[hi]+nums[i];
                sub=Math.abs(sum-target);
            }
            if(nums[lo]+nums[hi]+nums[i]>target){
                hi--;
            }else{
                lo++;
            }
        }
    }
    return sum;
}
```

时间复杂度：如果是快速排序的 $$O(log_n)$$ 再加上 O（n²），所以就是 O（n²）。

空间复杂度：O（1）。

# 总

和上一道题非常非常的相似了，先对数组排序，然后利用两头的指针，可以说是十分的优雅了。