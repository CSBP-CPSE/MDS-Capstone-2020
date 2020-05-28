data <- read.csv('../data/QGIS_csv_files/joined_HR_to_PHU.csv')
data <- data[,c(2,7,11)]

# order alphabetically by PHU
data <- na.omit(data[order(data, decreasing = F),])

# order phu data alphabetically by PHU
phu2 <- phu[,c(18,17)]

phu2 <- na.omit(phu2[order(phu2, decreasing = F),])

  
# check that GIS PHU names are the same as phu data PHU names
merged <- cbind(data, phu2)
View(merged)

ggplot(merged, aes(x=fct_reorder(Location, TOTALprop, .desc=F), y = TOTALprop, fill = factor(ENG_LABEL_2))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "PHU", y = "Proportion of PHU with Covid Cases")

## Aggregate by region
ggplot(merged, aes(x=fct_reorder(ENG_LABEL_2,TOTALprop, .desc=F), y = TOTALprop, fill = factor(ENG_LABEL_2))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "PHU", y = "Proportion of PHU with Covid Cases")


## Adjusted labels
## Centrals merged
## Erie St. Clair to South West
## Adjusted according to https://cdn.ymaws.com/alphaweb.site-ym.com/resource/resmgr/alpha_region_map_250320.jpg
ggplot(merged, aes(x=fct_reorder(ADJ_LABEL,TOTALprop, .desc=F), y = TOTALprop, fill = factor(ADJ_LABEL))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "PHU", y = "Proportion of PHU with Covid Cases")

## Just Central
central <- subset(merged, merged$ADJ_LABEL == "Toronto" | merged$ADJ_LABEL == "Central East" |
         merged$ADJ_LABEL == "Central West")

ggplot(central, aes(x=fct_reorder(Location,TOTALprop, .desc=F), y = TOTALprop, fill = factor(ADJ_LABEL))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "PHU", y = "Proportion of PHU with Covid Cases")
