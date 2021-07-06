# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/199.jpg)

给一个二叉树，然后想象自己站在二叉树右边向左边看过去，返回从上到下看到的数字序列。

# 解法一 

题目意思再说的直白一些，就是依次输出二叉树每层最右边的元素。

每层最右边，可以想到二叉树的层次遍历，我们只需要保存每层遍历的最后一个元素即可。

二叉树的层次遍历在 [102 题](https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html) 已经做过了，代码拿过来用就可以。

我们只需要用一个队列，每次保存下层的元素即可。

```java
public List<Integer> rightSideView(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<Integer> res = new LinkedList<>();
    if (root == null)
        return res;
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            //只保存当前层的最后一个元素
            if (i == levelNum - 1) {
                res.add(curNode.val);
            }
            if (curNode.left != null) {
                queue.offer(curNode.left);
            }
            if (curNode.right != null) {
                queue.offer(curNode.right);
            }

        }
    }
    return res;
}
```

# 解法二

解法一的层次遍历是最直接的想法。我们也可以用深度优先遍历，在 [这里](https://leetcode.com/problems/binary-tree-right-side-view/discuss/56012/My-simple-accepted-solution(JAVA)) 看到的。

二叉树的深度优先遍历在之前也讨论过了， [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 的中序遍历、 [144 题](https://leetcode.wang/leetcode-144-Binary-Tree-Preorder-Traversal.html) 的先序遍历以及 [145 题](https://leetcode.wang/leetcode-145-Binary-Tree-Postorder-Traversal.html) 的后序遍历。

这里采用最简单的递归写法，并且优先从右子树开始遍历。

用一个变量记录当前层数，每次保存第一次到达该层的元素。

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new LinkedList<>();
    rightSideViewHelper(root, 0, res);
    return res;
}

private void rightSideViewHelper(TreeNode root, int level, List<Integer> res) {
    if (root == null) {
        return;
    }
    //res.size() 的值理解成当前在等待的层级数
    //res.size() == 0, 在等待 level = 0 的第一个数
    //res.size() == 1, 在等待 level = 1 的第一个数
    //res.size() == 2, 在等待 level = 2 的第一个数
    if (level == res.size()) {
        res.add(root.val);
    }
    rightSideViewHelper(root.right, level + 1, res);
    rightSideViewHelper(root.left, level + 1, res);
}
```

# 总

这道题其实本质上就是考了二叉树的层次遍历和深度优先遍历。