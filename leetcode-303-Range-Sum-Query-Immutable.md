# 题目描述（简单难度）

303、Range Sum Query - Immutable

Given an integer array *nums*, find the sum of the elements between indices *i* and *j* (*i* ≤ *j*), inclusive.

**Example:**

```
Given nums = [-2, 0, 3, -5, 2, -1]

sumRange(0, 2) -> 1
sumRange(2, 5) -> -1
sumRange(0, 5) -> -3
```



**Note:**

1. You may assume that the array does not change.
2. There are many calls to *sumRange* function.

设计一个类，返回数组的第 `i` 到 `j` 个元素的和。

# 解法一 暴力

题目是想让我们设计一种数据结构，我们先暴力写一下。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {
    this.nums = nums;
};

/** 
 * @param {number} i 
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function(i, j) {
    let sum = 0;
    for(; i <= j; i++){
        sum += this.nums[i];
    }
    return sum;
};

/** 
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(i,j)
 */
```

分享 [官方](https://leetcode.com/problems/range-sum-query-immutable/solution/) 提供的一个优化，因为是多次调用 `sumRange`，我们可以在每次调用后将结果保存起来，这样的话第二次调用就可以直接返回了。

```java
/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {
    this.nums = nums;
    this.map = {};
};

/** 
 * @param {number} i 
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function(i, j) {
    let key = i + '@' + j;
    if(this.map.hasOwnProperty(key)){
        return this.map[key];
    }
    
    let sum = 0;
    for(; i <= j; i++){
        sum += this.nums[i];
    }
    
    this.map[key] = sum;
    return sum;
};

/** 
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(i,j)
 */
```

# 解法二

和 [238 题](https://leetcode.wang/leetcode-238-Product-of-Array-Except-Self.html) 的解法二有一些像。

我们用一个数组保存累计的和，`numsAccumulate[i]` 存储 `0` 到 `i - 1` 累计的和。

如果我们想求 `i` 累积到 `j` 的和，只需要用 `numsAccumulate[j + 1]` 减去 `numsAccumulate[i]`。

结合下边的图应该很好理解，我们要求的是橙色部分，相当于 `B` 的部分减去 `A` 的部分。

![](https://windliang.oss-cn-beijing.aliyuncs.com/303_2.jpg)

代码也就水到渠成了。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
    this.numsAccumulate = [0];
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
        this.numsAccumulate.push(sum);
    }
};

/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
    return this.numsAccumulate[j + 1] - this.numsAccumulate[i];
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(i,j)
 */
```

# 总

比较简单的一道题，解法一做缓存的思路比较常见。解法二的思路印象中也遇到过几次，看到题目我的第一反应想到的就是解法二。