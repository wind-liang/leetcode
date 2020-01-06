# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/208.jpg)

实现 `Trie` 数，即前缀树。`trie`的发明者 Edward Fredkin 把它读作 `/ˈtriː/ "tree"`。但是，其他作者把它读作`/traɪ/"try"`。

# 解法一

算作一个高级的数据结构，实现方式可以通过 `26` 叉树。每个节点存一个字母，根节点不存字母。

```java
"app" "as" "cat" "yes" "year" "you"
              root
          /    |    \
         a     c      y
        / \    |     / \
       p   s   a    e   o
      /        |   / \   \
     p         t  s   a   u
                      |
                      r     
上图中省略了 null 节点，对于第一层画完整了其实是下边的样子, 图示中用 0 代表 null
                                   root
         / | | | | | | | | | | | | | | | | | | | | | | | | \
        a  0 c 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 y  0          
其它层同理            
```

代码的话，我们定义一个节点，每个节点包含一个节点数组，代表 `26` 个孩子。此外，还需要一个 `flag` 变量来标记当前节点是否是某个单词的结束。

```java
class TrieNode {
    TrieNode[] children;
    boolean flag;
    public TrieNode() {
        children = new TrieNode[26];
        flag = false;
        //节点初始化为 null
        for (int i = 0; i < 26; i++) {
            children[i] = null;
        }
    }
}
```

然后只需要实现题目中所需要的三个函数即可。其中 `children[0]` 存 `a`， `children[1]` 存 `b`， `children[2]` 存 `c`... 依次类推。所以存的时候我们用当前字符减去 `a` ，从而得到相应的 `children` 下标。

```java
class Trie {
    class TrieNode {
        TrieNode[] children;
        boolean flag;
        public TrieNode() {
            children = new TrieNode[26];
            flag = false;
            for (int i = 0; i < 26; i++) {
                children[i] = null;
            }
        }
    }

    TrieNode root;

    /** Initialize your data structure here. */
    public Trie() {
        root = new TrieNode();
    }

    /** Inserts a word into the trie. */
    public void insert(String word) {
        char[] array = word.toCharArray();
        TrieNode cur = root;
        for (int i = 0; i < array.length; i++) {
            //当前孩子是否存在
            if (cur.children[array[i] - 'a'] == null) {
                cur.children[array[i] - 'a'] = new TrieNode();
            }
            cur = cur.children[array[i] - 'a'];
        }
        //当前节点代表结束
        cur.flag = true;
    }

    /** Returns if the word is in the trie. */
    public boolean search(String word) {
        char[] array = word.toCharArray();
        TrieNode cur = root;
        for (int i = 0; i < array.length; i++) {
            //不含有当前节点
            if (cur.children[array[i] - 'a'] == null) {
                return false;
            }
            cur = cur.children[array[i] - 'a'];
        }
        //当前节点是否为是某个单词的结束
        return cur.flag;
    }

    /**
	 * Returns if there is any word in the trie that starts with the given
	 * prefix.
	 */
    public boolean startsWith(String prefix) {
        char[] array = prefix.toCharArray();
        TrieNode cur = root;
        for (int i = 0; i < array.length; i++) {
            if (cur.children[array[i] - 'a'] == null) {
                return false;
            }
            cur = cur.children[array[i] - 'a'];
        }
        return true;
    }

};
```

# 总

只要知道每个节点存字母，路径代表单词，代码就很好写出来了。

前缀树适用于两个场景。

* 统计每个单词出现的次数，代码的话只需要将上边的 `flag` 改成 `int` 类型，然后每次插入的时候计数即可。

  当然，我们用 `HashMap` 也可以做到，`key` 是单词，`value` 存这个单词出现的次数即可。但缺点是，当单词很多很多的时候，受到 `Hash` 函数的影响，`hash` 值会经常出现冲突，算法可能退化为 `O(n)`，`n` 是 `key` 的总数。

  而对于前缀树，我们查找一个单词出现的次数，始终是 `O(m)`，`m` 为单词的长度。

* 查找某个前缀的单词，最常见的比如搜索引擎的提示、拼写检查、ip 路由等。

