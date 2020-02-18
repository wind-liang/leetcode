# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/230.png)

给一个二叉搜索树，找到树中第 `k` 小的树。二叉搜索树的定义如下：

1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
3. 任意节点的左、右子树也分别为二叉查找树；
4. 没有键值相等的节点。

# 思路分析

通过前边 [98 题](https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html)  、[99 题](https://leetcode.wang/leetcode-99-Recover-Binary-Search-Tree.html) 以及 [108 题](https://leetcode.wang/leetcode-108-Convert-Sorted-Array-to-Binary-Search-Tree.html) 的洗礼，看到二叉搜索树，应该会立刻想到它的一个性质，它的中序遍历输出的是一个升序数组。知道了这个，这道题就很简单了，只需要把中序遍历的第 `k` 个元素返回即可。

# 解法一 中序遍历

说到中序遍历，[94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 已经讨论过了，总共介绍了三种解法，大家可以过去看一下，这里的话，直接在之前的基础上做修改了。

总体上，我们只需要增加两个变量 `num` 和 `res`。`num` 记录中序遍历已经输出的元素个数，当 `num == k` 的时候，我们只需要将当前元素保存到 `res` 中，然后返回即可。

下边分享下三种遍历方式的解法，供参考。

递归法。

```java
int num = 0;
int res;

public int kthSmallest(TreeNode root, int k) {
    inorderTraversal(root, k);
    return res;
}

private void inorderTraversal(TreeNode node, int k) {
    if (node == null) {
        return;
    }
    inorderTraversal(node.left, k);
    num++;
    if (num == k) {
        res = node.val;
        return;
    }
    inorderTraversal(node.right, k);
}
```

递归改写，压栈法。

```java
public int kthSmallest(TreeNode root, int k) {
    Stack<TreeNode> stack = new Stack<>();
    int num = 0;
    int res = -1;
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        // 节点不为空一直压栈
        while (cur != null) {
            stack.push(cur);
            cur = cur.left; // 考虑左子树
        }
        // 节点为空，就出栈
        cur = stack.pop();
        // 当前值加入
        num++;
        if (num == k) {
            res = cur.val;
            break;
        }
        // 考虑右子树
        cur = cur.right;
    }
    return res;
}
```

常数空间复杂度的 Morris  遍历，[94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 对 Morris 遍历有详细的解释。

```java
public int kthSmallest(TreeNode root, int k) {
    TreeNode cur = root;
    int num = 0;
    int res = -1;
    while (cur != null) {
        // 情况 1
        if (cur.left == null) {
            num++;
            if (num == k) {
                res = cur.val;
                break;
            }
            cur = cur.right;
        } else {
            // 找左子树最右边的节点
            TreeNode pre = cur.left;
            while (pre.right != null && pre.right != cur) {
                pre = pre.right;
            }
            // 情况 2.1
            if (pre.right == null) {
                pre.right = cur;
                cur = cur.left;
            }
            // 情况 2.2
            if (pre.right == cur) {
                pre.right = null; // 这里可以恢复为 null
                num++;
                if (num == k) {
                    res = cur.val;
                    break;
                }
                cur = cur.right;
            }
        }

    }
    return res;
}
```

可以看到，三种解法都是一样的，我们只是在中序遍历输出的时候，记录了已经输出的个数而已。

# 解法二 分治法

如果不知道解法一中二叉搜索树的性质，用分治法也可以做，分享 [这里](https://leetcode.com/problems/kth-smallest-element-in-a-bst/discuss/63743/Java-divide-and-conquer-solution-considering-augmenting-tree-structure-for-the-follow-up) 的解法。

我们只需要先计算左子树的节点个数，记为 `n`，然后有三种情况。

`n` 加 `1` 等于 `k`，那就说明当前根节点就是我们要找的。

`n `加 `1` 小于 `k`，那就说明第 `k` 小的数一定在右子树中，我们只需要递归的在右子树中寻找第 `k - n - 1` 小的数即可。

`n` 加 `1` 大于 `k`，那就说明第 `k` 小个数一定在左子树中，我们只需要递归的在左子树中寻找第 `k` 小的数即可。

```java
public int kthSmallest(TreeNode root, int k) {
    int n = nodeCount(root.left);  
    if(n + 1 == k) {
        return root.val;
    } else if (n + 1 < k) {
        return kthSmallest(root.right, k - n - 1);
    } else {
        return kthSmallest(root.left, k);
    }
}

private int nodeCount(TreeNode root) {
    if(root == null) {
        return 0;
    }
    return 1 + nodeCount(root.left) + nodeCount(root.right);
}
```

# 总

解法一的前提就是需要知道二分查找树的中序遍历是升序数组，问题就转换成中序遍历求解了。解法二的话，属于通用的解法，分治法，思路很棒。