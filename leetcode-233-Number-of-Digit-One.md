# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/233.jpg)

给一个数 `n`，输出 `0 ~ n` 中的数字中 `1` 出现的个数。

# 解法一 暴力

直接想到的当然就是暴力的方法，一个数一个数的判断，一位一位的判断。

```java
public int countDigitOne(int n) {
    int num = 0;
    for (int i = 1; i <= n; i++) {
        int temp = i;
        while (temp > 0) {
            if (temp % 10 == 1) {
                num++;
            }
            temp /= 10;
        }
    }
    return num;
}
```

但这个解法会超时。

# 解法二

自己也没想到别的方法，讲一下 [这里](https://leetcode.com/problems/number-of-digit-one/discuss/64382/JavaPython-one-pass-solution-easy-to-understand) 的思路。

总体思想就是分类，先求所有数中个位是 `1` 的个数，再求十位是 `1` 的个数，再求百位是 `1` 的个数...

假设 `n = xyzdabc`，此时我们求千位是 `1` 的个数，也就是 `d` 所在的位置。

那么此时有三种情况，

* `d == 0`，那么千位上 `1` 的个数就是 `xyz * 1000`
* `d == 1`，那么千位上 `1` 的个数就是 `xyz * 1000 + abc + 1`
* `d > 1`，那么千位上 `1` 的个数就是 `xyz * 1000 + 1000`

为什么呢？

当我们考虑千位是 `1` 的时候，我们将千位定为 `1`，也就是 `xyz1abc`。

对于 `xyz` 的话，可以取 `0,1,2...(xyz-1)`，也就是 `xyz` 种可能。

当 `xyz` 固定为上边其中的一个数的时候，`abc` 可以取  `0,1,2...999`，也就是 `1000` 种可能。

这样的话，总共就是 `xyz*1000` 种可能。

注意到，我们前三位只取到了 `xyz-1`，那么如果取 `xyz` 呢？

此时就出现了上边的三种情况，取决于 `d` 的值。

`d == 1` 的时候，千位刚好是 `1`，此时 `abc` 可以取的值就是 `0` 到 `abc` ，所以多加了 `abc + 1`。

`d > 1` 的时候，`d` 如果取 `1`，那么 `abc` 就可以取 `0` 到 `999`，此时就多加了 `1000`。

再看一个具体的例子。

```java
如果n = 4560234
让我们统计一下千位有多少个 1
xyz 可以取 0 到 455, abc 可以取 0 到 999
4551000 to 4551999 (1000)
4541000 to 4541999 (1000)
4531000 to 4531999 (1000)
...
  21000 to   21999 (1000)
  11000 to   11999 (1000)    
   1000 to    1999 (1000)
总共就是 456 * 1000

如果 n = 4561234
xyz 可以取 0 到 455, abc 可以取 0 到 999
4551000 to 4551999 (1000)
4541000 to 4541999 (1000)
4531000 to 4531999 (1000)
...
1000 to 1999 (1000)
xyz 还可以取 456, abc 可以取 0 到 234
4561000 to 4561234 (234 + 1)
总共就是 456 * 1000 + 234 + 1

如果 n = 4563234
xyz 可以取 0 到 455, abc 可以取 0 到 999    
4551000 to 4551999 (1000)
4541000 to 4541999 (1000)
4531000 to 4531999 (1000)
...
1000 to 1999 (1000)
xyz 还可以取 456, abc 可以取 0 到 999
4561000 to 4561999 (1000)
总共就是 456 * 1000 + 1000
```

至于其它位的话是一样的道理。

代码的话就很好写了。

```java
public int countDigitOne(int n) {
    int count = 0;
    //依次考虑个位、十位、百位...是 1
    //k = 1000, 对应于上边举的例子
    for (int k = 1; k <= n; k *= 10) { 
        // xyzdabc
        int abc = n % k;
        int xyzd = n / k;
        int d = xyzd % 10;
        int xyz = xyzd / 10;
        count += xyz * k;
        if (d > 1) {
            count += k;
        }
        if (d == 1) {
            count += abc + 1;
        }
        //如果不加这句的话，虽然 k 一直乘以 10，但由于溢出的问题
        //k 本来要大于 n 的时候，却小于了 n 会再次进入循环
        //此时代表最高位是 1 的情况也考虑完成了
        if(xyz == 0){
            break;
        }
    }
    return count;
}
```

然后代码的话，可以再简化一下，注意到 `d > 1` 的时候，我们多加了一个 `k`。

我们可以通过计算 `long xyz = xyzd / 10;` 的时候，给 `xyzd` 多加 `8`，从而使得当 `d > 1` 的时候，此时求出来的 `xyz` 会比之前大 `1`，这样计算 `xyz * k` 的时候就相当于多加了一个 `k`。

此外，上边 `k` 溢出的问题，我们可以通过 `long`  类型解决。

```java
public int countDigitOne(int n) {
    int count = 0;
    for (long k = 1; k <= n; k *= 10) {
        // xyzdabc
        int abc = n % k;
        int xyzd = n / k;
        int d = xyzd % 10;
        int xyz = (xyzd + 8) / 10;
        count += xyz * k;
        if (d == 1) {
            count += abc + 1;
        }
    }
    return count;
}
```

而这个代码，其实和 Solution [高赞](https://leetcode.com/problems/number-of-digit-one/discuss/64381/4%2B-lines-O(log-n)-C%2B%2BJavaPython) 中的解法是一样的，只不过省去了 `xyz` 和 `d` 这两个变量。

```java
public int countDigitOne(int n) {
    int count = 0;

    for (long k = 1; k <= n; k *= 10) {
        long r = n / k, m = n % k;
        // sum up the count of ones on every place k
        count += (r + 8) / 10 * k + (r % 10 == 1 ? m + 1 : 0);
    }

    return count;
}
```

# 总

这道题的话，就是数学的分类、找规律的题目了，和 [172 题](https://leetcode.wang/leetcode-172-Factorial-Trailing-Zeroes.html) 找阶乘中 `0` 的个数一样，没有一些通用的算法，完全靠分析能力，如果面试碰到很容易卡主。