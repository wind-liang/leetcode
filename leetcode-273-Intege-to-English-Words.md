# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/273.png)

将数字用英文单词表示。

# 思路分析

没有什么特殊的方法，分析规律就可以了，主要有几个点。

* 每三位一组
* 小于 `20` 的和大于 `20` 的分开考虑
* 单词之间空格的处理
* 每三位后边增加个单位，从右数除了第一组，以后每一组后边依次加单位， `Thousand", "Million", "Billion"`
* 我们从右到左遍历，是在倒着完善结果

# 解法一

空格的处理，在每个单词前加空格，最后返回结果的时候调用 `trim` 函数去掉头尾的空格。

倒着遍历的处理，利用 `insert` 函数，每次在 `0` 的位置插入单词。

下边的代码供参考，每个人的代码写出来应该都不同。

```java
public String numberToWords(int num) {
    if (num == 0) {
        return "Zero";
    }
    //个位和十位
    String[] nums1 = { "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
                      "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
    
    //十位
    String[] nums2 = { "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };
    
    //单位
    String[] nums3 = { "", "Thousand", "Million", "Billion" };
    StringBuilder result = new StringBuilder();
    int count = 0; // 记录第几组，方便加单位
    while (num > 0) {
        int threeNum = num % 1000;
        //当前组大于 0 才加单位
        if (threeNum > 0) {
            result.insert(0, " " + nums3[count]);
        }
        count++;
        int twoNum = num % 100;
        if (twoNum < 20) {
            //小于 20 两位同时考虑
            if (twoNum > 0) {
                result.insert(0, " " + nums1[twoNum]);
            }
        } else {
            //个位
            if (twoNum % 10 > 0) {
                result.insert(0, " " + nums1[twoNum % 10]);
            }
            //十位
            result.insert(0, " " + nums2[twoNum / 10]);
        }
        //百位
        if (threeNum >= 100) {
            result.insert(0, " Hundred");
            result.insert(0, " " + nums1[threeNum / 100]);
        }
        num /= 1000;
    }
    return result.toString().trim();
}
```

# 总

主要就是对问题的梳理，不是很难。