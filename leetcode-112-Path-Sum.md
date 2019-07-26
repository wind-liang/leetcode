# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/112.jpg)

给定一个`sum`，判断是否有一条从根节点到叶子节点的路径，该路径上所有数字的和等于`sum`。

# 解法一 递归

这道题其实和 [111 题](<https://leetcode.wang/leetcode-111-Minimum-Depth-of-Binary-Tree.html>) 是一样的，大家可以先看 [111 题](<https://leetcode.wang/leetcode-111-Minimum-Depth-of-Binary-Tree.html>)  的分析，这道题无非是把 [111 题](<https://leetcode.wang/leetcode-111-Minimum-Depth-of-Binary-Tree.html>) 递归传递的`depth`改为了`sum`的传递。

如果不仔细分析题目，代码可能会写成下边的样子。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    if (root == null) {
        return false;
    }
    return hasPathSumHelper(root, sum);
}

private boolean hasPathSumHelper(TreeNode root, int sum) {
    if (root == null) {
        return sum == 0;
    }
    return hasPathSumHelper(root.left, sum - root.val) || hasPathSumHelper(root.right, sum - root.val);
}
```

看起来没什么问题，并且对于题目给的样例也是没问题的。但是对于下边的样例：

```java
     3
    / \
   9   20
  /   /  \
 8   15   7

sum = 12
```

当某个子树只有一个孩子的时候，就会出问题了，可以看 [111 题](<https://leetcode.wang/leetcode-111-Minimum-Depth-of-Binary-Tree.html>) 的分析。

所以代码需要写成下边的样子。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    if (root == null) {
        return false;
    }
    return hasPathSumHelper(root, sum);
}

private boolean hasPathSumHelper(TreeNode root, int sum) {
    //到达叶子节点
    if (root.left == null && root.right == null) {
        return root.val == sum;
    }
    //左孩子为 null
    if (root.left == null) {
        return hasPathSumHelper(root.right, sum - root.val);
    }
    //右孩子为 null
    if (root.right == null) {
        return hasPathSumHelper(root.left, sum - root.val);
    }
    return hasPathSumHelper(root.left, sum - root.val) || hasPathSumHelper(root.right, sum - root.val);
}
```

# 解法二 BFS

同样的，我们可以利用一个队列对二叉树进行层次遍历。同时还需要一个队列，保存当前从根节点到当前节点已经累加的和。`BFS`的基本框架不用改变，参考 [102 题](<https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html>)。只需要多一个队列，进行细微的改变即可。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    Queue<Integer> queueSum = new LinkedList<Integer>();
    if (root == null)
        return false;
    queue.offer(root);
    queueSum.offer(root.val); 
    while (!queue.isEmpty()) {
        int levelNum = queue.size(); // 当前层元素的个数
        for (int i = 0; i < levelNum; i++) {
            TreeNode curNode = queue.poll();
            int curSum = queueSum.poll();
            if (curNode != null) {
                //判断叶子节点是否满足了条件
                if (curNode.left == null && curNode.right == null && curSum == sum) { 
                    return true; 
                }
                //当前节点和累计的和加入队列
                if (curNode.left != null) {
                    queue.offer(curNode.left);
                    queueSum.offer(curSum + curNode.left.val);
                }
                if (curNode.right != null) {
                    queue.offer(curNode.right);
                    queueSum.offer(curSum + curNode.right.val);
                }
            }
        }
    }
    return false;
}
```

# 解法三 DFS

解法一其实本质上就是做了`DFS`，我们知道`DFS`可以用栈去模拟。对于这道题，我们可以像解法二的`BFS`一样，再增加一个栈，去保存从根节点到当前节点累计的和就可以了。

这里的话，用`DFS`里的中序遍历，参考 [94 题](<https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html>)。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    Stack<TreeNode> stack = new Stack<>();
    Stack<Integer> stackSum = new Stack<>();
    TreeNode cur = root;
    int curSum = 0;
    while (cur != null || !stack.isEmpty()) {
        // 节点不为空一直压栈
        while (cur != null) {
            stack.push(cur);
            curSum += cur.val;
            stackSum.push(curSum);
            cur = cur.left; // 考虑左子树
        }
        // 节点为空，就出栈
        cur = stack.pop();
        curSum = stackSum.pop();
        //判断是否满足条件
        if (curSum == sum && cur.left == null && cur.right == null) {
            return true;
        }
        // 考虑右子树
        cur = cur.right;
    }
    return false;
}
```

但是之前讲了，对于这种利用栈完全模拟递归的思路，对时间复杂度和空间复杂度并没有什么提高。只是把递归传递的参数`root`和`sum`，本该由计算机自动的压栈出栈，由我们手动去压栈出栈了。

所以我们能不能提高一下，比如省去`sum`这个栈？让我们来分析以下。参考 [这里](<https://leetcode.com/problems/path-sum/discuss/36382/Accepted-By-using-postorder-traversal>) 。

我们如果只用一个变量`curSum`来记录根节点到当前节点累计的和，有节点入栈就加上节点的值，有节点出栈就减去节点的值。

比如对于下边的树，我们进行中序遍历。

```java
     3
    / \
   9   20
  / \   
 8   15   

curSum = 0
3 入栈， curSum = 3，3
9 入栈， curSum = 12，3 -> 9
8 入栈， curSum = 20， 3 -> 9 -> 8
8 出栈， curSum = 12， 3 -> 9
9 出栈， curSum = 3， 
15 入栈， curSum = 18， 3 -> 9 -> 15
```

此时路径是 `3 -> 9 -> 15`，和应该是 `27`。但我们得到的是 `18`，少加了 `9 `。

原因就是我们进行的是中序遍历，当我们还没访问右边的节点的时候，根节点已经出栈了，再访问右边节点的时候，`curSum`就会少一个根节点的值。

所以，我们可以用后序遍历，先访问左子树，再访问右子树，最后访问根节点。再看一下上边的问题。

```java
     3
    / \
   9   20
  / \   
 8   15   

curSum = 0
3 入栈， curSum = 3，3
9 入栈， curSum = 12，3 -> 9
8 入栈， curSum = 20， 3 -> 9 -> 8
8 出栈， curSum = 12， 3 -> 9
15 入栈， curSum = 27， 3 -> 9 -> 15
```

此时路径 `3 -> 9 -> 15` 对应的 `curSum` 就是正确的了。

用栈实现后序遍历，比中序遍历要复杂一些。当访问到根节点的时候，它的右子树可能访问过了，那就把根节点输出。它的右子树可能没访问过，我们需要去遍历它的右子树。所以我们要用一个变量`pre`保存上一次遍历的节点，用来判断当前根节点的右子树是否已经遍历完成。

```java
public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> result = new LinkedList<>();
    Stack<TreeNode> toVisit = new Stack<>();
    TreeNode cur = root;
    TreeNode pre = null;

    while (cur != null || !toVisit.isEmpty()) {
        while (cur != null) {
            toVisit.push(cur); // 添加根节点
            cur = cur.left; // 递归添加左节点
        }
        cur = toVisit.peek(); // 已经访问到最左的节点了
        // 在不存在右节点或者右节点已经访问过的情况下，访问根节点
        if (cur.right == null || cur.right == pre) {
            toVisit.pop();
            result.add(cur.val);
            pre = cur;
            cur = null;
        } else {
            cur = cur.right; // 右节点还没有访问过就先访问右节点
        }
    }
    return result;
}
```

有了上边的后序遍历，对于这道题，代码就很好改了。

```java
public boolean hasPathSum(TreeNode root, int sum) { 
    Stack<TreeNode> toVisit = new Stack<>();
    TreeNode cur = root;
    TreeNode pre = null;
    int curSum = 0; //记录当前的累计的和
    while (cur != null || !toVisit.isEmpty()) {
        while (cur != null) {
            toVisit.push(cur); // 添加根节点
            curSum += cur.val;
            cur = cur.left; // 递归添加左节点
        }
        cur = toVisit.peek(); // 已经访问到最左的节点了
        //判断是否满足条件
        if (curSum == sum && cur.left == null && cur.right == null) {
            return true;
        }
        // 在不存在右节点或者右节点已经访问过的情况下，访问根节点
        if (cur.right == null || cur.right == pre) {
            TreeNode pop = toVisit.pop();
            curSum -= pop.val; //减去出栈的值
            pre = cur;
            cur = null;
        } else {
            cur = cur.right; // 右节点还没有访问过就先访问右节点
        }
    }
    return false;
}
```

# 总

这道题还是在考二叉树的遍历，`DFS`，`BFS`。解法三通过后序遍历节省了`sum`栈，蛮有意思的。