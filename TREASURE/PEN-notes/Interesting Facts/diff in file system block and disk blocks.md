**Understanding Disk Usage and Block Sizes in Linux**

**Scenario:**

You have a file with the text `"haiderali is here and i will hack stuff"`. Initially, you thought it was 37 bytes, but `wc`, `hexdump`, and `cat -A` revealed it is actually 39 bytes due to a newline character at the end.

**Checking File Size with** `wc`**:**

sh

```
wc -c haiderali.txt
```

This command showed the file size as 39 bytes, including the newline character.

**Reading the File with a C Program:**

You used the following C program to read the file:

c

```
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main()
{
    int fd = open("haiderali.txt", O_RDONLY);
    char buffer[265];
    ssize_t buf = read(fd, buffer, sizeof(buffer) - 1);
    buffer[buf] = '\0';
    printf("\n%ld\n", buf);
    printf("%s\n", buffer);
    close(fd);
}
```

- **open()**: Opens the file `haiderali.txt`.
    
- **read()**: Reads up to 264 bytes into `buffer`, storing the number of bytes read into `buf`.
    
- **buf**: Shows the number of bytes read, which is 39.
    
- **buffer**: Contains the file content.
    

**Hex Dump Analysis:**

You used `hexdump` to confirm the content:

```
00000000  68 61 69 64 65 72 61 6c  69 20 69 73 20 68 65 72  |haiderali is her|
00000010  65 20 61 6e 64 20 69 20  77 69 6c 6c 20 68 61 63  |e and i will hac|
00000020  6b 20 73 74 75 66 66 0a                           |k stuff.|
00000028
```

The newline character (`0a`) at the end of the file makes the total 39 bytes.

**Using** `cat -A`**:**

You used `cat -A` to display non-printing characters:

sh

```
cat -A haiderali.txt
```

This showed:

```
haiderali is here and i will hack stuff$
```

The `$` indicates the newline character at the end.

**Key Takeaway:** The file contains 39 bytes of data, including a newline character at the end. This highlights the importance of checking for hidden characters in files when investigating file sizes.

Feel free to add this to your notes! 📘

now use all the privious talks and make me a note where i used all the tools like stat wc du and where over investigation moved forwarded

Absolutely! Here’s a detailed note summarizing our entire investigation process, incorporating all the tools we used:

**Understanding Disk Usage and Block Sizes in Linux**

**Scenario:**

You have a file with the text `"haiderali is here and i will hack stuff"`. Initially, you thought it was 37 bytes, but `wc`, `hexdump`, and `cat -A` revealed it is actually 39 bytes due to a newline character at the end.

### Tools and Steps Used in the Investigation:

1. **Counting Characters:**
    
    - Expected: 37 characters
        
    - Actual: 39 bytes (found using `wc`)
        
2. **Checking File Size with** `wc`**:**
    
    sh
    
    ```
    wc -c haiderali.txt
    ```
    
    - This command showed the file size as 39 bytes, confirming more data than initially expected.
        
3. **Reading the File with a C Program:**
    
    c
    
    ```
    #include <stdio.h>
    #include <fcntl.h>
    #include <unistd.h>
    
    int main()
    {
        int fd = open("haiderali.txt", O_RDONLY);
        char buffer[265];
        ssize_t buf = read(fd, buffer, sizeof(buffer) - 1);
        buffer[buf] = '\0';
        printf("\n%ld\n", buf);
        printf("%s\n", buffer);
        close(fd);
    }
    ```
    
    - This program read the file and printed the number of bytes read (`39`) and the content.
        
4. **Using** `stat` **to Check Detailed File Metadata:**
    
    sh
    
    ```
    stat haiderali.txt
    ```
    
    - This command provided detailed file metadata, showing the file size and block allocation. Output example:
        
        ```
        File: haiderali.txt
        Size: 39          Blocks: 8          IO Block: 4096   regular file
        ```
        
5. **Using** `du` **to Check Disk Usage:**
    
    sh
    
    ```
    du -h haiderali.txt
    ```
    
    - This command showed the disk usage as 40 bytes, due to file system block allocation.
        
6. **Hex Dump Analysis:**
    
    sh
    
    ```
    hexdump -C haiderali.txt
    ```
    
    - This command revealed the exact byte values:
        
        ```
        00000000  68 61 69 64 65 72 61 6c  69 20 69 73 20 68 65 72  |haiderali is her|
        00000010  65 20 61 6e 64 20 69 20  77 69 6c 6c 20 68 61 63  |e and i will hac|
        00000020  6b 20 73 74 75 66 66 0a                           |k stuff.|
        00000028
        ```
        
    - The `0a` at the end confirmed the newline character.
        
7. **Using** `cat -A` **to Display Non-Printing Characters:**
    
    sh
    
    ```
    cat -A haiderali.txt
    ```
    
    - This showed the content with a `$` at the end, indicating the newline character:
        
        ```
        haiderali is here and i will hack stuff$
        ```
        

### Key Takeaway:

Even though the visible content seemed to be 37 bytes, hidden characters (like newlines) made the actual data size 39 bytes. This highlights the importance of checking for hidden characters in files when investigating file sizes.

**Conclusion:**

The file contains 39 bytes of data, including a newline character at the end. The discrepancy in reported sizes (40 bytes) from `du` and `stat` is due to file system block allocation. This scenario underscores the nuances of disk usage and file storage in Linux.