def hash_fun(string, hash_size):
    sum_val = 0
    for char in string:
        sum_val += ord(char)
    return sum_val % hash_size

def main():
    string = input("Enter a string: ")
    hash_size = int(input("Enter the hash size: "))
    hash_value = hash_fun(string, hash_size)
    print(f"The hash value of '{string}' is: {hash_value}")

if __name__ == "__main__":
    main()