# Deploying to kubernetes
This directory contains the base yaml files for deploying the application to a kubernetes platform.

## Prerequisites
To use and further develop these files you need to have some basic understanding of kubernetes and an account to deploy to a public cloud kubernetes service. The instructions I will be describing here are using the IBM Cloud Kubernetes service.
1. Register for an account with IBM Cloud and create a Kubernetes cluster. You could follow the instructions [here](https://www.ibm.com/cloud/container-service/)
2. [Install the IBM Cloud CLI](https://cloud.ibm.com/docs/cli#step1-install-idt)
3. [Install the IBM Cloud Kubernetes Plugin](https://cloud.ibm.com/docs/containers?topic=containers-cs_cli_install#cs_cli_install_steps)
4. [Install the Kuberentes CLI](https://cloud.ibm.com/docs/containers?topic=containers-cs_cli_install#kubectl)
5. [Configure IBM Cloud CLI to use kubectl](https://cloud.ibm.com/docs/containers?topic=containers-cs_cli_install#cs_cli_configure)

## Deploy to IBM Cloud
1. Setup your cluster in IBM cloud with the correct amount of worker nodes you deem necessary depending on the type of deployment you wish to make
2. Fill in the necessary credentials in the yaml files with kind **Secret** using *kubectl apply -f secret-creds.yml*
3. Deploy the required services to expose the applications on the Kubernetes cluster using *kubectl apply -f backend-service.yml*
4. Deploy the app itself using *kubectl apply -f backend-deployment.yml*
**NOTES:** To deploy the Rest API application it is necessary to have a postgresql database instance already running and the appropriate credentials filled out on the secrets to connect to it otherwise the application will not work correctly.
