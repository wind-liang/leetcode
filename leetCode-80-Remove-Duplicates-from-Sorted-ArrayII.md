# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/80.jpg)

[26 题](<https://leetcode.windliang.cc/leetCode-26-Remove-Duplicates-from-Sorted-Array.html>)的升级版，给定一个数组，每个数字只允许出现 2 次，将满足条件的数字全部移到前边，并且返回有多少数字。例如 [ 1, 1, 1, 2, 2, 3, 4, 4, 4, 4 ]，要变为  [ 1, 1, 2, 2, 3, 4, 4 ...] 剩余部分的数字不要求。

# 解法一 快慢指针

利用[26 题](<https://leetcode.windliang.cc/leetCode-26-Remove-Duplicates-from-Sorted-Array.html>)的思想，慢指针指向满足条件的数字的末尾，快指针遍历原数组。并且用一个变量记录当前末尾数字出现了几次，防止超过两次。

```java
public int removeDuplicates(int[] nums) {
    int slow = 0;
    int fast = 1;
    int count = 1;
    int max = 2;
    for (; fast < nums.length; fast++) {
        //当前遍历的数字和慢指针末尾数字不同，就加到慢指针的末尾
        if (nums[fast] != nums[slow]) { 
            slow++;
            nums[slow] = nums[fast];
            count = 1; //当前数字置为 1 个
        //和末尾数字相同，考虑当前数字的个数，小于 2 的话，就加到慢指针的末尾
        } else {
            if (count < max) {
                slow++;
                nums[slow] = nums[fast];
                count++; //当前数字加 1
            }
        }
    }
    return slow + 1;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二

参考[这里](<https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/discuss/27976/3-6-easy-lines-C%2B%2B-Java-Python-Ruby>)，解法一中，我们用一个变量 count 记录了末尾数字出现了几次。而由于给定的数组是有序的，我们可以更直接。将当前快指针遍历的数字和慢指针指向的数字的前一个数字比较（也就是满足条件的倒数第 2 个数），如果相等，因为有序，所有倒数第 1 个数字和倒数第 2 个数字都等于当前数字，再添加就超过 2 个了，所有不添加，如果不相等，那么就添加。s 代表 slow，f 代表 fast。

```java
//相等的情况
1 1 1 1 1 2 2 3
  ^   ^ 
  s   f
//不相等的情况  
1 1 1 1 1 2 2 3
  ^       ^ 
  s       f
```



```java
public int removeDuplicates2(int[] nums) {
    int slow = 1;
    int fast = 2;
    int max = 2;
    for (; fast < nums.length; fast++) {
        //不相等的话就添加
        if (nums[fast] != nums[slow - max + 1]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

快慢指针是个好东西，解法二直接利用有序，和倒数第 n 个比，从而保证末尾的数字不超过 n 个，太强了。