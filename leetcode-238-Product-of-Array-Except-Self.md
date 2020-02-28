# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/238.jpg)

返回一个数组，第 `i` 个位置存储原数组除了第 `i` 个数以外的所有数的乘积。

# 解法一

最直接的想法就是先把所有的数乘起来，然后对于需要返回的数组的第 `i` 个位置，只需要将所有数的累乘结果除以第 `i` 个数即可。

如果所有数的累乘结果记为 `mul`，返回的数组用 `res` 存储，原数组用 `nums` 存储，那么

 `res[i] = mul / nums[i]`。

除法的话需要考虑除零的问题，如果 `nums` 中有一个 `0`，那么 `res` 除了 `0` 的那个位置的结果是其余数累乘，其余位置的结果就都是 `0` 了。

如果 `nums` 中 `0`的个数超过一个，那么 `res` 所有结果就都是 `0` 了。

```java
public int[] productExceptSelf(int[] nums) {
    int mul = 1;
    int zeroNums = 0;
    int zeroFirst = -1;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == 0) {
            zeroNums++;
            if (zeroNums == 1) {
                zeroFirst = i;
            }
            continue;
        }
        mul *= nums[i];
    }
    int[] res = new int[nums.length];
    if (zeroNums > 1) {
        return res;
    }else if(zeroNums == 1){
        res[zeroFirst] = mul;
        return res;
    }

    for (int i = 0; i < nums.length; i++) {
        res[i] = mul / nums[i];
    }
    return res;
}
```

当然了题目中说不能用除法，恰巧在 [29 题](https://leetcode.wang/leetCode-29-Divide-Two-Integers.html) 我们用加减法实现过除法，这里的话就可以直接调用了。

```java
public int[] productExceptSelf(int[] nums) {
    int mul = 1;
    int zeroNums = 0;
    int zeroFirst = -1;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == 0) {
            zeroNums++;
            if (zeroNums == 1) {
                zeroFirst = i;
            }
            continue;
        }
        mul *= nums[i];
    }
    int[] res = new int[nums.length];
    if (zeroNums > 1) {
        return res;
    } else if (zeroNums == 1) {
        res[zeroFirst] = mul;
        return res;
    }
    for (int i = 0; i < nums.length; i++) { 
        res[i] = divide(mul, nums[i]); 
    }
    return res;
}

//下边是 29 题实现的除法
public int divide(int dividend, int divisor) {
    long ans = divide((long) dividend, (long) (divisor));
    long m = 2147483648L;
    if (ans == m) {
        return Integer.MAX_VALUE;
    } else {
        return (int) ans;
    }
}

public long divide(long dividend, long divisor) {
    long ans = 1;
    long sign = 1;
    if (dividend < 0) {
        sign = opposite(sign);
        dividend = opposite(dividend);
    }
    if (divisor < 0) {
        sign = opposite(sign);
        divisor = opposite(divisor);
    }
    long origin_dividend = dividend;
    long origin_divisor = divisor;

    if (dividend < divisor) {
        return 0;
    }

    dividend -= divisor;
    while (divisor <= dividend) {
        ans = ans + ans;
        divisor += divisor;
        dividend -= divisor;
    }
    long a = ans + divide(origin_dividend - divisor, origin_divisor);
    return sign > 0 ? a : opposite(a);
}

public long opposite(long x) {
    return ~x + 1;
}
```

# 解法二

也没有想到其他的解法，分享一个 [官方](https://leetcode.com/problems/product-of-array-except-self/solution/) 给的解法。

只要看到这张图，应该就明白算法了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/238_2.png)

白色部分表示当前准备求解的位置，其结果就是粉色部分数字的累乘再乘上黄色部分数字的累乘。换句话说，其实就是左右两部分的累乘结果再相乘

所以我们只需要把所有粉色结果和黄色结果提前保存起来，然后可以直接去计算结果了。

假设数组个数是 `n`。

我们用 `left[i]`存储下标是 `0 ~ i - 1` 的数累乘的结果。

用 `right[i]` 存储下标是 `i + 1 ~ n - 1` 的数累乘的结果。

那么 `res[i] = left[i] * right[i]`。

至于边界情况，我们把 `left[0]` 和 `right[n - 1]`初始化为 `1` 即可。

```java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int left[] = new int[n];
    left[0] = 1;
    for (int i = 1; i < n; i++) {
        left[i] = left[i - 1] * nums[i - 1];
    }
    int right[] = new int[n];
    right[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--) {
        right[i] = right[i + 1] * nums[i + 1];
    }

    int res[] = new int[n];
    for (int i = 0; i < n; i++) {
        res[i] = left[i] * right[i];
    }
    return res;
}
```

当然，我们可以省去 `left` 和 `right` 数组，先用 `res` 存储 `left` 数组的结果，然后边更新 `right` ，边和 `res` 相乘。

```java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int res[] = new int[n];
    res[0] = 1;
    for (int i = 1; i < n; i++) {
        res[i] = res[i - 1] * nums[i - 1];
    }
    int right = 1;
    for (int i = n - 2; i >= 0; i--) {
        right = right * nums[i + 1];
        res[i] = res[i] * right;
    }
    return res;
}
```

# 总

解法二应该是出题人的意思，关键就是认识到那个图，有种分类的意思，把其余的数分成了左半部分和右半部分。解法一的话有种作弊的感觉，哈哈。