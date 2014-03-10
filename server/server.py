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
  sjs = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
except socket.error:
  print 'Failed to create socket'
  sys.exit()

print 'Socket Created'

HOST= '127.0.0.1'
PORT = 13854
jsPORT = 8124

s.connect((HOST, PORT))
sjs.connect((HOST, jsPORT))

print 'Socket connected to', HOST , 'at port', PORT, 'and', jsPORT

try:
  s.sendall(auth)
except socket.error:
  print 'Send failed'
  sys.exit()

print 'Authorization message sent'

while True:
  reply = s.recv(4096)
  reply = reply.split('\r')
  print 'new one ========////======='
  for i in reply:
    try:
      print i
      e = ast.literal_eval(i)
      sjs.sendall(str(e));
      #if not e['rawEeg']:
      '''
        if (e['blinkStrength']):
          #print 'blinkStrength:', e['blinkStrength']
          sjs.sendall('blink message')
        if (e['eegPower'] and e['eSense']):
          #print 'eegPower:', e['eegPower']
          #print 'poorSignalLevel:', e['poorSignalLevel']
          #print 'eSense:', e['eSense']
          sjs.sendall('message1')
          sjs.sendall('message2')
      '''
      '''
        if (e['blinkStrength']):
          print 'blink:', e['blinkStrength']
      '''
    except:
      pass
      #print 'dirty string'
