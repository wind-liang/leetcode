# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/227.png)

基础计算器，只有加减乘除，正数，整数。

# 思路分析

[224 题](https://leetcode.wang/leetcode-224-Basic-Calculator.html) 已经介绍了两种通用的计算器的解法，一种是利用后缀表达式，一种是双栈，这里就直接在 [224 题](https://leetcode.wang/leetcode-224-Basic-Calculator.html)  的基础上改了，大家可以先去做一下。

# 解法一 后缀表达式

[150 题](https://leetcode.wang/leetcode-150-Evaluate-Reverse-Polish-Notation.html) 已经写了后缀表达式的求值，这里的话我们主要是写中缀表达式转后缀表达式，下边是规则。

1）如果遇到操作数，我们就直接将其加入到后缀表达式。

2）如果遇到左括号，则我们将其放入到栈中。

3）如果遇到一个右括号，则将栈元素弹出，将弹出的操作符加入到后缀表达式直到遇到左括号为止，接着将左括号弹出，但不加入到结果中。

4）如果遇到其他的操作符，如（“+”， “-”）等，从栈中弹出元素将其加入到后缀表达式，直到栈顶的元素优先级比当前的优先级低（或者遇到左括号或者栈为空）为止。弹出完这些元素后，最后将当前遇到的操作符压入到栈中。

5）如果我们读到了输入的末尾，则将栈中所有元素依次弹出。

这道题比较简单，不用考虑括号，只需要判断当前操作符和栈顶操作符的优先级。

```java
//op1 > op2 的时候返回 true, 其他情况都返回 false
private boolean compare(String op1, String op2) {
    if (op1.equals("*") || op1.equals("/")) {
        return op2.equals("+") || op2.equals("-");
    }
    return false;
}
```

下边是整体的代码，供参考。

```java
public int calculate(String s) {
    String[] polish = getPolish(s); // 转后缀表达式
    return evalRPN(polish);
}

// 中缀表达式转后缀表达式
private String[] getPolish(String s) {
    List<String> res = new ArrayList<>();
    Stack<String> stack = new Stack<>();
    char[] array = s.toCharArray();
    int n = array.length;
    int temp = -1; // 累加数字，-1 表示当前没有数字
    for (int i = 0; i < n; i++) {
        if (array[i] == ' ') {
            continue;
        }
        // 遇到数字
        if (isNumber(array[i])) {
            // 进行数字的累加
            if (temp == -1) {
                temp = array[i] - '0';
            } else {
                temp = temp * 10 + array[i] - '0';
            }
        } else {
            // 遇到其它操作符，将数字加入到结果中
            if (temp != -1) {
                res.add(temp + "");
                temp = -1;
            }
            // 遇到操作符将栈中的操作符加入到结果中
            while (!stack.isEmpty()) {
                // 栈顶优先级更低就结束
                if (compare(array[i]+"",stack.peek())) {
                    break;
                }
                res.add(stack.pop());
            }
            // 当前操作符入栈
            stack.push(array[i] + "");

        }
    }
    // 如果有数字，将数字加入到结果
    if (temp != -1) {
        res.add(temp + "");
    }
    // 栈中的其他元素加入到结果
    while (!stack.isEmpty()) {
        res.add(stack.pop());
    }
    String[] sArray = new String[res.size()];
    // List 转为 数组
    for (int i = 0; i < res.size(); i++) {
        sArray[i] = res.get(i);
    }
    return sArray;
}

private boolean compare(String op1, String op2) {
    if (op1.equals("*") || op1.equals("/")) {
        return op2.equals("+") || op2.equals("-");
    }
    return false;
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

规则如下。

1. 使用两个栈，`stack0` 用于存储操作数，`stack1` 用于存储操作符
2. 从左往右扫描，遇到操作数入栈 `stack0`
3. 遇到操作符时，如果当前优先级低于或等于栈顶操作符优先级，则从 `stack0` 弹出两个元素，从 `stack1` 弹出一个操作符，进行计算，将结果并压入`stack0`，继续与栈顶操作符的比较优先级。
4. 如果遇到操作符高于栈顶操作符优先级，则直接入栈 `stack1`
5. 遇到左括号，直接入栈 `stack1`。
6. 遇到右括号，则从 `stack0` 弹出两个元素，从 `stack1` 弹出一个操作符进行计算，并将结果加入到 `stack0` 中，重复这步直到遇到左括号

同样的不需要考虑括号，会变得更简单一些。

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
            // 将数字入栈
            if (temp != -1) {
                num.push(temp);
                temp = -1;
            }
            // 遇到操作符
            while (!op.isEmpty()) {
                //遇到更低优先级的话就结束
                if (compare(array[i], op.peek())) {
                    break;
                }
                // 不停的出栈，进行运算，并将结果再次压入栈中
                int num1 = num.pop();
                int num2 = num.pop();
                num.push(eval(num1, num2, op.pop())); 
            }
            // 当前运算符入栈
            op.push(array[i]);

        }
    }
    if (temp != -1) {
        num.push(temp);
    }
    // 将栈中的其他元素继续运算
    while (!op.isEmpty()) {
        int num1 = num.pop();
        int num2 = num.pop();
        num.push(eval(num1, num2, op.pop())); 
    }
    return num.pop();
}

private boolean compare(char op1, char op2) {
    if(op1 == '*' || op1 == '/'){
        return op2 == '+' || op2 == '-';
    }
    return false;
}

private boolean isNumber(char c) {
    return c >= '0' && c <= '9';
}
private int eval(int a, int b, char op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return b - a;
        case '*':
            return a * b;
        case '/':
            return b / a;
    }
    return 0;
}
```

和 [224 题](https://leetcode.wang/leetcode-224-Basic-Calculator.html)  一样需要注意减法和除法，由于使用了栈，所以算的时候两个数字要反一下。

# 解法三

分享一下 [这里](https://leetcode.com/problems/basic-calculator-ii/discuss/63003/Share-my-java-solution) 的解法，属于专门针对这道题的解法。

把减法、乘法、除法在遍历过程中将结果计算出来，最后将所有结果累加。

```java
public int calculate(String s) {
    int len;
    if(s==null || (len = s.length())==0) return 0;
    Stack<Integer> stack = new Stack<Integer>();
    int num = 0;
    char sign = '+';
    for(int i=0;i<len;i++){
        if(Character.isDigit(s.charAt(i))){
            num = num*10+s.charAt(i)-'0';
        }
        if((!Character.isDigit(s.charAt(i)) &&' '!=s.charAt(i)) || i==len-1){
            if(sign=='-'){
                stack.push(-num);
            }
            if(sign=='+'){
                stack.push(num);
            }
            if(sign=='*'){
                stack.push(stack.pop()*num);
            }
            if(sign=='/'){
                stack.push(stack.pop()/num);
            }
            sign = s.charAt(i);
            num = 0;
        }
    }

    int re = 0;
    for(int i:stack){
        re += i;
    }
    return re;
}
```

# 总

这道题的话只是抽离了计算器的一部分功能，只要学会了通用的方法，很快就能写出来。