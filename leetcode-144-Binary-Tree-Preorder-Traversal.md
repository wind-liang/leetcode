# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/144.jpg)

二叉树的先序遍历。

# 思路分析

之前做过 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 的中序遍历，先序遍历的话代码可以直接拿过来用，只需要改一改 `list.add` 的位置。

# 解法一 递归

递归很好理解了，代码也是最简洁的。

```java
public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> list = new ArrayList<>();
    preorderTraversalHelper(root, list);
    return list;
}

private void preorderTraversalHelper(TreeNode root, List<Integer> list) {
    if (root == null) {
        return;
    }
    list.add(root.val);
    preorderTraversalHelper(root.left, list);
    preorderTraversalHelper(root.right, list);
}
```

# 解法二 栈

第一种思路就是利用栈去模拟上边的递归。

```java
public List<Integer> preorderTraversal(TreeNode root) {
	    List<Integer> list = new ArrayList<>();
	    Stack<TreeNode> stack = new Stack<>();
	    TreeNode cur = root;
	    while (cur != null || !stack.isEmpty()) {
	        if (cur != null) {
		        list.add(cur.val);
	            stack.push(cur);
	            cur = cur.left; //考虑左子树
	        }else {
		        //节点为空，就出栈
		        cur = stack.pop();
		        //考虑右子树
		        cur = cur.right;
	        }
	    }
	    return list;
}
```

第二种思路的话，我们还可以将左右子树分别压栈，然后每次从栈里取元素。需要注意的是，因为我们应该先访问左子树，而栈的话是先进后出，所以我们压栈先压右子树。

```java
public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> list = new ArrayList<>();
    if (root == null) {
        return list;
    }
    Stack<TreeNode> stack = new Stack<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode cur = stack.pop();
        if (cur == null) {
            continue;
        }
        list.add(cur.val);
        stack.push(cur.right);
        stack.push(cur.left);
    }
    return list;
}
```

# 解法三 Morris Traversal

上边的两种解法，空间复杂度都是 `O(n)`，利用 Morris Traversal 可以使得空间复杂度变为  `O(1)`。

它的主要思想就是利用叶子节点的左右子树是 `null` ，所以我们可以利用这个空间去存我们需要的节点，详细的可以参考 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 中序遍历。

```java
public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> list = new ArrayList<>();
    TreeNode cur = root;
    while (cur != null) {
        //情况 1
        if (cur.left == null) {
            list.add(cur.val);
            cur = cur.right;
        } else {
            //找左子树最右边的节点
            TreeNode pre = cur.left;
            while (pre.right != null && pre.right != cur) {
                pre = pre.right;
            }
            //情况 2.1
            if (pre.right == null) {
                list.add(cur.val);
                pre.right = cur;
                cur = cur.left;
            }
            //情况 2.2
            if (pre.right == cur) {
                pre.right = null; //这里可以恢复为 null
                cur = cur.right;
            }
        }
    }
    return list;
}
```

# 总

和 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 没什么差别，解法三利用已有空间去存东西，从而降低空间复杂度的思想经常用到。