# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/45.jpg)

从数组的第 0 个位置开始跳，跳的距离小于等于数组上对应的数。求出跳到最后个位置需要的最短步数。比如上图中的第 0 个位置是 2，那么可以跳 1 个距离，或者 2 个距离，我们选择跳 1 个距离，就跳到了第 1 个位置，也就是 3 上。然后我们可以跳 1，2，3 个距离，我们选择跳 3 个距离，就直接到最后了。所以总共需要 2 步。

# 解法一 顺藤摸瓜

参考[这里](https://leetcode.com/problems/jump-game-ii/discuss/18023/Single-loop-simple-java-solution?orderBy=most_votes)，leetCode 讨论里，大部分都是这个思路，贪婪算法，我们每次在可跳范围内选择可以使得跳的更远的位置。

如下图，开始的位置是 2，可跳的范围是橙色的。然后因为 3 可以跳的更远，所以跳到 3 的位置。

![](https://windliang.oss-cn-beijing.aliyuncs.com/45_2.jpg)

如下图，然后现在的位置就是 3 了，能跳的范围是橙色的，然后因为 4 可以跳的更远，所以下次跳到 4 的位置。

![](https://windliang.oss-cn-beijing.aliyuncs.com/45_3.jpg)

写代码的话，我们用 end 表示当前能跳的边界，对于上边第一个图的橙色 1，第二个图中就是橙色的 4，遍历数组的时候，到了边界，我们就重新更新新的边界。

```java
public int jump(int[] nums) {
    int end = 0;
    int maxPosition = 0; 
    int steps = 0;
    for(int i = 0; i < nums.length - 1; i++){
        //找能跳的最远的
        maxPosition = Math.max(maxPosition, nums[i] + i); 
        if( i == end){ //遇到边界，就更新边界，并且步数加一
            end = maxPosition;
            steps++;
        }
    }
    return steps;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

这里要注意一个细节，就是 for 循环中，i < nums.length - 1，少了末尾。因为开始的时候边界是第 0 个位置，steps 已经加 1 了。如下图，如果最后一步刚好跳到了末尾，此时 steps 其实不用加 1 了。如果是 i < nums.length，i 遍历到最后的时候，会进入 if 语句中，steps 会多加 1 。

![](https://windliang.oss-cn-beijing.aliyuncs.com/45_4.jpg)

# 解法二 顺瓜摸藤

我们知道最终要到达最后一个位置，然后我们找前一个位置，遍历数组，找到能到达它的位置，离它最远的就是要找的位置。然后继续找上上个位置，最后到了第 0 个位置就结束了。

至于离它最远的位置，其实我们从左到右遍历数组，第一个满足的位置就是我们要找的。

```java
public int jump(int[] nums) {
    int position = nums.length - 1; //要找的位置
    int steps = 0;
    while (position != 0) { //是否到了第 0 个位置
        for (int i = 0; i < position; i++) {
            if (nums[i] >= position - i) {
                position = i; //更新要找的位置
                steps++;
                break;
            }
        }
    }
    return steps;
}
```

时间复杂度：O（n²），因为最坏的情况比如 1 1 1 1 1 1，position 会从 5 更新到 0 ，并且每次更新都会经历一个  for 循环。

空间复杂度：O（1）。

这种想法看起来更简单了，为什么奏效呢？我们可以这样想。

![](https://windliang.oss-cn-beijing.aliyuncs.com/45_5.jpg)

从左到右跳的话，2 -> 3 -> 4 -> 1。

从右到左的话，我们找能跳到 1 的最左边的位置，我们找的只能是 4 或者是 4 左边的。

找到 4 的话，不用说，刚好完美。

如果是中间范围 3 和 4 之间的第 2 个  1 变成了 3，那么这个位置也可以跳到末尾的 1，按我们的算法我们就找到了这个 3，也就是 4 左边的位置。但其实并不影响我们的 steps，因为这个数字是 3 到 4 中间范围的数，左边界 3 也可以到这个数，所以下次找的话，会找到边界 3 ，或者边界 3 左边的数。 会不会直接找到 上个边界 2 呢？不会的，如果找到了上一个边界 2，那么意味着从 2 直接跳到 3 和 4 之间的那个数，再从这个数跳到末尾就只需 2 步了，但是其实是需要 3 步的。

# 总

刷这么多题，第一次遇到了贪心算法，每次找局部最优，最后达到全局最优，完美！
