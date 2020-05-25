#################################
## COVID PHU-LEVEL PCA ----
#################################
# packages ----
library('dplyr')
library('tidyverse')

# read and clean data ----
phu <- read.csv('../data/PMD-en/PHU_FINAL.csv')
phu <- phu[,-c(1,2)]

# percent comorbidities clean ----
percents <- c('copd.percent', 'asthma.percent', 'smokers.percent', 'hbd.percent')
phu[,percents] <- lapply(phu[,percents], function(x) as.numeric(gsub("[\\%,]", "", x)))

# numerical comorbidities clean ----
como_num <- c('copd', 'asthma', 'smokers', 'hbd')
phu[como_num] <- lapply(phu[como_num], function(x) as.numeric(gsub("[,]", "", x)))

# PHU numerical for pca ----
keep <- c('Reporting_PHU', '^asthma$', '^copd$', '^hbd$', '^smokers$', 
         'FEMALE', 'MALE', 'TRANSGENDER','OTHER',
         'CONTACT', 'NEITHER', 'TRAVEL.RELATED',
         'prox_idx_emp', 'prox_idx_pharma', 'prox_idx_childcare', 'prox_idx_health',
         'prox_idx_grocery', 'prox_idx_educpri', 'prox_idx_educsec', 'prox_idx_lib',
         'prox_idxx_parks', 'prox_idx_transit', 'transit_na', 'suppressed')


phu_num <- phu %>% 
              select(matches(keep))


colnames(phu_num)

# general analysis ----
# n > p
dim(phu_num) 

# assess missing values
colSums(is.na(phu_num))

###########    
# PCA ----
###########
# assess zero-variance columns 
which(apply(phu_num, 2, var)==0)

lapply(phu_num[,3:length(phu_num)], function(x) var(x))

# adjust scale of proximity measures or other columns


#phu_num2 <- phu_num2[, which(apply(phu, 2, var) != 0)]
#colnames(phu_num2)

# pca - columns removed with little var ---
phu_pca <- prcomp(phu_num2[,-1], scale.=TRUE)
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



