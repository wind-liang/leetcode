# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/171.jpg)

根据对应规则，将字符串转为对应的数字。

# 解法一

这道题就是 [168](https://leetcode.wang/leetcode-168-Excel-Sheet-Column-Title.html) 题的逆过程，其实之前已经讲过怎么转换了，可以先过去看一下。

类比于我们最熟悉的十进制，对于 `2019` 可以看成下边的样子。

$$2\times10^3+0\times10^2+1\times10^1+9\times10^0=2019$$

这道题本质上其实就是一个稍微有些不一样的 `26` 进制，具体为什么在  [168](https://leetcode.wang/leetcode-168-Excel-Sheet-Column-Title.html) 题中已经分析过了。

转换的话，其实只需要把上边基数 `10` 换成 `26` 即可。

$$...x_4\times26^3+x_3\times26^2+x_2\times26^1+x_1\times26^0$$

所以给定一个数的时候，我们可以从右往左算，依次乘 `26` 的 `0,1,2...` 次幂，再累加即可。

```java
public int titleToNumber(String s) {
    char[] c = s.toCharArray();
    int res = 0;
    int mul = 1;
    for (int i = c.length - 1; i >= 0; i--) {
        res = res + mul * (c[i] - 'A' + 1);
        mul *= 26;
    }
    return res;
}
```

`c[i] - 'A' + 1` 这里字符做差，就相当于 ASCII 码对应的数字做差，从而算出当前字母对应的数字。

# 解法二

上边是比较直接的解法，在 [这里](https://leetcode.com/problems/excel-sheet-column-number/discuss/52091/Here-is-my-java-solution) 又看到另外一种解法。

上边的解法我们是倒着遍历的，那么我们能不能正着遍历呢？换言之，如果先给你高位的数，再给你低位的数，你怎么进行累加呢。

其实在十进制运算中我们经常使用的，比如要还原的数字是 `2019`，依次给你数字 `2,0,1,9`。就可以用下边的算法。

```java
int res = 0;
res = res * 10 + 2; //2
res = res * 10 + 0; //20
res = res * 10 + 1; //201
res = res * 10 + 9; //2019
```

直观上，我们每次乘 `10` 就相当于把每一位左移了一位，然后再把当前位加到低位。

那么具体上是为什么呢？还是要回到我们的等式

$$2\times10^3+0\times10^2+1\times10^1+9\times10^0=2019$$

将所有的 `10` 提取出来 。

$$10\times(2\times10^2+0\times10^1+1\times10^0)+9=2019$$

$$10\times(10\times(2\times10^1+0\times10^0)+1)+9=2019$$

$$10\times(10\times(10\times(10\times0 + 2)+0)+1)+9=2019$$

然后我们就会发现，我们每次做的就是将结果乘以 `10`，然后加上给定的数字。

而对于 `26` 进制是一样的道理，只需要把 `10` 改成 `26` 即可。

```java
public int titleToNumber(String s) {
    char[] c = s.toCharArray();
    int res = 0;
    for (int i = 0; i < c.length; i++) {
        res = res * 26 + (c[i] - 'A' + 1);
    }
    return res;
}
```

# 总

这道题依旧是进制转换。