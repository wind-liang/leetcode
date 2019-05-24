# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/75.jpg)

给一个数组，含有的数只可能 0，1，2 中的一个，然后把这些数字从小到大排序。

# 解法一

题目下边的 Follow up 提到了一个解法，遍历一次数组，统计 0 出现的次数，1 出现的次数，2 出现的次数，然后再遍历数组，根据次数，把数组的元素改成相应的值。当然我们只需要记录 0 的次数，和 1 的次数，剩下的就是 2 的次数了。

``` java
public void sortColors(int[] nums) {
    int zero_count = 0;
    int one_count = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == 0) {
            zero_count++;
        }
        if (nums[i] == 1) {
            one_count++;
        }
    }
    for (int i = 0; i < nums.length; i++) {
        if (zero_count > 0) {
            nums[i] = 0;
            zero_count--;
        } else if (one_count > 0) {
            nums[i] = 1;
            one_count--;
        } else {
            nums[i] = 2;
        }
    }
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二

上边的算法，我们遍历了两次数组，让我们想一想只遍历一次的方法。我们假设一种简单的情况，如果只含有两个数 0 和 1，该怎么做呢？

假设原数组是 1 0 1 1 0，我们可以用一个指针，zero_position，含义是该指针指向的位置，前边的位置全部存 0 。然后再用一个指针 i 遍历这个数组，找到 0 就把 0 放到当前 zero_position 指向的位置， zero_position  后移。用 Z 代表 zero_position，看下边的遍历过程。

```
1 0 1 1 0   初始化 Z,i 指向第 0 个位置，i 后移
^
Z
i

1 0 1 1 0   发现 0，把 Z 的位置置为 0，并且把 Z 的位置的数字交换过来，Z 后移一位
^ ^
Z i

0 1 1 1 0   i 后移一位
  ^
  i
  Z
  
0 1 1 1 0  i 继续后移
  ^ ^
  Z i

0 1 1 1 0  i 继续后移
  ^   ^
  Z   i
  
0 1 1 1 0  遇到 0，把 Z 的位置置为 0，并且把 Z 的位置的数字交换过来，Z 后移一位
  ^     ^
  Z     i
  
0 0 1 1 1  遍历结束
    ^   ^
    Z   i
```

回到我们当前这道题，我们有 3 个数字，那我们可以用两个指针，一个是 zero_position，和之前一样，它前边的位置全部存 0。再来一个指针，two_position，注意这里是，它**后边**的位置全部存 2。然后遍历整个数组就行了。

下边画一个遍历过程中的图，理解一下，Z 前边全存 0，T 后边全存 2。

```
0 1 0 2 1 2 2 2
  ^ ^   ^
  Z i   T
```



```java
public void sortColors(int[] nums) {
    int zero_position = 0;
    int two_position = nums.length - 1;
    for (int i = 0; i <= two_position; i++) {
        if (nums[i] == 0) {
            //将当前位置的数字保存
            int temp = nums[zero_position];
            //把 0 存过来
            nums[zero_position] = 0;
            //把之前的数换过来
            nums[i] = temp;
            //当前指针后移
            zero_position++;
        } else if (nums[i] == 2) {
            //将当前位置的数字保存
            int temp = nums[two_position];
            //把 2 存过来
            nums[two_position] = 2;
            //把之前的数换过来
            nums[i] = temp;
            //当前指针前移
            two_position--;
            //这里一定要注意，因为我们把后边的数字换到了第 i 个位置，
            //这个数字我们还没有判断它是多少，外层的 for 循环会使得 i++ 导致跳过这个元素
            //所以要 i--
            //而对于上边 zero_position 的更新不需要考虑，因为它是从前边换过来的数字
            //在之前已经都判断过了
            i--;
        }
    }
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法三

解法二中总共有三种数，然后很自然可以分成三部分，用两个指针作为间隔，但是，如果有 5 种数呢，解法二恐怕就不适用了。在 leetcode 发现另一种解法，参考[这里](<https://leetcode.com/problems/sort-colors/discuss/26500/Four-different-solutions>)的解法二，用了大问题化小的思想。

我们用三个指针 n0，n1，n2，分别代表已排好序的数组当前 0 的末尾，1 的末尾，2 的末尾。

```java
0  0  1  2  2  2  0  2  1
   ^  ^        ^  ^
  n0 n1       n2  i
```

然后当前遍历到 i 的位置，等于 0，我们只需要把 n2 指针后移并且将当前数字置为 2，将 n1 指针后移并且将当前数字置为 1，将 n0 指针后移并且将当前数字置为 0。

```java
n2 后移后的情况 0  0  1  2  2  2  2  2  1  
                 ^  ^           ^  
                n0 n1           i
                                n2  
n1 后移后的情况 0  0  1  1  2  2  2  2  1  
                 ^     ^        ^  
                n0     n1       i
                                n2                   
n0 后移后的情况 0  0  0  1  2  2  2  2  1  
                    ^  ^        ^  
                   n0  n1       i
                                n2                    
```

然后就达到了将 i 指向的 0 插入到当前排好序的 0 的位置的末尾。

原因的话，由于前边插入了新的数字，势必造成数字的覆盖，指针后移后要把对应的指针位置置为对应的数，n2 指针后移后置为 2，n1 指针后移后置为 1，例如，假如之前有 3 个 2，由于前边插入一个数字，所以会导致 1 个 2 被覆盖掉，所以要加 1 个 2。

```java
public void sortColors(int[] nums) {
    int n0 = -1, n1 = -1, n2 = -1;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        if (nums[i] == 0) {
            n2++;
            nums[n2] = 2;
            n1++;
            nums[n1] = 1;
            n0++;
            nums[n0] = 0;
        } else if (nums[i] == 1) {
            n2++;
            nums[n2] = 2;
            n1++;
            nums[n1] = 1;
        } else if (nums[i] == 2) {
            n2++;
            nums[n2] = 2;
        }
    }
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 总

解法二利用指针，在原来的空间存东西很经典。解法三，其实本质是我们常用的递归思想，先假设一个小问题解决了，然后假如再来一个数该怎么操作。