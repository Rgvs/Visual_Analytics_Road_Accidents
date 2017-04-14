fp = open("FARS.csv","r")

data1 = fp.read().split()
data = []
for d in data1:
	data.append(d.split(","))
u = {i:{} for i in range(18)}
for d in data[1:]:
	for i,x in enumerate(d):
		try:
			u[i][x] += 1
		except:
			u[i][x] = 1
i = 0

print "attr\tnumber of different values"
for k,v in u.items():
	print data[0][k] + "\t"+ str(len(v)) + "\n"
	if len(v) <60: 
		for l,x in v.items():
			print l,x
	print "\n****************\n"
