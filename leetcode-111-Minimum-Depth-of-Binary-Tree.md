# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/111.jpg)

返回从根节点到叶子节点最小深度。

# 解法一 递归

和 [104 题](<https://leetcode.wang/leetcode-104-Maximum-Depth-of-Binary-Tree.html>) 有些像，当时是返回根节点到叶子节点的最大深度。记得当时的代码很简单。

```java
public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```

这道题是不是只要把`Math.max`，改成`Math.min`就够了。

```java
public int minDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}
```

粗略的想一下，似乎很完美，比如题目给的例子

```java
     3
    / \
   9   20
      /  \
     15   7
```

根据代码走一遍，`root.left	`返回 `1`，`root.right`返回 `2`，选较小的`1`，加上 `1` 返回结果`2`，完美符合结果。

但如果是下边的样子呢？

```java
     3
    / \
   9   20
  /   /  \
 8   15   7
```

区别在于有一个子树的拥有一个孩子，另一个孩子为空。

这样利用上边的算法，当考虑`9`这个子树的时候，左孩子会返回`1`，由于它的右孩子为`null`，右孩子会返回`0`，选较小的`0`，加上 `1` 返回结果`1`给上一层。

也就是最顶层的`root.left	`依旧得到了 `1`，但明显是不对的，对于左子树，应该是从 `9` 到 `8`，深度应该是 `2`。

所以代码上需要修正这个算法，再想想题目要求是从根节点到叶节点，所以如果有一个子树的左孩子或者右孩子为`null`了，那就意味着这个方向不可能到达叶子节点了，所以就不要再用`Min`函数去判断了。

我对代码的修正如下：

```java
public int minDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return minDepthHelper(root);

}

private int minDepthHelper(TreeNode root) {
    //到达叶子节点就返回 1
    if (root.left == null && root.right == null) {
        return 1;
    }
    //左孩子为空，只考虑右孩子的方向
    if (root.left == null) {
        return minDepthHelper(root.right) + 1;
    }
    //右孩子为空，只考虑左孩子的方向
    if (root.right == null) {
        return minDepthHelper(root.left) + 1;
    }
    //既有左孩子又有右孩子，那么就选一个较小的
    return Math.min(minDepthHelper(root.left), minDepthHelper(root.right)) + 1;
}
```

其实也是可以把两个函数合在一起的，参考[这里](<https://leetcode.com/problems/minimum-depth-of-binary-tree/discuss/36045/My-4-Line-java-solution>)。

```java
public int minDepth(TreeNode root) {
    if (root == null){
        return 0;
    }	
    // 左孩子为空，只考虑右孩子的方向
    if (root.left == null) {
        return minDepth(root.right) + 1;
    }
    // 右孩子为空，只考虑左孩子的方向
    if (root.right == null) {
        return minDepth(root.left) + 1;
    } 
    return Math.min(minDepth(root.left),minDepth(root.right)) + 1;
}
```

此外，还有一个想法，觉得不错，大家可以看看，参考[这里](<https://leetcode.com/problems/minimum-depth-of-binary-tree/discuss/36188/Very-easy-with-recursion-1ms-Java-solution>)。

```java
public int minDepth(TreeNode root) {
    if (root == null) { 
        return 0;
    }
    if (root.left != null && root.right != null) {
        return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
    } else {
        return Math.max(minDepth(root.left), minDepth(root.right)) + 1;
    } 
}
```

当左孩子为空或者右孩子为空的时候，它就直接去选一个较大深度的，因为较小深度一定是为空的那个孩子，是我们不考虑的。

上边三个算法本质上其实是一样的，就是解决了一个孩子为空另一个不为空的问题，而对于[104 题](<https://leetcode.wang/leetcode-104-Maximum-Depth-of-Binary-Tree.html>) 没有出现这个问题，是因为我们选的是`max`，所以不用在意是否有一个为空。

# 解法二 BFS

[104 题](<https://leetcode.wang/leetcode-104-Maximum-Depth-of-Binary-Tree.html>) 也提供了`BFS`的方案，利用一个队列进行层次遍历，用一个 `level` 变量保存当前的深度，代码如下：

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

对于这道题就比较容易修改了，只要在 `for` 循环中判断当前是不是叶子节点，如果是的话，返回当前的 level 就可以了。此外要把`level`初始化改为`1`，因为如果只有一个根节点，它就是叶子节点，而在代码中，level 是在 `for`循环以后才`++`的，如果被提前结束的话，此时应该返回`1`。

```java
public int minDepth(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<List<Integer>> ans = new LinkedList<List<Integer>>();
    if (root == null)
        return 0;
    queue.offer(root);
    /**********修改的地方*****************/
    int level = 1;
    /***********************************/
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            if (curNode != null) {
                /**********修改的地方*****************/
                if (curNode.left == null && curNode.right == null) {
                    return level;
                }
                /***********************************/
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

和 [104 题](<https://leetcode.wang/leetcode-104-Maximum-Depth-of-Binary-Tree.html>) 题对比着考虑的话，只要找到这道题的不同之处，代码就很好写了。