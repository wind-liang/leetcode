# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/103.jpg)

和 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 类似，二叉树的层次遍历。只不过这题要求，第 1 层从左到右，第 2 层从右到左，第 3 层从左到右，第 4 层从右到左，交替进行。

# 思路分析

大家可以先做下 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 吧，直接在 102 题的基础上进行修改即可。从左到右和从右到左交替，所以我们只需要判断当前的 `level`，层数从 0 开始的话，偶数就把元素添加到当前层的末尾，奇数的话，每次把新元素添加到头部，这样就实现了从右到左的遍历。

# 解法一 DFS

判断 level 是偶数还是奇数即可。

```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>();
    DFS(root, 0, ans);
    return ans;
}

private void DFS(TreeNode root, int level, List<List<Integer>> ans) {
    if (root == null) {
        return;
    }
    if (ans.size() <= level) {
        ans.add(new ArrayList<>());
    }
    if ((level % 2) == 0) {
        ans.get(level).add(root.val); //添加到末尾
    } else {
        ans.get(level).add(0, root.val); //添加到头部
    }

    DFS(root.left, level + 1, ans);
    DFS(root.right, level + 1, ans);
}
```

# 解法二 BFS 队列

如果是顺序刷题，前边的 [97 题](https://leetcode.wang/leetCode-97-Interleaving-String.html#%E8%A7%A3%E6%B3%95%E4%B8%89-%E5%B9%BF%E5%BA%A6%E4%BC%98%E5%85%88%E9%81%8D%E5%8E%86-bfs)，[ 98 题](https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html#%E8%A7%A3%E6%B3%95%E4%B8%89-dfs-bfs)，[101 题](https://leetcode.wang/leetcode-101-Symmetric-Tree.html#%E8%A7%A3%E6%B3%95%E4%B8%89-bfs-%E9%98%9F%E5%88%97)，都用到了 BFS ，应该很熟悉了。

之前我们用一个 `while` 循环，不停的从队列中拿一个节点，并且在循环中将当前取出来的节点的左孩子和右孩子也加入到队列中。

相比于这道题，我们要解决的问题是，怎么知道当前节点的 `level` 。

## 第一种方案

定义一个新的 class，class 里边两个成员 node 和 level，将我们新定义的 class 每次加入到队列中。或者用一个新的队列和之前的节点队列同步入队出队，新的队列存储 level。

下边的代码实现后一种，并且对 level 进行判断。

```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>();
    if (root == null) {
        return ans;
    }
    Queue<TreeNode> treeNode = new LinkedList<>();
    Queue<Integer> nodeLevel = new LinkedList<>();
    treeNode.offer(root);
    int level = 0;
    nodeLevel.offer(level);
    while (!treeNode.isEmpty()) {
        TreeNode curNode = treeNode.poll();
        int curLevel = nodeLevel.poll();
        if (curNode != null) {
            if (ans.size() <= curLevel) {
                ans.add(new ArrayList<>());
            }
            if ((curLevel % 2) == 0) {
                ans.get(curLevel).add(curNode.val);
            } else {
                ans.get(curLevel).add(0, curNode.val);
            }
            level = curLevel + 1;
            treeNode.offer(curNode.left);
            nodeLevel.offer(level);
            treeNode.offer(curNode.right);
            nodeLevel.offer(level);
        }
    }
    return ans;
}
```

# 第二种方案

把 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 的解释贴过来。

> 我们在 while 循环中加一个 for 循环，循环次数是循环前的队列中的元素个数即可，使得每次的 while 循环出队的元素都是同一层的元素。
>
> for 循环结束也就意味着当前层结束了，而此时的队列存储的元素就是下一层的所有元素了。

这道题我们要知道当前应该是从左到右还是从右到左，最直接的方案当然是增加一个 `level` 变量，和上边的解法一样，来判断 `level` 是奇数还是偶数即可。

```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<List<Integer>> ans = new LinkedList<List<Integer>>();
    if (root == null)
        return ans;
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        List<Integer> subList = new LinkedList<Integer>();
        int level = 0;
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            if (curNode != null) {
                if ((level % 2) == 0) {
                    subList.add(curNode.val);
                } else {
                    subList.add(0, curNode.val);
                }
                queue.offer(curNode.left);
                queue.offer(curNode.right);
            }
        }
        //因为上边 queue.offer(curNode.left) 没有判断是否是 null
        //所以要判断当前是否有元素
        if (subList.size() > 0) {
            ans.add(subList);
        }
        level++;
    }
    return ans;
}
```

除了增加 `level` 变量外，我们还可以增加一个 `boolean` 变量来区别当前从左还是从右。此外 [这里](<https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/discuss/33815/My-accepted-JAVA-solution>) 的评论里，看到了另外一种想法，不用添加新的变量。我们直接判断当前 `ans` 的大小，如果大小是 n 代表当前在添加第 n 层。

# 解法三

[这里](<https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/discuss/33904/JAVA-Double-Stack-Solution>) 看到一个有趣的想法，分享一下。

我们直接用两个栈（或者队列）轮换着添加元素，一个栈从左到右添加元素，一个栈从右到左添加元素。

```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    TreeNode c=root;
    List<List<Integer>> ans =new ArrayList<List<Integer>>();
    if(c==null) return ans;
    Stack<TreeNode> s1=new Stack<TreeNode>();
    Stack<TreeNode> s2=new Stack<TreeNode>();
    s1.push(root);
    while(!s1.isEmpty()||!s2.isEmpty())
    {
        List<Integer> tmp=new ArrayList<Integer>();
        while(!s1.isEmpty())
        {
            c=s1.pop();
            tmp.add(c.val);
            if(c.left!=null) s2.push(c.left);
            if(c.right!=null) s2.push(c.right);
        }
        ans.add(tmp);
        tmp=new ArrayList<Integer>();
        while(!s2.isEmpty())
        {
            c=s2.pop();
            tmp.add(c.val);
            if(c.right!=null)s1.push(c.right);
            if(c.left!=null)s1.push(c.left);
        }
        if(!tmp.isEmpty()) ans.add(tmp);
    }
    return ans;
}
```

# 总

这道题和 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>) 区别不大，只需要对当前层进行判断即可。解法三用两个栈还是蛮有意思的。