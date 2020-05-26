#################################
## COVID PHU-LEVEL PCA ----
#################################
# packages ----
library('dplyr')
library('tidyverse')
library('mclust')
library('factoextra')
library('cluster')
suppressPackageStartupMessages(library('ggplot2'))
suppressPackageStartupMessages(library('dendextend'))

# read and clean data ----
phu <- read.csv('../data/PMD-en/PHU_FINAL_prop.csv')
phu <- phu[,-c(1,2)]

# percent comorbidities clean ----
percents <- c('copd.percent', 'asthma.percent', 'smokers.percent', 'hbp.percent')
phu[,percents] <- lapply(phu[,percents], function(x) as.numeric(gsub("[\\%,]", "", x))/100)

# convert missing transit data to 0 ----
# (ASSUMPTION: there is no public transit in the corresponding PHU)
phu$prox_idx_transit[is.na(phu$prox_idx_transit)] <- 0

# PHU cols for pca ----
keep <- c('Location', 'asthma.percent', 'copd.percent', 'hbp.percent', 'smokers.percent', 
         'FEMALEprop', 'MALEprop', 'TRANSGENDERprop','OTHERprop', 'UNKNOWNprop',
         'CONTACTprop', 'NEITHERprop', 'TRAVEL.RELATEDprop',
         'prox_idx_emp', 'prox_idx_pharma', 'prox_idx_childcare', 'prox_idx_health',
         'prox_idx_grocery', 'prox_idx_educpri', 'prox_idx_educsec', 'prox_idx_lib',
         'prox_idx_parks', 'prox_idx_transit')

phu_prop <- subset(phu, select = keep)

colnames(phu_prop)

# general analysis ----
# n > p
dim(phu_prop)

# assess missing values
colSums(is.na(phu_prop))
any(is.na(phu_prop))

############################
# Hierarchical Clustering ----
# Agglomerative: every obs  ----
# starts as single cluster
############################
#assign names phu df
rownames(phu_prop) <- phu_prop$Location

#scale
phu_prop_sc <- scale(phu_prop[,-1])

#euc distance between each home is ok because all var are quantitative
phu_dist <- dist(phu_prop_sc)
phu_dist

#clust
comp <- hclust(phu_dist, method = "complete")
av <- hclust(phu_dist, method = "average")
sing <- hclust(phu_dist, method = 'single')

par(mfrow=c(2,2))
plot(comp, main = "Complete Linkage") # best, suggests 3 groups
plot(av, main = "Average Linkage") # chaining
plot(sing, main = "Single Linkage") # chaining


# comp clust better visualization ----
comp_dend <- as.dendrogram(comp)
comp_col_dend <- color_branches(comp_dend, h = 3)
plot(comp_col_dend, main = "Complete Linkage")

#######################################
# analysis: count of group members (8) ----

# 8 clusters according to previous plot ----
phu_cl <- mutate(phu_prop, cluster = cutree(comp, k = 8)) 
count(phu_cl,cluster)

# VIS: cluster groups ----
fviz_cluster(list(data = phu_cl[,-1], cluster = cutree(comp, k = 8)), 
             main = "Cluster Plot k = 8 - Agglomerative Complete Hierarchical Clustering")

# add back TOTAL col
phu_cl <- mutate(phu_cl, CovidCaseProp = phu$TOTALprop) 

# VIS: bar plot ---- 
ggplot(phu_cl, aes(x=Location, y = CovidCaseProp, fill = factor(cluster))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) 

#######################################
# analysis: count of group members (3) ----
# 3 clusters according to previous plot
phu_cl <- mutate(phu_prop, cluster = cutree(comp, k = 3)) 
count(phu_cl,cluster)

# VIS: cluster groups ----
# add back TOTAL col
phu_cl <- mutate(phu_cl, CovidCaseProp = phu$TOTALprop) 

fviz_cluster(list(data = phu_cl[,-1], cluster = cutree(comp, k = 3)), 
             main = "Cluster Plot k = 3 - Agglomerative Complete Hierarchical Clustering")

# VIS: bar plots ----
ggplot(phu_cl, aes(x=Location, y = CovidCaseProp, fill = factor(cluster))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) 


############################
# Hierarchical Clustering ----
# Divisive: ALL obs  ----
# starts as single cluster
############################
hc <- diana(phu_dist)

# divisive coefficient on a 0-1 scale ----
# The extent to which the hierarchical structure produced by a dendrogram actually 
# represents the data 
hc$dc

par(mfrow=c(2,1))
pltree(hc, cex = 0.6, hang = -1, main = "Dendrogram of DIANA")
clust <- cutree(hc, k = 4)
fviz_cluster(list(data = phu_dist, cluster = clust), main = "Cluster Plot DIANA - Divisive Hierarchical Clustering")


############################
# Combinatorial Clustering ----
# EM Model ----
############################

# EM by all params ----
mphu <-Mclust(phu_prop, G=1:3)
plot(mphu, what="classification")

# EM by total cases ----
mcovid <- Mclust(phu[,c(17,18)], G=1:3)
plot(mcovid, what="classification")

# EM view clasess ----
classes <- mutate(as.data.frame(mcovid$classification), loc = phu$Location[mcovid$data[,2]])
colnames(classes)[1] <- 'class'
classes <- classes[order(classes),][1:36,]

###########################
# Mixture Model Clustering----
# VIS: MDS Scaling ----
############################
labels(phu_dist)
plot(cmdscale(phu_dist)[,1], cmdscale(phu_dist)[,2], type = "n", 
     xlab = "", ylab = "", 
     asp = 1, axes = FALSE, 
     main = "MDS Results on phu_dist")
text(cmdscale(phu_dist)[,1], cmdscale(phu_dist)[,2], rownames(cmdscale(phu_dist)), cex = 0.6)


###########################
# Mode Seekers Clustering----
# PRIM
############################

###################################
# TO ASK----
# keeping covid stats for clustering/regression or not?
# making new params from FA 