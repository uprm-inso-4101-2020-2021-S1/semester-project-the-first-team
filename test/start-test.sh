#!/usr/bin/env bash
# Assume we use health checks and all the other containers we depend on are up and running
# Pre tests variables
RED='\033[0;31m'
NC='\033[0m'
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
[ -d /output ] || mkdir /output
[ -d /output/reports ] || mkdir /output/reports
# Test the backend
echo -e "${PURPLE}*********************\n${PURPLE}*********************\n${PURPLE}******    Testing the backend    ******\n${PURPLE}*********************\n${PURPLE}*********************${NC}"
sleep 1s
java -cp /usr/share/tag/tester.jar:/usr/share/tag/libs/* org.testng.TestNG -testclass express.cucumber.runners.RestAPITestRunner
if [ $? -ne 0 ]
then
    echo -e "${RED}REST test failed.${NC}"
    mv /target/report.html /output/reports/REST-Api-report.html
    exit 1
else
    echo -e "${GREEN}REST test passed.${NC}"
    mv /target/report.html /output/reports/REST-Api-report.html
fi

# Minor sleep. Not actually necessary
sleep 2s

# Test the  UI
echo -e "${PURPLE}*********************\n${PURPLE}*********************\n${PURPLE}******    Testing the frontend    ******\n${PURPLE}*********************\n${PURPLE}*********************${NC}"
# No tests defined yet. Change to frontend runner when defined
# java -cp /usr/share/tag/tester.jar:/usr/share/tag/libs/* org.testng.TestNG -testclass express.cucumber.runners.RestAPITestRunner
echo -e "${PURPLE}\nNo UI tests ran.${NC}"
exit 0