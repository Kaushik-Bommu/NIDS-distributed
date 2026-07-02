import csv
import time
import requests
import os

# This script replaces your old "Upload CSV" feature. 
# It simulates thousands of devices flooding your new API.

API_URL = "http://127.0.0.1:8000/ingest"
CSV_FILE = "NIDS_test_ds.csv" # Ensure this file is in the same folder

# We need to map your CSV columns to the new Pydantic schema
# (Adjust the row indices if your CSV columns are in a different order)
def run_simulation():
    print(f"🔥 Starting Chaos Simulation using {CSV_FILE}...")
    
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: {CSV_FILE} not found!")
        return

    with open(CSV_FILE, 'r') as file:
        reader = csv.reader(file)
        next(reader) # Skip header if you have one
        
        for row in reader:
            try:
                # Map your CSV row to the FastAPI schema
                # E.g., if Protocol is column 1, and Packet Size is column 4
                payload = {
                    "source_ip": "192.168.1." + str(time.time())[-3:], # Mocking random IPs
                    "destination_ip": "10.0.0.5",
                    "packet_size": int(float(row[4])) if row[4] else 500, # Adjust index as needed
                    "protocol": row[1],
                    "src_bytes": int(float(row[2])) if row[2] else 0,
                    "dst_bytes": int(float(row[3])) if row[3] else 0
                }
                
                # Fire the payload at the Ingestion API
                response = requests.post(API_URL, json=payload)
                print(f"🚀 Sent packet: {response.status_code}")
                
                # Speed of the simulation (0.5 = 2 packets per second)
                time.sleep(0.5) 
                
            except Exception as e:
                print(f"⚠️ Skipping bad row: {e}")

if __name__ == "__main__":
    run_simulation()