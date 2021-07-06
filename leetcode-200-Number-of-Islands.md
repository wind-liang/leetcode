# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/200.jpg)

一个二维数组，把 `1` 看做陆地，把 `0` 看做大海，陆地相连组成一个岛屿。把数组以外的区域也看做是大海，问总共有多少个岛屿。

# 解法一

想法很简单，我们只需要遍历二维数组，然后遇到 `1` 的时候，把当前的 `1` 以及它周围的所有 `1` 都标记成一个字符，这里直接标记成 `2`。然后记录遇到了几次 `1`，就代表有几个岛屿。看下边的例子。

```java
[1] 1 0 0 0
 1  1 0 0 0
 0 0 1 0 0
 0 0 0 1 1
当前遇到了 1, count = 1;
把当前的 1 和它周围的 1 标记为 2
2 2 0 0 0
2 2 0 0 0
0 0 1 0 0
0 0 0 1 1

2 2  0  0 0
2 2  0  0 0
0 0 [1] 0 0
0 0  0  1 1
遇到下一个 1, count = 2;
把当前的 1 和它周围的 1 标记为 2
2 2 0 0 0
2 2 0 0 0
0 0 2 0 0
0 0 0 1 1   
    
2 2 0  0  0
2 2 0  0  0
0 0 2  0  0
0 0 0 [1] 1  
遇到下一个 1, count = 3;
把当前的 1 和它周围的 1 标记为 2
2 2 0 0 0
2 2 0 0 0
0 0 2 0 0
0 0 0 2 2  

没有 1 了，所以岛屿数是 count = 3 个。
```

还有一个问题就是怎么标记与当前 `1` 相邻的 `1`。也很直接，我们直接把和当前 `1` 连通的位置看做一个图，然后做一个遍历即可。可以直接用递归写一个 `DFS`，即深度优先遍历。

```java
public int numIslands(char[][] grid) {
    int count = 0;
    int rows = grid.length;
    if (rows == 0) {
        return 0;
    }
    int cols = grid[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;
                marked(r, c, rows, cols, grid);
            }
        }
    }
    return count;
}

private void marked(int r, int c, int rows, int cols, char[][] grid) {
    if (r == -1 || c == -1 || r == rows || c == cols || grid[r][c] != '1') {
        return;
    }
    //当前 1 标记为 2
    grid[r][c] = '2';
    
    //向上下左右扩展
    marked(r + 1, c, rows, cols, grid);
    marked(r, c + 1, rows, cols, grid);
    marked(r - 1, c, rows, cols, grid);
    marked(r, c - 1, rows, cols, grid);

}
```

当然做遍历的话，我们也可以采用 `BFS`，广度优先遍历。图的广度优先遍历和二叉树的 [层次遍历](https://leetcode.wang/leetcode-102-Binary-Tree-Level-Order-Traversal.html) 类似，只需要借助一个队列即可。

和上边的区别不大，改一下标记函数即可。

此外入队列的时候，我们把二维坐标转为了一维，就省去了再创建一个类表示坐标。

```java
public int numIslands(char[][] grid) {
		int count = 0;
		int rows = grid.length;
		if (rows == 0) {
			return 0;
		}
		int cols = grid[0].length;
		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols; c++) {
				if (grid[r][c] == '1') {
					count++;
					bfs(r, c, rows, cols, grid);
				}
			}
		}
		return count;
	}
 private void bfs(int r, int c, int rows, int cols, char[][] grid) {
		Queue<Integer> queue = new LinkedList<Integer>();
		queue.offer(r * cols + c);
		while (!queue.isEmpty()) {
			int cur = queue.poll();
			int row = cur / cols;
			int col = cur % cols;
            //已经标记过就结束，这句很关键，不然会把一些节点重复加入
            if(grid[row][col] == '2'){
				continue;
			}
			grid[row][col] = '2';
            //将上下左右连通的 1 加入队列
			if (row != (rows - 1) && grid[row + 1][col] == '1') {
				queue.offer((row + 1) * cols + col);
			}
			if (col != (cols - 1) && grid[row][col + 1] == '1') {
				queue.offer(row * cols + col + 1);
			}
			if (row != 0 && grid[row - 1][col] == '1') {
				queue.offer((row - 1) * cols + col);
			}
			if (col != 0 && grid[row][col - 1] == '1') {
				queue.offer(row * cols + col - 1);
			}

		}
 }
```

# 解法二 并查集

一开始看到这道题，我其实想到的是并查集，然后想了想感觉有些复杂，复杂度可能会高一些，就换了下思路想到了解法一。逛了一下 `Discuss` 发现也有人用并查集实现了，那这里也再总结下。

并查集在 [130 题](https://leetcode.wang/leetcode-130-Surrounded-Regions.html) 中用过一次，把当时的介绍在粘过来。

看下维基百科对 [并查集](<https://zh.wikipedia.org/wiki/%E5%B9%B6%E6%9F%A5%E9%9B%86>) 的定义。

> 在[计算机科学](https://zh.wikipedia.org/wiki/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6)中，**并查集**是一种树型的[数据结构](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)，用于处理一些[不交集](https://zh.wikipedia.org/wiki/%E4%B8%8D%E4%BA%A4%E9%9B%86)（Disjoint Sets）的合并及查询问题。有一个**联合-查找算法**（**union-find algorithm**）定义了两个用于此数据结构的操作：
>
> - Find：确定元素属于哪一个子集。它可以被用来确定两个元素是否属于同一子集。
> - Union：将两个子集合并成同一个集合。
>
> 由于支持这两种操作，一个不相交集也常被称为联合-查找数据结构（union-find data structure）或合并-查找集合（merge-find set）。其他的重要方法，MakeSet，用于创建单元素集合。有了这些方法，许多经典的[划分问题](https://zh.wikipedia.org/w/index.php?title=%E5%88%92%E5%88%86%E9%97%AE%E9%A2%98&action=edit&redlink=1)可以被解决。
>
> 为了更加精确的定义这些方法，需要定义如何表示集合。一种常用的策略是为每个集合选定一个固定的元素，称为代表，以表示整个集合。接着，Find(x) 返回 x 所属集合的代表，而 Union 使用两个集合的代表作为参数。

网上很多讲并查集的文章了，这里推荐 [一篇](<https://blog.csdn.net/liujian20150808/article/details/50848646>)，大家可以先去看一下。

知道了并查集，下边就很好解决了，因为你会发现，我们做的就是分类的问题，把相邻的 `1` 都分成一类。

首先我们把每个节点各作为一类，用它的行数和列数生成一个 `id` 标识该类。

```java
int node(int i, int j) {
    return i * cols + j;
}
```

用 `nums` 来记录当前有多少个岛屿，初始化的时候每个 `1` 都认为是一个岛屿，然后开始合并。

遍历每个为 `1 ` 的节点，将它的右边和下边的 `1` 和当前节点合并（这里算作一个优化，不需要像解法一那样上下左右）。每进行一次合并，我们就将 `nums` 减 `1` 。

最后返回 `nums` 即可。

```java
class UnionFind {
    int[] parents;
    int nums;

    public UnionFind(char[][] grid, int rows, int cols) {
        nums = 0;
        // 记录 1 的个数
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1') {
                    nums++;
                }
            }
        }
		
        //每一个类初始化为它本身
        int totalNodes = rows * cols;
        parents = new int[totalNodes];
        for (int i = 0; i < totalNodes; i++) {
            parents[i] = i;
        }
    }

    void union(int node1, int node2) {
        int root1 = find(node1);
        int root2 = find(node2);
        //发生合并，nums--
        if (root1 != root2) {
            parents[root2] = root1;
            nums--;
        }
    }

    int find(int node) {
        while (parents[node] != node) {
            parents[node] = parents[parents[node]];
            node = parents[node];
        }
        return node;
    }

    int getNums() {
        return nums;
    }
}

int rows;
int cols;

public int numIslands(char[][] grid) {
    if (grid.length == 0)
        return 0;
    
    rows = grid.length;
    cols = grid[0].length;
    UnionFind uf = new UnionFind(grid, rows, cols);

    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            if (grid[row][col] == '1') {
                // 将下边右边的 1 节点和当前节点合并
                if (row != (rows - 1) && grid[row + 1][col] == '1') {
                    uf.union(node(row, col), node(row + 1, col));
                }
                if (col != (cols - 1) && grid[row][col + 1] == '1') {
                    uf.union(node(row, col), node(row, col + 1));
                }
            }
        }
    }
    return uf.getNums();

}

int node(int i, int j) {
    return i * cols + j;
}
```

# 总

解法一标记的思想前边的题目也遇到过好多次了，解法二的话算作一个通用的解法，当发现题目是分类相关的，可以考虑并查集。