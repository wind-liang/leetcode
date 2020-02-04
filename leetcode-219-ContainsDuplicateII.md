# 题目描述（简单难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/219.jpg)

判断是否有重复的数字出现，并且两个数字最多相隔 `k`。

# 解法一 暴力

两层循环，判断当前数字后的 `k` 个数字是否有重复数字。

```java
public boolean containsNearbyDuplicate(int[] nums, int k) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = 1; j <= k; j++) {
            if (i + j >= n) {
                break;
            }
            if (nums[i] == nums[i + j]) {
                return true;
            }
        }
    }
    return false;
}
```

# 解法二 map

利用 `hashmap`，`key` 存储值，`value` 存储下标。遍历数组，如果出现重复的值，判断下标的关系。

```java
public boolean containsNearbyDuplicate(int[] nums, int k) {
    HashMap<Integer, Integer> map = new HashMap<>();
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        if (map.containsKey(nums[i])) {
            int index = map.get(nums[i]);
            if (i - index <= k) {
                return true;
            }
        }
        //更新当前值的下标
        map.put(nums[i], i);
    }
    return false;
}
```

# 解法三 set

没想到用 `set` 也能做，参考 [这里](https://leetcode.com/problems/contains-duplicate-ii/discuss/61372/Simple-Java-solution)。

因为下标相差不能超过 `k`，所以我们 `set` 中只存储 `k+1` 个连续的数，超过以后就将 `set` 中的第一个数删除。

```java
public boolean containsNearbyDuplicate(int[] nums, int k) {
    HashSet<Integer> set = new HashSet<>();
    int n = nums.length;
    int i = 0;
    //将 k + 1 个数存入 set
    for (; i <= k && i < n; i++) {
        if (set.contains(nums[i])) {
            return true;
        }
        set.add(nums[i]);
    }
    for (; i < n; i++) {
        //移除 set 中第一个数
        set.remove(nums[i - k - 1]);
        //判断 set 中是否有当前数
        if (set.contains(nums[i])) {
            return true;
        }
        //将当前数加入
        set.add(nums[i]);
    }
    return false;
}
```

当然上边的代码，可以利用 `set.add` 的返回值来简化代码。

如果要加入的数在 `set` 中已经存在，那么 `add` 就会返回 `false`。我们就不需要调用 `set.contains` 了。

```java
public boolean containsNearbyDuplicate(int[] nums, int k) {
    HashSet<Integer> set = new HashSet<>();
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        if (i > k) {
            set.remove(nums[i - k - 1]);
        }
        if (!set.add(nums[i])) {
            return true;
        }
    }
    return false;
}
```

# 总

前两种解法都比较容易想到，解法三通过一个滑动窗口解决问题，很巧妙。

