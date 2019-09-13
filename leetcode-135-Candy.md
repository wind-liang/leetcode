# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/135.jpg)

给 N 个小朋友分糖，每个人至少有一颗糖。并且有一个 `rating` 数组，如果小朋友的 `rating`比它旁边小朋友的 `rating` 大（不包括等于），那么他必须要比对应小朋友的糖多。问至少需要分配多少颗糖。

用 `-` 表示糖，举几个例子。

```java
1 0 2
- - -
-   -
总共就需要 5 颗糖。

1 2 2
- - -
  -
总共就需要 4 颗糖。
```

# 解法一

根据题目，首先每个小朋友会至少有一个糖。

如果当前小朋友的 `rating` 比后一个小朋友的小，那么后一个小朋友的糖肯定是当前小朋友的糖加 `1`。

比如 `ration = [ 5, 6, 7]` ，那么三个小朋友的糖就依次是 `1 2 3 `。

如果当前小朋友的 `rating` 比后一个小朋友的大，那么理论上当前小朋友的糖要比后一个的小朋友的糖多，但此时后一个小朋友的糖还没有确定，怎么办呢？

参考 [32题](<https://leetcode.wang/leetCode-32-Longest-Valid-Parentheses.html?q=#%E8%A7%A3%E6%B3%95%E4%BA%94-%E7%A5%9E%E5%A5%87%E8%A7%A3%E6%B3%95>) 的解法五，利用正着遍历，再倒着遍历的思想。

首先我们正着遍历一次，只考虑当前小朋友的 `rating` 比后一个小朋友的小的情况。

接着再倒着遍历依次，继续考虑当前小朋友的 `rating` 比后一个小朋友的小的情况。因为之前已经更新过一次糖果了，此时后一个小朋友的糖如果已经比当前小朋友的糖多了，就不需要进行更新了。

举个例子

```java
初始化每人一个糖
1 2 3 2 1 4
- - - - - -.
    
只考虑当前小朋友的 rating 比后一个小朋友的小的情况,后一个小朋友的糖是当前小朋友的糖加 1。
1 < 2
1 2 3 2 1 4
- - - - - -
  -   

2 < 3
1 2 3 2 1 4
- - - - - -
  - -
    -

3 > 2 不考虑

2 > 1 不考虑

1 < 4
1 2 3 2 1 4
- - - - - -
  - -     -
    -
    
倒过来重新进行
继续考虑当前小朋友的 rating 比后一个小朋友的小的情况。此时后一个小朋友的糖如果已经比当前小朋友的糖多了，就不需要进行更新。
4 1 2 3 2 1
- - - - - -
-     - -
      -
    
4 > 1 不考虑

1 < 2
4 1 2 3 2 1
- - - - - -
-   - - -
      -    
    
2 < 3，3 的糖果已经比 2 的多了，不需要考虑

3 > 2，不考虑

2 > 1，不考虑

所以最终的糖的数量就是上边的 - 的和。
```

代码的话，我们用一个 `candies` 数组保存当前的分配情况。

```java
public int candy(int[] ratings) {
    int n = ratings.length;
    int[] candies = new int[n];
    //每人发一个糖
    for (int i = 0; i < n; i++) {
        candies[i] = 1;
    }
    //正着进行
    for (int i = 0; i < n - 1; i++) {
        //当前小朋友的 rating 比后一个小朋友的小,后一个小朋友的糖是当前小朋友的糖加 1。
        if (ratings[i] < ratings[i + 1]) {
            candies[i + 1] = candies[i] + 1;
        }
    }
    //倒着进行
    //下标顺序就变成了 i i-1 i-2 i-3 ... 0
    //当前就是第 i 个，后一个就是第 i - 1 个
    for (int i = n - 1; i > 0; i--) {
        //当前小朋友的 rating 比后一个小朋友的小
        if (ratings[i] < ratings[i - 1]) {
            //后一个小朋友的糖果树没有前一个的多，就更新后一个等于前一个加 1
            if (candies[i - 1] <= candies[i]) {
                candies[i - 1] = candies[i] + 1;
            }

        }
    }
    //计算糖果总和
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += candies[i];
    }
    return sum;
}
```

时间复杂度：O（n）。

空间复杂度：O（n）。

# 解法二

参考 [这里](<https://leetcode.com/problems/candy/discuss/42770/One-pass-constant-space-Java-solution>)。

解法一中，考虑到

> 如果当前小朋友的 `rating` 比后一个小朋友的大，那么理论上当前小朋友的糖要比后一个的小朋友的糖多，但此时后一个小朋友的糖还没有确定，怎么办呢？

之前采用了倒着遍历一次的方式进行了解决，这里再考虑另外一种解法。

考虑下边的情况。

![](https://windliang.oss-cn-beijing.aliyuncs.com/135_2.jpg)

对于第 `2` 个 `rating 4`，它比后一个 `rating` 要大，所以要取决于再后边的 `rating`，一直走到 `2`，也就是山底，此时对应的糖果数是 `1`，然后往后走，走回山顶，糖果数一次加 `1`，也就是到 `rating 4` 时，糖果数就是 `3` 了。

再一般化，山顶的糖果数就等于从左边的山底或右边的山底依次加 `1` 。

所以我们的算法只需要记录山顶，然后再记录下坡的高度，下坡的高度刚好是一个等差序列可以直接用公式求和。而山顶的糖果数，取决于左边山底到山顶和右边山底到山顶的哪个高度大。

而产生山底可以有两种情况，一种是 `rating` 产生了增加，如上图。还有一种就是 `rating` 不再降低，而是持平。

知道了上边的想法，基本上就可以写代码了，每个人写出来的应该都不一样，在 `discuss` 区也看到了很多不同的写法，下边说一下我的思路。

抽象出四种情况，这里的高度不是 `rating` 进行相减，而是从山底的 `rating` 到山顶的 `rating` 经过的次数。

1. 左边山底到山顶的高度大，并且右边山底后继续增加。

   ![](https://windliang.oss-cn-beijing.aliyuncs.com/135_3.jpg)

2. 左边山底到山顶的高度大，并且右边山底是平坡。

   ![](https://windliang.oss-cn-beijing.aliyuncs.com/135_4.jpg)

3. 右边山底到山顶的高度大，并且右边山底后继续增加。

   ![](https://windliang.oss-cn-beijing.aliyuncs.com/135_2.jpg)

4. 右边山底到山顶的高度大，并且右边山底是平坡。

   ![](https://windliang.oss-cn-beijing.aliyuncs.com/135_5.jpg)



有了这四种情况就可以写代码了。

我们用 `total` 变量记录糖果总和， `pre` 变量记录前一个小朋友的糖果数。如果当前的 `rating` 比前一个的 `rating` 大，那么说明在走上坡，可以把前一个小朋友的糖果数加到 `total` 中，并且更新 `pre` 为当前小朋友的糖果数。

如果当前的 `rating` 比前一个的 `rating` 小，说明开始走下坡，用 `down` 变量记录连续多少次下降，此时的 `pre` 记录的就是从左边山底到山底的高度。当出现平坡或上坡的时候，将所有的下坡的糖果数利用等差公式计算。此外根据 `pre`  和 `down` 决定山顶的糖果数。

根据当前是上坡还是平坡，来更新 `pre`。

大框架就是上边的想法了，还有一些边界需要考虑一下，看一下代码。

```java
public int candy(int[] ratings) {
    int n = ratings.length;
    int total = 0;
    int down = 0;
    int pre = 1;
    for (int i = 1; i < n; i++) {
        //当前是在上坡或者平坡
        if (ratings[i] >= ratings[i - 1]) {
            //之前出现过了下坡
            if (down > 0) {
                //山顶的糖果数大于下降的高度，对应情况 1
                //将下降的糖果数利用等差公式计算，单独加上山顶
                if (pre > down) {
                    total += count(down);
                    total += pre;
                //山顶的糖果数小于下降的高度，对应情况 3，
                //将山顶也按照等差公式直接计算进去累加
                } else {
                    total += count(down + 1);
                }
                
                //当前是上坡，对应情况 1 或者 3
                //更新 pre 等于 2
                if (ratings[i] > ratings[i - 1]) {
                    pre = 2;
                
                //当前是平坡，对应情况 2 或者 4
                //更新 pre 等于 1
                } else {
                    pre = 1;
                }
                down = 0;
            //之前没有出现过下坡
            } else {
                //将前一个小朋友的糖果数相加
                total += pre;
                //如果是上坡更新当前糖果数是上一个的加 1
                if (ratings[i] > ratings[i - 1]) {
                    pre = pre + 1;
                //如果是平坡，更新当前糖果数为 1
                } else {
                    pre = 1;
                }

            }
        } else {
            down++;
        }
    }
    //判断是否有下坡
    if (down > 0) {
        //和之前的逻辑一样进行相加
        if (pre > down) {
            total += count(down);
            total += pre;
        } else {
            total += count(down + 1);
        }
    //将最后一个小朋友的糖果计算
    } else {
        total += pre;
    }
    return total;
}

//等差数列求和
private int count(int n) {
    return (1 + n) * n / 2;
}

```

这个算法相对于解法一的好处就是将空间复杂度从 `O(n)` 优化到了 `O(1)`。

# 总

解法一虽然空间复杂度大一些，但是很好理解，正着遍历，倒着遍历的思想，每次遇到都印象深刻。解法二主要是对问题进行深入考虑，虽然麻烦些，但空间复杂度确实优化了。