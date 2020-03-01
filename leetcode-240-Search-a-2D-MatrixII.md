# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/240.jpg)

矩阵的每行从左到右是升序， 每列从上到下也是升序，在矩阵中查找某个数。

# 解法一

看到有序，第一反应就是二分查找。最直接的做法，一行一行的进行二分查找即可。

此外，结合有序的性质，一些情况可以提前结束。

比如某一行的第一个元素大于了 `target` ，当前行和后边的所有行都不用考虑了，直接返回 `false`。

某一行的最后一个元素小于了 `target` ，当前行就不用考虑了，换下一行。

```java
public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }
    for (int i = 0; i < matrix.length; i++) {
        if (matrix[i][0] > target) {
            break;
        }
        if(matrix[i][matrix[i].length - 1] < target){
            continue;
        } 
        int col = binarySearch(matrix[i], target);
        if (col != -1) {
            return true;
        }
    }
    return false;
}

//二分查找
private int binarySearch(int[] nums, int target) {
    int start = 0;
    int end = nums.length - 1;
    while (start <= end) {
        int mid = (start + end) >>> 1;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return -1;
}
```

时间复杂度的话，如果是 `m` 行 `n` 列，就是 `O(mlog(n))`。

# 解法二

参考 [这里](https://leetcode.com/problems/search-a-2d-matrix-ii/discuss/66140/My-concise-O(m%2Bn)-Java-solution)，需要很敏锐的观察力了。

数组从左到右和从上到下都是升序的，如果从右上角出发开始遍历呢？

会发现每次都是向左数字会变小，向下数字会变大，有点和二分查找树相似。二分查找树的话，是向左数字变小，向右数字变大。

所以我们可以把 `target` 和当前值比较。

* 如果 `target` 的值大于当前值，那么就向下走。
* 如果 `target` 的值小于当前值，那么就向左走。
* 如果相等的话，直接返回 `true` 。

也可以换个角度思考。

如果 `target` 的值小于当前值，也就意味着当前值所在的列肯定不会存在 `target` 了，可以把当前列去掉，从新的右上角的值开始遍历。

同理，如果 `target` 的值大于当前值，也就意味着当前值所在的行肯定不会存在 `target` 了，可以把当前行去掉，从新的右上角的值开始遍历。

看下边的例子。

```java
[1,   4,  7, 11, 15],
[2,   5,  8, 12, 19],
[3,   6,  9, 16, 22],
[10, 13, 14, 17, 24],
[18, 21, 23, 26, 30]

如果 target  = 9，如果我们从 15 开始遍历, cur = 15
    
target < 15, 去掉当前列, cur = 11
[1,   4,  7, 11],
[2,   5,  8, 12],
[3,   6,  9, 16],
[10, 13, 14, 17],
[18, 21, 23, 26]    
    
target < 11, 去掉当前列, cur = 7  
[1,   4,  7],
[2,   5,  8],
[3,   6,  9],
[10, 13, 14],
[18, 21, 23]     

target > 7, 去掉当前行, cur = 8   
[2,   5,  8],
[3,   6,  9],
[10, 13, 14],
[18, 21, 23]       

target > 8, 去掉当前行, cur = 9, 遍历结束    
[3,   6,  9],
[10, 13, 14],
[18, 21, 23]   
```

不管从哪种角度考虑，代码的话都是一样的。

```java
public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }
    int row = 0;
    int col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        if (target > matrix[row][col]) {
            row++;
        } else if (target < matrix[row][col]) {
            col--;
        } else {
            return true;
        }
    }
    return false;
}
```

时间复杂度就是每个节点最多遍历一遍了，`O(m + n)`。

# 总

看到有序数组第一反应就是二分了，也就是解法一。解法二的话，从右上角开始遍历的想法很妙。