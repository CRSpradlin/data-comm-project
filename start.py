import sys
import pyshark
import csv
import json

packets = {};
packets = json.loads(packets)
with open('csv_capture.csv') as fh:
    rd=csv.DictReader(fh, delimiter=',')
    count = 0
    for row in rd:
        packets.append(json.dumps(row))
        count = count + 1 

print(packets)

sys.stdout.flush()