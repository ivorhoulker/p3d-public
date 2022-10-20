# Walkthrough for server manual setup in case I forget

Random AWS debugging before SSH worked: [https://stackoverflow.com/a/54015876/7616447]

```
ssh -i Ivor-MacPro-HK.pem admin@(server_ip)
ssh admin@(server_domain) # if .pem is on mac keychain and dns etc. is already set, then use this

sudo apt-get install nginx
sudo apt-get install certbot
apt-get install python3-certbot-nginx

```

Set custom DNS servers on domain registrar. Set route53 on aws (A record for domain, CNAME for www.) [https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-ec2-instance.html] [https://aws.amazon.com/premiumsupport/knowledge-center/route-53-redirect-to-another-domain/]
Set accept incoming connections from ports for SSH, HTTP, HTTPS on AWS security
Set access from 0.0.0.0/0 on aws.

```
sudo nano /etc/nginx/sites-available/default
```

Set it but don't specify 433 listen or ssl_certs etc. (commented out below) before running certbot, it will add them; just set server name and the 301.

```
server {
    server_name          www.(server_domain);
    return 301 $scheme://(server_domain)$request_uri;


    #listen 443 ssl; # managed by Certbot
    #ssl_certificate /etc/letsencrypt/live/(server_domain)/fullchain.pem; # managed by Certbot
    #ssl_certificate_key /etc/letsencrypt/live/(server_domain)/privkey.pem; # managed by Certbot
    #include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    #ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {

    server_name (server_domain);

    location / {
        # check http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        proxy_read_timeout 360s;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://127.0.0.1:8090;
    }

    #listen 443 ssl; # managed by Certbot
    #ssl_certificate /etc/letsencrypt/live/(server_domain)/fullchain.pem; # managed by Certbot
    #ssl_certificate_key /etc/letsencrypt/live/(server_domain)/privkey.pem; # managed by Certbot
    #include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    #ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
```

```
sudo nginx -s reload
sudo certbot --nginx -d (server_domain) -d www.(server_domain)
sudo certbot renew --dry-run #check it will renew automatically
```

```
sudo ufw allow "Nginx HTTPS"
sudo ufw allow "OpenSSH"
sudo ufw allow "SSH"
sudo ufw allow "Nginx HTTP"
```

```
sudo nano /lib/systemd/system/pocketbase.service
```

Assuming you installed pocketbase in ~/app:

```
[Unit]
Description=pocketbase

[Service]
Type=simple
User=admin
LimitNOFILE=4096
Restart=always
RestartSec=5s
StandardOutput=append:/home/admin/app/logs/errors.log
StandardError=append:/home/admin/app/logs/errors.log
ExecStart=/home/admin/app/pocketbase serve

[Install]
WantedBy=multi-user.target
```

Start it and check it works:

```
systemctl enable pocketbase.service
sudo systemctl start pocketbase
systemctl list-units --type=service
```
