# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/60.jpg)

又是一道全排列的题，之前在[31题](https://leetcode.windliang.cc/leetCode-31-Next-Permutation.html?h=permu)，[46题](https://leetcode.windliang.cc/leetCode-46-Permutations.html)，也讨论过全排列问题的一些解法。这道题的话，是给一个 n，不是输出它的全排列，而是把所有组合从从小到大排列后，输出第 k 个。

# 解法一

以 n = 4 为例，可以结合下图看一下。因为是从小到大排列，那么最高位一定是从 1 到 4。然后可以看成一组一组的，我们只需要求出组数，就知道最高位是多少了。而每组的个数就是 n - 1 的阶乘，也就是 3 的阶乘 6。

![](https://windliang.oss-cn-beijing.aliyuncs.com/60_2.jpg)

算组数的时候， 1 到 5 除以 6 是 0，6 除以 6 是 1，而 6 是属于第 0 组的，所有要把 k 减去 1。这样做除法结果就都是 0 了。

```java
int perGroupNum = factorial(n - 1); 
int groupNum = (k - 1) / perGroupNum;
```

当然，还有一个问题下次 k 是多少了。求组数用的除法，余数就是下次的 k 了。因为 k 是从 1 计数的，所以如果 k 刚好等于了 perGroupNum 的倍数，此时得到的余数是 0 ，而其实由于我们求 groupNum 的时候减 1 了，所以此时 k 应该更新为 perGroupNum。

```java
k = k % perGroupNum; 
k = k == 0 ? perGroupNum : k;
```

举个例子，如果 k = 6，那么 groupNum = ( k - 1 ) / 6 = 0， k % perGroupNum = 6 % 6 = 0，而下次的 k ，可以结合上图，很明显是 perGroupNum ，依旧是 6。

结合下图，确定了最高位属于第 0 组，下边就和上边的情况一样了。唯一不同的地方是最高位是 2 3 4，没有了 1。所有得到 groupNum 怎么得到最高位需要考虑下。

我们可以用一个 list 从小到大保存 1 到 n，每次选到一个就去掉，这样就可以得到 groupNum 对应的数字了。

```java
List<Integer> nums = new ArrayList<Integer>();
for (int i = 0; i < n; i++) {
    nums.add(i + 1);
}
int perGroupNum = factorial(n - 1);
int groupNum = (k - 1) / perGroupNum;
int num = nums.get(groupNum); //根据 groupNum 得到当前位
nums.remove(groupNum);//去掉当前数字
```



![](https://windliang.oss-cn-beijing.aliyuncs.com/60_3.jpg)

综上，我们把它们整合在一起。

```java
public String getPermutation(int n, int k) {
    List<Integer> nums = new ArrayList<Integer>();
    for (int i = 0; i < n; i++) {
        nums.add(i + 1);
    }
    return getAns(nums, n, k);
}

private String getAns(List<Integer> nums, int n, int k) {
    if (n == 1) {
        //把剩下的最后一个数字返回就可以了
        return nums.get(0) + "";
    }
    int perGroupNum = factorial(n - 1); //每组的个数
    int groupNum = (k - 1) / perGroupNum;
    int num = nums.get(groupNum);
    nums.remove(groupNum);
    k = k % perGroupNum; //更新下次的 k 
    k = k == 0 ? perGroupNum : k;
    return num + getAns(nums, n - 1, k);
}
public int factorial(int number) {
    if (number <= 1)
        return 1;
    else
        return number * factorial(number - 1);
}
```

时间复杂度：

空间复杂度：

这是最开始自己的想法，有 3 点可以改进一下。

第 1 点，更新 k 的时候，有一句 

```java
k = k % perGroupNum; //更新下次的 k 
k = k == 0 ? perGroupNum : k;
```

很不优雅了，问题的根源就在于问题给定的 k 是从 1 编码的。我们只要把 k - 1 % perGroupNum，这样得到的结果就是 k 从 0 编码的了。然后求 groupNum = (k - 1) / perGroupNum; 这里 k 也不用减 1 了。

第 2 点，这个算法很容易改成改成迭代的写法，只需要把递归的函数参数， 在每次迭代更新就够了。

第 3 点，我们求 perGroupNum 的时候，每次都调用了求迭代的函数，其实没有必要的，我们只需要一次循环求出 n 的阶乘。然后在每次迭代中除以 nums 的剩余个数就够了。

综上，看一下优化过的代码吧。

```java
public String getPermutation(int n, int k) {
    List<Integer> nums = new ArrayList<Integer>();
    int factorial = 1;
    for (int i = 0; i < n; i++) {
        nums.add(i + 1);
        if (i != 0) {
            factorial *= i;
        }
    }
    factorial *= n; //先求出 n 的阶乘
    StringBuilder ans = new StringBuilder();
    k = k - 1; // k 变为 k - 1
    for (int i = n; i > 0; i--) { 
        factorial /= (nums.size()); //更新为 n - 1 的阶乘
        int groupNum = k / factorial;
        int num = nums.get(groupNum);
        nums.remove(groupNum);
        k = k % factorial;
        ans.append(num);  

    }
    return ans.toString();
}
```

时间复杂度：O（n），当然如果 remove 函数的时间是复杂度是 O（n），那么整体上就是 O（n²）。

空间复杂度：O（1）。

# 总

这道题其实如果写出来，也不算难，优化的思路可以了解一下。