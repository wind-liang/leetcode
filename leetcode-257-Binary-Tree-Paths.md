# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/257.jpg)

输出从根到叶子节点的所有路径。

# 思路分析

很明显是一个二叉树遍历的问题，我们可以用递归形式的 `DFS` ，使用栈形式的 `DFS`，使用队列形式的 `BFS`。

和 [112 题](https://leetcode.wang/leetcode-112-Path-Sum.html) 差不多，这里就不详细说了。

只给出 `DFS` 递归的代码了，其他代码的话可以参考 [这里](https://leetcode.com/problems/binary-tree-paths/discuss/68278/My-Java-solution-in-DFS-BFS-recursion)。

# 解法一 DFS

用 `result` 保存所有解，到达叶子节点的时候就将结果保存起来。

```java
public List<String> binaryTreePaths(TreeNode root) {
    List<String> result = new ArrayList<>();
    if(root == null){
        return result;
    }
    binaryTreePaths(root, "", result);
    return result;
}

private void binaryTreePaths(TreeNode root, String temp, List<String> result) {
    if (root.left == null && root.right == null) {
        temp = temp + root.val;
        result.add(temp);
        return;
    }
    if (root.left != null) {
        binaryTreePaths(root.left, temp + root.val + "->", result);
    }
    if (root.right != null) {
        binaryTreePaths(root.right, temp + root.val + "->", result);
    }
}
```

# 总

考察的就是二叉树的遍历，很基础的一道题。