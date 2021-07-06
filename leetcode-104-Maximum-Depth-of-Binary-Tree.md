# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/104.jpg)

输出二叉树的深度。

# 解法一  DFS

依旧是考的二叉树的遍历。最简单的思路就是用递归进行 DFS 即可。

```java
public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```

# 解法二 BFS

可以直接仿照 [103 题](<https://leetcode.wang/leetcode-103-Binary-Tree-Zigzag-Level-Order-Traversal.html>)，利用一个队列，进行 BFS 即可。代码可以直接搬过来。

```java
public int maxDepth(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<List<Integer>> ans = new LinkedList<List<Integer>>();
    if (root == null)
        return 0;
    queue.offer(root);
    int level = 0;
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            if (curNode != null) {
                if (curNode.left != null) {
                    queue.offer(curNode.left);
                }
                if (curNode.right != null) { 
                    queue.offer(curNode.right);
                }
            }
        }
        level++;
    }
    return level;
}
```

# 总

依旧考的是二叉树的遍历方式，没有什么难点。