# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/114.jpg)

把一个二叉树展开成一个链表，展开顺序如图所示。

# 解法一

可以发现展开的顺序其实就是二叉树的先序遍历。算法和 [94 题](<https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html#%E8%A7%A3%E6%B3%95%E4%B8%89-morris-traversal>) 中序遍历的 Morris 算法有些神似，我们需要两步完成这道题。

1. 将左子树插入到右子树的地方
2. 将原来的右子树接到左子树的最右边节点
3. 考虑新的右子树的根节点，一直重复上边的过程，直到新的右子树为 null

可以看图理解下这个过程。

```java
    1
   / \
  2   5
 / \   \
3   4   6

//将 1 的左子树插入到右子树的地方
    1
     \
      2         5
     / \         \
    3   4         6        
//将原来的右子树接到左子树的最右边节点
    1
     \
      2          
     / \          
    3   4  
         \
          5
           \
            6
            
 //将 2 的左子树插入到右子树的地方
    1
     \
      2          
       \          
        3       4  
                 \
                  5
                   \
                    6   
        
 //将原来的右子树接到左子树的最右边节点
    1
     \
      2          
       \          
        3      
         \
          4  
           \
            5
             \
              6         
  
  ......
```

代码的话也很好写，首先我们需要找出左子树最右边的节点以便把右子树接过来。

```java
public void flatten(TreeNode root) {
    while (root != null) { 
        //左子树为 null，直接考虑下一个节点
        if (root.left == null) {
            root = root.right;
        } else {
            // 找左子树最右边的节点
            TreeNode pre = root.left;
            while (pre.right != null) {
                pre = pre.right;
            } 
            //将原来的右子树接到左子树的最右边节点
            pre.right = root.right;
            // 将左子树插入到右子树的地方
            root.right = root.left;
            root.left = null;
            // 考虑下一个节点
            root = root.right;
        }
    }
}
```

# 解法二

题目中，要求说是`in-place`，之前一直以为这个意思就是要求空间复杂度是`O(1)`。偶然看见评论区 [StefanPochmann](https://leetcode.com/stefanpochmann) 大神的解释。

![](https://windliang.oss-cn-beijing.aliyuncs.com/114_2.jpg)

也就是说`in-place` 的意思可能更多说的是直接在原来的节点上改变指向，空间复杂度并没有要求。所以这道题也可以用递归解一下，参考 [这里](<https://leetcode.com/problems/flatten-binary-tree-to-linked-list/discuss/36977/My-short-post-order-traversal-Java-solution-for-share>) 。

```java
    1
   / \
  2   5
 / \   \
3   4   6
```

利用递归的话，可能比解法一难理解一些。

题目其实就是将二叉树通过右指针，组成一个链表。

```java
1 -> 2 -> 3 -> 4 -> 5 -> 6
```

我们知道题目给定的遍历顺序其实就是先序遍历的顺序，所以我们能不能利用先序遍历的代码，每遍历一个节点，就将上一个节点的右指针更新为当前节点。

先序遍历的顺序是`1 2 3 4 5 6`。

遍历到`2`，把`1`的右指针指向`2`。`1 -> 2 3 4 5 6`。

遍历到`3`，把`2`的右指针指向`3`。`1 -> 2 -> 3 4 5 6`。

... ...

一直进行下去似乎就解决了这个问题。但现实是残酷的，原因就是我们把`1`的右指针指向`2`，那么`1`的原本的右孩子就丢失了，也就是`5` 就找不到了。

解决方法的话，我们可以逆过来进行。

我们依次遍历`6 5 4 3 2 1`，然后每遍历一个节点就将当前节点的右指针更新为上一个节点。

遍历到`5`，把`5`的右指针指向`6`。`6 <- 5 4 3 2 1`。

遍历到`4`，把`4`的右指针指向`5`。`6 <- 5 <- 4 3 2 1`。

... ...

```java
    1
   / \
  2   5
 / \   \
3   4   6
```

这样就不会有丢失孩子的问题了，因为更新当前的右指针的时候，当前节点的右孩子已经访问过了。

而`6 5 4 3 2 1`的遍历顺序其实变形的后序遍历，遍历顺序是右子树->左子树->根节点。

先回想一下变形的后序遍历的代码

```java
public void PrintBinaryTreeBacRecur(TreeNode<T> root){
    if (root == null)
        return;
    
    PrintBinaryTreeBacRecur(root.right);
    PrintBinaryTreeBacRecur(root.left); 
    System.out.print(root.data);
    
} 
```

这里的话，我们不再是打印根节点，而是利用一个全局变量`pre`，更新当前根节点的右指针为`pre`,左指针为`null`。

```java
private TreeNode pre = null;

public void flatten(TreeNode root) {
    if (root == null)
        return;
    flatten(root.right);
    flatten(root.left);
    root.right = pre;
    root.left = null;
    pre = root;
}
```

相应的左孩子也要置为`null`，同样的也不用担心左孩子丢失，因为是后序遍历，左孩子已经遍历过了。和 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 一样，都巧妙的利用了后序遍历。

既然后序遍历这么有用，利用 [112 题](<https://leetcode.wang/leetcode-112-Path-Sum.html>) 介绍的后序遍历的迭代方法，把这道题也改一下吧。

```java
public void flatten(TreeNode root) { 
    Stack<TreeNode> toVisit = new Stack<>();
    TreeNode cur = root;
    TreeNode pre = null;

    while (cur != null || !toVisit.isEmpty()) {
        while (cur != null) {
            toVisit.push(cur); // 添加根节点
            cur = cur.right; // 递归添加右节点
        }
        cur = toVisit.peek(); // 已经访问到最右的节点了
        // 在不存在左节点或者右节点已经访问过的情况下，访问根节点
        if (cur.left == null || cur.left == pre) {
            toVisit.pop(); 
            /**************修改的地方***************/
            cur.right = pre;
            cur.left = null;
            /*************************************/
            pre = cur;
            cur = null;
        } else {
            cur = cur.left; // 左节点还没有访问过就先访问左节点
        }
    } 
}
```

# 解法三

解法二中提到如果用先序遍历的话，会丢失掉右孩子，除了用后序遍历，还有没有其他的方法避免这个问题。在`Discuss`又发现了一种解法，参考 [这里](<https://leetcode.com/problems/flatten-binary-tree-to-linked-list/discuss/36991/Accepted-simple-Java-solution-iterative>)。

为了更好的控制算法，所以我们用先序遍历迭代的形式，正常的先序遍历代码如下，

```java
public static void preOrderStack(TreeNode root) {
    if (root == null) { 
        return;
    }
    Stack<TreeNode> s = new Stack<TreeNode>();
    while (root != null || !s.isEmpty()) {
        while (root != null) {
            System.out.println(root.val);
            s.push(root);
            root = root.left;
        }
        root = s.pop();
        root = root.right;
    }
}
```

还有一种特殊的先序遍历，提前将右孩子保存到栈中，我们利用这种遍历方式就可以防止右孩子的丢失了。由于栈是先进后出，所以我们先将右节点入栈。

```java
public static void preOrderStack(TreeNode root) {
    if (root == null){
        return;
    }
    Stack<TreeNode> s = new Stack<TreeNode>();
    s.push(root);
    while (!s.isEmpty()) {
        TreeNode temp = s.pop();
        System.out.println(temp.val);
        if (temp.right != null){
            s.push(temp.right);
        }
        if (temp.left != null){
            s.push(temp.left);
        }
    }
}
```

之前我们的思路如下：

题目其实就是将二叉树通过右指针，组成一个链表。

```java
1 -> 2 -> 3 -> 4 -> 5 -> 6
```

我们知道题目给定的遍历顺序其实就是先序遍历的顺序，所以我们可以利用先序遍历的代码，每遍历一个节点，就将上一个节点的右指针更新为当前节点。

先序遍历的顺序是`1 2 3 4 5 6`。

遍历到`2`，把`1`的右指针指向`2`。`1 -> 2 3 4 5 6`。

遍历到`3`，把`2`的右指针指向`3`。`1 -> 2 -> 3 4 5 6`。

... ...

因为我们用栈保存了右孩子，所以不需要担心右孩子丢失了。用一个`pre`变量保存上次遍历的节点。修改的代码如下：

```java
public void flatten(TreeNode root) { 
    if (root == null){
        return;
    }
    Stack<TreeNode> s = new Stack<TreeNode>();
    s.push(root);
    TreeNode pre = null;
    while (!s.isEmpty()) {
        TreeNode temp = s.pop(); 
        /***********修改的地方*************/
        if(pre!=null){
            pre.right = temp;
            pre.left = null;
        }
        /********************************/
        if (temp.right != null){
            s.push(temp.right);
        }
        if (temp.left != null){
            s.push(temp.left);
        } 
        /***********修改的地方*************/
        pre = temp;
        /********************************/
    }
}
```

# 总

解法一和解法三可以看作自顶向下的解决问题，解法二可以看作自底向上。以前觉得后序遍历比较麻烦，没想到竟然连续遇到了后序遍历的应用。先序遍历的两种方式自己也是第一次意识到，之前都是用的第一种正常的方式。