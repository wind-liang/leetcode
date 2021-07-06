# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/282.png)

在数字中间添加加号、减号或者乘号，使得计算结果等于 `target`，返回所有的情况。

# 解法一 回溯法

自己开始想到了回溯法，但思路偏了，只能解决添加加号和减号，乘号不知道怎么处理。讲一下别人的思路，参考  [这里](https://leetcode.com/problems/expression-add-operators/discuss/71895/Java-Standard-Backtrace-AC-Solutoin-short-and-clear)。

思路就是添加一个符号，再添加一个数字，计算到目前为止表达式的结果。

当到达字符串末尾的时候，判断当前结果是否等于 `target` 。

我们先考虑只有加法和减法，举个例子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/282_2.jpg)

选取第一个数字的时候不加符号，然后剩下的都是符号加数字的形式。

如果我们对上边的图做深度优先遍历，会发现我们考虑了所有的表达式，下边就是深度优先遍历的结果。

```java
1 +2 +3 = 6
1 +2 -3 = 0
1 -2 +3 = 2
1 -2 -3 = -4
1 +23 = 24
1 -23 = -22  
12 +3 = 15    
12 -3 = 9
123 = 123
```

看一下只考虑加法和减法的代码。

有些地方需要注意，我们将字符串转成数字的时候可能会超出 `int` 范围，以及计算目前为止表达式的结果，也就是上图的括号里的值，也可能超出 `int` 范围，所以这两个值我们采用 `long` 。

还有就是 "01" 这种以 `0` 开头的字符串我们不用考虑，可以直接跳过。

计算上图括号中的值的时候，我们只需要用它的父节点中括号的值，加上或者减去当前值。

```java
public List<String> addOperators2(String num, int target) {
    List<String> result = new ArrayList<>();
    addOperatorsHelper(num, target, result, "", 0, 0, 0);
    return result;
}

// path: 目前为止的表达式
// 字符串开始的位置
// eval 目前为止计算的结果
private void addOperatorsHelper(String num, int target, List<String> result, String path, int start, long eval) {
    if (start == num.length()) {
        if (target == eval) {
            result.add(path);
        }
        return;

    }
    for (int i = start; i < num.length(); i++) {
        // 数字不能以 0 开头
        if (num.charAt(start) == '0' && i > start) {
            break;
        }
        long cur = Long.parseLong(num.substring(start, i + 1));
        // 选取第一个数不加符号
        if (start == 0) {
            addOperatorsHelper(num, target, result, path + cur, i + 1, cur, cur);
        } else {
            // 加当前值
            addOperatorsHelper(num, target, result, path + "+" + cur, i + 1, eval + cur, cur);
            // 减当前值
            addOperatorsHelper(num, target, result, path + "-" + cur, i + 1, eval - cur, -cur); 
        }
    }
}
```

现在考虑乘法有什么不同。

还是以 `123` 为例。如果还是按照上边的代码的逻辑，如果添加乘法的话就是下边的样子。

```java
             1
            /
           +2(3)
          /
         *3(9)         
```

也就是 `1 +2 *3 = 9`，很明显是错的，原因就在于乘法的优先级较高，并不能直接将前边的结果乘上当前的数。而是用当前数乘以前一个操作数。

算的话，我们可以用之前的值（3）减去前一个操作数（2），然后再加上当前数（3）乘以前一个操作数（2）。

即，`3 - 2 + 3 * 2 = 7`

所以代码的话，我们需要添加一个 `pre` 参数，用来记录上一个操作数。

对于加法和乘法，上一个操作数我们根据符号直接返回 `-2`，`3`  这种就可以了，但对于乘法有些不同。

如果是连乘的情况，比如对于 `2345`，假设之前已经进行到了 `2 +3 *4 (14)`，现在到 `5` 了。

如果我们想增加乘号，计算表达式 `2 +3 *4 *5` 的值。`5` 的前一个操作数是 `*4` ，我们应该记录的值是 `3 * 4 = 12` 。这样的话才能套用上边的讲的公式。

用之前的值（14）减去前一个操作数（12），然后再加上当前数（5）乘以前一个操作数（12）。

即，`14 - 12 + 5 * 12 = 62`。也就是 `2 +3 *4 *5 = 62`。

可以结合代码再看一下。

```java
public List<String> addOperators(String num, int target) {
    List<String> result = new ArrayList<>();
    addOperatorsHelper(num, target, result, "", 0, 0, 0);
    return result;
}

private void addOperatorsHelper(String num, int target, List<String> result, String path, int start, long eval, long pre) {
    if (start == num.length()) {
        if (target == eval) {
            result.add(path);
        }
        return;

    }
    for (int i = start; i < num.length(); i++) {
        // 数字不能以 0 开头
        if (num.charAt(start) == '0' && i > start) {
            break;
        }
        long cur = Long.parseLong(num.substring(start, i + 1));
        if (start == 0) {
            addOperatorsHelper(num, target, result, path + cur, i + 1, cur, cur);
        } else {
            // 加当前值
            addOperatorsHelper(num, target, result, path + "+" + cur, i + 1, eval + cur, cur);
            // 减当前值
            addOperatorsHelper(num, target, result, path + "-" + cur, i + 1, eval - cur, -cur);
            
            //乘法有两点不同
            
            //当前表达式的值就是 先减去之前的值，然后加上 当前值和前边的操作数相乘
            //eval - pre + pre * cur
            
            //另外 addOperatorsHelper 函数传进 pre 参数需要是 pre * cur
            //比如前边讲的 2+ 3 * 4 * 5 这种连乘的情况
            addOperatorsHelper(num, target, result, path + "*" + cur, i + 1, eval - pre + pre * cur, pre * cur);
        }
    }
}
```

上边的我们 `path` 参数采用的是 `String` 类型，`String` 类型进行相加的话会生成新的对象，比较慢。

我们可以用 `StringBuilder` 类型。如果用 `StringBuilder` 的话，每次调用完函数就需要将之前添加的东西删除掉，然后再调用新的函数。

[评论区](https://leetcode.com/problems/expression-add-operators/discuss/71895/Java-Standard-Backtrace-AC-Solutoin-short-and-clear) 介绍了 `StringBuilder` 删除之前添加的元素的方法，可以通过设置 `StringBuilder` 的长度。

```java
public List<String> addOperators(String num, int target) {
    List<String> result = new ArrayList<>();
    addOperatorsHelper(num, target, result, new StringBuilder(), 0, 0, 0);
    return result;
}

private void addOperatorsHelper(String num, int target, List<String> result, StringBuilder path, int start, long eval, long pre) {
    if (start == num.length()) {
        if (target == eval) {
            result.add(path.toString());
        }
        return;

    }
    for (int i = start; i < num.length(); i++) {
        // 数字不能以 0 开头
        if (num.charAt(start) == '0' && i > start) {
            break;
        }
        long cur = Long.parseLong(num.substring(start, i + 1));
        int len = path.length();
        if (start == 0) {
            addOperatorsHelper(num, target, result, path.append(cur), i + 1, cur, cur);
            path.setLength(len);
        } else {

            // 加当前值
            addOperatorsHelper(num, target, result, path.append("+").append(cur), i + 1, eval + cur, cur);
            path.setLength(len);
            // 减当前值
            addOperatorsHelper(num, target, result, path.append("-").append(cur), i + 1, eval - cur, -cur);
            path.setLength(len);
            // 乘当前值
            addOperatorsHelper(num, target, result, path.append("*").append(cur), i + 1, eval - pre + pre * cur,
                               pre * cur);
            path.setLength(len);
        }
    }
}
```

# 总

如果思路对了，用回溯法可以很快写出来，乘法的情况需要单独考虑一下。

我开始的思路是加数字再加符号，和上边的解法刚好是反过来了，但我的思路解决不了乘法的问题。

这里继续吸取教训，走到死胡同的时候，试着转变思路。

