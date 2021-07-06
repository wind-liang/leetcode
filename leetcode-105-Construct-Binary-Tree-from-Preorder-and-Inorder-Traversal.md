# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/105.jpg)

根据二叉树的先序遍历和中序遍历还原二叉树。

# 解法一 递归

先序遍历的顺序是根节点，左子树，右子树。中序遍历的顺序是左子树，根节点，右子树。

所以我们只需要根据先序遍历得到根节点，然后在中序遍历中找到根节点的位置，它的左边就是左子树的节点，右边就是右子树的节点。

生成左子树和右子树就可以递归的进行了。

比如上图的例子，我们来分析一下。

```java
preorder = [3,9,20,15,7]
inorder = [9,3,15,20,7]
首先根据 preorder 找到根节点是 3
    
然后根据根节点将 inorder 分成左子树和右子树
左子树
inorder [9]

右子树
inorder [15,20,7]

把相应的前序遍历的数组也加进来
左子树
preorder[9] 
inorder [9]

右子树
preorder[20 15 7] 
inorder [15,20,7]

现在我们只需要构造左子树和右子树即可，成功把大问题化成了小问题
然后重复上边的步骤继续划分，直到 preorder 和 inorder 都为空，返回 null 即可
```

事实上，我们不需要真的把 `preorder` 和 `inorder` 切分了，只需要用分别用两个指针指向开头和结束位置即可。注意下边的两个指针指向的数组范围是包括左边界，不包括右边界。

对于下边的树的合成。

![](https://windliang.oss-cn-beijing.aliyuncs.com/105_3.jpg)

左子树

![](https://windliang.oss-cn-beijing.aliyuncs.com/105_4.jpg)

右子树

![](https://windliang.oss-cn-beijing.aliyuncs.com/105_5.jpg)

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
    return buildTreeHelper(preorder, 0, preorder.length, inorder, 0, inorder.length);
}

private TreeNode buildTreeHelper(int[] preorder, int p_start, int p_end, int[] inorder, int i_start, int i_end) {
    // preorder 为空，直接返回 null
    if (p_start == p_end) {
        return null;
    }
    int root_val = preorder[p_start];
    TreeNode root = new TreeNode(root_val);
    //在中序遍历中找到根节点的位置
    int i_root_index = 0;
    for (int i = i_start; i < i_end; i++) {
        if (root_val == inorder[i]) {
            i_root_index = i;
            break;
        }
    }
    int leftNum = i_root_index - i_start;
    //递归的构造左子树
    root.left = buildTreeHelper(preorder, p_start + 1, p_start + leftNum + 1, inorder, i_start, i_root_index);
    //递归的构造右子树
    root.right = buildTreeHelper(preorder, p_start + leftNum + 1, p_end, inorder, i_root_index + 1, i_end);
    return root;
}
```

上边的代码很好理解，但存在一个问题，在中序遍历中找到根节点的位置每次都得遍历中序遍历的数组去寻找，参考[这里](<https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/discuss/34538/My-Accepted-Java-Solution>) ，我们可以用一个`HashMap`把中序遍历数组的每个元素的值和下标存起来，这样寻找根节点的位置就可以直接得到了。

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
    HashMap<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) {
        map.put(inorder[i], i);
    }
    return buildTreeHelper(preorder, 0, preorder.length, inorder, 0, inorder.length, map);
}

private TreeNode buildTreeHelper(int[] preorder, int p_start, int p_end, int[] inorder, int i_start, int i_end,
                                 HashMap<Integer, Integer> map) {
    if (p_start == p_end) {
        return null;
    }
    int root_val = preorder[p_start];
    TreeNode root = new TreeNode(root_val);
    int i_root_index = map.get(root_val);
    int leftNum = i_root_index - i_start;
    root.left = buildTreeHelper(preorder, p_start + 1, p_start + leftNum + 1, inorder, i_start, i_root_index, map);
    root.right = buildTreeHelper(preorder, p_start + leftNum + 1, p_end, inorder, i_root_index + 1, i_end, map);
    return root;
}
```

本以为已经完美了，在 [这里](<https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/discuss/34543/Simple-O(n)-without-map>) 又看到了令人眼前一亮的思路，就是 StefanPochmann 大神，经常逛 Discuss 一定会注意到他，拥有 3 万多的赞。

![](https://windliang.oss-cn-beijing.aliyuncs.com/105_2.jpg)

他也发现了每次都得遍历一次去找中序遍历数组中的根节点的麻烦，但他没有用 `HashMap`就解决了这个问题，下边来说一下。

用`pre`变量保存当前要构造的树的根节点，从根节点开始递归的构造左子树和右子树，`in`变量指向当前根节点可用数字的开头，然后对于当前`pre`有一个停止点`stop`，从`in`到`stop`表示要构造的树当前的数字范围。

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
    return buildTreeHelper(preorder,  inorder, (long)Integer.MAX_VALUE + 1);
}
int pre = 0;
int in = 0;
private TreeNode buildTreeHelper(int[] preorder, int[] inorder, long stop) {
    //到达末尾返回 null
    if(pre == preorder.length){
        return null;
    }
    //到达停止点返回 null
    //当前停止点已经用了，in 后移
    if (inorder[in] == stop) {
        in++;
        return null;
    }
    int root_val = preorder[pre++];
    TreeNode root = new TreeNode(root_val);   
    //左子树的停止点是当前的根节点
    root.left = buildTreeHelper(preorder,  inorder, root_val);
    //右子树的停止点是当前树的停止点
    root.right = buildTreeHelper(preorder, inorder, stop);
    return root;
}
```

代码很简洁，但如果细想起来真的很难理解了。

把他的原话也贴过来吧。

> Consider the example again. Instead of finding the `1` in `inorder`, splitting the arrays into parts and recursing on them, just recurse on the full remaining arrays and **stop** when you come across the `1` in `inorder`. That's what my above solution does. Each recursive call gets told where to stop, and it tells its subcalls where to stop. It gives its own root value as stopper to its left subcall and its parent`s stopper as stopper to its right subcall.

本来很想讲清楚这个算法，但是各种画图，还是太难说清楚了。这里就画几个过程中的图，大家也只能按照上边的代码走一遍，理解一下了。

```java
      3
    /   \
   9     7
  / \
 20  15
 
前序遍历数组和中序遍历数组
preorder = [ 3, 9, 20, 15, 7 ]
inorder = [ 20, 9, 15, 3, 7 ]   
p 代表 pre，i 代表 in，s 代表 stop

首先构造根节点为 3 的树，可用数字是 i 到 s
s 初始化一个树中所有的数字都不会相等的数，所以代码中用了一个 long 来表示
3, 9, 20, 15, 7 
^  
p
20, 9, 15, 3, 7
^              ^
i              s

考虑根节点为 3 的左子树，                考虑根节点为 3 的树的右子树，
stop 值是当前根节点的值 3                只知道 stop 值是上次的 s
新的根节点是 9,可用数字是 i 到 s 
不包括 s
3, 9, 20, 15, 7                       3, 9, 20, 15, 7                
   ^                                    
   p
20, 9, 15, 3, 7                       20, 9, 15, 3, 7                     
^          ^                                         ^
i          s                                         s

递归出口的情况
3, 9, 20, 15, 7 
       ^  
       p
20, 9, 15, 3, 7
^    
i   
s   
此时 in 和 stop 相等，表明没有可用的数字，所以返回 null，并且表明此时到达了某个树的根节点，所以 i 后移。
```

总之他的思想就是，不再从中序遍历中寻找根节点的位置，而是直接把值传过去，表明当前子树的结束点。不过总感觉还是没有 get 到他的点，`in` 和 `stop` 变量的含义也是我赋予的，对于整个算法也只是勉强说通，大家有好的想法可以和我交流。

# 解法二 迭代 栈

参考 [这里](<https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/discuss/34555/The-iterative-solution-is-easier-than-you-think!>)，我们可以利用一个栈，用迭代实现。

假设我们要还原的树是下图

```java
      3
    /   \
   9     7
  / \
 20  15
```

首先假设我们只有先序遍历的数组，如果还原一颗树，会遇到什么问题。

```java
preorder = [3, 9, 20, 15, 7 ]
```

首先我们把 `3` 作为根节点，然后到了 `9` ，就出现一个问题，`9` 是左子树还是右子树呢？

所以需要再加上中序遍历的数组来确定。

```java
inorder = [ 20, 9, 15, 3, 7 ]
```

我们知道中序遍历，首先遍历左子树，然后是根节点，最后是右子树。这里第一个遍历的是 `20` ，说明先序遍历的 `9` 一定是左子树，利用反证法证明。

假如 `9` 是右子树，根据先序遍历 `preorder = [ 3, 9, 20, 15, 7 ]`，说明根节点 `3` 的左子树是空的，

左子树为空，那么中序遍历就会先遍历根节点 `3`，而此时是 `20`，假设不成立，说明 `9` 是左子树。

接下来的 `20` 同理，所以可以目前构建出来的树如下。

```java
      3
    /   
   9    
  / 
 20  
```

同时，还注意到此时先序遍历的 `20` 和中序遍历 `20` 相等了，说明什么呢？

说明中序遍历的下一个数 `15` 不是左子树了，如果是左子树，那么中序遍历的第一个数就不会是 `20`。

所以 `15` 一定是右子树了，现在还有个问题，它是 `20` 的右子树，还是 `9` 的右子树，还是 `3` 的右子树？

我们来假设几种情况，来想一下。

1. 如果是 `3` 的右子树， `20` 和 `9` 的右子树为空，那么中序遍历就是`20 9 3 15`。

2. 如果是 `9` 的右子树，`20` 的右子树为空，那么中序遍历就是`20 9 15`。

3. 如果是 `20` 的右子树，那么中序遍历就是`20 15`。

之前已经遍历的根节点是 `3 9 20`，**把它倒过来,即`20 9 3`**，然后和上边的三种中序遍历比较，会发现 `15` 就是**最后一次相等**的节点的右子树。

第 1 种情况，中序遍历是`20 9 3 15`，和`20 9 3` 都相等，所以 `15` 是`3` 的右子树。

第 2 种情况，中序遍历是`20 9 15`，只有`20 9` 相等，所以 `15` 是 `9` 的右子树。

第 3 种情况，中序遍历就是`20 15`，只有`20` 相等，所以 `20` 是 `15` 的右子树。

而此时我们的中序遍历数组是`inorder = [ 20, 9 ,15, 3, 7 ]`，`20` 匹配，`9`匹配，最后一次匹配是 `9`，所以 `15` 是 `9`的右子树。

```java
     3
    /   
   9    
  / \
 20  15
```

综上所述，我们用一个栈保存已经遍历过的节点，遍历前序遍历的数组，一直作为当前根节点的左子树，直到当前节点和中序遍历的数组的节点相等了，那么我们正序遍历中序遍历的数组，倒着遍历已经遍历过的根节点（用栈的 pop 实现），找到最后一次相等的位置，把它作为该节点的右子树。

上边的分析就是迭代总体的思想，代码的话还有一些细节注意一下。用一个栈保存已经遍历的节点，用 curRoot 保存当前正在遍历的节点。

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
    if (preorder.length == 0) {
        return null;
    }
    Stack<TreeNode> roots = new Stack<TreeNode>();
    int pre = 0;
    int in = 0;
    //先序遍历第一个值作为根节点
    TreeNode curRoot = new TreeNode(preorder[pre]);
    TreeNode root = curRoot;
    roots.push(curRoot);
    pre++;
    //遍历前序遍历的数组
    while (pre < preorder.length) {
        //出现了当前节点的值和中序遍历数组的值相等，寻找是谁的右子树
        if (curRoot.val == inorder[in]) {
            //每次进行出栈，实现倒着遍历
            while (!roots.isEmpty() && roots.peek().val == inorder[in]) {
                curRoot = roots.peek();
                roots.pop();
                in++;
            }
            //设为当前的右孩子
            curRoot.right = new TreeNode(preorder[pre]);
            //更新 curRoot
            curRoot = curRoot.right;
            roots.push(curRoot);
            pre++;
        } else {
            //否则的话就一直作为左子树
            curRoot.left = new TreeNode(preorder[pre]);
            curRoot = curRoot.left;
            roots.push(curRoot);
            pre++;
        }
    }
    return root;
}

```

# 总

用常规的递归和 HashMap 做的话这道题是不难的，用 `stop` 变量省去 HashMap 的思想以及解法二的迭代可以了解一下吧，不是很容易想到。



