#################################
## COVID PHU-LEVEL PCA ----
#################################
# packages ----
library('dplyr')
library('tidyverse')

# read and clean data ----
phu <- read.csv('../data/PMD-en/PHU_FINAL_prop.csv')
phu <- phu[,-c(1,2)]

# percent comorbidities clean ----
percents <- c('copd.percent', 'asthma.percent', 'smokers.percent', 'hbp.percent')
phu[,percents] <- lapply(phu[,percents], function(x) as.numeric(gsub("[\\%,]", "", x))/100)

# convert missing transit data to 0 ----
# (ASSUMPTION: there is no public transit in the corresponding PHU)
phu$prox_idx_transit[is.na(phu$prox_idx_transit)] <- 0

# numerical comorbidities clean ----
#como_num <- c('copd', 'asthma', 'smokers', 'hbd', 'census')
#phu[como_num] <- lapply(phu[como_num], function(x) as.numeric(gsub("[,]", "", x)))

# PHU cols for pca ----
keep <- c('Location', 'asthma.percent', 'copd.percent', 'hbp.percent', 'smokers.percent', 
         'FEMALEprop', 'MALEprop', 'TRANSGENDERprop','OTHERprop',
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

###########    
# PCA ----
###########
# assess zero-variance columns 
which(apply(phu_prop, 2, var)==0)

lapply(phu_prop[,2:length(phu_prop)], function(x) var(x))

# adjust scale by multiplying by 1000
scaledUP <- as.data.frame(lapply(phu_prop[,2:length(phu_prop)], function(x) x*1000))

# drop cols with no var 
# (NONE)
phu_prop2 <- scaledUP[, which(apply(scaledUP, 2, var) != 0)]
colnames(phu_prop2)

# pca - columns removed with little var ---
phu_pca <- prcomp(phu_prop2[,-1], scale.=TRUE)
summary(phu_pca)

# preserve 92.5% variation
phu_pca$rotation[,1:4]

# plot
plot(phu_pca, type="lines")

biplot(phu_pca)


## TO INVESTIGATE:
# how to deal with variables that have significantly small variances,
# especially relative to other variables



############################
# Supervised Clustering ---
############################
clustering <- cbind(phu_num, phu$TOTAL)
phu_clust <- hclust(dist(clustering$`phu$TOTAL`)) # clustering by TOTAL
plot(phu_clust)

# assuming 3 groups (although number 2 may be an outlier)
cgroups <- cutree(phu_clust,3)
phu[cgroups == 2, 1:2] # Toronto  # NOTE: only grab important cols from PCA

phu[cgroups == 1, 1:2] # dense areas

phu[cgroups == 3, 1:2] # everywhere else in ON

# TO INVESTIGATE:
# which col is reasonable to cluster by - maybe unsupervised clust is better 
# which cols are important to observe (noted by PCA results)
# CONVERT numbers to proportions for PHUs

############################
# Unsupervised Clustering ----
# EM Model
############################
install.packages('EMCluster')
library('EMCluster')

emobj <- init.EM()
emcluster(phu_num[, 3:length(phu_num)], emobj = NULL, pi = NULL, Mu = NULL, LTSigma = NULL,
          lab = NULL, EMC = .EMC, assign.class = FALSE)

##############################################
# FA for connectedness (proximity data) ----
##############################################



