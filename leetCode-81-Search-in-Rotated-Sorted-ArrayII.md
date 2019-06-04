# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/81.jpg)

[33题](<https://leetcode.wang/leetCode-33-Search-in-Rotated-Sorted-Array.html>)的升级版，数组的操作没有变，所谓的旋转数组，就是把有序数组前边若干个数字移动到末尾。区别在于这道题出现了重复的数字，同样是找 target。

# 解法一

把数组遍历一遍，然后依次判断数字是否相等的解法，当然就不用说了。这里直接在[33 题](<https://leetcode.wang/leetCode-33-Search-in-Rotated-Sorted-Array.html>)解法三的基础上去修改。33 题算法基于一个事实，数组从任意位置劈开后，至少有一半是有序的，什么意思呢？

比如 [ 4 5 6 7 1 2 3] ，从 7 劈开，左边是 [ 4 5 6 7] 右边是 [ 7 1 2 3]，左边是有序的。

基于这个事实。

我们可以先找到哪一段是有序的 (只要判断端点即可)，知道了哪一段有序，我们只需要用正常的二分法就够了，只需要看 target 在不在这一段里，如果在，那么就把另一半丢弃。如果不在，那么就把这一段丢弃。

```java
public int search(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            return mid;
        }
        //左半段是有序的
        if (nums[start] <= nums[mid]) {
            //target 在这段里
            if (target >= nums[start] && target < nums[mid]) {
                end = mid - 1;
            //target 在另一段里
            } else {
                start = mid + 1;
            }
        //右半段是有序的
        } else {
            if (target > nums[mid] && target <= nums[end]) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }

    }
    return -1;
}
```

如果不加修改，直接放到 leetcode 上跑，发现 nums = [ 1, 3, 1, 1, 1 ] ，target = 3，返回了 false，当然是不对的了。原因就出现在了，我们在判断哪段有序的时候，当 nums [ start ] <= nums [ mid ] 是认为左半段有序。而由于这道题出现了重复数字，此时的 nums [ start ] = 1, nums [ mid ] = 1，但此时左半段 [ 1, 3, 1 ] 并不是有序的，所以造成我们的算法错误。

所以 nums[start] == nums[mid] 需要我们单独考虑了。操作也很简单，参考[这里](<https://leetcode.com/problems/search-in-rotated-sorted-array-ii/discuss/28218/My-8ms-C%2B%2B-solution-(o(logn)-on-average-o(n)-worst-case)，当相等的时候，我们只需要让 start++ 就够了。

```java
public boolean search(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    while (start <= end) {
        int mid = (start + end) / 2;
        if (target == nums[mid]) {
            return true;
        } 
        //左半段有序
        if (nums[start] < nums[mid]) {
            if (target >= nums[start] && target < nums[mid]) {
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        } else if(nums[start] == nums[mid]){
            start++;
        //右半段有序
        }else{
            if (target > nums[mid] && target <= nums[end]) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
    }
    return false;
}
```

时间复杂度：最好的情况，如果没有遇到 nums [ start ] == nums [ mid ]，还是 O（log（n））。当然最差的情况，如果是类似于这种 [ 1, 1, 1, 1, 2, 1 ] ，target = 2，就是 O ( n ) 了。

空间复杂度：O ( 1 )。

# 总

基于之前的算法，找出问题所在，然后思考解决方案。开始自己一直纠结于怎么保持时间复杂度还是 log ( n )，也没想出解决方案，看了 discuss，发现似乎只能权衡一下。另外 [33题](<https://leetcode.wang/leetCode-33-Search-in-Rotated-Sorted-Array.html>) 的另外两种解法，好像对于这道题完全失效了，如果大家发现怎么修改，欢迎和我交流。