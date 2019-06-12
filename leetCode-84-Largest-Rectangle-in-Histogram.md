# 题目描述（困难难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/84.png)

给一个柱状图，输出一个矩形区域的最大面积。

# 解法一 暴力破解

以题目给出的例子为例，柱形图高度有 1,  2,  3,  5,  6，我们只需要找出每一个高度对应的最大的面积，选出最大的即可。如果求高度为 3 的面积最大的，我们只需要遍历每一个高度，然后看连续的大于等于 3 的柱形有几个，如果是 n 个，那么此时的面积就是 3 * n。所以高度确定的话，我们只需要找连续的大于等于 3 的柱形个数，也就是高度。

```java
public int largestRectangleArea(int[] heights) {
    HashSet<Integer> heightsSet = new HashSet<Integer>();
    //得到所有的高度，也就是去重。
    for (int i = 0; i < heights.length; i++) {
        heightsSet.add(heights[i]);
    }
    int maxArea = 0;
    //遍历每一个高度
    for (int h : heightsSet) {
        int width = 0;
        int maxWidth = 1;
        //找出连续的大于等于当前高度的柱形个数的最大值
        for (int i = 0; i < heights.length; i++) {
            if (heights[i] >= h) {
                width++;
            //出现小于当前高度的就归零，并且更新最大宽度
            } else {
                maxWidth = Math.max(width, maxWidth);
                width = 0;
            }
        }
        maxWidth = Math.max(width, maxWidth);
        //更新最大区域的面积
        maxArea = Math.max(maxArea, h * maxWidth);
    }
    return maxArea;
}
```

时间复杂度：O（n²）。

空间复杂度：O ( n）。存所有高度。

# 解法二 

参考[这里](<https://www.geeksforgeeks.org/largest-rectangular-area-in-a-histogram-set-1/>)。有一些快排的影子，大家不妨先去回顾一下快排。快排中，我们找了一个基准点，把数组分成了小于基准点的数，和大于基准点的数。然后递归的完成了排序。

类似的，这里我们也可以找一个柱子。然后把所有柱子分成左半区域和右半区域。

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_1.jpg)

这样要找的最大矩形区域就是三种情况了。

1. 最大矩形区域在不包含选定柱子的左半区域当中。
2. 最大矩形区域在不包含选定柱子的右半区域当中。
3. 最大矩形区域包含选定柱子的区域。

对于 1、2 两种情况，我们只需要递归的去求就行了。而对于第 3 种情况，我们找一个特殊的柱子作为分界点以方便计算，哪一个柱子呢？最矮的那个！有什么好处呢？这样包含该柱子的最大区域，一定是涵盖了当前所有柱子。

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_2.jpg)

所以面积当然是当前选定柱子的高度乘以当前的最大宽度了。

对于当前的时间复杂度，如果每次选定的柱子都可以把区域一分为二，递推式就是

T（n） = 2 * T（n / 2 ) + n。

上边多加的 n 是找最小柱子耗费，因为需要遍历一遍柱子。然后和快排一样，这样递归下去，时间复杂度就是 O（n log（n））。当然和快排一样的问题，最坏的情况，如果最小柱子每次都出现在末尾，这样会使得只有左半区域，右半区域是 0。递推式就变成了

T（n） = T（n - 1 ) + n。

时间复杂度就变成 O（n²）了，怎么优化呢？

重点就在上边找最小柱子多加的 n 上了，如果我们找最小柱子时间复杂度优化成 log（n）。那么在最坏情况下，递推式变成

T（n） = T（n - 1 ) + log（n）。

最坏的情况，递推式代入，依旧是 O（n log（n））。而找最小柱子，就可以抽象成，在一个数组区间内找最小值问题，而这个问题前人已经提出了一个数据结构，可以使得时间复杂度是 log（n），完美！名字叫做线段树，可以参考[这里](<https://zhuanlan.zhihu.com/p/34150142>)和[线段树空间复杂度](<https://blog.csdn.net/gl486546/article/details/78243098>)，我就不重复讲了。主要思想就是利用二叉树，使得查找时间复杂度变成了 O（log（n））。

我们以序列 { 5, 9, 7, 4 ,6, 1} 为例，线段树长下边的样子。节点的值代表当前区间内的最小值。

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_3.jpg)



```java
class Node// 节点
{
    int start;// 区间的左端点
    int end;// 区间的右端点
    int data;// 该区间的最小值
    int index; // 该节点最小值对应数组的下标

    public Node(int start, int end)// 构造方法中传入左端点和右端点
    {
        this.start = start;
        this.end = end;
    }

}

class SegmentTree {
    private int[] base;;// 给定数组
    Node[] nodes;// 存储线段树的数组

    public SegmentTree(int[] nums) {
        base = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            base[i] = nums[i];
        }
        //需要 4n 的空间，上边链接给出了原因
        nodes = new Node[base.length * 4];
    }

    public void build(int index)// 构造一颗线段树，传入下标
    {
        Node node = nodes[index];// 取出该下标下的节点
        if (node == null) {// 根节点需要手动创建
            nodes[index] = new Node(0, this.base.length - 1);
            node = nodes[index];
        }
        if (node.start == node.end) {// 如果这个线段的左端点等于右端点则这个点是叶子节点
            node.data = base[node.start];
            node.index = node.start;
        } else { // 否则递归构造左右子树
            int mid = (node.start + node.end) >> 1;// 现在这个线段的中点
            nodes[(index << 1) + 1] = new Node(node.start, mid);// 左孩子线段
            nodes[(index << 1) + 2] = new Node(mid + 1, node.end);// 右孩子线段
            build((index << 1) + 1);// 构造左孩子
            build((index << 1) + 2);// 构造右孩子
            if (nodes[(index << 1) + 1].data <= nodes[(index << 1) + 2].data) {
                node.data = nodes[(index << 1) + 1].data;
                node.index = nodes[(index << 1) + 1].index;
            } else {
                node.data = nodes[(index << 1) + 2].data;
                node.index = nodes[(index << 1) + 2].index;
            }
        }
    }

    public Node query(int index, int start, int end) {
        Node node = nodes[index];
        if (node.start > end || node.end < start)
            return null;// 当前区间和待查询区间没有交集，那么返回一个极大值
        if (node.start >= start && node.end <= end)
            return node;// 如果当前的区间被包含在待查询的区间内则返回当前区间的最小值
        Node left = query((index << 1) + 1, start, end);
        int dataLeft = left == null ? Integer.MAX_VALUE : left.data;
        Node right = query((index << 1) + 2, start, end);
        int dataRight = right == null ? Integer.MAX_VALUE : right.data;
        return dataLeft <= dataRight ? left : right;

    }
}
class Solution {
    public int largestRectangleArea(int[] heights) {
        if (heights.length == 0) {
            return 0;
        }
        //构造线段树
        SegmentTree tree = new SegmentTree(heights);
        tree.build(0);
        return getMaxArea(tree, 0, heights.length - 1, heights);
    }
	/**
     *  查询某个区间的最小值
     * @param tree 构造好的线段树 
     * @param start 待查询的区间的左端点
     * @param end 待查询的区间的右端点
     * @param heights 给定的数组
     * @return 返回当前区间的矩形区域的最大值
     */
    private int getMaxArea(SegmentTree tree, int start, int end, int[] heights) {
        if (start == end) {
            return heights[start];
        }
        //非法情况，返回一个最小值，防止影响正确的最大值
        if (start > end) {
            return Integer.MIN_VALUE;
        }
        //找出最小的柱子的下标
        int min = tree.query(0, start, end).index;
        //最大矩形区域包含选定柱子的区域。
        int area1 = heights[min] * (end - start + 1);
        //最大矩形区域在不包含选定柱子的左半区域。
        int area2 = getMaxArea(tree, start, min - 1, heights);
        //最大矩形区域在不包含选定柱子的右半区域。
        int area3 = getMaxArea(tree, min + 1, end, heights);
        //返回最大的情况
        return Math.max(Math.max(area1, area2), area3);
    }
}  
```

时间复杂度：O（n log（n））。

空间复杂度：O（n），用来存储线段树。

# 解法三

参考[这里](<https://leetcode.com/problems/largest-rectangle-in-histogram/discuss/28910/Simple-Divide-and-Conquer-AC-solution-without-Segment-Tree>)，思考下解法二中遇到的问题，利用了类似快排的思想，最好情况的递推式是 

T（n） = 2 * T（n / 2 ) + n。

就是 n log（n），但是由于分界点的柱子的选择，并不能总保证两部分的柱子数量均分。所以如果这个问题解决，那么我们就可以保证时间复杂度是  n log（n）了。如何让它均分呢？我们强行把它分成 3 部分呗。 

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_4.jpg)

1. 左半区域，含有一半柱子，当然如果总数是奇数个，这里会多一个。

2. 右半区域，含有一半柱子，当然如果总数是奇数个，这里会少一个。
3. 包含最中间柱子的部分，最大区域一定会包含橙色部分，这样才会横跨两个区域。

情况 1、2 的最大区域面积可以用递归来解决，情况 3 的话，我们只要保证是 O（n），就满足了我们的递推式，从而保证时间复杂度是O（n log（n））。怎么做呢？

贪婪的思想，每次选两边较高的柱子扩展柱子。然后其实就是求出了 2 个柱子，3 个柱子，4 个柱子，5 个柱子...每种情况的最大值，然后选最大的就可以了。

1. 初始的时候是两个柱子，记录此时的面积。

2. 然后加 1 个柱子，选取两边较高的柱子，然后计算此时的面积，更新最大区域面积。
3. 不停的重复过程 2 ，直到所有柱子遍历完

```java
public int largestRectangleArea(int[] heights) {
    if (heights.length == 0) {
        return 0;
    }
    return getMaxArea(heights, 0, heights.length - 1);
}

private int getMaxArea(int[] heights, int left, int right) {
    if (left == right) {
        return heights[left];
    }
    int mid = left + (right - left) / 2;
    //左半部分
    int area1 = getMaxArea(heights, left, mid);
    //右半部分
    int area2 = getMaxArea(heights, mid + 1, right);
    //中间区域
    int area3 = getMidArea(heights, left, mid, right);
    //选择最大的
    return Math.max(Math.max(area1, area2), area3);
}

private int getMidArea(int[] heights, int left, int mid, int right) { 
    int i = mid;
    int j = mid + 1;
    int minH = Math.min(heights[i], heights[j]);
    int area = minH * 2;
    //向两端扩展
    while (i >= left && j <= right) {
        minH = Math.min(minH, Math.min(heights[i], heights[j]));
        //更新最大面积
        area = Math.max(area, minH * (j - i + 1));
        if (i == left) {
            j++;
        } else if (j == right) {
            i--;
            //选择较高的柱子
        } else if (heights[i - 1] >= heights[j + 1]) {
            i--;
        } else {
            j++;

        }
    }
    return area;
}
```

时间复杂度：O（n log（n））。

空间复杂度：O（log（n）），压栈的空间。

# 解法四 

参考[这里](<https://leetcode.com/problems/largest-rectangle-in-histogram/discuss/28902/5ms-O(n)-Java-solution-explained-(beats-96)>)。解法一暴力破解中，我们把所有矩形区域按高度依次求出来，选出了最大的。这里我们想另外一个分类方法。分别求出包含每个柱子的矩形区域的最大面积，然后选最大的。要包含这个柱子，也就是这个柱子是当前矩形区域的高度。也就是，这个柱子是当前矩形区域中柱子最高的。如下图中包含橙色柱子的矩形区域的最大面积。

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_5.jpg)

求当前的矩形区域，我们只需要知道比当前柱子到左边第一个小的 leftLessMin 和到右边第一个小的 rightLessMin 两个柱子下标，就可以求出矩形的面积为 (rightLessMin - leftLessMin - 1) * 当前柱子高度。然后遍历每个柱子，按同样的方法求出矩形面积，选最大的就可以了。

现在的问题就是，怎么知道 rightLessMin  和 leftLessMin 。

我们可以用一个数组，leftLessMin[ ] 保存各自的左边第一个小的柱子。

```java
leftLessMin[0] = -1;//第一个柱子前边没有柱子，所以赋值为 -1，便于计算面积              
for (int i = 1; i < heights.length; i++) {              
    int p = i - 1;
    //p 一直减少，找到第一个比当前高度小的柱子就停止
    while (p >= 0 && height[p] >= height[i]) {
        p--;
    }
    leftLessMin[i] = p;              
}
```

上边的时间复杂度是 O（n²），我们可以进行优化。参考下边的图，当前柱子 i 比上一个柱子小的时候，因为我们是找比当前柱子矮的，之前我们进行减 1，判断上上个。但是我们之前已经求出了上一个柱子的 leftLessMin[ i - 1]，也就是第一个比上个柱子小的柱子，所以其实我们可以直接跳到  leftLessMin[ i - 1] 比较。因为从  leftLessMin[ i - 1] + 1到 i - 1 的柱子一定是比当前柱子 i 高的，所以可以跳过。

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_6.jpg)

这样的话时间复杂度达到了O（n）。开始自己不理解，问了一下同学。其实证明的话，可以结合解法五，我们寻找 leftLessMin 其实可以看做压栈出栈的过程，每个元素只会被访问两次。

```java
int[] leftLessMin = new int[heights.length];
leftLessMin[0] = -1;
for (int i = 1; i < heights.length; i++) {
    int l = i - 1;
    //当前柱子更小一些，进行左移
    while (l >= 0 && heights[l] >= heights[i]) {
        l = leftLessMin[l];
    }
    leftLessMin[i] = l;
}
```

求到右边第一个小的柱子同理，下边是完整的代码。

```java
public int largestRectangleArea(int[] heights) {
    if (heights.length == 0) {
        return 0;
    }
    //求每个柱子的左边第一个小的柱子的下标
    int[] leftLessMin = new int[heights.length];
    leftLessMin[0] = -1;
    for (int i = 1; i < heights.length; i++) {
        int l = i - 1;
        while (l >= 0 && heights[l] >= heights[i]) {
            l = leftLessMin[l];
        }
        leftLessMin[i] = l;
    }
	
    //求每个柱子的右边第一个小的柱子的下标
    int[] rightLessMin = new int[heights.length];
    rightLessMin[heights.length - 1] = heights.length;
    for (int i = heights.length - 2; i >= 0; i--) {
        int r = i + 1;
        while (r <= heights.length - 1 && heights[r] >= heights[i]) {
            r = rightLessMin[r];
        }
        rightLessMin[i] = r;
    }
    
    //求包含每个柱子的矩形区域的最大面积，选出最大的
    int maxArea = 0;
    for (int i = 0; i < heights.length; i++) {
        int area = (rightLessMin[i] - leftLessMin[i] - 1) * heights[i];
        maxArea = Math.max(area, maxArea);
    }
    return maxArea;
}

```

时间复杂度：O（n），取决于找  leftLessMin [ i ] 的复杂度。

空间复杂度：O（n），保存每个柱子左边右边第一个小的柱子下标。

# 解法五 栈

参考[这里](<https://www.geeksforgeeks.org/largest-rectangle-under-histogram/>)。之前也遇到利用栈巧妙解题的，例如[42题](<https://leetcode.wang/leetCode-42-Trapping-Rain-Water.html>)的解法五，和这道题的共同点就是配对问题。思路的话，本质上和解法四是一样的，可以先看下解法四，左边第一个小于当前柱子和右边第一个小于当前柱子是一对。通过它俩可以求出当前柱子的最大矩形区域。那么具体怎么操作呢？

遍历每个柱子，然后分下边几种情况。

* 如果当前栈空，或者当前柱子大于栈顶柱子的高度，就将当前柱子的下标入栈
* 当前柱子的高度小于栈顶柱子的高度。那么就把栈顶柱子出栈，当做解法四中的当前要求面积的柱子。而右边第一个小于当前柱子的下标就是当前在遍历的柱子，左边第一个小于当前柱子的下标就是当前新的栈顶。

遍历完成后，如果栈没有空。就依次出栈，出栈元素当做解法四中的要求面积的柱子，然后依次计算矩形区域面积。

![](https://windliang.oss-cn-beijing.aliyuncs.com/84_7.jpg)

结合图可以看一下，从头开始遍历，遍历柱子开始的时候都大于前一个柱子高度，所以依次入栈。直到遍历到橙色部分，栈顶元素出栈，计算包含栈顶柱子的矩形区域。而左边第一个小于要求柱子的就是新栈顶，右边第一个小于要求柱子的就是当前遍历柱子。

```java
public int largestRectangleArea(int[] heights) {
    int maxArea = 0;
    Stack<Integer> stack = new Stack<>();
    int p = 0;
    while (p < heights.length) {
        //栈空入栈
        if (stack.isEmpty()) {
            stack.push(p);
            p++;
        } else {
            int top = stack.peek();
            //当前高度大于栈顶，入栈
            if (heights[p] >= heights[top]) {
                stack.push(p);
                p++;
            } else {
                //保存栈顶高度
                int height = heights[stack.pop()];
                //左边第一个小于当前柱子的下标
                int leftLessMin = stack.isEmpty() ? -1 : stack.peek();
                //右边第一个小于当前柱子的下标
                int RightLessMin = p;
                //计算面积
                int area = (RightLessMin - leftLessMin - 1) * height;
                maxArea = Math.max(area, maxArea);
            }
        }
    }
    while (!stack.isEmpty()) {
        //保存栈顶高度
        int height = heights[stack.pop()];
        //左边第一个小于当前柱子的下标
        int leftLessMin = stack.isEmpty() ? -1 : stack.peek();
        //右边没有小于当前高度的柱子，所以赋值为数组的长度便于计算
        int RightLessMin = heights.length;
        int area = (RightLessMin - leftLessMin - 1) * height;
        maxArea = Math.max(area, maxArea);
    }
    return maxArea;
}
```

时间复杂度：O（n），因为对于每个柱子只会经历入栈出栈，所以最多 2n 次。

空间复杂度：O（n），栈的大小。

# 总

这道题经典呀，第一次用快排的思想去解决问题，太优雅了。另外通过对问题的挖掘，时间复杂度优化到 O（n），也是惊叹。