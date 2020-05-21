#################################
## COVID PHU-LEVEL PCA ----
#################################

# read and clean data ----
phu <- read.csv('../data/PMD-en/PHU_FINAL.csv')
phu <- phu[,-c(1,2)]
phu[,c(3,6,9,10)] <- lapply(phu[,c(3,6,9,10)], function(x) as.numeric(gsub("[\\%,]", "", x)))
phu[,c(4,5,7,8)] <- lapply(phu[,c(4,5,7,8)], function(x) as.numeric(gsub("[,]", "", x)))

# PHU numerical for pca ---
phu_num <- phu[,c(2,4,5,7,8,11:17, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60)]
colnames(phu_num)

# general analysis ----
# n > p
dim(phu_num) 

# set missing values to 0
colSums(is.na(phu_num))

phu_num[is.na(phu_num)] <- 0


# zero-variance columns 
which(apply(phu_num, 2, var)==0)
      
# PCA ----

# remove zero-variance columns for scaling
phu_num2 <- phu_num2[, which(apply(phu, 2, var) != 0)]
colnames(phu_num)
phu_pca <- prcomp(phu_num2[,-1], scale.=TRUE)
summary(phu_pca)

# preserve 99% variation
phu_pca$rotation[,1:4]

# plot
plot(phu_pca, type="lines")

biplot(phu_pca)

################
# Clustering ---
################


###############
# FA ----------
###############

