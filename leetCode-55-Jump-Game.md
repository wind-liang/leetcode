# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/55.jpg)

[45题](https://leetcode.windliang.cc/leetCode-45-Jump-Game-II.html)的时候已经见过这道题了，只不过之前是返回从第 0 个位置能跳到最后一个位置的最小步数，这道题是返回是否能跳过去。

leetCode [Solution](https://leetcode.com/problems/jump-game/solution/) 中给出的是动态规划的解法，进行了一步一步的优化，但都也比较慢。不过，思路还是值得参考的，上边说的比较详细，这里就不啰嗦了。这里，由于受到 45 题的影响，自己对 45 题的解法改写了一下，从而解决了这个问题。

下边的解法都是基于[45题](https://leetcode.windliang.cc/leetCode-45-Jump-Game-II.html) 的想法，大家可以先过去看一下，懂了之后再回到下边来看。

# 解法一 顺藤摸瓜

45 题的代码。

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

这里的话，我们完全可以把 step 去掉，并且考虑下当前更新的 i 是不是已经超过了边界。

```java
public boolean canJump(int[] nums) { 
    int end = 0;
    int maxPosition = 0;  
    for(int i = 0; i < nums.length - 1; i++){
        //当前更新超过了边界，那么意味着出现了 0 ，直接返回 false
        if(end < i){
            return false;
        }
        //找能跳的最远的 
        maxPosition = Math.max(maxPosition, nums[i] + i); 
       
        if( i == end){ //遇到边界，就更新边界，并且步数加一
            end = maxPosition; 
        }
    }
    //最远的距离是否到答末尾
    return maxPosition>=nums.length-1;
} 	
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二 顺瓜摸藤

每次找最左边的能跳到当前位置的下标，之前的代码如下。

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

这里修改的话，只需要判断最后回没回到 0 ，并且如果 while 里的 for 循环没有进入 if ，就意味着一个位置都没找到，就要返回 false。

```java
public boolean canJump(int[] nums) { 
    int position = nums.length - 1; //要找的位置
    boolean isUpdate = false; 
    while (position != 0) { //是否到了第 0 个位置
        isUpdate = false;
        for (int i = 0; i < position; i++) {
            if (nums[i] >= position - i) {
                position = i; //更新要找的位置 
                isUpdate = true;
                break;
            }
        }
        //如果没有进入 for 循环中的 if 语句，就返回 false
        if(!isUpdate){
            return false;
        }
    }
    return true;
}
```

时间复杂度：O（n²）。

空间复杂度：O（1）。

# 解法三

让我们直击问题的本质，与 45 题不同，我们并不需要知道最小的步数，所以我们对跳的过程并不感兴趣。并且如果数组里边没有 0，那么无论怎么跳，一定可以从第 0 个跳到最后一个位置。

所以我们只需要看 0 的位置，如果有 0 的话，我们只需要看 0 前边的位置，能不能跳过当前的 0 ，如果 0 前边的位置都不能跳过当前 0，那么直接返回 false。如果能的话，就看后边的 0 的情况。

```java
public boolean canJump(int[] nums) {
    for (int i = 0; i < nums.length - 1; i++) {
        //找到 0 的位置
        if (nums[i] == 0) {
            int j = i - 1;
            boolean isCanSkipZero = false;
            while (j >= 0) {
                //判断 0 前边的元素能否跳过 0 
                if (j + nums[j] > i) {
                    isCanSkipZero = true;
                    break;
                }
                j--;
            }
            if (!isCanSkipZero) {
                return false;
            }
        }
    }
    return true;
}
```

但这样时间复杂度没有提高， 在 @Zhengwen 的提醒下，可以用下边的方法。

我们判断 0 前边的元素能否跳过 0 ，不需要每次都向前查找，我们只需要用一个变量保存当前能跳的最远的距离，然后判断最远距离和当前 0 的位置就可以了。

```java
public boolean canJump(int[] nums) {
    int max = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        if (nums[i] == 0 && i >= max) {
            return false;
        }
        max = Math.max(max, nums[i] + i);
    }
    return true;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

参考[这里](<https://leetcode.com/problems/jump-game/discuss/20917/Linear-and-simple-solution-in-C%2B%2B>)，我们甚至不需要考虑 0 的位置，只需要判断最大距离有没有超过当前的 i 。

```java
public boolean canJump(int[] nums) {
    int max = 0; 
    for (int i = 0; i < nums.length; i++) {
        if (i > max) {
            return false;
        }
        max = Math.max(max, nums[i] + i);
    }
    return true;
}
```



# 总

当自己按照 45 题的思路写完的时候，看 Solution 的时候都懵逼了，这道题竟然这么复杂？不过 Solution 把问题抽象成动态规划的思想，以及优化的过程还是非常值得学习的。