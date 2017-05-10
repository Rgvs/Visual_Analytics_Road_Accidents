fp = open("FARS.csv","r")

data1 = fp.read().split()
data = []
for d in data1:
	data.append(d.split(","))
u = {i:set() for i in range(18)}
for d in data[1:]:
	for i,x in enumerate(d):
		u[i].add(x)
i = 0
print "attr\tnumber of different values"
for k,v in u.items():
	print data[0][i] + "\t"+ str(len(v))
	i+=1


