const functions = require('firebase-functions');
const config = functions.config();

module.exports = {
  // Strange namespace bc GCP's environmental token standards
  serviceAccount: {
    "type": config.account.type,
    "project_id": config.project.id,
    "private_key_id": config.private_key.id,
    "private_key": config.private.key.replace(/\\n/g, '\n'),
    "client_email": config.client.email,
    "client_id": config.client.id,
    "auth_uri": config.auth.uri,
    "token_uri": config.token.uri,
    "auth_provider_x509_cert_url": config.auth.provider_x509_cert_url,
    "client_x509_cert_url": config.client.x509_cert_url
  }
};
