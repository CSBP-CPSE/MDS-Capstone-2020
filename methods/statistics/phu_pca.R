#################################
## COVID PHU-LEVEL PCA ----
#################################

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
keep <- c('Reporting_PHU', 'asthma', 'copd', 'hbd', 'smokers', 
         'FEMALE', 'MALE', 'TRANSGENDER','OTHER',
         'CONTACT', 'NEITHER', 'TRAVEL.RELATED',
         'prox_idx_emp', 'prox_idx_pharma', 'prox_idx_childcare', 'prox_idx_health',
         'prox_idx_grocery', 'prox_idx_educpri', 'prox_idx_educsec', 'prox_idx_lib',
         'prox_idxx_parks', 'prox_idx_transit', 'transit_na', 'suppreessed')

phu[colnames(phu) == keep]
colnames(phu)

phu_num <- phu[colnames(phu) == keep]
colnames(phu_num)

# general analysis ----
# n > p
dim(phu_num) 

# assess missing values
colSums(is.na(phu_num))

phu_num$prox_idx_parks[is.na(phu_num$prox_idx_parks)]
phu_num$prox_idx_parks
# zero-variance columns 
which(apply(phu_num, 2, var)==0)
      
# PCA ----

# remove zero-variance columns for scaling
phu_num2 <- phu_num2[, which(apply(phu, 2, var) != 0)]
colnames(phu_num2)

# pca - columns removed with little var ---
phu_pca <- prcomp(phu_num2[,-1], scale.=TRUE)
summary(phu_pca)

# preserve 92.5% variation
phu_pca$rotation[,1:4]

# plot
plot(phu_pca, type="lines")

biplot(phu_pca)


###################



################
# Clustering ---
################


###############
# FA ----------
###############

