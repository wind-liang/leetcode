# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/236.png)

给定二叉树的两个节点，找出两个节点的最近的共同祖先。

# 解法一

刚做的 [235 题](https://leetcode.wang/leetcode-235-Lowest-Common-Ancestor-of-a-Binary-Search-Tree.html) 是这个题的子问题， [235 题](https://leetcode.wang/leetcode-235-Lowest-Common-Ancestor-of-a-Binary-Search-Tree.html)是让我们在二叉搜索树中找两个节点的最近的共同祖先。当时分了三种情况。

- 如果给定的两个节点的值都小于根节点的值，那么最近的共同祖先一定在左子树
- 如果给定的两个节点的值都大于根节点的值，那么最近的共同祖先一定在右子树
- 如果一个大于等于、一个小于等于根节点的值，那么当前根节点就是最近的共同祖先了

通过确定两个节点的位置，然后再用递归去解决问题。

之前是二叉搜索树，所以通过和根节点的值进行比较就能知道节点的是在左子树和右子树了，这道题的话我们只有通过遍历去寻找给定的节点，从而确定节点是在左子树还是右子树了。

遍历采用 [94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 的中序遍历，栈的形式。

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == p || root == q) {
        return root;
    }
    Stack<TreeNode> stack = new Stack<>();
    //中序遍历判断两个节点是否在左子树
    TreeNode cur = root.left;
    boolean pLeft = false;
    boolean qLeft = false;
    while (cur != null || !stack.isEmpty()) {
        // 节点不为空一直压栈
        while (cur != null) {
            stack.push(cur);
            cur = cur.left; // 考虑左子树
        }
        // 节点为空，就出栈
        cur = stack.pop();
        // 判断是否等于 p 节点
        if (cur == p) {
            pLeft = true;
        }
        // 判断是否等于 q 节点
        if (cur == q) {
            qLeft = true;
        }
        
        if(pLeft && qLeft){
            break;
        }
        // 考虑右子树
        cur = cur.right;
    }
    
    //两个节点都在左子树
    if (pLeft && qLeft) {
        return lowestCommonAncestor(root.left, p, q);
    //两个节点都在右子树    
    } else if (!pLeft && !qLeft) {
        return lowestCommonAncestor(root.right, p, q);
    } 
    //一左一右
    return root;
}
```

# 解法二

参考 [这里](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/discuss/65225/4-lines-C%2B%2BJavaPythonRuby) 。

我们注意到如果两个节点在左子树中的最近共同祖先是 `r`，那么当前树的最近公共祖先也就是 `r`，所以我们可以用递归的方式去解决。

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q ) {
        return root;
    } 
    TreeNode leftCommonAncestor =  lowestCommonAncestor(root.left, p, q); 
    TreeNode rightCommonAncestor =  lowestCommonAncestor(root.right, p, q); 
    //在左子树中没有找到，那一定在右子树中
    if(leftCommonAncestor == null){
        return rightCommonAncestor;
    }
    //在右子树中没有找到，那一定在左子树中
    if(rightCommonAncestor == null){
        return leftCommonAncestor;
    }
    //不在左子树，也不在右子树，那说明是根节点
    return root;
}
```

对于 `lowestCommonAncestor` 这个函数的理解的话，它不一定可以返回最近的共同祖先，如果子树中只能找到 `p` 节点或者 `q` 节点，它最终返回其实就是 `p` 节点或者 `q` 节点。这其实对应于最后一种情况，也就是 `leftCommonAncestor` 和 `rightCommonAncestor` 都不为 `null`，说明 `p` 节点和 `q` 节点分处于两个子树中，直接 `return root`。

相对于解法一的话快了很多，因为不需要每次都遍历一遍二叉树，这个解法所有节点只会遍历一次。

# 解法三

参考 [这里](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/discuss/65236/JavaPython-iterative-solution) ，也很有意思，分享一下。

`root` 节点一定是 `p` 节点和 `q` 节点的共同祖先，只不过这道题要找的是最近的共同祖先。

从 `root` 节点出发有一条唯一的路径到达 `p`。

从 `root` 节点出发也有一条唯一的路径到达 `q`。

可以抽象成下图的样子。

```java
       root
        |
        |
        |
        r
       / \
      /   \
     /    /
     \    \
      p    \
            q
```

事实上，我们要找的最近的共同祖先就是第一次出现分叉的时候，也就是上图中的 `r`。

那么怎么找到 `r` 呢？

我们可以把从 `root` 到 `p` 和 `root` 到 `q` 的路径找到，比如说是

`root -> * -> * -> r -> x -> x -> p`

`root -> * -> * -> r -> y -> y -> y -> y -> q`

然后我们倒着遍历其中一条路径，然后看当前节点在不在另一条路径中，当第一次出现在的时候，这个节点就是我们要找到的最近的公共祖先了。

比如倒着遍历 `root` 到 `q` 的路径。

依次判断 `q` 在不在  `root` 到 `p` 的路径中，`y` 在不在？ ... `r` 在不在？ 发现 `r` 在，说明 `r` 就是我们要找到的节点。

代码实现的话，因为我们要倒着遍历某一条路径，所以可以用 `HashMap` 来保存每个节点的父节点，从而可以方便的倒着遍历。

另外我们要判断路径中有没有某个节点，所以我们要把这条路径的所有节点存到 `HashSet`  中方便判断。

寻找路径的话，我们一开始肯定不知道该向左还是向右，所以我们采取遍历整个树，直到找到了 `p` 和 `q` ，然后从 `p` 和 `q` 开始，通过 `hashMap` 存储的每个节点的父节点，就可以倒着遍历回去确定路径。

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    Stack<TreeNode> stack = new Stack<>();
    HashMap<TreeNode, TreeNode> parent = new HashMap<>();
    stack.push(root);
    parent.put(root, null);
    //将遍历过程中每个节点的父节点保存起来
    while (!parent.containsKey(p) || !parent.containsKey(q)) {
        TreeNode cur = stack.pop();
        if (cur.left != null) {
            stack.push(cur.left);
            parent.put(cur.left, cur);
        }
        if (cur.right != null) {
            stack.push(cur.right);
            parent.put(cur.right, cur);
        }
    }
    HashSet<TreeNode> path = new HashSet<>();
    // 倒着还原 p 的路径，并将每个节点加入到 set 中
    while (p != null) {
        path.add(p);
        p = parent.get(p);
    }

    // 倒着遍历 q 的路径，判断是否在 p 的路径中
    while (q != null) {
        if (path.contains(q)) {
            break;
        }
        q = parent.get(q);
    }
    return q;
}
```

# 总

解法一的话是受到上一题的影响，理论上应该可以直接想到解法二的，是一个很常规的递归的问题。解法三的话，想法很新颖。