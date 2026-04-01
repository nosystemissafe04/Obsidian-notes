### python - JIT & PYPY 
python JIT [just in time compiler ] which is used for optimization of python code which can execute the code much faster than the native interpreter . python is both compiled and interpreted language means the python code is first compiled into bytecode by a python compiler 

comment 
single line comment = #
multiline comment = """ comment """
**variable ,types , print and input **

**variables**

variables are used to store data during execution 
in other programming languages like c and c++ or java they are statically typed languages means you have to declare the variable prior to initializing something in that variable and while declaring you have to specify what type of data will be stored in this variable . so these programming languages are called statically typed languages , python is dynamically typed language means you dont have to specify anything before . it will decide its type when you initialize anything on that variable so this is called dymically typed language 

**rule for variables**
variable name rule = alphabets , digits , underscore 
var name should not start with a digit or any special char 
var name are case sensitive 
keywords cannot be used as variable name 

dynamically typed languages like python and javascript 
does not give memory to a variable if you dont use it or dont initialize anything in that variable 
for example if you just type 
x
it will give you nameerror bcz it is not initialized with any value or something and we are not using it 

if you use a function like type() it will tell you the type of the data that a specific variable holds 
x = 33
type(x )
it will print 
class int . 
**datatype is always a class in python** 
in other programming languages like c , c++ or java , int , char , double these are keywords but in python int , char , str, complex number these are classes in python 

double is not a data type in python 
char is also not therei in python 

inpython the data is stored in heap memory and the referece or address is stored in a variable which resides on stack 
the data which is stored in heap is called object and it is dymically assigned under heap and that object contains a address aka id as per python docs 
and if we reassign some other value to the same variable . new block will be created in heap area and that raference will be stored in the same variable so the value that is there before becomes garbage block means it no variable is refereing that memory block 
. there is a garbage collector in python which releases those memory block to whom no variable are refereing and it free up some memory space 
and this is known as autometic memory management 
we can also say that every variable in python is a pointer to c language . 

