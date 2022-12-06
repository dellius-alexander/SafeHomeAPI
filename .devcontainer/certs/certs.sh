#!/usr/bin/env bash
#/**
# *    Copyright 2022 Dellius Alexander
# *
# *    Licensed under the Apache License, Version 2.0 (the "License");
# *    you may not use this file except in compliance with the License.
# *    You may obtain a copy of the License at
# *
# *        http://www.apache.org/licenses/LICENSE-2.0
# *
# *    Unless required by applicable law or agreed to in writing, software
# *    distributed under the License is distributed on an "AS IS" BASIS,
# *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# *    See the License for the specific language governing permissions and
# *    limitations under the License.
# */
########################################################################
# create a dot directory certs in root of project for key generation
# ./certs/
#       example.req   // config file
#       example.key   // private key file
#       example.crt   // certificate file
#       example.pem   // fullchain
#       example.pub   // public key file
########################################################################

HOSTNAME="";
EXAMPLE_REQ="";
DOMAIN_NAME="";
DOMAIN="";
EXAMPLE_REQ="";
CONFIG_FILE="";

option="${1}"

case ${option} in
  -f | --file)
    echo "Entry is a file."
    HOSTNAME=$(cat ${2} | grep -v '#' | cut -d'=' -f2 )
    if [[ -z "${HOSTNAME}" ]]; then
      echo "Configuration file error: hostname/commonname not defined."
      exit 1
    fi;
    DOMAIN=$(echo ${HOSTNAME} | cut -d'.' -f1)
    DOMAIN_NAME="${HOSTNAME}"
    EXAMPLE_REQ=$( find ${PWD} -type f -iname "${DOMAIN}.req" &2>/dev/null)
    echo "Hostname: $HOSTNAME"
    ;;
  -s | --string)
    echo "String domain/hostname provided: ${2}"
    HOSTNAME="${2}"
    if [[ -z "${HOSTNAME}" ]]; then
      echo "Configuration file error: missing second input parameter [ /bin/bash ${0} -s <input value> ]."
      exit 1
    fi;
    DOMAIN=$(echo ${HOSTNAME} | cut -d'.' -f1)
    DOMAIN_NAME="${HOSTNAME}"
    EXAMPLE_REQ=$( find ${PWD} -type f -iname "${DOMAIN}.req" &2>/dev/null)
    echo "Hostname: $HOSTNAME"
    ;;
  -d | --default) # invoke default hostname for development use
    echo "Defaluting to example.com hostname..."
    HOSTNAME="example.com"
    DOMAIN=$(echo ${HOSTNAME} | cut -d'.' -f1)
    DOMAIN_NAME="${HOSTNAME}"
    EXAMPLE_REQ=$( find ${PWD} -type f -iname "${DOMAIN}.req" &2>/dev/null)
    echo "Hostname: $HOSTNAME"
    ;;
  -c | --config)
    echo "Configuration file found."
    HOSTNAME=$(cat "${2}" | grep -i 'COMMONNAME' | awk '/=/ {print $3}')
    if [[ -z "${HOSTNAME}" ]]; then
      echo "Configuration file error: hostname/commonname not defined"
      exit 1
    fi;
    DOMAIN=$(echo ${HOSTNAME} | cut -d'.' -f1)
    DOMAIN_NAME="${HOSTNAME} "
    EXAMPLE_REQ=$( find ${PWD} -type f -iname "${DOMAIN}.req" &2>/dev/null)
    echo "Configuration file location: $EXAMPLE_REQ"
    echo "Hostname: $HOSTNAME"
    ;;
  * | -h | --help)
    # default behavior
    echo """
    HELP DOCS:
    Usage:
    /bin/bash ${0} [ -f file | -s string | -d  | -h | -c ]
      Options:
        -f | --file: passing a file containing the hostname.
        -s | --string: passing a string containing the hostname.
        -d | --default: default hostname used is example.com, no second paramater should be entered.
        -c | --config: config file to be used in certificate generation.
                       If no config file is provided one will be created from hostname.
        -h | --help: this help message.
    """
    exit 1
    ;;
esac


SERVERKEYFILE="${DOMAIN}.key";
CERTIFICATE_FILE="${DOMAIN}.crt";
FULL_CHAIN="${DOMAIN}.pem";
PUBLIC_KEY_FILE="${DOMAIN}.pub";
CERTS_DIR="${PWD}/.certs";
LEAF="";

# get certificate directory
__get_cert_dir() {
  # check for the config file example.req
  if [ ! -f "${EXAMPLE_REQ}" ] || [ ! -d "${CERTS_DIR}" ]; then
    __generate_config
  else
    EXAMPLE_REQ=$( find ${PWD} -type f -iname "${EXAMPLE_REQ}" &2>/dev/null )
  fi;

  # terminate script if config file not found
  if [ -z "${EXAMPLE_REQ}" ]; then
    echo "Config file [\"${DOMAIN}.req\"] not found"
    echo "Generating new config file for \"${DOMAIN_NAME}\""
    # find or create the .certs directory
    CERTS_DIR=$( find ${PWD} -type d -iname '.certs' &2>/dev/null )
    # now generate the config file
    __generate_config
    # checking for config file creation

#    exit 1
  else
    # get the path depth count
    LEAF=$(($(echo "$EXAMPLE_REQ" | tr "/" "\n"  | wc -l) - 1))

    # get the absolute path of cert directory
    CERTS_DIR=$(echo "${EXAMPLE_REQ}" | cut -d'/' -f-"${LEAF}" )
  fi;

}

# generate random config file
__generate_config() {
  #  CERTS_DIR="${PWD}/.certs"
    CERTS_DIR=$(find ${PWD} -type d -iname '.certs' &2>/dev/null)
    # exit if no .certs directory
    if [ -z "${CERTS_DIR}" ]; then
      echo "Unable to locate \".certs directory\"."
      echo "Creating new certificate directory at: \"${PWD}/.certs\""
      mkdir -p "${PWD}/.certs"
      CERTS_DIR=$(find ${PWD} -type d -iname '.certs' &2>/dev/null)
      __generate_config
    fi;

    echo "Generating config file for: ${HOSTNAME} @ ${CERTS_DIR}/${DOMAIN}.req" &&
    # else generate new config file with defined domain name
  rm -rf ${CERTS_DIR} && mkdir -p ${CERTS_DIR} &&
  cat > "${CERTS_DIR}/${DOMAIN}.req" <<EOF
  [ req ]
  default_bits        = 2048
  default_keyfile     = ${DOMAIN}.key
  distinguished_name  = subject
  req_extensions      = req_ext
  x509_extensions     = x509_ext
  string_mask         = utf8only
  prompt              = no

  [ subject ]
  countryName         = US
  stateOrProvinceName = GA
  localityName        = Atlanta
  organizationName    = Hyfi Solutions
  commonName          = ${DOMAIN_NAME}
  emailAddress        = admin@${DOMAIN_NAME}

  # Section x509_ext is used when generating a self-signed certificate.
  [ x509_ext ]
  subjectKeyIdentifier    = hash
  authorityKeyIdentifier  = keyid,issuer
  basicConstraints        = CA:FALSE
  keyUsage                = digitalSignature, keyEncipherment
  subjectAltName          = @alternate_names
  nsComment               = "OpenSSL Generated Certificate"
  extendedKeyUsage        = serverAuth, clientAuth

  # Section req_ext is used when generating a certificate signing request.
  [ req_ext ]
  subjectKeyIdentifier = hash
  basicConstraints     = CA:FALSE
  keyUsage             = digitalSignature, keyEncipherment
  subjectAltName       = @alternate_names
  nsComment            = "OpenSSL Generated Certificate"
  extendedKeyUsage     = serverAuth, clientAuth

  # add additional DNS options for the server hostname lookup
  [ alternate_names ]
  DNS.1 = ${DOMAIN_NAME}
  DNS.2 = www.${DOMAIN_NAME}
  DNS.3 = https://${DOMAIN_NAME}
  DNS.4 = https://www.${DOMAIN_NAME}
  DNS.5 = *.${DOMAIN_NAME}
EOF

EXAMPLE_REQ=$( find ${PWD} -type f -iname "${DOMAIN}.req")
cnt=0
while [ ! -f "${EXAMPLE_REQ}" ]; do
    echo "Waiting for config file creation..." &&
    sleep 2 &&
    cnt=$((cnt + 1))
    if [ "${cnt}" -gt 3 ]; then
      echo "Config file not found..." &&
      break
    fi
    #__get_cert_dir # recurse the process tree looking for config file
done;
}

# generate the certificate for the defined DNS domain namespace
__generate_cert(){
  echo "Config file generated at: ${EXAMPLE_REQ}" &&

  if [ -f "${EXAMPLE_REQ}" ]; then
    # create the certs key file
    openssl req -config "${EXAMPLE_REQ}" \
                -new -nodes \
                -x509 \
                -newkey rsa:2048 \
                -sha256 \
                -keyout "${CERTS_DIR}/${SERVERKEYFILE}" \
                -out "${CERTS_DIR}/${CERTIFICATE_FILE}" \
                -days 3650 &2>/dev/null &&
    sleep 2 &&
    wait $!
  fi
  #Then to combine things to get a .pem fullchain file:
  cat "${CERTS_DIR}/${SERVERKEYFILE}" "${CERTS_DIR}/${CERTIFICATE_FILE}" > "${CERTS_DIR}/${FULL_CHAIN}" &2>/dev/null &&
  wait $!

  #Then to extract the public key for use in validation:
  openssl x509 -pubkey -noout -in "${CERTS_DIR}/${FULL_CHAIN}" > "${CERTS_DIR}/${PUBLIC_KEY_FILE}" &2>/dev/null &&
  wait $!

}

# main method
__main() {
  __get_cert_dir &&
  __generate_cert

}

# run main and log stderr and stdout to logfile
__main


