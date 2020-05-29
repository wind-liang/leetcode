# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/304.jpg)

给定矩阵的左上角坐标和右下角坐标，返回矩阵内的数字累计的和。

# 解法一

和 [上一道题](https://leetcode.wang/leetcode-303-Range-Sum-Query-Immutable.html) 其实差不多，上一个题是一维空间的累计，这个是二维，没做过上一题，可以先看一下，这里用同样的思路了。

如果我们只看矩阵的某一行，那其实就变成上一题了。所以我们可以提前把每一行各自的累和求出来，然后求整个矩阵的累和的时候，一行一行求即可。

```javascript
/**
 * @param {number[][]} matrix
 */
var NumMatrix = function (matrix) {
    this.rowsAccumulate = [];
    let rows = matrix.length;
    if(rows === 0){
        return;
    }
    let cols = matrix[0].length;
    for (let i = 0; i < rows; i++) {
        let row = [0];
        let sum = 0;
        for (let j = 0; j < cols; j++) {
            sum += matrix[i][j];
            row.push(sum);
        }
        this.rowsAccumulate.push(row);
    }
};

/**
 * @param {number} row1
 * @param {number} col1
 * @param {number} row2
 * @param {number} col2
 * @return {number}
 */
NumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {
    let sum = 0;
    for (let i = row1; i <= row2; i++) {
        sum = sum + this.rowsAccumulate[i][col2 + 1] - this.rowsAccumulate[i][col1];
    }
    return sum;
};

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
```

# 解法二

当然，我们也可以忘记上一道题的解法，重新分析，但思想还是上一题的思想。

我们可以用 `matrixAccumulate[i][j]` 来保存从 `(0, 0)` 到 `(i - 1, j - 1)`  矩阵内所有数累计的和。

`matrixAccumulate[0][*]` 和 `matrixAccumulate[*][0]` 都置为 `0` ，这样做的好处就是为了统一处理边界的情况，看完下边的解法，可以回过头来思考。

然后和上一道题一样，对于 `(row1, col1)` 和  `(row2, col2)` 这两个点组成的矩阵内数字的累计和可以表示为下边的式子。

```javascript
this.matrixAccumulate[row2 + 1][col2 + 1] -
    this.matrixAccumulate[row1][col2 + 1] -
    this.matrixAccumulate[row2 + 1][col1] +
    this.matrixAccumulate[row1][col1]
```

至于为什么这样，可以结合下边的图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/304_1.jpg)

我们要求的是橙色部分的矩阵。只需要用 `(0, 0)` 到 `(row2, col2)` 的矩阵，减去 `(0, 0)` 到 `(row1, col2)` 的矩阵，再减去 `(0, 0)` 到 `(row2, col1)` 的矩阵，最后加上 `(0, 0)` 到 `(row1, col1)` 的矩阵。因为 `(0, 0)` 到 `(row1, col1)` 的矩阵多减了一次。

然后可以看看坐标的分布，就可以得出上边的式子了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/304_2.jpg)

之所以出现，`row2 + 1` 、`co2 + 1 ` 这种坐标，是因为我们的 `matrixAccumulate[i][j]` 来保存从 `(0, 0)` 到 `(i - 1, j - 1)` ，有一个减  `1 ` 的操作。

至于 `matrixAccumulate` 怎么求，我们可以使用上边类似的方法，通过矩阵的加减实现。

![](https://windliang.oss-cn-beijing.aliyuncs.com/304_3.jpg)

`O` 到 `A` 的累加，就等于 `A` 位置的值加上  `O` 的 `C` 的累加，加上 `O` 的 `B` 的累加，减去 `O` 到 `D` 的累加。代码的话，就是下边的样子。

```javascript
this.matrixAccumulate[i][j] =
        matrix[i-1][j-1] +
        this.matrixAccumulate[i - 1][j] +
        this.matrixAccumulate[i][j - 1] -
        this.matrixAccumulate[i - 1][j - 1];
    }
```

总代码就是下边的了。

```javascript
/**
 * @param {number[][]} matrix
 */
var NumMatrix = function (matrix) {
  this.matrixAccumulate = [];
  let rows = matrix.length;
  if (rows === 0) {
    return;
  }
  let cols = matrix[0].length;

  for (let i = 0; i <= rows; i++) {
    let row = [];
    for (let j = 0; j <= cols; j++) {
      row.push(0);
    }
    this.matrixAccumulate.push(row);
  }
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      this.matrixAccumulate[i][j] =
        matrix[i-1][j-1] +
        this.matrixAccumulate[i - 1][j] +
        this.matrixAccumulate[i][j - 1] -
        this.matrixAccumulate[i - 1][j - 1];
    }
  }
};

/**
 * @param {number} row1
 * @param {number} col1
 * @param {number} row2
 * @param {number} col2
 * @return {number}
 */
NumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {
  return (
    this.matrixAccumulate[row2 + 1][col2 + 1] -
    this.matrixAccumulate[row1][col2 + 1] -
    this.matrixAccumulate[row2 + 1][col1] +
    this.matrixAccumulate[row1][col1]
  );
};

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
```

再分享 [StefanPochmann](https://leetcode.com/problems/range-sum-query-2d-immutable/discuss/75381/C%2B%2B-with-helper) 大神的一个思路，上边我们用 `matrixAccumulate[i][j]` 来保存从 `(0, 0)` 到 `(i - 1, j - 1)`  矩阵内所有数累计的和，多了减一。虽然这种思路经常用到，就像字符串截取函数一样，一般都是包括左端点，不包括右端点，但看起来比较绕。

我们可以用 `matrixAccumulate[i][j]` 来保存从 `(0, 0)` 到 `(i, j)`  矩阵内所有数累计的和，这样的话，为了避免单独判断边界情况的麻烦，我们可以封装一个函数，对于下标小于 `0` 的边界情况直接返回 `0` ，参考下边的代码。

```java
/**
 * @param {number[][]} matrix
 */
var NumMatrix = function (matrix) {
  this.matrixAccumulate = matrix;
  let rows = matrix.length;
  if (rows === 0) {
    return;
  }
  let cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      this.matrixAccumulate[i][j] +=
        this.f(i - 1, j) + this.f(i, j - 1) - this.f(i - 1, j - 1);
    }
  }
};

/**
 * @param {number} row1
 * @param {number} col1
 * @param {number} row2
 * @param {number} col2
 * @return {number}
 */
NumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {
  return (
    this.f(row2, col2) -
    this.f(row1 - 1, col2) -
    this.f(row2, col1 - 1) +
    this.f(row1 - 1, col1 - 1)
  );
};

NumMatrix.prototype.f = function (i, j) {
  return i >= 0 && j >= 0 ? this.matrixAccumulate[i][j] : 0;
};

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
```

# 总

比较简单的一道题，基本上还是上一题的思路，想起来小学求矩形面积了，哈哈。解法二的话两种技巧都是处理边界情况的方法，将边界的逻辑和其他部分的逻辑统一了起来，前一种扩充 `0` 的技巧比较常用。
