# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/93.jpg)

给一个字符串，输出所有的可能的 ip 地址，注意一下，01.1.001.1 类似这种 0 开头的是非法字符串。

# 解法一 回溯 递归 DFS

很类似于刚做过的 [91 题](<https://leetcode.wang/leetcode-91-Decode-Ways.html>)，对字符串进行划分。这个其实也是划分，划分的次数已经确定了，那就是分为 4 部分。那么就直接用回溯的思想，第一部分可能是 1 位数，然后进入递归。第一部分可能是  2 位数，然后进入递归。第一部分可能是 3 位数，然后进入递归。很好理解，直接看代码理解吧。

````java
public List<String> restoreIpAddresses(String s) {
    List<String> ans = new ArrayList<>(); //保存最终的所有结果
    getAns(s, 0, new StringBuilder(), ans, 0);
    return ans;
}

/**
* @param:  start 字符串开始部分
* @param:  temp 已经划分的部分
* @param:  ans 保存所有的解
* @param:  count 当前已经加入了几部分
*/
private void getAns(String s, int start, StringBuilder temp, List<String> ans, int count) {
    //如果剩余的长度大于剩下的部分都取 3 位数的长度，那么直接结束
    //例如 s = 121231312312, length = 12
    //当前 start = 1，count 等于 1
    //剩余字符串长度 11，剩余部分 4 - count = 3 部分，最多 3 * 3 是 9
    //所以一定是非法的，直接结束
    if (s.length() - start > 3 * (4 - count)) {
        return;
    }
    //当前刚好到达了末尾
    if (start == s.length()) {
        //当前刚好是 4 部分，将结果加入
        if (count == 4) {
            ans.add(new String(temp.substring(0, temp.length() - 1)));
        }
        return;
    }
    //当前超过末位，或者已经到达了 4 部分结束掉
    if (start > s.length() || count == 4) {
        return;
    }
    //保存的当前的解
    StringBuilder before = new StringBuilder(temp);

    //加入 1 位数
    temp.append(s.charAt(start) + "" + '.');
    getAns(s, start + 1, temp, ans, count + 1);

    //如果开头是 0，直接结束
    if (s.charAt(start) == '0')
        return;

    //加入 2 位数
    if (start + 1 < s.length()) {
        temp = new StringBuilder(before);//恢复为之前的解
        temp.append(s.substring(start, start + 2) + "" + '.');
        getAns(s, start + 2, temp, ans, count + 1);
    }

    //加入 3 位数
    if (start + 2 < s.length()) {
        temp = new StringBuilder(before);
        int num = Integer.parseInt(s.substring(start, start + 3));
        if (num >= 0 && num <= 255) {
            temp.append(s.substring(start, start + 3) + "" + '.');
            getAns(s, start + 3, temp, ans, count + 1);
        }
    }

}
````

# 解法二 迭代

参考[这里](<https://leetcode.com/problems/restore-ip-addresses/discuss/30949/My-code-in-Java>)，相当暴力直接。因为我们知道了，需要划分为 4 部分，所以我们直接用利用三个指针将字符串强行分为四部分，遍历所有的划分，然后选取合法的解。

```java
public List<String> restoreIpAddresses(String s) {
    List<String> res = new ArrayList<String>();
    int len = s.length();
    //i < 4 保证第一部分不超过 3 位数
    //i < len - 2 保证剩余的字符串还能分成 3 部分
    for(int i = 1; i<4 && i<len-2; i++){
        for(int j = i+1; j<i+4 && j<len-1; j++){
            for(int k = j+1; k<j+4 && k<len; k++){
                //保存四部分的字符串
                String s1 = s.substring(0,i), s2 = s.substring(i,j), s3 = s.substring(j,k), s4 = s.substring(k,len);
                //判断是否合法
                if(isValid(s1) && isValid(s2) && isValid(s3) && isValid(s4)){
                    res.add(s1+"."+s2+"."+s3+"."+s4);
                }
            }
        }
    }
    return res;
}
public boolean isValid(String s){
    if(s.length()>3 || s.length()==0 || (s.charAt(0)=='0' && s.length()>1) || Integer.parseInt(s)>255)
        return false;
    return true;
}
```

时间复杂度：如果不考虑我们调用的内部函数，Integer.parseInt，s.substring，那么就是 O（1）。因为每一层循环最多遍历 4 次。考虑的话每次调用的时间复杂度是 O（n），常数次调用，所以是 O（n）。

空间复杂度：O（1）。

# 总

回溯或者说深度优先遍历，经常遇到了。但是解法二的暴力方法竟然通过了，有些意外。另外分享下 discuss 里有趣的评论，哈哈哈哈。

![](https://windliang.oss-cn-beijing.aliyuncs.com/93_2.png)

![](https://windliang.oss-cn-beijing.aliyuncs.com/93_3.jpg)