# Sendmail Client

For more information visit [Sendmail](https://docs.oracle.com/en/operating-systems/oracle-linux/6/admin/configure-sendmail.html)
### Configuration files
The main configuration file for Sendmail is /etc/mail/sendmail.cf, 
which is not intended to be manually edited. Instead, make any 
configuration changes in the /etc/mail/sendmail.mc file.


## Configuring a Sendmail Client

A Sendmail client sends outbound mail to another SMTP server, which is typically 
administered by an ISP or the IT department of an organization, and this server 
then relays the email to its destination.

To configure a Sendmail client:

1. If the account on the SMTP server requires authentication:
   1. Create an `auth` directory under `/etc/mail` that is accessible only to root:

       ```bash
       $ mkdir /etc/mail/auth
       $ chmod 700 /etc/mail/auth
       ```
   2. In the auth directory, create a file `smtp-auth` that contains the authentication information for the SMTP server, for example:

       ```bash
       $ echo 'AuthInfo:smtp.isp.com: "U:username" "P:password"' > /etc/mail/auth/smtp-auth
       ```
       where `smtp.isp.com` is the FQDN of the SMTP server, and `username` and `password` are 
       the name and password of the account.

    3. Create the database file from `smtp-auth`, and make both files read-writable only by `root`:

       ```bash
       $ cd /etc/mail/auth
       $ makemap hash smtp-auth < smtp-auth
       $ chmod 600 smtp-auth smtp-auth.db
       ```
       
   2. Edit `/etc/mail/sendmail.mc`, and change the following line:

      ```bash 
      # dnl define('SMART_host', 'smtp.your.provider')dnl
      ```
      
       to read:

      ```bash
      # define('SMART_host', 'smtp.isp.com')dnl
      ```
      
      where `smtp.isp.com` is the FQDN of the SMTP server. For example if you have a gmail account 
      the reference would look like `smtp.gmail.com`.

3. If the account on the SMTP server requires authentication, add the 
   following lines after the line that defines `SMART_host`:

    ```bash
   # define('RELAY_MAILER_ARGS', 'TCP $h port')dnl
   # define('confAUTH_MECHANISMS', 'EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   # FEATURE('authinfo','hash /etc/mail/auth/smtp-auth.db')dnl
   # define(`confAUTH_OPTIONS', `A p y')dnl
   ```
   
   where port is the port number used by the SMTP server (for example, 587 for SMARTTLS or 465 for SSL/TLS).

4. Edit `/etc/sysconfig/sendmail` and set the value of `DAEMON` to `no`:

   ```bash
   # DAEMON=no
   ```

    This entry disables `sendmail` from listening on port 25 for incoming email.

5. Restart the `sendmail` service:

   ```bash
   $ service sendmail restart  
   ```
   
   To test the configuration, send email to an account in another domain.
   Another meaning your email address is `your_email@mydomain.com` and the 
   other domain is `someone_else_emailaddress@anotherdomain.com`.

This configuration does not receive or relay incoming email. You can use a client application to receive email via POP or IMAP.

Sendmail Configuration Log:
```bash
#    Configure sendmail with the existing /etc/mail/sendmail.conf? [Y] y
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Writing configuration to /etc/mail/sendmail.conf.
#    Writing /etc/cron.d/sendmail.
#    Configure sendmail with the existing /etc/mail/sendmail.mc? [Y] y
#    Updating sendmail environment ...
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Writing configuration to /etc/mail/sendmail.conf.
#    Writing /etc/cron.d/sendmail.
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Writing configuration to /etc/mail/sendmail.conf.
#    Writing /etc/cron.d/sendmail.
#    Could not open /etc/mail/databases(No such file or directory), creating it.
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Creating /etc/mail/databases...
#    
#    Checking filesystem, this may take some time - it will not hang!
#      ...   Done.
#     
#    Checking for installed MDAs...
#    sasl2-bin not installed, not configuring sendmail support.
#    
#    To enable sendmail SASL2 support at a later date, invoke "/usr/share/sendmail/update_auth"
#    
#     
#    Creating/Updating SSL(for TLS) information
#    Creating /etc/mail/tls/starttls.m4...
#    You already have sendmail certificates
#     
#    
#    *** *** *** WARNING *** WARNING *** WARNING *** WARNING *** *** ***
#    
#    Everything you need to support STARTTLS (encrypted mail transmission
#    and user authentication via certificates) is installed and configured
#    but is *NOT* being used.
#    
#    To enable sendmail to use STARTTLS, you need to:
#    1) Add this line to /etc/mail/sendmail.mc and optionally
#       to /etc/mail/submit.mc:
#      include('/etc/mail/tls/starttls.m4')dnl
#    2) Run sendmailconfig
#    3) Restart sendmail
#    
#    Checking {sendmail,submit}.mc and related databases...
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Creating /etc/mail/databases...
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Creating /etc/mail/databases...
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Creating /etc/mail/Makefile...
#    Reading configuration from /etc/mail/sendmail.conf.
#    Validating configuration.
#    Writing configuration to /etc/mail/sendmail.conf.
#    Writing /etc/cron.d/sendmail.
#    Disabling HOST statistics file(/var/lib/sendmail/host_status).
#    Creating /etc/mail/sendmail.cf...
#    Creating /etc/mail/submit.cf...
#    Informational: confCR_FILE file empty: /etc/mail/relay-domains
#    Informational: confCT_FILE file empty: /etc/mail/trusted-users
#    Updating /etc/mail/access...
#    Informational: ALIAS_FILE file empty: /etc/mail/aliases
#    Updating /etc/mail/aliases...
#    /etc/mail/aliases: 0 aliases, longest 0 bytes, 0 bytes total
#    Reload the running sendmail now with the new configuration? [Y] y
#    Reloading sendmail ...

```
