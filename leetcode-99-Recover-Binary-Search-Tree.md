# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/99.png)

依旧是二分查找树的题，一个合法的二分查找树随机交换了两个数的位置，然后让我们恢复二分查找树。不能改变原来的结构，只是改变两个数的位置。二分查找树定义如下：

> 1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
> 2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
> 3. 任意节点的左、右子树也分别为二叉查找树；
> 4. 没有键值相等的节点。

# 解法一 递归

和 [98 题](<https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html>)有些像。这里的思路如下：

让我们来考虑交换的位置的可能：

1. 根节点和左子树的某个数字交换 -> 由于根节点大于左子树中的所有数，所以交换后我们只要找左子树中最大的那个数，就是所交换的那个数

2. 根节点和右子树的某个数字交换 -> 由于根节点小于右子树中的所有数，所以交换后我们只要在右子树中最小的那个数，就是所交换的那个数
3. 左子树和右子树的两个数字交换 -> 找左子树中最大的数，右子树中最小的数，即对应两个交换的数
4. 左子树中的两个数字交换 
5. 右子树中的两个数字交换

思想有了，代码很好写了。

```java
public void recoverTree2(TreeNode root) {
    if (root == null) {
        return;
    }
    //寻找左子树中最大的节点
    TreeNode maxLeft = getMaxOfBST(root.left);
    //寻找右子树中最小的节点
    TreeNode minRight = getMinOfBST(root.right);
    
    if (minRight != null && maxLeft != null) {
        //左边的大于根节点，右边的小于根节点，对应情况 3，左右子树中的两个数字交换
        if ( maxLeft.val > root.val && minRight.val < root.val) {
            int temp = minRight.val;
            minRight.val = maxLeft.val;
            maxLeft.val = temp;
        }
    }

    if (maxLeft != null) {
        //左边最大的大于根节点，对应情况 1，根节点和左子树的某个数做了交换
        if (maxLeft.val > root.val) {
            int temp = maxLeft.val;
            maxLeft.val = root.val;
            root.val = temp;
        }
    }

    if (minRight != null) {
        //右边最小的小于根节点，对应情况 2，根节点和右子树的某个数做了交换
        if (minRight.val < root.val) {
            int temp = minRight.val;
            minRight.val = root.val;
            root.val = temp;
        }
    }
    //对应情况 4，左子树中的两个数进行了交换
    recoverTree(root.left);
    //对应情况 5，右子树中的两个数进行了交换
    recoverTree(root.right);

}
//寻找树中最小的节点
private TreeNode getMinOfBST(TreeNode root) {
    if (root == null) {
        return null;
    }
    TreeNode minLeft = getMinOfBST(root.left);
    TreeNode minRight = getMinOfBST(root.right);
    TreeNode min = root;
    if (minLeft != null && min.val > minLeft.val) {
        min = minLeft;
    }
    if (minRight != null && min.val > minRight.val) {
        min = minRight;
    }
    return min;
}

//寻找树中最大的节点
private TreeNode getMaxOfBST(TreeNode root) {
    if (root == null) {
        return null;
    }
    TreeNode maxLeft = getMaxOfBST(root.left);
    TreeNode maxRight = getMaxOfBST(root.right);
    TreeNode max = root;
    if (maxLeft != null && max.val < maxLeft.val) {
        max = maxLeft;
    }
    if (maxRight != null && max.val < maxRight.val) {
        max = maxRight;
    }
    return max;
}
```

# 解法二 

参考 [这里](<https://leetcode.com/problems/recover-binary-search-tree/discuss/32535/No-Fancy-Algorithm-just-Simple-and-Powerful-In-Order-Traversal>)。

如果记得  [98 题](<https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html>)，我们判断是否是一个合法的二分查找树是使用到了中序遍历。原因就是二分查找树的一个性质，左孩子小于根节点，根节点小于右孩子。所以做一次中序遍历，产生的序列就是从小到大排列的有序序列。

回到这道题，题目交换了两个数字，其实就是在有序序列中交换了两个数字。而我们只需要把它还原。

交换的位置的话就是两种情况。

* 相邻的两个数字交换

  [ 1 2 3 4 5 ] 中 2 和 3 进行交换，[ 1 3 2 4 5 ]，这样的话只产生一组逆序的数字（正常情况是从小到大排序，交换后产生了从大到小），3 2。

  我们只需要遍历数组，找到后，把这一组的两个数字进行交换即可。

* 不相邻的两个数字交换

  [ 1 2 3 4 5 ] 中 2 和 5 进行交换，[ 1 5 3 4 2 ]，这样的话其实就是产生了两组逆序的数字对。5 3 和 4 2。

  所以我们只需要遍历数组，然后找到这两组逆序对，然后把第一组前一个数字和第二组后一个数字进行交换即完成了还原。

所以在中序遍历中，只需要利用一个 pre 节点和当前节点比较，如果 pre 节点的值大于当前节点的值，那么就是我们要找的逆序的数字。分别用两个指针 first 和 second 保存即可。如果找到第二组逆序的数字，我们就把 second 更新为当前节点。最后把 first 和 second 两个的数字交换即可。

中序遍历，参考[ 94 题 ](<https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html>)，有三种方法，递归，栈，Morris 。这里的话，我们都改一下。

## 递归版中序遍历

```java
TreeNode first = null;
TreeNode second = null;
public void recoverTree(TreeNode root) {
    inorderTraversal(root);
    int temp = first.val;
    first.val = second.val;
    second.val = temp;
}
TreeNode pre = null;
private void inorderTraversal(TreeNode root) {
    if (root == null) {
        return;
    }
    inorderTraversal(root.left); 
    /*******************************************************/
    if(pre != null && root.val < pre.val) {
        //第一次遇到逆序对
        if(first==null){
            first = pre;
            second = root;
        //第二次遇到逆序对
        }else{
            second = root;
        }
    }
    pre = root; 
    /*******************************************************/
    inorderTraversal(root.right);
}
```

## 栈版中序遍历

```java
TreeNode first = null;
TreeNode second = null;

public void recoverTree(TreeNode root) {
    inorderTraversal(root);
    int temp = first.val;
    first.val = second.val;
    second.val = temp;
}

public void inorderTraversal(TreeNode root) {
    if (root == null)
        return;
    Stack<TreeNode> stack = new Stack<>();
    TreeNode pre = null;
    while (root != null || !stack.isEmpty()) {
        while (root != null) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        /*******************************************************/
        if (pre != null && root.val < pre.val) {
            if (first == null) {
                first = pre;
                second = root;
            } else {
                second = root;
            }
        }
        pre = root;
        /*******************************************************/
        root = root.right;
    }
}
```

## Morris 版中序遍历

因为之前这个方法中用了 pre 变量，为了方便，这里也需要 pre 变量，我们用 pre_new 代替。具体 Morris 遍历算法参见[ 94 题 ](<https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html>)。利用 Morris 的话，我们的空间复杂度终于达到了 O（1）。

```java
public void recoverTree(TreeNode root) {
    TreeNode first = null;
    TreeNode second = null;
    TreeNode cur = root;
    TreeNode pre_new = null;
    while (cur != null) {
        // 情况 1
        if (cur.left == null) {
            /*******************************************************/
            if (pre_new != null && cur.val < pre_new.val) {
                if (first == null) {
                    first = pre_new;
                    second = cur;
                } else {
                    second = cur;
                }
            }
            pre_new = cur;
            /*******************************************************/
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
                /*******************************************************/
                if (pre_new != null && cur.val < pre_new.val) {
                    if (first == null) {
                        first = pre_new;
                        second = cur;
                    } else {
                        second = cur;
                    }
                }
                pre_new = cur;
                /*******************************************************/
                cur = cur.right;
            }
        }
    }
    
    int temp = first.val;
    first.val = second.val;
    second.val = temp;
}
```

# 总

自己开始看到二分查找树，还是没有想到中序遍历，而是用了递归的思路去分析。可以看到如果想到中序遍历，题目会简单很多。