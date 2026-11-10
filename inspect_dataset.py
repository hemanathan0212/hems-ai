import pandas as pd

# Load dataset
df = pd.read_csv(r"C:\Users\vasan\OneDrive\Documents\Desktop\HEM'S AI\dataset\fertilizer.csv")

# Clean column names
df.columns = df.columns.str.strip()

print("\nFIRST 5 RECORDS")
print(df.head())

print("\nDATASET SHAPE")
print(df.shape)

print("\nCOLUMN NAMES")
print(df.columns.tolist())

print("\nDATASET INFORMATION")
df.info()

print("\nMISSING VALUES")
print(df.isnull().sum())

print("\nDUPLICATE RECORDS")
print(df.duplicated().sum())

print("\nUNIQUE RECORDS")
print(df.drop_duplicates().shape)

print("\nFERTILIZER DISTRIBUTION")
print(df["Fertilizer Name"].value_counts())

print("\nSOIL TYPE DISTRIBUTION")
print(df["Soil Type"].value_counts())

print("\nCROP TYPE DISTRIBUTION")
print(df["Crop Type"].value_counts())