import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# ==========================================
# SUPABASE DATABASE INITIALIZATION
# ==========================================
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
print("🔌 Connected to Supabase Database!")

# ==========================================
# IBM CLOUD CONFIGURATION
# ==========================================
API_KEY = os.getenv("IBM_API_KEY")
API_URL = os.getenv("IBM_API_URL")

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

def get_ibm_token():
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": API_KEY}
    response = requests.post(url, headers=headers, data=data)
    return response.json().get("access_token")

# --- SCHEMA ---
class NetworkLog(BaseModel):
    source_ip: str
    destination_ip: str
    packet_size: int
    protocol: str
    src_bytes: int
    dst_bytes: int
    raw_data: list[str] # <--- ADD THIS

# 2. Add your old parsing function
def translate_packet(raw_row):
    processed_packet = []
    for item in raw_row[:41]:
        clean_item = str(item).strip()
        try:
            processed_packet.append(float(clean_item))
        except ValueError:
            processed_packet.append(TRANSLATOR.get(clean_item, 0.0))
            
    # Safety net: ensure it's exactly 41 features long
    while len(processed_packet) < 41:
        processed_packet.append(0.0)
        
    return processed_packet

@app.post("/predict")
async def run_prediction(log: NetworkLog):
    print(f"\n📥 Received log from QStash for IP: {log.source_ip}")
    
    # 3. USE the function to format the full 41 features!
    math_packet = translate_packet(log.raw_data)
    
    # STEP 2: Authenticate & Call IBM Cloud
    try:
        token = get_ibm_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {"input_data": [{"values": [math_packet]}]}
        
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()
        
        # Extract prediction based on your old app.py logic
        prediction = result['predictions'][0]['values'][0][0]
        is_intrusion = bool(prediction != 1) # 1 was "ALLOWED" in your old code
        
        if is_intrusion:
            print(f"🚨 ALARM: Intrusion Detected from IP {log.source_ip}")
        else:
            print(f"✅ Normal Traffic from IP {log.source_ip}")

        # STEP 3: Save to Supabase
        # STEP 3: Save to Supabase
        supabase.table('network_intrusions').insert({
            "source_ip": log.source_ip,
            "destination_ip": log.destination_ip,
            "packet_size": log.packet_size,
            "protocol": log.protocol,
            "src_bytes": log.src_bytes,       # <-- NEW
            "dst_bytes": log.dst_bytes,       # <-- NEW
            "raw_data": log.raw_data,         # <-- NEW (Supabase handles the JSONB conversion)
            "is_intrusion": is_intrusion
        }).execute()
        print("💾 Successfully saved log to Supabase!")
        
        return {"status": "processed"}
        
    except Exception as e:
        print(f"❌ IBM Cloud or Database Error: {str(e)}")
        # Return 200 so QStash doesn't get stuck in a retry loop if IBM goes down
        return {"status": "error", "message": str(e)}