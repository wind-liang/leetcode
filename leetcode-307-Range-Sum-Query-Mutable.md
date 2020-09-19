# 题目描述（中等难度）

307、Range Sum Query - Mutable

Given an integer array *nums*, find the sum of the elements between indices *i* and *j* (*i* ≤ *j*), inclusive.

The *update(i, val)* function modifies *nums* by updating the element at index *i* to *val*.

**Example:**

```
Given nums = [1, 3, 5]

sumRange(0, 2) -> 9
update(1, 2)
sumRange(0, 2) -> 8
```

 

**Constraints:**

- The array is only modifiable by the *update* function.
- You may assume the number of calls to *update* and *sumRange* function is distributed evenly.
- `0 <= i <= j <= nums.length - 1`

实现一个数据结构，支持数组的区间查询，更新数组的某个元素。

  # 解法一

先来个暴力的看看对题意理解的对不对。不用技巧，`sumRange`  直接 `for` 循环算，`update` 直接更。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  this.nums = [...nums];
};

/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  this.nums[i] = val;
};

/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
  let sum = 0;
  for (let k = i; k <= j; k++) {
    sum += this.nums[k];
  }
  return sum;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */
```

时间复杂度： `update` 是 `O(1)`，`sumRange` 是 `O(n)`。

# 解法二

[303 题](https://leetcode.wang/leetcode-303-Range-Sum-Query-Immutable.html) 做过 `sumRange` 的优化，这里直接使用，可以过去看一下。提前把一些前缀和存起来，然后查询区间和的时候在可以通过差实现。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  this.nums = [...nums];
  this.numsAccumulate = [0];
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    this.numsAccumulate.push(sum);
  }
};

/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  let sub = val - this.nums[i];
  this.nums[i] = val;
  for (let k = i + 1; k < this.numsAccumulate.length; k++) {
    this.numsAccumulate[k] += sub;
  }
};

/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
  return this.numsAccumulate[j + 1] - this.numsAccumulate[i];
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */
```

时间复杂度： `update` 是 `O(n)`，`sumRange` 是 `O(1)`。

虽然 `sumRange` 的时间复杂度优化了，但是 `update` 又变成了 `O(n)`。因为更新一个值的时候，这个值后边的累计和都需要更新。

分享 [这里](https://leetcode.com/problems/range-sum-query-mutable/discuss/75741/Segment-Tree-Binary-Indexed-Tree-and-the-simple-way-using-buffer-to-accelerate-in-C%2B%2B-all-quite-efficient) 的一个优化思路。通过一个 `buffer` ，`update` 进行延迟更新。

当更新某个值的时候，我们不立刻进行更新，而是仅仅将当前下标以及要更新的值与原来的值的差值存起来，可以用一个 `map` 作为 `buffer` ，`map[index]=sub`。

当求 `sumRange` 的时候，返回区间和之前，我们需要遍历我们的 `buffer` ，看一下区间内是否包含了 `buffer` 中存储的下标，然后进行相应的更新。

`buffer` 的大小可以根据实际情况去定，这里取 `300`。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  this.buffer = {};
  this.bufferSize = 0;
  this.nums = [...nums];
  this.numsAccumulate = [0];
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    this.numsAccumulate.push(sum);
  }
};

/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  let sub = val - this.nums[i];
  this.buffer[i] = sub;
  this.bufferSize++;
  if (this.bufferSize > 300) {
    for (i in this.buffer) {
      let index = Number(i);
      sub = this.buffer[i];
      this.nums[index] += sub;
      for (let k = index + 1; k < this.numsAccumulate.length; k++) {
        this.numsAccumulate[k] += sub;
      }
    }
    this.buffer = {};
    this.bufferSize = 0;
  }
};

/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
  let sum = this.numsAccumulate[j + 1] - this.numsAccumulate[i];
  for (let index in this.buffer) {
    sub = this.buffer[index];
    if (index >= i && index <= j) {
      sum += sub;
    }
  }
  return sum;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */

```

# 解法三

解法一和解法二写了不少，但时间复杂度两个方法始终一个是 `O(1)`，一个是 `O(n)`。这里再分享 [官方题解](https://leetcode.com/problems/range-sum-query-mutable/solution/) 提供的一个解法，可以优化查询区间的时间复杂度。

我们可以将原数据分成若干个组，然后提前计算这些组的和，举个例子。

```javascript
组号:    0         1            2              3
数组: [2 4 5 6] [9 9 3 8] [1  2  3   4]  [4    2  3   4]
下标:  0 1 2 3   4 5 6 7   8  9  10  11   12  13  14  15
和:      17        29          10              13
```

如果我们要计算 `sumRange(1,13)`，之前我们需要循环累加下标 `1` 到 `13` 的数字的和。

现在我们只需要循环累加 `1` 到 `3` 的和，加上循环累加 `12` 到 `13` 的和，再累加中间组提前算好的和，也就是第 `1` 组和第 `2` 组的和 `29` 和 `10` ，就是最终的结果了。

至于更新的话，我们也不需要像解法二那样更新那么多。我们只需要更新当前元素所在的组即可。

下一个问题，每组的大小定多少呢？

如果定的小了，那么组数就会特别多。

如果定的大了，那么组内元素就会特别多。

组数和组内元素个数都会影响到 `sumRange` 的时间复杂度。

这里，我们在组数和组内元素个数之间取个平衡，假设数组大小是 `n`，那么组内元素个数取 $$\sqrt{n}$$ ，这样的话组数也是  $$\sqrt{n}$$ ，这样就可以保证我们查询的时间复杂度是  $$O(\sqrt{n})$$ 了。因为最坏的情况，无非是查询范围跨越整个数组，中间我们需要累加 $$\sqrt{n} - 2$$ 个组，第 `0` 组最多累加 $$\sqrt{n}$$  次，最后一组也最多累加 $$\sqrt{n}$$  次，整体上就是   $$O(\sqrt{n})$$ 了。

结合代码理解一下。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  this.nums = [...nums];
  this.groupSize = Math.floor(Math.sqrt(this.nums.length));
  this.group = [];
  let sum = 0;
  let i = 0;
  for (i = 0; i < nums.length; i++) {
    sum += nums[i];
    if ((i + 1) % this.groupSize === 0) {
      this.group.push(sum);
      sum = 0;
    }
  }
  //有可能数组大小不能整除组的大小, 最后会遗漏下几个元素
  if (i % this.groupSize !== 0) {
    this.group.push(sum);
  }
};

/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  let sub = val - this.nums[i];
  let groudId = Math.floor(i / this.groupSize);
  this.group[groudId] += sub;
  this.nums[i] = val;
};

/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
  let groupI = Math.floor(i / this.groupSize);
  let groupJ = Math.floor(j / this.groupSize);
  let sum = 0;
  //在同一组内, 直接累加
  if (groupI === groupJ) {
    for (let k = i; k <= j; k++) {
      sum += this.nums[k];
    }
  } else {
    //左边组的元素累加
    for (let k = i; k < (groupI + 1) * this.groupSize; k++) {
      sum += this.nums[k];
    }
    //累加中间所有的组
    for (let g = groupI + 1; g < groupJ; g++) {
      sum += this.group[g];
    }
    //右边组的元素累加
    for (let k = groupJ * this.groupSize; k <= j; k++) {
      sum += this.nums[k];
    }
  }
  return sum;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */
```

时间复杂度： `update` 是 `O(1)`，`sumRange` 是  $$O(\sqrt{n})$$  。

# 解法四

这个解法需要我们事先知道「线段树」这个数据结构，[84 题](https://leetcode.wang/leetCode-84-Largest-Rectangle-in-Histogram.htm) 也用过线段树。

线段树常用于区间统计问题，求区间和、区间最大值、最小值等，可以使得查询以及更新的时间复杂度都为 `O(log(n))`。

[84 题](https://leetcode.wang/leetCode-84-Largest-Rectangle-in-Histogram.htm) 我们底层是通过数组来存储的线段树，省空间，但写起来需要多思考一下下标之间的关系，相对复杂一些。这里我们通过在每个节点中加入左子树和右子树的指针来实现线段树的节点间的关系。

如果会写二叉树，其实线段树是同样的写法，唯一不同的地方在于二叉树只是存储当前节点的值。线段树的话需要存储当前区间的左右端点，对于这道题还要把当前区间的和存起来。明确了这一点，线段树的初始化就很好写了。

首先我们定义一个 `node` 节点。

```javascript
class TreeNode {
  constructor() {
    this.leftChild = null;
    this.rightChild = null;
    this.leftIndex = 0;
    this.rightIndex = 0;
    this.sum = 0;
  }
}
```

然后通过递归的方式去建立线段树。

```javascript
class SegmentTree {
  constructor(nums) {
    this.root = this.buildTree(nums, 0, nums.length - 1);
  }
  buildTree(nums, start, end) {
    let root = new TreeNode();
    root.leftIndex = start;
    root.rightIndex = end;
    if (start === end) {
      root.sum = nums[start];
      return root;
    }
    const mid = Math.floor((start + end) / 2);
    root.leftChild = this.buildTree(nums, start, mid);
    root.rightChild = this.buildTree(nums, mid + 1, end);
    root.sum = root.leftChild.sum + root.rightChild.sum;
    return root;
  }
}
```

和建立二叉树不同的点在于，赋的值比较多，左端点，右端点，`sum` 值还需要在左右子树建立完毕才去赋值。

左右子树的话我们每次从中间分隔区间，参考下图，橙色表示区间，蓝色当前当前区间和。

![](https://windliang.oss-cn-beijing.aliyuncs.com/306_1.jpg)

如果我们要查区间 `[i,j]` 的和，分为两大类情况。

* 如果当前节点的的左端点 `leftIndex` 等于 `i`，右端点 `rightIndex` 等于 `j` ，那么当前节点就是我们要找的，直接返回当前节点的 `sum` 值即可。
* 将区间的中点记做 `mid`。分为三种情况。
  * 查询区间在 `mid` 的左边，也就是 `j` 小于等于 `mid` ，此时我们只需要从左子树去查询区间 `[i,j]`的和即可。
  * 查询区间在 `mid` 的右边，也就是 `i` 大于 `mid`，此时我们只需要从右子树去查询区间 `[i, j]` 的和即可。
  * 否则的话，整个区间包含了 `mid`，也就是 `i <= mid < j`，此时我们需要从左子树查询区间 `[i, mid]` 的和再加上从右子树查询区间 `[mid + 1, j]` 的和。

举个例子，我们要查询 `[1,4]` 的和。参考上边的图，根节点的范围是 `[0, 5]`，`mid` 就是 `(0 + 5) / 2 = 2`。要查询的区间包含了 `mid` ，下一步我们从左子树查询 `[1, 2]`，从右子树查询 `[3, 4]`。然后接下来把左子树和右子树当做根节点继续查询即可。

代码的话就很好写了。

```javascript
NumArray.prototype.sumRangeHelper = function (node, i, j) {
    const leftIndex = node.leftIndex;
    const rightIndex = node.rightIndex;
    if (leftIndex === i && rightIndex === j) {
        return node.sum;
    }
    const mid = Math.floor((leftIndex + rightIndex) / 2);
    let sum = 0;
    if (j <= mid) {
        sum = this.sumRangeHelper(node.leftChild, i, j);
    } else if (i > mid) {
        sum = this.sumRangeHelper(node.rightChild, i, j);
    } else {
        sum =
            this.sumRangeHelper(node.leftChild, i, mid) +
            this.sumRangeHelper(node.rightChild, mid + 1, j);
    }
    return sum;
};
```

接下来考虑单点更新。

同样的我们可以通过递归来求解，只需要判断要更新的位置是在左子树还是右子树，然后更新相应的子树，最后更新当前根节点的值即可。参考下边的代码。

```javascript
NumArray.prototype.updateHelper = function (node, i, val) {
  const leftIndex = node.leftIndex;
  const rightIndex = node.rightIndex;
  //当前节点只包含一个值，更新的一定是这个值
  if (leftIndex === rightIndex) {
    node.sum = val;
    return;
  }
  const mid = Math.floor((leftIndex + rightIndex) / 2);
  if (i <= mid) {
    this.updateHelper(node.leftChild, i, val);
  } else {
    this.updateHelper(node.rightChild, i, val);
  }
  node.sum = node.leftChild.sum + node.rightChild.sum;
};
```

然后把上边所有的代码综合在一起即可。

```javascript
class TreeNode {
  constructor() {
    this.leftChild = null;
    this.rightChild = null;
    this.leftIndex = 0;
    this.rightIndex = 0;
    this.sum = 0;
  }
}
class SegmentTree {
  constructor(nums) {
    this.root = this.buildTree(nums, 0, nums.length - 1);
  }
  buildTree(nums, start, end) {
    let root = new TreeNode();
    root.leftIndex = start;
    root.rightIndex = end;
    if (start === end) {
      root.sum = nums[start];
      return root;
    }
    const mid = Math.floor((start + end) / 2);
    root.leftChild = this.buildTree(nums, start, mid);
    root.rightChild = this.buildTree(nums, mid + 1, end);
    root.sum = root.leftChild.sum + root.rightChild.sum;
    return root;
  }
}
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  if (nums.length === 0) {
    return;
  }
  this.tree = new SegmentTree(nums);
};

/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  this.updateHelper(this.tree.root, i, val);
};

NumArray.prototype.updateHelper = function (node, i, val) {
  const leftIndex = node.leftIndex;
  const rightIndex = node.rightIndex;
  if (leftIndex === rightIndex) {
    node.sum = val;
    return;
  }
  const mid = Math.floor((leftIndex + rightIndex) / 2);
  if (i <= mid) {
    this.updateHelper(node.leftChild, i, val);
  } else {
    this.updateHelper(node.rightChild, i, val);
  }
  node.sum = node.leftChild.sum + node.rightChild.sum;
};
/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
  const sum = this.sumRangeHelper(this.tree.root, i, j);
  return sum;
};

NumArray.prototype.sumRangeHelper = function (node, i, j) {
  const leftIndex = node.leftIndex;
  const rightIndex = node.rightIndex;
  if (leftIndex === i && rightIndex === j) {
    return node.sum;
  }
  const mid = Math.floor((leftIndex + rightIndex) / 2);
  let sum = 0;
  if (j <= mid) {
    sum = this.sumRangeHelper(node.leftChild, i, j);
  } else if (i > mid) {
    sum = this.sumRangeHelper(node.rightChild, i, j);
  } else {
    sum =
      this.sumRangeHelper(node.leftChild, i, mid) +
      this.sumRangeHelper(node.rightChild, mid + 1, j);
  }
  return sum;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */

```

# 解法五

这个解法写法很简单，但理解的话可能稍微难一些。我甚至去看了提出这个解法的 [论文](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.14.8917&rep=rep1&type=pdf)。这个解法叫 `Fenwick tree` 或者`binary indexed tree`，翻译过来的话叫做树状数组或者二叉索引树，但我觉得 `binary` 翻译成二进制更好，叫做二进制索引树更贴切些，二叉树容易引起误解。

回想一下解法三，我们预先求出了若干个区间和，然后查询的区间可以根据之前预先求出来的区间来求出。这里的话同样的思想，先预先求一些区间和，然后把要求的区间分解成若干个之前求好的区间和即可。相比于解法三，这里的分解会更加巧妙一些。

我们知道计算机中的数都是由二进制来表示的，任何一个数都可以分解成 `2` 的幂次的和，进制转换不熟的话可以参考 [再谈进制转换](https://zhuanlan.zhihu.com/p/114542440)。

举个例子 $$11 = 2^0 + 2^1 + 2^3 = 1 + 2 + 8$$，$$9=2^0+2^3=1+8$$ 等等。

接下来就是神奇的地方了，每一个数都可以拆成这样的 `x = a + b + c + ...` 的形式。

我们把等式左侧的数 `x` 看做是区间 `[1, x]`，等式右边看做从 `x` 开始每个区间的**长度**，也就变成了下边的样子。

`[1, x] = [x, x - a + 1] + [x - a, x - a - b + 1] + [x - a - b, x - a - b - c + 1] + ...`。

看起来有些复杂，举个具体的例子就简单多了。

以  $$11 = 2^0 + 2^1 + 2^3 = 1 + 2 + 8$$ 为例，可以转换为下边的等式。

`[1, 11] = [11, 11] + [10, 9] + [8, 1]`。

`[11, 11] `、`[10, 9]`、`[8, 1]` 长度分别是 `1`、`2`、`8`。

我们成功把一个大区间，分成了若干个小区间，这就是树状数组最核心的地方了，只要理解了上边讲的，下边就很简单了。

首先，因为数组的下标是从 `0`  开始的，上边的区间范围是从 `1` 开始的，所以我们在原数组开头补一个 `0` ，这样区间就是从 `1` 开始了。

因此我们可以通过分解快速的求出 `[1, x]` 任意前缀区间的和，知道了前缀区间的和，就回到了解法二，通过做差可以算出任意区间的和了。

最后，我们需要解决子区间该怎么求？

`[1, 11] = [11, 11] + [10, 9] + [8, 1]` 我们用 `V` 表示子区间，用 `F` 表示某个区间。

`F[1,11] = V[11] + V[10] + V[8]`

其中，`V[11] = F[11,11], V[10] = F[10,9], V[8]=F[8...1]`，为什么是这样？

回到二进制，`F[0001,1011] = V[1011] + V[1010] + V[1000]`

`1010 = 1011 - 0001`，`0001` 就是十进制的 `1`，所以 `V[1011]` 存 `1` 个数，所以 `V[11] = F[11,11]`。

`1000 = 1010 - 0010`，`0010` 就是十进制的 `2`，所以 `V[1010]` 存 `2` 个数，所以 ` V[10] = F[10,9]`。

`0000 = 1000 - 1000`，`1000` 就是十进制的 `8`，所以 `V[1000]` 存 `8` 个数，所以 ` V[8] = F[8...1]`。

 `V[1011]` 存 `1` 个数， `V[1010]` 存 `2` 个数，看的是二进制最右边的一个 `1` 到末尾的大小。`1010` 就是 `10`，`1000` 就是 `1000` 。

怎么得到一个数最右边的 `1` 到末尾的大小，是二进制操作的一个技巧，会用到一些补码的知识，可以参考 [趣谈计算机补码](https://zhuanlan.zhihu.com/p/67227136)。

将原数取反，然后再加 `1` 得到的新数和原数按位相与就得到了最右边的 `1` 到末尾的数。

举个例子，对于 `101000` ，先取反得到 `010111`，再加 `1` 变成 `011000`，再和原数相与，`101000 & 011000`，刚好就得到了 `1000`。而取反再加一，根据补码的知识，可以通过取相反数得到。

所以对于 `i` 的话，`i & -i` 就得到了最右边的 `1` 到末尾的数，也就是 `V[i]` 这个区间存多少个数。

如果 `len = i & -i` ，那么 `V[i] = F[i,i-1,i-2, ... i-len+1]`。

参考下边的代码，`BIT` 就是我们上边要求的 `V` 数组。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
    this.nums = [0, ...nums]; //补一个 0
    this.BIT = new Array(this.nums.length);
    for (let i = 1; i < this.BIT.length; i++) {
        let index = i - ( i & -i ) + 1;
        this.BIT[i] = 0;
        //累加 index 到 i 的和
        while (true) {
            this.BIT[i] += this.nums[index];
            index += 1;
            if (index > i) {
                break;
            }
        }
    }
};
```

有了 `BIT` 这个数组，一切就都好说了。如果我们想求 `F[1, 11]` 也就是前 `11` 个数的和。

`F[1,11] = BIT[11] + BIT[10] + BIT[8]`，看下二进制 `BIT[0001,1011] = BIT[1011] + BIT[1010] + BIT[1000]` 。

`1011 -> 1010 -> 1000`，对于  `BIT` 每次的下标就是依次把当前数最右边的 `1 ` 变成 `0` 。

这里有两种做法，一种是我们求出当前数最右边的 `1` 到末尾的数，然后用原数减一下。

举个例子， `1010` 最右边的 `1` 到末尾的数是 `10` ，然后用 `1010 - 10` 就得到 `1000` 了。

另外一种做法，就是 `n & (n - 1)`，比如 `1010 & (1010 - 1)`，刚好就是 `1000` 了。

知道了这个，我们可以实现一个函数，用来求区间 `[1, n]` 的和。

```javascript
NumArray.prototype.range = function (index) {
  let sum = 0;
  while (index > 0) {
    sum += this.BIT[index];
    index -= index & -index;
    //index = index & (index - 1); //这样也可以
  }
  return sum;
};
```

有了 `range` 函数，题目中的 `sumRange` 也就很好实现了。

```javascript
NumArray.prototype.sumRange = function (i, j) {
    //range 求的区间范围下标是从 1 开始的,所以这里的 j 需要加 1
    return this.range(j + 1) - this.range(i);
};
```

接下来是更新函数怎么写。

更新函数的话，最关键的就是找出，当我们更新的数组第 `i` 个值，会影响到我们的哪些子区间，也就是代码中的 `BIT` 数组需要更新哪些。

我们来回忆下之前做了什么事情。

![](https://windliang.oss-cn-beijing.aliyuncs.com/306_2.jpg)

这是论文中的一张图，含义就是我们之前分析的，`BIT[8]` 存的是 `F[1...8]` ，对应图中的就是从第 `8` 个位置到第 `1 ` 个位置的矩形。`BIT[6]` 存的是 `F[6,5]`， 对应图中的就是从第 `6` 个位置一直到第 `5 ` 个位置的矩形。

然后我们水平从某个数画一条线，比如从 `3` 那里画一条线。

![](https://windliang.oss-cn-beijing.aliyuncs.com/306_3.jpg)

穿过了 `3` 对应的矩形，`4` 对应的矩形，`8` 对应的矩形。因此如果改变第 `3` 个数，`BIT[3]`，`BIT[4]` 以及 `BIT[8]` 就需要更新。通过这种方式我们把每个数会影响到哪个区间画出来，找一下规律。

![](https://windliang.oss-cn-beijing.aliyuncs.com/306_4.jpg)

当改变了第 `5` 个元素的时候，会依次影响到 `BIT[5]`，`BIT[6]`，`BIT[8]`，`BIT[16]`。

`00101 -> 00110 -> 01000 -> 10000`。

`00101 + 1 = 00110`。

` 00110 + 10 = 01000`

` 01000 + 1000 = 10000`

可以看到每次都是加上当前数最右边的 `1` 到末尾的数，即 `next = current + (current & -current)`。

所以更新的代码也就出来了。

```javascript
/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  i += 1;//对应的下标要进行加 1
  const sub = val - this.nums[i];
  this.nums[i] = val;
  while (i < this.nums.length) {
    this.BIT[i] += sub;
    i += i & -i;
  }
};
```

综上，这道题就解决了，我们把代码合在一起。

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  this.nums = [0, ...nums];
  this.BIT = new Array(this.nums.length);
  for (let i = 1; i < this.BIT.length; i++) {
    let index = i - ( i & -i ) + 1;
    this.BIT[i] = 0;
    while (true) {
      this.BIT[i] += this.nums[index];
      index += 1;
      if (index > i) {
        break;
      }
    }
  }
};

/**
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (i, val) {
  i += 1;
  const sub = val - this.nums[i];
  this.nums[i] = val;
  while (i < this.nums.length) {
    this.BIT[i] += sub;
    i += i & -i;
  }
};
/**
 * @param {number} i
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function (i, j) {
  return this.range(j + 1) - this.range(i);
};

NumArray.prototype.range = function (index) {
  let sum = 0;
  while (index > 0) {
    sum += this.BIT[index];
    // index -= index & -index;
    index = index & (index - 1); //这样也可以
  }
  return sum;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */
```

时间复杂度的话，初始化、更新、查询其实都和二进制的位数有关，以查询为例。每次将二进制的最后一位变成 `0`，最坏的情况就是初始值是全 `1`，即 `1111` 这种，执行次数就是 `4` 次，也就是二进制的位数。

如果是 `n` ，那么位数大约就是 `log(n)`，可以结合 [再谈进制转换](https://zhuanlan.zhihu.com/p/114542440) 理解。把一个数展开为 `2` 的幂次和，位数其实就是最高位的幂次加 `1`。比如 $$11 = 2^0 + 2^1 + 2^3$$ ，最高幂次是 `3` ，所以 `11` 的二进制`(1011)` 位数就是 `4`。如果要求的数是 `n`，最高的次幂是 `x` ，$$2^x + ... = n$$，近似一下 $$2^x=n$$，`x = log(n)`，位数就是 `log(n) + 1`。

所以 `update` 和 `sumRange` 的时间复杂度就是 `O(log(n))`。

对于初始化函数，因为要执行 `n` 次，所以就是 `O(nlog(n))`。当然我们也可以利用解法二，把前缀和都求出来，然后更新数组 `BIT` 的每个值，这样就是 `O(n)` 了。但不是很有必要，因为如果查询和更新的次数很多，远大于 `n` 次，那么初始化这里的时间复杂度也就无关紧要了。

# 总

看起来比较简单的一道题，涉及的东西还蛮多的。

解法二的通过缓存的方法一定程度优化了算法。

解法三的思想比较常用，将区间分成若干个子区间，然后通过子区间求解。

解法四的线段树属于通用的解法，除了求区间和，求区间最大值、最小值也是试用的。

解法五理解起来难一些，也不容易想到，但确实非常巧妙，代码相对线段树也会简单很多，不得不佩服作者。

