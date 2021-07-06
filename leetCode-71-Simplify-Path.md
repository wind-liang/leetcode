# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/71.jpg)

生成一个绝对路径，把相对路径中 ".." 和 "." 都转换为实际的路径，此外，"///" 多余的 "/" 要去掉，开头要有一个 "/"，末尾不要 "/"。

# 解法一

这道题，只要理解了题意，然后理一下就出来了。下面代码就不考虑空间复杂度了，多创建几个数组，代码会简洁一些。

```java
public String simplifyPath(String path) {
    //先利用 "/" 将字符串分割成一个一个单词
    String[] wordArr = path.split("/");
    //将空字符串（由类似这种"/a//c"的字符串产生）和 "." （"."代表当前目录不影响路径）去掉，保存到 wordList
    ArrayList<String> wordList = new ArrayList<String>();
    for (int i = 0; i < wordArr.length; i++) {
        if (wordArr[i].isEmpty() || wordArr[i].equals(".")) {
            continue;
        }
        wordList.add(wordArr[i]);
    }
    //wordListSim 保存简化后的路径
    ArrayList<String> wordListSim = new ArrayList<String>();
    //遍历 wordList
    for (int i = 0; i < wordList.size(); i++) {
        //如果遇到 ".."，wordListSim 就删除末尾的单词
        if (wordList.get(i).equals("..")) {
            if (!wordListSim.isEmpty()) {
                wordListSim.remove(wordListSim.size() - 1);
            }
        //否则的话就加入 wordListSim
        } else {
            wordListSim.add(wordList.get(i));
        }
    }
    //将单词用 "/" 连接
    String ans = String.join("/", wordListSim);
    //开头补上 "/"
    ans = "/" + ans;
    return ans;

}
```

时间复杂度：

空间复杂度：

# 总

这道题就是理清思路就可以，没有用到什么技巧。