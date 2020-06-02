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
ltc$outbreak <- with(ltc, ifelse(ltc$Status == "", 'no', 'yes'))

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


# Gowers Distance ----
# using 2y range
df_for_clust <- df[,-c(1,8,9,13:17, 23:27)]
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
#rownames(df_for_clust) <- rep(1:dim(df_for_clust)[1])
rownames(df_for_clust) <- df$outbreak
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



ggplot(dcl, aes(x=fct_reorder(Location,CovidCaseStrat, .desc=F), y = CovidCaseStrat, fill = factor(cluster))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "ltc", y = "Proportion of PHU with Covid Cases")


######################################
# k = 4 DIANA Cluster Analysis ----
#######################################
LTC4 <- mutate(df_for_clust, cluster =clust) 
count(LTC4, cluster)
xtabs(~outbreak+cluster, data = LTC4)
xtabs(~home.type+cluster, data = LTC4)
xtabs(~number_beds+cluster, data = LTC4)

LTC4

## MCLUST----
mfit <- Mclust(ltc_clust)
plot(mfit, what = 'classification')
summary(mfit)

mutate(df_for_clust, Cluster = mfit$classification)

## MCLUST home and beds ----
colnames(df_for_clust)
df_for_clust2 <- df_for_clust[,c(1,2,3,15)]
hb_dist <- daisy(df_for_clust2, metric = "gower")

mfit2 <- Mclust(hb_dist)
plot(mfit2, what = 'classification')
summary(mfit2)

df_for_clust2 <- mutate(df_for_clust2, Cluster = mfit2$classification)
df_for_clust2 <- mutate(df_for_clust2, Outbreak = df_for_clust$outbreak)
df_for_clust2

xtabs(~Outbreak+Cluster, data = df_for_clust2)
xtabs(~home.type+Cluster, data = df_for_clust2)
xtabs(~number_beds+Cluster, data = df_for_clust2)








## TDS clust ----
sil_width <- c(NA)
for(i in 2:8){  
  pam_fit <- pam(ltc_clust, diss = TRUE, k = i)  
  sil_width[i] <- pam_fit$silinfo$avg.width  
}
plot(1:8, sil_width,
     xlab = "Number of clusters",
     ylab = "Silhouette Width")
lines(1:8, sil_width)

# 2 has highest silhouette width - an estimate of the average distance between clusters.

k <- 2
pam_fit <- pam(ltc_clust, diss = TRUE, k)
pam_results <- df %>%
  mutate(cluster = pam_fit$clustering) %>%
  group_by(cluster) %>%
  do(the_summary = summary(.))
pam_results$the_summary


library('Rtsne')

tsne_obj <- Rtsne(ltc_clust, is_distance = TRUE)
tsne_data <- tsne_obj$Y %>%
  data.frame() %>%
  setNames(c("X", "Y")) %>%
  mutate(cluster = factor(pam_fit$clustering)) %>% 
  mutate(name = df_for_clust$cleaned_name) %>%
  mutate(home.type = df_for_clust$home.type) %>%
  mutate(LHIN = df_for_clust$LHIN) 

t <- ggplot(aes(x = X, y = Y, label = name), data = tsne_data) +
  geom_point(aes(color = cluster)) +
  geom_text(aes(label=ifelse(Y>0 & X <0 & cluster == 2,as.character(LHIN),'')),hjust=0, vjust=0)

ggplotly(t)



df_for_clust <- mutate(df_for_clust, Cluster = pam_fit$clustering)

# cluster analysis ----
# subset by cluster and extract home.type
tt <- table(subset(df_for_clust, df_for_clust$Cluster == 1)$home.type)
names(tt[tt==max(tt)])

t2 <- table(subset(df_for_clust, df_for_clust$Cluster == 2)$home.type)
names(t2[t2==max(t2)])


# subset by cluster and extract LHIN
tt <- table(subset(df_for_clust, df_for_clust$Cluster == 1)$LHIN)
names(tt[tt==max(tt)])

t2 <- table(subset(df_for_clust, df_for_clust$Cluster == 2)$LHIN)
names(t2[t2==max(t2)])


# subset by cluster and extract bednum
tt <- table(subset(df_for_clust, df_for_clust$Cluster == 1)$number_beds)
names(tt[tt==max(tt)])

t2 <- table(subset(df_for_clust, df_for_clust$Cluster == 2)$number_beds)
names(t2[t2==max(t2)])

# subset by cluster and extract outbreak
tt <- table(subset(df_for_clust, df_for_clust$Cluster == 1)$outbreak)
names(tt[tt==max(tt)])

t2 <- table(subset(df_for_clust, df_for_clust$Cluster == 2)$outbreak)
names(t2[t2==max(t2)])


# by LHIN
gg <- ggplot(df_for_clust, aes(x=fct_reorder(LHIN,Cluster, .desc=F), y = Cluster, fill =outbreak)) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "LTC", y = "LTC with Covid Outbreaks")

ggplotly(gg)

# by outbreak count
ggg <- ggplot(df_for_clust, aes(x=fct_reorder(outbreak,Cluster, .desc=F), fill =factor(Cluster))) + 
  geom_bar(stat="count")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "LTC", y = "") +
  ggtitle('LTC Clusters with Covid Outbreaks')

ggplotly(ggg)

# by home.type
gggg <- ggplot(df_for_clust, aes(x=fct_reorder(home.type,Cluster, .desc=F), fill =factor(Cluster))) + 
  geom_bar(stat="count")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "LTC", y = "") +
  ggtitle('LTC Clusters with Covid Outbreaks')

ggplotly(gggg)



# by LTC
g <- ggplot(df_for_clust, aes(x=fct_reorder(cleaned_name,Cluster, .desc=F), y = Cluster, fill = factor(outbreak))) + 
  geom_tile()  +
  theme(axis.text.x=element_blank()) +
  labs(x = "LTC", y = "LTC with Covid Outbreaks")


ggplotly(g)
