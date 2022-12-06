<h1>Creating Self-Signed SSL Certificate</h1>

To create a new Self-Signed SSL Certificate, use the `openssl req` command:

```bash
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out example.crt \
            -keyout example.key
            
# Output
Generating a RSA private key
......................................................................++++
........++++
writing new private key to 'example.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----

Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:Alabama
Locality Name (eg, city) []:Montgomery
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Linuxize
Organizational Unit Name (eg, section) []:Marketing
Common Name (e.g. server FQDN or YOUR name) []:linuxize.com
Email Address []:hello@linuxize.com
```

Let's breakdown the command and understand what each option means:

- `newkey rsa:4096` - Creates a new certificate request and 4096 bit RSA key. The default one is 2048 bits.
- `x509` - Creates a X.509 Certificate.
- `sha256` - Use 265-bit SHA (Secure Hash Algorithm).
- `days 3650` - The number of days to certify the certificate for. 3650 is ten years. You can use any positive integer.
- `nodes` - Creates a key without a passphrase.
- `out example.crt` - Specifies the filename to write the newly created certificate to. You can specify any file name.
- `keyout example.key` - Specifies the filename to write the newly created private key to. You can specify any file name.

For more information about the openssl req command options, 
visit the [OpenSSL req documentation page](https://www.openssl.org/docs/man1.0.2/man1/openssl-req.html).

Once you hit Enter, the command will generate the private key and ask you a series of questions. 
The information you provided is used to generate the certificate.

Once you hit Enter, the command will generate the private key and ask you a series of questions. 
The information you provided is used to generate the certificate.

The certificate and private key will be created at the specified location. Use the ls command to 
verify that the files were created:

That’s it! You have generated a new self-signed SSL certificate.

It is always a good idea to back up your new certificate and key to external storage.

<h2>Creating Self-Signed SSL Certificate without Prompt</h2>

If you want to generate a self-signed SSL certificate without being prompted for any question 
use the -subj option and specify all the subject information:


```bash
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out example.crt \
            -keyout example.key \
            -subj "/C=SI/ST=Ljubljana/L=Ljubljana/O=Security/OU=IT Department/CN=www.example.com"

# Output
Generating a RSA private key
......................................................................++++
........++++
writing new private key to 'example.key'
-----
```

The fields, specified in -subj line are listed below:

- C= - Country name. The two-letter ISO abbreviation.
- ST= - State or Province name.
- L= - Locality Name. The name of the city where you are located.
- O= - The full name of your organization.
- OU= - Organizational Unit.
- CN= - The fully qualified domain name.

<h2>Generate Self-Signed SSL Certificate for Development</h2>

Anyone can make their own certificates without help from a CA. The only difference is that certificates you make yourself won’t be trusted by anyone else. For local development, that’s fine.

The simplest way to generate a private key and self-signed certificate for localhost is with this openssl command:

```bash
openssl req -x509 \
            -out localhost.crt \
            -keyout localhost.key \
            -newkey rsa:2048 \
            -nodes -sha256 \
            -subj '/CN=localhost' \
            -extensions EXT -config <( \
            printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
You can then configure your local web server with localhost.crt and `localhost.key`, and install `localhost.crt` 
in your list of locally trusted roots.

If you want a little more realism in your development certificates, you can use 
[minica](https://github.com/jsha/minica) to generate your own local root certificate, and 
issue end-entity (aka leaf) certificates signed by it. You would then import the root 
certificate rather than a self-signed end-entity certificate.

You can also choose to use a domain with dots in it, like `www.localhost`, by adding it 
to `/etc/hosts` as an alias to `127.0.0.1`. This subtly changes how browsers handle cookie storage.

<h2>Creating Self-Signed SSL Certificate from config file</h2>

To generate a self-signed cert, do the following:

```bash
openssl req -config example.req \
            -new -nodes \
            -x509 \
            -newkey rsa:2048 \
            -sha256 \
            -keyout example.key \
            -out example.cert \
            -days 3650
```

Where `example.req` is:

```text
[ req ]
default_bits        = 2048
default_keyfile     = example.key
distinguished_name  = subject
req_extensions      = req_ext
x509_extensions     = x509_ext
string_mask         = utf8only
prompt              = no

[ subject ]
countryName         = AU
stateOrProvinceName = NSW
localityName        = Sydney
organizationName    = Pivotal
commonName          = example.com
emailAddress        = admin@example.com

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

[ alternate_names ]
DNS.1 = example.com
DNS.2 = *.example.com
```

Then to combine things to get a `.pem`:

```bash
cat example.key example.cert > example.pem
```

Then to extract the public key for use in validation:

```bash
openssl x509 -pubkey -noout -in example.pem > example.pub
```


<h3>Conclusion</h3>

We have generate a self-signed SSL certificate using the openssl tool. We have provided several alternatives 
to generate a SSL certificate for managed or unmanaged use cases. Now that you have the certificate, you 
can configure your application to use it.


