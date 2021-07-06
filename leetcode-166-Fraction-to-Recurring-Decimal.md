# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/166.jpg)

算除法，如果是循环小数，要把循环的部分用括号括起来。

# 解法一

这道题说简单的话，其实就是模拟下我们算除法的过程。

说难的话，有很多坑的地方要注意下，自己也是提交了好几次，才 `AC` 的，需要考虑很多东西。

首先说一下我们要模拟一下什么过程，以 `20/11` 为例。

第一次得到的商，就是我们的整数部分，`int` 间运算就可以直接取到整数部分了，记为 `integer`。

也就是 `integer = 20 / 11 = 1`。

然后回想一下我们用竖式计算的过程。

如下图，首先得到了商是 `1`，余数是 `9`。在程序中得到余数的话，可以用 `被除数 - 商 * 除数`。

也就是 `20 - 1 * 11 = 9`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/166_2.jpg)

如下图，接下来我们将余数乘以 `10` 做为新的被除数，继续把 `11` 当做除数。然后得到商和新的余数。

也就是计算 `90 / 11`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/166_3.jpg)

如下图，接下来重复上边的过程，用余数乘以 `10` 做为新的被除数，继续把 `11` 当做除数。然后得到商和新的余数。

也就是计算 `20 / 11`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/166_4.jpg)

如下图，接下来继续重复上边的过程，用余数乘以 `10` 做为新的被除数，继续把 `11` 当做除数。然后得到商和新的余数。

也就是计算 `90 / 11`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/166_5.jpg)

那么什么时候结束呢？

* 第一种情况，余数为 `0`，说明没有循环小数。

* 第二种情况，一开始这里爬坑了。开始觉得只要商里边出现重复的数字（不考虑整数部分的数字，也就是上边例子的第一个 `1`），就可以认为出现了循环小数。

  比如上边的例子，`8` 第二次出现，所以到这里不再计算。而循环小数部分就是和当前数字重复的位置到当前位置的前一个，也就是 `81`。所以最终结果就是 `1.(81)`。

  但提交的时候，出现了一个反例，如下图。

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/166_6.jpg)

  虽然出现了重复的 `8`，但最终结果并不是 `8` 循环。很明显下次是 `40 / 17`，需要商 `2`。至于原因就是两次商 `8` 所对应的被除数并不一样，第一次是 `150` ，第二次是 `140`。
  
  所以为了判断是否出现循环小数，我们不应该判断是否出现了重复的商，而是应该判断是否出现了重复的被除数。

经过上边的分析，循环也很明显了。被除数除以除数，记录商。然后余数乘以 `10` 做为新的被除数继续除以除数。直到余数为 `0` 或者出现重复的被除数。

记录商的话，我们将整数部分和小数部分单独记录。因为小数部分要累积记录，一开始我用的是一个 `int` 去保存小数部分。比如第一个商是 `1`，第二个商是 `2`，我把之前的商乘以 `10` 再加上新的商。也就是 `1 * 10 + 2 = 12`，当第三个商 `5` 来的时候，就是 `12 * 10 + 5 = 125`，看起来很完美。

但比如上边的例子 `1/17` ，小数部分第一个商是 `0`，第二个商是 `5`，如果按上边的记录方法，记录的就是 `5`，而不是 `05`。另外，如果商的部分数字过多的话，还会产生溢出，所以最终用 `String` 记录了商，每次将新的商加到 `String` 中即可。

还有一个问题就是怎么判断是否出现了重复的商？

很简单，用一个 `HashMap`，`key` 记录出现过的被除数，`value` 记录商出现的位置，这样当出现重复被除数的时候，通过 `value` 立刻知道循环的小数部分是多少。

最后一个问题，我们只考虑了正数除以正数的例子，对于正数除以负数或者负数除以负数呢？和我们在纸上算一样，先确定商的符号，然后将被除数和除数都转为正数即可。

上边的操作会带来一个问题，对于 `java`  而言，`int` 类型的话，负数的最小值是 `-2147483648`，正数的最大值是 `2147483647`，并不能把`-2147483648` 转成正数，至于原因的话可以参考这篇文章，[补码](https://zhuanlan.zhihu.com/p/67227136)。 

溢出这个问题其实不是这个题的关键，所以我们直接用数据范围更大的 `long` 去存数字就可以了。

```java
public String fractionToDecimal(int numerator, int denominator) {
    long num = numerator;
    long den = denominator;
    String sign = "";
    //确定符号
    if (num > 0 && den < 0 || num < 0 && den > 0) {
        sign = "-";
    }
    //转为正数
    num = Math.abs(num);
    den = Math.abs(den);
    //记录整数部分
    long integer = num / den;
    //计算余数
    num = num - integer * den;
    HashMap<Long, Integer> map = new HashMap<>();
    int index = 0;
    String decimal = "";//记录小数部分
    int repeatIndex = -1;//保存重复的位置
    while (num != 0) {
        num *= 10;//余数乘以 10 作为新的被除数
        if (map.containsKey(num)) {
            repeatIndex = map.get(num);
            break;
        }
        //保存被除数
        map.put(num, index);
        //保存当前的商
        long decimalPlace = num / den;
        //加到所有的商中
        decimal = decimal + decimalPlace;
        //计算新的余数
        num = num - decimalPlace * den;
        index++;
    }
    //是否存在循环小数
    if (repeatIndex != -1) {
        String dec = decimal;
        return sign + integer + "." + dec.substring(0, repeatIndex) + "(" + dec.substring(repeatIndex) + ")";
    } else {
        if (decimal == "") {
            return sign + integer;
        } else {
            return sign + integer + "." + decimal;
        }
    }
}
```

有人可能会问，如果数字很大，又超过了 `long` 怎么办，一种方案是之前写过的 [29 题](https://leetcode.wang/leetCode-29-Divide-Two-Integers.html)，因为负数存的数更多，所以我们可以把负数当做正数，正数当做负数，所有的计算都在负数范围内计算。另一种方案的话， `java` 其实已经提供了大数类 `BigInteger` 供我们使用，就不存在溢出的问题了。至于原理的话，应该和第 [2 题](https://leetcode.wang/leetCode-2-Add-Two-Numbers.html) 大数相加一样，把数字用链表去存储，这样多大的数字都能进行存储了，然后把运算法则都封装成方法即可。

# 总

这道题其实就是模拟我们平时在纸上竖式计算的过程，其中一些问题要注意下，溢出的问题，正负数的问题等等。`HashMap` 来处理重复值的技巧，经常用到了。

