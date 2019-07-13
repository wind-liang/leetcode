# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/102.jpg)

二叉树的层次遍历，输出一个 list 的 list。

# 解法一 DFS

这道题考的就是 BFS，我们可以通过 DFS 实现。只需要在递归过程中将当前 level 传入即可。

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>(); 
    DFS(root, 0, ans);
    return ans;
}

private void DFS(TreeNode root, int level, List<List<Integer>> ans) {
    if(root == null){
        return;
    }
    //当前层数还没有元素，先 new 一个空的列表
    if(ans.size()<=level){
        ans.add(new ArrayList<>());
    }
    //当前值加入
    ans.get(level).add(root.val);

    DFS(root.left,level+1,ans);
    DFS(root.right,level+1,ans);
}
```

# 解法二 BFS 队列

如果是顺序刷题，前边的 [97 题](<https://leetcode.wang/leetCode-97-Interleaving-String.html#%E8%A7%A3%E6%B3%95%E4%B8%89-%E5%B9%BF%E5%BA%A6%E4%BC%98%E5%85%88%E9%81%8D%E5%8E%86-bfs>)，[ 98 题](<https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html#%E8%A7%A3%E6%B3%95%E4%B8%89-dfs-bfs>)，[101 题](<https://leetcode.wang/leetcode-101-Symmetric-Tree.html#%E8%A7%A3%E6%B3%95%E4%B8%89-bfs-%E9%98%9F%E5%88%97>)，都用到了 BFS ，应该很熟悉了。

之前我们用一个 while 循环，不停的从队列中拿一个节点，并且在循环中将当前取出来的节点的左孩子和右孩子也加入到队列中。

相比于这道题，我们要解决的问题是，怎么知道当前节点的 level 。

## 第一种方案

定义一个新的 class，class 里边两个成员 node 和 level，将我们新定义的 class 每次加入到队列中。或者用一个新的队列和之前的节点队列同步入队出队，新的队列存储 level。

下边的代码实现后一种。

```java
public List<List<Integer>> levelOrder(TreeNode root) {
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
            ans.get(curLevel).add(curNode.val);
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

# 方案二

参考[这里](<https://leetcode.com/problems/binary-tree-level-order-traversal/discuss/33450/Java-solution-with-a-queue-used>)。

我们在 while 循环中加一个 for 循环，循环次数是循环前的队列中的元素个数即可，使得每次的 while 循环出队的元素都是同一层的元素。

for  循环结束也就意味着当前层结束了，而此时的队列存储的元素就是下一层的所有元素了。

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<List<Integer>> ans = new LinkedList<List<Integer>>();
    if (root == null)
        return ans;
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        List<Integer> subList = new LinkedList<Integer>();
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            if (curNode != null) {
                subList.add(curNode.val); 
                queue.offer(curNode.left);
                queue.offer(curNode.right);
            }
        }
        if(subList.size()>0){
            ans.add(subList);
        }
    }
    return ans;
}
```

# 总

考察的知识点就是二叉树的 BFS，解法二的方案二是自己不曾想到的， while 循环中加入一个 for 循环，很妙！