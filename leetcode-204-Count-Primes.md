# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/204.jpg)

求出小于 `n` 的素数个数。

# 解法一

遍历 `2` 到 `n - 1` ，依次判断当前数是否是素数。

判断 `n` 是否是素数，只需要判断 `2` 到 `n - 1` 是否是 `n` 的因子，如果有一个是，那就表明 `n` 不是素数。

判断素数可以做一个优化，那就是不需要判断 `2` 到 `n - 1`，只需要判断`2` 到 `sqrt(n)` 也就是根号 `n` 即可。因为如果存在超过根号 `n` 的因子，那么一定存在小于根号 `n` 的数与之对应。

```java
public int countPrimes(int n) {
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (isPrime(i)) {
            count++;
        }
    }
    return count;
}

private boolean isPrime(int n) {
    int sqrt = (int) Math.sqrt(n);
    for (int i = 2; i <= sqrt; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}
```

# 解法二

空间换时间，参考 [这里](https://leetcode.com/problems/count-primes/discuss/57588/My-simple-Java-solution)。

用一个数组表示当前数是否是素数。

然后从 `2` 开始，将 `2` 的倍数，`4`、`6`、`8`、`10` ...依次标记为非素数。

下个素数 `3`，将 `3` 的倍数，`6`、`9`、`12`、`15` ...依次标记为非素数。

下个素数 `7`，将 `7` 的倍数，`14`、`21`、`28`、`35` ...依次标记为非素数。

在代码中，因为数组默认值是 `false` ，所以用 `false` 代表当前数是素数，用 `true` 代表当前数是非素数。

```java
public int countPrimes(int n) {
    boolean[] notPrime = new boolean[n];
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (!notPrime[i]) {
            count++;
            //将当前素数的倍数依次标记为非素数
            for (int j = 2; j * i < n; j++) {
                notPrime[j * i] = true;
            }
        }
    }
    return count;
}
```

# 总

解法二中空间换时间的思想在编程中经常用到。