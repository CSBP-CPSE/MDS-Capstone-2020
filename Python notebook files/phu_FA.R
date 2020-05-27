##############################################
# FA for connectedness (proximity data) ----
# KT Hobbs
##############################################
# read and clean data ----
phu <- read.csv('../data/PMD-en/PHU_FINAL_prop.csv')
phu <- phu[,-c(1,2)]

# percent comorbidities clean ----
percents <- c('copd.percent', 'asthma.percent', 'smokers.percent', 'hbp.percent')
phu[,percents] <- lapply(phu[,percents], function(x) as.numeric(gsub("[\\%,]", "", x))/100)

# convert missing transit data to 0 ----
# (ASSUMPTION: there is no public transit in the corresponding PHU)
phu$prox_idx_transit[is.na(phu$prox_idx_transit)] <- 0

prox <- phu_prop[ , grepl( "prox" , names(phu_prop) ) ]

# correlation of prox ----
library(corrplot)
cprox <- cor(prox)
corrplot(cprox, type = "upper", method = "circle", order = "FPC",
         main = "Proximity Correlations - First Principal Component Order")

# proximity to secondary education and libraries are generally uncorrelated with the rest

# q: number of latent variables ----
p <- 36
maxq <- ((2*p+1) - sqrt(8*p-1))/2
maxq

# n > p ----
dim(prox)

# factor analysis ---
# 2 factors to identify connectedness or urban v rural?
faprox2 <- factanal(prox[,-1], 2, scores="regression")
faprox2

# we accept null hypothesis that factors are sufficient (1 factor is not, 3 is even less sig)

# varimax rotation ---- same results
factanal(prox[,-1], 2, scores="regression", rotation = 'varimax')


### DIANA hierarchical cluster ----
faclust <- diana(dist(faprox2$scores))
pltree(faclust, cex = 0.6, hang = -1, main = "Dendrogram of DIANA") 

prox2 <- mutate(prox, labels = phu$Location)
table(prox2[,11], cutree(faclust,3))


# 3 groups shows least overlap
fviz_cluster(list(data = prox2[,-11], cluster = cutree(faclust, k = 3)), 
             main = "Cluster Plot k = 3 - Divisive Hierarchical Clustering")

###################################
# FA Qs: ----
# negative loadings in terms of interpretation?
# parks having a high loading for both FACs
# making new params from FA results

# PHU Qs
# will normalizing variables mask data var?
# is it worth keeping gender variables? LASSO results show significance but effect size is small in lm.
# regularization methods for small data (n = 36, p = 24)

# PHU Clustering Qs ----
# keeping covid stats for clustering/regression or not?


