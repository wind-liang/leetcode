## 题目描述（简单难度）

![](http://windliang.oss-cn-beijing.aliyuncs.com/7_rev.jpg)

很简单，就是输入整数，输出它的倒置。

第一反应就是， 取余得到个位数，然后除以 10 去掉个位数，然后用一个变量保存倒置的数。

```java
public int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        rev = rev * 10 + pop;
    }
    return rev;
}
```

然后似乎不是那么理想。

![](http://windliang.oss-cn-beijing.aliyuncs.com/7_1.jpg)

为什么呢？倒置过来不应该是 9646324351 吗。其实题目里讲了，int 的范围是 $$[-2^{31} ,2^{31}-1]$$ 也就是 $$[-2147483648,2147483647] $$ 。明显 9646324351 超出了范围，造成了溢出。所以我们需要在输出前，判断是否溢出。

问题的关键就是下边的一句了。

 rev = rev * 10 + pop;

为了区分两个 rev ，更好的说明，我们引入 temp 。

temp = rev * 10 + pop;

rev = temp;

我们对 temp = rev * 10 + pop; 进行讨论。intMAX = 2147483647 , intMin = -  2147483648 。

对于大于 intMax 的讨论，此时 x 一定是正数，pop 也是正数。

* 如果 rev > intMax / 10 ，那么没的说，此时肯定溢出了。
* 如果 rev == intMax / 10 = 2147483647 / 10 = 214748364 ，此时 rev * 10 就是 2147483640 如果 pop 大于 7 ，那么就一定溢出了。但是！如果假设 pop 等于 8，那么意味着原数 x 是 8463847412 了，输入的是 int ，而此时是溢出的状态，所以不可能输入，所以意味着 pop 不可能大于 7 ，也就意味着 rev == intMax / 10 时不会造成溢出。
* 如果 rev < intMax / 10 ，意味着 rev 最大是 214748363 ， rev * 10 就是 2147483630 , 此时再加上 pop ，一定不会溢出。 

对于小于 intMin 的讨论同理。

```java
public int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        if (rev > Integer.MAX_VALUE/10 ) return 0;
        if (rev < Integer.MIN_VALUE/10 ) return 0;
        rev = rev * 10 + pop;
    }
    return rev;
}
```

时间复杂度：循环多少次呢？数字有多少位，就循环多少次，也就是 $$log_{10}(x) + 1$$ 次，所以时间复杂度是 O（log（x））。

空间复杂度：O（1）。

当然我们可以不用思考那么多，用一种偷懒的方式 AC ，我们直接把 rev 定义成 long ，然后输出前判断 rev 是不是在范围内，不在的话直接输出 0 。

```java
public int reverse(int x) {
    long rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        rev = rev * 10 + pop;
    }
    if (rev > Integer.MAX_VALUE || rev < Integer.MIN_VALUE ) return 0;
    return (int)rev;
}
```

## 总结

比较简单的一道题，主要是在考判断是不是溢出，又是轻松的一天！

