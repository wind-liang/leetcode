# 题目描述（简单难度）

297、Serialize and Deserialize Binary Tree

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

**Example:** 

```
You may serialize the following tree:

    1
   / \
  2   3
     / \
    4   5

as "[1,2,3,null,null,4,5]"
```

**Clarification:** The above format is the same as [how LeetCode serializes a binary tree](https://leetcode.com/faq/#binary-tree). You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.

**Note:** Do not use class member/global/static variables to store states. Your serialize and deserialize algorithms should be stateless.

提供两个方法，一个方法将二叉树序列化为一个字符串，另一个方法将序列化的字符串还原为二叉树。

# 解法一

来个偷懒的方法，我们知道通过先序遍历和中序遍历可以还原一个二叉树。[144 题](https://leetcode.wang/leetcode-144-Binary-Tree-Preorder-Traversal.html) 的先序遍历，[94 题](https://leetcode.wang/leetCode-94-Binary-Tree-Inorder-Traversal.html) 的中序遍历，[105 题](https://leetcode.wang/leetcode-105-Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal.html) 的通过先序遍历和中序遍历还原二叉树。

上边主要的代码都有了，我们还需要将先序遍历和中序遍历的结果转为字符串，以及从字符串还原先序遍历和中序遍历的结果。

`list` 有 `toString` 方法，它会把 `list` 转成 `"[1, 2, 3, 5]"`这样类似的字符串。所以把这个字符串还原为 `list` 的时候，我们只需要去掉首尾的中括号，然后用逗号切割即可。

```java
// Encodes a tree to a single string.
public String serialize(TreeNode root) {
    if (root == null) {
        return "";
    }
    List<Integer> preOrder = preorderTraversal(root);
    List<Integer> inOrder = inorderTraversal(root);
    //两个结果用 "@" 分割
    return preOrder + "@" + inOrder;
}

// Decodes your encoded data to tree.
public TreeNode deserialize(String data) {
    if (data.length() == 0) {
        return null;
    }
    String[] split = data.split("@");
	//还原先序遍历的结果
    String[] preStr = split[0].substring(1, split[0].length() - 1).split(",");
    int[] preorder = new int[preStr.length];
    for (int i = 0; i < preStr.length; i++) {
        //trim 是为了去除首尾多余的空格
        preorder[i] = Integer.parseInt(preStr[i].trim());
    }

    //还原中序遍历的结果
    String[] inStr = split[1].substring(1, split[1].length() - 1).split(",");
    int[] inorder = new int[inStr.length];
    for (int i = 0; i < inStr.length; i++) {
        inorder[i] = Integer.parseInt(inStr[i].trim());
    }
    
    return buildTree(preorder, inorder);
}

// 前序遍历
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

// 中序遍历
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> ans = new ArrayList<>();
    getAns(root, ans);
    return ans;
}

private void getAns(TreeNode node, List<Integer> ans) {
    if (node == null) {
        return;
    }
    getAns(node.left, ans);
    ans.add(node.val);
    getAns(node.right, ans);
}

//还原二叉树
private TreeNode buildTree(int[] preorder, int[] inorder) {
    return buildTreeHelper(preorder, 0, preorder.length, inorder, 0, inorder.length);
}

private TreeNode buildTreeHelper(int[] preorder, int p_start, int p_end, int[] inorder, int i_start, int i_end) {
    // preorder 为空，直接返回 null
    if (p_start == p_end) {
        return null;
    }
    int root_val = preorder[p_start];
    TreeNode root = new TreeNode(root_val);
    // 在中序遍历中找到根节点的位置
    int i_root_index = 0;
    for (int i = i_start; i < i_end; i++) {
        if (root_val == inorder[i]) {
            i_root_index = i;
            break;
        }
    }
    int leftNum = i_root_index - i_start;
    // 递归的构造左子树
    root.left = buildTreeHelper(preorder, p_start + 1, p_start + leftNum + 1, inorder, i_start, i_root_index);
    // 递归的构造右子树
    root.right = buildTreeHelper(preorder, p_start + leftNum + 1, p_end, inorder, i_root_index + 1, i_end);
    return root;
}
```

但是竟然遇到了 `WA`。

![](https://windliang.oss-cn-beijing.aliyuncs.com/297_2.jpg)

我开始看到的结果的时候真的小小的震惊了一下，哪里出了问题。用的都是之前的代码，只可能是字符串转换那里出问题了。然后调试了一下发现没有问题，甚至又回到之前的题重新提交了一下，也是没有问题的。

先序遍历和中序遍历唯一确定一个二叉树，这个定理错了？？？然后用上边的样例调试了一下，恍然大悟，这个定理的前提必须得是没有重复的元素。

# 解法二

好吧，看来不能偷懒。那我们就用 `leetcode` 所使用的方式吧，通过层次遍历来序列化和还原二叉树。

我们只需要将每一层的序列存到数组中，如果是 `null` 就存 `null`。可以结合 [102 题](https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html) 二叉树的层次遍历。

```java
// Encodes a tree to a single string.
public String serialize(TreeNode root) {
    if (root == null) {
        return "";
    }
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<Integer> res = new LinkedList<Integer>();
    queue.offer(root);
    //BFS
    while (!queue.isEmpty()) {
        TreeNode curNode = queue.poll();
        if (curNode != null) {
            res.add(curNode.val);
            queue.offer(curNode.left);
            queue.offer(curNode.right);
        } else {
            res.add(null);
        }
    } 
    return res.toString();
}

// Decodes your encoded data to tree.
public TreeNode deserialize(String data) {
    if (data.length() == 0) {
        return null;
    }
    //将字符串还原为数组
    String[] preStr = data.substring(1, data.length() - 1).split(",");
    Integer[] bfsOrder = new Integer[preStr.length];
    for (int i = 0; i < preStr.length; i++) {
        if (preStr[i].trim().equals("null")) {
            bfsOrder[i] = null;
        } else {
            bfsOrder[i] = Integer.parseInt(preStr[i].trim());
        }
    }

    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    TreeNode root = new TreeNode(bfsOrder[0]);
    int cur = 1;//通过 cur 指针依次给节点赋值
    queue.offer(root);
    while (!queue.isEmpty()) { 
        TreeNode curNode = queue.poll();
        if (bfsOrder[cur] != null) {
            curNode.left = new TreeNode(bfsOrder[cur]);
            queue.add(curNode.left);
        }
        cur++; 
        if (bfsOrder[cur] != null) {
            curNode.right = new TreeNode(bfsOrder[cur]);
            queue.add(curNode.right);
        }
        cur++;
    }
    return root;
}
```

上边的方法已经可以 `AC` 了，但还可以做一个小小的优化。

如果通过上边的代码，对于下边的二叉树。

```java
    1
   / \
  2   3
 /
4
```

序列化成字符串就是 `"[1, 2, 3, 4, null, null, null, null, null]"`。就是下边的样子。

```java
n 表示 null
        1
      /   \
     2     3
    / \   /  \
   4   n  n   n
  / \
 n   n
```

当我们一层一层的还原的时候，因为 `TreeNode` 的默认值就是 `null`。所以还原到 `4` 的时候后边其实就不需要管了。

因为末尾的 `null` 是没有必要的，所以在返回之前，我们可以把末尾的 `null` 去掉。此外，`deserialize()` 函数中，因为我们去掉了末尾的 `null`，所以当 `cur` 到达数组末尾的时候要提前结束循环。

```java
// Encodes a tree to a single string.
public String serialize(TreeNode root) {
    if (root == null) {
        return "";
    }
    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    List<Integer> res = new LinkedList<Integer>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        TreeNode curNode = queue.poll();
        if (curNode != null) {
            res.add(curNode.val);
            queue.offer(curNode.left);
            queue.offer(curNode.right);
        } else {
            res.add(null);
        }
    }
    //去掉末尾的 null
    while (true) {
        if (res.get(res.size() - 1) == null) {
            res.remove(res.size() - 1);
        } else {
            break;
        }
    }
    return res.toString();
}

// Decodes your encoded data to tree.
public TreeNode deserialize(String data) {
    if (data.length() == 0) {
        return null;
    }
    String[] preStr = data.substring(1, data.length() - 1).split(",");
    Integer[] bfsOrder = new Integer[preStr.length];
    for (int i = 0; i < preStr.length; i++) {
        if (preStr[i].trim().equals("null")) {
            bfsOrder[i] = null;
        } else {
            bfsOrder[i] = Integer.parseInt(preStr[i].trim());
        }
    }

    Queue<TreeNode> queue = new LinkedList<TreeNode>();
    TreeNode root = new TreeNode(bfsOrder[0]);
    int cur = 1;
    queue.offer(root);
    while (!queue.isEmpty()) {
        if (cur == bfsOrder.length) {
            break;
        }
        TreeNode curNode = queue.poll();
        if (bfsOrder[cur] != null) {
            curNode.left = new TreeNode(bfsOrder[cur]);
            queue.add(curNode.left);
        }
        cur++;
        if (cur == bfsOrder.length) {
            break;
        }
        if (bfsOrder[cur] != null) {
            curNode.right = new TreeNode(bfsOrder[cur]);
            queue.add(curNode.right);
        }
        cur++;
    }
    return root;
}
```

# 解法三

我们可以只用先序遍历。什么？？？只用先序遍历，是的，你没有听错。我开始也没往这方面想。直到看到 [这里](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/discuss/74253/Easy-to-understand-Java-Solution) 的题解。

为什么可以只用先序遍历？因为我们先序遍历过程中把遇到的 `null` 也保存起来了。所以本质上和解法二的 `BFS` 是一样的。

此外，他没有套用之前先序遍历的代码，重写了先序遍历，在遍历过程中生成序列化的字符串。

```java
private static final String spliter = ",";
private static final String NN = "X"; //当做 null

// Encodes a tree to a single string.
public String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    buildString(root, sb);
    return sb.toString();
}

private void buildString(TreeNode node, StringBuilder sb) {
    if (node == null) {
        sb.append(NN).append(spliter);
    } else {
        sb.append(node.val).append(spliter);
        buildString(node.left, sb);
        buildString(node.right,sb);
    }
}
// Decodes your encoded data to tree.
public TreeNode deserialize(String data) {
    Deque<String> nodes = new LinkedList<>();
    nodes.addAll(Arrays.asList(data.split(spliter)));
    return buildTree(nodes);
}

private TreeNode buildTree(Deque<String> nodes) {
    String val = nodes.remove();
    if (val.equals(NN)) return null;
    else {
        TreeNode node = new TreeNode(Integer.valueOf(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}
```

# 总

这道题的话完善了自己脑子里的一些认识，先序遍历和中序遍历可以唯一的确定一个二叉树，前提是元素必须不一样。其实看通过先序遍历和中序遍历还原二叉树的代码也可以知道，因为我们需要找根节点的下标，如果有重复的值，肯定就不行了。

其次，如果二叉树的遍历考虑了 `null`，那么不管什么遍历我们都能把二叉树还原。