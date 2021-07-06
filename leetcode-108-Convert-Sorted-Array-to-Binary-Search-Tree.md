# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/108.jpg)

给一个升序数组，生成一个平衡二叉搜索树。平衡二叉树定义如下：

> 它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。

二叉搜索树定义如下：

> 1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
> 2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
> 3. 任意节点的左、右子树也分别为二叉查找树；
> 4. 没有键值相等的节点。

# 解法一 递归

如果做了 [98 题](<https://leetcode.wang/leetCode-98-Validate-Binary-Search-Tree.html>) 和 [99 题](<https://leetcode.wang/leetcode-99-Recover-Binary-Search-Tree.html>)，那么又看到这里的升序数组，然后应该会想到一个点，二叉搜索树的中序遍历刚好可以输出一个升序数组。

所以题目给出的升序数组就是二叉搜索树的中序遍历。

根据中序遍历还原一颗树，又想到了 [105 题](<https://leetcode.wang/leetcode-105-Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal.html>) 和 [106 题](<https://leetcode.wang/leetcode-106-Construct-Binary-Tree-from-Inorder-and-Postorder-Traversal.html>)，通过中序遍历加前序遍历或者中序遍历加后序遍历来还原一棵树。前序（后序）遍历的作用呢？提供根节点！然后根据根节点，就可以递归的生成左右子树。

这里的话怎么知道根节点呢？平衡二叉树，既然要做到平衡，我们只要把根节点选为数组的中点即可。

综上，和之前一样，找到了根节点，然后把数组一分为二，进入递归即可。注意这里的边界情况，包括左边界，不包括右边界。

```java
public TreeNode sortedArrayToBST(int[] nums) {
    return sortedArrayToBST(nums, 0, nums.length);
}

private TreeNode sortedArrayToBST(int[] nums, int start, int end) {
    if (start == end) {
        return null;
    }
    int mid = (start + end) >>> 1;
    TreeNode root = new TreeNode(nums[mid]);
    root.left = sortedArrayToBST(nums, start, mid);
    root.right = sortedArrayToBST(nums, mid + 1, end);

    return root;
}
```

# 解法二 栈 DFS

递归都可以转为迭代的形式。

一部分递归算法，可以转成动态规划，实现空间换时间，例如  [5题](<https://leetcode.windliang.cc/leetCode-5-Longest-Palindromic-Substring.html>)，[10题](<https://leetcode.windliang.cc/leetCode-10-Regular-Expression-Matching.html>)，[53题](<https://leetcode.windliang.cc/leetCode-53-Maximum-Subarray.html?h=%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92>)，[72题](<https://leetcode.wang/leetCode-72-Edit-Distance.html>)，从自顶向下再向顶改为了自底向上。

一部分递归算法，只是可以用栈去模仿递归的过程，对于时间或空间的复杂度没有任何好处，比如这道题，唯一好处可能就是能让我们更清楚的了解递归的过程吧。

自己之前对于这种完全模仿递归思路写成迭代，一直也没写过，今天也就试试吧。

思路的话，我们本质上就是在模拟递归，递归其实就是压栈出栈的过程，我们需要用一个栈去把递归的参数存起来。这里的话，就是函数的参数 `start`，`end`，以及内部定义的 `root`。为了方便，我们就定义一个类。

```java
class MyTreeNode {
    TreeNode root;
    int start;
    int end 
    MyTreeNode(TreeNode r, int s, int e) {
        this.root = r;
        this.start = s;
        this.end = e;
    }
}
```

第一步，我们把根节点存起来。

```java
Stack<MyTreeNode> rootStack = new Stack<>();
int start = 0;
int end = nums.length;
int mid = (start + end) >>> 1;
TreeNode root = new TreeNode(nums[mid]);
TreeNode curRoot = root;
rootStack.push(new MyTreeNode(root, start, end));
```

然后开始递归的过程，就是不停的生成左子树。因为要生成左子树，`end - start` 表示当前树的可用数字的个数，因为根节点已经用去 1 个了，所以为了生成左子树，个数肯定需要大于 1。

```java
while (end - start > 1) {
    mid = (start + end) >>> 1; //当前根节点
    end = mid;//左子树的结尾
    mid = (start + end) >>> 1;//左子树的中点
    curRoot.left = new TreeNode(nums[mid]);
    curRoot = curRoot.left;
    rootStack.push(new MyTreeNode(curRoot, start, end));
}
```

在递归中，返回 `null` 以后，开始生成右子树。这里的话，当 `end - start <= 1` ，也就是无法生成左子树了，我们就可以出栈，来生成右子树。

```java
MyTreeNode myNode = rootStack.pop();
//当前作为根节点的 start end 以及 mid
start = myNode.start;
end = myNode.end;
mid = (start + end) >>> 1;
start = mid + 1; //右子树的 start
curRoot = myNode.root; //当前根节点
if (start < end) { //判断当前范围内是否有数
    mid = (start + end) >>> 1; //右子树的 mid
    curRoot.right = new TreeNode(nums[mid]);
    curRoot = curRoot.right;
    rootStack.push(new MyTreeNode(curRoot, start, end));
}
```

然后把上边几块内容组合起来就可以了。

```java
class MyTreeNode {
    TreeNode root;
    int start;
    int end;

    MyTreeNode(TreeNode r, int s, int e) {
        this.root = r;
        this.start = s;
        this.end = e;
    }
}
public TreeNode sortedArrayToBST(int[] nums) {
    if (nums.length == 0) {
        return null;
    }
    Stack<MyTreeNode> rootStack = new Stack<>();
    int start = 0;
    int end = nums.length;
    int mid = (start + end) >>> 1;
    TreeNode root = new TreeNode(nums[mid]);
    TreeNode curRoot = root;
    rootStack.push(new MyTreeNode(root, start, end));
    while (end - start > 1 || !rootStack.isEmpty()) {
        //考虑左子树
        while (end - start > 1) {
            mid = (start + end) >>> 1; //当前根节点
            end = mid;//左子树的结尾
            mid = (start + end) >>> 1;//左子树的中点
            curRoot.left = new TreeNode(nums[mid]);
            curRoot = curRoot.left;
            rootStack.push(new MyTreeNode(curRoot, start, end));
        }
        //出栈考虑右子树
        MyTreeNode myNode = rootStack.pop();
        //当前作为根节点的 start end 以及 mid
        start = myNode.start;
        end = myNode.end;
        mid = (start + end) >>> 1;
        start = mid + 1; //右子树的 start
        curRoot = myNode.root; //当前根节点
        if (start < end) { //判断当前范围内是否有数
            mid = (start + end) >>> 1; //右子树的 mid
            curRoot.right = new TreeNode(nums[mid]);
            curRoot = curRoot.right;
            rootStack.push(new MyTreeNode(curRoot, start, end));
        }

    }

    return root;
}
```

# 解法三 队列 BFS

参考 [这里](<https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/discuss/35218/Java-Iterative-Solution>)。 和递归的思路基本一样，不停的划分范围。

```java
class MyTreeNode {
    TreeNode root;
    int start;
    int end;

    MyTreeNode(TreeNode r, int s, int e) {
        this.root = r;
        this.start = s;
        this.end = e;
    }
}
public TreeNode sortedArrayToBST3(int[] nums) {
    if (nums.length == 0) {
        return null;
    }
    Queue<MyTreeNode> rootQueue = new LinkedList<>();
    TreeNode root = new TreeNode(0);
    rootQueue.offer(new MyTreeNode(root, 0, nums.length));
    while (!rootQueue.isEmpty()) {
        MyTreeNode myRoot = rootQueue.poll();
        int start = myRoot.start;
        int end = myRoot.end;
        int mid = (start + end) >>> 1;
        TreeNode curRoot = myRoot.root;
        curRoot.val = nums[mid];
        if (start < mid) {
            curRoot.left = new TreeNode(0);
            rootQueue.offer(new MyTreeNode(curRoot.left, start, mid));
        }
        if (mid + 1 < end) {
            curRoot.right = new TreeNode(0);
            rootQueue.offer(new MyTreeNode(curRoot.right, mid + 1, end));
        }
    }

    return root;
}
```

最巧妙的地方是它先生成 `left` 和 `right` 但不进行赋值，只是把范围传过去，然后出队的时候再进行赋值。这样最开始的根节点也无需单独考虑了。

# 扩展 求中点

前几天和同学发现个有趣的事情，分享一下。

首先假设我们的变量都是 `int` 值。

二分查找中我们需要根据 `start` 和 `end` 求中点，正常情况下加起来除以 2 即可。

```java
int mid = (start + end) / 2
```

但这样有一个缺点，我们知道`int`的最大值是 `Integer.MAX_VALUE` ，也就是`2147483647`。那么有一个问题，如果 `start = 2147483645`，`end = 2147483645`，虽然 `start` 和 `end`都没有超出最大值，但是如果利用上边的公式，加起来的话就会造成溢出，从而导致`mid`计算错误。

解决的一个方案就是利用数学上的技巧，我们可以加一个 `start` 再减一个 `start` 将公式变形。

```java
(start + end) / 2 = (start + end + start - start) / 2 = start + (end - start) / 2
```

这样的话，就解决了上边的问题。

然后当时和同学看到`jdk`源码中，求`mid`的方法如下

```java
int mid = (start + end) >>> 1
```

它通过移位实现了除以 2，但。。。这样难道不会导致溢出吗？

首先大家可以补一下 [补码](https://mp.weixin.qq.com/s/uvcQHJi6AXhPDJL-6JWUkw) 的知识。

其实问题的关键就是这里了`>>>` ，我们知道还有一种右移是`>>`。区别在于`>>`为有符号右移，右移以后最高位保持原来的最高位。而 `>>>` 这个右移的话最高位补 0。

所以这里其实利用到了整数的补码形式，最高位其实是符号位，所以当 `start + end` 溢出的时候，其实本质上只是符号位收到了进位，而`>>>`这个右移不仅可以把符号位右移，同时最高位只是补零，不会对数字的大小造成影响。

但`>>`有符号右移就会出现问题了，事实上 JDK6 之前都用的`>>`，这个 BUG 在 java 里竟然隐藏了十年之久。

# 总

经过这么多的分析，大家估计体会到了递归的魅力了吧，简洁而优雅。另外的两种迭代的实现，可以让我们更清楚的了解递归到底发生了什么。关于求中点，大家以后就用`>>>`吧，比`start + (end - start) / 2`简洁不少，还能给别人科普一下补码的知识。