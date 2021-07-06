# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/226.png)

反转二叉树，将二叉树所有的节点的左右两个孩子交换。

# 解法一 递归

对于二叉树的问题，用递归写的话就会异常简单了。交换左右节点，然后左右节点交给递归即可。

```java
public TreeNode invertTree(TreeNode root) {
    if (root == null) {
        return root;
    }

    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;

    invertTree(root.left);
    invertTree(root.right);
    return root;
}
```

# 解法二 DFS 栈

当然递归都可以用栈模拟，因为解法一的递归比较简单，所以改写也比较容易。

```java
public TreeNode invertTree(TreeNode root) {
    Stack<TreeNode> stack = new Stack<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode cur = stack.pop();
        if (cur == null) {
            continue;
        }
        TreeNode temp = cur.left;
        cur.left = cur.right;
        cur.right = temp;

        stack.push(cur.right);
        stack.push(cur.left);
    }
    return root;
}
```

# 解法三 BFS 队列

既然可以 DFS，那么也可以 BFS，只需要将解法二的栈改成队列即可。代码不用怎么变，但二叉树的遍历顺序完全改变了。

```java
public TreeNode invertTree(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        TreeNode cur = queue.poll();
        if (cur == null) {
            continue;
        }
        TreeNode temp = cur.left;
        cur.left = cur.right;
        cur.right = temp;

        queue.offer(cur.left);
        queue.offer(cur.right);
    }
    return root;
}
```

# 总

一道比较简单的题，用递归很快就可以解决。之前一直认为，递归改写成解法二或者解法三的迭代那样会更好一些，因为可以防止递归的堆栈溢出。虽然也有缺点，那就是代码会相对更复杂些，可读性有些降低。

刚才看到 [王垠](https://www.yinwang.org/) 大神的一个不一样的观点，分享一下。

![](https://windliang.oss-cn-beijing.aliyuncs.com/226_2.jpg)