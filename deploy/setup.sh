#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_PROVISION="$SCRIPT_DIR/compose.provision.yaml"

register_provider_and_wait() {
  local ns=$1
  local max_attempts=60
  local attempt=0
  echo "==> Ensuring resource provider is registered: $ns"
  az provider register --namespace "$ns" --output none
  local state
  echo "    Waiting for $ns to reach Registered (can take a few minutes)..."
  while (( attempt < max_attempts )); do
    state=$(az provider show --namespace "$ns" --query registrationState --output tsv 2>/dev/null || echo "Unknown")
    if [[ "$state" == "Registered" ]]; then
      echo "    $ns: Registered"
      return 0
    fi
    echo "    $ns: $state — waiting 10s..."
    sleep 10
    attempt=$((attempt + 1))
  done
  echo "ERROR: Timed out after ~10 minutes waiting for $ns. Check subscription permissions (register resource providers) or run:" >&2
  echo "  az provider register --namespace $ns" >&2
  exit 1
}

register_provider_and_wait Microsoft.ContainerRegistry
register_provider_and_wait Microsoft.App
register_provider_and_wait Microsoft.OperationalInsights

RESOURCE_GROUP="${RESOURCE_GROUP:-innovate-test-rg}"
LOCATION="${LOCATION:-eastus}"
ACR_NAME="${ACR_NAME:-innovatetestacr}"
WORKSPACE_NAME="${WORKSPACE_NAME:-innovate-test-logs}"
CONTAINER_APPS_ENV="${CONTAINER_APPS_ENV:-innovate-test-env}"
SERVER_APP_NAME="${SERVER_APP_NAME:-server}"
WEB_APP_NAME="${WEB_APP_NAME:-web}"

echo "==> Creating resource group: $RESOURCE_GROUP in $LOCATION"
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none

echo "==> Creating Azure Container Registry: $ACR_NAME"
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true \
  --output none

echo "==> Creating Log Analytics workspace: $WORKSPACE_NAME"
az monitor log-analytics workspace create \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$WORKSPACE_NAME" \
  --output none

WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$WORKSPACE_NAME" \
  --query customerId \
  --output tsv)

WORKSPACE_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$WORKSPACE_NAME" \
  --query primarySharedKey \
  --output tsv)

echo "==> Creating Container Apps environment: $CONTAINER_APPS_ENV"
az containerapp env create \
  --name "$CONTAINER_APPS_ENV" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --logs-workspace-id "$WORKSPACE_ID" \
  --logs-workspace-key "$WORKSPACE_KEY" \
  --output none

echo "==> Logging into ACR to push placeholder image"
az acr login --name "$ACR_NAME"

docker pull mcr.microsoft.com/azuredocs/containerapps-helloworld:latest
docker tag mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  "${ACR_NAME}.azurecr.io/server:placeholder"
docker tag mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  "${ACR_NAME}.azurecr.io/web:placeholder"
docker push "${ACR_NAME}.azurecr.io/server:placeholder"
docker push "${ACR_NAME}.azurecr.io/web:placeholder"

echo "==> Provisioning Container Apps via deploy/compose.provision.yaml"
ACR_USER=$(az acr credential show --name "$ACR_NAME" --query username --output tsv)
ACR_PASS=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" --output tsv)

ACR_NAME="$ACR_NAME" TAG="placeholder" \
  DATABASE_URL="placeholder" \
  BETTER_AUTH_SECRET="placeholder-secret-at-least-32-chars-long" \
  BETTER_AUTH_URL="https://placeholder.example.com" \
  CORS_ORIGIN="https://placeholder.example.com" \
  GEMINI_API_KEY="placeholder" \
az containerapp compose create \
  --compose-file-path "$COMPOSE_PROVISION" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINER_APPS_ENV" \
  --registry-server "${ACR_NAME}.azurecr.io" \
  --registry-username "$ACR_USER" \
  --registry-password "$ACR_PASS" \
  --output none

echo "==> Enabling external ingress on both apps"
az containerapp ingress enable \
  --name "$SERVER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --type external \
  --target-port 3000 \
  --transport http \
  --output none

az containerapp ingress enable \
  --name "$WEB_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --type external \
  --target-port 3001 \
  --transport http \
  --output none

SERVER_FQDN=$(az containerapp show \
  --name "$SERVER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" \
  --output tsv)

WEB_FQDN=$(az containerapp show \
  --name "$WEB_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" \
  --output tsv)

ACR_LOGIN_SERVER=$(az acr show \
  --name "$ACR_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query loginServer \
  --output tsv)

SUBSCRIPTION_ID=$(az account show --query id --output tsv)

echo ""
echo "==> Creating OIDC service principal for GitHub Actions"
echo "    (replace <YOUR_GITHUB_ORG>/<YOUR_REPO> below if prompted)"
read -rp "    GitHub repo (format: org/repo): " GITHUB_REPO

APP_ID=$(az ad app list --display-name "github-innovate-test" --query "[0].appId" --output tsv)
if [[ -z "$APP_ID" || "$APP_ID" == "null" ]]; then
  APP_ID=$(az ad app create \
    --display-name "github-innovate-test" \
    --query appId \
    --output tsv)
fi

SP_ID=$(az ad sp list --filter "appId eq '$APP_ID'" --query "[0].id" --output tsv)
if [[ -z "$SP_ID" || "$SP_ID" == "null" ]]; then
  SP_ID=$(az ad sp create --id "$APP_ID" --query id --output tsv)
fi

az role assignment create \
  --role Contributor \
  --scope "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}" \
  --assignee "$SP_ID" \
  --output none 2>/dev/null || true

az role assignment create \
  --role AcrPush \
  --scope "$(az acr show --name "$ACR_NAME" --query id --output tsv)" \
  --assignee "$SP_ID" \
  --output none 2>/dev/null || true

FED_CRED_ID=$(az ad app federated-credential list --id "$APP_ID" --query "[?name=='github-main'].id | [0]" --output tsv 2>/dev/null || true)
if [[ -n "$FED_CRED_ID" && "$FED_CRED_ID" != "null" ]]; then
  az ad app federated-credential delete --id "$APP_ID" --federated-credential-id "$FED_CRED_ID" --output none
fi
az ad app federated-credential create \
  --id "$APP_ID" \
  --parameters "{
    \"name\": \"github-main\",
    \"issuer\": \"https://token.actions.githubusercontent.com/\",
    \"subject\": \"repo:${GITHUB_REPO}:ref:refs/heads/main\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
  }" \
  --output none

TENANT_ID=$(az account show --query tenantId --output tsv)

cat <<EOF

════════════════════════════════════════════════════════════════════
  Setup complete. Add GitHub Actions secrets via the UI or gh CLI (run locally).
════════════════════════════════════════════════════════════════════

  Values (UI or paste into gh):

  AZURE_CLIENT_ID        = ${APP_ID}   (App registration Application ID, not Object ID)
  AZURE_TENANT_ID        = ${TENANT_ID}
  AZURE_SUBSCRIPTION_ID  = ${SUBSCRIPTION_ID}
  AZURE_RESOURCE_GROUP   = ${RESOURCE_GROUP}
  AZURE_LOCATION         = ${LOCATION}
  ACR_NAME               = ${ACR_NAME}
  CONTAINER_APPS_ENV     = ${CONTAINER_APPS_ENV}
  SERVER_APP_NAME        = ${SERVER_APP_NAME}
  WEB_APP_NAME           = ${WEB_APP_NAME}

  DATABASE_URL           = <production postgres URL>
  BETTER_AUTH_SECRET     = <32+ characters>
  GEMINI_API_KEY         = <Gemini API key>

  OIDC federated credential subject (Entra must match exactly):
    repo:${GITHUB_REPO}:ref:refs/heads/main

  Deployed URLs:
    Server: https://${SERVER_FQDN}
    Web:    https://${WEB_FQDN}

  gh CLI (run after: gh auth login -h github.com):

    printf '%s' "${APP_ID}" | gh secret set AZURE_CLIENT_ID --repo "${GITHUB_REPO}"
    printf '%s' "${TENANT_ID}" | gh secret set AZURE_TENANT_ID --repo "${GITHUB_REPO}"
    printf '%s' "${SUBSCRIPTION_ID}" | gh secret set AZURE_SUBSCRIPTION_ID --repo "${GITHUB_REPO}"
    printf '%s' "${RESOURCE_GROUP}" | gh secret set AZURE_RESOURCE_GROUP --repo "${GITHUB_REPO}"
    printf '%s' "${LOCATION}" | gh secret set AZURE_LOCATION --repo "${GITHUB_REPO}"
    printf '%s' "${ACR_NAME}" | gh secret set ACR_NAME --repo "${GITHUB_REPO}"
    printf '%s' "${CONTAINER_APPS_ENV}" | gh secret set CONTAINER_APPS_ENV --repo "${GITHUB_REPO}"
    printf '%s' "${SERVER_APP_NAME}" | gh secret set SERVER_APP_NAME --repo "${GITHUB_REPO}"
    printf '%s' "${WEB_APP_NAME}" | gh secret set WEB_APP_NAME --repo "${GITHUB_REPO}"

    gh secret set DATABASE_URL --repo "${GITHUB_REPO}"
    gh secret set BETTER_AUTH_SECRET --repo "${GITHUB_REPO}"
    gh secret set GEMINI_API_KEY --repo "${GITHUB_REPO}"

  Push to main to run the deploy workflow.
════════════════════════════════════════════════════════════════════
EOF
