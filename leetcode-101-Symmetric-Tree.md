# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/101.jpg)

判断一个二叉树是否关于中心轴对称。

# 解法一

和 [100 题](<https://leetcode.wang/leetcode-100-Same-Tree.html>) 判断两个二叉树是否相等其实是一样的思路，都是用某种遍历方法来同时遍历**两个树**，然后看是否**对应相等**。

这里的需要遍历的两个树就是左子树和右子树了。

这里的对应相等的话，因为判断左子树 A 和右子树 B 是否对称，需要判断两点。

* A 的根节点和 B 的根节点是否相等
* A 的左子树和 B 的右子树是否相等，同时 A 的右子树和左子树是否相等。

上边两点都满足，就表示是对称的。所以代码就出来了。

```java
public boolean isSymmetric5(TreeNode root) {
    if (root == null) {
        return true;
    }
    return isSymmetricHelper(root.left, root.right);
}

private boolean isSymmetricHelper(TreeNode left, TreeNode right) {
    //有且仅有一个为 null ，直接返回 false
    if (left == null && right != null || left != null && right == null) {
        return false;
    }
    if (left != null && right != null) 
        //A 的根节点和 B 的根节点是否相等
        if (left.val != right.val) {
            return false;
        }
    	//A 的左子树和 B 的右子树是否相等，同时 A 的右子树和左子树是否相等。
        return isSymmetricHelper(left.left, right.right) && isSymmetricHelper(left.right, right.left);
    }
	//都为 null，返回 true
    return true;
}
```

# 解法二 DFS 栈

解法一其实就是类似于 DFS 的先序遍历。不同之处是对于 left 子树是正常的先序遍历 根节点 -> 左子树 -> 右子树 的顺序，对于 right 子树的话是 根节点 -> 右子树 -> 左子树 的顺序。

所以我们可以用栈，把递归改写为迭代的形式。

```java
public boolean isSymmetric(TreeNode root) { 
    if (root == null) {
        return true;
    }
    Stack<TreeNode> stackLeft = new Stack<>();
    Stack<TreeNode> stackRight = new Stack<>();
    TreeNode curLeft = root.left;
    TreeNode curRight = root.right;
    while (curLeft != null || !stackLeft.isEmpty() || curRight!=null || !stackRight.isEmpty()) {
        // 节点不为空一直压栈
        while (curLeft != null) {
            stackLeft.push(curLeft);
            curLeft = curLeft.left; // 考虑左子树
        }
        while (curRight != null) {
            stackRight.push(curRight);
            curRight = curRight.right; // 考虑右子树
        }
        //长度不同就返回 false
        if (stackLeft.size() != stackRight.size()) {
            return false;
        }
        // 节点为空，就出栈
        curLeft = stackLeft.pop();
        curRight = stackRight.pop();

        // 当前值判断
        if (curLeft.val != curRight.val) {
            return false;
        }
        // 考虑右子树
        curLeft = curLeft.right;
        curRight = curRight.left;
    }
    return true;
}
```

当然我们也可以使用中序遍历或者后序遍历，是一样的道理。

# 解法三 BFS 队列

DFS 考虑完了，当然还有 BFS，一层一层的遍历两个树，然后判断**对应**的节点是否相等即可。

利用两个队列来保存下一次遍历的节点即可。

```java
public boolean isSymmetric6(TreeNode root) {
    if (root == null) {
        return true;
    }
    Queue<TreeNode> leftTree = new LinkedList<>();
    Queue<TreeNode> rightTree = new LinkedList<>();
    //两个树的根节点分别加入
    leftTree.offer(root.left);
    rightTree.offer(root.right);
    while (!leftTree.isEmpty() && !rightTree.isEmpty()) {
        TreeNode curLeft = leftTree.poll();
        TreeNode curRight = rightTree.poll();
        if (curLeft == null && curRight != null || curLeft != null && curRight == null) {
            return false;
        }
        if (curLeft != null && curRight != null) {
            if (curLeft.val != curRight.val) {
                return false;
            }
            //先加入左子树后加入右子树
            leftTree.offer(curLeft.left);
            leftTree.offer(curLeft.right);
			
            //先加入右子树后加入左子树
            rightTree.offer(curRight.right);
            rightTree.offer(curRight.left);
        }

    }
    if (!leftTree.isEmpty() || !rightTree.isEmpty()) {
        return false;
    }
    return true;
}
```

# 总

总体上来说和 [100 题](<https://leetcode.wang/leetcode-100-Same-Tree.html>) 是一样的，只不过这里的两棵树对应相等，是左对右，右对左。