# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/124.jpg)

考虑一条路径，可以从任意节点开始，每个节点最多经过一次，问经过的节点的和最大是多少。

# 解法一 递归

参考了 [这里](<https://leetcode.com/problems/binary-tree-maximum-path-sum/discuss/39875/Elegant-Java-solution>)。

首先看到二叉树的题，肯定就是想递归了。递归常规的思路，肯定是递归考虑左子树的最大值，递归考虑右子树的最大值。

```java
public int maxPathSum(TreeNode root) {
    if (root == null) {
        return Integer.MIN_VALUE;
    }
    //左子树的最大值
    int left = maxPathSum(root.left);
    //右子树的最大值
    int right = maxPathSum(root.right);  
    //再考虑包含根节点的最大值
    int  all = ....;
    return Math.max(Math.max(left, right), all);
}
```

问题就来了，怎么考虑包含根节点的最大路径等于多少？因为我们递归求出来的最大 `left` 可能不包含根节点的左孩子，例如下边的情况。

```java
     8
    / \
  -3   7
 /  \
1    4
```

左子树的最大值 `left` 肯定就是 `4` 了，然而此时的根节点 `8` 并不能直接和 `4` 去相连。所以考虑包含根节点的路径的最大值时，并不能单纯的用 `root.val + left + right`。

所以如果考虑包含当前根节点的 `8` 的最大路径，首先必须包含左右孩子，其次每次遇到一个分叉，就要选择能产生更大的值的路径。例如下边的例子：

```java
      8
    /  \
   -3   7
 /    \
1      4
 \    / \    
  3  2   6

考虑左子树 -3 的路径的时候，我们有左子树 1 和右子树 4 的选择，但我们不能同时选择
如果同时选了，路径就是 ... -> 1 -> -3 -> 4 -> ... 就无法通过根节点 8 了
所以我们只能去求左子树能返回的最大值，右子树能返回的最大值，选一个较大的
```
假设我们只考虑通过根节点 `8` 的最大路径是多少，那么代码就可以写出来了。

```java

public int maxPathSum(TreeNode root) {
    //如果最大值是负数，我们选择不选
    int left = Math.max(helper(root.left), 0);
    int right = Math.max(helper(root.right), 0); 
    return root.val + left + right;
}

int helper(TreeNode root) {
    if (root == null) return 0; 
    int left = Math.max(helper(root.left), 0);
    int right = Math.max(helper(root.right), 0);  
    //选择左子树和右子树产生的值较大的一个
    return root.val + Math.max(left, right);
}

```

接下来我觉得就是这道题最精彩的地方了，现在我们只考虑了包含最初根节点 `8` 的路径。那如果不包含当前根节点，而是其他的路径呢？

可以发现在 `helper` 函数中，我们每次都求了当前给定的节点的左子树和右子树的最大值，和我们 `maxPathSum` 函数的逻辑是一样的。所以我们利用一个全局变量，在考虑 `helper` 函数中当前 `root` 的时候，同时去判断一下包含当前 `root` 的路径的最大值。

这样在递归过程中就考虑了所有包含当前节点的情况。

```java
int max = Integer.MIN_VALUE;

public int maxPathSum(TreeNode root) {
    helper(root);
    return max;
} 
int helper(TreeNode root) {
    if (root == null) return 0;

    int left = Math.max(helper(root.left), 0);
    int right = Math.max(helper(root.right), 0);
    
    //求的过程中考虑包含当前根节点的最大路径
    max = Math.max(max, root.val + left + right);
    
    //只返回包含当前根节点和左子树或者右子树的路径
    return root.val + Math.max(left, right);
}
```

# 总

这道题最妙的地方就是在递归中利用全局变量，来更新最大路径的值，太强了。前边遇到过和全局变量结合的递归，例如 [106 题](<https://leetcode.wang/leetcode-106-Construct-Binary-Tree-from-Inorder-and-Postorder-Traversal.html#%E8%A7%A3%E6%B3%95%E4%BA%8C-stop-%E5%80%BC>)，当递归和全局变量结合有时候确实会难理解些。而在 [ 110 题](<https://leetcode.wang/leetcode-110-Balanced-Binary-Tree.html>) 中也应用了和这个题一样的思想，就是发现递归过程和主函数有一样的逻辑，此时可以在递归过程中就可以进行求解。

