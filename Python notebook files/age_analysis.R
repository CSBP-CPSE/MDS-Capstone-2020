covid <- read.csv('../data/covid_comorbidities.csv')
ages <- covid[,c(23:31)]
ages <- t(ages)
colnames(ages) <- t(covid[,3])
ages <- cbind(age_range = rownames(ages), ages)
ages <- as.data.frame(ages)


par(mfrow=c(2,2))
g1 <- ggplot(ages[,1:2], aes(x=age_range, y = ages$`York Region Public Health Services`,fill = factor(age_range))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "Age Range", y = "Age Range of PHU Covid Cases") +
  ggtitle('York Region Public Health Services')

ggplotly(g1)

g2 <- ggplot(ages[,1:3], aes(x=age_range, y = ages$`Toronto Public Health`,fill = factor(age_range))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "Age Range", y = "Age Range of PHU Covid Cases") +
  ggtitle('Toronto Public Health')

ggplotly(g2)


g3 <- ggplot(ages[,1:3], aes(x=age_range, y = ages$`Peel Public Health`,fill = factor(age_range))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "Age Range", y = "Age Range of PHU Covid Cases") +
  ggtitle('Peel Public Health')


ggplotly(g3)

g4 <- ggplot(ages[,1:3], aes(x=age_range, y = ages$`Hamilton Public Health Services`,fill = factor(age_range))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "Age Range", y = "Age Range of PHU Covid Cases") +
  ggtitle('Hamilton Public Health Services')

ggplotly(g4)


g5 <- ggplot(ages[,1:3], aes(x=age_range, y = ages$`Algoma Public Health Unit`,fill = factor(age_range))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "Age Range", y = "Age Range of PHU Covid Cases") +
  ggtitle('Algoma Public Health Unit')

ggplotly(g5)

g6 <- ggplot(ages[,1:3], aes(x=age_range, y = ages$`Lambton Public Health`,fill = factor(age_range))) + 
  geom_bar(stat="identity")  +
  theme(axis.text.x=element_text(angle=90,hjust=1)) +
  labs(x = "Age Range", y = "Age Range of PHU Covid Cases") +
  ggtitle('Lambton Public Health')

ggplotly(g6)



