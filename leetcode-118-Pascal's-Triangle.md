# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/118.jpg)

其实就是杨辉三角，当前元素等于上一层的两个元素的和。

# 解法一 

用两层循环，注意一下我们下标是从 0 开始还是从 1 开始，然后就可以写出来了。

```java
public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> ans = new ArrayList<>();
    for (int i = 0; i < numRows; i++) {
        List<Integer> sub = new ArrayList<>();
        for (int j = 0; j <= i; j++) {
            if (j == 0 || j == i) {
                sub.add(1);
            } else {
                List<Integer> last = ans.get(i - 1);
                sub.add(last.get(j - 1) + last.get(j));
            }

        }
        ans.add(sub);
    }
    return ans;
}
```

# 总

好像有一段时间没有碰到简单题了，哈哈。