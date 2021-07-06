# 题目描述（中等难度）

![](https://windliang.oss-cn-beijing.aliyuncs.com/187.jpg)

一个 `DNA` 序列，从任意位置开始的连续 `10` 个字母当做一组，将重复的组输出。

# 解法一

先来个暴力的方法，双层循环，选取一组然后和后边的所有组进行比较，如果发现重复的组就把它加入到结果中。为了防止加入重复的结果，我们用 `set` 进行存储。

```java
public List<String> findRepeatedDnaSequences(String s) {
    int len = s.length();
    Set<String> res = new HashSet<>();
    for (int i = 0; i <= len - 10; i++) {
        for (int j = i + 1; j <= len - 10; j++) {
            if (s.substring(i, i + 10).equals(s.substring(j, j + 10))) {
                res.add(s.substring(i, i + 10));
                break;
            }
        }
    }
    return new ArrayList<>(res);
}
```

意料之中，超时了。

![](https://windliang.oss-cn-beijing.aliyuncs.com/187_2.jpg)

由于每一组都遍历了两次，所以造成了时间的浪费。我们可以利用一个 `HashSet` ，每遍历一组就将其放入，在加入之前判断 `HashSet` 中是否存在，如果存在就说明和之前的发生重复，就把它加到结果中。从而我们可以减少一层循环。

```java
public List<String> findRepeatedDnaSequences(String s) {
    int len = s.length();
    Set<String> res = new HashSet<>();
    Set<String> set = new HashSet<>();
    for (int i = 0; i <= len - 10; i++) {
        String key = s.substring(i, i + 10);
         //之前是否存在
        if (set.contains(key)) {
            res.add(key);
        } else {
            set.add(key);
        }

    }
    return new ArrayList<>(res);
}

```

# 解法二

正常情况下到解法一就可以结束了，然后在 `Discuss` 中逛了一下，其实上边的算法还有优化的地方，下边分享一下，参考了 [这里](https://leetcode.com/problems/repeated-dna-sequences/discuss/53867/Clean-Java-solution-(hashmap-%2B-bits-manipulation))。

通过这句代码 `String key = s.substring(i, i + 10);`，我们每次截取字符串作为 `key` 然后存放到 `HashSet` 中。

```java
对于 Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"。
当 i 等于 0 的时候，key = AAAAACCCCC
当 i 等于 1 的时候，key =  AAAACCCCCA
当 i 等于 2 的时候，key =   AAACCCCCAA
```

我们会发现，递增过程中，每次的字符串相对于之前都是少一个字母，多一个字母，而剩下的 `9` 个字母是没有变化的。

但是我们的代码中，并没有考虑之前已经得到的字符串，每次都是一股脑的重新从 `i` 取到 `i+9`，`String key = s.substring(i, i + 10);`。那么怎么利用之前的信息呢？

把字符串编码为数字序列，然后通过移位保留之前的信息，具体的看下边的介绍。

我们把字母映射到二进制位， `A -> 00, C -> 01, G -> 10, T -> 11`，我们可以用一个 `HashMap` 去存这些对应关系，但因为我们只需要从存 `4` 个值，我们可以直接用一个 `char` 数组完成字母到数字的映射。

```java
//因为有 26 个字母，然后我们减去'A'以后，不管字母是什么，下标最大也就是 25
char map[] = new char[26];
map['A' - 'A'] = 0; //二进制 00
map['C' - 'A'] = 1; //二进制 01
map['G' - 'A'] = 2; //二进制 10
map['T' - 'A'] = 3; //二进制 11
```

有了这个对应关系我们就可以把字符串映射为二进制序列。

```java
对于 Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"。
就可以看做是 0000000000010101010100000000000010101010100000000000101010111111
当 i 等于 0 的时候，key = AAAAACCCCC
当 i 等于 1 的时候，key =  AAAACCCCCA
当 i 等于 2 的时候，key =    AAACCCCCAA

就可以看做是
当 i 等于 0 的时候，key = 00000000000101010101
当 i 等于 1 的时候，key =   00000000010101010100
当 i 等于 2 的时候，key =     00000001010101010000
```

`i = 0` 时候的 `key` 只需要左移两位，把最高位两位去掉，低位腾出两位，然后加上新加入的字母 `A`，也就是 `00`，就到了 `i = 1` 时候的 `key`。

此外，如果我们的 `key` 用 `int` 存储，一般情况下是 `32` 位的，但我们是 `10` 个字母，每个字母对应两位，所以我们只需要 `20` 位，我们需要把 `key` 和 `11111111111111111111(0xfffff)` 进行按位与，只保留低 `20` 位，所以更新 `key` 的话需要三个步骤，左移两位 -> 加上当前的字母 -> 按位与操作。

```java
key <<= 2;
key |= map[array[i] - 'A'];
key &= 0xfffff;
```

代码的话，除了求 `key` 的地方不同，整个框架和解法一也是一样的。

```java
public List<String> findRepeatedDnaSequences(String s) {
		int len = s.length();
		if (len == 0 || len < 10) {
			return new ArrayList<>();
		}
		Set<String> res = new HashSet<>();
		Set<Integer> set = new HashSet<>();
		char map[] = new char[26];
		map['A' - 'A'] = 0;
		map['C' - 'A'] = 1;
		map['G' - 'A'] = 2;
		map['T' - 'A'] = 3;
		int key = 0;
		char[] array = s.toCharArray();
        //第一组单独初始化出来
		for (int i = 0; i < 10; i++) {
			key = key << 2 | map[array[i] - 'A'];
		}
		set.add(key);
		for (int i = 10; i < len; i++) {
			key <<= 2;
			key |= map[array[i] - 'A'];
			key &= 0xfffff;
			if (set.contains(key)) {
				res.add(s.substring(i - 9, i + 1));
			} else {
				set.add(key);
			}

		}
		return new ArrayList<>(res);
	}
```

至于求 `key` 的话，我们单独用了一个 `map` 进行了映射，那么能不能不用 `map` 呢？可以的，参考 [这里](https://leetcode.com/problems/repeated-dna-sequences/discuss/53877/I-did-it-in-10-lines-of-C%2B%2B)。

我们知道每个字母本质上就是一个数字，至于对应关系就是 ASCII 码值。

```java
A -> 65 1000001
C -> 65 1000011
G -> 65 1000111
T -> 65 1010100
```

所以每个字母天然的就映射到了一个序列，我们并不需要 `map` 人为的转换。此时一个字母映射到了 `7` 个二进制位，但观察上边 `4` 个数字我们其实只用低三位就可以区分这四个字母了。

```java
A -> 001
C -> 011
G -> 111
T -> 100
```

所以对应规则就出来了，相对于之前的改变的地方，此时我们每次需要移 `3`位，并且按位与的话，因为每个字母对应三位，`10` 个字母总共需要 `30` 位，所以我们需要把 `key` 和`111111111111111111111111111111(0x3fffffff)` 也就是 `30` 个 `1` 进行按位与。

至于把字母转为 `key` ，我们只需要把低三位和 `111` 也就是十进制的 `7` 按位与一下即可。

```java
key <<= 3;
key |= (array[i] & 7);
key &= 0x3fffffff;
```

然后其他的地方，和上边通过 `map` 得到 `key` 的解法也没什么区别了。

```java
public List<String> findRepeatedDnaSequences(String s) {
    int len = s.length();
    if (len == 0 || len < 10) {
        return new ArrayList<>();
    }
    Set<String> res = new HashSet<>();
    Set<Integer> set = new HashSet<>();
    int key = 0;
    char[] array = s.toCharArray();
    for (int i = 0; i < 10; i++) {
        key <<= 3;
        key |= (array[i] & 7);
    }
    set.add(key);
    for (int i = 10; i < len; i++) {
        key <<= 3;
        key |= (array[i] & 7);
        key &= 0x3fffffff;
        if (set.contains(key)) {
            res.add(s.substring(i - 9, i + 1));
        } else {
            set.add(key);
        }

    }
    return new ArrayList<>(res);
}
```

# 总

解法一的话是很常规的思路。解法二的话，通过对 `key` 的选取，依次从时间和空间上对解法一进行了轻微的优化，这里需要对二进制有较深的理解。

