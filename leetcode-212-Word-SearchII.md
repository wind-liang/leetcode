# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/212.jpg)

[79 题](https://leetcode.wang/leetCode-79-Word-Search.html) Word Search 的延续。

意思就是从某个字符出发，然后它可以向左向右向上向下移动，走过的路径构成一个字符串，判断是否能走出给定字符串的 word ，还有一个条件就是走过的字符不能够走第二次。

比如 eat，从第二行最后一列的 e 出发，向左移动，再向左移动，就走出了 eat。

题目中给一个 word 列表，要求找出哪些单词可以由 `board` 生成。

# 解法一

直接利用 [79 题](https://leetcode.wang/leetCode-79-Word-Search.html) 的代码 ，79 题是判断某个单词能否在 board 中生成。这里的话，很简单，直接遍历 `words` 数组，然后利用 79 题的代码去依次判断即可。

[79 题 ](https://leetcode.wang/leetCode-79-Word-Search.html)使用的时候采用 `dfs` ，没做过的话大家可以先过去看一下。

```java
public List<String> findWords(char[][] board, String[] words) {
    List<String> res = new ArrayList<>();
    //判断每个单词
    for (String word : words) {
        if (exist(board, word)) {
            res.add(word);
        }
    }
    return res;
}
//下边是 79 题的代码
public boolean exist(char[][] board, String word) {
    int rows = board.length;
    if (rows == 0) {
        return false;
    }
    int cols = board[0].length;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (existRecursive(board, i, j, word, 0)) {
                return true;
            }
        }
    }
    return false;
}

private boolean existRecursive(char[][] board, int row, int col, String word, int index) {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
        return false;
    }
    if (board[row][col] != word.charAt(index)) {
        return false;
    }
    if (index == word.length() - 1) {
        return true;
    }
    char temp = board[row][col];
    board[row][col] = '$';
    boolean up = existRecursive(board, row - 1, col, word, index + 1);
    if (up) {
        board[row][col] = temp; //将 board 还原, 79 题中的代码没有还原，这里必须还原
        return true;
    }
    boolean down = existRecursive(board, row + 1, col, word, index + 1);
    if (down) {
        board[row][col] = temp;//将 board 还原, 79 题中的代码没有还原，这里必须还原
        return true;
    }
    boolean left = existRecursive(board, row, col - 1, word, index + 1);
    if (left) {
        board[row][col] = temp;//将 board 还原, 79 题中的代码没有还原，这里必须还原
        return true;
    }
    boolean right = existRecursive(board, row, col + 1, word, index + 1);
    if (right) {
        board[row][col] = temp;//将 board 还原, 79 题中的代码没有还原，这里必须还原
        return true;
    }
    board[row][col] = temp;
    return false;
}
```

然后它竟然过了，竟然过了。。。我还以为这么暴力一定会暗藏玄机。不过为了尊重它是一道 hard 的题目，我就继续思考能不能优化下。

顺着上边的思路想，首先 [79 题 ](https://leetcode.wang/leetCode-79-Word-Search.html) 中判断单个单词是否能生成肯定不能优化了，不然之前肯定会写优化方法。那么继续优化的话，就只能去寻求不同 `word` 的之间的联系了。

什么意思呢？

就是如果知道了某个单词能生成，那么对于后边将要判断的单词能不能提供些帮助呢？

或者知道了某个单词不能生成，对于后边将要判断的单词能不能提供些帮助呢？

想了想，只想到了一种情况。比如我们已经知道了 `basketboard` 能够在二维数组 `board` 中生成。那么它的所有前缀一定也能生成，比如 `basket` 一定能够生成。

说到前缀，自然而然的想到了之前的前缀树，这几天出现的频率也比较高，刚做的 [211 题](https://leetcode.wang/leetcode-211-Add-And-Search-Word-Data-structure-design.html) 也用到了。我们可以把能生成的 `word` 加入到前缀树中，然后再判断后边的单词前，先判断它是不是前缀树中某个单词的前缀。

当然如果单词 `A` 是 `B` 的前缀，那么 `A` 的长度肯定短一些，所以我们必须先判断了较长的单词 `B`，才能产生优化的效果。所以我们首先要把 `words` 按照单词的长度从大到小排序。

小弟不才，只想到了这一种联系，下边是代码，前缀树直接搬 [208 题](https://leetcode.wang/leetcode-208-Implement-Trie-Prefix-Tree.html) 的代码即可。

```java
//208 题前缀树代码
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
            // 当前孩子是否存在
            if (cur.children[array[i] - 'a'] == null) {
                cur.children[array[i] - 'a'] = new TrieNode();
            }
            cur = cur.children[array[i] - 'a'];
        }
        // 当前节点代表结束
        cur.flag = true;
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
//本题代码
public List<String> findWords(char[][] board, String[] words) {
    //将单词的长度从大到小排序
    Arrays.sort(words, new Comparator<String>() {
        @Override
        public int compare(String o1, String o2) {
            return o2.length() - o1.length();
        }

    });
    Trie trie = new Trie();
    List<String> res = new ArrayList<>();
    for (String word : words) {
        //判断当前单词是否是已经完成的单词的前缀
        if (trie.startsWith(word)) {
            res.add(word);
            continue;
        }
        if (exist(board, word)) {
            res.add(word);
            //加入到前缀树中
            trie.insert(word);
        }
    }
    return res;
}
//下边是 79 题的代码
public boolean exist(char[][] board, String word) {
    int rows = board.length;
    if (rows == 0) {
        return false;
    }
    int cols = board[0].length;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (existRecursive(board, i, j, word, 0)) {
                return true;
            }
        }
    }
    return false;
}


private boolean existRecursive(char[][] board, int row, int col, String word, int index) {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
        return false;
    }
    if (board[row][col] != word.charAt(index)) {
        return false;
    }
    if (index == word.length() - 1) {
        return true;
    }
    char temp = board[row][col];
    board[row][col] = '$';
    boolean up = existRecursive(board, row - 1, col, word, index + 1);
    if (up) {
        board[row][col] = temp;
        return true;
    }
    boolean down = existRecursive(board, row + 1, col, word, index + 1);
    if (down) {
        board[row][col] = temp;
        return true;
    }
    boolean left = existRecursive(board, row, col - 1, word, index + 1);
    if (left) {
        board[row][col] = temp;
        return true;
    }
    boolean right = existRecursive(board, row, col + 1, word, index + 1);
    if (right) {
        board[row][col] = temp;
        return true;
    }
    board[row][col] = temp;
    return false;
}
```

然而事实是残酷的，对于 `leetcode` 的 `test cases` ，这个想法并没有带来速度上的提升。于是就去逛 `discuss` 了，也就是下边的解法二。

# 解法二

参考 [这里](https://leetcode.com/problems/word-search-ii/discuss/59780/Java-15ms-Easiest-Solution-(100.00))。

解法一中的想法是，`从 words 中依次选定一个单词` -> `从图中的每个位置出发，看能否找到这个单词`

我们其实可以倒过来。`从图中的每个位置出发` -> `看遍历过程中是否遇到了 words 中的某个单词`

遍历过程中判断是否遇到了某个单词，我们可以事先把所有单词存到前缀树中。这样的话，如果当前走的路径不是前缀树的前缀，我们就可以提前结束了。如果是前缀树的中的单词，我们就将其存到结果中。

至于实现的话，我们可以在遍历过程中，将当前路径的单词传进函数，然后判断当前路径构成的单词是否是在前缀树中出现即可。

这个想法可行，但不够好，因为每次都从前缀树中判断当前路径的单词，会带来重复的判断。比如先判断了 `an` 存在于前缀树中，接下来假如路径变成 `ang` ，判断它在不在前缀中，又需要判断一遍 `an` 。

因此，我们可以将前缀树融合到我们的算法中，递归中去传递前缀树的节点，判断当前节点的孩子是否为 `null`，如果是 `null` 说明当前前缀不存在，可以提前结束。如果不是 `null`，再判断当前节点是否是单词的结尾，如果是结尾直接将当前单词加入。

由于递归过程中没有加路径，所以我们改造一下前缀树的节点，将单词直接存入节点，这样的话就可以直接取到了。

干巴巴的文字可能不好理解，看一下下边的代码应该就明白了。

```java
//改造前缀树节点
class TrieNode {
    public TrieNode[] children;
    public String word; //节点直接存当前的单词

    public TrieNode() {
        children = new TrieNode[26];
        word = null;
        for (int i = 0; i < 26; i++) {
            children[i] = null;
        }
    }
}
class Trie {
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
            // 当前孩子是否存在
            if (cur.children[array[i] - 'a'] == null) {
                cur.children[array[i] - 'a'] = new TrieNode();
            }
            cur = cur.children[array[i] - 'a'];
        }
        // 当前节点结束，存入当前单词
        cur.word = word;
    }
};

class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        Trie trie = new Trie();
        //将所有单词存入前缀树中
        List<String> res = new ArrayList<>();
        for (String word : words) {
            trie.insert(word);
        }
        int rows = board.length;
        if (rows == 0) {
            return res;
        }
        int cols = board[0].length;
        //从每个位置开始遍历
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                existRecursive(board, i, j, trie.root, res);
            }
        }
        return res;
    }

    private void existRecursive(char[][] board, int row, int col, TrieNode node, List<String> res) {
        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
            return;
        }
        char cur = board[row][col];//将要遍历的字母
        //当前节点遍历过或者将要遍历的字母在前缀树中不存在
        if (cur == '$' || node.children[cur - 'a'] == null) {
            return;
        }
        node = node.children[cur - 'a'];
        //判断当前节点是否是一个单词的结束
        if (node.word != null) {
            //加入到结果中
            res.add(node.word);
            //将当前单词置为 null，防止重复加入
            node.word = null;
        }
        char temp = board[row][col];
        //上下左右去遍历
        board[row][col] = '$';
        existRecursive(board, row - 1, col, node, res);
        existRecursive(board, row + 1, col, node, res);
        existRecursive(board, row, col - 1, node, res);
        existRecursive(board, row, col + 1, node, res);
        board[row][col] = temp;
    }
}
```

结合代码就很好懂了，就是从每个位置对图做深度优先搜索，然后路径生成的字符串如果没有在前缀树中出现就提前结束，如果到了前缀树中某个单词的结束，就将当前单词加入即可。

# 总

受到前边的题目思维的限制，只想到了解法一，优化的话也没有很成功。其实把思路倒过来，解法二也就可以出来了，很有意思。