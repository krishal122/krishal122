def division_hash(key, table_size):
    return key % table_size

# Example Usage
table_size = 11  
key = 54
index = division_hash(key, table_size)
print(f"The index for key {key} is: {index}") 


