from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import csv
import time
import os
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
# Enable CORS so React can securely talk to this API
CORS(app) 

# --- YOUR CONFIGURATION ---
API_KEY = os.getenv("IBM_API_KEY")
API_URL = os.getenv("IBM_API_URL")
DATA_FILE = 'NIDS_test_ds.csv' 

# Your exact translator dictionary
TRANSLATOR = {
    'icmp': 0.0, 'tcp': 1.0, 'udp': 2.0, 'IRC': 0.0, 'X11': 1.0, 'Z39_50': 2.0, 
    'auth': 3.0, 'bgp': 4.0, 'courier': 5.0, 'csnet_ns': 6.0, 'ctf': 7.0, 
    'daytime': 8.0, 'discard': 9.0, 'domain': 10.0, 'domain_u': 11.0, 'echo': 12.0, 
    'eco_i': 13.0, 'ecr_i': 14.0, 'efs': 15.0, 'exec': 16.0, 'finger': 17.0, 
    'ftp': 18.0, 'ftp_data': 19.0, 'gopher': 20.0, 'hostnames': 21.0, 'http': 22.0, 
    'http_443': 23.0, 'http_8001': 24.0, 'imap4': 25.0, 'iso_tsap': 26.0, 
    'klogin': 27.0, 'kshell': 28.0, 'ldap': 29.0, 'link': 30.0, 'login': 31.0, 
    'mtp': 32.0, 'name': 33.0, 'netbios_dgm': 34.0, 'netbios_ns': 35.0, 
    'netbios_ssn': 36.0, 'netstat': 37.0, 'nnsp': 38.0, 'nntp': 39.0, 'ntp_u': 40.0, 
    'other': 41.0, 'pm_dump': 42.0, 'pop_2': 43.0, 'pop_3': 44.0, 'printer': 45.0, 
    'private': 46.0, 'red_i': 47.0, 'remote_job': 48.0, 'rje': 49.0, 'shell': 50.0, 
    'smtp': 51.0, 'sql_net': 52.0, 'ssh': 53.0, 'sunrpc': 54.0, 'supdup': 55.0, 
    'systat': 56.0, 'telnet': 57.0, 'tim_i': 58.0, 'time': 59.0, 'urh_i': 60.0, 
    'urp_i': 61.0, 'uucp': 62.0, 'uucp_path': 63.0, 'vmnet': 64.0, 'whois': 65.0, 
    'OTH': 0.0, 'REJ': 1.0, 'RSTO': 2.0, 'RSTOS0': 3.0, 'RSTR': 4.0, 'S0': 5.0, 
    'S1': 6.0, 'S2': 7.0, 'S3': 8.0, 'SF': 9.0, 'SH': 10.0
}

# Keep track of which row in the CSV we are currently reading
current_row_index = 1 

def get_token():
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": API_KEY}
    response = requests.post(url, headers=headers, data=data)
    return response.json().get("access_token")

def translate_packet(raw_row):
    processed_packet = []
    for item in raw_row[:41]:
        clean_item = item.strip()
        try:
            processed_packet.append(float(clean_item))
        except ValueError:
            processed_packet.append(TRANSLATOR.get(clean_item, 0.0))
    return processed_packet

# --- THE API ENDPOINT ---
# React will ping this URL every 2 seconds to get the next packet!
# Add these global counters near the top of app.py
total_scanned_counter = 0
active_threats_counter = 0

@app.route('/api/scan-next', methods=['GET'])
def scan_next_packet():
    global current_row_index, total_scanned_counter, active_threats_counter
    token = get_token()
    
    if not token:
        return jsonify({"error": "Failed to authenticate with IBM Cloud"}), 500

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    try:
        with open(DATA_FILE, 'r') as file:
            reader = list(csv.reader(file))
            if current_row_index >= len(reader):
                current_row_index = 1 
                
            row = reader[current_row_index]
            current_row_index += 1
            
            math_packet = translate_packet(row)
            payload = {"input_data": [{"values": [math_packet]}]}
            
            response = requests.post(API_URL, headers=headers, json=payload)
            result = response.json()
            
            prediction = result['predictions'][0]['values'][0][0]
            confidence_array = result['predictions'][0]['values'][0][1]
            
            status = "ALLOWED" if prediction == 1 else "BLOCKED"
            certainty = confidence_array[1] * 100 if prediction == 1 else confidence_array[0] * 100
            
            # Increment global metrics
            total_scanned_counter += 1
            if status == "BLOCKED":
                active_threats_counter += 1
            
            # Send everything back to React in one single package
            return jsonify({
                "packet_id": current_row_index - 1,
                "protocol": row[1].upper(),
                "status": status,
                "confidence": certainty,
                "timestamp": time.strftime("%H:%M:%S"),
                "metrics": {
                    "total_scanned": total_scanned_counter,
                    "active_threats": active_threats_counter,
                    "model_accuracy": 98.4 # Can be calculated dynamically if you cross-reference with ground truth targets
                }
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- THE UPLOAD ENDPOINT ---
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Tell Python we want to modify these global variables
    global current_row_index, DATA_FILE, total_scanned_counter, active_threats_counter
    
    # 1. Check if the request actually contains a file
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    
    # 2. Check if the user selected an empty file
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    # 3. If the file is valid and is a CSV, save it!
    if file and file.filename.endswith('.csv'):
        # Save it to the backend folder as 'uploaded_data.csv'
        filepath = os.path.join(os.getcwd(), 'uploaded_data.csv')
        file.save(filepath)
        
        # 4. Point our radar to the NEW file!
        DATA_FILE = 'uploaded_data.csv'
        
        # 5. Reset all our counters back to zero for the new scan
        current_row_index = 1
        total_scanned_counter = 0
        active_threats_counter = 0
        
        return jsonify({"message": "File successfully uploaded! Radar reset and scanning new file."}), 200
    else:
        return jsonify({"error": "Invalid file type. Please upload a .csv file."}), 400

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(port=5000, debug=True)