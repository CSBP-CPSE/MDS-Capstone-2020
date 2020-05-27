# LTC CLUSTERING ----
######################

# packages ----
suppressPackageStartupMessages(library('dplyr'))
suppressPackageStartupMessages(library('tidyverse'))
suppressPackageStartupMessages(library('mclust'))
suppressPackageStartupMessages(library('factoextra'))
suppressPackageStartupMessages(library('cluster'))
suppressPackageStartupMessages(library('ggplot2'))
suppressPackageStartupMessages(library('dendextend'))


# load and clean ----
ltc <- read.csv('../data/df_LTCdata_for_stats_FINAL.csv')

ltc <- ltc[,-c(1,2, 19, 24:27)]

subset(ltc, ltc$Confirmed.Resident.Cases == "<5")$Confirmed.Resident.Cases 

colSums(is.na(ltc))


# Gowers Distance ----
ltc_clust <- daisy(ltc, metric = "gower")

# HClust ----
# complete - 2 groups with 2 main subgroups
LTCcomp <- hclust(ltc_clust, method = "complete", main = "Complete Linkage")
plot(LTCcomp)

# single - chaining
LTCsing <- hclust(ltc_clust, method = "single", main = "Single Linkage")
plot(LTCsing)

# average - 2 outliers, 2 main groups
LTCavg <- hclust(ltc_clust, method = "average", main = "Average Linkage")
plot(LTCavg)


# 2 clusters according to previous plot ----
LTC <- mutate(ltc, cluster = cutree(LTCcomp, k = 2)) 
count(LTC, cluster)

# VIS: cluster groups ----
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 2)), 
             main = "Cluster Plot k = 2 - Agglomerative Complete Hierarchical Clustering")


# 4 clusters according to previous plot ----
LTC <- mutate(ltc, cluster = cutree(LTCcomp, k = 4)) 
count(LTC, cluster)

# VIS: cluster groups ----
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 4)), 
             main = "Cluster Plot k = 4 - Agglomerative Complete Hierarchical Clustering")


# 5 clusters according to previous plot ----
LTC <- mutate(ltc, cluster = cutree(LTCcomp, k = 5)) 
count(LTC, cluster)

# VIS: cluster groups ----
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 5)), 
             main = "Cluster Plot k = 5 - Agglomerative Complete Hierarchical Clustering")


