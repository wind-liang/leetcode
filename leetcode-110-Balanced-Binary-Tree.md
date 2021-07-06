# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/110.jpg)

判断一棵树是否是平衡二叉树，平衡二叉树定义如下：

> 它是一棵空树或它的左右两个子树的高度差的绝对值不超过 1，并且左右两个子树都是一棵平衡二叉树。

# 解法一

直接按照定义来吧，并且多定义一个求高度的函数，之前在 [104 题](<https://leetcode.wang/leetcode-104-Maximum-Depth-of-Binary-Tree.html>) 做过。

```java
public boolean isBalanced(TreeNode root) {
    //它是一棵空树
    if (root == null) {
        return true;
    }
    //它的左右两个子树的高度差的绝对值不超过1
    int leftDepth = getTreeDepth(root.left);
    int rightDepth = getTreeDepth(root.right);
    if (Math.abs(leftDepth - rightDepth) > 1) {
        return false;
    }
    //左右两个子树都是一棵平衡二叉树
    return isBalanced(root.left) && isBalanced(root.right);

}

private int getTreeDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int leftDepth = getTreeDepth(root.left);
    int rightDepth = getTreeDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}
```

# 解法二

大家觉不觉得解法一怪怪的，有一种少了些什么的感觉，自己写之前就有这种感觉，写完以后仔细分析了一下。

当我们求左子树的高度时，同样是利用了递归去求它的左子树的高度和右子树的高度。

当代码执行到 

```java
isBalanced(root.left) && isBalanced(root.right)
```

递归的判断左子树和右子树是否是平衡二叉树的时候，我们又会继续求高度，求高度再次进入 `getTreeDepth` 函数的时候，我们会发现，其实在上一次这些高度都已经求过了。

第二个不好的地方在于， `getTreeDepth`  递归的求高度的时候，也是求了左子树的高度，右子树的高度，此时完全可以判断当前树是否是平衡二叉树了，而不是再继续求高度。

综上，我们其实只需要求一次高度，并且在求左子树和右子树的高度的同时，判断一下当前是否是平衡二叉树。

考虑到 `getTreeDepth`  函数返回的是`int`值，同时高度不可能为负数，那么如果求高度过程中我们发现了当前不是平衡二叉树，就返回`-1`。

```java
private int getTreeDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int leftDepth = getTreeDepth(root.left); 
    int rightDepth = getTreeDepth(root.right); 
    if (Math.abs(leftDepth - rightDepth) > 1) {
        return -1;
    }
    return Math.max(leftDepth, rightDepth) + 1;
}
```

上边的代码还是有问题的，

```java
int leftDepth = getTreeDepth(root.left); 
int rightDepth = getTreeDepth(root.right); 
```

如果左右子树都不是平衡二叉树，此时都返回了`-1`，那么再执行下边的代码。

```java
if (Math.abs(leftDepth - rightDepth) > 1) {
    return -1;
}
```

它们的差会是 0，不会进入`if`中，但是本来应该进入 `if` 返回 `-1` 的。

所以当发现 `leftDepth`返回 `-1` 的时候，我们需要提前返回 `-1`。`rightDepth`也会有同样的问题，所以也需要提前返回 `-1`。

```java
private int getTreeDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int leftDepth = getTreeDepth(root.left);
    if (leftDepth == -1) {
        return -1;
    }
    int rightDepth = getTreeDepth(root.right);
    if (rightDepth == -1) {
        return -1;
    }
    if (Math.abs(leftDepth - rightDepth) > 1) {
        return -1;
    }
    return Math.max(leftDepth, rightDepth) + 1;
}
```

对于我们要写的 `isBalanced`函数，修改的话就简单了，只需要调用一次 `getTreeDepth`函数，然后判断返回值是不是`-1`就可以了。

```java
public boolean isBalanced(TreeNode root) {
    return getTreeDepth(root) != -1;
}

private int getTreeDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int leftDepth = getTreeDepth(root.left);
    if (leftDepth == -1) {
        return -1;
    }
    int rightDepth = getTreeDepth(root.right);
    if (rightDepth == -1) {
        return -1;
    }
    if (Math.abs(leftDepth - rightDepth) > 1) {
        return -1;
    }
    return Math.max(leftDepth, rightDepth) + 1;
}
```

# 总

还是比较简单的，有时候可能一下子想不到最优的思路，所以可以先把常规的想法先写出来以便理清思路，然后尝试着去优化。