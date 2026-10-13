import pandas as pd
import os

data_dir = r"C:\Users\swapn\code\Top2PercentScientists\August 2026 data-update for Updated science-wide a"
output_dir = r"C:\Users\swapn\code\Top2PercentScientists\public\data"

os.makedirs(output_dir, exist_ok=True)

print("Converting single-year data...")
singleyr = pd.read_excel(
    os.path.join(data_dir, "Table_1_Authors_singleyr_2025_pubs_since_1788_wopp_extracted_202608.xlsx"),
    sheet_name="Data"
)
print(f"  Rows: {len(singleyr)}, Cols: {len(singleyr.columns)}")
print(f"  Columns: {list(singleyr.columns)}")
singleyr.to_csv(os.path.join(output_dir, "singleyr.csv"), index=False)
print("  Saved to singleyr.csv")

print("Converting career data...")
career = pd.read_excel(
    os.path.join(data_dir, "Table_1_Authors_career_2025_pubs_since_1788_wopp_extracted_202608.xlsx"),
    sheet_name="Data"
)
print(f"  Rows: {len(career)}, Cols: {len(career.columns)}")
career.to_csv(os.path.join(output_dir, "career.csv"), index=False)
print("  Saved to career.csv")

print("Converting field thresholds...")
field_thresholds = pd.read_excel(
    os.path.join(data_dir, "Table_2_field_subfield_thresholds_singleyr_2025_pubs_since_1788_wopp_extracted_202608.xlsx"),
    sheet_name="Field"
)
field_thresholds.to_csv(os.path.join(output_dir, "field-thresholds.csv"), index=False)
print(f"  Saved field thresholds ({len(field_thresholds)} rows)")

print("Converting subfield thresholds...")
subfield_thresholds = pd.read_excel(
    os.path.join(data_dir, "Table_2_field_subfield_thresholds_singleyr_2025_pubs_since_1788_wopp_extracted_202608.xlsx"),
    sheet_name="SubField"
)
subfield_thresholds.to_csv(os.path.join(output_dir, "subfield-thresholds.csv"), index=False)
print(f"  Saved subfield thresholds ({len(subfield_thresholds)} rows)")

print("\nAll conversions complete!")