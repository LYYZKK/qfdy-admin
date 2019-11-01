FROM 192.168.2.2/library/nginx:1.17.4
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
