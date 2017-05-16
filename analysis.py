import csv
from sklearn.cluster import KMeans
import numpy as np
from sklearn.decomposition import PCA
import sklearn.preprocessing as pp
from sklearn.manifold import MDS
from sklearn import metrics
import operator

class Normalize:
	def normalize(self, data):
		X = data[1:]
		#n_data = M_M().fit_transform(X)
		n_data = pp.scale(X)
		return [data[0]] + n_data.tolist()



class Kmeans:
	def clustering(self, data):
		X = np.array(data[1:])
		error = []
		for i in range(1,10,1):
			kmeans = KMeans(n_clusters=i, random_state=0).fit(X)
			error.append([i,round(kmeans.inertia_,2)])
		return error
		
	def stratified_sampling(self, data, k):
		X = np.array(data[1:])
		kmeans = KMeans(n_clusters=k, random_state=0).fit(X)
		s_data = [data[0]]
		k_data = [[] for i in range(k)]
		
		for i,label in enumerate(kmeans.labels_):
			k_data[label].append(i)
		
		for i in range(k):
			sample_index = np.random.choice(k_data[i], int(0.1*len(k_data[i])), replace=False)
			for d in sample_index:
				s_data.append(data[d+1])
			
		return s_data

class Random_sampling:
	def sampling(self, data):
		r_data = [data[0]]
		X = range(1,len(data))
		
		X = np.random.choice(X, int(0.1*len(X)), replace=False)
		for i in X:
			r_data.append(data[i])
		return r_data
		
		

class Dimension_Reduction:
	def pca_reduction(self,data):
		pca = PCA()
		pca.fit(data[1:])
		return pca
		
	def get_top_3_pca_loading_attr(self, pca, attrs):
		loading = {}
		n = len(pca)
		for i,attr in enumerate(attrs):
			loading[attr] = 0
			for p in pca:
				loading[attr] += p[i]*p[i]
		loading = sorted(loading.items(), key=operator.itemgetter(1), reverse= True)
		return loading
		
if __name__ == '__main__':
	
	fp = open("../Project/static/data/FARS4_pclean.csv", "r")
	reader = csv.reader(fp)
	data = []
	
	for row in reader:
		data.append(row)
	original_data = data
	data = Normalize().normalize(data)
	
	kmeans = Kmeans()
	kmeans_error = kmeans.clustering(data)
	
	with open('data/kmeans.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['nc', 'error'])
		for i,v in kmeans_error:
			writer.writerow([i, v])
	print "kmeans completed"
	
        r_data = Random_sampling().sampling(data)
	s_data = kmeans.stratified_sampling(data, 4)
	
	dr = Dimension_Reduction()
	r_pca = dr.pca_reduction(r_data)
	s_pca = dr.pca_reduction(s_data)
	print "sampling completed"
	with open('data/r_pca.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['axis', 'variance'])
		for i,v in enumerate(r_pca.explained_variance_):
			writer.writerow([i+1, round(v,4)])
	
	with open('data/s_pca.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['axis', 'variance'])
		for i,v in enumerate(s_pca.explained_variance_):
			writer.writerow([i+1, round(v,4)])
	print "pca completed"
	
	r_3attr = dr.get_top_3_pca_loading_attr(r_pca.components_[:3], r_data[0])
	s_3attr = dr.get_top_3_pca_loading_attr(s_pca.components_[:3], s_data[0])
	r_3keys = []
	s_3keys = []
	
        with open('data/r_sp.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['attr', 'value'])
		for k,v in r_3attr[:]:
			r_3keys.append(k)
			writer.writerow([k, round(v,6)])
		
	print ""
	with open('data/s_sp.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['attr', 'value'])
		for k,v in s_3attr[:]:
			s_3keys.append(k)
			writer.writerow([k, round(v,6)])
	
        
        xx_data = []
        for d in r_data[1:]:
            x_row = []
            for a in d:
                x_row.append(int(a))
            xx_data.append(x_row)
        r_data = xx_data
	xx_data = []
        for d in s_data[1:]:
            x_row = []
            for a in d:
                x_row.append(int(a))
            xx_data.append(x_row)
        s_data = xx_data
	

        tr_data = r_pca.transform(r_data[:])
	ts_data = s_pca.transform(s_data[:])
	
	with open('data/tr_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['Component 1', 'Component 2'])
		for d in tr_data:
			writer.writerow([d[0], d[1]])
	
	with open('data/ts_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['Component 1', 'Component 2'])
		for d in ts_data:
			writer.writerow([d[0], d[1]])
	
	
	mr_data = MDS().fit_transform(tr_data[:2500])
	with open('data/mr_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['Component 1', 'Component 2'])
		for d in mr_data:
			#print d
			writer.writerow([d[0], d[1]])
	
	ms_data = MDS().fit_transform(ts_data[1:2500])
	with open('data/ms_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['Component 1', 'Component 2'])
		for d in ms_data:
			#print d
			writer.writerow([d[0], d[1]])
	
	correlation_dist = metrics.pairwise_distances(tr_data[:2500], metric = "correlation")
	mrc_data = MDS(dissimilarity='precomputed').fit_transform(correlation_dist)
	with open('data/mrc_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['Component 1', 'Component 2'])
		for d in mrc_data:
			#print d
			writer.writerow([d[0], d[1]])
	
	correlation_dist = metrics.pairwise_distances(ts_data[:2500], metric = "correlation")
	msc_data = MDS(dissimilarity='precomputed').fit_transform(correlation_dist)
	with open('data/msc_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(['Component 1', 'Component 2'])
		for d in msc_data:
			#print d
			writer.writerow([d[0], d[1]])
	
	with open('data/r_3attr_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		index = []
		for key in r_3keys[:3]:
			index.append(r_data[0].index(key))
		writer.writerow(r_3keys[:3])
		for d in tr_data[:]:
			#writer.writerow([round(d[index[0]],4), round(d[index[1]],4), round(d[index[2]],4)])
			writer.writerow([d[index[0]], d[index[1]], d[index[2]]])
		
	with open('data/s_3attr_data.csv', 'wb') as csvfile:
		writer = csv.writer(csvfile)
		index = []
		for key in s_3keys[:3]:
			index.append(s_data[0].index(key))
		writer.writerow(s_3keys[:3])
		for d in ts_data[:]:
			#writer.writerow([round(d[index[0]],4), round(d[index[1]],4), round(d[index[2]],4)])
			writer.writerow([d[index[0]], d[index[1]], d[index[2]]])
