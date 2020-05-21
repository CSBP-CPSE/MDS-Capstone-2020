#################################
## COVID PHU-LEVEL PCA ----
#################################

# read and clean data ----
phu <- read.csv('../data/covid_comorbidities.csv')
phu <- phu[,-1]
phu[,c(3,6,9,10)] <- lapply(phu[,c(3,6,9,10)], function(x) as.numeric(gsub("[\\%,]", "", x)))
phu[,c(4,5,7,8)] <- lapply(phu[,c(4,5,7,8)], function(x) as.numeric(gsub("[,]", "", x)))


# general analysis ----
# n < p
dim(phu) 

# missing values
colSums(is.na(phu))

# zero-variance columns 
which(apply(phu, 2, var)==0)
      
# PCA ----

# remove zero-variance columns for scaling
phu2 <- phu[ , which(apply(phu, 2, var) != 0)]
phu_pca <- prcomp(phu2[,-c(1,2,16, 17, 18,19)], scale.=TRUE)
summary(phu_pca)

# preserve 99% variation
phu_pca$rotation[,1:5]

# plot
plot(phu_pca, type="lines")

biplot(phu_pca)

############
# mixPCA ----
############

library('PCAmixdata')
data <- phu[, -c(1,19,20,21,22)]
groups <- colnames(data)
name.groups <- levels(phu$Reporting_PHU)

MFAmix(data, groups, name.groups, ndim=5, rename.level=FALSE, graph = TRUE,
       axes = c(1, 2))

################
# Clustering ---
################

