# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/222.jpg)

给一个完全二叉树，输出它的节点个数。

# 解法之前

因为中文翻译的原因，对一些二叉树的概念大家可能不一致，这里我们统一一下。

* full binary tree

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/222_2.jpg)

  下边是维基百科的定义。

  > A **full** binary tree (sometimes referred to as a **proper**[[15\]](https://en.wikipedia.org/wiki/Binary_tree#cite_note-15) or **plane** binary tree)[[16\]](https://en.wikipedia.org/wiki/Binary_tree#cite_note-16)[[17\]](https://en.wikipedia.org/wiki/Binary_tree#cite_note-17) is a tree in which every node has either 0 or 2 children. Another way of defining a full binary tree is a [recursive definition](https://en.wikipedia.org/wiki/Recursive_definition). A full binary tree is either:
  > - A single vertex.
  > - A tree whose root node has two subtrees, both of which are full binary trees.

  每个节点有 `0` 或 `2` 个子节点。

* perfect binary tree

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/222_4.jpg)

  下边是维基百科的定义。

  > A **perfect** binary tree is a binary tree in which all interior nodes have two children *and* all leaves have the same *depth* or same *level*.An example of a perfect binary tree is the (non-incestuous) [ancestry chart](https://en.wikipedia.org/wiki/Ancestry_chart) of a person to a given depth, as each person has exactly two biological parents (one mother and one father). Provided the ancestry chart always displays the mother and the father on the same side for a given node, their sex can be seen as an analogy of left and right children, *children* being understood here as an algorithmic term. A perfect tree is therefore always complete but a complete tree is not necessarily perfect.

  除了叶子节点外，所有节点都有两个子节点，并且所有叶子节点拥有相同的高度。

* complete binary tree

  ![](https://windliang.oss-cn-beijing.aliyuncs.com/222_3.jpg)

  下边是维基百科的定义。

  > In a **complete** binary tree every level, *except possibly the last*, is completely filled, and all nodes in the last level are as far left as possible. It can have between 1 and 2*h* nodes at the last level *h*. An alternative definition is a perfect tree whose rightmost leaves (perhaps all) have been removed. Some authors use the term **complete** to refer instead to a perfect binary tree as defined below, in which case they call this type of tree (with a possibly not filled last level) an **almost complete** binary tree or **nearly complete** binary tree. A complete binary tree can be efficiently represented using an array.

  除去最后一层后就是一个 perfect binary tree，并且最后一层的节点从左到右依次排列。

此外，对于  perfect binary tree，总节点数就是一个等比数列相加。

第`1`层 `1` 个节点，第`2`层 `2` 个节点，第`3`层 `4` 个节点，...，第`h`层 $$2^{h - 1}$$ 个节点。

相加的话，通过等比数列求和的公式。

![](https://windliang.oss-cn-beijing.aliyuncs.com/222_5.jpg)

这里的话，首项 `a1` 是 `1`，公比 `q` 是 `2`，项数 `n` 是 `h`，代入上边的公式，就可以得到节点总数是 $$2^h - 1$$ 。

# 解法一

首先我们考虑普通的二叉树，怎么求总结数。只需要一个递归即可。

```java
public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return countNodes(root.left) + countNodes(root.right) + 1;
}
```

接下来考虑优化，参考 [这里](https://leetcode.com/problems/count-complete-tree-nodes/discuss/61953/Easy-short-c%2B%2B-recursive-solution) 。

上边不管当前是什么二叉树，就直接进入递归了。但如果当前二叉树是一个 perfect binary tree，我们完全可以用公式算出当前二叉树的总节点数。

```java
public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    //因为当前树是 complete binary tree
    //所以可以通过从最左边和从最右边得到的高度判断当前是否是 perfect binary tree
    TreeNode left = root;
    int h1 = 0;
    while (left != null) {
        h1++;
        left = left.left;
    }
    TreeNode right = root;
    int h2 = 0;
    while (right != null) {
        h2++;
        right = right.right;
    }
    //如果是 perfect binary tree 就套用公式求解
    if (h1 == h2) {
        return (1 << h1) - 1;
    } else {
        return countNodes(root.left) + countNodes(root.right) + 1;
    }
}
```

上边用了位运算，`1 << h1` 等价于 $$2^{h1}$$ ，记得**加上括号**，因为 `<<` 运算的优先级比加减还要低。

时间复杂度的话，分析主函数部分，主要是两部分相加。

```java
public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return countNodes(root.left) + countNodes(root.right) + 1;
}
```

首先 complete binary tree 的左子树和右子树中肯定会有一个 perfect binary tree。

假如 `countNodes` 的时间消耗是 `T(n)`。那么对于不是 perfect binary tree 的子树，时间消耗就是  `T(n/2)`，perfect binary tree 那部分因为计算了树的高度，就是 `clog(n)`。

```java
T(n) = T(n/2) + c1 lgn
       = T(n/4) + c1 lgn + c2 (lgn - 1)
       = ...
       = T(1) + c [lgn + (lgn-1) + (lgn-2) + ... + 1]
       = O(lgn*lgn)   
```

所以时间复杂度就是 `O(log²(n))`。

# 解法二

参考 [这里](https://leetcode.com/problems/count-complete-tree-nodes/discuss/61958/Concise-Java-solutions-O(log(n)2)。

解法一中，我们注意到对于  complete binary tree ，左子树和右子树中一定存在 perfect binary tree，而  perfect binary tree 的总结点数可以通过公式计算。所以代码也可以按照下边的思路写。

通过判断整个树的高度和右子树的高度的关系，从而推断出左子树是  perfect binary tree 还是右子树是  perfect binary tree。

如果右子树的高度等于整个树的高度减 `1`，说明左边都填满了，所以左子树是  perfect binary tree ，如下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/222_6.jpg)

否则的话，右子树是 perfect binary tree ，如下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/222_7.jpg)

代码的话，因为是  complete binary tree，所以求高度的时候，可以一直向左遍历。

```java
private int getHeight(TreeNode root) {
    if (root == null) {
        return 0;
    } else {
        return getHeight(root.left) + 1;
    }
}

public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int height = getHeight(root);
    int rightHeight = getHeight(root.right);
    // 左子树是 perfect binary tree
    if (rightHeight == height - 1) {
        // 左子树高度和右子树高度相等
        // 左子树加右子树加根节点
        //return (1 << rightHeight) - 1  + countNodes(root.right) + 1;
        return (1 << rightHeight) + countNodes(root.right);
    // 右子树是 perfect binary tree
    } else {
        // 左子树加右子树加根节点
        //return countNodes(root.left) + (1 << rightHeight) - 1 + 1;
        return countNodes(root.left) + (1 << rightHeight);
    }
}
```

时间复杂度的话，因为使用了类似二分的思想，每次都去掉了二叉树一半的节点，所以总共会进行 `O(log(n))` 次。每次求高度消耗 `O(log(n))` 。因此总的时间复杂度也是  `O(log²(n))`。

# 总

解法一相对更容易想到。不过两种解法都抓住了一个本质，对于  complete binary tree ，左子树和右子树中一定存在 perfect binary tree 。根据这条规则实现了两个算法。

  

  

