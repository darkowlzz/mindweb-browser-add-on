#!/usr/bin/env python

import socket
import json
import sys
import ast

CONST_APPNAME = 'brain-web'

# generated using sha1-online.com with string as 'brain-web'
CONST_APPKEY = 'c40975447149c129bb8e269efc5427620acfc82b'

authString = {'appName': CONST_APPNAME, 'appKey': CONST_APPKEY}

auth = json.dumps(authString)

print 'Authorization json object:' , auth

try:
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
except socket.error:
  print 'Failed to create socket'
  sys.exit()

print 'Socket Created'

HOST= '127.0.0.1'
PORT = 13854

s.connect((HOST, PORT))

print 'Socket connected to', HOST , 'at port', PORT

try:
  s.sendall(auth)
except socket.error:
  print 'Send failed'
  sys.exit()

print 'Authorization message sent'

while True:
  reply = s.recv(4096)
  reply = reply.split('\r')
  for i in reply:
    try:
      e = ast.literal_eval(i)
      if (e['eegPower'] and e['eSense']):
        print 'eegPower:', e['eegPower']
        print 'poorSignalLevel:', e['poorSignalLevel']
        print 'eSense:', e['eSense']
    except:
      pass
      #print 'dirty string'
