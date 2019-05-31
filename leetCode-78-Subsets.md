# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/78.jpg)

给一个数组，输出这个数组的所有子数组。

# 解法一 迭代一

和 [77 题](<https://leetcode.windliang.cc/leetCode-77-Combinations.html>)解法三一个思想，想找出数组长度 1 的所有解，然后再在长度为 1 的所有解上加 1 个数字变成长度为 2 的所有解，同样的直到 n。

假如 nums = [ 1, 2, 3 ]，参照下图。

![](https://windliang.oss-cn-beijing.aliyuncs.com/78_2.jpg)

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<List<Integer>>();
    List<List<Integer>> ans = new ArrayList<List<Integer>>();
    ans.add(new ArrayList<Integer>());
    res.add(new ArrayList<Integer>());
    int n = nums.length;
    // 第一层循环，子数组长度从 1 到 n
    for (int i = 1; i <= n; i++) {
        // 第二层循环，遍历上次的所有结果
        List<List<Integer>> tmp = new ArrayList<List<Integer>>();
        for (List<Integer> list : res) {
            // 第三次循环，对每个结果进行扩展
            for (int m = 0; m < n; m++) {
                //只添加比末尾数字大的数字，防止重复
                if (list.size() > 0 && list.get(list.size() - 1) >= nums[m])
                    continue;
                List<Integer> newList = new ArrayList<Integer>(list);
                newList.add(nums[m]);
                tmp.add(newList);
                ans.add(newList);
            }
        }
        res = tmp;
    }
    return ans;
}

```

# 解法二 迭代法2

参照[这里](<https://leetcode.com/problems/subsets/discuss/27278/C%2B%2B-RecursiveIterativeBit-Manipulation>)。解法一的迭代法，是直接从结果上进行分类，将子数组的长度分为长度是 1 的，2 的 .... n 的。我们还可以从条件上入手，先只考虑给定数组的 1 个元素的所有子数组，然后再考虑数组的 2 个元素的所有子数组 ... 最后再考虑数组的 n 个元素的所有子数组。求 k 个元素的所有子数组，只需要在 k - 1 个元素的所有子数组里边加上 nums [ k ] 即可。

例如 nums [1 , 2, 3] 的遍历过程。

![](https://windliang.oss-cn-beijing.aliyuncs.com/78_3.jpg)

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    ans.add(new ArrayList<>());//初始化空数组
    for(int i = 0;i<nums.length;i++){
        List<List<Integer>> ans_tmp = new ArrayList<>();
        //遍历之前的所有结果
        for(List<Integer> list : ans){
            List<Integer> tmp = new ArrayList<>(list);
            tmp.add(nums[i]); //加入新增数字
            ans_tmp.add(tmp);
        }
        ans.addAll(ans_tmp);
    }
    return ans;
}
```

# 解法三 回溯法

参考[这里](<https://leetcode.com/problems/subsets/discuss/27278/C%2B%2B-RecursiveIterativeBit-Manipulation>)。同样是很经典的回溯法例子，添加一个数，递归，删除之前的数，下次循环。

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    getAns(nums, 0, new ArrayList<>(), ans);
    return ans;
}

private void getAns(int[] nums, int start, ArrayList<Integer> temp, List<List<Integer>> ans) { 
    ans.add(new ArrayList<>(temp));
    for (int i = start; i < nums.length; i++) {
        temp.add(nums[i]);
        getAns(nums, i + 1, temp, ans);
        temp.remove(temp.size() - 1);
    }
}
```

# 解法四 位操作

前方高能！！！！这个方法真的是太太太牛了。参考[这里](<https://leetcode.com/problems/subsets/discuss/27288/My-solution-using-bit-manipulation>)。

数组的每个元素，可以有两个状态，**在**子数组中和**不在**子数组中，所有状态的组合就是所有子数组了。

例如，nums = [ 1, 2 , 3 ]。1 代表在，0 代表不在。

```java
1 2 3
0 0 0 -> [     ]
0 0 1 -> [    3]
0 1 0 -> [  2  ]   
0 1 1 -> [  2 3]  
1 0 0 -> [1    ]
1 0 1 -> [1   3] 
1 1 0 -> [1 2  ]
1 1 1 -> [1 2 3]
```

所以我们只需要遍历 0 0 0 到 1 1 1，也就是 0 到 7，然后判断每个比特位是否是 1，是 1 的话将对应数字加入即可。如果数组长度是 n，那么每个比特位是 2 个状态，所有总共就是 2 的 n 次方个子数组。遍历 00 ... 0 到 11 ... 1 即可。

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    int bit_nums = nums.length;
    int ans_nums = 1 << bit_nums; //执行 2 的 n 次方
    for (int i = 0; i < ans_nums; i++) {
        List<Integer> tmp = new ArrayList<>();
        int count = 0; //记录当前对应数组的哪一位
        int i_copy = i; //用来移位
        while (i_copy != 0) { 
            if ((i_copy & 1) == 1) { //判断当前位是否是 1
                tmp.add(nums[count]);
            }
            count++;
            i_copy = i_copy >> 1;//右移一位
        }
        ans.add(tmp);

    }
    return ans;
}
```

# 总

同样是很经典的一道题，回溯，迭代，最后的位操作真的是太强了，每次遇到关于位操作的解法就很惊叹。



