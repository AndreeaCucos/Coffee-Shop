import socket
import os
import threading
import json
import gzip
 
# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)


def clients(client):
	cerere = ''
	linieDeStart = ''
	while True:
		buf = client.recv(1024)
		if len(buf) < 1:
			break
		cerere = cerere + buf.decode()
		print( 'S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
		pozitie = cerere.find('\r\n')
		
		if(pozitie > -1 and linieDeStart == ''):
			linieDeStart = cerere[0:pozitie]
			print( 'S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
			break
	print('S-a terminat cititrea.')
	if linieDeStart == '':
		client.close()
		print( 'S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')

	
	# TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
	pieces = linieDeStart.split()
	resource = pieces[1]
	print('Resursa ceruta este: ' + resource)
	if resource == '/':
		resource = '/index.html'
	resource = resource.replace('/', '\\')
	if 'GET' in linieDeStart:
		
		if 'xml' in resource:
			fileName = os.path.abspath(__file__) + '\\..\\..\\resurse' + resource
		elif 'utilizatori.json' in resource:
			fileName = os.path.abspath(__file__) + '\\..\\..\\resurse' + resource
		elif '.js' in resource and '.json' not in resource and 'script' not in resource:
			fileName = os.path.abspath(__file__) + '\\..\\..\\continut' + resource
		else:
			fileName = os.path.abspath(__file__) + '\\..\\..\\continut' + resource
		
		print('Fiserul cerut este: ' + fileName)
		fisier = None
		try:
			# deschide fisierul pentru citire in mod binar
			fisier = open(fileName,'rb')
			# tip media
			extensie = fileName[fileName.rfind('.')+1:]
			tipuriMedia = {
				'html': 'text/html; charset=utf-8',
				'css': 'text/css; charset=utf-',
				'js': 'text/javascript; charset=utf-8',
				'png': 'image/png',
				'jpg': 'image/jpeg',
				'jpeg': 'image/jpeg',
				'gif': 'image/gif',
				'ico': 'image/x-icon',
				'xml': 'application/xml; charset=utf-8',
				'json': 'application/json; charset=utf-8'
			}
			tipMedia = tipuriMedia.get(extensie,'text/plain; charset=utf-8')
 
			# citeste din fisier si trimite la server
			buf = fisier.read(1024)
			content = buf
			while (buf):
				buf = fisier.read(1024)
				content += buf
			gzipContent = gzip.compress(content)

			client.sendall('HTTP/1.1 200 OK\r\n'.encode('utf8'))
			client.sendall(('Content-Length: ' + str(len(gzipContent)) + '\r\n').encode('utf8'))
			client.sendall(('Content-Type:' + tipMedia +'\r\n').encode('utf8'))
			client.sendall(('Content-Encoding: gzip' + '\r\n').encode("utf-8"))
			client.sendall('Server: My PW Server\r\n'.encode('utf8'))
			client.sendall('\r\n'.encode('utf8'))
			client.send(gzipContent)


		except IOError:
			# daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
			msg = 'Eroare! Resursa ceruta ' + resource + ' nu a putut fi gasita!'
			print( msg)
			client.sendall('HTTP/1.1 404 Not Found\r\n')
			client.sendall('Content-Length: ' + str(len(msg.encode('utf-8'))) + '\r\n')
			client.sendall('Content-Type: text/plain; charset=utf-8\r\n')
			client.sendall('Server: My PW Server\r\n')
			client.sendall('\r\n')
			client.sendall(msg)
 
		finally:
			if fisier is not None:
				fisier.close()
		client.close()
		print('S-a terminat comunicarea cu clientul.')
	elif 'POST' in linieDeStart:
		print('Cererea este:' + cerere)
		lines = cerere.split('\n')
		line = lines[len(lines)-1]
		info = line.split('&')
		print(info)
		name_vector = info[0].split('=')
		name = name_vector[1]
		password = info[1].strip('password=')
		print('Name = ' + name)
		print('Password = ' + password)
		user = {'utilizator': name, 'parola': password}
		listObj = []
		fileName = os.path.abspath(__file__) + '\\..\\..\\resurse\\utilizatori.json'
		with open(fileName) as fp:
			listObj = json.load(fp)
		print(listObj)
		listObj.append(user)
		print(listObj)
		with open(fileName, 'w') as json_file:
			json.dump(listObj, json_file, indent=4, separators=(',', ':'))


while True:
	print('#########################################################################')
	print('Serverul asculta potentiali clienti.')
	# asteapta conectarea unui client la server
	# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
	(clientsocket, address) = serversocket.accept()
	print('S-a conectat un client.') 
	# se proceseaza cererea si se citeste prima linie de text
	threading.Thread(target=clients, args=(clientsocket,)).start()
serversocket.close()
	