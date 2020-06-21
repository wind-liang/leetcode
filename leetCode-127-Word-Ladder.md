# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/127.jpg)

给定一个开始单词和一个结束单词，一个单词列表，两个单词间转换原则是有且仅有一个字母不同。求出从开始单词转换到结束单词的最短路径长度是多少。

# 思路分析

基本上就是 [126 题](<https://leetcode.wang/leetCode-126-Word-LadderII.html>) 的简化版了，可以先看一下 [126 题](<https://leetcode.wang/leetCode-126-Word-LadderII.html>)  的解法思路。接下来就按照 126 题的思路讲了。把之前的图贴过来。

![](https://windliang.oss-cn-beijing.aliyuncs.com/126_3.jpg)

要求最短的路径，`DFS` 肯定在这里就不合适了。而在之前我们用 `BFS` 将每个节点的邻接节点求了出来，这个过程其实我们相当于已经把最短路径的长度求出来了。所以我们只需要把之前的 `BFS` 拿过来稍加修改即可。

# 解法一 BFS

添加一个变量 `len`，遍历完每一层就将 `len` 加 `1`。

```java
public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    if (!wordList.contains(endWord)) {
        return 0;
    }
    int len = 0;
    Queue<String> queue = new LinkedList<>();
    queue.offer(beginWord);
    boolean isFound = false;
    Set<String> dict = new HashSet<>(wordList);
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    while (!queue.isEmpty()) {
        int size = queue.size();
        Set<String> subVisited = new HashSet<>();
        for (int j = 0; j < size; j++) {
            String temp = queue.poll();
            // 一次性得到所有的下一个的节点
            ArrayList<String> neighbors = getNeighbors(temp, dict);
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    subVisited.add(neighbor);
                    //到达了结束单词，提前结束
                    if (neighbor.equals(endWord)) {
                        isFound = true;
                        break;
                    }
                    queue.offer(neighbor);
                }
            }

        }
        //当前层添加了元素，长度加一
        if (subVisited.size() > 0) {
            len++;
        }
        visited.addAll(subVisited);
        //找到以后，提前结束 while 循环，并且因为这里的层数从 0 计数，所以还需要加 1
        if (isFound) {
            len++;
            break;
        }
    }
    return len;
}

private ArrayList<String> getNeighbors(String node, Set<String> dict) {
    ArrayList<String> res = new ArrayList<String>();
    char chs[] = node.toCharArray();

    for (char ch = 'a'; ch <= 'z'; ch++) {
        for (int i = 0; i < chs.length; i++) {
            if (chs[i] == ch)
                continue;
            char old_ch = chs[i];
            chs[i] = ch;
            if (dict.contains(String.valueOf(chs))) {
                res.add(String.valueOf(chs));
            }
            chs[i] = old_ch;
        }

    }
    return res;
}
```

---

`2020.6.22` 更新，感谢 @cicada 指出，`leetcode` 增加了 `case` ，上边的代码不能 `AC` 了，我们需要考虑从第一个单词无法转到最后一个单词的情况，所以 `return` 前需要判断下。

```java
public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    if (!wordList.contains(endWord)) {
        return 0;
    }
    int len = 0;
    Queue<String> queue = new LinkedList<>();
    queue.offer(beginWord);
    boolean isFound = false;
    Set<String> dict = new HashSet<>(wordList);
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    while (!queue.isEmpty()) {
        int size = queue.size();
        Set<String> subVisited = new HashSet<>();
        for (int j = 0; j < size; j++) {
            String temp = queue.poll();
            // 一次性得到所有的下一个的节点
            ArrayList<String> neighbors = getNeighbors(temp, dict);
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    subVisited.add(neighbor);
                    //到达了结束单词，提前结束
                    if (neighbor.equals(endWord)) {
                        isFound = true;
                        break;
                    }
                    queue.offer(neighbor);
                }
            }

        }
        //当前层添加了元素，长度加一
        if (subVisited.size() > 0) {
            len++;
        }
        visited.addAll(subVisited);
        //找到以后，提前结束 while 循环，并且因为这里的层数从 0 计数，所以还需要加 1
        if (isFound) {
            len++;
            break;
        }
    }
    if(isFound){
        return len;
    }else{
        return 0;
    }
   
}

private ArrayList<String> getNeighbors(String node, Set<String> dict) {
    ArrayList<String> res = new ArrayList<String>();
    char chs[] = node.toCharArray();

    for (char ch = 'a'; ch <= 'z'; ch++) {
        for (int i = 0; i < chs.length; i++) {
            if (chs[i] == ch)
                continue;
            char old_ch = chs[i];
            chs[i] = ch;
            if (dict.contains(String.valueOf(chs))) {
                res.add(String.valueOf(chs));
            }
            chs[i] = old_ch;
        }

    }
    return res;
}
```

---

[126 题](<https://leetcode.wang/leetCode-126-Word-LadderII.html>)  中介绍了得到当前节点的相邻节点的两种方案，[官方题解](<https://leetcode.com/problems/word-ladder/solution/>) 中又提供了一种思路，虽然不容易想到，但蛮有意思，分享一下。

就是把所有的单词归类，具体的例子会好理解一些。

```java
一个单词会产生三个类别，比如 hot 会产生
*ot  
h*t 
ho* 
然后考虑每一个单词，如果产生了相同的类，就把这些单词放在一起

假如我们的单词列表是 ["hot","dot","dog","lot","log","cog"]

考虑 hot,当前的分类结果如下
*ot -> [hot]
h*t -> [hot]
ho* -> [hot]

再考虑 dot,当前的分类结果如下
*ot -> [hot dot]
h*t -> [hot]
ho* -> [hot]

d*t -> [dot]
do* -> [dot]

再考虑 dog,当前的分类结果如下
*ot -> [hot dot]
h*t -> [hot]
ho* -> [hot]

d*t -> [dot]
do* -> [dot dog]

*og -> [dog]
d*g -> [dog]

再考虑 lot,当前的分类结果如下
*ot -> [hot dot lot]
h*t -> [hot]
ho* -> [hot]

d*t -> [dot]
do* -> [dot dog]

*og -> [dog]
d*g -> [dog]

l*t -> [lot]
lo* -> [lot]

然后把每个单词都放到对应的类中，这样最后找当前单词邻居节点的时候就方便了。
比如找 hot 的邻居节点，因为它可以产生 *ot， h*t， ho* 三个类别，所有它的相邻节点就是上边分好类的相应单词
```

# 解法二 双向搜索

在 [126 题](<https://leetcode.wang/leetCode-126-Word-LadderII.html>) 最后一种解法中介绍了双向搜索，大大降低了时间复杂度。当然这里也可以直接用，同样是增加 `len` 变量即可，只不过之前用的递归，把 `len`  加到全局变量会更加方便些。

```java
int len = 2; //因为把 beginWord 和 endWord 都加入了路径，所以初始化 2
public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    if (!wordList.contains(endWord)) {
        return 0;
    }
    // 利用 BFS 得到所有的邻居节点
    Set<String> set1 = new HashSet<String>();
    set1.add(beginWord);
    Set<String> set2 = new HashSet<String>();
    set2.add(endWord);
    Set<String> wordSet = new HashSet<String>(wordList);
    //最后没找到返回 0
    if (!bfsHelper(set1, set2, wordSet)) {
        return 0;
    }
    return len;
}

private boolean bfsHelper(Set<String> set1, Set<String> set2, Set<String> wordSet) {
    if (set1.isEmpty()) {
        return false;
    }
    // set1 的数量多，就反向扩展
    if (set1.size() > set2.size()) {
        return bfsHelper(set2, set1, wordSet);
    }
    // 将已经访问过单词删除
    wordSet.removeAll(set1);
    wordSet.removeAll(set2);
    // 保存新扩展得到的节点
    Set<String> set = new HashSet<String>();
    for (String str : set1) {
        // 遍历每一位
        for (int i = 0; i < str.length(); i++) {
            char[] chars = str.toCharArray();

            // 尝试所有字母
            for (char ch = 'a'; ch <= 'z'; ch++) {
                if (chars[i] == ch) {
                    continue;
                }
                chars[i] = ch;
                String word = new String(chars);
                if (set2.contains(word)) {
                    return true;
                }
                // 如果还没有相遇，并且新的单词在 word 中，那么就加到 set 中
                if (wordSet.contains(word)) {
                    set.add(word);
                }
            }
        }
    }
    //如果当前进行了扩展，长度加 1
    if (set.size() > 0) {
        len++;
    }
    // 一般情况下新扩展的元素会多一些，所以我们下次反方向扩展 set2
    return bfsHelper(set2, set, wordSet);

}
```

当然，也可以不用递归，可以用两个队列就行了，直接把 [这里](<https://leetcode.com/problems/word-ladder/discuss/40711/Two-end-BFS-in-Java-31ms.>) 的代码贴过来供参考把，思想还是不变的。

```C++
public class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        if(!wordList.contains(endWord)) return 0;
        Set<String> beginSet = new HashSet<String>(), endSet = new HashSet<String>();
        int len = 1;
        HashSet<String> visited = new HashSet<String>();
        HashSet<String> dict = new HashSet<String>(wordList);
        beginSet.add(beginWord);
        endSet.add(endWord);
        while (!beginSet.isEmpty() && !endSet.isEmpty()) {
            if (beginSet.size() > endSet.size()) {
                Set<String> set = beginSet;
                beginSet = endSet;
                endSet = set;
            }

            Set<String> temp = new HashSet<String>();
            for (String word : beginSet) {
                char[] chs = word.toCharArray();

                for (int i = 0; i < chs.length; i++) {
                    for (char c = 'a'; c <= 'z'; c++) {
                        char old = chs[i];
                        chs[i] = c;
                        String target = String.valueOf(chs);

                        if (endSet.contains(target)) {
                            return len + 1;
                        }

                        if (!visited.contains(target) && dict.contains(target)) {
                            temp.add(target);
                            visited.add(target);
                        }
                        chs[i] = old;
                    }
                }
            }
            beginSet = temp;
            len++;
        }
        return 0;
    }
}
```

# 总

基本上和 [126 题](<https://leetcode.wang/leetCode-126-Word-LadderII.html>) 解决思路是一样的，主要就是 `BFS` 的应用。解法二中，直接在递归中的基础上用全局变量，有时候确实很方便，哈哈，比如之前的 [124 题](<https://leetcode.wang/leetcode-124-Binary-Tree-Maximum-Path-Sum.html>)。

