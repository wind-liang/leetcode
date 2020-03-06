# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/258.jpg)

将给定的数字的各个位相加得到新的数字，一直重复这个过程，直到这个数小于 `10`，将这个数输出。

# 解法一

开始有点不明所以，直接用递归或者循环按照题目的意思写不就行了吗，先用递归尝试了一下。

```java
public int addDigits(int num) {
    if (num < 10) {
        return num;
    }
    int next = 0;
    while (num != 0) {
        next = next + num % 10;
        num /= 10;
    }
    return addDigits(next);
}
```

没想到直接通过了，上边的递归很简单可以直接写成迭代的形式。

```java
public int addDigits(int num) {
    while (num >= 10) {
        int next = 0;
        while (num != 0) {
            next = next + num % 10;
            num /= 10;
        }
        num = next;
    }
    return num;
}
```

# 解法二 数学上

看了下 `Discuss` ，原来要求的数叫做数字根，看下 [维基百科](https://zh.wikipedia.org/wiki/數根) 的定义。

> 在[数学](https://zh.wikipedia.org/wiki/數學)中，**数根**(又称**位数根**或**数字根**Digital root)是[自然数](https://zh.wikipedia.org/wiki/自然數)的一种[性质](https://zh.wikipedia.org/w/index.php?title=性質&action=edit&redlink=1)，换句话说，每个[自然数](https://zh.wikipedia.org/wiki/自然數)都有一个**数根**。
>
> 数根是将一[正整数](https://zh.wikipedia.org/wiki/正整數)的各个[位数](https://zh.wikipedia.org/wiki/位數)相加（即横向相加），若加完后的值大于[10](https://zh.wikipedia.org/wiki/10)的话，则继续将各位数进行横向相加直到其值小于[十](https://zh.wikipedia.org/wiki/十)为止[[1\]](https://zh.wikipedia.org/wiki/數根#cite_note-數學的神祕奇趣-1)，或是，将一数字重复做[数字和](https://zh.wikipedia.org/wiki/数字和)，直到其值小于[十](https://zh.wikipedia.org/wiki/十)为止，则所得的值为该数的**数根**。
>
> 例如54817的数根为[7](https://zh.wikipedia.org/wiki/7)，因为[5](https://zh.wikipedia.org/wiki/5)+[4](https://zh.wikipedia.org/wiki/4)+[8](https://zh.wikipedia.org/wiki/8)+[1](https://zh.wikipedia.org/wiki/1)+[7](https://zh.wikipedia.org/wiki/7)=[25](https://zh.wikipedia.org/wiki/25)，[25](https://zh.wikipedia.org/wiki/25)[大于](https://zh.wikipedia.org/wiki/大于)10则再[加](https://zh.wikipedia.org/wiki/加)一次，[2](https://zh.wikipedia.org/wiki/2)+[5](https://zh.wikipedia.org/wiki/5)=[7](https://zh.wikipedia.org/wiki/7)，[7](https://zh.wikipedia.org/wiki/7)[小于](https://zh.wikipedia.org/wiki/小于)十，则7为54817的数根。

然后是它的用途。

> 数根可以计算[模运算](https://zh.wikipedia.org/wiki/模运算)的[同余](https://zh.wikipedia.org/wiki/同餘)，对于非常大的数字的情况下可以节省很多[时间](https://zh.wikipedia.org/wiki/時間)。
>
> 数字根可作为一种检验计算正确性的方法。例如，两数字的和的数根等于两数字分别的数根的和。
>
> 另外，数根也可以用来判断数字的整除性，如果数根能被3或9整除，则原来的数也能被3或9整除。

接下来讨论我们怎么求出树根。

我们把 `1` 到 `30` 的树根列出来。

```java
原数: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
数根: 1 2 3 4 5 6 7 8 9  1  2  3  4  5  6  7  8  9  1  2  3  4  5  6  7  8  9  1  2  3 
```

可以发现数根 `9` 个为一组， `1 - 9` 循环出现。我们需要做就是把原数映射到树根就可以，循环出现的话，想到的就是取余了。

结合上边的规律，对于给定的 `n` 有三种情况。

`n` 是 `0` ，数根就是 `0`。

`n` 不是 `9` 的倍数，数根就是 `n` 对 `9` 取余，即 `n mod 9`。

`n` 是 `9` 的倍数，数根就是 `9`。

我们可以把两种情况统一起来，我们将给定的数字减 `1`，相当于原数整体向左偏移了 `1`，然后再将得到的数字对 `9` 取余，最后将得到的结果加 `1` 即可。

原数是 `n`，树根就可以表示成 `(n-1) mod 9 + 1`，可以结合下边的过程理解。

```java
原数: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
偏移: 0 1 2 3 4 5 6 7 8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 
取余: 0 1 2 3 4 5 6 7 8  0  1  2  3  4  5  6  7  8  0  1  2  3  4  5  6  7  8  0  1  2  
数根: 1 2 3 4 5 6 7 8 9  1  2  3  4  5  6  7  8  9  1  2  3  4  5  6  7  8  9  1  2  3 
```

所以代码的话其实一句就够了。

```java
public int addDigits(int num) {
    return (num - 1) % 9 + 1;
}
```

当然上边是通过找规律得出的方法，我们需要证明一下。知乎的[最高赞](https://www.zhihu.com/question/30972581/answer/50203344) 讲的很清楚了，我再把推导和上边的公式一起说一下。

下边是作者的推导。

![](https://windliang.oss-cn-beijing.aliyuncs.com/258_2.jpg)

上边证明了对原数做一个 `f` 操作，也就是各个位上的数相加，然后不停的做 `f` 操作，最终的结果对 `9` 取余和原数 `x` 对 `9` 取余是相等的。

不考虑 `0`这种特殊情况，不停的做 `f` 操作，最终得到的数就是 `1 - 9`，对 `9`取余的结果是 `1 - 8` 和 `0`。结果是 `0` 的话对应数根就是 `9`，其他情况的数根就是取余结果。

也就是我们之前讨论的。

> `n` 是 `0` ，数根就是 `0`。
>
> `n` 不是 `9` 的倍数，数根就是 `n` 对 `9` 取余，即 `n mod 9`。
>
> `n` 是 `9` 的倍数，数根就是 `9`。

同样的，我们可以通过 `(n-1) mod 9 + 1` 这个式子把上边的几种情况统一起来。

# 总

这道题的话如果用程序的话很好解决，就是不停的循环即可。解法二数学上的话就很神奇了，一般也不会往这方面想了。