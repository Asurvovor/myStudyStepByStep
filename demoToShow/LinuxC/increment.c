#include <stdio.h>
int increment(int x) {
	x = x + 1;
	return x;
}

int main(int argc, char const *argv[])
{
	int i = 2, j = 4;
	i = increment(i);
	j = increment(j);
	printf("i=%d, j=%d\n", i, j);
	return 0;
}


