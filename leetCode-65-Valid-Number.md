# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/65.jpg)

给定一个字符串，判断它是否代表合法数字，当然题目描述的样例不够多，会使得设计算法中出现很多遗漏的地方，这里直接参考[评论区](https://leetcode.com/problems/valid-number/discuss/23741/The-worst-problem-i-have-ever-met-in-this-oj)@[yeelan0319](https://leetcode.com/yeelan0319)给出的更多测试样例。

```java
test(1, "123", true);
test(2, " 123 ", true);
test(3, "0", true);
test(4, "0123", true);  //Cannot agree
test(5, "00", true);  //Cannot agree
test(6, "-10", true);
test(7, "-0", true);
test(8, "123.5", true);
test(9, "123.000000", true);
test(10, "-500.777", true);
test(11, "0.0000001", true);
test(12, "0.00000", true);
test(13, "0.", true);  //Cannot be more disagree!!!
test(14, "00.5", true);  //Strongly cannot agree
test(15, "123e1", true);
test(16, "1.23e10", true);
test(17, "0.5e-10", true);
test(18, "1.0e4.5", false);
test(19, "0.5e04", true);
test(20, "12 3", false);
test(21, "1a3", false);
test(22, "", false);
test(23, "     ", false);
test(24, null, false);
test(25, ".1", true); //Ok, if you say so
test(26, ".", false);
test(27, "2e0", true);  //Really?!
test(28, "+.8", true);  
test(29, " 005047e+6", true);  //Damn = =|||
```

# 解法一 直接法

什么叫直接法呢，就是没有什么通用的方法，直接分析题目，然后写代码，直接贴两个 leetcode Disscuss 的代码吧，供参考。

[想法一](https://leetcode.com/problems/valid-number/discuss/23738/Clear-Java-solution-with-ifs)。

把当前的输入分成几类，再用几个标志位来判断当前是否合法。

```java
public boolean isNumber(String s) {
    s = s.trim();

    boolean pointSeen = false;
    boolean eSeen = false;
    boolean numberSeen = false;
    boolean numberAfterE = true;
    for(int i=0; i<s.length(); i++) {
        if('0' <= s.charAt(i) && s.charAt(i) <= '9') {
            numberSeen = true;
            numberAfterE = true;
        } else if(s.charAt(i) == '.') {
            if(eSeen || pointSeen) {
                return false;
            }
            pointSeen = true;
        } else if(s.charAt(i) == 'e') {
            if(eSeen || !numberSeen) {
                return false;
            }
            numberAfterE = false;
            eSeen = true;
        } else if(s.charAt(i) == '-' || s.charAt(i) == '+') {
            if(i != 0 && s.charAt(i-1) != 'e') {
                return false;
            }
        } else {
            return false;
        }
    }

    return numberSeen && numberAfterE;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

[想法二](https://leetcode.com/problems/valid-number/discuss/23762/A-simple-solution-in-cpp)，遍历过程中，把遇到不符合的都返回 false，到最后成功到达末尾就返回 true。C++ 的代码，可以参考一下思想。

```c++
bool isNumber(const char *s) 
{
    int i = 0;

    // skip the whilespaces
    for(; s[i] == ' '; i++) {}

    // check the significand
    if(s[i] == '+' || s[i] == '-') i++; // skip the sign if exist

    int n_nm, n_pt;
    for(n_nm=0, n_pt=0; (s[i]<='9' && s[i]>='0') || s[i]=='.'; i++)
        s[i] == '.' ? n_pt++:n_nm++;       
    if(n_pt>1 || n_nm<1) // no more than one point, at least one digit
        return false;

    // check the exponent if exist
    if(s[i] == 'e') {
        i++;
        if(s[i] == '+' || s[i] == '-') i++; // skip the sign

        int n_nm = 0;
        for(; s[i]>='0' && s[i]<='9'; i++, n_nm++) {}
        if(n_nm<1)
            return false;
    }

    // skip the trailing whitespaces
    for(; s[i] == ' '; i++) {}

    return s[i]==0;  // must reach the ending 0 of the string
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法二 自动机

自己最开始想到的就是这个，编译原理时候在学到的自动机，就是一些状态转移。这一块内容很多，自己也很多东西都忘了，但不影响我们写算法，主要参考[这里](https://leetcode.com/problems/valid-number/discuss/23725/C%2B%2B-My-thought-with-DFA)。

![](https://windliang.oss-cn-beijing.aliyuncs.com/65_2.jpg)

如上图，从 0 开始总共有 9 个状态，橙色代表可接受状态，也就是表示此时是合法数字。总共有四大类输入，数字，小数点，e 和 正负号。我们只需要将这个图实现就够了。

```java
public boolean isNumber(String s) {
    int state = 0; 
    s = s.trim();//去除头尾的空格
    //遍历所有字符，当做输入
    for (int i = 0; i < s.length(); i++) {
        switch (s.charAt(i)) {
             //输入正负号
            case '+':
            case '-':
                if (state == 0) {
                    state = 1;
                } else if (state == 4) {
                    state = 6;
                } else {
                    return false;
                }
                break;
            //输入数字
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                //根据当前状态去跳转
                switch (state) {
                    case 0:
                    case 1:
                    case 2:
                        state = 2;
                        break;
                    case 3:
                        state = 3;
                        break;
                    case 4:
                    case 5:
                    case 6:
                        state = 5;
                        break;
                    case 7:
                        state = 8;
                        break;
                    case 8:
                        state = 8;
                        break;
                    default:
                        return false;
                }
                break;
            //小数点
            case '.':
                switch (state) {
                    case 0:
                    case 1:
                        state = 7;
                        break;
                    case 2:
                        state = 3;
                        break;
                    default:
                        return false;
                }
                break;
            //e
            case 'e':
                switch (state) {
                    case 2:
                    case 3:
                    case 8:
                        state = 4;
                        break;
                    default:
                        return false;
                }
                break;
            default:
                return false;

        }
    }
    //橙色部分的状态代表合法数字
    return state == 2 || state == 3 || state == 5 || state == 8;
}
```

时间复杂度：O（n）。

空间复杂度：O（1）。

# 解法三 责任链模式

解法二看起来已经很清晰明了了，只需要把状态图画出来，然后实现代码就很简单了。但是缺点是，如果状态图少考虑了东西，再改起来就会很麻烦。

[这里](https://leetcode.com/problems/valid-number/discuss/23977/A-clean-design-solution-By-using-design-pattern)作者提出来，利用责任链的设计模式，会使得写出的算法扩展性以及维护性更高。这里用到的思想就是，每个类只判断一种类型。比如判断是否是正数的类，判断是否是小数的类，判断是否是科学计数法的类，这样每个类只关心自己的部分，出了问题很好排查，而且互不影响。

```java
//每个类都实现这个接口
interface NumberValidate { 
    boolean validate(String s);
}
//定义一个抽象类，用来检查一些基础的操作，是否为空，去掉首尾空格，去掉 +/-
//doValidate 交给子类自己去实现
abstract class  NumberValidateTemplate implements NumberValidate{

    public boolean validate(String s)
    {
        if (checkStringEmpty(s))
        {
            return false;
        }

        s = checkAndProcessHeader(s);

        if (s.length() == 0)
        {
            return false;
        }

        return doValidate(s);
    }

    private boolean checkStringEmpty(String s)
    {
        if (s.equals(""))
        {
            return true;
        }

        return false;
    }

    private String checkAndProcessHeader(String value)
    {
        value = value.trim();

        if (value.startsWith("+") || value.startsWith("-"))
        {
            value = value.substring(1);
        }


        return value;
    }



    protected abstract boolean doValidate(String s);
}

//实现 doValidate 判断是否是整数
class IntegerValidate extends NumberValidateTemplate{

    protected boolean doValidate(String integer)
    {
        for (int i = 0; i < integer.length(); i++)
        {
            if(Character.isDigit(integer.charAt(i)) == false)
            {
                return false;
            }
        }

        return true;
    }
}
 
//实现 doValidate 判断是否是科学计数法
class SienceFormatValidate extends NumberValidateTemplate{

    protected boolean doValidate(String s)
    {
        s = s.toLowerCase();
        int pos = s.indexOf("e");
        if (pos == -1)
        {
            return false;
        }

        if (s.length() == 1)
        {
            return false;
        }

        String first = s.substring(0, pos);
        String second = s.substring(pos+1, s.length());

        if (validatePartBeforeE(first) == false || validatePartAfterE(second) == false)
        {
            return false;
        }


        return true;
    }

    private boolean validatePartBeforeE(String first)
    {
        if (first.equals("") == true)
        {
            return false;
        }

        if (checkHeadAndEndForSpace(first) == false)
        {
            return false;
        }

        NumberValidate integerValidate = new IntegerValidate();
        NumberValidate floatValidate = new FloatValidate();
        if (integerValidate.validate(first) == false && floatValidate.validate(first) == false)
        {
            return false;
        }

        return true;
    }

    private boolean checkHeadAndEndForSpace(String part)
    {

        if (part.startsWith(" ") ||
            part.endsWith(" "))
        {
            return false;
        }

        return true;
    }

    private boolean validatePartAfterE(String second)
    {
        if (second.equals("") == true)
        {
            return false;
        }

        if (checkHeadAndEndForSpace(second) == false)
        {
            return false;
        }

        NumberValidate integerValidate = new IntegerValidate();
        if (integerValidate.validate(second) == false)
        {
            return false;
        }

        return true;
    }
}
//实现 doValidate 判断是否是小数
class FloatValidate extends NumberValidateTemplate{

    protected boolean doValidate(String floatVal)
    {
        int pos = floatVal.indexOf(".");
        if (pos == -1)
        {
            return false;
        }

        if (floatVal.length() == 1)
        {
            return false;
        }

        NumberValidate nv = new IntegerValidate();
        String first = floatVal.substring(0, pos);
        String second = floatVal.substring(pos + 1, floatVal.length());

        if (checkFirstPart(first) == true && checkFirstPart(second) == true)
        {
            return true;
        }

        return false;
    }

    private boolean checkFirstPart(String first)
    {
        if (first.equals("") == false && checkPart(first) == false)
        {
            return false;
        }

        return true;
    }

    private boolean checkPart(String part)
    {
        if (Character.isDigit(part.charAt(0)) == false ||
            Character.isDigit(part.charAt(part.length() - 1)) == false)
        {
            return false;
        }

        NumberValidate nv = new IntegerValidate();
        if (nv.validate(part) == false)
        {
            return false;
        }

        return true;
    }
}
//定义一个执行者，我们把之前实现的各个类加到一个数组里，然后依次调用
class NumberValidator implements NumberValidate {

    private ArrayList<NumberValidate> validators = new ArrayList<NumberValidate>();

    public NumberValidator()
    {
        addValidators();
    }

    private  void addValidators()
    {
        NumberValidate nv = new IntegerValidate();
        validators.add(nv);

        nv = new FloatValidate();
        validators.add(nv);

        nv = new HexValidate();
        validators.add(nv);

        nv = new SienceFormatValidate();
        validators.add(nv);
    }

    @Override
    public boolean validate(String s)
    {
        for (NumberValidate nv : validators)
        {
            if (nv.validate(s) == true)
            {
                return true;
            }
        }

        return false;
    }


}
public boolean isNumber(String s) {
    NumberValidate nv = new NumberValidator(); 
    return nv.validate(s);
}

```

时间复杂度：

空间复杂度：

# 总

解法二中自动机的应用，会使得自己的思路更清晰。而解法三中，作者提出的对设计模式的应用，使自己眼前一亮，虽然代码变多了，但是维护性，扩展性变的很强了。比如，题目新增了一种情况，"0x123" 16 进制也算是合法数字。这样的话，解法一和解法二就没什么用了，完全得重新设计。但对于解法三，我们只需要新增一个类，专门判断这种情况，然后加到执行者的数组里就够了，很棒！