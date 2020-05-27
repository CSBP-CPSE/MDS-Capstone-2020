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

colSums(is.na(ltc))

# Add column with outbreak status
ltc$outbreak <- with(ltc, ifelse(is.na(Status), 'no', 'yes'))

# Update data types for some columns
ltc[, 'outbreak'] <- as.factor(ltc[, 'outbreak'])
ltc[, 'cleaned_name'] <- as.character(ltc[, 'cleaned_name'])

# Remove single LTC home (lennox hospital) with missing values for accreditation etc.
df <- ltc[!(is.na(ltc$accreditation)),]
skim(df)

# Create list of columns with that may not be needed for the analysis
location = c(1, 2, 8, 9, 19, 24, 25, 26, 27) # 2 represents LHIN
inspection_range = c(11, 14, 17)
inspection_count = c(10, 13, 16)
inspection_rank = c(12, 15, 18)
covid = c(20, 21, 22, 23)

# Create df using binned inspections data
binned = df[,-c(location, inspection_count, inspection_range, covid)]
skim(binned)

# # Combine categories of Municipal and Non-profit for home_type
# df$home.type[df$home.type == 'Municipal'] <- 'Non-Profit'
# df$home.type <- factor(df$home.type)

# Create df with inspections count data to be logtransformed
logtrans = df[,-c(location, inspection_range, inspection_rank, covid)]


# combine lat and lon into a predictor


# Gowers Distance ----
df_for_clust <- df[,-19]
#rownames(df_for_clust) <- df[,19]
ltc_clust <- daisy(df_for_clust, metric = "gower")


# HClust ----
# complete - clearest group division
LTCcomp <- hclust(ltc_clust, method = "complete")
plot(LTCcomp, main = "Complete Linkage")

# single - chaining
LTCsing <- hclust(ltc_clust, method = "single")
plot(LTCsing, main = "Single Linkage")

# average 
LTCavg <- hclust(ltc_clust, method = "average")
plot(LTCavg, main = "Average Linkage")


# 2 clusters according to previous plot ----
LTC <- mutate(df_for_clust, cluster = cutree(LTCcomp, k = 2)) 
count(LTC, cluster)

# VIS: 2 cluster groups ----
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 2)), 
             main = "Cluster Plot k = 2 - Agglomerative Complete Hierarchical Clustering")




# 3 clusters according to previous plot ----
LTC <- mutate(df_for_clust, cluster = cutree(LTCcomp, k = 3)) 
count(LTC, cluster)

# VIS: 3 cluster groups ----
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 3)), 
             main = "Cluster Plot k = 3 - Agglomerative Complete Hierarchical Clustering")




# 4 clusters to look at second division ----
LTC <- mutate(df_for_clust, cluster = cutree(LTCcomp, k = 4)) 
count(LTC, cluster)

# VIS: 4 cluster groups ----
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 4)), 
             main = "Cluster Plot k = 4 - Agglomerative Complete Hierarchical Clustering")

# remove rownames for clearer vis ---- poor separation
rownames(df_for_clust) <- rep(1:dim(df_for_clust)[1])
ltc_clust <- daisy(df_for_clust, metric = "gower")
fviz_cluster(list(data = ltc_clust, cluster = cutree(LTCcomp, k = 4)), 
             main = "Cluster Plot k = 4 - Agglomerative Complete Hierarchical Clustering")






paste("Aggloemeratice Coefficient: ", coef.hclust(LTCcomp))

# DIVISIVE 

dcl <- diana(ltc_clust)
pltree(dcl, cex = 0.6, hang = -1, main = "Dendrogram of DIANA")
clust <- cutree(dcl, k = 4)

# add names back on
#rownames(df_for_clust) <- df[,19]
#ltc_clust <- daisy(df_for_clust, metric = "gower")

fviz_cluster(list(data = ltc_clust, cluster = clust), 
             main = "Cluster Plot DIANA - Divisive Hierarchical Clustering")

paste("Divisive Coefficient: ", dcl$dc)

# contrasts to agglomerative k=4 - has better separation





######################################
# k = 4 DIANA Cluster Analysis ----
#######################################
LTC4 <- mutate(df_for_clust, cluster =clust) 

xtabs(~outbreak+cluster, data = LTC4)
xtabs(~home.type+cluster, data = LTC4)
barplot(xtabs(~number_beds+cluster, data = LTC4))

## Cluster lon lat STEPS:
## (1) calc distance between LTC coordinates (https://stackoverflow.com/questions/31668163/geographic-geospatial-distance-between-2-lists-of-lat-lon-points-coordinates)
## (2) 573 lab 2 MDS
## (3) colour text by cluster

library(geosphere)

# Grab lat lon data for each home
latlon <- df[,26:27]
rownames(latlon) <- df$cleaned_name

# Reorder lon lat
lonlat <- latlon[,c(2,1)]

# Calculate distance in km using Haversine
# https://stackoverflow.com/questions/32363998/function-to-calculate-geospatial-distance-between-two-points-lat-long-using-r


for (l in 1:5){
  print(paste(rownames(lonlat[l,]), "and", rownames(lonlat[l+1,])))
  print(paste(lonlat[l,], "and", lonlat[l+1,]))
  print(distm(lonlat[l,], lonlat[l+1,], fun = distVincentyEllipsoid)/1000) # convert to km
}

