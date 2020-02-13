# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/224.png)

简单计算器，只有加法和减法以及括号，并且参与运算的数字都是非负数。

# 思路分析

科学计算器的话，学栈的时候当时一定会遇到的一个练手项目了。记得当时自己写了黑框的计算器，QT 版的计算器，安卓版的计算器，难点就是处理优先级、括号、正负数的问题，几年过去自己也只记得大体框架了，当时用了两个栈，然后遇到操作数怎么办，遇到操作符怎么办，遇到括号怎么办，总之有一个通用的方法，下边的思路也没有细讲了，直接网上搜到了压栈出栈的过程，然后写了相应的代码供参考。解法三的话算作对这道题专门的解法。

# 解法一 逆波兰式

[150 题](https://leetcode.wang/leetcode-150-Evaluate-Reverse-Polish-Notation.html) 的时候我们做了逆波兰数。

![img](https://windliang.oss-cn-beijing.aliyuncs.com/150.png)

我们平常用的是中缀表达式，也就是上边 Explanation 中解释的。题目中的是逆波兰式，也叫后缀表达式，一个好处就是只需要运算符，不需要括号，不会产生歧义。

计算法则就是，每次找到运算符位置的前两个数字，然后进行计算。

然后当时直接用栈写了代码，遇到操作数就入栈，遇到操作符就将栈顶的两个元素弹出进行操作，将结果继续入栈即可。

```java
public int evalRPN(String[] tokens) {
    Stack<String> stack = new Stack<>();
    for (String t : tokens) {
        if (isOperation(t)) {
            int a = stringToNumber(stack.pop());
            int b = stringToNumber(stack.pop());
            int ans = eval(b, a, t.charAt(0));
            stack.push(ans + "");
        } else {
            stack.push(t);
        }
    }
    return stringToNumber(stack.pop());
}

private int eval(int a, int b, char op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
    }
    return 0;
}

private int stringToNumber(String s) {
    int sign = 1;
    int start = 0;
    if (s.charAt(0) == '-') {
        sign = -1;
        start = 1;
    }
    int res = 0;
    for (int i = start; i < s.length(); i++) {
        res = res * 10 + s.charAt(i) - '0';
    }
    return res * sign;
}

private boolean isOperation(String t) {
    return t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/");
}

```

有了上边的代码，我们只需要把题目给的中缀表达式转成后缀表达式，直接调用上边计算逆波兰式就可以了。

中缀表达式转后缀表达式也有一个通用的方法，我直接复制 [这里](https://blog.csdn.net/sgbfblog/article/details/8001651) 的规则过来。

1）如果遇到操作数，我们就直接将其加入到后缀表达式。

2）如果遇到左括号，则我们将其放入到栈中。

3）如果遇到一个右括号，则将栈元素弹出，将弹出的操作符加入到后缀表达式直到遇到左括号为止，接着将左括号弹出，但不加入到结果中。

4）如果遇到其他的操作符，如（“+”， “-”）等，从栈中弹出元素将其加入到后缀表达式，直到栈顶的元素优先级比当前的优先级低（或者遇到左括号或者栈为空）为止。弹出完这些元素后，最后将当前遇到的操作符压入到栈中。

5）如果我们读到了输入的末尾，则将栈中所有元素依次弹出。

这里的话注意一下第四条规则，因为题目中只有加法和减法，加法和减法是同优先级的，所以一定不会遇到更低优先级的元素，所以「直到栈顶的元素优先级比当前的优先级低（或者遇到左括号或者栈为空）为止。」这句话可以改成「直到遇到左括号或者栈为空为止」。

然后就是对数字的处理，因为数字可能并不只有一位，所以遇到数字的时候要不停的累加。

当遇到运算符或者括号的时候就将累加的数字加到后缀表达式中。

```java
public int calculate(String s) {
    String[] polish = getPolish(s); //转后缀表达式
    return evalRPN(polish);
}

//中缀表达式转后缀表达式
private String[] getPolish(String s) {
    List<String> res = new ArrayList<>();
    Stack<String> stack = new Stack<>();
    char[] array = s.toCharArray();
    int n = array.length;
    int temp = -1; //累加数字，-1 表示当前没有数字
    for (int i = 0; i < n; i++) {
        if (array[i] == ' ') {
            continue;
        }
        //遇到数字
        if (isNumber(array[i])) {
            //进行数字的累加
            if (temp == -1) {
                temp = array[i] - '0';
            } else {
                temp = temp * 10 + array[i] - '0';
            }
        } else {
            //遇到其它操作符，将数字加入到结果中
            if (temp != -1) {
                res.add(temp + "");
                temp = -1;
            }
            if (isOperation(array[i] + "")) {
                //遇到操作符将栈中的操作符加入到结果中
                while (!stack.isEmpty()) {
                    //遇到左括号结束
                    if (stack.peek().equals("(")) {
                        break;
                    }
                    res.add(stack.pop());
                }
                //当前操作符入栈
                stack.push(array[i] + "");
            } else {
                //遇到左括号，直接入栈
                if (array[i] == '(') {
                    stack.push(array[i] + "");
                }
                //遇到右括号，将出栈元素加入到结果中，直到遇到左括号
                if (array[i] == ')') {
                    while (!stack.peek().equals("(")) {
                        res.add(stack.pop());
                    }
                    //左括号出栈
                    stack.pop();
                }

            }
        }
    }
    //如果有数字，将数字加入到结果
    if (temp != -1) {
        res.add(temp + "");
    }
    //栈中的其他元素加入到结果
    while (!stack.isEmpty()) {
        res.add(stack.pop());
    }
    String[] sArray = new String[res.size()];
    //List 转为 数组
    for (int i = 0; i < res.size(); i++) {
        sArray[i] = res.get(i);
    }
    return sArray;
}

// 下边是 150 题的代码，求后缀表达式的值
public int evalRPN(String[] tokens) {
    Stack<String> stack = new Stack<>();
    for (String t : tokens) {
        if (isOperation(t)) {
            int a = stringToNumber(stack.pop());
            int b = stringToNumber(stack.pop());
            int ans = eval(b, a, t.charAt(0));
            stack.push(ans + "");
        } else {
            stack.push(t);
        }
    }
    return stringToNumber(stack.pop());
}

private int eval(int a, int b, char op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
    }
    return 0;
}

private int stringToNumber(String s) {
    int sign = 1;
    int start = 0;
    if (s.charAt(0) == '-') {
        sign = -1;
        start = 1;
    }
    int res = 0;
    for (int i = start; i < s.length(); i++) {
        res = res * 10 + s.charAt(i) - '0';
    }
    return res * sign;
}

private boolean isNumber(char c) {
    return c >= '0' && c <= '9';
}

private boolean isOperation(String t) {
    return t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/");
}

```

# 解法二 双栈

解法一经过了一个中间过程，先转为了后缀表达式然后进行求值。我们其实可以直接利用两个栈，边遍历边进行的，这个方法是我当时上课学的方法。从 [这里](https://www.yanbinghu.com/2019/03/24/57779.html) 把过程贴到下边，和解法一其实有些类似的。

1. 使用两个栈，`stack0` 用于存储操作数，`stack1` 用于存储操作符
2. 从左往右扫描，遇到操作数入栈 `stack0`
3. 遇到操作符时，如果当前优先级低于或等于栈顶操作符优先级，则从 `stack0` 弹出两个元素，从 `stack1`  弹出一个操作符，进行计算，将结果并压入`stack0`，继续与栈顶操作符的比较优先级。
4. 如果遇到操作符高于栈顶操作符优先级，则直接入栈 `stack1`
5. 遇到左括号，直接入栈 `stack1`。
6. 遇到右括号，则从 `stack0` 弹出两个元素，从 `stack1`  弹出一个操作符进行计算，并将结果加入到 `stack0` 中，重复这步直到遇到左括号

和解法一一样，因为我们只有加法和减法，所以这个流程可以简化一下。

第 3 条改成「遇到操作符时，则从 `stack0` 弹出两个元素进行计算，并压入`stack0`，直到栈空或者遇到左括号，最后将当前操作符压入 `stack1`  」

第 4 条去掉，已经和第 3 条合并了。

整体框架和解法一其实差不多，数字的话同样也需要累加，然后当遇到运算符或者括号的时候就将数字入栈。

```java
public int calculate(String s) {
    char[] array = s.toCharArray();
    int n = array.length;
    Stack<Integer> num = new Stack<>();
    Stack<Character> op = new Stack<>();
    int temp = -1;
    for (int i = 0; i < n; i++) {
        if (array[i] == ' ') {
            continue;
        }
        // 数字进行累加
        if (isNumber(array[i])) {
            if (temp == -1) {
                temp = array[i] - '0';
            } else {
                temp = temp * 10 + array[i] - '0';
            }
        } else {
            //将数字入栈
            if (temp != -1) {
                num.push(temp);
                temp = -1;
            }
            //遇到操作符
            if (isOperation(array[i] + "")) {
                while (!op.isEmpty()) {
                    if (op.peek() == '(') {
                        break;
                    }
                    //不停的出栈，进行运算，并将结果再次压入栈中
                    int num1 = num.pop();
                    int num2 = num.pop();
                    if (op.pop() == '+') {
                        num.push(num1 + num2);
                    } else {
                        num.push(num2 - num1);
                    }

                }
                //当前运算符入栈
                op.push(array[i]);
            } else {
                //遇到左括号，直接入栈
                if (array[i] == '(') {
                    op.push(array[i]);
                }
                //遇到右括号，不停的进行运算，直到遇到左括号
                if (array[i] == ')') {
                    while (op.peek() != '(') {
                        int num1 = num.pop();
                        int num2 = num.pop();
                        if (op.pop() == '+') {
                            num.push(num1 + num2);
                        } else {
                            num.push(num2 - num1);
                        }
                    }
                    op.pop();
                }

            }
        }
    }
    if (temp != -1) {
        num.push(temp);
    }
    //将栈中的其他元素继续运算
    while (!op.isEmpty()) {
        int num1 = num.pop();
        int num2 = num.pop();
        if (op.pop() == '+') {
            num.push(num1 + num2);
        } else {
            num.push(num2 - num1);
        }
    }
    return num.pop();
}

private boolean isNumber(char c) {
    return c >= '0' && c <= '9';
}

private boolean isOperation(String t) {
    return t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/");
}
```

有一点需要注意，就是算减法的时候，是 `num2 - num1`，因为我们最初压栈的时候，被减数先压入栈中，然后减数再压栈。出栈的时候，先出来的是减数，然后才是被减数。

# 解法三

当然，因为只有加法和减法，所以可以不用上边通用的的方法，可以单独分析一下。

首先，将问题简单化，如果没有括号的话，该怎么做？

`1 + 2 - 3 + 5`

我们把式子看成下边的样子。

`+ 1 + 2 - 3 + 5`

用一个变量 `op` 记录数字前的运算，初始化为 `+`。然后用 `res` 进行累加结果，初始化为 `0`。用 `num` 保存当前的操作数。

从上边第二个加号开始，每次遇到操作符的时候，根据之前保存的 `op` 进行累加结果 `res = res op num`，然后 `op` 更新为当前操作符。

结合代码理解一下。

```java
public int calculateWithOutParentheses(String s) {
    char[] array = s.toCharArray();
    int n = array.length;
    int res = 0;
    int num = 0;
    char op = '+';
    for (int i = 0; i < n; i++) {
        if (array[i] == ' ') {
            continue;
        }
        if (array[i] >= '0' && array[i] <= '9') {
            num = num * 10 + array[i] - '0';
        } else {
            if (op == '+') {
                res = res + num;
            }
            if (op == '-') {
                res = res - num;
            }
            num = 0;
            op = array[i];
        }
    }
    if (op == '+') {
        res = res + num;
    }
    if (op == '-') {
        res = res - num;
    }
    return res;
}
```

下边考虑包含括号的问题。

可能是这样 `1 - (2 + 4) + 1`，可能括号里包含括号 `2 + (1 - (2 + 4)) - 2`

做法也很简单，当遇到左括号的时候，我们只需要将当前累计的结果，以及当前的 `op` 进行压栈保存，然后各个参数恢复为初始状态，继续进行正常的扫描计算。

当遇到右括号的时候，将栈中保存的结果和 `op` 与当前结果进行计算，计算完成后将各个参数恢复为初始状态，然后继续进行正常的扫描计算。

举个例子，对于 `2 + 1 - (2 + 4) + 1`，遇到左括号的时候，我们就将已经累加的结果 `3` 和左括号前的 `-` 放入栈中。也就是 `3 - (...) + 1`。

接着如果遇到了右括号，括号里边 `2 + 4` 的结果是 `6`，已经算出来了，接着我们从栈里边把 `3` 和 `-` 取出来，也就是再计算 `3 - 6 + 1` 就可以了。

结合代码再看一下。

```java
public int calculate(String s) {
    char[] array = s.toCharArray();
    int n = array.length;
    int res = 0;
    int num = 0;
    Stack<Character> opStack = new Stack<>();
    Stack<Integer> resStack = new Stack<>();
    char op = '+';
    for (int i = 0; i < n; i++) {
        if (array[i] == ' ') {
            continue;
        }
        if (array[i] >= '0' && array[i] <= '9') {
            num = num * 10 + array[i] - '0';
        } else if (array[i] == '+' || array[i] == '-') {
            if (op == '+') {
                res = res + num;
            }
            if (op == '-') {
                res = res - num;
            }
            num = 0;
            op = array[i];
        //遇到左括号，将结果和括号前的运算保存，然后将参数重置
        } else if (array[i] == '(') {
            resStack.push(res);
            opStack.push(op);
            
            //将参数重置
            op = '+';
            res = 0;
        } else if (array[i] == ')') {
            //将右括号前的当前运算结束
            //比如 (3 + 4 - 5), 当遇到右括号的时候, - 5 还没有运算
            //(因为我们只有遇到操作符才会进行计算)
            if (op == '+') {
                res = res + num;
            }
            if (op == '-') {
                res = res - num;
            }
            
            //将之前的结果和操作取出来和当前结果进行运算
            char opBefore = opStack.pop();
            int resBefore = resStack.pop();
            if (opBefore == '+') {
                res = resBefore + res;
            }
            if (opBefore == '-') {
                res = resBefore - res;
            }
            
            //将参数重置
            op = '+';
            num = 0;
        }
    }
    if (op == '+') {
        res = res + num;
    }
    if (op == '-') {
        res = res - num;
    }
    return res;
}
```

参考 [这里](https://leetcode.com/problems/basic-calculator/discuss/62361/Iterative-Java-solution-with-stack)，我们可以将代码简化一些。上边计算的时候，每次都判断当前 `op` 是加号还是减号，比较麻烦。我们可以将两者统一起来。用一个变量 `sign` 代替 `op`。如果是 `+`，`sign` 就等于 `1`。如果是 `-`，`sign` 就等于 `-1`。

这样做的好处就是，更新 `res` 的时候，两种情况可以合为一种， `res = res + sign * num`。

另外一个好处就是，我们不再需要两个栈。因为此时的 `sign` 也是 `int` 类型，所以可以把它和 `res` 放到同一个栈中。

```java
public int calculate(String s) {
    char[] array = s.toCharArray();
    int n = array.length;
    int res = 0;
    int num = 0;
    Stack<Integer> stack = new Stack<>();
    int sign = 1;
    for (int i = 0; i < n; i++) {
        if (array[i] == ' ') {
            continue;
        }
        if (array[i] >= '0' && array[i] <= '9') {
            num = num * 10 + array[i] - '0';
        } else if (array[i] == '+' || array[i] == '-') {
            res = res + sign * num;
            
            //将参数重置
            num = 0;
            sign = array[i] == '+' ? 1 : -1;
        // 遇到左括号，将结果和括号前的运算保存，然后将参数重置
        } else if (array[i] == '(') {
            stack.push(res);
            stack.push(sign);
            sign = 1;
            res = 0;
        } else if (array[i] == ')') {
            // 将右括号前的运算结束
            res = res + sign * num;

            // 将之前的结果和操作取出来和当前结果进行运算
            int signBefore = stack.pop();
            int resBefore = stack.pop();
            res = resBefore + signBefore * res;

            // 将参数重置
            sign = 1;
            num = 0;
        }
    }
    res = res + sign * num;
    return res;
}

```

# 解法四

[官方题解](https://leetcode.com/problems/basic-calculator/solution/) 中还介绍了另外一种思路，这里也分享一下。

这道题的关键就是怎么处理括号的问题，如果我们把括号中的结果全算出来，然后再计算整个表达式也就不难了。

比如 `2 - (6 + 5 + 2) + 4`，把括号中的结果得到，然后计算 `2 - 13 + 4` 就很简单了。

括号匹配问题的话，自然会想到栈，比如 [20 题](https://leetcode.wang/leetCode-20-Valid Parentheses.html) 的括号匹配。

这里的话，我们当然也使用栈，当出现匹配的括号的时候，就计算当前栈中所匹配的括号里的表达式。

换句话讲，遍历表达式一直将元素入栈，直到我们遇到右括号就开始出栈，一直出栈直到栈顶是左括号，这期间出栈的元素就是当前括号中的表达式。

举个例子。

````java
2 - (6 + 5 + 2) + 4

遇到右括号前一直入栈
stack = [ 2, -, (, 6, +, 5, +, 2 ]

接着我们遇到了右括号，开始出栈，并且边出栈边计算
将 res 初始化为出栈的第一个元素，res = 2
stack = [ 2, -, (, 6, +, 5, + ]
                 
接下来出栈的话，出栈元素依次就是运算符, 操作数, 运算符, 操作数...     
我们只需要根据操作符, 然后和 res 累加即可

res = res + 5 = 7
                 
stack = [ 2, -, (, 6, + ]

res = res + 6 = 13
                 
stack = [ 2, -, ( ]    

stack 遇到了左括号，停止计算，将左括号弹出，然后将 res 中压入栈中

stack = [ 2, -, 13 ]  

然后继续遍历原表达式
stack = [ 2, -, 13, +, 4 ]

原表达式遍历完成, 然后将 stack 中的元素边出栈边计算

将 res 初始化为出栈的第一个元素，res = 4
                 
stack = [ 2, -, 13, + ]     

接下来出栈的话，出栈元素依次就是运算符, 操作数, 运算符, 操作数...     
我们只需要根据操作符, 然后和 res 累加即可

res = res + 13 = 17
                 
stack = [ 2, - ]

res = res - 2 = 15
                 
stack = [] 

栈空, 结束运算
````

遗憾的时候，会发现我们计算结果是错误的。原因就是减法不满足交换律，由于我们使用了栈，所以会使得计算倒过来。`A + B` 变成 `B + A` 没什么问题，但是 `A - B` 变成 `B - A`  就会出问题了。

解决这个问题也很简单，我们只需要倒着遍历原表达式就可以了，相当于先把  `A - B` 变成了 `B - A`  ，通过栈运算的话，我们就是计算 `A - B` 了。

然后因为是倒着遍历，所以我们先会遇到右括号，然后是左括号。所以算法变成了遇到左括号后开始出栈进行表达式的计算。

还有个问题需要解决，因为我们是倒着遍历，对于有好几位的数字，我们先得到的是数字的低位，最后得到的是数字的高位，所以数字的更新方式和之前的算法都不同。

举个例子，对于 `123`，初始化 `num = 0`。

由于是倒着遍历，我们先会得到 `3`，此时 `num = 3 * 1  + num = 3`。

然后得到 `2`，此时 `num = 2 * 10  + num = 23`。

然后得到 `1`，此时 `num = 1 * 100  + num = 123`。

也就是每次得到数要依次乘 `1`、`10`、`100` ... 之后再与原结果累加。

```java
public int calculate(String s) {
    char[] array = s.toCharArray();
    int n = array.length;
    Stack<Integer> stack = new Stack<>();
    int num = 0;
    int pow = 1;
    for (int i = n - 1; i >= 0; i--) {
        if (array[i] == ' ') {
            continue;
        }
        if (array[i] >= '0' && array[i] <= '9') {
            num = (array[i] - '0') * pow + num;
            pow *= 10;
        } else {
            //当前是否有数字
            if (pow != 1) {
                stack.push(num);
                num = 0;
                pow = 1;
            }
            //使用解法三的技巧, 加号用 1 表示, 减号用 -1 表示
            if (array[i] == '+' || array[i] == '-') {
                stack.push(array[i] == '+' ? 1 : -1);
            //遇到左括号开始计算栈中元素
            } else if (array[i] == '(') {
                int res = evaluateExpr(stack);
                //右括号出栈
                stack.pop();
                //括号内计算的结果入栈
                stack.push(res);

            } else if (array[i] == ')') {
                // 将右括号入栈，用 -2 表示
                stack.push(-2);
            }
        }
    }
    //当前是否有数字
    if (pow != 1) {
        stack.push(num);
    }
    //计算去除完括号以后栈中表达式的值
    return evaluateExpr(stack);

}

private int evaluateExpr(Stack<Integer> stack) {
    //第一个数作为初始结果
    int res = stack.pop();
    //栈不空，并且没有遇到右括号
    while (!stack.isEmpty() && stack.peek() != -2) {
        //第一个出栈的元素是操作符，第二个出栈的元素是操作数
        res = res + stack.pop() * stack.pop();
    }
    return res;
}
```



# 总

解法一和解法二算是通用的方法，也就是加上乘除运算以后方法依旧通用。

解法三的话，就是针对这道题进行的一个简化的算法，最关键的就是括号的处理，栈的应用很关键。然后就是一个技巧，通过 `sign` 将加减统一起来很漂亮。

解法四的话很巧妙，但不容易想到，通过栈找到匹配的括号，然后先计算括号中的元素，最终等效于先把所有括号去掉再统一计算主表达式，相当于主表达式延迟了计算，倒是很符合我们平常计算带括号的表达式的思维。「有括号的，先计算括号里边的」，想起了小学时候的口诀，哈哈。

