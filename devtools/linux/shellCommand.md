# shell基本命令

-----

参考刘忆智《Linux从入门到精通》
太基础的略过，可以加上一些特殊的实用技巧。

-----

#### 通配符

`*`匹配文件名中任意长度的字符。
> $ ls
> main.c main.cpp main1.c main1.cpp
> 
> $ ls *.cpp
> main.cpp main1.cpp
	
`?`只匹配一个字符。`main?`匹配main开头后跟一个字符的文件。
> $ ls
> main1 main2 main345
> 
> $ ls main?
> main1 main2 
	
`[]`匹配所有出现在方括号内的字符。可以加`-`表示范围。
> $ ls 
> text1 text2 text3 text4 textA textB 
> 
> $ ls text[1A]
> text1 textA
> 
> $ ls text[1-3]
> text1 text2 text3

----
#### ls的可选参数    -F    -l    -a
可选参数可以一起使用，只需要一个短线，如 `-aF`

文件默认颜色： `目录为蓝色`,`可执行文件为绿色`，`链接为淡蓝色`。

- `-F`会在每个目录后面加上`/`，在可执行文件后面加上`*`，在链接后面加上`@`。
- `-a`显示所有文件，含隐藏文件。
- `-l`查看文件的各种属性。

----

#### 查看文件优先用less 
- `-M`选项可以在底部显示文件的信息。
- 空格向下翻页，按键B向上翻页，可以用上下左右键移动。
- `/`跟查找内容来查找。继续查找`/`回车。

-----------
#### 查找文件内容用 grep

在文件FILE1(和FILE2)中查找有PATTERN的行。
> $ grep *PATTERN*  FILE1 [FILE2]
