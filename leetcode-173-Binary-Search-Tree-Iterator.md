# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/173.png)

一个二叉查找树，实现一个迭代器。`next` 依次返回树中最小的值，`hasNext` 返回树中是否还有未返回的元素。

> 二叉查找树是指一棵空树或者具有下列性质的二叉树：
>
> 1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
> 2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
> 3. 任意节点的左、右子树也分别为二叉查找树；
> 4. 没有键值相等的节点。

# 思路分析

如果做过 [108 题](https://leetcode.wang/leetcode-108-Convert-Sorted-Array-to-Binary-Search-Tree.html) 和 [109 题](https://leetcode.wang/leetcode-109-Convert-Sorted-List-to-Binary-Search-Tree.html) ，这里看到二分查找树，一定会想到它的一个性质。「二分查找树的中序遍历依次得到的元素刚好是一个升序数组」，所以这道题无非就是把中序遍历的结果依次输出即可。

至于中序遍历，在 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html)  已经做过了，里边介绍了三种解法，下边的解法也是依赖于之前中序遍历的代码，大家可以先过去看一下。

# 解法一

先不考虑题目 `Note` 中要求的空间复杂度和时间复杂度，简单粗暴一些。在构造函数中，对二叉树进行中序遍历，把结果保存到一个队列中，然后 `next` 方法直接执行出队操作即可。至于 `hasNext` 方法的话，判断队列是否为空即可。

```java
class BSTIterator {

    Queue<Integer> queue = new LinkedList<>();

    public BSTIterator(TreeNode root) {
        inorderTraversal(root);
    }

    private void inorderTraversal(TreeNode root) {
        if (root == null) {
            return;
        }
        inorderTraversal(root.left);
        queue.offer(root.val);
        inorderTraversal(root.right);
    }

    /** @return the next smallest number */
    public int next() {
        return queue.poll();
    }

    /** @return whether we have a next smallest number */
    public boolean hasNext() {
        return !queue.isEmpty();
    }
}
```

时间复杂度的话，构造函数因为遍历了一遍二叉树，所以是 `O(n)`，对于 `next` 和 `hasNext`  方法都是 `O(1)`。

空间复杂度，用队列保存了所有的节点值，所以是 `O(n)`，此外中序遍历递归压栈的过程也需要 `O(h)` 的空间。

# 解法二

解法一中我们把所有节点都保存了起来，其实没必要一次性保存所有节点，而是需要一个输出一个即可。

所以我们要控制中序遍历的进程，不要让它一次性结束，如果用解法一递归的方法去遍历那就很难控制了，所以自然而然的会想到用栈模拟递归的过程。

下边是 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html)  解法二的代码。

```java
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> ans = new ArrayList<>();
    Stack<TreeNode> stack = new Stack<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        //节点不为空一直压栈
        while (cur != null) {
            stack.push(cur);
            cur = cur.left; //考虑左子树
        }
        //节点为空，就出栈
        cur = stack.pop();
        //当前值加入
        ans.add(cur.val);
        //考虑右子树
        cur = cur.right;
    }
    return ans;
}
```

和这道题糅合一起也很简单了，只需要把 `stack` 和 `cur` 作为成员变量，然后每次调用 `next` 就执行一次 `while` 循环，并且要记录当前值，结束掉本次循环。

```java
class BSTIterator {
    Stack<TreeNode> stack = new Stack<>();
    TreeNode cur = null;

    public BSTIterator(TreeNode root) {
        cur = root;
    }

    /** @return the next smallest number */
    public int next() {
        int res = -1;
        while (cur != null || !stack.isEmpty()) {
            // 节点不为空一直压栈
            while (cur != null) {
                stack.push(cur);
                cur = cur.left; // 考虑左子树
            }
            // 节点为空，就出栈
            cur = stack.pop();
            res = cur.val;
            // 考虑右子树
            cur = cur.right;
            break;
        }

        return res;
    }

    /** @return whether we have a next smallest number */
    public boolean hasNext() {
        return cur != null || !stack.isEmpty();
    }
}
```

时间复杂度的话，对于 `next` 方法，大多数时候是 `O(1)`，但最坏情况因为最里边的 `while` 循环，其实有可能达到 `O(n)`。但如果算均摊时间复杂度的话，其实还是 `O(1)`，因为每个节点最多也就经过两次就出栈了。

空间复杂度，这里只需要消耗栈的空间，也就是 `O(h)`。

# 总

这道题关键就是要知道二叉搜寻树的中序遍历是升序序列，然后问题其实就转移到怎么进行中序遍历了。