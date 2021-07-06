# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/106.jpg)

根据二叉树的中序遍历和后序遍历还原二叉树。

# 思路分析

可以先看一下 [105 题](<https://leetcode.wang/leetcode-105-Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal.html>)，直接在 105 题的基础上改了，大家也可以先根据 105 题改一改。

105 题给的是先序遍历和中序遍历，这里把先序遍历换成了后序遍历。

区别在于先序遍历的顺序是 根节点 -> 左子树 -> 右子树。

后序遍历的顺序是 左子树 -> 右子树 -> 根节点。

我们当然还是先确定根节点，然后在中序遍历中找根节点的位置，然后分出左子树和右子树。

对于之前的解法一，传数组的两个边界，影响不大，只要重新计算边界就可以了。

但是对于另外两种解法，利用 stop 和栈的算法，之前都是通过遍历前序遍历的数组实现的。所以构造过程是根节点，左子树，右子树。

但这里如果是后序遍历，我们先找根节点，所以相当于从右往左遍历，这样的顺序的话就成了，根节点 -> 右子树 -> 左子树，所以我们会先生成右子树，再生成左子树。

# 解法一

常规解法，利用递归，传递左子树和右子树的数组范围即可。

```java
public TreeNode buildTree(int[] inorder, int[] postorder) {
    HashMap<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) {
        map.put(inorder[i], i);
    }
    return buildTreeHelper(inorder, 0, inorder.length, postorder, 0, postorder.length, map);
}

private TreeNode buildTreeHelper(int[] inorder, int i_start, int i_end, int[] postorder, int p_start, int p_end,
                                 HashMap<Integer, Integer> map) {
    if (p_start == p_end) {
        return null;
    }
    int root_val = postorder[p_end - 1];
    TreeNode root = new TreeNode(root_val);
    int i_root_index = map.get(root_val);
    int leftNum = i_root_index - i_start;
    root.left = buildTreeHelper(inorder, i_start, i_root_index, postorder, p_start, p_start + leftNum, map);
    root.right = buildTreeHelper(inorder, i_root_index + 1, i_end, postorder, p_start + leftNum, p_end - 1,
                                 map);
    return root;
}
```

# 解法二 stop 值

这里的话，之前说了，递归的话得先构造右子树再构造左子树，此外各种指针，也应该从末尾向零走。

视线从右往左看。

```java
    3
   / \
  9  20
    /  \
   15   7
       
s 初始化一个树中所有的数字都不会相等的数，所以代码中用了一个 long 来表示
<------------------
中序
  9, 3, 15, 20, 7
^               ^
s               i

后序
9, 15, 7, 20, 3
              ^  
              p
<-------------------
```

`p` 和 `i` 都从右往左进行遍历，所以 `p` 开始产生的每次都是右子树的根节点。之前代码里的`++`要相应的改成`--`。

```java
int post;
int in; 
public TreeNode buildTree(int[] inorder, int[] postorder) {
    post = postorder.length - 1;
    in = inorder.length - 1;
    return buildTreeHelper(inorder, postorder, (long) Integer.MIN_VALUE - 1);
}

private TreeNode buildTreeHelper(int[] inorder, int[] postorder, long stop) {
    if (post == -1) {
        return null;
    }
    if (inorder[in] == stop) {
        in--;
        return null;
    }
    int root_val = postorder[post--];
    TreeNode root = new TreeNode(root_val);
    root.right = buildTreeHelper(inorder, postorder, root_val);
    root.left = buildTreeHelper(inorder, postorder, stop);
    return root;
}
```

# 解法三 栈

之前解法是构造左子树、左子树、左子树，出现相等，构造一颗右子树。这里相应的要改成构造右子树、右子树、右子树，出现相等，构造一颗左子树。和解法二一样，两个指针的话也是从末尾到头部进行。

```java
public TreeNode buildTree(int[] inorder, int[] postorder) {
    if (postorder.length == 0) {
        return null;
    }
    Stack<TreeNode> roots = new Stack<TreeNode>();
    int post = postorder.length - 1;
    int in = inorder.length - 1;
    TreeNode curRoot = new TreeNode(postorder[post]);
    TreeNode root = curRoot;
    roots.push(curRoot);
    post--;
    while (post >=  0) {
        if (curRoot.val == inorder[in]) {
            while (!roots.isEmpty() && roots.peek().val == inorder[in]) {
                curRoot = roots.peek();
                roots.pop();
                in--;
            }
            curRoot.left = new TreeNode(postorder[post]);
            curRoot = curRoot.left;
            roots.push(curRoot);
            post--;
        } else {
            curRoot.right = new TreeNode(postorder[post]);
            curRoot = curRoot.right;
            roots.push(curRoot);
            post--;
        }
    }
    return root;
}
```

# 总

理解了 [105 题](<https://leetcode.wang/leetcode-105-Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal.html>) 的话，这道题很快就出来了，完全是 105 题的逆向思考。